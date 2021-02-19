import * as jwt from 'jsonwebtoken';

function generateToken(user) {
  const data = {
    email: user.email,
  };
  const signature = 'MySuP3R_z3kr3t';
  const expiration = '6h';

  return jwt.sign({ data }, signature, { expiresIn: expiration });
}

export { generateToken };
