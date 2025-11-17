import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Login.css"; // Importe seu arquivo CSS
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import IsDesktop from "../../utils/isDesktop";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const desktop = IsDesktop();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email,
        senha: password,
      });
      login(response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError({
        show: true,
        message: "Credenciais inválidas. Tente novamente.",
      });
    }
  }

  return (
    <div className="login-container">
      <Container>
        <Col lg={12} xl={12}>
          <Row className="d-flex justify-content-center">
            <img src="./logo-login.png" alt="Castor Logo" className="w-25" />
          </Row>
          <Row className="s-flex justify-content-center mb-5">
            <Card
              className={`rounded-4 mt-3 mb-5 ${!desktop ? "w-25" : "w50"}`}
            >
              <Card.Body>
                <Card.Title>Login</Card.Title>
                <CustomAlert
                  message={error.message}
                  dismissible
                  type="danger"
                  show={error.show}
                  onClose={() => setError({ show: false, message: "" })}
                />
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="w-100 text-start">
                      Usuário
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="w-100 text-start">Senha</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Form>
                <Col>
                  {" "}
                  <Button
                    className="rounded-5 px-4 bg-green"
                    onClick={event => handleLogin(event)}
                    type="submit"
                  >
                    <b>Entrar</b>
                  </Button>
                  <p className="my-0 mt-1">ou</p>
                  <Button
                    className="mt-0 p-0"
                    variant="link"
                    onClick={() => navigate("/register")}
                  >
                    Cadastre-se
                  </Button>
                </Col>
              </Card.Body>
            </Card>
          </Row>
        </Col>
      </Container>
    </div>
  );
}
