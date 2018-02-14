---
id: api-logging
title: Logging
---

Logging 模块仅作为一个命名导出被暴露为：

```js
import {logging} from '@cityofzion/neon-js'
logging.logger.setAll('info') // sets logging level of neon-js to 'info'
const apiLogger = logging.logger.getLogger('api') // gets the logger for the api package
apiLogger.setLevel('warn') // sets logging level only on the logger for the api package
```

所有的日志都是通过 `stdout` 和 `stderr` 传送的。 `neon-js` 中的每个命名包都有自己的记录器。 所有记录器的初始设置是 “slient”。
