# language: pt
Funcionalidade: Liberação da catraca por matrícula
  Como academia
  Quero liberar a entrada apenas de alunos com matrícula ativa
  Para garantir que só treina quem está em dia

  Cenário: Aluno com matrícula ativa entra
    Dado um aluno com matrícula ativa
    Quando ele tenta passar pela catraca
    Então o acesso deve ser liberado

  Cenário: Aluno sem matrícula ativa é bloqueado
    Dado um aluno sem matrícula ativa
    Quando ele tenta passar pela catraca
    Então o acesso deve ser negado com o motivo "Aluno sem matrícula ativa"
