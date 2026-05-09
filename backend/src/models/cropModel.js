const FirestoreModel = require('./firestoreModel');

module.exports = new FirestoreModel('crops', {
  idField: 'species'
});
