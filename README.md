# Customy Webapp

Sistema de gerenciamento de clientes com histórico de anotações e agenda integrada, baseado no escopo do TCC disponível em `docs/tcc-bruno-victor-de-oliveira-lima-uerj.pdf`.

## Escopo atual

- Login e cadastro com autenticação simulada em `localStorage`.
- Rotas protegidas para as áreas internas.
- Cadastro, listagem, busca, edição e exclusão de clientes.
- Histórico de anotações por cliente.
- Criação, edição, expansão e exclusão de anotações.
- Agenda com cliente, data, horário, observação, edição, exclusão e filtros por cliente/data.
- Persistência real preparada com MongoDB + Mongoose no backend Express.
- Mock preservado com `json-server` em `backend/db.json` para comparacao/desenvolvimento rapido.

## Como rodar

Instale as dependências:

```bash
npm install
```

Configure o ambiente:

```bash
copy .env.example .env
```

Inicie uma instancia local do MongoDB ou configure `MONGODB_URI` no `.env`.

Inicie a API real em um terminal:

```bash
npm run server
```

Para usar o mock antigo com `json-server`:

```bash
npm run server:mock
```

Inicie o frontend em outro terminal:

```bash
npm run dev
```

A API usa `http://localhost:5000`. O Vite informará a URL local do frontend.

Para importar os dados de `backend/db.json` no MongoDB de desenvolvimento:

```bash
npm run db:seed
```

## Acesso de teste

- E-mail: `teste@email.com`
- Senha: `123456`

A UI atual ainda usa autenticação simulada em `localStorage`. O backend real ja possui rotas de autenticacao em `/auth`, documentadas pela modelagem em `docs/modelagem-banco-real.md`. A decisão da fase anterior está registrada em `docs/decisao-autenticacao.md`.

## Validação

```bash
npm run lint
npm run build
```

## Observações

A estrutura visual existente foi mantida com CSS Modules. Os ajustes de estilo feitos nesta etapa adicionam suporte a textarea, estados de erro/vazio e uma agenda mais completa sem substituir a identidade visual do projeto. O arquivo `backend/db.json` agora funciona como seed/mock; a persistência real fica no MongoDB.
