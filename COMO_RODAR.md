# Como rodar o projeto localmente

## Pré-requisitos
- Python 3.11+
- Node.js 18+

---

## Backend (FastAPI)

```bash
cd backend

# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
# ou: venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# (Edite o .env com suas configurações)

# Rodar o servidor
uvicorn app.main:app --reload --port 8000
```

O backend estará em: http://localhost:8000  
Documentação automática: http://localhost:8000/docs

---

## Frontend (React + Vite)

```bash
cd frontend

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

O frontend estará em: http://localhost:5173

---

## Primeiro acesso

Ao iniciar o backend pela primeira vez, um administrador é criado automaticamente com as credenciais do `.env`:

- Email: `admin@suaigreja.com`
- Senha: `SenhaForte123`

Acesse http://localhost:5173/login para entrar no painel.

**Importante:** Troque a senha padrão em produção!

---

## Deploy (Produção)

### Backend → Railway ou Render
1. Crie um projeto no Railway/Render
2. Adicione um banco PostgreSQL
3. Configure as variáveis de ambiente (especialmente `DATABASE_URL` e `SECRET_KEY`)
4. Comando de start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend → Vercel
1. Conecte o repositório ao Vercel
2. Configure a pasta raiz como `frontend`
3. Configure a variável `VITE_API_URL` com a URL do backend
4. Em `src/services/api.js`, troque `baseURL: '/api'` por `baseURL: import.meta.env.VITE_API_URL`

---

## Estrutura do projeto

```
devocional-siao/
├── backend/
│   ├── app/
│   │   ├── main.py          # Ponto de entrada
│   │   ├── models.py        # Tabelas do banco
│   │   ├── schemas.py       # Validação de dados
│   │   ├── auth.py          # JWT e autenticação
│   │   ├── config.py        # Configurações
│   │   ├── database.py      # Conexão com banco
│   │   └── routers/         # Endpoints da API
│   ├── requirements.txt
│   └── .env
└── frontend/
    └── src/
        ├── pages/           # Páginas
        │   └── admin/       # Painel administrativo
        ├── components/      # Componentes reutilizáveis
        ├── contexts/        # Estado global (auth)
        └── services/        # Chamadas à API
```
