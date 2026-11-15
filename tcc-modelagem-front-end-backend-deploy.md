# Modelagem de dados, backend e publicação do sistema Customy

## Organização do frontend

O frontend foi desenvolvido em React e organizado em pastas de acordo com a responsabilidade de cada parte da interface. A pasta `src/pages` reúne as páginas completas do sistema, como login, cadastro, painel, clientes, anotações e agenda. A pasta `src/components` contém elementos reutilizáveis da interface, agrupados por finalidade: componentes globais, elementos de formulário, estrutura de layout e componentes específicos das páginas de clientes e anotações. Os arquivos de estilo ficam em módulos CSS junto dos componentes e páginas correspondentes, enquanto `src/index.css` contém estilos globais.

A navegação entre as páginas é controlada pelo React Router. As rotas de login e cadastro são públicas; as demais passam por um componente de proteção que verifica se existe uma sessão autenticada antes de exibir o conteúdo. A aplicação é montada em `src/main.jsx`, onde também são conectados o React Router, o Redux e a folha de estilos global.

Para compartilhar dados entre diferentes componentes, o projeto utiliza Redux Toolkit. A configuração central do estado fica em `src/redux/store.js`, e os slices de clientes e anotações definem operações assíncronas para consultar e atualizar dados da API. A comunicação HTTP está concentrada em `src/services/api.js`, que configura a URL da API a partir da variável `VITE_API_URL` e inclui o token JWT nas requisições quando há uma sessão salva. As operações de cadastro, login, logout e leitura da sessão ficam em `src/services/auth.js`.

Essa divisão separa a apresentação das páginas, os componentes reutilizáveis, o estado compartilhado e o acesso aos serviços. Com isso, cada área do frontend tem uma responsabilidade mais clara e mudanças em uma parte podem ser feitas sem concentrar toda a lógica em um único arquivo.

## Modelagem do banco de dados

O sistema utiliza MongoDB, um banco de dados não relacional orientado a documentos, com o Mongoose para definir e validar a estrutura dos dados. As informações são organizadas em coleções separadas: **usuários**, **organizações**, **clientes**, **anotações** e **agendamentos**.

Cada cliente pode ter várias anotações e vários agendamentos. Em vez de guardar esses registros dentro do documento do cliente, o sistema mantém anotações e agendamentos em coleções próprias, ligados ao cliente por meio do campo `customerId`. Essa escolha mantém os documentos menores e facilita consultar e atualizar cada tipo de informação.

A estrutura também prevê separar os dados pelo usuário responsável (`ownerId`) e, futuramente, por organização (`organizationId`). Atualmente, as consultas do backend filtram os dados pelo usuário autenticado. As organizações são criadas no cadastro, mas o vínculo `organizationId` ainda não é usado como filtro nas operações de clientes, anotações e agendamentos.

Os esquemas definem campos obrigatórios, limites de tamanho, formatos e valores permitidos. Por exemplo, o sistema valida o formato de e-mail, horários e estados possíveis de um agendamento. Também há índices para campos usados com frequência em buscas, como cliente, responsável, data e e-mail. Registros podem ser marcados como removidos por meio do campo `deletedAt`, sem serem apagados imediatamente do banco.

Na coleção de usuários, a senha é armazenada como hash, e não em texto puro. O modelo também prevê informações para recuperação de senha, estado da conta e perfil de acesso.

## Backend

O backend foi desenvolvido com Node.js e Express e disponibiliza uma API REST para o frontend. A API possui rotas para autenticação, clientes, anotações e agendamentos. Cada rota direciona as requisições para controladores, que aplicam as regras da aplicação e acessam o MongoDB por meio dos modelos Mongoose.

No cadastro e no login, a API verifica os dados do usuário e gera um token JWT. Nas rotas protegidas, um middleware valida esse token e identifica o usuário da requisição. Os controladores usam essa identificação para limitar consultas e alterações aos registros pertencentes ao usuário autenticado. O backend também aplica validações, configurações de CORS, cabeçalhos de segurança e tratamento centralizado de erros.

## Build e publicação

A aplicação está dividida em frontend e backend, publicados como serviços separados. O **Render** hospeda a API: conforme o arquivo de configuração do serviço, o processo instala as dependências com `npm ci` e inicia o servidor com `npm run server`. A API conecta-se ao MongoDB usando a variável de ambiente `MONGODB_URI`; outras configurações, como a chave JWT e as origens permitidas pelo CORS, também são definidas no ambiente do serviço.

O **Netlify** publica o frontend. Durante a publicação, executa `npm run build`, que usa o Vite para gerar os arquivos estáticos de produção na pasta `dist`. Essa pasta é definida como diretório de publicação. A configuração também redireciona as rotas da aplicação para `index.html`, permitindo que páginas internas continuem funcionando quando acessadas diretamente. A variável `VITE_API_URL` informa ao frontend o endereço da API hospedada no Render.

Assim, o navegador carrega a interface publicada no Netlify, e essa interface envia as requisições de dados e autenticação para a API no Render. A API, por sua vez, lê e grava os dados no MongoDB.

## Observação sobre o estado atual da implementação

A documentação do projeto prevê relacionar usuários, organizações e dados comerciais por `organizationId`, mas, no código atual, o isolamento efetivamente aplicado nas rotas é por `ownerId`. Além disso, os arquivos de configuração mostram como Render e Netlify constroem e publicam os serviços; eles não comprovam, por si só, que uma publicação específica foi concluída ou está ativa.
