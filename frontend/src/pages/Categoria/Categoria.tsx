import { useState, useEffect } from "react";
import api from "../../services/api";
import CategoriaModal from "./components/CategoriaModal";
import CategoriaTable from "./components/CategoriaTable";
import Template from "../../components/Template/Template";
import { Col, Row } from "react-bootstrap";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

interface Categoria {
  id: number;
  nome: string;
}

export default function CategoriaCRUD() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const response = await api.get("/categorias/all");
      setCategorias(response.data);
    } catch (error) {
      setAlert({
        show: true,
        message: "Erro ao carregar categorias",
        type: "danger",
      });
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categorias/${id}`);
      loadCategorias();
      setAlert({
        show: true,
        message: "Categoria excluída com sucesso",
        type: "success",
      });
    } catch (error) {
      setAlert({
        show: true,
        message:
          "Não foi possível excluir a categoria. Verifique se ela não está sendo utilizada em alguma transação, não é possível excluir categorias que estão sendo utilizadas!",
        type: "danger",
      });
    }
  };

  const handleShowModal = () => {
    setSelectedCategoria(null);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  return (
    <Template>
      <div className="container mt-5">
        <CustomAlert
          show={alert.show}
          message={alert.message}
          type={alert.type}
          dismissible={true}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />{" "}
        <Row>
          <Col>
            <h2>Listagem de Categorias</h2>
          </Col>
          <Col>
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-primary" onClick={handleShowModal}>
                Nova Categoria
              </button>
            </div>
          </Col>
        </Row>
        <CategoriaTable
          categorias={categorias}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <CategoriaModal
          showModal={showModal}
          handleHideModal={handleHideModal}
          loadCategorias={loadCategorias}
          selectedCategoria={selectedCategoria}
        />
      </div>
    </Template>
  );
}
