import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { id, name, email } = res.locals.user;
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
      const userFound = await User.findOne({ where: { email: email } });
      if (!userFound) throw 'User not found!';

      res.locals.user = userFound;

      next();
    } catch (error) {
      return res.status(401).json(error);
    }
  }

  async checkIfUserPasswordIsCorrect(req, res, next) {
    try {
      const { user } = res.locals;
      const { password } = req.body;
      if (user && !(await user.checkPassword(password)))
        return res.status(401).json('User password is incorrect!');

      next();
    } catch (error) {
      return res.status(400).json('Internal server error!');
    }
  }
}
export default new SessionController();
