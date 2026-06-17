import { Invoice } from '../../../codigo/dominio/entidades/Fatura';
import { DomainError } from '../../../codigo/dominio/erros/ErroDeDominio';
import { Money } from '../../../codigo/dominio/objetos-de-valor/Dinheiro';

describe('Invoice (Entity)', () => {
  function issue() {
    return Invoice.issue({
      id: 'inv-1',
      studentId: 'std-1',
      description: 'Mensalidade Junho/2026',
      amount: Money.fromReais(120),
      dueDate: new Date('2026-06-10T00:00:00Z'),
    });
  }

  it('nasce com status PENDING', () => {
    expect(issue().status).toBe('PENDING');
  });

  it('exige descrição', () => {
    expect(() =>
      Invoice.issue({
        id: 'x',
        studentId: 's',
        description: '   ',
        amount: Money.fromReais(1),
        dueDate: new Date(),
      }),
    ).toThrow(DomainError);
  });

  it('calcula dias em atraso (0 quando dentro do prazo)', () => {
    const invoice = issue();
    expect(invoice.daysOverdue(new Date('2026-06-05T00:00:00Z'))).toBe(0);
    expect(invoice.daysOverdue(new Date('2026-06-20T00:00:00Z'))).toBe(10);
  });

  it('é paga uma vez e bloqueia pagamento duplicado', () => {
    const invoice = issue();
    invoice.pay(Money.fromReais(120), new Date('2026-06-09T00:00:00Z'));
    expect(invoice.isPaid()).toBe(true);
    expect(() => invoice.pay(Money.fromReais(120), new Date())).toThrow(DomainError);
  });
});
