const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const memberPath = "members/{member}";
const auditPath = "audit";

exports.auditTrailCreate = functions.firestore.document(memberPath)
  .onCreate((change, context) => {
    console.log("Insert (change.data()): " + JSON.stringify(change.data()));
    let time = admin.firestore.FieldValue.serverTimestamp();
    return admin.firestore().collection(auditPath).add({
      type: 'i', member: change.data(), insertTime: time
    });
  });

exports.auditTrailDelete = functions.firestore.document(memberPath)
  .onDelete((change, context) => {
    console.log("Delete (change.data()): " + JSON.stringify(change.data()));
    let time = admin.firestore.FieldValue.serverTimestamp();
    return admin.firestore().collection(auditPath).add({
      type: 'd', member: change.data(), insertTime: time
    });
  });

exports.auditTrailUpdate = functions.firestore.document(memberPath)
  .onUpdate((change, context) => {
    console.log("Update (before.data()): " + JSON.stringify(change.before.data()));
    console.log("Update (after.data()): " + JSON.stringify(change.after.data()));
    let time = admin.firestore.FieldValue.serverTimestamp();
    return admin.firestore().collection(auditPath).add({
      type: 'u',
      member: change.before.data(),
      newValues: change.after.data(),
      insertTime: time
    });
  });
