import * as YUP from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const { email } = req.body;

      if (!email) throw new Error('Email not provided!');

      const userExists = await User.findOne({ where: { email: email } });
      if (userExists) throw 'Usuário já cadastrado!';

      const schema = YUP.object().shape({
        name: YUP.string().required(),
        email: YUP.string()
          .email()
          .required(),
        password: YUP.string()
          .required()
          .min(6),
      });

      if (!(await schema.isValid(req.body))) throw 'Validation fails!';

      const { id, name, provider } = await User.create(req.body);
      return res.json({ id, email, name, provider });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async update(req, res) {
    try {
      const schema = YUP.object().shape({
        name: YUP.string().required(),
        email: YUP.string()
          .email()
          .required(),
        oldPassword: YUP.string().min(6),
        password: YUP.string()
          .min(6)
          .when('oldPassword', (oldPassword, field) => {
            oldPassword ? field.required() : field;
          }),
      });

      if (!(await schema.isValid(req.body))) throw 'Validation fails!';

      const user = await User.findByPk(req.userId);
      if (!user) throw 'User not found!';

      const { email, oldpassword: oldPassword, password } = req.body;
      if (
        email &&
        email != user.email &&
        (await User.findOne({ where: { email } }))
      )
        throw 'User already existis';

      if (oldPassword && !(await user.checkPassword(oldPassword)))
        throw 'Password does not match';

      const { id, name, provider } = await user.update(req.body);

      return res.status(200).json({
        id,
        name,
        email,
        provider,
      });
    } catch (error) {
      return res.status(401).json({ error: error });
    }
  }
}

export default new UserController();
