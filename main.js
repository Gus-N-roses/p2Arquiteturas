"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const server_1 = require("./http/server");
const config = (0, config_1.loadConfig)();
(0, server_1.createApp)(config).listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ service: 'gateway', message: `ouvindo na porta ${config.port}` }));
});
//# sourceMappingURL=main.js.map