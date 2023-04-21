// const firebase = require('@firebase/rules-unit-testing');
// const admin = require('firebase-admin');
// const { clearFirestoreData } = require('firebase-functions-test/lib/providers/firestore');
// const clear = require(clearFirestoreData);
// const loadFirestoreRules = require('./firestore.rules');


// const projectId = "wheel-call-you";
// process.env.GCLOUD_PROJECT = projectId;
// process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

// const app = admin.initializeApp({ projectId });
// const db = app.firestore();

// beforeAll(async () => {
//   await firebase.loadFirestoreRules({
//     projectId,
//     rules: `
//       rules_version = '2';
//       service cloud.firestore {
//         match /databases/{database}/documents {
//           match /users/{userId} {
//             allow create: if request.auth.token.email.matches(".*@fit.nyc.edu");
//           }
//         }
//       }`,
//   });
// });

// beforeEach(async () => {
//   await firebase.clear({ projectId });
//   const ref = db.collection('TestDoc').doc('testDocId');
//   await ref.set({ field1: 'value1', field2: 'value2' });
// });

// afterAll(async () => {
//   await Promise.all([firebase.clearFirestoreData({ projectId }), app.delete()]);
// });

// async function testEmailDomain(email, expectedOutcome) {
//   try {
//     const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, 'password');

//     if (expectedOutcome === 'rejected') {
//       throw new Error(`User with email "${email}" was unexpectedly created`);
//     }

//     await userCredential.user.delete();
//   } catch (error) {
//     if (expectedOutcome === 'resolved') {
//       fail(`User with email "${email}" was not created: ${error}`);
//     }
//   }
// }

// describe('Email domain validation', () => {
//   it('should allow a valid email domain', async () => {
//     await testEmailDomain('user@fit.nyc.edu', 'resolved');
//   });

//   it('should reject an invalid email domain', async () => {
//     await testEmailDomain('user@gmail.com', 'rejected');
//   });
// });


