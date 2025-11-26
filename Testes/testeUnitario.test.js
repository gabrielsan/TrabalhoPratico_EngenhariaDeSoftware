const { test, assert, beforeEach } = require("poku");
const request = require("supertest");
const express = require("../backend/node_modules/express");
const path = require("path");

global.UTILS = {
  handleSequelizeError: (err, res) => {
    res.status(500).json({ error: "mock-error" });
  },
};

let MockCategoria;
let MockDB;

let categoriaRouter;
let app;

beforeEach(() => {
  MockCategoria = {
    findAll: async () => [],
    create: async () => {},
    update: async () => {},
    destroy: async () => {},
  };

  MockDB = {
    authenticate: async () => {},
    query: async () => [],
    transaction: async (fn) => {
      const t = { commit: async () => {}, rollback: async () => {} };
      if (typeof fn === "function") return await fn(t);
      return t;
    },
  };

  // ===== RESOLVER CAMINHOS =====
  const modelPath = require.resolve(
    "../backend/model/categoria/modelCategoria"
  );
  const dbPath = require.resolve("../backend/database/database");
  const controllerPath = require.resolve(
    "../backend/controller/categoriaController"
  );

  // ===== COLOCAR MOCKS NO CACHE =====
  require.cache[modelPath] = { exports: MockCategoria };
  require.cache[dbPath] = { exports: MockDB };

  // ===== LIMPAR CONTROLLER DO CACHE =====
  delete require.cache[controllerPath];

  // ===== IMPORTAR CONTROLLER NOVAMENTE =====
  categoriaRouter = require("../backend/controller/categoriaController");

  // ===== EXPRESS =====
  app = express();
  app.use(express.json());

  app.use((req, res, next) => {
    req.userId = 5;
    next();
  });

  app.use("/categorias", categoriaRouter);
});

// ================= GET Categorias =================
test("Lista categorias", async () => {
  MockCategoria.findAll = async () => [{ id: 1, nome: "Teste" }];

  const res = await request(app).get("/categorias/all");

  assert.equal(res.status, 200);
  assert.equal(res.body[0].nome, "Teste");
});

// ================= POST Categorias =================
test("Cria categoria", async () => {
  MockCategoria.create = async (data) => ({
    id: 10,
    nome: data.nome,
  });

  const res = await request(app)
    .post("/categorias")
    .send({ nome: "Nova categoria" });

  assert.equal(res.status, 201);
  assert.equal(res.body.nome, "Nova categoria");
});

// ================= PUT Categoria =================
test("Atualiza categoria", async () => {
  MockCategoria.update = async () => 1;

  const res = await request(app)
    .put("/categorias/10")
    .send({ nome: "Editada" });

  assert.equal(res.status, 201);
  assert.equal(res.body.nome, "Editada");
});

// ================= DELETE Categoria =================
test("Deleta categoria", async () => {
  MockCategoria.destroy = async () => 1;

  const res = await request(app).delete("/categorias/10");

  assert.equal(res.status, 200);
  assert.equal(res.body, "OK");
});
