import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../../services/api";
import CustomAlert from "../../../components/CustomAlert/CustomAlert";

interface Categoria {
  id: number;
  nome: string;
}

interface CategoriaModalProps {
  showModal: boolean;
  handleHideModal: () => void;
  loadCategorias: () => void;
  selectedCategoria: Categoria | null;
}
export default function CategoriaModal(props: CategoriaModalProps) {
  const { showModal, handleHideModal, loadCategorias, selectedCategoria } =
    props;

  const [nome, setNome] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (selectedCategoria) {
      setNome(selectedCategoria.nome);
    } else {
      setNome("");
    }
  }, [selectedCategoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) {
      setAlert({
        message: "Preencha o nome da categoria",
        type: "warning",
        show: true,
      });
      return;
    }
    try {
      if (selectedCategoria) {
        await api.put(`/categorias/${selectedCategoria.id}`, { nome });
        setAlert({
          message: "Categoria atualizada com sucesso",
          type: "success",
          show: true,
        });
      } else {
        await api.post("/categorias", { nome });
        setAlert({
          message: "Categoria adicionada com sucesso",
          type: "success",
          show: true,
        });
      }

      setNome("");
      handleHideModal();
      setAlert({ show: false, message: "", type: "" });
      loadCategorias();
    } catch (error) {
      setAlert({
        message: "Erro ao salvar categoria",
        type: "danger",
        show: true,
      });
    }
  };

  function closeModal() {
    setNome("");
    handleHideModal();
    setAlert({ show: false, message: "", type: "" });
  }

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedCategoria ? "Editar Categoria" : "Nova Categoria"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CustomAlert
          show={alert.show}
          message={alert.message}
          type={alert.type}
          dismissible
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />{" "}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nome">
            <Form.Label>Nome da Categoria</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
