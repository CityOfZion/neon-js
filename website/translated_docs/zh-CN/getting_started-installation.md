---
id: installation
title: Installation
---

`neon-js` 项目被放在 NPM 中，在 `cityofzion` 组织下。

## 安装

安装方法：

```sh
npm install @cityofzion/neon-js
```

对于特定的提交（commit）或发布（release），请在后面添加提交哈希/标签/分支：

```sh
npm install @cityofzion/neon-js#dev
```

## 导入 neon-js 使用 Import

`neon-js` 支持两种 Import 方式。

默认导入将导入 `neon-js` 的语义版本。如果你是新人或者只是想要使用整个包，请使用它。

```js
import Neon from '@cityofzion/neon-js'

Neon.create.claimTx(...args)
const query = Neon.create.query()
```

模块通过命名导入（named imports）来暴露。这允许更细粒度的控制和访问单个模块。

```js
import {rpc, tx} from '@cityofzion/neon-js'

Neon.tx.createClaimTx(...args)
const query = new rpc.Query()
```

## 导入neon-js，使用Require

由于 `neon-js` 包使用ES6模块约定，`require` 因此需要指定它们想要的模块：

```js
var neon-js = require('@cityofzion/neon-js')

// Semantic Style by using default import
var Neon = neon-js.default
const query = Neon.create.query()

// Named imports are available too
var wallet = neon-js.wallet
var tx = neon-js.tx

const account = new wallet.Account(privateKey)
```

## 导入neon-js, 使用Script标签

`neon-js` 也为 Web 打包。您可以通过脚本（Script）标签添加它：

```html
<script src="./lib/browser.js"></script>
```

该库将作为全局变量 `Neon` 被提供。与 `require` 样式类似，您将具有 `default` 下的语义样式和在暴露在同一级别下其余的命名模块。
