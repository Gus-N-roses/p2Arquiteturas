"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const configuracao_1 = require("../configuracao");
const ApisHttpDosServicos_1 = require("../agregacao/ApisHttpDosServicos");
const PainelDoAluno_1 = require("../agregacao/PainelDoAluno");
const rotasDoPortal_1 = require("./rotasDoPortal");
function createApp(config = (0, configuracao_1.carregarConfiguracao)()) {
    const app = (0, express_1.default)();
    const pastaPublica = node_path_1.default.resolve(__dirname, '../../publico');
    // Console visual de testes (HTML estático) servido na raiz "/".
    app.get('/', (_req, res) => res.sendFile(node_path_1.default.join(pastaPublica, 'inicio.html')));
    app.use(express_1.default.static(pastaPublica));
    app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'portal', routes: ['/api/members', '/api/billing', '/api/access'] }));
    // Índice das rotas em JSON (a UI fica na raiz).
    app.get('/info', (_req, res) => {
        res.json({
            service: 'Gym Control - Portal de APIs',
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
    const painelDoAluno = new PainelDoAluno_1.PainelDoAluno(new ApisHttpDosServicos_1.ApiHttpDeAlunos(config.alunosUrl), new ApisHttpDosServicos_1.ApiHttpFinanceira(config.financeiroUrl), new ApisHttpDosServicos_1.ApiHttpDeAcesso(config.acessoUrl));
    app.get('/api/students/:studentId/dashboard', async (req, res) => {
        res.json(await painelDoAluno.montar(req.params.studentId));
    });
    // Proxies para cada microsserviço (devem vir depois das rotas próprias).
    (0, rotasDoPortal_1.montarRotasDoPortal)(app, config);
    return app;
}
//# sourceMappingURL=servidor.js.map