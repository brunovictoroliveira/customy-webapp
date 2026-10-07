# Plano v2 — entrega da primeira versão em dois dias

## Objetivo

Entregar uma primeira versão publicável do Customy para a apresentação do TCC: frontend hospedado no Netlify, API Express conectada ao MongoDB Atlas e dados isolados por usuário autenticado.

O foco é substituir o fluxo principal que hoje usa `json-server` e autenticação em `localStorage` por uma API real. Este plano não acrescenta funcionalidades novas de negócio.

## Escopo fechado

Incluído:

- MongoDB Atlas como banco de dados.
- API Express existente como única API do frontend.
- Cadastro, login, logout e sessão JWT.
- Clientes, anotações e agendamentos persistidos no MongoDB.
- Dados criados, lidos, editados e excluídos apenas pelo respectivo usuário.
- Publicação do frontend no Netlify e da API em um serviço Node.js separado.
- Validação com duas contas independentes, lint e build.

Fora do escopo desta entrega:

- Recuperação de senha por e-mail, confirmação de e-mail e perfis de equipe.
- Migração ampla de dados antigos; os dados demo só serão importados se sobrar tempo e houver autorização explícita.
- Refatorações visuais, novos recursos de agenda e mudanças de layout.
- Hospedar Express diretamente no Netlify como Functions. Isso exigiria adaptação arquitetural desnecessária para o prazo de dois dias.

## Decisão de arquitetura para o prazo

O Netlify hospeda o **frontend estático**. A API Express deve ser publicada em uma plataforma compatível com Node.js, como Render ou Railway, e conectada ao Atlas. O frontend recebe a URL pública da API por `VITE_API_URL`; a API aceita somente a origem do site Netlify via CORS.

```text
Navegador
  └─ Netlify (React/Vite)
       └─ HTTPS + Bearer JWT
            └─ API Express (Render/Railway)
                 └─ MongoDB Atlas
```

Esta separação reduz o risco técnico e permite manter o backend já existente. A escolha entre Render e Railway deve ser feita no início do Dia 1, de acordo com a conta e disponibilidade do autor.

## Diagnóstico do estado atual

### Já disponível

- Models Mongoose de `User`, `Organization`, `Customer`, `Note` e `Appointment`.
- Campos `ownerId` e `organizationId` nos dados de negócio, além de índices por proprietário.
- Endpoints de cadastro, login, usuário atual e recuperação de senha.
- Hash bcrypt, JWT e middleware `authenticate` prontos.
- Serializers, tratamento de erro, CORS, Helmet, health check e seed para MongoDB.
- Interface React já protegida por rota e telas de clientes, notas e agenda.

### Bloqueios para o comportamento esperado

1. As rotas de clientes, notas e agendamentos não usam o middleware `authenticate`.
2. Os controllers filtram apenas por ID e `deletedAt`; não usam `req.user`, portanto qualquer usuário autenticado poderia consultar registros de outro se conhecesse o ID.
3. Criações não definem `ownerId`; como o campo é opcional no schema, novos registros podem ficar sem proprietário.
4. O frontend autentica em `localStorage` com usuários simulados e não chama os endpoints reais de auth.
5. `src/services/api.js` aponta para `http://localhost:5000`, porta usada pelo mock, sem interceptor JWT e sem variável de ambiente.

### Regra de isolamento escolhida

`ownerId` será a regra obrigatória nesta primeira versão. O backend obtém o proprietário unicamente de `req.user`, extraído do JWT; ele nunca aceita `ownerId` do corpo da requisição.

- Ao cadastrar uma conta, ela começa sem clientes, notas e agendamentos.
- Ao criar cliente, nota ou agendamento, a API salva `ownerId` do usuário autenticado.
- Todas as operações filtram simultaneamente por `_id` (quando aplicável), `ownerId: req.user._id` e `deletedAt: null`.
- Ao criar nota ou agendamento ligado a cliente, a API verifica que o cliente pertence ao mesmo usuário.
- Para não revelar a existência de dados de outro usuário, acesso por ID não pertencente deve responder `404`.
- `organizationId` permanece como estrutura futura. Se preenchido, deve ser derivado no backend, nunca enviado pelo navegador; não é necessário implementar multiempresa agora.

## Registro de execução

### D1.01 — diagnóstico e hospedagem da API

**Executada em 2026-10-07.** O diagnóstico foi confirmado no código: os três routers de negócio não aplicam `authenticate`; os controllers correspondentes não filtram por `ownerId`; `src/services/auth.js` mantém usuários simulados em `localStorage`; e `src/services/api.js` aponta para o mock em `http://localhost:5000`.

Não há configuração existente para Render, Railway ou Netlify no repositório. A hospedagem foi definida como **Render para a API Express**, **Netlify para o frontend** e **MongoDB Atlas Free para o banco**, sem migrar Express para Functions. A próxima sprint é D1.02 (criar e configurar Atlas).

### D1.02 e D1.03 — Atlas e autenticação real

**Executadas em 2026-10-07.** A API foi conectada ao Atlas por meio de `.env` local, que permanece ignorado pelo Git. `GET /health` respondeu `200` com `{"status":"ok"}`. Um usuário de QA foi cadastrado, autenticado e consultado em `GET /auth/me`; as respostas expuseram apenas dados públicos e um token foi emitido sem ser registrado neste documento. Esse usuário pode ser reutilizado nos testes de isolamento da D1.09.

### D1.04 — proteção das rotas de negócio

**Executada em 2026-10-07.** O middleware `authenticate` foi aplicado aos routers de clientes, notas e agendamentos. Em uma instância temporária da API conectada ao Atlas, `GET /customers`, `GET /notes` e `GET /appointments`, todos sem cabeçalho `Authorization`, retornaram `401 Authentication token is required.`. `npm run lint` também foi aprovado.

### D1.05 — propriedade dos clientes

**Executada em 2026-10-07.** Clientes agora recebem `ownerId` exclusivamente de `req.user` no backend. Listagem, busca, leitura, edição e exclusão filtram por esse proprietário e por `deletedAt: null`. O CRUD autenticado foi validado no Atlas: criação, pesquisa, atualização e exclusão lógica funcionaram; a leitura após exclusão retornou `404`. Um `ownerId` incluído artificialmente no corpo da criação foi ignorado. O aviso deprecatório do Mongoose na atualização de cliente também foi removido. `npm run lint` foi aprovado.

### D1.06 — propriedade das anotações

**Executada em 2026-10-07.** Anotações agora recebem `ownerId` do usuário autenticado e todas as operações filtram por esse campo e por `deletedAt: null`. A criação e a atualização validam que o cliente vinculado pertence ao mesmo usuário. O CRUD autenticado foi validado no Atlas com um cliente próprio: criação, listagem, edição e exclusão lógica funcionaram, e a leitura após exclusão retornou `404`. `npm run lint` foi aprovado.

### D1.07 — propriedade dos agendamentos

**Executada em 2026-10-07.** Agendamentos agora recebem `ownerId` do usuário autenticado e todas as operações filtram por esse campo e por `deletedAt: null`. A criação e a atualização validam que o cliente opcional vinculado pertence ao mesmo usuário. O CRUD autenticado foi validado no Atlas com um cliente próprio: criação, listagem, edição e exclusão lógica funcionaram, e a leitura após exclusão retornou `404`. `npm run lint` foi aprovado.

### D1.08 — decisão sobre organização

**Executada em 2026-10-07.** Para esta primeira versão, `ownerId` é a única fronteira de autorização e `organizationId` permanece um campo de preparação para um futuro modelo multiempresa. Novos registros de negócio não o recebem no fluxo normal e, portanto, permanecem com `null`; dados do seed podem mantê-lo apenas como metadado de demonstração. A revisão confirmou que nenhum controller ou regra de acesso consulta `organizationId`, portanto essa decisão não reduz o isolamento já imposto pelo backend. Não foram adicionadas consultas extras ou abstrações fora do escopo.

### D1.09 — teste de isolamento entre contas

**Executada em 2026-10-07.** Duas contas temporárias foram criadas no Atlas. A conta A cadastrou cliente, anotação e agendamento; a conta B recebeu listas vazias e não conseguiu acessar, editar ou excluir nenhum desses registros. Tentativas da conta B de vincular uma anotação ou agendamento ao cliente da conta A também retornaram `404`. Durante a validação, a atualização cruzada de agendamento retornava `400` por validar o payload antes da propriedade; o controller foi ajustado para verificar a propriedade primeiro e o reteste retornou `404`. `npm run lint` foi aprovado.

### D1.10 — validação final do backend

**Executada em 2026-10-07.** `npm run lint` terminou sem erros e `git diff --check` não encontrou problemas de espaços em branco. O Dia 1 está concluído: Atlas conectado, autenticação real validada, rotas de negócio protegidas e dados isolados por usuário no backend.

### D2.01 — URL configurável da API

**Executada em 2026-10-07.** `src/services/api.js` agora lê `VITE_API_URL`, com fallback para `http://localhost:5000` no desenvolvimento local. A variável foi adicionada ao `.env.example`; ela contém somente endereço público, nunca segredo. `npm run lint` e `npm run build` foram aprovados. A build emitiu aviso não bloqueante sobre bundle acima de 500 kB, que fica fora do escopo desta entrega.

### D2.02 — autenticação real no frontend

**Executada em 2026-10-07.** O serviço `src/services/auth.js` deixou de usar usuários simulados e agora chama `/auth/register` e `/auth/login`. A sessão no `localStorage` contém somente token JWT e dados públicos do usuário; dados inválidos são limpos. As telas de login e cadastro passaram a aguardar as requisições, e cadastro bem-sucedido inicia sessão e segue para a agenda. `npm run lint` e `npm run build` foram aprovados.

### D2.03 — token e expiração nas requisições

**Executada em 2026-10-07.** Um interceptor Axios agora adiciona `Authorization: Bearer <token>` a todas as requisições quando há sessão válida. Respostas `401` removem a sessão e retornam o navegador ao login; uma sessão armazenada em formato inválido também é removida. A implementação evita dependência circular entre os serviços de API e autenticação. `npm run lint` e `npm run build` foram aprovados.

### D2.04 — validação visual de autenticação e conta nova

**Executada em 2026-10-07.** No navegador local, uma conta de QA foi criada em `qa-frontend-1791396473953@example.invalid`. O cadastro abriu a agenda já autenticada; agenda e clientes apareceram vazios; logout retornou ao login; e um novo login retornou corretamente à agenda. A sessão exibiu somente o nome público na interface e as listas vazias confirmaram o envio do JWT pelo interceptor. A senha da conta de QA não foi registrada em arquivos versionados. Durante a validação, o CORS local foi ampliado no `.env` para as origens de desenvolvimento nas portas 4000 e 4001; a API principal deve ser reiniciada para carregar essa configuração.

### D2.05 — clientes na API real

**Executada em 2026-10-07.** As telas de clientes já consumiam `/customers` pelo cliente Axios; a adaptação necessária foi remover a exclusão manual de notas no frontend, pois o backend agora executa exclusão lógica em cascata de clientes, anotações e compromissos. A mensagem de confirmação foi atualizada para refletir esse comportamento. No navegador, com a conta de QA, foram validados criação, pesquisa, edição e exclusão de cliente no Atlas; ao final a lista voltou ao estado vazio. `npm run lint` e `npm run build` foram aprovados.

### D2.06 — anotações na API real

**Executada parcialmente em 2026-10-07.** `src/pages/NewNote.jsx` passou a enviar somente o contrato da API (`customerId`, `date`, `title` e `content`), sem metadados simulados. No navegador, uma anotação foi criada e editada com sucesso no Atlas e apareceu no histórico do cliente. A exclusão visual ficou pendente de confirmação explícita e não foi executada; o endpoint de exclusão já havia sido validado na D1.06.

### D2.07 — agenda na API real

**Executada em 2026-10-07.** A agenda já consumia `/customers` e `/appointments` pelo cliente Axios, com os campos compatíveis com o contrato real. Contra a API/Atlas, foi criado e editado um agendamento vinculado ao cliente de QA: a alteração de descrição, horário (14:30–15:30), cor e data foi persistida e retornou na consulta filtrada por data. Após recarregar a interface, o item atualizado apareceu na lista da agenda. A exclusão pela interface permanece para a validação seguinte, quando houver confirmação para remover os dados de QA.

### D2.08 — validação ponta a ponta local

**Executada em 2026-10-07.** Uma segunda conta temporária de QA foi criada pelo endpoint de cadastro; suas listas de clientes, anotações e agendamentos vieram vazias. Com seu token, as tentativas de ler um cliente e um agendamento da primeira conta retornaram `404`. No navegador, a primeira conta manteve a sessão e os dados após recarregar a página; logout retornou ao login e um novo login retornou corretamente à agenda. `npm run lint`, `npm run build` e `git diff --check` foram aprovados. A build mantém somente o aviso não bloqueante sobre o bundle acima de 500 kB.

## Plano de execução

Cada bloco abaixo dura no máximo 30 minutos. Execute em ordem e pare ao final de um bloco se houver credencial, conta externa ou decisão pendente. Não publique segredo em arquivos versionados, logs ou conversas.

### Dia 1 — segurança dos dados e API real

| Bloco | Até | Entrega verificável |
| --- | --- | --- |
| D1.01 | 30 min | Confirmar o diagnóstico acima e escolher a hospedagem da API. Registrar URL planejada e responsável pela conta, sem segredos. |
| D1.02 | 30 min | Criar cluster Atlas, usuário do banco e acesso de rede. Criar `.env` local a partir do exemplo com `MONGODB_URI`, `JWT_SECRET` e origens CORS. Ação humana externa. |
| D1.03 | 25 min | Iniciar API contra Atlas, testar `GET /health` e cadastro/login por HTTP. Confirmar que a senha não aparece nas respostas. |
| D1.04 | 25 min | Proteger as rotas de clientes, notas e agenda com `authenticate`. Confirmar `401` sem token. |
| D1.05 | 30 min | Ajustar controller de clientes: criação com `ownerId`, listagem/busca/leitura/edição/exclusão filtradas por proprietário. |
| D1.06 | 30 min | Ajustar controller de notas: cliente vinculado do mesmo proprietário; CRUD filtrado por proprietário. |
| D1.07 | 30 min | Ajustar controller de agendamentos: cliente opcional validado como próprio; CRUD filtrado por proprietário. |
| D1.08 | 25 min | Resolver como obter/preencher `organizationId` sem ampliar o escopo; manter nulo de modo explícito ou derivá-lo da organização do dono. Documentar a opção. |
| D1.09 | 30 min | Testar com duas contas por HTTP: cada uma cria cliente, nota e agendamento; tentar consultar/editar/excluir usando IDs da outra. Tudo cruzado deve retornar 404. |
| D1.10 | 20 min | Rodar lint e registrar resultado. Corrigir somente falhas introduzidas nesta etapa. |

**Fim de Dia 1:** Atlas conectado; API autenticada; duas contas possuem dados independentes. Se este marco não estiver pronto, não iniciar publicação nem migração visual.

### Dia 2 — frontend, publicação e validação final

| Bloco | Até | Entrega verificável |
| --- | --- | --- |
| D2.01 | 25 min | Criar configuração `VITE_API_URL` e substituir a URL fixa do mock em `src/services/api.js`. |
| D2.02 | 30 min | Trocar o serviço de autenticação simulado por chamadas de cadastro/login à API e persistir apenas token + dados públicos da sessão. |
| D2.03 | 25 min | Adicionar interceptor Axios para `Authorization: Bearer <token>` e tratamento global de `401` (limpar sessão e voltar ao login). |
| D2.04 | 30 min | Validar telas de login/cadastro/logout contra a API; conta recém-criada deve abrir listas vazias. |
| D2.05 | 30 min | Migrar clientes para a API real e validar CRUD, pesquisa e mensagens de erro. |
| D2.06 | 30 min | Migrar notas para a API real e validar criação, edição, exclusão e histórico por cliente. |
| D2.07 | 30 min | Migrar agenda para a API real e validar criação, edição, exclusão, filtros e horários. |
| D2.08 | 25 min | Executar teste ponta a ponta local: duas contas, isolamento, recarga da página, logout e novo login. Rodar lint e build. |
| D2.09 | 30 min | Publicar a API no serviço escolhido, configurar variáveis de ambiente e testar `/health` por HTTPS. Ação externa autorizada. |
| D2.10 | 25 min | Criar site no Netlify, configurar `VITE_API_URL` pública e publicar. Ação externa autorizada. |
| D2.11 | 25 min | Atualizar CORS da API com a origem exata do Netlify e testar o login pelo navegador publicado. |
| D2.12 | 30 min | Validar produção: duas contas, isolamento de dados, CRUD completo, `npm run lint`, `npm run build` e roteiro de demonstração. |

**Fim de Dia 2:** aplicação publicada, dados persistentes e isolados, fluxo de apresentação testado.

## Critérios de aceite finais

- Um visitante sem JWT recebe `401` ao acessar qualquer endpoint de clientes, notas ou agendamentos.
- Uma nova conta possui listas vazias.
- Os documentos criados têm `ownerId` do usuário autenticado, definido no backend.
- Uma conta não consegue listar, ler, editar, apagar ou relacionar um registro de outra conta, nem conhecendo seu ID.
- Os fluxos de cliente, anotação e agenda usam a API Express/Atlas, não `json-server`.
- A recarga da página preserva a sessão válida; token inválido ou expirado encerra a sessão de forma segura.
- O frontend publicado no Netlify consegue acessar a API por HTTPS com CORS restrito à origem esperada.
- `npm run lint` e `npm run build` terminam sem erro.

## Plano de contingência

Se a publicação for bloqueada por uma conta externa, entregar o backend conectado ao Atlas e o frontend validado localmente com `VITE_API_URL`, mantendo uma gravação ou demonstração local como contingência. O bloqueio e a configuração necessária devem ficar documentados, mas não se deve trocar a arquitetura por Netlify Functions no final do prazo.

## Prompt de execução para o Codex (Terra médio)

```text
Execute somente o bloco <ID> de docs/plan-v2.md no repositório atual.
Não amplie o escopo, não modifique arquivos não relacionados e não exponha segredos.
Antes de editar, confirme o estado relevante do código. Ao terminar, apresente: arquivos alterados, validação executada, resultado e qualquer bloqueio que exija ação humana. Use npm run lint; se tocar o frontend, também use npm run build.
```
