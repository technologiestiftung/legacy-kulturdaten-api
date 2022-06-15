![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue) ![Beta](https://github.com/technologiestiftung/kulturdaten-api/workflows/Deploy%3A%20Beta/badge.svg) ![Live](https://github.com/technologiestiftung/kulturdaten-api/workflows/Deploy%3A%20Live/badge.svg)

# api.kulturdaten.berlin

API application based on [Adonis.js](https://preview.adonisjs.com/) to power the [kulturdaten.berlin frontend](https://github.com/technologiestiftung/kulturdaten-frontend).

## Requirements

To develop the application make sure your machine meets the following requirements:

- [Node.js 15.12.0](https://nodejs.org/en/) (for example via [nvm](https://github.com/nvm-sh/nvm))

## Setup

Before you can start developing you need to install all needed dependencies:

```sh
npm install
```

Before starting the development server, make sure to configure your environment. You can use the following as a starting point. Simply copy this into a `.env` file in the project root:

```
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=CU2cKM6eSbndUQUI74veu3KG4V1gpT7S
DB_CONNECTION=sqlite
```

You can use `node ace generate:key` to create a personal `APP_KEY` which is used to hash cookies.

## Develop

Afterwards start the development server, including file watching and recompilation of TypeScript with:

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

To be able to persist uploaded images you need to mount a directory outside of the container:

```
mkdir -p /var/lib/dokku/data/storage/beta.api.kulturdaten.berlin/media
chown -R dokku:dokku /var/lib/dokku/data/storage/beta.api.kulturdaten.berlin/media
chmod -R a+w /var/lib/dokku/data/storage/beta.api.kulturdaten.berlin/media
dokku storage:mount beta.api.kulturdaten.berlin /var/lib/dokku/data/storage/beta.api.kulturdaten.berlin/media:/build/public/media
```

To setup automated deploys via [GitHub actions](https://github.com/features/actions), issue a dedicated SSH key for GitHub to authenticate by running

```
mkdir ./keys
ssh-keygen -t rsa -C github@kulturdaten.berlin -f ./.keys/id_rsa
cat ./.keys/id_rsa.pub | ssh root@kulturdaten-berlin.anyvent.cloud dokku ssh-keys:add github@kulturdaten.berlin
```

# Troubleshooting

## Reset database

```
dokku postgres:unlink pg-alpha-api-kulturdaten-berlin alpha.api.kulturdaten.berlin
dokku postgres:destroy pg-alpha-api-kulturdaten-berlin
dokku postgres:create pg-alpha-api-kulturdaten-berlin
dokku postgres:link pg-alpha-api-kulturdaten-berlin alpha.api.kulturdaten.berlin
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://mathies.io/"><img src="https://avatars.githubusercontent.com/u/5181384?v=4?s=643" width="643px;" alt=""/><br /><sub><b>Mathies Schneider</b></sub></a><br /><a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=smatjes" title="Code">💻</a> <a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=smatjes" title="Documentation">📖</a></td>
    <td align="center"><a href="https://boris.io/"><img src="https://avatars.githubusercontent.com/u/1102134?v=4?s=643" width="643px;" alt=""/><br /><sub><b>Boris Fruendt</b></sub></a><br /><a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=b0ndt" title="Code">💻</a> <a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=b0ndt" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/matthiasrohmer"><img src="https://avatars.githubusercontent.com/u/12857772?v=4?s=643" width="643px;" alt=""/><br /><sub><b>Matthias Rohmer</b></sub></a><br /><a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=matthiasrohmer" title="Code">💻</a> <a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=matthiasrohmer" title="Documentation">📖</a></td>
    <td align="center"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=643" width="643px;" alt=""/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="#maintenance-ff6347" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/vogelino"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=643" width="643px;" alt=""/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=vogelino" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Credits

<table>
  <tr>
    <td>
      A project by: <a src="https://www.technologiestiftung-berlin.de/en/">
        <br />
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-en.svg" />
      </a>
    </td>
    <td>
      Supported by: <a src="https://www.berlin.de/sen/kultur/en/">
        <br />
        <br />
        <img width="120" src="https://logos.citylab-berlin.org/logo-berlin-senkueu-en.svg" />
      </a>
    </td>
  </tr>
</table>
