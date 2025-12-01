import { useEffect, useState, useCallback, useRef } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { Line } from "react-chartjs-2";
import api from "../../services/api";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Template from "../../components/Template/Template";
import { Button, Col, Row } from "react-bootstrap";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
);

// Interfaces TransacaoQuantidade e TransacaoValor removidas pois não são mais usadas
// com os gráficos de pizza.

export default function Dashboard() {
  const [receitasDespesasMensais, setReceitasDespesasMensais] = useState({
    receitas: [],
    despesas: [],
  });
  // States para Gráficos de Pizza removidos
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const prevReceitasDespesasMensais = useRef<{
    receitas: number[];
    despesas: number[];
  }>({
    receitas: [],
    despesas: [],
  });
  // Refs para Gráficos de Pizza removidas

  const fetchData = useCallback(async () => {
    try {
      const [
        receitasDespesasResponse,
        // As chamadas de API para os dados de pizza foram removidas.
      ] = await Promise.all([
        api.get("/transacoes/relacao-receitas-despesas-mensal"),
        // Removido: api.get("/transacoes/quantidade-transacoes-categoria"),
        // Removido: api.get("/transacoes/valor-total-transacoes-categoria"),
      ]);

      const newReceitasDespesasMensais = receitasDespesasResponse.data || {};

      // A lógica para dados de pizza foi removida.

      // Comparar os dados novos com os antigos (apenas para o gráfico de linha)
      if (
        JSON.stringify(newReceitasDespesasMensais) !==
        JSON.stringify(prevReceitasDespesasMensais.current)
      ) {
        setReceitasDespesasMensais(newReceitasDespesasMensais);
        prevReceitasDespesasMensais.current = newReceitasDespesasMensais;
      }
    } catch (error) {
      setAlert({
        message: "Erro ao carregar dados do dashboard",
        type: "danger",
        show: true,
      });
    }
  }, [setAlert]); // Removida dependência "alert" pois não é mais usada diretamente aqui

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, []);

  const receitasDespesasChartData = {
    labels: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    datasets: [
      {
        label: "Receitas",
        data: receitasDespesasMensais.receitas,
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "#36a2eb",
        tension: 0.4,
      },
      {
        label: "Despesas",
        data: receitasDespesasMensais.despesas,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "#ff6384",
        tension: 0.4,
      },
    ],
  };

  // Objetos de dados e opções de Gráficos de Pizza removidos:
  // const categoriasQuantitativoData = { ... };
  // const categoriasQualitativoData = { ... };
  // const categoriasQuantitativoOptions = { ... };
  // const categoriasQualitativoOptions = { ... };

  return (
    <Template>
      <div className="container mt-5">
        <CustomAlert
          show={alert.show}
          dismissible
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
        <Row className="d-flex align-items-center">
          <Col>
            <h2>Dashboard</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button onClick={fetchData}>
              {" "}
              <div className="d-flex align-content-center">
                <LuRefreshCcw className="m-2 p-0" />{" "}
                <p className="m-0 mt-1 me-2 p-0">Atualizar</p>
              </div>
            </Button>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mb-3"></div>
        <div className="row">
          <div className="card">
            <div className="col-md-12 mb-3">
              <h3 className="mt-3">Receitas vs Despesas (Mensal)</h3>
              <Line data={receitasDespesasChartData} />
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}