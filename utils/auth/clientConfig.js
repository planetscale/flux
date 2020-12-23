import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIRE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIRE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIRE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIRE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIRE_APP_ID,
};

const googleProvider = new firebase.auth.GoogleAuthProvider();
console.log(firebaseConfig);
console.log(process.env);

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (e) {
    console.error('Error initializing Firebase: ', e);
  }
}

const loginWithFirebase = async () => {
  return firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      return firebase.auth().signInWithPopup(googleProvider);
    })
    .catch(e => {
      console.error(e);
    });
};

const logoutWithFirebase = () => {
  return firebase.auth().signOut();
};

const setFireAuthObserver = (noUserCallback, hasUserCallback) => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      noUserCallback?.();
    } else {
      hasUserCallback?.(user);
    }
  });
};

export { loginWithFirebase, logoutWithFirebase, setFireAuthObserver };
