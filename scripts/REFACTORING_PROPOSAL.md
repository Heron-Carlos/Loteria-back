# Proposta de Refatoração do Banco de Dados

## 📋 Problema Atual

A estrutura atual está **desnormalizada**:
- A tabela `users` contém informações que não são do usuário (`mega_sigla`, `quina_sigla`)
- Não existe uma tabela `partners` separada
- A tabela `users` não tem soft delete (`deleted_at`)
- Relacionamentos não estão bem definidos

## ✅ Estrutura Proposta (Normalizada)

### 1. Tabela `users` (Apenas informações do usuário)
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Partner',
  partner_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (partner_id) REFERENCES partners(id)
);
```

**Campos:**
- `id` - Identificador único
- `username` - Nome de usuário (único)
- `password_hash` - Hash da senha
- `role` - Role do usuário ('Partner' | 'Admin')
- `partner_id` - FK para `partners.id` (NULL para Admin)
- `created_at` - Data de criação
- `updated_at` - Data de atualização
- `deleted_at` - Soft delete

### 2. Tabela `partners` (Nova tabela - Informações do parceiro)
```sql
CREATE TABLE partners (
  id VARCHAR(36) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

**Campos:**
- `id` - Identificador único
- `created_at` - Data de criação
- `updated_at` - Data de atualização
- `deleted_at` - Soft delete

### 2.1. Tabela `partner_siglas` (Siglas do parceiro - Relacionamento N:N)
```sql
CREATE TABLE partner_siglas (
  id VARCHAR(36) PRIMARY KEY,
  partner_id VARCHAR(36) NOT NULL,
  game_type VARCHAR(50) NOT NULL,
  sigla VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (partner_id) REFERENCES partners(id),
  UNIQUE(partner_id, game_type, sigla)
);
```

**Campos:**
- `id` - Identificador único
- `partner_id` - FK para `partners.id`
- `game_type` - Tipo de jogo ('Mega' | 'Quina')
- `sigla` - Sigla do parceiro para aquele tipo de jogo
- `created_at` - Data de criação
- `updated_at` - Data de atualização
- `deleted_at` - Soft delete

**Restrição:**
- `UNIQUE(partner_id, game_type, sigla)` - Um partner não pode ter a mesma sigla duplicada para o mesmo game_type

### 3. Tabela `bets` (Já existe, apenas ajustar FK)
```sql
CREATE TABLE bets (
  id VARCHAR(36) PRIMARY KEY,
  player_name VARCHAR(255) NOT NULL,
  game_type VARCHAR(50) NOT NULL,
  selected_numbers JSONB NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  partner_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (partner_id) REFERENCES partners(id)
);
```

## 🔗 Relacionamentos

```
users (1) ----< (0..1) partners
partners (1) ----< (*) partner_siglas
partners (1) ----< (*) bets
```

- **users.partner_id** → **partners.id** (FK, pode ser NULL)
- **partner_siglas.partner_id** → **partners.id** (FK, NOT NULL)
- **bets.partner_id** → **partners.id** (FK, NOT NULL)

### Exemplo de Uso

Um partner pode ter múltiplas siglas:
- **Partner "Jorge Ermelindo" (ID: abc-123)**
  - Mega: "JE", "JRG"
  - Quina: "JRG", "JE2"

Na hora de fazer a aposta, será mostrado:
- Jorge Ermelindo - JE (Mega)
- Jorge Ermelindo - JRG (Mega)
- Jorge Ermelindo - JRG (Quina)
- Jorge Ermelindo - JE2 (Quina)

## 📊 Benefícios da Refatoração

1. **Normalização**: Cada tabela tem uma responsabilidade única
2. **Manutenibilidade**: Mais fácil de alterar informações de parceiros
3. **Consistência**: Todas as tabelas têm soft delete
4. **Relacionamentos claros**: FKs bem definidas
5. **Performance**: Consultas mais eficientes com JOINs
6. **Escalabilidade**: Fácil adicionar novos campos em partners

## 🔄 Migração

A migração precisará:
1. Criar tabela `partners`
2. Criar tabela `partner_siglas`
3. Migrar dados: Para cada `user` com `partner_id`, criar um registro em `partners` (se não existir)
4. Migrar siglas: Para cada `user`, criar registros em `partner_siglas` com `mega_sigla` e `quina_sigla` (se não vazios)
5. Atualizar `users` removendo `mega_sigla` e `quina_sigla`
6. Adicionar `deleted_at` em `users`
7. Adicionar FKs
8. Atualizar código do backend (entidades, repositories, use cases)

### Estratégia de Migração das Siglas

```sql
-- Para cada user que tem partner_id:
-- 1. Criar/verificar partner
-- 2. Criar partner_sigla para mega_sigla (se não vazia)
-- 3. Criar partner_sigla para quina_sigla (se não vazia)
```

## ⚠️ Considerações

- **Dados existentes**: Precisa migrar dados sem perda
- **Código**: Atualizar todas as referências a `megaSigla` e `quinaSigla` em `User`
  - Agora será necessário fazer JOIN com `partner_siglas` para buscar as siglas
  - Retornar array de siglas por game_type no lugar de string única
- **API**: Pode precisar ajustar responses se houver breaking changes
  - Resposta de partners deve retornar array de siglas por game_type
- **Frontend**: Pode precisar ajustar se a estrutura de dados mudar
  - Select de partner na criação de aposta deve mostrar todas as siglas disponíveis
  - Exibir: "Nome do Sócio - Sigla1 (Mega)", "Nome do Sócio - Sigla2 (Mega)", etc.

