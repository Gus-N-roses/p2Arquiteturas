# Checklist de Entrega - Gym Control

Este arquivo organiza as evidencias do projeto de acordo com os criterios da
prova. Use junto com o `LEIA-ME.md` durante a apresentacao.

## Link publicado

Preencha depois do deploy:

```text
https://<url-publica-do-portal>
```

O link deve apontar para o portal, que serve a interface web na raiz `/` e
expoe as APIs em `/api/*`.

## Rubrica

| Criterio | Pontos | Evidencia no repositorio |
| --- | ---: | --- |
| Descricao do problema e proposta da solucao | 0,8 | `LEIA-ME.md`, secoes 1 e 2 |
| Clean Code | 0,8 | `LEIA-ME.md`, secao 6; objetos de valor, nomes de caso de uso e intermediarios de erro |
| SOLID | 1,0 | `LEIA-ME.md`, secao 4; portas em `aplicacao/portas`, repositorios e strategies |
| Design Patterns | 0,8 | `LEIA-ME.md`, secao 5; Repository, Strategy, Factory, Observer, Decorator, Adapter, Proxy e Facade |
| Arquitetura Limpa | 1,0 | Estrutura `dominio`, `aplicacao`, `infraestrutura`, `apresentacao` e `principal` em cada servico |
| Microsservicos | 0,8 | `servicos/servico-alunos`, `servicos/servico-financeiro`, `servicos/servico-acesso` e `servicos/portal` |
| TDD e testes unitarios | 0,8 | `testes/unidade`; comando `bash scripts/testar-tudo.sh` |
| BDD e cenarios de comportamento | 0,8 | `testes/bdd/funcionalidades`; Cucumber em portugues |
| Docker/Docker Compose | 0,5 | `Dockerfile` em cada servico e `docker-compose.yml` |
| Deploy ativo | 0,5 | `render.yaml` e `PUBLICACAO.md`; preencher o link publicado acima |
| Clareza e justificativas tecnicas | 0,2 | `LEIA-ME.md`, secoes 2, 3, 10 e 12 |

## Comandos de validacao

```bash
bash scripts/testar-tudo.sh
```

Resultado esperado:

```text
47 testes unitarios passando
6 cenarios BDD passando
```

```bash
for svc in servico-alunos servico-financeiro servico-acesso portal; do
  (cd "servicos/$svc" && npm run build)
done
```

```bash
PORTA_ALUNOS=3101 PORTA_FINANCEIRO=3102 PORTA_ACESSO=3103 PORTA_PORTAL=3100 bash scripts/subir-dev.sh
```

Acesse:

```text
http://localhost:3100
```

## Fluxo de demonstracao

1. Abrir o portal publicado ou local.
2. Listar planos.
3. Cadastrar um aluno.
4. Matricular o aluno no plano anual e mostrar o desconto de fidelidade.
5. Emitir uma fatura vencida.
6. Pagar a fatura e mostrar o calculo da multa.
7. Registrar check-in e mostrar a catraca liberada.
8. Abrir o dashboard agregado e explicar o padrao Facade.
