import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    try {
      const providers = await User.findAll({
        where: { provider: true },
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [
          { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
        ],
      });

      return res.status(200).json(providers);
    } catch (error) {
      return res.status(401).json({ message: error.message || error });
    }
  }
}

export default new ProviderController();
