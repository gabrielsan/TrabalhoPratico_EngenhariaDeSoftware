const express = require('express');
const PDFDocument = require('pdfkit');
const { Sequelize, Op, EmptyResultError } = require('sequelize');

const Transacao = require('../model/transacao/modelTransacao');
const CategoriaTransacao = require('../model/categoriaTransacao/modelCategoriaTransacao');
const Categoria = require('../model/categoria/modelCategoria');
const sequelize = require('../database/database');

const router = express.Router();

// Função para gerar PDF
const gerarPDF = (titulo, data, tipoRelatorio) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            const base64Data = pdfData.toString('base64');
            resolve(base64Data);
        });

        // Adicionar cabeçalho
        doc.fontSize(16).text(titulo, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Relatório gerado em: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(1);

        // Adicionar corpo baseado no tipo de relatório
        if (tipoRelatorio === 'transacoes') {
            adicionarCorpoTransacoes(doc, data);
        } else if (tipoRelatorio === 'transacaoCategoria') {
            adicionarCorpoTransacaoCategoria(doc, data);
        } else if (tipoRelatorio === 'gastosCategoria') {
            adicionarCorpoGastosCategoria(doc, data);
        }

        doc.end();
    });
};

// Função para desenhar tabela
const desenharTabela = (doc, headers, rows, startX = 50, startY = 150, columnPadding = 10) => {
    // Calcular a largura de cada coluna
    const columnWidths = headers.map((header, i) => {
        const columnValues = rows.map(row => row[i]);
        // Calcular a largura máxima do cabeçalho e das células
        const maxHeaderWidth = doc.widthOfString(header);
        const maxCellWidth = Math.max(...columnValues.map(value => doc.widthOfString(value.toString())));
        return Math.max(maxHeaderWidth, maxCellWidth) + columnPadding * 2;
    });

    // Calcular a largura total da tabela e centralizar
    const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
    const marginX = (doc.page.width - tableWidth) / 2;

    let currentY = startY;
    let currentX = marginX;

    // Desenhar o cabeçalho
    doc.fontSize(11).font('Helvetica-Bold');
    headers.forEach((header, i) => {
        doc.rect(currentX, currentY, columnWidths[i], 20).stroke();
        doc.text(header, currentX + columnPadding, currentY + 5, {
            width: columnWidths[i] - columnPadding * 2,
            align: 'center'
        });
        currentX += columnWidths[i];
    });

    // Mover para a linha abaixo do cabeçalho
    currentY += 20;
    currentX = marginX;

    // Desenhar as linhas de dados
    doc.fontSize(10).font('Helvetica');
    rows.forEach(row => {
        row.forEach((cell, i) => {
            doc.rect(currentX, currentY, columnWidths[i], 20).stroke();
            doc.text(cell, currentX + columnPadding, currentY + 5, {
                width: columnWidths[i] - columnPadding * 2,
                align: 'right'
            });
            currentX += columnWidths[i];
        });
        currentY += 20;
        currentX = marginX;
    });

    // Desenhar linha de fundo abaixo da tabela
    doc.moveTo(marginX, currentY).lineTo(marginX + tableWidth, currentY).stroke();
};

// Funções para adicionar corpo dos relatórios
const adicionarCorpoTransacoes = (doc, data) => {
    let contador = 1;
    const headers = ['N°', 'Descrição', 'Valor (R$)', 'Tipo', 'Data'];
    const rows = data.map(transacao => [
        contador++,
        transacao.descricao,
        transacao.valor.toFixed(2),
        global.ENVIRONMENT.TRANSACTION_TYPES[transacao.tipo],
        global.UTILS.formatDateTime(transacao.data)
    ]);

    // Calcular o total dos valores
    const total = data.reduce((acc, transacao) => {
        const valor = parseFloat(transacao.valor);
        return transacao.tipo === '1' ? acc - valor : acc + valor;
    }, 0);

    // Adicionar a linha do total ao final das linhas
    rows.push(['', 'Total:', total.toFixed(2), '', '']);

    desenharTabela(doc, headers, rows, 50, 150, 30);
};

const adicionarCorpoTransacaoCategoria = (doc, data) => {
    if (data.length > 0) {
        const subtitulo = data[0]?.Categoria ? `Transações da categoria "${data[0]?.Categoria?.dataValues?.nome}"` : "Não foi encontrada nenhuma transação para a categoria selecionada.";
        doc.fontSize(12).text(subtitulo, { align: 'center' });
        doc.moveDown(1);
    }

    let contador = 1;
    const headers = ['N°', 'Descrição', 'Data', 'Valor (R$)'];
    const rows = data.map(item => [
        contador++,
        item.Transacao ? item.Transacao.dataValues.descricao : 'N/A',
        item.Transacao ? global.UTILS.formatDateTime(item.Transacao.dataValues.data) : 'N/A',
        item.Transacao ? item.Transacao.dataValues.valor.toFixed(2) : 'N/A',
    ]);

    desenharTabela(doc, headers, rows);
};

const adicionarCorpoGastosCategoria = (doc, data) => {
    let contador = 1;
    const headers = ['N°', 'Categoria', 'Total Gasto (R$)'];
    const rows = data.map(item => [
        contador++,
        item.Categoria.nome,
        item.dataValues.totalGasto.toFixed(2)
    ]);
    desenharTabela(doc, headers, rows);
};

// Funções para gerar dados dos relatórios
const gerarDadosTransacoes = async (userId, filtro) => {
    const whereClause = { idUsuario: userId };

    if (filtro) {
        // Adicionar filtro de data se dataInicio e dataFim forem fornecidos
        if (filtro.dataInicio && filtro.dataFim) {
            whereClause.data = {
                [Op.between]: [
                    Sequelize.fn('DATE', filtro.dataInicio),
                    Sequelize.fn('DATE', filtro.dataFim)
                ]
            };
        }
        if (filtro.tipoTransacao)
            whereClause.tipo = filtro.tipoTransacao;
    }

    const transacoes = await Transacao.findAll({ where: whereClause });

    if (!transacoes?.length)
        throw new EmptyResultError("Nenhum dado encontrado.");

    return transacoes;
};

const gerarDadosTransacaoCategoria = async (userId, filtro) => {
    const whereClause = { idUsuario: userId };
    const whereClauseTransacao = {...whereClause};
    const categoriaId = filtro.idCategoria;

    if (filtro) {
        // Adicionar filtro de data se dataInicio e dataFim forem fornecidos
        if (filtro.dataInicio && filtro.dataFim) {
            whereClauseTransacao.data = {
                [Op.between]: [
                    Sequelize.fn('DATE', filtro.dataInicio),
                    Sequelize.fn('DATE', filtro.dataFim)
                ],
            };
        }
    }

    const transacoesCategorias = await CategoriaTransacao.findAll({
        where: { idCategoria: categoriaId },
        include: [
            {
                model: Transacao,
                as: 'Transacao',
                attributes: ['descricao', 'data', 'tipo', 'valor'],
                where: whereClauseTransacao
            },
            {
                model: Categoria,
                as: 'Categoria',
                attributes: ['nome'],
                where: whereClause
            }
        ]
    });

    if (!transacoesCategorias?.length)
        throw new EmptyResultError("Nenhum dado encontrado.");

    return transacoesCategorias;
};

const gerarDadosGastosCategoria = async (userId, filtro) => {
    const whereClause = { '$transacao.idUsuario$': userId };
    const whereClauseTransacao = {...whereClause};

    if (filtro) {
        // Adicionar filtro de data se dataInicio e dataFim forem fornecidos
        if (filtro.dataInicio && filtro.dataFim) {
            whereClauseTransacao.data = {
                [Op.between]: [
                    Sequelize.fn('DATE', filtro.dataInicio),
                    Sequelize.fn('DATE', filtro.dataFim)
                ],
            };
        }
    }

    const gastosPorCategoria = await CategoriaTransacao.findAll({
        include: [
            {
                model: Transacao,
                as: 'Transacao',
                attributes: ['data', 'tipo'],
                where: whereClauseTransacao
            },
            {
                model: Categoria,
                as: 'Categoria',
                attributes: ['nome'],
            }
        ],
        attributes: [
            'idCategoria',
            [sequelize.fn('SUM', sequelize.col('CategoriaTransacao.valor')), 'totalGasto']
        ],
        where: whereClause,
        group: ['idCategoria']
    });

    if (!gastosPorCategoria?.length)
        throw new EmptyResultError("Nenhum dado encontrado.");

    return gastosPorCategoria;
};

// Rota principal para geração de relatórios
router.post('/', async (req, res) => {
    try {
        const userId = req.userId; // ID do usuário autenticado
        const tipoRelatorio = req.query.tipo;
        const filtro = req.body;
        let dados;

        // Obter dados com base no tipo de relatório
        switch (tipoRelatorio) {
            case 'transacoes':
                dados = await gerarDadosTransacoes(userId, filtro);
                break;
            case 'transacaoCategoria':
                dados = await gerarDadosTransacaoCategoria(userId, filtro);
                break;
            case 'gastosCategoria':
                dados = await gerarDadosGastosCategoria(userId, filtro);
                break;
            default:
                throw new Error(
                    { 
                        message: global.ENVIRONMENT.ERROR_REASONS_TEXT.INVALID_REPORT, 
                        errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.INVALID_REPORT 
                    }
                );
        }

        // Definir título do relatório
        let titulo;
        switch (tipoRelatorio) {
            case 'transacoes':
                titulo = "Relatório de Transações";
                break;
            case 'transacaoCategoria':
                titulo = "Relatório de Transações por Categoria";
                break;
            case 'gastosCategoria':
                titulo = "Relatório de Gastos por Categoria";
                break;
        }

        // Gerar PDF
        const relatorioBase64 = await gerarPDF(titulo, dados, tipoRelatorio);

        res.status(200).json(relatorioBase64);

    } catch (error) {
        global.UTILS.handleSequelizeError(error, res);
    }
});

module.exports = router;