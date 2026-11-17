# Roteiro de apresentação — Customy

Tempo estimado: 5 minutos.

## 1. Contexto e objetivo — 30 segundos

Apresente o problema: centralizar clientes, anotações e agenda em uma única aplicação web. Explique que a versão apresentada substitui os dados simulados por uma API real com persistência e isolamento por usuário.

## 2. Arquitetura — 45 segundos

Mostre o fluxo abaixo e identifique as responsabilidades de cada parte:

```text
Navegador
  ↓ HTTPS
React + Vite (Netlify)
  ↓ API autenticada por JWT
Express + Mongoose (Render)
  ↓
MongoDB Atlas
```

Mencione que o frontend está em `https://customy-app.netlify.app/` e a API possui endpoint de saúde em `https://customy-api.onrender.com/health`.

## 3. Nova conta e isolamento inicial — 45 segundos

Na aplicação publicada, crie uma conta de demonstração ou faça login em uma conta recém-criada. Mostre que clientes, anotações e agenda começam vazios. Explique que o backend define o `ownerId` usando o JWT, sem aceitar esse campo vindo do navegador.

## 4. Fluxo principal — 2 minutos

1. Cadastre um cliente.
2. Pesquise ou abra o cliente criado.
3. Crie uma anotação para esse cliente e mostre o histórico.
4. Crie um compromisso na agenda vinculado ao mesmo cliente.
5. Edite um dos registros para demonstrar persistência.
6. Recarregue a página e confirme que a sessão e os dados continuam disponíveis.

## 5. Segurança e isolamento — 45 segundos

Faça logout e entre com uma segunda conta de demonstração. Mostre que a segunda conta não vê os dados da primeira. Explique que as rotas de clientes, notas e agendamentos exigem JWT, e as buscas, edições e exclusões são filtradas pelo proprietário no servidor.

## 6. Encerramento — 15 segundos

Conclua que a aplicação está publicada, usa Atlas para persistência e mantém os dados separados entre usuários. Se houver tempo, mostre `/health` da API como evidência de disponibilidade.

## Checklist antes de apresentar

- Abrir `https://customy-app.netlify.app/` em janela anônima.
- Ter duas contas de demonstração com senhas conhecidas apenas por você.
- Verificar `https://customy-api.onrender.com/health`.
- Evitar exibir Atlas, Render, Netlify ou strings de conexão durante a apresentação.
