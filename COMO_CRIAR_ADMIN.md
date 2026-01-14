# Como Criar Usuário Admin

Este guia explica como criar o usuário administrador no sistema.

## Informações do Admin

- **Nome**: Jorge Ermelindo
- **Username**: jorgeermelindo
- **Role**: Admin
- **Mega Sigla**: JE
- **Quina Sigla**: JRG

## Passo a Passo

### 1. Certifique-se de que o banco de dados está configurado

Verifique se o arquivo `.env` está configurado corretamente com as credenciais do PostgreSQL:

```env
DB_HOST=seu-host
DB_PORT=5432
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_NAME=loteria_db
DB_SSL=true
```

### 2. Execute o script de criação

No diretório `Loteria-back`, execute:

```bash
npm run create-admin
```

### 3. Digite a senha

O script irá solicitar:
1. Digite a senha para o usuário admin (mínimo 6 caracteres)
2. Confirme a senha

### 4. Confirmação

Se tudo estiver correto, você verá:

```
✅ Usuário admin criado com sucesso!

ID: [uuid-gerado]
Username: jorgeermelindo
Role: Admin
Mega Sigla: JE
Quina Sigla: JRG
```

## Observações

- O script verifica se o usuário já existe antes de criar
- A senha é criptografada usando bcrypt antes de ser armazenada
- O `partner_id` será `NULL` para usuários Admin
- O script gera automaticamente um UUID único para o ID do usuário

## Atualizar Admin Existente

Se você já criou o admin anteriormente e ele não aparece na lista de sócios, você precisa atualizar o `partner_id`:

```bash
npm run update-admin
```

Este comando irá:
- Verificar se o admin existe
- Atualizar o `partner_id` para ser igual ao `id` do usuário
- Permitir que o admin apareça na lista de sócios para criação de apostas

## Solução de Problemas

### Erro: "O usuário já existe"
- O usuário `jorgeermelindo` já foi criado anteriormente
- Se precisar recriar, primeiro delete o usuário do banco de dados

### Select de sócios está vazio
- Execute `npm run update-admin` para atualizar o `partner_id` do admin existente
- Certifique-se de que o admin tem `partner_id` definido (deve ser igual ao `id`)

### Erro de conexão com o banco
- Verifique as credenciais no arquivo `.env`
- Certifique-se de que o banco de dados está acessível
- Verifique se as migrations foram executadas

### Erro: "A senha deve ter no mínimo 6 caracteres"
- Use uma senha com pelo menos 6 caracteres

### Partner ID vazio na tabela de apostas
- Certifique-se de que o admin tem `partner_id` definido (execute `npm run update-admin`)
- Verifique se o select de sócios está mostrando o admin corretamente
- Certifique-se de que está selecionando um sócio antes de criar a aposta

