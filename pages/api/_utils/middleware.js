import { createConnection } from './connection';
import Cors from 'cors';
import { decodeToken } from 'utils/auth/serverConfig';

const cors = (req, res) =>
  Cors(req, res, {
    methods: ['GET', 'POST', 'HEAD'],
  });

// Only set `fetchUserId` to true if you need the user's id as it incurs an additional db request.
const validateUser = async (req, fetchUserId = false) => {
  const authHeader = req.headers.authorization;
  let token = '';
  let decodedToken = '';

  if (authHeader?.startsWith('Bearer ')) {
    const tokenArray = authHeader.split(' ');
    // extract the JWT, tokenArray[0] is 'Bearer '
    token = tokenArray[1];

    try {
      decodedToken = await decodeToken(token);
      if (
        Boolean(decodedToken.uid) &&
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
  }
  throw Error;
};

const getUserId = async userEmail => {
  const connection = await createConnection();
  const query = 'SELECT id FROM User WHERE email = ?';
  const [[row]] = await connection.execute(query, [userEmail]);
  connection.close();
  return row.id;
};

export { cors, validateUser, getUserId };
