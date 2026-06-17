# language: pt
Funcionalidade: Pagamento de mensalidades
  Como financeiro da academia
  Quero que multas por atraso sejam aplicadas automaticamente
  Para cobrar o valor correto de cada aluno

  Cenário: Pagamento em dia não tem multa
    Dado uma fatura de 120 reais com vencimento em "2026-06-10"
    Quando o aluno paga a fatura em "2026-06-09"
    Então o total pago em centavos deve ser 12000
    E a fatura deve ficar com status "PAID"

  Cenário: Pagamento com atraso aplica multa e juros
    Dado uma fatura de 120 reais com vencimento em "2026-06-10"
    Quando o aluno paga a fatura em "2026-06-20"
    Então o total pago em centavos deve ser 12280
