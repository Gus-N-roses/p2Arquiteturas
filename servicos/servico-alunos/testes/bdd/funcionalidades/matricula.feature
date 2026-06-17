# language: pt
Funcionalidade: Matrícula de alunos na academia
  Como recepcionista da academia
  Quero matricular alunos em planos
  Para que eles possam treinar e ser cobrados com o preço correto

  Cenário: Matrícula em plano anual aplica desconto de fidelidade
    Dado um aluno cadastrado chamado "João Pereira"
    E existe o plano anual "plan-annual" a 120 reais por mês
    Quando eu matriculo o aluno no plano "plan-annual"
    Então a matrícula deve ser criada com sucesso
    E o valor da matrícula deve ser de 1224 reais

  Cenário: Bloquear matrícula duplicada
    Dado um aluno cadastrado chamado "João Pereira"
    E existe o plano anual "plan-annual" a 120 reais por mês
    E o aluno já está matriculado no plano "plan-annual"
    Quando eu tento matricular o aluno novamente no plano "plan-annual"
    Então a matrícula deve ser recusada com a mensagem "Aluno já possui uma matrícula ativa"
