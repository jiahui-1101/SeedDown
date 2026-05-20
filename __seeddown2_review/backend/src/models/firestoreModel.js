const { getDb } = require('../config/db');

function toDateIfTimestamp(value) {
  if (value && typeof value.toDate === 'function') return value.toDate();
  if (Array.isArray(value)) return value.map(toDateIfTimestamp);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, toDateIfTimestamp(item)])
    );
  }
  return value;
}

function toPlainDoc(doc) {
  const data = toDateIfTimestamp(doc.data() || {});
  return { _id: doc.id, id: doc.id, ...data };
}

function matchesValue(value, condition) {
  if (condition && typeof condition === 'object' && condition.$regex) {
    const regex = new RegExp(condition.$regex, condition.$options || '');
    if (Array.isArray(value)) return value.some((item) => regex.test(String(item)));
    return regex.test(String(value || ''));
  }

  return value === condition;
}

function matchesQuery(row, query = {}) {
  return Object.entries(query).every(([key, condition]) => {
    if (key === '_id' || key === 'id') return row._id === condition || row.id === condition;
    return matchesValue(row[key], condition);
  });
}

function applyUpdate(row, update) {
  return update && update.$set ? { ...row, ...update.$set } : { ...row, ...update };
}

class QueryBuilder {
  constructor(model, query = {}, single = false) {
    this.model = model;
    this.query = query;
    this.single = single;
    this.sortSpec = null;
    this.limitCount = null;
  }

  sort(sortSpec) {
    this.sortSpec = sortSpec;
    return this;
  }

  limit(limitCount) {
    this.limitCount = limitCount;
    return this;
  }

  async lean() {
    let rows = await this.model._all();

    rows = rows.filter((row) => matchesQuery(row, this.query));

    if (this.sortSpec) {
      const [[field, direction]] = Object.entries(this.sortSpec);
      rows.sort((a, b) => {
        const left = a[field] instanceof Date ? a[field].getTime() : a[field];
        const right = b[field] instanceof Date ? b[field].getTime() : b[field];
        if (left === right) return 0;
        return left > right ? direction : -direction;
      });
    }

    if (this.limitCount !== null) rows = rows.slice(0, this.limitCount);

    return this.single ? rows[0] || null : rows;
  }

  then(resolve, reject) {
    return this.lean().then(resolve, reject);
  }
}

class UpdateBuilder {
  constructor(promise) {
    this.promise = promise;
  }

  lean() {
    return this.promise;
  }

  then(resolve, reject) {
    return this.promise.then(resolve, reject);
  }
}

class FirestoreModel {
  constructor(collectionName, options = {}) {
    this.collectionName = collectionName;
    this.options = options;
    this.db = { readyState: 1 };
  }

  collection() {
    return getDb().collection(this.collectionName);
  }

  defaults(data = {}) {
    const defaults =
      typeof this.options.defaults === 'function'
        ? this.options.defaults(data)
        : this.options.defaults || {};

    return { ...defaults, ...data };
  }

  docIdFor(data) {
    const idField = this.options.idField;
    return idField && data[idField] ? String(data[idField]) : null;
  }

  async _all() {
    const snapshot = await this.collection().get();
    return snapshot.docs.map(toPlainDoc);
  }

  find(query = {}) {
    return new QueryBuilder(this, query, false);
  }

  findOne(query = {}) {
    return new QueryBuilder(this, query, true);
  }

  async create(data) {
    const payload = this.defaults(data);
    const docId = this.docIdFor(payload);

    if (docId) {
      await this.collection().doc(docId).set(payload, { merge: true });
      return { _id: docId, id: docId, ...payload };
    }

    const ref = await this.collection().add(payload);
    return { _id: ref.id, id: ref.id, ...payload };
  }

  async insertMany(items = []) {
    const batch = getDb().batch();

    items.forEach((item) => {
      const payload = this.defaults(item);
      const docId = this.docIdFor(payload);
      const ref = docId ? this.collection().doc(docId) : this.collection().doc();
      batch.set(ref, payload, { merge: true });
    });

    await batch.commit();
    return items;
  }

  async deleteMany(query = {}) {
    const rows = await this.find(query).lean();
    const batch = getDb().batch();

    rows.forEach((row) => {
      batch.delete(this.collection().doc(row._id));
    });

    await batch.commit();
    return { deletedCount: rows.length };
  }

  findOneAndUpdate(query = {}, update = {}, options = {}) {
    const promise = (async () => {
      const existing = await this.findOne(query).lean();
      const next = applyUpdate(existing || query, update);
      const payload = this.defaults(next);
      const docId = existing?._id || this.docIdFor(payload);

      if (!existing && !options.upsert) return null;

      const ref = docId ? this.collection().doc(docId) : this.collection().doc();
      await ref.set(payload, { merge: true });

      const saved = await ref.get();
      return toPlainDoc(saved);
    })();

    return new UpdateBuilder(promise);
  }
}

module.exports = FirestoreModel;
