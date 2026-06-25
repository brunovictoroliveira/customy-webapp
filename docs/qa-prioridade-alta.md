# QA das tarefas de prioridade alta

Data: 2026-06-25

## Resultado

A validação funcional passou para os fluxos de dados principais consumidos pela interface:

- Criar, editar e excluir cliente.
- Criar, editar e excluir anotação vinculada ao cliente.
- Criar, editar, filtrar e excluir agendamento vinculado ao cliente.
- Limpeza dos dados de QA após o teste.
- `npm run lint` passou.
- `npm run build` passou.

## Observação sobre navegador

O QA visual no navegador interno iniciou e validou login, criação de cliente, busca de cliente, abertura de histórico, criação de nota, expansão de nota e edição de nota. Durante a exclusão com `window.confirm`, a aba interna ficou instável. Para resolver a causa, as confirmações nativas foram substituídas por um modal próprio em React.

Depois da instabilidade da aba, o navegador interno desta sessão não voltou a carregar a página de forma confiável. Por isso, a etapa final foi validada por chamadas HTTP reais contra o `json-server`, que exercitam a mesma API usada pelas telas.

## Próxima recomendação

Na próxima sessão, executar uma passada visual rápida no navegador com o modal novo, conferindo:

- Aparência do modal de confirmação.
- Fluxo de exclusão de cliente, anotação e agendamento pela UI.
- Responsividade da tela de agenda.
