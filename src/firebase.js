import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyDaCI2LVYp93DT6badlOL_ilfYbD8J-erQ",
  authDomain: "apiko-3691e.firebaseapp.com",
  databaseURL: "https://apiko-3691e.firebaseio.com",
  projectId: "apiko-3691e",
  storageBucket: "apiko-3691e.appspot.com",
  messagingSenderId: "173950883147",
  appId: "1:173950883147:web:8ec768dbbb9bb02c4ec4ce",
  measurementId: "G-2BFVS79672"
};
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
// const usersCollection = db.collection('users')
const catalogCollection = db.collection('catalog')
const favoritesCollection = db.collection('favorites')

// export utils/refs
export {
  db,
  auth,
  // usersCollection,
  catalogCollection,
  favoritesCollection
}