# Decisão de autenticação

## Decisão para a fase atual

Manter autenticação simulada no frontend usando `localStorage`, com rotas protegidas no React.

## Motivo

O objetivo imediato é estabilizar os fluxos centrais do TCC: clientes, anotações e agenda. Um backend real de autenticação mudaria o escopo da entrega, exigindo senha criptografada, sessão/token, recuperação de senha, confirmação de e-mail e regras de autorização no servidor.

## Limites conhecidos

- As contas ficam salvas apenas no navegador usado no teste.
- A senha não é criptografada, portanto esta abordagem não deve ser usada em produção.
- A proteção de rotas é apenas uma proteção de interface, não uma barreira de segurança real.

## Próxima migração recomendada

Quando a aplicação sair da fase de protótipo funcional, migrar para backend Express com MongoDB/Mongoose, usando:

- Hash de senha com `bcrypt`.
- Sessão por JWT ou cookie httpOnly.
- Recuperação de senha com token temporário.
- Confirmação de e-mail.
- Separação dos dados por usuário autenticado.
