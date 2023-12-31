import Sequelize, { Model } from 'sequelize'

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                price: Sequelize.STRING,
                path: Sequelize.STRING,
                offer: Sequelize.BOOLEAN,
                description: Sequelize.STRING, // Adicione o campo description aqui
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `/product-file/${this.path}`
                    }
                    // get() {
                    //     return `http://192.168.100.7:3000/product-file/${this.path}`
                    // }
                }
            },
            {
                sequelize
            }
        )
        return this
    }

    static associate(models) {
        this.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category'
        })
    }    
}

export default Product

