import { createConnection } from './connection';
import Cors from 'cors';
import jwt from 'next-auth/jwt';

const cors = (req, res) =>
  Cors(req, res, {
    methods: ['GET', 'POST', 'HEAD'],
  });

// Only set `fetchUserId` to true if you need the user's id as it incurs an additional db request.
const validateUser = async (req, fetchUserId = false) => {
  try {
    // TODO: move secret to env var
    const decodedToken = await jwt.getToken({
      req,
      secret: process.env.JWT_SECRET,
    });
    console.log(decodedToken);
    if (
      Boolean(
        decodedToken.email.match(
          new RegExp(process.env.NEXT_PUBLIC_ALLOWED_EMAIL_REGEX)
        )
      )
    ) {
      const user = {
        email: decodedToken.email,
      };
      if (fetchUserId) {
        try {
          const userId = await getUserId(decodedToken.email);
          user.id = userId;
        } catch (e) {
          throw e;
        }
      }
      return user;
    }
    throw Error;
  } catch (e) {
    throw e;
  }
};

const getUserId = async userEmail => {
  const connection = await createConnection();
  const query = 'SELECT id FROM User WHERE email = ?';
  const [[row]] = await connection.execute(query, [userEmail]);
  connection.close();
  return row.id;
};

function runMiddleware(req, res, fn, params) {
  return new Promise((resolve, reject) => {
    fn(
      req,
      res,
      result => {
        if (result instanceof Error) {
          return reject(result);
        }

        return resolve(result);
      },
      params
    );
  });
}

export { cors, validateUser, getUserId, runMiddleware };
