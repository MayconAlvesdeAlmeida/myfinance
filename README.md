# MyFinance - Sistema de Controle Financeiro

MyFinance é uma aplicação web para controle financeiro pessoal, desenvolvida com React no frontend e Flask no backend, utilizando PostgreSQL como banco de dados.

## 🚀 Tecnologias

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS

### Backend
- Python
- Flask
- PostgreSQL
- psycopg2

### Infraestrutura
- Docker
- Docker Compose
- Nginx
- Gunicorn

## 📋 Pré-requisitos

Para executar o projeto, você precisa ter instalado:

- Docker
- Docker Compose
- Git

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/MayconAlvesdeAlmeida/myfinance.git
cd myfinance
```

2. Copie os arquivos de ambiente:
```bash
# Para o backend
cp backend/env-example backend/.env

# Para o frontend
cp frontend/env-example frontend/.env
```

3. Build do frontend:
```bash
cd frontend
npm install
npm run build
cd ..
```

4. Inicie os containers:
```bash
docker-compose up -d
```

5. Crie as tabelas no banco de dados:
```bash
# Conecte ao container do PostgreSQL
docker exec -it myfinance-db-1 psql -U postgres -d finance

# Cole o conteúdo do arquivo info/001.sql
# Ou execute diretamente:
docker exec -i myfinance-db-1 psql -U postgres -d finance < info/001.sql
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## 🏗️ Estrutura do Projeto

```
myfinance/
├── backend/
│   ├── api/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── routes/
│   │   └── tools/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   └── default.conf
├── info/
│   └── 001.sql    # Script de criação das tabelas
└── docker-compose.yml
```

## 📦 Containers Docker

O projeto utiliza três containers principais:

1. **nginx-proxy**: Servidor web que serve o frontend e faz proxy reverso para a API
2. **flask-api**: API REST em Flask
3. **db**: Banco de dados PostgreSQL

## 🗄️ Banco de Dados

O sistema utiliza PostgreSQL com as seguintes tabelas:

### Users
- Armazena informações dos usuários
- Campos: id, name, email, password, reset_password, active

### Costs (Despesas)
- Registra as despesas dos usuários
- Campos: id, user_id, title, description, value, transaction_date
- Possui índice em user_id para melhor performance

### Receivements (Receitas)
- Registra as receitas dos usuários
- Campos: id, user_id, title, description, value, transaction_date
- Possui índice em user_id para melhor performance

### Statements (Extrato)
- Registra todas as transações (receitas e despesas)
- Campos: id, user_id, type, receivement_id, cost_id, previous_balance, updated_balance, transaction_date
- Mantém histórico do saldo antes e depois de cada transação

### Balances (Saldos)
- Mantém o saldo atual de cada usuário
- Campos: id, user_id, value
- Garante que cada usuário tenha apenas um registro de saldo

### Confirm Registration
- Gerencia a confirmação de registro de novos usuários
- Campos: id, user_id, code, created_at, verified

## 🔒 Variáveis de Ambiente

### Backend (.env)
```
DB_NAME=finance
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
SECRET_KEY=seu_secret_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 🛠️ Desenvolvimento

Para desenvolvimento local:

1. Inicie apenas o banco de dados:
```bash
docker-compose up db -d
```

2. Execute o backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # No Windows: .venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

3. Execute o frontend:
```bash
cd frontend
npm install
npm run dev
```

## 📝 Endpoints da API

### Usuários
- POST /api/users - Criar usuário
- POST /api/users/login - Login

### Despesas
- GET /api/costs - Listar despesas
- POST /api/costs - Criar despesa

### Receitas
- GET /api/receivements - Listar receitas
- POST /api/receivements - Criar receita

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Funcionalidades

- Cadastro e autenticação de usuários
- Registro de despesas e receitas
- Extrato de transações
- Controle de saldo
- Interface responsiva
- API RESTful
- Autenticação JWT
