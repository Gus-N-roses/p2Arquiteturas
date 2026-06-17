"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDashboard = void 0;
class StudentDashboard {
    constructor(members, billing, access) {
        this.members = members;
        this.billing = billing;
        this.access = access;
    }
    async build(studentId) {
        const warnings = [];
        const [membership, invoices, checkins] = await Promise.all([
            this.safe(() => this.members.getMembership(studentId), 'members-service', warnings, null),
            this.safe(() => this.billing.getInvoices(studentId), 'billing-service', warnings, []),
            this.safe(() => this.access.getCheckins(studentId), 'access-service', warnings, []),
        ]);
        return { studentId, membership, invoices, checkins, warnings };
    }
    async safe(action, serviceName, warnings, fallback) {
        try {
            return await action();
        }
        catch {
            warnings.push(`Não foi possível obter dados de ${serviceName}`);
            return fallback;
        }
    }
}
exports.StudentDashboard = StudentDashboard;
//# sourceMappingURL=StudentDashboard.js.map