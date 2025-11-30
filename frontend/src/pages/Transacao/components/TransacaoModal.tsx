import React, { useState, useEffect } from "react";
import type { SetStateAction, Dispatch } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import api from "../../../services/api";
import { FaTrash } from "react-icons/fa";
import CustomAlert from "../../../components/CustomAlert/CustomAlert";

interface Categoria {
  id: number;
  nome: string;
}

interface CategoriaTransacao {
  idCategoria: string;
  nome: string;
  valor: number;
}

interface Transacao {
  id: number;
  idUsuario: number;
  data: string;
  tipo: string;
  valor: number;
  descricao: string;
  categorias: CategoriaTransacao[];
}

interface TransacaoModalProps {
  showModal: boolean;
  handleHideModal: () => void;
  loadTransacoes: () => void;
  categorias: Categoria[];
  selectedTransacao: Transacao | null;
  setPageAlert: Dispatch<
    SetStateAction<{ show: boolean; message: string; type: string }>
  >;
}

export default function TransacaoModal(props: TransacaoModalProps) {
  const {
    showModal,
    handleHideModal,
    loadTransacoes,
    categorias,
    selectedTransacao,
    setPageAlert,
  } = props;

  const getCurrentDate = () => {
    const today = new Date();
    return new Date(
      today.getTime() + today.getTimezoneOffset() * 60000,
    ).toISOString();
  };

  const [valor, setValor] = useState("");
  const [data, setData] = useState(getCurrentDate());
  const [tipo, setTipo] = useState("1");
  const [categoriaTransacoes, setCategoriaTransacoes] = useState<
    CategoriaTransacao[]
  >([]);
  const [novaCategoriaId, setNovaCategoriaId] = useState("");
  const [novaCategoriaValor, setNovaCategoriaValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (selectedTransacao) {
      setValor(selectedTransacao.valor.toString());
      setData(selectedTransacao.data.split("T")[0]); // Ajuste para exibir a data corretamente
      setTipo(selectedTransacao.tipo);
      setDescricao(selectedTransacao.descricao);
      setCategoriaTransacoes(
        selectedTransacao.categorias.map(ct => ({
          idCategoria: ct.idCategoria,
          nome: ct.nome,
          valor: ct.valor,
        })),
      );
    } else {
      resetForm();
    }
  }, [selectedTransacao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const transacaoPayload = {
      data,
      valor: parseFloat(valor),
      tipo,
      descricao,
    };
    const payload = {
      transacao: transacaoPayload,
      categorias: categoriaTransacoes,
    };

    if (categoriaTransacoes.length === 0) {
      setAlert({
        show: true,
        message: "Adicione ao menos uma categoria",
        type: "danger",
      });
      return;
    }

    try {
      if (selectedTransacao) {
        await api.put(`/transacoes/id/${selectedTransacao.id}`, payload);
        setPageAlert({
          message: "Transação atualizada com sucesso",
          type: "success",
          show: true,
        });
      } else {
        await api.post("/transacoes", payload);
        setPageAlert({
          message: "Transação adicionada com sucesso",
          type: "success",
          show: true,
        });
      }

      resetForm();
      handleHideModal();
      loadTransacoes();
    } catch (error) {
      setAlert({
        show: true,
        message: "Erro ao salvar transação",
        type: "danger",
      });
    }
  };

  const handleAddCategoria = () => {
    const novaCategoria: CategoriaTransacao = {
      idCategoria: novaCategoriaId,
      nome:
        categorias.find((c: Categoria) => c.id === parseInt(novaCategoriaId))
          ?.nome || "",
      valor: parseFloat(novaCategoriaValor),
    };
    const novasCategorias = [...categoriaTransacoes, novaCategoria];
    setCategoriaTransacoes(novasCategorias);
    setNovaCategoriaId("");
    setNovaCategoriaValor("");
    atualizarValorTransacao(novasCategorias);
  };

  const handleRemoveCategoria = (idCategoria: string) => {
    const novasCategorias = categoriaTransacoes.filter(
      ct => ct.idCategoria !== idCategoria,
    );
    setCategoriaTransacoes(novasCategorias);
    atualizarValorTransacao(novasCategorias);
  };

  const atualizarValorTransacao = (categorias: CategoriaTransacao[]) => {
    const novoValor = categorias.reduce((total, ct) => total + ct.valor, 0);
    setValor(novoValor.toString());
  };

  const resetForm = () => {
    setValor("");
    setDescricao("");
    setData(getCurrentDate());
    setTipo("1");
    setCategoriaTransacoes([]);
    setAlert({ show: false, message: "", type: "" });
  };

  return (
    <Modal show={showModal} onHide={handleHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedTransacao ? "Editar Transação" : "Nova Transação"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CustomAlert
          message={alert.message}
          type={alert.type}
          show={alert.show}
          onClose={() => setAlert({ message: "", type: "", show: false })}
        />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="valor">
            <Form.Label>Valor</Form.Label>
            <p className="ms-1 mb-0 d-inline-flex text-danger">*</p>
            <Form.Control
              type="number"
              value={valor}
              placeholder="0,00"
              readOnly
              disabled
              required
            />
          </Form.Group>
          <Form.Group controlId="descricao">
            <Form.Label className="mt-3">Descrição</Form.Label>
            <Form.Control
              type="text"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="data">
            <Form.Label className="mt-3">Data</Form.Label>
            <Form.Control
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="tipo">
            <Form.Label className="mt-3">Tipo</Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="despesa"
                label="Despesa"
                value={"1"}
                checked={tipo === "1"}
                onChange={() => setTipo("1")}
              />
              <Form.Check
                type="radio"
                id="receita"
                label="Receita"
                value={"2"}
                checked={tipo === "2"}
                onChange={() => setTipo("2")}
              />
            </div>
          </Form.Group>
          <h5 className="mt-4">Categorias</h5>
          <Form.Group controlId="novaCategoria">
            <Form.Control
              as="select"
              value={novaCategoriaId}
              onChange={e => setNovaCategoriaId(e.target.value)}
              required
              className="custom-select mt-3"
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((categoria: Categoria) => (
                <option key={categoria.id} value={categoria.id.toString()}>
                  {categoria.nome}
                </option>
              ))}
            </Form.Control>
            <Form.Label className="mt-3">Valor</Form.Label>
            <Form.Control
              type="number"
              placeholder="0,00"
              value={novaCategoriaValor}
              onChange={e => setNovaCategoriaValor(e.target.value)}
              required
            />
            <Button
              onClick={handleAddCategoria}
              disabled={!novaCategoriaId || !novaCategoriaValor}
              className="mt-3"
            >
              Adicionar Categoria
            </Button>
          </Form.Group>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categoriaTransacoes.map(
                (categoriaTransacao: CategoriaTransacao) => (
                  <tr key={categoriaTransacao.idCategoria}>
                    <td>{categoriaTransacao.nome}</td>
                    <td>{categoriaTransacao.valor}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleRemoveCategoria(categoriaTransacao.idCategoria)
                        }
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </Table>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHideModal}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
