# Plano executável — sprints de até 30 minutos

Este documento decompõe o [Plano v1](./plan-v1.md) em 50 sprints curtas: 10 por semana, cada uma com estimativa máxima de 30 minutos. Ele é um backlog sequencial, não uma promessa de duração; quando uma sprint encontrar uma decisão de produto, credencial ou serviço externo, ela termina com o impedimento documentado em vez de ampliar o escopo.

## Premissas e estado inicial verificado em 2026-10-07

- O backend Express/Mongoose, modelos `User`, `Organization`, `Customer`, `Note` e `Appointment`, JWT, hash de senha e endpoints de autenticação já existem.
- As rotas de negócio ainda não exigem autenticação e os controllers não filtram por proprietário; este é o principal risco técnico das semanas 2 e 3.
- O frontend ainda usa `localStorage` para autenticação e `http://localhost:5000` (o `json-server`) como API.
- A decisão inicial recomendada é manter `organizationId` para evolução futura, mas usar `ownerId` obtido exclusivamente do JWT como regra obrigatória de acesso nesta versão.
- Os dados do mock serão importados somente para a conta de demonstração, mediante aprovação explícita.
- Não incluir segredos em arquivos versionados, commits, logs ou prompts.

## Como executar cada sprint no Codex

Use o modelo **Terra médio** e envie uma sprint por vez. Antes de iniciar a seguinte, confirme o critério de aceite e registre qualquer desvio neste documento ou no PR/commit correspondente.

Modelo de prompt:

```text
Trabalhe somente na sprint <ID> do arquivo docs/plano-sprints-30-min.md.
Objetivo: <objetivo da sprint>.
Limites: não amplie o escopo; não publique, não faça deploy, não crie contas e não exponha segredos.
Ao concluir, mostre os arquivos alterados, os comandos de validação executados e o resultado. Pare se faltar uma decisão ou credencial humana.
```

Para sprints de implementação, acrescente: “Preserve alterações não relacionadas no diretório de trabalho e execute `npm run lint`; execute `npm run build` quando a alteração atingir o frontend.”

## Semana 1 — Fundação, Atlas e contrato da API

| ID | Duração | Sprint | Critério de aceite |
| --- | --- | --- | --- |
| S1.01 | 25 min | Inventariar os modelos, rotas, controllers e serializers existentes e comparar com o Plano v1. | Mapa de lacunas atualizado neste arquivo ou em documento de decisão. |
| S1.02 | 25 min | Definir por escrito `ownerId` como fronteira de autorização e `organizationId` como metadado preparado para futuro multiempresa. | Decisão registrada; nenhuma regra depende de `ownerId` enviado pelo cliente. |
| S1.03 | 20 min | Revisar schemas e índices de `User`, `Organization`, `Customer`, `Note` e `Appointment` contra a decisão. | Lista de índices faltantes ou confirmação de aderência. |
| S1.04 | 20 min | Criar/atualizar `.env.example` com todas as variáveis necessárias, sem valores reais. | Variáveis documentadas e nenhum segredo rastreado pelo Git. |
| S1.05 | 30 min | Criar o cluster MongoDB Atlas, usuário de banco e regra temporária de rede. **Ação humana externa.** | URI obtida e guardada apenas no ambiente local/plataforma; não colá-la no chat. |
| S1.06 | 25 min | Configurar `.env` local com a URI e iniciar a API, validando `GET /health`. | API conectada ao Atlas e health check responde com sucesso. |
| S1.07 | 25 min | Separar e documentar valores de desenvolvimento e produção (CORS, URI, segredo JWT e origem do frontend). | Configuração lida por ambiente, sem endereço de produção fixado no código. |
| S1.08 | 30 min | Executar o seed em banco de desenvolvimento e inspecionar se documentos possuem relações válidas. | Seed concluído e inconsistências registradas/corrigidas. |
| S1.09 | 25 min | Confirmar o formato público de IDs e datas retornados pelos serializers. | Contrato de resposta consistente para clientes, notas e agendamentos. |
| S1.10 | 25 min | Rodar lint, build e uma verificação manual de persistência (criar e ler um registro de teste). | Comandos aprovados e registro persistido no Atlas. |

**Marco da semana:** API conectada a um banco real de desenvolvimento; configuração documentada e sem credenciais no repositório.

## Semana 2 — Autenticação e sessão real

| ID | Duração | Sprint | Critério de aceite |
| --- | --- | --- | --- |
| S2.01 | 20 min | Revisar `register`, `login`, `me`, middleware JWT e regras atuais de senha. | Lacunas e comportamento esperado anotados. |
| S2.02 | 25 min | Validar cadastro: hash bcrypt, e-mail normalizado, usuário ativo e organização criada. | Cadastro retorna somente dados públicos e token. |
| S2.03 | 20 min | Validar login e `GET /auth/me` com token válido, ausente e inválido. | Respostas 200/401 corretas, sem hashes expostos. |
| S2.04 | 25 min | Aplicar `authenticate` às rotas de clientes, notas e agendamentos, preservando públicas somente as rotas de auth e health. | Rota de negócio sem token retorna 401. |
| S2.05 | 25 min | Definir a política de sessão: JWT no `localStorage` nesta versão, expiração configurável e logout local. | Trade-off e comportamento de expiração documentados. |
| S2.06 | 30 min | Substituir `src/services/auth.js` simulado por cliente de autenticação da API, mantendo interface clara para as telas. | Cadastro, login, logout e leitura de sessão usam API/token. |
| S2.07 | 25 min | Criar interceptor Axios para anexar `Authorization: Bearer <token>` e tratar 401 removendo a sessão. | Requisições autenticadas recebem token; sessão expirada redireciona de forma previsível. |
| S2.08 | 25 min | Conectar as telas de cadastro e login ao novo serviço e mostrar erros da API em português adequado. | Fluxos visuais funcionam contra a API local. |
| S2.09 | 25 min | Verificar que usuário recém-cadastrado não recebe dados de negócio nem dados do seed. | Nova conta lista clientes, notas e agenda vazios. |
| S2.10 | 30 min | Executar testes manuais de cadastro, login, logout, token inválido e recarga da página; rodar lint/build. | Evidências registradas; lint/build aprovados. |

**Marco da semana:** autenticação do frontend e backend integrada; acesso anônimo a dados de negócio bloqueado.

## Semana 3 — Propriedade e isolamento de dados

| ID | Duração | Sprint | Critério de aceite |
| --- | --- | --- | --- |
| S3.01 | 25 min | Ajustar criação de cliente para atribuir `ownerId` e organização no backend a partir de `req.user`. | Corpo enviado pelo frontend não consegue escolher proprietário. |
| S3.02 | 25 min | Filtrar listagem, busca e leitura de clientes por proprietário autenticado. | IDs de outro usuário resultam em 404/403 conforme decisão documentada. |
| S3.03 | 25 min | Filtrar edição e exclusão de clientes por proprietário e manter exclusão lógica em cascata. | Um usuário não edita nem exclui cliente alheio. |
| S3.04 | 25 min | Ajustar criação e listagem de notas com proprietário e cliente do mesmo usuário. | Não é possível criar nota em cliente de outro usuário. |
| S3.05 | 25 min | Aplicar validação de proprietário a leitura, edição e exclusão de notas. | Tentativas cruzadas são rejeitadas. |
| S3.06 | 25 min | Ajustar criação e listagem de agendamentos com proprietário e cliente do mesmo usuário. | Não é possível agendar para cliente alheio. |
| S3.07 | 25 min | Aplicar validação de proprietário a leitura, edição e exclusão de agendamentos. | Tentativas cruzadas são rejeitadas. |
| S3.08 | 20 min | Revisar consultas e índices após os filtros por `ownerId`; adicionar apenas índices necessários. | Consultas frequentes usam filtros/indexação coerentes. |
| S3.09 | 30 min | Criar ou atualizar roteiro reprodutível de teste com duas contas e tentativas cruzadas por HTTP. | Todas as operações cruzadas falham; operações próprias funcionam. |
| S3.10 | 30 min | Executar roteiro de isolamento, seed controlado, lint e build. | Evidência dos dois usuários isolados e validações aprovadas. |

**Marco da semana:** o backend é a autoridade de acesso; nenhum identificador fornecido pelo frontend quebra o isolamento.

## Semana 4 — Migração completa do frontend

| ID | Duração | Sprint | Critério de aceite |
| --- | --- | --- | --- |
| S4.01 | 20 min | Centralizar URL da API em `VITE_API_URL`, com fallback local apropriado e exemplo documentado. | Nenhuma tela depende diretamente de `localhost:5000`. |
| S4.02 | 25 min | Adaptar o serviço/Redux de clientes ao contrato Express/MongoDB. | Listar e buscar clientes autenticados funciona. |
| S4.03 | 25 min | Adaptar criação, edição e exclusão de clientes e mensagens de erro. | CRUD de cliente funciona sem `json-server`. |
| S4.04 | 25 min | Adaptar o serviço/Redux de notas ao contrato Express/MongoDB. | Histórico de cliente e criação de nota funcionam. |
| S4.05 | 25 min | Adaptar edição e exclusão de notas, incluindo estado após a operação. | Tela reflete a operação sem recarga indevida. |
| S4.06 | 30 min | Adaptar consultas, criação e edição de agendamentos ao contrato real. | Agenda funciona para usuário autenticado. |
| S4.07 | 25 min | Adaptar exclusão, filtros, datas e horários da agenda; validar timezone sem alterar data indevidamente. | Agenda exibe e filtra os dados persistidos corretamente. |
| S4.08 | 25 min | Padronizar estados de carregamento, vazio e erro nas três áreas. | UI informa o estado da requisição e não fica travada. |
| S4.09 | 25 min | Decidir e executar, se aprovada, a importação dos dados de demonstração para uma única conta. | Dados demo aparecem somente na conta definida; novas contas continuam vazias. |
| S4.10 | 30 min | Fazer teste ponta a ponta local: login, cliente, nota, agendamento, recarga, logout e login novamente. | Persistência e interface validadas; lint/build aprovados. |

**Marco da semana:** o fluxo principal não precisa do mock; dados reais persistem entre sessões.

## Semana 5 — Segurança, publicação e demonstração

| ID | Duração | Sprint | Critério de aceite |
| --- | --- | --- | --- |
| S5.01 | 25 min | Revisar variáveis de produção, CORS, Helmet, logs e ausência de segredos versionados. | Checklist de segurança aprovado; nenhum segredo no Git. |
| S5.02 | 25 min | Escolher e documentar a hospedagem da API, custo/limites e estratégia para cold start. **Decisão humana.** | Plataforma e configuração de deploy definidas. |
| S5.03 | 30 min | Configurar o projeto de deploy da API e variáveis de ambiente na plataforma escolhida. **Ação externa autorizada.** | Health check público responde via HTTPS. |
| S5.04 | 25 min | Configurar CORS de produção com a origem exata do frontend e testar preflight. | Navegador acessa a API sem CORS aberto desnecessariamente. |
| S5.05 | 30 min | Publicar o frontend no Netlify com `VITE_API_URL` de produção. **Ação externa autorizada.** | Site HTTPS carrega e chama a API publicada. |
| S5.06 | 25 min | Testar em produção cadastro, login, sessão expirada e logout. | Fluxos de autenticação aprovados. |
| S5.07 | 30 min | Testar em produção dois usuários, CRUD de cliente/nota/agendamento e isolamento cruzado. | Dados isolados e persistentes em produção. |
| S5.08 | 25 min | Revisar responsividade, estados de erro/vazio e acessibilidade básica no ambiente publicado. | Problemas encontrados registrados e os críticos corrigidos. |
| S5.09 | 25 min | Atualizar README: requisitos, variáveis, execução local, seed, arquitetura e operação. | Uma pessoa consegue preparar o projeto sem conhecer o histórico. |
| S5.10 | 30 min | Preparar e ensaiar roteiro de apresentação com conta demo, plano B para cold start e validação final de lint/build. | Demonstração reprodutível e checklist final aprovado. |

**Marco da semana:** aplicação publicada e demonstrável, com duas contas independentes e documentação operacional atualizada.

## Pontos de parada que exigem decisão humana

1. Criar/configurar MongoDB Atlas, liberar rede e inserir a URI em ambiente seguro (S1.05–S1.06).
2. Aprovar a importação dos dados existentes para uma conta demo (S4.09).
3. Escolher a hospedagem da API e autorizar deploy/publicação (S5.02–S5.05).
4. Decidir se recuperação de senha e confirmação de e-mail fazem parte do requisito formal do TCC; caso positivo, criar um ciclo adicional antes da publicação.

## Definição de pronto para cada sprint

- O objetivo e os limites da sprint foram cumpridos sem absorver tarefas vizinhas.
- Código alterado tem lint aprovado; alterações de frontend também têm build aprovada.
- Uma validação proporcional foi executada e relatada.
- Nenhum dado sensível foi adicionado ao repositório ou exibido no resultado.
- Se houver bloqueio externo ou decisão de produto, ele foi documentado e a sprint foi encerrada.
