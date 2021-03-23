# api.kulturdaten.berlin

![Beta](https://github.com/technologiestiftung/kulturdaten-api/workflows/Deploy%3A%20Beta/badge.svg)
![Live](https://github.com/technologiestiftung/kulturdaten-api/workflows/Deploy%3A%20Live/badge.svg)

API application based on [Adonis.js](https://preview.adonisjs.com/) to power the [kulturdaten.berlin frontend](https://github.com/technologiestiftung/kulturdaten-frontend).

## Requirements

To develop the application make sure your machine meets the following requirements:

- [Node.js 15.12.0](https://nodejs.org/en/) (for example via [nvm](https://github.com/nvm-sh/nvm))

## Setup

Before you can start developing you need to install all needed dependencies:

```sh
npm install
```

## Develop

To start the development server, including file watching and recompilation of TypeScript run:

```
npm run develop
```

The development server is then accessible at [http://localhost:3333](localhost:3333).

## Deployment

To setup the API on a fresh [dokku instance](https://github.com/dokku/dokku) run the following commands, using the kulturdaten-berlin.anyvent.cloud as a demo host:

At first make sure your instance (assuming Ubuntu) is up to date:

```
sudo apt-get update
sudo apt-get upgrade

sudo apt-get install dokku-update
dokku-update
```

Afterwards install all needed plugins. The API is driven by an PostgreSQL database for production, we'll be using LetsEncrypt for easy SSL-protection.

```
dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
```

You may also want to disable redirecting all traffic with an unknown HOST header to the lexicographically first site in the nginx config as [documented](https://github.com/dokku/dokku/blob/master/docs/configuration/nginx.md#default-site) by deploying [000-noop](https://github.com/anyvent-org/000-noop) for example.

Next create the app and setup suiting environment variables. We are going to setup two environments: live and beta. Alongside with the application we are also going to create two database instances.

```
dokku apps:create beta.api.kulturdaten.berlin
dokku postgres:create pg-beta-api-kulturdaten-berlin
dokku postgres:link pg-beta-api-kulturdaten-berlin beta.api.kulturdaten.berlin

dokku apps:create api.kulturdaten.berlin
dokku postgres:create pg-api-kulturdaten-berlin
dokku postgres:link pg-api-kulturdaten-berlin api.kulturdaten.berlin
```

Then you will need to configure the apps specific to the environment they should resemble:

```
dokku config:set --no-restart beta.api.kulturdaten.berlin PORT=5000 HOST=0.0.0.0 NODE_ENV=beta DB_CONNECTION=pg
dokku config:set --no-restart api.kulturdaten.berlin PORT=5000 HOST=0.0.0.0 NODE_ENV=live DB_CONNECTION=pg
```

You'll also need to set secret keys using the `node ace generate:key` command together with:

```
dokku config:set --no-restart beta.api.kulturdaten.berlin APP_KEY=${key}
dokku config:set --no-restart api.kulturdaten.berlin APP_KEY=${key}
```

To setup automated deploys via [GitHub actions](https://github.com/features/actions), issue a dedicated SSH key for GitHub to authenticate by running

```
mkdir ./keys
ssh-keygen -t rsa -C github@kulturdaten.berlin -f ./.keys/id_rsa
cat ./.keys/id_rsa.pub | ssh root@kulturdaten-berlin.anyvent.cloud dokku ssh-keys:add github@kulturdaten.berlin
```
