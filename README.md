# 📊 Sistema de Controle Financeiro Pessoal

---

## 1. Contexto do Problema e Solução

### Descrição do Problema

Muitas pessoas e famílias enfrentam dificuldades em manter o controle de suas finanças, resultando em **falta de visibilidade** sobre onde o dinheiro está sendo gasto, dificuldade em **economizar** e, frequentemente, o acúmulo de **dívidas** não planejadas. A ausência de um método simples e eficaz para registrar receitas, despesas e categorizar transações impede a tomada de decisões financeiras informadas.

### ✨ Descrição da Solução

O **Sistema de Controle Financeiro Pessoal** é uma aplicação web robusta, projetada para ser a principal ferramenta do usuário no gerenciamento de suas finanças individuais. A solução propicia:
* O **registro, edição e exclusão** de todas as transações (receitas e despesas).
* A **organização** dessas transações por categorias personalizadas.
* A visualização de um **dashboard interativo** com indicadores financeiros chave, relatórios detalhados e alertas.

Com uma interface moderna e intuitiva, a plataforma oferece uma maneira simples e eficiente de alcançar o controle financeiro.

---

## 2. Instruções para Uso (Usuário Final)

Este guia é voltado para usuários que desejam **apenas utilizar** o sistema em sua máquina local.

### ⚙️ Pré-requisitos
Para rodar a aplicação, você precisará ter o **Node.js** instalado na sua máquina (versão v22.15.0 ou superior é recomendada).

### 🚀 Instalação e Execução

1.  **Baixar o Projeto:**
    * **Opção 1 (Git):** Abra seu terminal e execute:
        ```bash
        git clone [Link do seu Repositório]
        cd [Nome da Pasta do Repositório]
        ```
    * **Opção 2 (Download ZIP):** Baixe e descompacte o arquivo ZIP do repositório.

2.  **Instalar Dependências:**
    * No diretório raiz do projeto, execute:
        ```bash
        npm install
        ```

3.  **Configurar o Banco de Dados (MySQL):**
    * Tenha uma instância do **MySQL** rodando localmente.
    * Crie um novo banco de dados (ex: `finance_db`) e configure as credenciais no arquivo de configuração do backend.

4.  **Iniciar a Aplicação:**
    * Na pasta raiz do projeto, execute o comando de *build* e *start* (o comando pode variar):
        ```bash
        npm start
        ```

5.  **Acessar no Navegador:**
    * Após a inicialização, abra seu navegador e acesse a URL (a porta pode variar):
        ```
        http://localhost:3000
        ```

---

## 3. Instruções para Desenvolvedores (DEVs)

Siga as instruções abaixo para preparar seu ambiente de desenvolvimento:

### 3.1 - Clonar o Projeto
* Execute no terminal:
    ```bash
    git clone [Link do seu Repositório]
    ```
    * _Alternativa: Baixar o zip e descompactar._

### 3.2 - Instalar Dependências
* Navegue até a pasta raiz e execute:
    ```bash
    npm install
    ```

### 3.3 - Executar o Projeto em Modo de Desenvolvimento
* Para iniciar o **backend** e o **frontend** simultaneamente em modo de *hot-reload* (desenvolvimento), execute na pasta raiz:
    ```bash
    npm run dev
    ```
* Em seguida, acesse o *browser* na URL (porta comum para Vite):
    ```
    http://localhost:5173
    ```

---

## 4. Tecnologias

Este projeto foi construído utilizando as seguintes tecnologias:

| Tipo | Tecnologia | Versão | Descrição |
| :--- | :--- | :--- | :--- |
| **Backend** | **Node.js** | v22.15.0 | Plataforma de desenvolvimento para o lado servidor. |
| **Backend** | **Nginx** | v1.29.2 | Servidor web robusto (para produção). |
| **Banco de Dados** | **MySQL** | v3.15.1 | Banco de dados relacional. |
| **Frontend** | **React** | v19.2.0 | Biblioteca para a construção da interface do usuário. |
| **Frontend** | **TypeScript** | v5.8.3 | Linguagem tipada para maior robustez. |
| **Tooling** | **Vite** | v7.1.10 | Ferramenta de *build* e desenvolvimento frontend ultrarrápido. |

---

## 5. Organização do Projeto

O projeto segue uma estrutura modular com separação entre *backend* e *frontend*.

### 📁 Estrutura de Pastas

* **`backend/`**: Contém o código-fonte e a lógica do servidor (API, banco de dados).
    * **`backend/src/controllers/`**: Lógica para lidar com requisições HTTP.
    * **`backend/src/models/`**: Definição dos modelos de dados e interação com MySQL.
    * **`backend/src/routes/`**: Definição das rotas da API.
* **`frontend/`**: Contém todo o código do cliente (React, UI).
    * **`frontend/src/components/`**: Componentes reutilizáveis da interface.
    * **`frontend/src/pages/`**: Telas principais da aplicação.
    * **`frontend/src/services/`**: Lógica para consumo da API.
    * **`frontend/src/utils/`**: Funções auxiliares.
    * **`frontend/public/`**: Arquivos estáticos.
* **`config/`**: Arquivos de configuração globais.
* **`docs/`**: Documentação do projeto.
* **`tests/`**: Arquivos e scripts de testes automatizados.
