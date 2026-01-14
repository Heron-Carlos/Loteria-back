# Loteria Backend

Backend do sistema de loteria desenvolvido em Node.js com TypeScript, seguindo Clean Architecture e princípios SOLID.

## Stack Tecnológica

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Framework**: Express
- **Banco de Dados**: PostgreSQL
- **Validação**: Zod
- **Autenticação**: JWT
- **Exportação**: ExcelJS

## Estrutura do Projeto

```
src/
├── domain/              # Camada de domínio (entidades e interfaces)
│   ├── entities/
│   └── interfaces/
├── application/          # Camada de aplicação (casos de uso e serviços)
│   ├── use-cases/
│   ├── services/
│   ├── types/
│   └── validators/
└── infrastructure/       # Camada de infraestrutura (repositórios, controllers, rotas)
    ├── controllers/
    ├── routes/
    ├── repositories/
    ├── database/
    └── middleware/
```

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente criando um arquivo `.env` baseado no `.env.example`:
```bash
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=loteria_db

JWT_SECRET=seu-secret-jwt-super-seguro
JWT_EXPIRATION_HOURS=24
```

3. Execute as migrações do banco de dados:
```bash
# Crie o banco de dados PostgreSQL
psql -U postgres -c "CREATE DATABASE loteria_db;"

# Execute as migrações
psql -U postgres -d loteria_db -f src/infrastructure/database/migrations.sql
```

4. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

5. Para produção:
```bash
npm run build
npm start
```

## Regras de Negócio

- **Mega**: 10 números entre 1 e 60
- **Quina**: 10 números entre 1 e 80
- Cada aposta deve estar associada a um PartnerId
- Apenas o dono da aposta pode atualizar ou excluir

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/partners` - Listar sócios

### Apostas
- `POST /api/bets` - Criar aposta
- `GET /api/bets/partner` - Listar apostas do sócio (autenticado)
- `POST /api/bets/partner/export` - Exportar apostas do sócio (autenticado)
- `PUT /api/bets/:id/paid` - Atualizar status de pagamento (autenticado)
- `DELETE /api/bets/:id` - Excluir aposta (autenticado)

## Princípios Aplicados

- **Clean Code**: Funções pequenas, responsabilidade única, early returns
- **Imutabilidade**: Apenas `const`, nunca `let` ou `var`
- **Clean Architecture**: Separação clara de responsabilidades
- **SOLID**: Cada classe/interface tem uma única responsabilidade

