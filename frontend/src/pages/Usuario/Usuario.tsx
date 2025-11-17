import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import Template from "../../components/Template/Template";
import { FaUser } from "react-icons/fa";
import api from "../../services/api";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

interface User {
  nome: string;
  email: string;
  id: number;
}

export default function Usuario() {
  const [editMode, setEditMode] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: string;
  }>({
    show: false,
    message: "",
    type: "",
  });
  const [userData, setUserData] = useState<User>({
    nome: "",
    email: "",
    id: 0,
  });

  async function fetchUserData() {
    //buscar dados do usuario
    try {
      const response = await api.get("/usuarios");
      setUserData({
        email: response?.data?.email,
        nome: response?.data?.nome,
        id: response?.data?.id,
      });
    } catch (error) {
      console.error("Erro ao buscar dados do usuário", error);
    }
  }

  async function updateUser() {
    try {
      await api.put(`/usuarios`, { nome: userData.nome });
      setAlert({
        show: true,
        message: "Dados atualizados com sucesso",
        type: "success",
      });
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário", error);
      setAlert({
        show: true,
        message: "Erro ao atualizar dados",
        type: "danger",
      });
    }
  }

  async function updatePassword() {
    if (password !== confirmPassword) {
      setAlert({
        show: true,
        message: "As senhas não coincidem",
        type: "danger",
      });
      return;
    }
    if (password.length === 0) {
      setAlert({
        show: true,
        message: "Senha não pode ser vazia",
        type: "danger",
      });
      return;
    }
    try {
      await api.put(`/usuarios/password`, { senha: password });
      setAlert({
        show: true,
        message: "Senha atualizada com sucesso",
        type: "success",
      });
      setEditPassword(false);
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao atualizar senha do usuário", error);
      setAlert({
        show: true,
        message: "Erro ao atualizar senha",
        type: "danger",
      });
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser();
    fetchUserData();
    setEditMode(false);
  };

  const handleEditMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditMode(true);
    setAlert({ show: false, message: "", type: "" });
  };

  return (
    <Template>
      <Container className="mt-4">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>{"Perfil do Usuário"}</Card.Title>
                <FaUser size={100} className="d-block mx-auto my-5" />
                <CustomAlert
                  show={alert.show}
                  message={alert.message}
                  type={alert.type}
                  dismissible
                  onClose={() =>
                    setAlert({ show: false, message: "", type: "" })
                  }
                />
                <Form className="text-start" onSubmit={handleSubmit}>
                  {editPassword ? (
                    <>
                      <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label className="text-start">
                          Nova senha
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={password}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPassword(e.target.value);
                          }}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label className="text-start">
                          Confirme a nova
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setConfirmPassword(e.target.value);
                          }}
                        />
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Group controlId="formName" className="mb-3">
                        <Form.Label className="text-start">Nome</Form.Label>
                        <Form.Control
                          type="text"
                          name="nome"
                          value={userData.nome}
                          onChange={handleChange}
                          readOnly={!editMode}
                          disabled={!editMode}
                        />
                      </Form.Group>
                      <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={userData.email}
                          readOnly
                          disabled
                        />
                      </Form.Group>
                    </>
                  )}
                  <div className="d-flex justify-content-center mt-4">
                    {editPassword ? (
                      <>
                        <Button
                          variant="secondary"
                          className="me-5"
                          onClick={() => {
                            setEditPassword(false);
                            setAlert({ show: false, message: "", type: "" });
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => updatePassword()}
                        >
                          Salvar nova senha
                        </Button>
                      </>
                    ) : editMode ? (
                      <>
                        <Button
                          className="me-5"
                          variant="secondary"
                          onClick={() => {
                            setEditMode(false);
                            setAlert({ show: false, message: "", type: "" });
                          }}
                        >
                          Cancelar
                        </Button>

                        <Button variant="primary" onClick={() => updateUser()}>
                          Salvar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="text-end"
                          variant="warning"
                          onClick={handleEditMode}
                        >
                          Editar
                        </Button>
                        <Button
                          className="ms-5"
                          variant="secondary"
                          onClick={() => {
                            setEditPassword(true);
                            setAlert({ show: false, message: "", type: "" });
                            setPassword("");
                            setConfirmPassword("");
                          }}
                        >
                          Alterar senha
                        </Button>
                      </>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Template>
  );
}
