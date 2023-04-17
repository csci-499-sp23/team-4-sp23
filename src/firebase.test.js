// // const render = require('@testing-library/react')
// // const screen = require('@testing-library/react')
// // const firebase = require('@testing-library/react')
// // const admin = require('firebase-admin');

// // const { render, screen } = require('@testing-library/react');
// // const firebase = require('firebase/app');
// // require('firebase/auth');
// // const admin = require('firebase-admin');

// const { render, screen, fireEvent } = require('@testing-library/react');
// const firebase = require('firebase');
// require('firebase/auth');
// const admin = require('firebase-admin');
// const { fail } = require('@testing-library/jest-dom');



// const firebaseConfig = {

// }
// //var firebase = require('firebase/app');
// firebase.initializeApp(firebaseConfig);


// async function testEmailDomain(email, expectedOutcome) {
//     try {
//       const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, 'password');
  
//       if (expectedOutcome === 'rejected') {
//         throw new Error(`User with email "${email}" was unexpectedly created`);

//         //fail(`User with email "${email}" was unexpectedly created`);
//       }
  
//       await userCredential.user.delete();
//     } catch (error) {
//       if (expectedOutcome === 'resolved') {
//         fail(`User with email "${email}" was not created: ${error}`);
//       }
//     }
//   }
  
//   describe('Email domain validation',() => {
//     beforeEach(() =>{

//     });

//     afterEach(() => {

//     });

//     it('should allow a valid email domain',async()=>{
//         await testEmailDomain('user@fit.nyc.edu','resolved');
//     });

//   });