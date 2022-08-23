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
> mixing import `neon-core` and `neon-js` (the latter which includes `neon-core`) in the same project can lead to undesired
> behaviour ([example](https://github.com/CityOfZion/neon-js/issues/850)). Unless all you need is contained in `neon-core`, use
> `neon-js`.

## Node

Support policy is to support the maintainence and LTS versions of Node. At the
time of writing, this is:

- Node 12
- Node 14
- Node 16

## Web

Both `neon-core` and `neon-js` are packaged for the web. Use script tags:

```html
<script src="https://unpkg.com/@cityofzion/neon-js@next"></script>
```

The library will be loaded under the variable `Neon`.
