---
id: installation
title: Installation
---

At the moment, due to the rapid changes happening to neo3, this SDK will only
update when a preview is cut. Many of the sub packages are also not maintained
until further notice. Only `neon-core` is supported in the preview. You may use
`neon-js` but some API will be broken.

The current preview as of writing is `v3.0.0-preview2-00`.

## Install

To install

```sh
npm install @cityofzion/neon-js@next
```

or

```sh
npm install @cityofzion/neon-core@next
```

This will give you the release that is compatible for the neo3 testnet.

## Node

Support policy is to support the maintainence and LTS versions of Node. At the
time of writing, this is:

- Node 10
- Node 12

> As of writing, Node 14 is still in development. However, it is implicitly
> supported and I will accept bugs targeting this engine.

## Web

Both `neon-core` and `neon-js` are packaged for the web. Use script tags:

```html
<script src="https://unpkg.com/@cityofzion/neon-js@next"></script>
```

The library will be loaded under the variable `Neon`.
