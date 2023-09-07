import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcrypt'

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL, // Esse campo não vai existir dentro do banco
                password_hash: Sequelize.STRING,
                admin: Sequelize.BOOLEAN
            },
            {
                sequelize
            }
        )

        // Vai criar um hash de senha antes de salvar as informações no banco de dados
        this.addHook('beforeSave', async (user) => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 10)
            }
        })

        return this

        
    }

    // Comparando se a senha digitada é a mesma que está no banco.
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash)
    }

    static associate(models) {
        // Associação "1 para N" com o modelo Address
        this.hasMany(models.Address, {
          foreignKey: 'user_id',
          as: 'addresses',
        });
      }
}

export default User
