const express = require("express");
const Categoria = require("../model/categoria/modelCategoria");
const sequelize = require("../database/database");

const router = express.Router();

router.post("/", async (req, res) => {
  //criar
  try {
    const userId = req.userId; // Obtém o ID do usuário autenticado

    const categoriaData = { ...req.body, idUsuario: userId };
    const categoria = await Categoria.create(categoriaData);
    res.status(201).json(categoria);
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});

router.put("/:id", async (req, res) => {
  //atualizar
  let transaction;
  try {
    const userId = req.userId; // Obtém o ID do usuário autenticado
    const categoriaId = req.params.id;
    const categoriaData = { ...req.body, id: categoriaId };

    // Iniciar uma transação
    transaction = await sequelize.transaction();

    // Atualizar os dados da categoria
    await Categoria.update(categoriaData, {
      where: { id: categoriaId, idUsuario: userId },
      transaction,
    });

    // Commit da transação se tudo ocorrer bem
    await transaction.commit();

    res.status(201).json(categoriaData);
  } catch (error) {
    console.error(error);
    // Rollback da transação em caso de erro
    if (transaction) {
      await transaction.rollback();
    }
    global.UTILS.handleSequelizeError(error, res);
  }
});

router.get("/all", async (req, res) => {
  //buscar
  try {
    const userId = req.userId; // Obtém o ID do usuário autenticado

    const categorias = await Categoria.findAll({
      where: { idUsuario: userId },
    });
    res.json(categorias);
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});
router.delete("/:id", async (req, res) => {
  //deletar
  try {
    const userId = req.userId; // Obtém o ID do usuário autenticado
    const categoriaId = req.params.id;

    await Categoria.destroy({ where: { id: categoriaId, idUsuario: userId } });

    res.status(200).json("OK");
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});

module.exports = router;
