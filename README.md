# 📊 Sistema de Controle Financeiro Pessoal

---

## Autores / Desenvolvedores

|           Autor           |                                                                      GitHub                                                                      |
| :-----------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------: |
| **Gabriel Santos Silva**  | <a href="https://github.com/gabrielsan"><img src="https://github.com/gabrielsan.png?size=50" width="50" alt="gabrielsan" title="gabrielsan"></a> |
|  **Marco Antonio Maia**   |   <a href="https://github.com/marco2299"><img src="https://github.com/marco2299.png?size=50" width="50" alt="marco2299" title="marco2299"></a>   |
| **Vitor Gabriel Firmino** |     <a href="https://github.com/vitorpdf"><img src="https://github.com/vitorpdf.png?size=50" width="50" alt="vitorpdf" title="vitorpdf"></a>     |

---

## 1. Contexto do Problema e Solução

### Descrição do Problema

Muitas pessoas e famílias enfrentam dificuldades em manter o controle de suas finanças, resultando em **falta de visibilidade** sobre onde o dinheiro está sendo gasto, dificuldade em **economizar** e, frequentemente, o acúmulo de **dívidas** não planejadas. A ausência de um método simples e eficaz para registrar receitas, despesas e categorizar transações impede a tomada de decisões financeiras informadas.

### 💡 Descrição da Solução

O **Sistema de Controle Financeiro Pessoal** é uma aplicação web robusta, projetada para ser a principal ferramenta do usuário no gerenciamento de suas finanças individuais. A solução propicia:

- O **registro, edição e exclusão** de todas as transações (receitas e despesas).
- A **organização** dessas transações por categorias personalizadas.
- O **gerenciamento de limites** e a emissão de **alertas** para controle de gastos.
- A visualização de um **dashboard interativo** com indicadores financeiros chave e relatórios detalhados.

Com uma interface moderna e intuitiva, a plataforma oferece uma maneira simples e eficiente de alcançar o controle financeiro.

---

## 2. Instruções para Execução Local (Usuário e Desenvolvedor) 🚀

Para executar a aplicação em sua máquina local, o **Backend**, o **Frontend** e o **Banco de Dados** devem ser iniciados separadamente.

### ⚙️ Pré-requisitos

- [**Node.js**](https://nodejs.org/) (versão 14 ou superior).
- [**MySQL 8.0**](https://dev.mysql.com/downloads/) instalado e configurado localmente.

### 2.1 - Clone o Projeto

1. **Clone o repositório:**
      `
   git clone [https://github.com/gabrielsan/TrabalhoPratico_EngenhariaDeSoftware.git](https://github.com/gabrielsan/TrabalhoPratico_EngenhariaDeSoftware.git)
   cd TrabalhoPratico_EngenhariaDeSoftware
   `

### 2.2 - Configuração do Banco de Dados

1. **Instale o MySQL 8.0** em sua máquina.
2. **Execute o script de inicialização** para criar o banco de dados e as tabelas (o script deve estar na pasta `./init-db/`):
      `
   # Certifique-se de que o MySQL está rodando e ajuste o usuário/senha (root) se necessário.
   mysql -u root -p < ./init-db/01-initdb.sql
   `

### 2.3 - Configuração e Execução do Backend (API)

1. **Navegue** até a pasta do backend:
      `
   cd backend
   `
2. **Instale as dependências:**
      `
   npm install
   `
3. **Configure o `.env`:** Crie o arquivo `.env` nesta pasta e insira as variáveis de ambiente necessárias, ajustando-as para o seu ambiente local. É crucial que `HOST_DATABASE` seja **`localhost`**:
      `
   NAME_DATABASE=bd_CastorFinanceiro
   USERNAME_DATABASE=root
   PASSWORD_DATABASE=root
   HOST_DATABASE=localhost
   NODE_ENV=development
  	HOST_NODE=localhost
  	SECRET_KEY=CHAVECRIPTOGRAFIA
  	PORT_NODE=3000
  	PORT_FRONTEND=80
  	PORT_DATABASE=3306
  	MYSQL_ROOT_PASSWORD=root
  	MYSQL_DATABASE=bd_CastorFinanceiro
   `
4. **Execute o backend:**
      `
   node index.js
   `
      O backend estará disponível em: `http://localhost:3000`

### 2.4 - Configuração e Execução do Frontend

1. **Abra um novo terminal** e navegue para a pasta do frontend (voltando ao raiz do projeto primeiro, se necessário):
      `
   cd ../frontend
   `
2. **Instale as dependências:**
      `
   npm install
   `
3. **Execute o frontend** (em modo de desenvolvimento com hot-reload do Vite):
      `
   npm run dev
   `
      O frontend estará disponível em: `http://localhost:5173`

> **Nota:** Para utilizar o sistema, certifique-se de que tanto o **Backend** (`http://localhost:3000`) quanto o **Frontend** (`http://localhost:5173`) estão rodando simultaneamente em terminais separados.

---

## 3. Tecnologias 💻

Este projeto foi construído utilizando as seguintes tecnologias:

| Categoria          | Tecnologia     | Descrição                                                |
| :----------------- | :------------- | :------------------------------------------------------- |
| **Plataforma**     | **Node.js**    | Plataforma de desenvolvimento para o lado servidor.      |
| **Frontend**       | **React**      | Biblioteca para a construção da interface do usuário.    |
| **Linguagem**      | **TypeScript** | Linguagem tipada para maior robustez no desenvolvimento. |
| **Build Tool**     | **Vite**       | Build tool e desenvolvimento frontend ultrarrápido.      |
| **Banco de Dados** | **MySQL**      | Banco de dados relacional (versão 8.0).                  |

---

## 4. Organização do Projeto

Este projeto está organizado nas pastas descritas abaixo, com separação clara entre a lógica do servidor (_backend_) e a interface do usuário (_frontend_).

### 📁 Estrutura de Pastas

- **`backend/`**: Código-fonte da API Node.js.
      _ `backend/index.js`: Ponto de entrada da aplicação.
      _ _Estruturas internas para Controllers, Models e Routes devem estar aqui._
- **`frontend/`**: Código-fonte do cliente React/Vite.
      \* `frontend/src/`: Código principal da interface.
- **`init-db/`**: Contém scripts SQL para a inicialização e criação do banco de dados.
      \* `init-db/01-initdb.sql`: Script principal de criação do DB.
- **`README.md`**: Este arquivo de documentação.

````
 TrabalhoPratico_EngenhariaDeSoftware/
├── backend/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── init-db/
│   └── 01-initdb.sql
└── README.md
 ```
````
