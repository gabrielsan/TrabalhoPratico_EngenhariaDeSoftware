# 📊 Sistema de Controle Financeiro Pessoal

---

## 👥 Autores / Desenvolvedores

| Autor | GitHub |
| :---: | :---: |
| **Gabriel Santos Silva** | <a href="[https://github.com/autor-A]https://github.com/gabrielsan)"><img src="https://github.com/autor-A.png?size=80" width="80" alt="autor-A" title="autor-A"></a> |
| **Marco Antonio Maia** | <a href="https://github.com/autor-B"><img src="https://github.com/autor-B.png?size=80" width="80" alt="autor-B" title="autor-B"></a> |
| **Vitor Gabriel Firmino** | <a href="https://github.com/autor-c"><img src="https://github.com/autor-B.png?size=80" width="80" alt="autor-B" title="autor-B"></a> |

## 1. Contexto do Problema e Solução

### 😔 Descrição do Problema

Muitas pessoas e famílias enfrentam dificuldades em manter o controle de suas finanças, resultando em **falta de visibilidade** sobre onde o dinheiro está sendo gasto, dificuldade em **economizar** e, frequentemente, o acúmulo de **dívidas** não planejadas. A ausência de um método simples e eficaz para registrar receitas, despesas e categorizar transações impede a tomada de decisões financeiras informadas.

### ✨ Descrição da Solução

O **Sistema de Controle Financeiro Pessoal** é uma aplicação web robusta, projetada para ser a principal ferramenta do usuário no gerenciamento de suas finanças individuais. A solução propicia:
* O **registro, edição e exclusão** de todas as transações (receitas e despesas).
* A **organização** dessas transações por categorias personalizadas.
* O **gerenciamento de limites** e a emissão de **alertas** para controle de gastos.
* A visualização de um **dashboard interativo** com indicadores financeiros chave e relatórios detalhados.

Com uma interface moderna e intuitiva, a plataforma oferece uma maneira simples e eficiente de alcançar o controle financeiro.

---

## 2. Instruções para Uso (Usuário Final)

Este guia é voltado para usuários que desejam **apenas utilizar** o sistema. A forma mais simples de colocar a aplicação para rodar é utilizando o **Docker Compose**.

### ⚙️ Pré-requisitos
* [**Docker**](https://www.docker.com/) e [**Docker Compose**](https://docs.docker.com/compose/) instalados.

### 🚀 Passos para Execução com Docker

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/gabrielsan/TrabalhoPratico_EngenhariaDeSoftware.git](https://github.com/gabrielsan/TrabalhoPratico_EngenhariaDeSoftware.git)
    cd TrabalhoPratico_EngenhariaDeSoftware
    ```

2.  **Execute os containers:**
    * Este comando construirá a aplicação (Frontend e Backend), configurará o MySQL e o Nginx:
    ```bash
    docker-compose up -d --build
    ```

3.  **Acesse a aplicação no navegador:**
    * O servidor web (Nginx) estará disponível na porta 80.
    ```
    http://localhost
    ```

---

## 3. Instruções para Desenvolvedores (DEVs)

Siga estas instruções para configurar o ambiente e desenvolver no projeto, utilizando a execução local.

### ⚙️ Pré-requisitos para Desenvolvimento
* [**Node.js**](https://nodejs.org/) (versão 14 ou superior).
* [**MySQL 8.0**](https://dev.mysql.com/downloads/) instalado e configurado localmente.

### 3.1 - Clone o Projeto

* Execute o comando no seu terminal:
    ```bash
    git clone [https://github.com/gabrielsan/TrabalhoPratico_EngenhariaDeSoftware.git](https://github.com/gabrielsan/TrabalhoPratico_EngenhariaDeSoftware.git)
    cd TrabalhoPratico_EngenhariaDeSoftware
    ```

### 3.2 - Configuração do Banco de Dados

1.  Instale o MySQL 8.0.
2.  Execute o script de inicialização para criar o banco e as tabelas (o script deve estar na pasta `./init-db/`):
    ```bash
    mysql -u root -p < ./init-db/01-initdb.sql
    ```

### 3.3 - Configuração e Execução do Backend

1.  **Navegue** até a pasta do backend:
    ```bash
    cd backend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure o `.env`:** Crie o arquivo `.env` nesta pasta e insira as variáveis de ambiente necessárias, ajustando-as para o seu ambiente local (garanta que `PORT_NODE` seja 3000 e `HOST_DATABASE` seja `localhost`):
    ```env
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
    ```
4.  **Execute o backend:**
    ```bash
    node index.js
    ```
    O backend estará disponível em: `http://localhost:3000`

### 3.4 - Configuração e Execução do Frontend

1.  **Abra um novo terminal** e navegue para a pasta do frontend (voltando ao raiz do projeto primeiro, se necessário):
    ```bash
    cd ../frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Execute o frontend** (em modo de desenvolvimento com hot-reload do Vite):
    ```bash
    npm run dev
    ```
    O frontend estará disponível em: `http://localhost:5173`

---

## 4. Tecnologias

Este projeto foi construído utilizando as seguintes tecnologias:

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Plataforma** | **Node.js** | Plataforma de desenvolvimento para o lado servidor. |
| **Frontend** | **React** | Biblioteca para a construção da interface do usuário. |
| **Linguagem** | **TypeScript** | Linguagem tipada para maior robustez no desenvolvimento. |
| **Build Tool** | **Vite** | Build tool e desenvolvimento frontend ultrarrápido. |
| **Banco de Dados** | **MySQL** | Banco de dados relacional (versão 8.0). |
| **Infraestrutura** | **Docker** | Containerização da aplicação para ambientes padronizados. |
| **Servidor Web** | **Nginx** | Servidor web utilizado para produção. |

---

## 5. Organização do Projeto

Este projeto está organizado nas pastas descritas abaixo, com separação clara entre a lógica do servidor (*backend*) e a interface do usuário (*frontend*).

### 📁 Estrutura de Pastas

* **`backend/`**: Código-fonte da API Node.js.
    * `backend/index.js`: Ponto de entrada da aplicação.
    * _Estruturas internas para Controllers, Models e Routes devem estar aqui._
* **`frontend/`**: Código-fonte do cliente React/Vite.
    * `frontend/src/`: Código principal da interface.
* **`init-db/`**: Contém scripts SQL para a inicialização e criação do banco de dados.
    * `init-db/01-initdb.sql`: Script principal de criação do DB.
* **`docker-compose.yml`**: Arquivo de configuração para orquestração de containers Docker.
* **`README.md`**: Este arquivo de documentação.


```
TrabalhoPratico_EngenhariaDeSoftware/
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── init-db/
│   └── 01-initdb.sql
├── docker-compose.yml
├── .dockerignore
└── README.md
```
