const { DataTypes } = require("sequelize");
const sequelize = require("../../database/database");

const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "categoria",
    timestamps: true,
  }
);

Categoria.associate = function (models) {
  Categoria.hasMany(models.CategoriaTransacao, {
    foreignKey: "idCategoria",
    as: "CategoriaTransacoes",
  });
};

module.exports = Categoria;
