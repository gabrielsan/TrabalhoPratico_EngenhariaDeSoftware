const express = require('express');
const sequelize = require('../database/database');
const Transacao = require('../model/transacao/modelTransacao');
const CategoriaTransacao = require('../model/categoriaTransacao/modelCategoriaTransacao');
const Categoria = require('../model/categoria/modelCategoria');

const router = express.Router();

router.post('/', async (req, res) => {
  let transaction;
  try {
    const userId = req.userId;

    // Iniciar uma transação
    transaction = await sequelize.transaction();
    
    // Criar a transação
    const transacaoData = { ...req.body.transacao, idUsuario: userId };
    const transacao = await Transacao.create(transacaoData, { transaction });

    // Criar as categorias de transação
    const categorias = req.body.categorias.map(categoria => {
      return {
        valor: categoria.valor,
        idTransacao: transacao.id,
        idCategoria: categoria.idCategoria
      };
    });

    await CategoriaTransacao.bulkCreate(categorias, {
      fields: ['idTransacao', 'idCategoria', 'valor', 'createdAt', 'updatedAt'],
      transaction
    });

    // Commit da transação se tudo ocorrer bem
    await transaction.commit();

    res.status(201).json({ transacao, categorias });
  } catch (error) {
    // Rollback da transação em caso de erro
    if (transaction) {
      await transaction.rollback();
    }
    global.UTILS.handleSequelizeError(error, res);
  }
});

router.put('/id/:id', async (req, res) => {
  let transaction;
  try {
    const userId = req.userId; // ID do usuário autenticado
    const transacaoId = req.params.id;
    const transacaoData = req.body;
    
    // Iniciar uma transação
    transaction = await sequelize.transaction();

    // Verificar se a transação pertence ao usuário autenticado
    const transacao = await Transacao.findOne({ where: { id: transacaoId, idUsuario: userId } });
    if (!transacao) {
      await transaction.rollback();
      return res.status(403).json(
        { 
          message: global.ENVIRONMENT.ERROR_REASONS_TEXT.FORBIDDEN_REGISTER,
          errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.FORBIDDEN_REGISTER 
        }
      );
    }

    // Atualizar os dados da transação
    await transacao.update(transacaoData.transacao, { where: { id: transacaoId, idUsuario: userId }, transaction });

    // Verificar se existem categorias de transação a serem excluídas
    if (transacaoData.categorias) {
      const categoriasEnviadas = transacaoData.categorias.map(categoria => categoria.idCategoria);

      // Encontrar categorias de transação associadas à transação
      const categoriasExistentes = await CategoriaTransacao.findAll({ where: { idTransacao: transacaoId } });

      const categoriasParaAtualizarOuCriar = transacaoData.categorias;
      const categoriasParaExcluir = categoriasExistentes.filter(categoria => !categoriasEnviadas.includes(categoria.idCategoria));

      // Excluir as categorias de transação não presentes no objeto enviado
      await Promise.all(categoriasParaExcluir.map(categoria => categoria.destroy({ transaction })));

      // Atualizar ou criar categorias de transação enviadas
      for (const categoriaEnviada of categoriasParaAtualizarOuCriar) {
        const categoriaExistente = categoriasExistentes.find(categoria => categoria.idCategoria === categoriaEnviada.idCategoria);
        if (categoriaExistente) {
          // Atualizar categoria existente
          await categoriaExistente.update(categoriaEnviada, { where: { idCategoria: categoriaExistente.idCategoria, idTransacao: transacaoId, idUsuario: userId }, transaction });
        } else {
          // Criar nova categoria
          await CategoriaTransacao.create({
            idTransacao: transacaoId,
            idCategoria: categoriaEnviada.idCategoria,
            valor: categoriaEnviada.valor
          }, { transaction });
        }
      }
    }

    // Commit da transação se tudo ocorrer bem
    await transaction.commit();

    res.status(204).json(transacaoData);
  } catch (error) {

    // Rollback da transação em caso de erro
    if (transaction) {
      await transaction.rollback();
    }

    global.UTILS.handleSequelizeError(error, res);
  }
});

// Exclusão de transação
router.delete('/id/:id', async (req, res) => {
  try {
    const userId = req.userId; // ID do usuário autenticado
    const transacaoId = req.params.id;

    // Verificar se a transação pertence ao usuário
    const transacao = await Transacao.findOne({ where: { id: transacaoId, idUsuario: userId } });
    if (!transacao) {
      return res.status(403).json(
        { 
          message: global.ENVIRONMENT.ERROR_REASONS_TEXT.FORBIDDEN_REGISTER,
          errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.FORBIDDEN_REGISTER 
        }
      );
    }

    // Excluir a transação e as categorias de transação associadas
    await CategoriaTransacao.destroy({ where: { idTransacao: transacaoId } });
    await Transacao.destroy({ where: { id: transacaoId } });

    res.sendStatus(204);
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});

router.get('/all', async (req, res) => {
  try {
    const userId = req.userId; // Obtém o ID do usuário autenticado
    
    const transacoes = await Transacao.findAll({ where: { idUsuario: userId } });
    res.json(transacoes);
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});

router.get('/relacao-receitas-despesas-mensal', async (req, res) => {
  try {
    const userId = req.userId; // ID do usuário autenticado

    const receitas = await Transacao.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('data')), 'mes'],
        [sequelize.fn('SUM', sequelize.col('valor')), 'total']
      ],
      where: { tipo: "2", idUsuario: userId },
      group: [sequelize.fn('MONTH', sequelize.col('data'))],
      order: [sequelize.fn('MONTH', sequelize.col('data'))]
    });

    const despesas = await Transacao.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('data')), 'mes'],
        [sequelize.fn('SUM', sequelize.col('valor')), 'total']
      ],
      where: { tipo: "1", idUsuario: userId },
      group: [sequelize.fn('MONTH', sequelize.col('data'))],
      order: [sequelize.fn('MONTH', sequelize.col('data'))]
    });

    const receitasMensais = Array(12).fill(0);
    const despesasMensais = Array(12).fill(0);

    receitas.forEach((r) => {
      receitasMensais[r.get('mes') - 1] = parseFloat(r.get('total'));
    });

    despesas.forEach((d) => {
      despesasMensais[d.get('mes') - 1] = parseFloat(d.get('total'));
    });

    res.json({
      receitas: receitasMensais,
      despesas: despesasMensais
    });
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});

// Endpoint para obter a relação de receitas e despesas
router.get('/relacao-receitas-despesas', async (req, res) => {
  try {
    const userId = req.userId;

    const receitas = await Transacao.sum('valor', { where: { idUsuario: userId, tipo: 2 } });
    const despesas = await Transacao.sum('valor', { where: { idUsuario: userId, tipo: 1 } });

    res.json({ receitas, despesas });
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});

// Endpoint para obter a quantidade de transações por categoria
router.get('/quantidade-transacoes-categoria', async (req, res) => {
  try {
    const userId = req.userId;

    const categorias = await Categoria.findAll({ where: { idUsuario: userId } });
    const categoriasMap = categorias.reduce((map, categoria) => {
      map[categoria.id] = { nome: categoria.nome, quantidade: 0 };
      return map;
    }, {});

    const transacoes = await Transacao.findAll({
      where: { idUsuario: userId },
      include: [{
        model: CategoriaTransacao,
        as: 'CategoriaTransacoes'
      }]
    });

    transacoes.forEach(transacao => {
      transacao.CategoriaTransacoes.forEach(categoriaTransacao => {
        if (categoriasMap[categoriaTransacao.idCategoria]) {
          categoriasMap[categoriaTransacao.idCategoria].quantidade += 1;
        }
      });
    });

    res.json(Object.values(categoriasMap));
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});

// Endpoint para obter o valor total das transações por categoria
router.get('/valor-total-transacoes-categoria', async (req, res) => {
  try {
    const userId = req.userId;

    const categorias = await Categoria.findAll({ where: { idUsuario: userId } });
    const categoriasMap = categorias.reduce((map, categoria) => {
      map[categoria.id] = { nome: categoria.nome, valor: 0 };
      return map;
    }, {});

    const transacoes = await Transacao.findAll({
      where: { idUsuario: userId },
      include: [{
        model: CategoriaTransacao,
        as: 'CategoriaTransacoes'
      }]
    });

    transacoes.forEach(transacao => {
      transacao.CategoriaTransacoes.forEach(categoriaTransacao => {
        if (categoriasMap[categoriaTransacao.idCategoria]) {
          categoriasMap[categoriaTransacao.idCategoria].valor += categoriaTransacao.valor;
        }
      });
    });

    res.json(Object.values(categoriasMap));
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const transacaoId = req.params.id;
    const userId = req.userId; // Obtém o ID do usuário autenticado

    // Buscar a transação pelo ID
    const transacao = await Transacao.findOne({
      where: { id: transacaoId, idUsuario: userId }
    });

    if (!transacao) {
      return res.status(404).json(
        { 
          message: global.ENVIRONMENT.ERROR_REASONS_TEXT.DATA_EMPTY,
          errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.DATA_EMPTY 
        }
      );
    }

    // Buscar as categorias associadas à transação
    const categoriasTransacoes = await CategoriaTransacao.findAll({
      where: { idTransacao: transacaoId },
      include: [{
        model: Categoria,
        as: 'Categoria'
      }]
    });

    // Formatando a resposta
    const response = {
      id: transacao.id,
      idUsuario: transacao.idUsuario,
      data: transacao.data,
      descricao: transacao.descricao,
      tipo: transacao.tipo,
      valor: transacao.valor,
      categorias: categoriasTransacoes.map(ct => ({
        idCategoria: ct.idCategoria,
        nome: ct.Categoria ? ct.Categoria.nome : '',
        valor: ct.valor
      }))
    };

    res.json(response);
  } catch (error) {
    global.UTILS.handleSequelizeError(error, res);
  }
});

module.exports = router;
