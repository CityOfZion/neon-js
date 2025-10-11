---
id: installation
title: Installation
---

## Install

To install

```sh
npm install @cityofzion/neon-js
```

or

```sh
npm install @cityofzion/neon-core
```

This will give you the release that is compatible for the neo3 mainnet and testnet.

> **Note**
> For most use-cases, we recommend `neon-js`.
> Do not use `neon-js` and `neon-core`  in the same project.  The classes are not cross-package compatible. See https://github.com/CityOfZion/neon-js/issues/850.

## Node

Support policy is to support the maintenance and LTS versions of Node. At the
time of writing, this is:

- Node 20
- Node 22

## Web

Both `neon-core` and `neon-js` are packaged for the web. Use script tags:

```html
<script src="https://unpkg.com/@cityofzion/neon-js@next"></script>
```

The library will be loaded under the variable `Neon`.
