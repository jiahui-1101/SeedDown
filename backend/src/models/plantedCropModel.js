const FirestoreModel = require('./firestoreModel');

module.exports = new FirestoreModel('plantedCrops', {
  defaults: () => ({
    userId: 'default-user',
    quantity: 1,
    plantedDate: new Date(),
    status: 'growing'
  })
});
