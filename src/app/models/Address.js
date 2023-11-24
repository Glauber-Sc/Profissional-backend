// models/Address.js
import Sequelize, { Model } from 'sequelize';
import User from './User';
import Order from './Order'; // Importe o modelo Order aqui

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        street: Sequelize.STRING,
        phone: Sequelize.NUMBER, //Adicione o campo "phone"
      },
      {
        sequelize,
        modelName: 'Address',
        tableName: 'addresses',
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    // Associação "1 para N" com o modelo Order
    this.hasMany(models.Order, {
      foreignKey: 'address_id',
      as: 'orders',
    });

    // Associação "N para 1" com o modelo User
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default Address;
