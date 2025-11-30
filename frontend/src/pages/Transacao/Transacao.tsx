import { useState, useEffect } from "react";
import api from "../../services/api";
import TransacaoModal from "./components/TransacaoModal";
import TransacaoTable from "./components/TransacaoTable";
import Template from "../../components/Template/Template";
import formatToCoin from "../../utils/formatToCoin";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

interface Transacao {
  id: number;
  idUsuario: number;
  data: string;
  tipo: string;
  valor: number;
  descricao: string;
  categorias: CategoriaTransacao[];
}

interface CategoriaTransacao {
  idCategoria: string;
  nome: string;
  valor: number;
}

export default function TransacaoCRUD() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedTransacao, setSelectedTransacao] = useState<Transacao | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);

  useEffect(() => {
    loadTransacoes();
    loadCategorias();
  }, []);

  useEffect(() => {
    calcularTotais();
  }, [transacoes]);

  const loadTransacoes = async () => {
    try {
      const response = await api.get("/transacoes/all");
      setTransacoes(response.data);
    } catch (error) {
      setAlert({
        message: "Erro ao carregar transações",
        type: "danger",
        show: true,
      });
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await api.get("/categorias/all");
      setCategorias(response.data);
    } catch (error) {
      setAlert({
        message: "Erro ao carregar categorias",
        type: "danger",
        show: true,
      });
    }
  };

  const handleEdit = async (transacaoId: number) => {
    try {
      const response = await api.get(`/transacoes/id/${transacaoId}`);
      setSelectedTransacao(response.data);
      setShowModal(true);
    } catch (error) {
      setAlert({
        message: "Erro ao carregar transação",
        type: "danger",
        show: true,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/transacoes/id/${id}`);
      loadTransacoes();
    } catch (error) {
      setAlert({
        message: "Erro ao excluir transação",
        type: "danger",
        show: true,
      });
    }
  };

  const handleShowModal = () => {
    setSelectedTransacao(null);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const calcularTotais = () => {
    const totalReceitas = transacoes
      .filter(transacao => transacao.tipo === "2")
      .reduce((total, transacao) => total + transacao.valor, 0);

    const totalDespesas = transacoes
      .filter(transacao => transacao.tipo === "1")
      .reduce((total, transacao) => total + transacao.valor, 0);

    setTotalReceitas(totalReceitas);
    setTotalDespesas(totalDespesas);
  };

  const calcularSaldo = () => {
    return totalReceitas - totalDespesas;
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
        <h2>Listagem de Transações</h2>
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-primary mb-3" onClick={handleShowModal}>
            Nova Transação
          </button>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total Receitas</h5>
                <p className="card-text text-success">
                  {formatToCoin(totalReceitas)}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total Despesas</h5>
                <p className="card-text text-danger">
                  {formatToCoin(totalDespesas)}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Saldo</h5>
                <p
                  className={`card-text ${
                    calcularSaldo() > 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {formatToCoin(calcularSaldo())}
                </p>
              </div>
            </div>
          </div>
        </div>
        <TransacaoTable
          transacoes={transacoes}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <TransacaoModal
          showModal={showModal}
          handleHideModal={handleHideModal}
          loadTransacoes={loadTransacoes}
          categorias={categorias}
          selectedTransacao={selectedTransacao}
          setPageAlert={setAlert}
        />
      </div>
    </Template>
  );
}
