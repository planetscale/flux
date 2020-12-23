import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIRE_ADMIN_KEY)),
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
    console.error(e);
  }
};

export { getUserId };
