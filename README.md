## gb-cashback

Esta é uma API para gerir um sistema de Cashback, onde o valor será disponibilizado como crédito para a próxima compra da revendedora no Boticário.
Os(as) revendedores(as) poderão cadastrar suas compras e acompanhar o retono de cashback de cada operação.

#### Rotas do back-end

- Cadastrar um(a) novo revendedor(a)

  - POST /users/accounts
    - body:
      {
      name: string,
      cpf: string,
      email: string,
      password: string
      }

- Login de um revendedor(a)
  - POST /users/login
    - body:
      {
      cpf: string,
      password: string
      }

O token gerado tem o formato: { token: 'ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm' }

Para acessar os próximos endpoints, o(a) revendedor(a) deve estar logado(a) e, assim, não será mais necessário fornecer novamente o CPF.

- Cadastrar uma nova compra

  - POST /purchases
    - body:
      {
      code: string,
      valueInCents: number,
      dateOfPurchase: Date
      }

- Listar as compras cadastradas com os respectivos cashback

  - GET /purchases

- Acumulado de cashback até o momento
  - GET /purchases/credit

#### Swagger

- No link GET /api pode ser consultada a documentação da API, gerada pelo Swagger.

#### Premissas do caso de uso:

Para evitar problemas com imprecisões dos números fracionários, os valores monetários, tanto de entradas como de saida, serão expressos em centavos, como um número inteiro. Por exemplo, R$ 123,50 deve ser representado como 12350.

As compras são salvas com o status “Em validação”, exceto
quando o CPF do revendedor(a) for 153.509.460-56, neste caso o status é salvo como
“Aprovado”.

Na listagem das compras cadastradas são retornados código, valor, data, status, % de cashback e valor aplicado para cada uma.

Os critérios de bonificação são:

- Para até 1.000 reais em compras, o(a) revendedor(a) receberá 10% de cashback do
  valor vendido no período de um mês (sobre a soma de todas as vendas);
- Entre 1.000 e 1.500 reais em compras, o(a) revendedor(a) receberá 15% de cashback do valor vendido no período de um mês (sobre a soma de todas as vendas);
- Acima de 1.500 reais em compras, o(a) revendedor(a) receberá 20% de cashback do
  valor vendido no período de um mês (sobre a soma de todas as vendas).

#### Tecnologias

- Node.js
- TypeScript
- NestJS
- Postgres
- Docker
- Docker compose
- Winston Logger
- Swagger

#### Execução local

Caso queira utilizar a aplicação localmente, clone esse
repositório, tenha o docker compose instalado e, na pasta
do projeto, execute o seguinte comando:

docker compose up

Podendo acessar o link, por exemplo:

http://localhost:3000/users/accounts
