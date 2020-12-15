import * as admin from 'firebase-admin';
import adminKey from 'fire-admin-config-key.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(adminKey),
    });
  } catch (e) {
    console.error('Error initializing Firebase Admin: ', e);
  }
}

// idToken comes from the client app
const getUserId = async idToken => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (e) {
    console.error(error);
  }
};

export { getUserId };