const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');
const Transacao = require('../transacao/modelTransacao'); // Importe o modelo Transacao aqui
const Categoria = require('../categoria/modelCategoria'); // Importe o modelo Categoria aqui

const CategoriaTransacao = sequelize.define('CategoriaTransacao', {
  idTransacao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  valor: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
}, 
{
  tableName: 'categoriatransacao',
  timestamps: true // Adicionando os campos createdAt e updatedAt
});

CategoriaTransacao.associate = function(models) {
  CategoriaTransacao.belongsTo(models.Transacao, {
    foreignKey: 'idTransacao',
    as: 'Transacao'
  });

  CategoriaTransacao.belongsTo(models.Categoria, {
    foreignKey: 'idCategoria',
    as: 'Categoria'
  });
};

module.exports = CategoriaTransacao;
