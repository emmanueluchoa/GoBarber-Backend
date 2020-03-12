import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../config/auth';

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw 'Token not provided.';

    const [, token] = authHeader.split(' ');
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: error.message ? error.message : error });
  }
};
