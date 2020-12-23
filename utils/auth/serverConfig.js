import * as admin from 'firebase-admin';
console.log(typeof process.env.ADMIN_KEY, process.env.ADMIN_KEY);
console.log(
  typeof JSON.parse(process.env.ADMIN_KEY),
  '\n',
  JSON.parse(process.env.ADMIN_KEY)
);
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.ADMIN_KEY)),
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
