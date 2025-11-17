import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Dashboard from "../pages/Dashboard/Dashboard";
import LandingPage from "../pages/LandingPage/LandingPage";
import Usuario from "../pages/Usuario/Usuario";

import { useAuth } from "../context/AuthContext";

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <LandingPage />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Cadastro />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Login />}
          />
          <Route
            path="/usuario"
            element={isAuthenticated ? <Usuario /> : <Login />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}
