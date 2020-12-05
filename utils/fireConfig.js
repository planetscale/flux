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

const initFirebase = () => {
  if (!firebase.apps.length) {
    try {
      firebase.initializeApp(firebaseConfig);
    } catch (e) {
      console.error('Error initializing Firebase: ', e);
    }
  }
};

const loginWithFirebase = () => {
  return firebase
    .auth()
    .signInWithPopup(googleProvider)
    .then(res => {
      console.log('login res: ', res);
      console.log(firebase.auth().currentUser);
    })
    .catch(e => {
      console.error(e);
    });
};

export { initFirebase, loginWithFirebase };
