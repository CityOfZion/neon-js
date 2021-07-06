<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/visual-identity/develop/_CoZ%20Branding/_Logo/_Logo%20icon/_PNG%20200x178px/CoZ_Icon_DARKBLUE_200x178px.png"
    width="125px;">
</p>

<h1 align="center">neon-js</h1>

<p align="center">
  Neon JavaScript SDK.
</p>

<p align="center">
  <a href="https://circleci.com/gh/CityOfZion/neon-js">
    <img src="https://circleci.com/gh/CityOfZion/neon-js.svg?style=svg">
  </a>
</p>

# Overview

This is the JS SDK for the NEO blockchain platform. This project aims to be a lightweight library focused on providing blockchain interactions in the browser.

It is currently in use by [Neon](https://github.com/CityOfZion/neon-wallet/).

Visit the docs to learn how to use this library! [[Neo2](https://docs.coz.io/neo2/neon-js)] [[Neo3](https://docs.coz.io/neo3/neon-js)]

# Getting started

## Installation

### Nodejs

```js
npm i @cityofzion/neon-js
```

### Browser through CDN

```html
<script src="https://unpkg.com/@cityofzion/neon-js" />
```

## Usage

### Nodejs

```js
const Neon = require("@cityofzion/neon-js");
const acct = Neon.create.Account("ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW");
```

### Browser

Once imported using the script tag, the module is available as a global object `Neon`.

```js
console.log(Neon);
var acct = Neon.create.Account("ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW");
```

> Find more guides on our [documentation website](https:///docs.coz.io/neo2/neon-js/docs/en/guides/basic/sendasset.html)

# Contributing

Please refer to [`CONTRIBUTING`](./CONTRIBUTING.md) for development practices.

## Setup

This repository is a typescript mono-repo using Lerna and Yarn workspaces. Please ensure the following is installed:

- Yarn (a version that support workspaces)
- Node (latest LTS aka v8 at time of writing)

> `lerna` is optional and only required for advanced operations.

```sh
git clone https://github.com/CityOfZion/neon-js.git
cd neon-js
yarn
yarn bootstrap
yarn build
```

## Testing

```sh
yarn lint
yarn build
yarn dist
yarn test:unit
yarn test:integration
```

# Docs

We use Docusaurus for our docs website. The docs are stored in `./docs` while the main website and its configuration is in `./website`.

```sh
cd website
yarn
yarn start
```

# License

- Open-source [MIT](https://github.com/CityOfZion/neon-js/blob/master/LICENSE.md).
- Main author is [Ethan Fast](https://github.com/Ejhfast).
- Maintainer is [Yak Jun Xiang](https://github.com/snowypowers)
