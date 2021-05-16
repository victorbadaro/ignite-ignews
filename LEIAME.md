# IG.NEWS

<h1 align="center">
    <img src="./docs/running.gif" alt="App">
</h1>

[![README.md](https://img.shields.io/badge/-Read%20in%20English-brightgreen?style=for-the-badge)](./README.md)

## Índice

- [🧾 Sobre o projeto](#-sobre-o-projeto)
- [🚀 Principais tecnologias utilizadas](#-principais-tecnologias-utilizadas)
- [🔽 Como baixar o projeto](#-como-baixar-o-projeto)
- [💻 Como executar o projeto](#-como-executar-o-projeto)
- [👌 Como usar o app](#-como-usar-o-app)
  <br>

## 🧾 Sobre o projeto

IG.NEWS é uma _newsletter_ sobre o mundo [React](https://reactjs.org/). Nela foram implementadas:

- Páginas que utilizam conceitos de SSR (Server Side Rendering) e SSG (Static Site Generation).
- Autenticação via Github (OAuth authentication) utilizando [NextAuth](https://next-auth.js.org/)
- Integração com o banco de dados NoSQL [Fauna](https://fauna.com/)
- Integração com o serviço de pagamentos online [Stripe](https://stripe.com/en-br)<br>
  A aplicação também foi configurada para receber alguns _webhooks_ disparados por esse serviço. Para ser mais específico, _webhooks_ como: finalização de pagamento, atualização de assinatura e cancelamento de assinatura.
- Integração com o headless CMS (Content Management System) [Prismic](https://prismic.io/).
  <br>

## 🚀 Principais tecnologias utilizadas

- [React](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Sass](https://sass-lang.com/)
- [NextAuth](https://next-auth.js.org/)
- [Fauna](https://fauna.com/)
- [Stripe](https://stripe.com/en-br)
- [Prismic](https://prismic.io/)

_(Você pode ver todas as dependências do projeto no arquivo [package.json](./package.json))_
<br>

## 🔽 Como baixar o projeto

```bash
$ git clone https://github.com/victorbadaro/ignite-ignews
```

<br>

## 💻 Como executar o projeto

Os comandos abaixo utilizam o gerenciador de pacotes [yarn](https://yarnpkg.com/). Execute-os no seu terminal.

1. Instale as dependências do projeto

   ```bash
   $ yarn
   ```

2. A aplicação também depende de outros serviços para funcionar. São serviços de pagamento, autenticação, banco de dados e CMS. Todos eles devem ser configurados antes da execução do app. Veja a seção [Serviços](#-servicos)

3. A aplicação pode ser executada tanto no ambiente de produção como no ambiente de desenvolvimento:

   - Para executar a aplicação no ambiente de desenvolvimento:

     ```bash
     $ yarn dev
     ```

   - Para executar a aplicação no ambiente de produção:

     - Gere o build da aplicação:

       ```bash
       $ yarn build
       ```

     - Agora basta executar o projeto:
       ```bash
       $ yarn start
       ```

Se tudo for executado corretamente, uma mensagem será apresentada no terminal informando que o servidor foi iniciado:

```bash
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Agora basta abrir o navegador e acessar: http://localhost:3000/

✅ Pronto! Se você seguiu corretamente os passos acima o projejto já estará sendo executado localmente em tua máquina.
<br>

## 👨‍🔧 Serviços

Antes de qualquer coisa, crie um arquivo na raíz do projeto com o nome `.env.local`. Insira as seguintes variáveis dentro do arquivo criado:

```bash
# Stripe
STRIPE_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SUCCESS_URL=http://localhost:3000/posts
STRIPE_CANCEL_URL=http://localhost:3000

# FaunaDB
FAUNADB_KEY=

# Github
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Prismic CMS
PRISMIC_ENDPOINT=
PRISMIC_ACCESS_TOKEN=
```

1. Stripe<br>
   Crie uma conta no [Stripe](https://stripe.com/en-br) e cadastre um produto.
   Para criar um produto, basta clicar em _**Products**_ e depois em _**Add product**_. Deixe selecionada a opção _**Recurring**_.
   <img src="./docs/product.png" alt="Stripe product">

   Três chaves são necessárias para a integração correta com o serviço do Stripe.<br>
   No dashboard do Stripe, clique no menu _**Developers**_ e em seguida em _**API Keys**_ para obter tanto a **Publishable key** como a **Secret key**.<br>
   Copie as chaves para o arquivo `.env.local`:<br>
   STRIPE*API_KEY=\_Secrect key*<br>
   NEXT*PUBLIC_STRIPE_PUBLIC_KEY=\_Publishable key*
   <img src="./docs/stripe_keys.jpg" alt="Stripe keys">

   Para obter a última chave do Stripe, baixe a _**CLI**_:
   <img src="./docs/stripe_cli.png" alt="Stripe CLI">

   E execute os seguintes comandos no terminal:

   ```bash
   # Acesse o diretório onde está a CLI baixada
   # Execute:
   ./stripe login

   # Após confirmar no navegador a autenticação execute:
   ./stripe listen --forward-to http://localhost:3000/api/webhooks
   ```

   A chave irá aparecer na tela. Copie e cole ela dentro do arquivo `.env.local` na frente de STRIPE_WEBHOOK_SECRET=
   <img src="./docs/stripe_webhooks.png" alt="Stripe webhooks key">

   Este último comando deve estar sendo executado durante toda a execução do proejto.

2. FaunaDB
   Crie uma conta no [Fauna](https://fauna.com/) e em seguida um _**Database**_.
   <img src="./docs/fauna.png" alt="FaunaDB">

   Após dar um nome para o Database criado, crie duas _**Collections**_: _subscriptions_ e _users_
   <img src="./docs/create_collection1.png" alt="Create collection">
   <img src="./docs/create_collection2.png" alt="Create collection">

   Criadas as Collections, crie agora os Indexes abaixo seguindo o exemplo da imagem:
   <img src="./docs/create_index.png" alt="FaunaDB Index">

   ```
   Index Name: user_by_email
   Source Collection: users
   Terms: data.email
   Unique

   Index Name: user_by_stripe_customer_id
   Source Collection: users
   Terms: data.stripe_customer_id

   Index Name: subscription_by_id
   Source Collection: subscriptions
   Terms: data.id

   Index Name: subscription_by_status
   Source Collection: subscriptions
   Terms: data.status

   Index Name: subscription_by_user_ref
   Source Collection: subscriptions
   Terms: data.userId
   ```

   Agora, depois que a estrutura do banco já estiver pronta (com as Collections e Indexes), gere uma _**Secrect key**_. Para isso basta acessar o menu _**Security**_ e dar um nome para a nova key:
   <img src="./docs/fauna_key.png" alt="FaunaDB key">

   A chave aparecerá na tela logo em seguida:
   <img src="./docs/fauna_key2.png" alt="FaunaDB key2">

   Copie essa chave e cole dentro do arquivo `.env.local` na frente de FAUNADB_KEY.

3. Github
   Crie uma conta no [Github](https://github.com/). Acesse as configurações da conta e clique em _**Developer settings**_.
   <img src="./docs/github.jpg" alt="Github">

   Dentro de OAuth Apps, crie um novo OAuth App:
   <img src="./docs/oauth.png" alt="Github OAuth App">

   Preencha os campos que irão aparecer na tela para registrar a aplicação OAuth. Em _**Homepage URL**_ e _**Authorization callback URL**_ preencha seguindo o modelo abaixo:<br>
   **Homepage URL** = http://localhost:3000<br>
   **Authorization callback URL** = http://localhost:3000/api/auth/callback
   <img src="./docs/oauth_register.png" alt="OAuth register">

   Após ter registrado a aplicação OAuth já será possível obter o _**Client ID**_ e o _**Client Secret**_. O _**Client Secret**_ será gerado clicando no botão _**Generate a new client secret**_.<br>
   Copie o _**Client ID**_ para dentro do arquivo `.env.local`, na frente de GITHUB\*CLIENT\*ID e o **\*Client Secret\*** na frente de GITHUB*CLIENT_SECRET.<br>
   GITHUB_CLIENT_ID=\_Client ID*<br>
   GITHUB*CLIENT_SECRET=\_Client Secret*
   <img src="./docs/oauth_secrets.png" alt="OAuth secrets">

4. Prismic CMS
   Crie uma conta no [Prismic](https://prismic.io/) e em seguida também um repositório:
   <img src="./docs/prismic_repository.png" alt="Prismic repository">

   Para iniciar a crição de posts no Prismic CMS você deve, antes, criar um _**type**_ de nome **post**:
   <img src="./docs/prismic_type.png" alt="Prismic type">

   Arraste os três itens destacados na imagem abaixo (UID, Title e Rich Text) para o a página em branco na esqueda.<br>
   Preencha o campo _**API ID**_ de cada item dessa forma: uid, title e content respectivamente.
   <img src="./docs/prismic_type_post.png" alt="Prismic type post">

   Com o _**type**_ de **post** já criado acesse o menu _**Documents**_ e cadastre os posts que irão aparecer na aplicação do **IG.NEWS**:
   <img src="./docs/prismic_document1.png" alt="Prismic Document">

   Os campos necessários para a crição de um **post** são o **title** e o **content**:
   <img src="./docs/prismic_document2.png" alt="Prismic document 2">

   Após a edição do documento é só clicar em _**Save**_ e _**Publish**_:
   <img src="./docs/prismic_document.gif" alt="Prismic document GIF">

   Agora que o conteúdo já está pronto, basta obter o _**Endpoint**_ da API e o _token_ de acesso do **Prismic**.<br>
   Copie o _**API Endpoint**_ e coloque na frente de PRISMIC_ENDPOINT no arquivo `.env.local`
   <img src="./docs/prismic_api_endpoint.png" alt="Prismic API endpoint">

   Copie o _**Permanent access token**_ gerado (depois de clicar em _**Add token**_) e coloque na frente de PRISMIC_ACCESS_TOKEN no arquivo `.env.local`
   <img src="./docs/prismic_api_token.png" alt="Prismic access token">

## 👌 Como usar o app

O uso do **IG.NEWS** é muito simples. Ele é uma _Newsletter_ sobre o mundo **React**. Os posts nele disponibilizados podem ser visualizados por todos, mas somente os assinantes terão acesso aos textos completos dos artigos. Para ser assinante, deve-se ter uma conta no **Github** (para fazer a autenticação na plataforma do **IG.NEWS**) e realizar um pagamento mensal através do serviço de pagamentos online **Stripe** (valor informado na _Homepage_). Não se preocupe, para testar a aplicação você não precisará informar dados reais de algum cartão de crédito ou algo assim. Na tela de pagamentos do **Stripe** você pode utilizar o seguinte número de cartão de crédito:<br>

> 4242 4242 4242 4242

Esse é um número de cartão de crédito pra testes do **Stripe**.<br>
Veja abaixo o fluxo da aplicação:
<img src="./docs/ignews_running_from_start.gif" alt="Ignews is running">

<br>

---

<p align="center">Este projeto foi criado e desenvolvido com ❤ por <a href="https://github.com/victorbadaro">Victor Badaró</a></p>
