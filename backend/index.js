// app.js
const http = require("http");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

// Configuração do ambiente global
global.ENVIRONMENT = require("./environment/environment");
global.UTILS = require("./environment/utils");

const sequelize = require("./database/database");
const authController = require("./controller/auth/authController");
const usuarioController = require("./controller/usuarioController");

const { verificarToken } = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authController);
app.use("/usuarios", usuarioController);

// Middleware para verificar token JWT em todas as rotas
app.use(verificarToken);

// Sincronização do modelo com o banco de dados e inicialização do servidor
sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT_NODE, () => {
      console.log(
        "Servidor rodando em http://localhost:" + process.env.PORT_NODE
      );
    });
  })
  .catch((err) =>
    console.error("Erro ao sincronizar com o banco de dados:", err)
  );
