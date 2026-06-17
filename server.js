"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const config_1 = require("../config");
const HttpServiceApis_1 = require("../aggregation/HttpServiceApis");
const PainelDoAluno_1 = require("../aggregation/PainelDoAluno");
const proxies_1 = require("./proxies");
function createApp(config = (0, config_1.loadConfig)()) {
    const app = (0, express_1.default)();
    // Console visual de testes (HTML estático) servido na raiz "/".
    app.use(express_1.default.static(node_path_1.default.resolve(__dirname, '../../public')));
    app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'gateway', routes: ['/api/members', '/api/billing', '/api/access'] }));
    // Índice das rotas em JSON (a UI fica na raiz).
    app.get('/info', (_req, res) => {
        res.json({
            service: 'Gym Control — ERP de academias (API Gateway)',
            tente: {
                planos: 'GET /api/members/plans',
                alunos: 'GET /api/members/students',
                cadastrarAluno: 'POST /api/members/students {name, cpf, email}',
                matricular: 'POST /api/members/students/:id/enrollments {planId}',
                emitirFatura: 'POST /api/billing/invoices {studentId, description, amountInCents, dueDate}',
                pagarFatura: 'POST /api/billing/invoices/:id/payment {paidAt}',
                checkin: 'POST /api/access/checkins {studentId}',
                dashboard: 'GET /api/students/:id/dashboard',
            },
        });
    });
    // Endpoint agregado (Facade): uma chamada, dados dos três serviços.
    const painelDoAluno = new PainelDoAluno_1.PainelDoAluno(new HttpServiceApis_1.ApiHttpDeAlunos(config.membersUrl), new HttpServiceApis_1.ApiHttpFinanceira(config.billingUrl), new HttpServiceApis_1.ApiHttpDeAcesso(config.accessUrl));
    app.get('/api/students/:studentId/dashboard', async (req, res) => {
        res.json(await painelDoAluno.montar(req.params.studentId));
    });
    // Proxies para cada microsserviço (devem vir depois das rotas próprias).
    (0, proxies_1.mountProxies)(app, config);
    return app;
}
//# sourceMappingURL=server.js.map