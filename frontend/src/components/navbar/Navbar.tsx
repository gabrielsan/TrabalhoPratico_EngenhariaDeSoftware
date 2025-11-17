import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { BsGraphUpArrow } from "react-icons/bs";
import { CiShoppingTag } from "react-icons/ci";
import { TbArrowsTransferDown } from "react-icons/tb";
import { BsFileEarmarkRuled } from "react-icons/bs";
import "./NavigationBar.css"; // Importe o arquivo CSS
import api from "../../services/api";

export default function NavigationBar() {
  const { isAuthenticated, logout } = useAuth();
  const [name, setName] = React.useState("");

  async function fetchUserData() {
    try {
      const response = await api.get("/usuarios");
      setName(response?.data?.nome);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário", error);
    }
  }

  React.useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/dashboard"
          className="d-flex align-items-center"
        >
          <img src="./logo-navbar.png" alt="Castor Financeiro Logo" className="navbar-logo" />{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  <BsGraphUpArrow className="mb-1 me-1" /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/categorias">
                  <CiShoppingTag className="mb-1" size={20} /> Categorias
                </Nav.Link>
                <Nav.Link as={Link} to="/transacoes">
                  <TbArrowsTransferDown className="mb-1" /> Transações
                </Nav.Link>
                <Nav.Link as={Link} to="/relatorios">
                  <BsFileEarmarkRuled className="me-1 mb-1" />
                  Relatórios
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Registro
                </Nav.Link>
              </>
            )}
          </Nav>

          <Dropdown title={"Usuário"} id="basic-nav-dropdown">
            <Dropdown.Toggle
              className="d-flex align-items-center"
              variant="light"
              id="dropdown-basic"
            >
              <p className="mb-0 me-2 d-flex">{name}</p>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/usuario">
                Perfil
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout}>Sair</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
