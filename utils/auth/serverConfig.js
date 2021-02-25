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
