// /* Configurações do sequelize com o postgres */

// module.exports = {
//     dialect: 'postgres',
//     host: 'localhost',
//     username: 'postgres',
//     password: 'postgres',
//     database: 'codeburger',
//     define: {
//         timespamps: true,
//         underscored: true,
//         underscoredAll: true
//     }
// }


//ORIGINAL
// module.exports = {
//     dialect: 'postgres',
//     host: 'localhost',
//     username: 'postgres',
//     password: '1234',
//     database: 'codeburguer',
//     define: {
//         timestamps: true,
//         underscored: true,
//         underscoredAll: true
//     }
    
// }



module.exports = {
    host: 'codeburguer.ckymwbkfxdvf.sa-east-1.rds.amazonaws.com',
    username: 'codeburguer',
    password: '12341234',
    database: 'codeburguer',
    dialect: 'postgres', // Use o dialeto PostgreSQL
    ssl: true,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  };
  