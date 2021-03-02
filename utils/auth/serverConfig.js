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
const decodeToken = async idToken => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (e) {
    console.error(e);
    throw Error(e);
  }
};

export { decodeToken };
