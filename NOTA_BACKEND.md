# Ajustes Backend

1. **Registro de usuário** — o `POST /login/register` exige autenticação, então não consigo criar o primeiro usuário. Preciso que crie um usuário inicial direto no banco

2. **Venda — suporte a serviços** — o endpoint `POST /vendas/` só aceita `produto_id` nos itens. Preciso que aceite `servico_id` também, para registrar serviços na venda.

3. **Produto — campos faltando** — preciso dos campos `quantidade_minima` (integer) e `data_validade` (date) no cadastro e retorno de produtos.
