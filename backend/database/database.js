const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize(process.env.NAME_DATABASE, process.env.USERNAME_DATABASE, process.env.PASSWORD_DATABASE, {
  host: process.env.HOST_DATABASE,
  dialect: 'mysql',
  define: {
    timestamps: true // Ativar timestamps globalmente
  }
});

// Testar a conexão
async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('Conexão bem-sucedida com o banco de dados.');
  } catch (error) {
    console.error('Erro ao conectar-se ao banco de dados:', error);
  }
}

testarConexao();

module.exports = sequelize;
