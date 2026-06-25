# REVISAR TAREFAS ANTIGAS DO PROJETO:

01. Ajustar inserção de nova anotação.

02. Ajustar roteamento do botão New Note na página de Notas de um cliente.

03. Criar formulários de criação e edição de notas.

04. Implementar modal de confirmação de exclusão de cliente
baseado no projeto Tasklist e replicar a mesma lógica para as notas.

05. Criar sistema de cadastro de usuário e autenticação.

06. Criar mecanismo de recuperação de senha.

07. As datas das novas anotações devem ser preenchidas automaticamente com a data atual.

# NOVAS CORREÇÕES 25/06/2026

01. Criar página de dashboard para aparecer após o login do usuário, porque agora temos 
uma agenda, além da lista de cliente, e a lista de anotações só aparece dentro da página 
de um cliente específico.

02. Refinar border radius inferior do componente de anotação de um cliente, de modo que 
quando a anotação não está expandido, aparecendo apenas o título da anotação, o bloco do 
componente de anotação tenha as 4 bordas arredondadas, independente de estar retraído ou 
expandido.

03. Remover borda amarela presente no modal de confirmação de exclusão de anotação.
Aproveite a ação, faça a verificação nos demais estilos do app, com o objetivo de 
padronizar o estilo nos demais modais, removendo a borda amarela.

04. Ajustar gap/padding/margin de todos os botões de ação da aplicação.
Encontrei o problema na página de cliente, nos botões de ação 'nova anotação' e 'voltar'.

05. Na página de cliente, trocar o número de telefone exibido logo abaixo do nome, por 
um botão clicável chamado 'Informações do cliente', nesta nova página a ser criada
deve constar todos os campos preenchidos no ato do cadastro do cliente:
Nome, telefone, e-mail e observação.

06. Crie no formulário de cadastro de cliente, na página de cliente, no formulário de edição 
de cliente, no banco de dados e na estrutura do frontend e do backend o campo de data de 
nascimento, com o objetivo futuro de mostrar uma lista de aniversariantes do mês, e usar 
estes dados de idade para análises estatísticas, com o objetivo de melhorar o negócio do 
usuário.

07. Na página do cliente, aproveite o ícone de edição já existente no projeto e crie um botão 
de edição, funcional, ao lado do botão clicável 'Informações do cliente', levando a um formulário
de edição dos dados do cliente, seguinte os padrões dos formulários de edição já existentes no app.
Faça as devidas alterações no backend, referentes a essa nova funcionalidade.

08. Aumentar espaçamento entre linhas do campo de anotação.

09. Alterar placeholder da busca de cliente para 'Digite o nome do(a) cliente'.

----------------------------------------------------------------------------------------------------

10. [Página Agenda] Trocar input dropdown por lógica de busca, deixando a UI mais limpa.

11. [Página Agenda] ostrar na primeira tela da agenda, os agendamentos do dia atual, organizados por 
hora, em ordem crescente.

12. [...]






