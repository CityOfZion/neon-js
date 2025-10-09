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

Neon-JS is used internally by [Neon Wallet](https://github.com/CityOfZion/neon-wallet/) and many other libraries and applications.

Visit the [docs](https://dojo.coz.io/neo3/neon-js/index.html) to learn how to use this library!

> For `Dapp development`, [NeonDappkit](https://github.com/CityOfZion/neon-dappkit) and [WalletConnectSDK](https://github.com/CityOfZion/wallet-connect-sdk) offer a more user-friendly experience, specifically tailored for this purpose. While Neon-JS provides a comprehensive set of features, these two alternatives are better suited for developing decentralized applications.

# Getting started

## Installation

### Nodejs

```bash
npm i @cityofzion/neon-js
```

### Browser through CDN

```html
<script src="https://unpkg.com/@cityofzion/neon-js" />
```

## Usage

### Nodejs

```js
import {
    default as Neon
} from "@cityofzion/neon-js";
const acct = Neon.create.account("NKuyBkoGdZZSLyPbJEetheRhMjeznFZszf");
```

### Browser

Once imported using the script tag, the module is available as a global object `Neon` .

```js
console.log(Neon);
var acct = Neon.create.account("NKuyBkoGdZZSLyPbJEetheRhMjeznFZszf");
```

> **Note**
> For most use-cases, we recommend `neon-js` .
> Do not use `neon-js` and `neon-core` in the same project.  The classes are not cross-package compatible. See https://github.com/CityOfZion/neon-js/issues/850.

# Contributing

Please refer to [ `CONTRIBUTING` ](./CONTRIBUTING.md) for development practices.

## Setup

This repository is a typescript mono-repo using Lerna. Please ensure the following is installed:

* Node (latest LTS aka v18 at time of writing)

> `lerna` is optional and only required for advanced operations.

```sh
git clone https://github.com/CityOfZion/neon-js.git
cd neon-js
npm install
npm run build
```

## Testing

```sh
npm run lint
npm run build
npm run dist
npm run test:unit
npm run test:integration
```
> **Note**
> `test:integration` requires running the Docker image in `.devcontainer`

# Docs

We use Docusaurus for our docs website. The docs are stored in `./docs` while the main website and its configuration is in `./website` .

```sh
cd website
yarn
npm run start
```

# License
* Open-source [MIT](https://github.com/CityOfZion/neon-js/blob/master/LICENSE.md).
* Main author and maintainer is [Yak Jun Xiang](https://github.com/snowypowers).
