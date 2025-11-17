const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../model/usuario/modelUsuario');
const { verificarToken }  = require("../middleware/authMiddleware")

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha)
            throw { 
                    message: global.ENVIRONMENT.ERROR_REASONS_TEXT.DATA_EMPTY,
                    errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.DATA_EMPTY 
                  };

        const user = await Usuario.findOne({
            where: { email: email.toLowerCase().trim() },
            attributes: { exclude: ['senha'] }
        });

        if (user || user?.length)
            throw { 
                    message: global.ENVIRONMENT.ERROR_REASONS_TEXT.USER_DUPLICATE, 
                    errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.USER_DUPLICATE 
                  }

        // Criptografar a senha
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Criar o usuário no banco de dados
        const usuario = await Usuario.create({
            nome,
            email,
            senha: hashedSenha
        });

        delete usuario.dataValues.senha;
        res.status(201).json(usuario);
    } catch (error) {
        global.UTILS.handleSequelizeError(error, res);
    }
});


// Atualização do usuário
router.put('/', verificarToken, async (req, res) => {
    try {
      const id  = req.userId; // ID do usuário autenticado
      const { nome } = req.body;
      
      // Atualizar os dados do usuário
      await Usuario.update({ nome }, { where: { id } });
      res.sendStatus(204);
    } catch (error) {
      global.UTILS.handleSequelizeError(error, res);
    }
});

// Atualização do usuário
router.put('/password', verificarToken, async (req, res) => {
    try {
      const userId = req.userId;
      const { senha } = req.body;

      // Criptografar a senha
      const hashedSenha = await bcrypt.hash(senha, 10);
      
      // Atualizar os dados do usuário
      await Usuario.update({ senha: hashedSenha }, { where: { id: userId } });
      res.sendStatus(204);
    } catch (error) {
      global.UTILS.handleSequelizeError(error, res);
    }
});

router.get('/', verificarToken, async (req, res) => {
    try {
        const userId = req.userId;
        const usuarios = await Usuario.findOne({
            where: { id: userId },
            attributes: { exclude: ['senha'] }
        });
        res.json(usuarios);
    } catch (error) {
        global.UTILS.handleSequelizeError(error, res);
    }
});

module.exports = router;
