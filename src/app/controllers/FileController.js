import File from '../models/File';

class FileController {
  async store(req, res) {
    try {
      const { originalname: name, filename: path } = req.file;

      const file = await File.create({ name, path });

      return res.status(200).json(file);
    } catch (error) {
      return res.status(401).json({ message: error.message || error });
    }
  }
}
export default new FileController();
