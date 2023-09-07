import { v4 } from 'uuid'
import * as Yup from 'yup'
import User from '../models/User'
import Address from '../models/Address' // Importe o modelo Address

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = request.body;

    const userExists = await User.findOne({
      where: { email: email },
    });

    if (userExists) {
      return response.status(409).json({ error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      admin,
    });

    return response.status(201).json({ name, email, admin });
  }

  async show(request, response) {
    const { userId } = request;

    try {
      const user = await User.findByPk(userId, {
        include: {
          model: Address, // Inclua o modelo Address para trazer os endereços do usuário
          as: 'addresses', // Alias para os endereços do usuário
          attributes: ['id', 'street'], // Defina os atributos desejados do endereço
        },
        attributes: ['id', 'name', 'email', 'admin'], // Defina os atributos desejados do usuário
      });

      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      return response.json(user);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Failed to fetch user data' });
    }
  }
}

export default new UserController();
