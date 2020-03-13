import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { id, name, email } = req.user;
    return res.status(200).json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async checkIfUserNotExist(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) throw new Error('Email not provided!');

      const userFound = await User.findOne({ where: { email } });
      if (!userFound) throw 'User not found!';

      req.user = userFound;

      return next();
    } catch (error) {
      return res.status(401).json(error);
    }
  }

  async checkIfUserPasswordIsCorrect(req, res, next) {
    try {
      const { user } = req;
      const { password } = req.body;

      if (!user) throw new Error('User does not exists!');
      if (!password) throw new Error('Password not provided!');

      if (user && !(await user.checkPassword(password)))
        throw new Error('User password is incorrect!');

      return next();
    } catch (error) {
      return res.status(401).json({ error: error.message || error });
    }
  }
}
export default new SessionController();
