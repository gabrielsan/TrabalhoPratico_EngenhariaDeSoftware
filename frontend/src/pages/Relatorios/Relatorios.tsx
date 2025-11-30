import { useState, useEffect } from "react";
import api from "../../services/api";
import { downloadPdf } from "../../utils/downloadPDF";
import Template from "../../components/Template/Template";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

interface Categoria {
  id: number;
  nome: string;
}

export default function Relatorios() {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("transacoes");
  const [dataInicio, setDataInicio] = useState<string>(getCurrentDate());
  const [dataFim, setDataFim] = useState<string>(getCurrentDate());
  const [idCategoria, setIdCategoria] = useState<string>("");
  const [tipoTransacao, setTipoTransacao] = useState<string>("1"); // 1 para Despesas, 2 para Receitas
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    // Carregar categorias ao montar o componente
    const loadCategorias = async () => {
      try {
        const response = await api.get("/categorias/all");
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao carregar categorias", error);
      }
    };

    loadCategorias();
  }, []);

  const generateReport = async () => {
    try {
      const payload: any = {
        dataInicio,
        dataFim,
      };
      if (tipoRelatorio === "transacaoCategoria") {
        payload.idCategoria = idCategoria;
      }
      if (tipoRelatorio === "transacoes") {
        payload.tipoTransacao = tipoTransacao;
      }

      const response = await api.post(
        `/relatorio?tipo=${tipoRelatorio}`,
        payload,
      );

      downloadPdf(response.data || "");
    } catch (error) {
      /*setAlert({
        show: true,
        message: error as string,
        type: "danger",
      });*/
      console.error("Erro ao gerar relatório ", error);
    }
  };

  return (
    <Template>
      <div className="container mt-5">
        <CustomAlert
          show={alert.show}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
        <h2>Relatórios</h2>
        <div className="mb-3">
          <label htmlFor="tipoRelatorio" className="form-label">
            Tipo de Relatório
          </label>
          <select
            id="tipoRelatorio"
            className="form-control"
            value={tipoRelatorio}
            onChange={e => setTipoRelatorio(e.target.value)}
          >
            <option value="transacoes">Transações</option>
            <option value="transacaoCategoria">Transação por Categoria</option>
            <option value="gastosCategoria">Gastos por Categoria</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="dataInicio" className="form-label">
            Data Início
          </label>
          <input
            type="date"
            className="form-control"
            id="dataInicio"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="dataFim" className="form-label">
            Data Fim
          </label>
          <input
            type="date"
            className="form-control"
            id="dataFim"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
          />
        </div>

        {tipoRelatorio === "transacaoCategoria" && (
          <div className="mb-3">
            <label htmlFor="idCategoria" className="form-label">
              Categoria
            </label>
            <select
              id="idCategoria"
              className="form-control"
              value={idCategoria}
              onChange={e => setIdCategoria(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id.toString()}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {tipoRelatorio === "transacoes" && (
          <div className="mb-3">
            <label className="form-label">Tipo de Transação</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="tipoTransacao"
                id="despesas"
                value="1"
                checked={tipoTransacao === "1"}
                onChange={e => setTipoTransacao(e.target.value)}
              />
              <label className="form-check-label" htmlFor="despesas">
                Despesas
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="tipoTransacao"
                id="receitas"
                value="2"
                checked={tipoTransacao === "2"}
                onChange={e => setTipoTransacao(e.target.value)}
              />
              <label className="form-check-label" htmlFor="receitas">
                Receitas
              </label>
            </div>
          </div>
        )}

        <button className="btn btn-primary" onClick={generateReport}>
          Gerar Relatório
        </button>
      </div>
    </Template>
  );
}
