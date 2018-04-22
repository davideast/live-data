import * as firebase from 'firebase-admin';
const serviceAccount = require('../sa.json');

export const firebaseApp = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://ticket-fire.firebaseio.com"
});

export const firestoreId = () => 
  firebase.firestore().collection('_').doc().id;

export const firestore = firebaseApp.firestore();
export const restaurantsRef = firestore.collection('restaurants');
export const restaurantsIndexRef = firestore.collection('restaurantsIndex');