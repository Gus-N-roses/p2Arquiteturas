"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuracao_1 = require("./configuracao");
const servidor_1 = require("./http/servidor");
const config = (0, configuracao_1.carregarConfiguracao)();
(0, servidor_1.createApp)(config).listen(config.porta, () => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ service: 'portal', message: `ouvindo na porta ${config.porta}` }));
});
//# sourceMappingURL=principal.js.map