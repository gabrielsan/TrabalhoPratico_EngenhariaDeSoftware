import { useEffect } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div className="App">
      <header className="header">
        <div className="logo-lp">
          <img
            src="./logo-cadastro.png"
            alt="Castor Logo"
            className="logo-img"
          />
        </div>
      </header>
      <section className="hero">
        <p className="impact-text">
          Transforme sua gestão financeira com facilidade. Controle total,
          decisões inteligentes.
        </p>
        <div className="buttons">
          <button className="btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn" onClick={() => navigate("/register")}>
            Criar conta
          </button>
        </div>
      </section>
      <section className="benefits">
        <div className="benefit-card">
          <b>Organização e Controle Detalhado das Finanças</b>
          <p>
            Com o Castor, você pode registrar e categorizar todas as suas
            transações financeiras, proporcionando uma visão clara de onde seu
            dinheiro está sendo alocado. Mantenha suas finanças organizadas e
            tome decisões financeiras mais informadas com facilidade.
          </p>
          <img
            src="../public/organizacao.png"
            alt="Segurança e Personalização"
            className="card-image"
          />
        </div>
        <div className="benefit-card">
          <b>Relatórios Completos e Personalizados</b>
          <p>
            Acesse uma gama de relatórios que oferecem uma visão abrangente do
            seu comportamento financeiro. Identifique padrões de gastos e áreas
            para economizar com relatórios detalhados, como "Gastos por
            Categoria" e "Transações por Categoria".
          </p>
          <img
            src="../public/relatorios.png"
            alt="Segurança e Personalização"
            className="card-image"
          />{" "}
        </div>
        <div className="benefit-card">
          <b>Segurança e Personalização</b>
          <p>
            Gerencie suas finanças de forma segura com contas protegidas por
            senha. O Castor permite total flexibilidade para adicionar, editar
            ou remover transações e categorias conforme suas necessidades,
            garantindo que o sistema sempre reflita sua realidade financeira
            atual.
          </p>
          <img
            src="../public/seguranca.png"
            alt="Segurança e Personalização"
            className="card-image"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
