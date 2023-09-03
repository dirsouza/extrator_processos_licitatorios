<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
Projeto de extração de processos de licitação.
</p>

## Description

Projeto de extração de processo de licitação da [API do Portal de Compras Públicas](https://compras.api.portaldecompraspublicas.com.br/)

## Docker
Esse projeto foi desenvolvido usando Docker, por essa razão, tem um docker-compose.yml na raiz do projeto contendo os conteiners do MongoDB e Redis.

Caso não vá usar o docker, edite o .env com as suas configurações de portas e hosts.
```bash
$ docker-compose up
```

## Instalação

```bash
# development
$ npm install

# production
$ npm install --production
```

## Executar o App

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Informações
Caso não tenha mudado a porta da Aplicação, será servido no seguinte endereço:

* URL: http://localhost:3000

A Aplicação também usa o swagger para documentar os endpoints, que será servido no seguinte endereço:
* URL: http://localhost:3000/api

