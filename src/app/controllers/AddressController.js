// app/controllers/AddressController.js
import Address from "../models/Address";
import User from "../models/User";

class AddressController {
  async store(request, response) {
    try {
      const { street } = request.body;
      const userId = request.userId; // Certifique-se de que o middleware authMiddleware defina corretamente o usuário aqui
     
      const user = await User.findByPk(userId);
      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado" });
      }

      const newAddress = await Address.create({
        street: street,
        user_id: userId,
      });

      return response.json(newAddress);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Falha ao criar endereço" });
    }
  }

  // Outros métodos do controlador de endereços, se houver...
}

export default new AddressController();
