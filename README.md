# Customy Webapp

Aplicacao React + Vite para gerenciamento de clientes, anotacoes e agenda.

## Onde paramos

- A interface ainda usa autenticacao simulada no localStorage.
- As telas consomem a API em http://localhost:5000.
- O caminho mais rapido para continuar o desenvolvimento e usar o mock com json-server.
- O backend Express com MongoDB/Mongoose ja esta preparado, mas o mock segue preservado para testes rapidos.

## Como rodar o projeto

### 1. Instale as dependencias

~~~bash
npm install
~~~

### 2. Suba o back end

Para desenvolvimento rapido, use a API mock com json-server. Ela usa os dados de backend/db.json e roda em http://localhost:5000.

~~~bash
npm run server:mock
~~~

Endpoints principais do mock:

~~~text
http://localhost:5000/customers
http://localhost:5000/notes
http://localhost:5000/appointments
~~~

### 3. Suba o front end

Em outro terminal, rode:

~~~bash
npm run dev
~~~

Abra a URL informada pelo Vite. Neste projeto, a porta configurada e:

~~~text
http://localhost:4000
~~~

Acesso de teste da interface:

~~~text
E-mail: teste@email.com
Senha: 123456
~~~

## Opcional: API real com MongoDB

Se quiser usar o backend Express com MongoDB em vez do mock, crie o arquivo .env:

~~~bash
copy .env.example .env
~~~

Inicie um MongoDB local ou ajuste MONGODB_URI no .env.

Se quiser importar os dados iniciais:

~~~bash
npm run db:seed
~~~

Suba a API real:

~~~bash
npm run server
~~~

Depois, em outro terminal, suba o frontend:

~~~bash
npm run dev
~~~

## Validacao

~~~bash
npm run lint
npm run build
~~~
