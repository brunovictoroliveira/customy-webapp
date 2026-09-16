# Customy Web App

Aplicação web para gerenciamento de clientes, anotações e compromissos, desenvolvida com React e Vite.

O projeto explora a construção de uma interface de gerenciamento integrada a uma API REST, permitindo organizar informações de clientes e atividades relacionadas em um único ambiente.

## Funcionalidades

O Customy Web App permite:

- cadastrar e gerenciar clientes;
- criar e organizar anotações;
- registrar e acompanhar compromissos;
- consultar informações através de uma interface centralizada;
- persistir dados através de uma API REST.

## Arquitetura

A aplicação é dividida entre frontend e backend:

```text
Frontend
   ↓
React + Vite
   ↓
API REST
   ↓
Express
   ↓
MongoDB
```

Durante o desenvolvimento, também é possível utilizar uma API mock para executar e testar o frontend sem depender de uma instância do banco de dados.

## Tecnologias

Entre as principais tecnologias utilizadas no projeto estão:

### Frontend

- React;
- Vite;
- JavaScript;
- CSS.

### Backend

- Node.js;
- Express;
- MongoDB;
- Mongoose.

### Desenvolvimento

- JSON Server;
- ESLint;
- npm.

## Desenvolvimento

Instale as dependências:

```bash
npm install
```

### Ambiente com API mock

Para desenvolvimento e testes rápidos do frontend, o projeto possui uma API mock:

```bash
npm run server:mock
```

Em outro terminal, inicie o frontend:

```bash
npm run dev
```

A URL utilizada pelo ambiente de desenvolvimento será informada pelo Vite no terminal.

## Backend com MongoDB

O projeto também possui uma API desenvolvida com Express e MongoDB.

Para configurar o ambiente local, utilize o arquivo `.env.example` como referência para criar seu próprio `.env`.

As variáveis de ambiente e credenciais necessárias para executar os serviços externos devem ser configuradas localmente e não devem ser adicionadas ao repositório.

Com o ambiente configurado, a API pode ser iniciada com:

```bash
npm run server
```

O projeto também possui um script para popular o ambiente de desenvolvimento com dados iniciais:

```bash
npm run db:seed
```

## Validação

Para verificar a qualidade do código:

```bash
npm run lint
```

Para gerar uma build de produção:

```bash
npm run build
```

## Status do projeto

O projeto possui suporte tanto para uma API mock utilizada durante o desenvolvimento quanto para integração com uma API Express e MongoDB.

Algumas funcionalidades podem utilizar implementações simplificadas para fins de demonstração e desenvolvimento.

## Segurança

Arquivos contendo variáveis de ambiente, credenciais ou outras informações sensíveis não devem ser versionados.

Utilize `.env.example` apenas como referência para as variáveis necessárias e mantenha os valores reais exclusivamente no ambiente local ou na plataforma utilizada para deploy.

## License

Este projeto é um software proprietário.

O código-fonte está disponível publicamente apenas para fins de portfólio, análise educacional e avaliação.

Não é concedida permissão para copiar, modificar, distribuir, sublicenciar, vender ou utilizar este software ou qualquer parte de seu código-fonte sem autorização expressa do autor.

Consulte o arquivo [LICENSE](./LICENSE) para obter detalhes.

Copyright © 2026 Bruno Victor. Todos os direitos reservados.
