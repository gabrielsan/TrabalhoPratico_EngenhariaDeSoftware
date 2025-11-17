const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../../model/usuario/modelUsuario');

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!senha || !email)
    return res.status(401).json(
      { 
        message: global.ENVIRONMENT.ERROR_REASONS_TEXT.INVALID_CREDENTIALS, 
        errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.INVALID_CREDENTIALS 
      }
    );  

  const usuario = await Usuario.findOne({ where: { email } });
  
  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return res.status(401).json(
      { 
        message: global.ENVIRONMENT.ERROR_REASONS_TEXT.INVALID_CREDENTIALS, 
        errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.INVALID_CREDENTIALS 
      }
    );
  }

  const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;
