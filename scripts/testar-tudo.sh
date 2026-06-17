#!/usr/bin/env bash
# Roda os testes unitários (TDD) e os cenários BDD de todos os microsserviços.
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVICOS=(servico-alunos servico-financeiro servico-acesso portal)

for servico in "${SERVICOS[@]}"; do
  echo ""
  echo "==================== $servico ===================="
  cd "$ROOT/servicos/$servico"
  [ -d node_modules ] || npm install
  npm test
  if grep -q '"bdd"' package.json; then
    npm run bdd
  fi
done

echo ""
echo "✅ Todos os testes passaram."
