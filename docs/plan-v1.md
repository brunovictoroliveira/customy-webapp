# Plano v1 — Customy Web App

## Objetivo

Entregar uma primeira versão completa para a apresentação do TCC: autenticação real, dados isolados por usuário, persistência no MongoDB Atlas e publicação da aplicação.

Planejamento sugerido: **5 sprints de uma semana**, ajustáveis à disponibilidade. Express será a API que acessa o banco; MongoDB Atlas será o serviço de banco de dados.

## Sprint 1 — Banco e estrutura do backend

**Objetivo:** preparar a persistência real.

### Atividades

- Revisar os modelos, rotas e controllers existentes.
- Definir a estrutura de isolamento por usuário.
- Criar o cluster gratuito no MongoDB Atlas e conferir os limites vigentes.
- Configurar conexão e variáveis de ambiente, mantendo credenciais fora do repositório.
- Revisar índices e relacionamentos.
- Separar configurações de desenvolvimento e produção.

**Critério de conclusão:** a API conecta ao Atlas, verifica sua disponibilidade e persiste dados. O modelo de propriedade dos registros está definido.

## Sprint 2 — Autenticação e sessão

**Objetivo:** substituir o login local por autenticação real.

### Atividades

- Implementar ou revisar cadastro e login no backend.
- Armazenar senhas com hash.
- Definir validade e armazenamento seguro da sessão.
- Implementar identificação do usuário nas rotas protegidas.
- Conectar cadastro, login e logout do frontend à API.
- Tratar sessão expirada.
- Garantir que novas contas não recebam dados de negócio automaticamente.

**Critério de conclusão:** o usuário consegue cadastrar, entrar e sair. Rotas protegidas rejeitam acesso sem sessão válida. Uma conta nova começa sem clientes, anotações ou agendamentos.

## Sprint 3 — Propriedade e isolamento dos dados

**Objetivo:** garantir acesso apenas aos próprios registros.

### Atividades

- Vincular cada cliente, anotação e agendamento ao usuário responsável.
- Atribuir o proprietário no backend a partir da sessão autenticada, sem confiar em um identificador de usuário enviado pelo frontend.
- Filtrar todas as consultas pelo usuário autenticado.
- Validar propriedade na leitura, edição e exclusão.
- Validar vínculos entre registros, incluindo a associação de anotações e agendamentos a clientes.
- Definir o comportamento ao excluir um cliente com anotações ou agendamentos.

**Critério de conclusão:** dois usuários possuem listas independentes. Tentativas de acessar, alterar, excluir ou vincular registros de outro usuário são rejeitadas, mesmo usando seus identificadores diretamente.

## Sprint 4 — Migração funcional do frontend

**Objetivo:** usar a API real em todas as funcionalidades.

### Atividades

- Migrar clientes, anotações e agenda do mock para a API Express com MongoDB Atlas.
- Padronizar identificadores e respostas da API.
- Centralizar a URL da API e a autenticação das requisições.
- Substituir o endereço fixo localhost:5000 por configuração adequada ao ambiente.
- Tratar carregamento, erros e listas vazias.
- Revisar filtros, datas e horários.
- Retirar a dependência do mock no fluxo principal.
- Executar a importação dos dados de demonstração, caso aprovada, para uma conta específica.

**Critério de conclusão:** todos os fluxos de cadastro, consulta, edição e exclusão funcionam com Atlas. Os dados permanecem após recarregar a página e entrar novamente.

## Sprint 5 — Validação, publicação e preparação da apresentação

**Objetivo:** entregar uma versão demonstrável.

### Atividades

- Executar testes de autenticação, isolamento e relacionamentos.
- Validar formulários, responsividade e mensagens.
- Revisar segurança e configuração de produção.
- Publicar o frontend no Netlify.
- Publicar a API em hospedagem compatível com Node.js/Express, ou adaptar sua execução para Netlify Functions caso essa arquitetura seja escolhida.
- Configurar HTTPS, CORS e variáveis de ambiente.
- Preparar dados e roteiro da demonstração.
- Atualizar documentação de instalação, configuração e operação.
- Ensaiar a apresentação no ambiente publicado, considerando eventuais atrasos de inicialização da hospedagem.

**Critério de conclusão:** a aplicação está publicada e validada por completo no ambiente de produção, com duas contas independentes, lint e build aprovados e roteiro da apresentação testado.

## Decisões necessárias na primeira sprint

### Propriedade dos dados

Cada registro deve pertencer a um usuário para atender ao comportamento solicitado. Como o backend já possui um modelo de organização, decidir se ele será mantido e como se relacionará com esse isolamento.

### Dados atuais do mock

Preservar os dados existentes como dados de demonstração de uma conta específica é a recomendação. Novas contas devem permanecer vazias. A importação precisa ser explícita, sem distribuir os dados existentes para todos os usuários.

### Sessão

Escolher a estratégia considerando que frontend e API poderão estar em domínios diferentes. Documentar armazenamento, expiração, logout e proteção das requisições.

### Hospedagem da API

Definir antes da publicação para validar custos, disponibilidade e eventuais atrasos ao iniciar o serviço. As credenciais do MongoDB devem permanecer exclusivamente no backend.

## Critérios gerais de conclusão

- Cadastro, login, logout e expiração de sessão funcionando.
- Clientes, anotações e agenda persistidos e isolados por usuário.
- Acesso indevido bloqueado pelo backend.
- Todas as telas usando a API real, com tratamento de erros e estados vazios.
- Frontend e API publicados, com credenciais protegidas.
- Testes relevantes, lint e build aprovados.
- Documentação atualizada.
- Demonstração do TCC ensaiada no ambiente publicado.

## Limites desta versão

Este escopo entrega uma primeira versão completa para a apresentação. Recuperação de senha e confirmação de e-mail devem ser incluídas se fizerem parte dos requisitos do TCC ou se a plataforma for aberta ao uso público contínuo.
