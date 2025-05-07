# Sistema de Coleta de Dados Sicredi

Sistema de coleta de dados Sicredi com página de administração para visualização de submissões

## Características

- Formulário multi-etapas para coleta de dados dos clientes
- Painel administrativo para visualização e gestão dos dados
- Autenticação de usuários administradores
- Armazenamento de dados em banco PostgreSQL
- Interface com identidade visual Sicredi

## Tecnologias Utilizadas

- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle
- **Autenticação**: Passport.js

## Estrutura do Projeto

```
.
├── client/                # Código frontend
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Hooks personalizados
│   │   ├── lib/           # Utilidades e configurações 
│   │   └── pages/         # Páginas da aplicação
├── server/                # Código backend
│   ├── auth.ts            # Configuração de autenticação
│   ├── db.ts              # Configuração do banco de dados
│   ├── routes.ts          # Rotas da API
│   └── storage.ts         # Acesso ao banco de dados
└── shared/                # Código compartilhado
    └── schema.ts          # Esquema do banco de dados
```

## Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o banco de dados PostgreSQL
4. Configure a variável de ambiente `DATABASE_URL`
5. Execute as migrações: `npm run db:push`
6. Inicie o servidor: `npm run dev`

## Acesso Administrativo

- **URL**: /auth
- **Usuário**: admin
- **Senha**: admin123

## Licença

Projeto proprietário - Todos os direitos reservados