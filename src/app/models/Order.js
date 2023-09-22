// models/Order.js
import Sequelize, { Model } from 'sequelize';
import User from './User';
import OrderItem from './OrderItem';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        status: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        address_id: {
          type: Sequelize.INTEGER, // Tipo de dado depende do tipo de chave primária da tabela addresses
          allowNull: true, // Pode ser nulo temporariamente até o pedido ser associado ao endereço
        },
      },
      {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'products',
    });

    // Associação com o modelo Address
    this.belongsTo(models.Address, {
      foreignKey: 'address_id',
      as: 'address',
    });
  }
  

  // Adicione um getter virtual para a URL da imagem do produto
  get url() {
    // Certifique-se de substituir "this.path" pelo nome correto do atributo de imagem do seu modelo Product
    return `https://pedepede.fun:3000/product-file/${this.products[0]?.product.path}`;
  }
}

export default Order;
