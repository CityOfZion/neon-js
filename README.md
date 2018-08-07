<p align="center">
  <img
    src="http://res.cloudinary.com/vidsy/image/upload/v1503160820/CoZ_Icon_DARKBLUE_200x178px_oq0gxm.png"
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

## Overview

This the Neon Wallet's JS SDK for the NEO blockchain platform. It is currently in use by [Neon](https://github.com/CityOfZion/neon-wallet/).

Visit the [docs](https://cityofzion.io/neon-js) to learn how to use this library!

## Getting started

### Installation

Install the package using:

```js
npm i @cityofzion/neon-js
```

## Contributing

### Setup

This repository is a javascript mono-repo using Lerna and Yarn workspaces. Please ensure the following is installed:

- Yarn (a version that support workspaces)
- Lerna(version found in `lerna.json`)
- Node (latest LTS)

```sh
git clone https://github.com/CityOfZion/neon-js.git
cd neon-js
yarn
lerna bootstrap
```

## Docs

We use Docusaurus for our docs website. The docs are stores in `./docs` while the main website and its configuration is in `./website`.

```bash
cd website
npm install
npm run start
```

## License

- Open-source [MIT](https://github.com/CityOfZion/neon-js/blob/master/LICENSE.md).
- Main author is [Ethan Fast](https://github.com/Ejhfast).
- Maintainer is [Yak Jun Xiang](https://github.com/snowypowers)
