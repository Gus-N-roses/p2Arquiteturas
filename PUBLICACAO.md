# Guia de Deploy

O sistema é 100% conteinerizado e roda em qualquer plataforma que execute Docker.
Abaixo, dois caminhos testados de publicação. Ambos entregam **um único link
público** (o do `portal`), que orquestra os demais serviços.

---

## Opção A — Render (Blueprint, recomendado / gratuito)

1. Suba este repositório para o GitHub.
2. No [Render](https://render.com): **New > Blueprint** e selecione o repositório.
   O arquivo [`render.yaml`](./render.yaml) cria os 4 serviços automaticamente.
3. Aguarde o primeiro build dos 4 serviços. Cada um recebe uma URL
   `https://<nome>.onrender.com`.
4. Preencha as variáveis de ambiente que ficaram pendentes (`sync: false`),
   usando as URLs geradas no passo anterior:

   | Serviço          | Variável                | Valor (exemplo)                          |
   | ---------------- | ----------------------- | ---------------------------------------- |
   | `servico-acesso` | `URL_SERVICO_ALUNOS`      | `https://servico-alunos.onrender.com`      |
   | `portal`         | `URL_SERVICO_ALUNOS`      | `https://servico-alunos.onrender.com`      |
   | `portal`         | `URL_SERVICO_FINANCEIRO` | `https://servico-financeiro.onrender.com` |
   | `portal`         | `URL_SERVICO_ACESSO`     | `https://servico-acesso.onrender.com`     |

5. Faça **Manual Deploy / Save** para aplicar as variáveis. Pronto:
   o link público do sistema é a URL do **portal**.

> Observação: no plano gratuito os serviços "dormem" após inatividade; a
> primeira requisição pode levar alguns segundos para "acordar" o container.

### Se criar os serviços manualmente no Render

Não use o root do repositório para todos os serviços. Configure assim:

| Serviço | Root Directory | Dockerfile Path | Docker Context |
| ------- | -------------- | --------------- | -------------- |
| `servico-alunos` | `servicos/servico-alunos` | `Dockerfile` | `.` |
| `servico-financeiro` | `servicos/servico-financeiro` | `Dockerfile` | `.` |
| `servico-acesso` | `servicos/servico-acesso` | `Dockerfile` | `.` |
| `portal` | `servicos/portal` | `Dockerfile` | `.` |

Se o Render mostrar `failed to read dockerfile: open Dockerfile: no such file
or directory`, algum serviço está com o Root Directory errado ou está ignorando
o Blueprint.

---

## Opção B — VM única com Docker Compose (Google Cloud / AWS / qualquer VPS)

Ideal quando se quer rede interna entre os serviços e um só IP público.

```bash
# Em uma VM (ex.: Google Compute Engine) com Docker instalado:
git clone <seu-repo>.git && cd <repo>
docker compose up --build -d
# Libere a porta 3000 no firewall da VM.
# Link público: http://<IP_DA_VM>:3000
```

Como o Compose usa service discovery interno (`http://servico-alunos:3001`
etc.), nenhuma URL extra precisa ser configurada.

---

## Verificação pós-deploy

```bash
BASE=https://<seu-portal>        # ou http://<IP_DA_VM>:3000

curl $BASE/health
# Cria aluno
curl -X POST $BASE/api/members/students -H 'Content-Type: application/json' \
  -d '{"name":"Aluno Teste","cpf":"529.982.247-25","email":"teste@email.com"}'
```
