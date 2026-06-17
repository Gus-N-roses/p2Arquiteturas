# Deploy manual no Render: sobe os 4 microsserviços em um único container
# para a demonstração pública do Gym Control funcionar com apenas um link.

FROM node:20-alpine AS alunos-build
WORKDIR /app
COPY servicos/servico-alunos/package*.json ./
RUN npm install
COPY servicos/servico-alunos/tsconfig.json servicos/servico-alunos/tsconfig.build.json ./
COPY servicos/servico-alunos/codigo ./codigo
RUN npm run build

FROM node:20-alpine AS financeiro-build
WORKDIR /app
COPY servicos/servico-financeiro/package*.json ./
RUN npm install
COPY servicos/servico-financeiro/tsconfig.json servicos/servico-financeiro/tsconfig.build.json ./
COPY servicos/servico-financeiro/codigo ./codigo
RUN npm run build

FROM node:20-alpine AS acesso-build
WORKDIR /app
COPY servicos/servico-acesso/package*.json ./
RUN npm install
COPY servicos/servico-acesso/tsconfig.json servicos/servico-acesso/tsconfig.build.json ./
COPY servicos/servico-acesso/codigo ./codigo
RUN npm run build

FROM node:20-alpine AS portal-build
WORKDIR /app
COPY servicos/portal/package*.json ./
RUN npm install
COPY servicos/portal/tsconfig.json servicos/portal/tsconfig.build.json ./
COPY servicos/portal/codigo ./codigo
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY scripts/iniciar-render.sh ./scripts/iniciar-render.sh

COPY servicos/servico-alunos/package*.json ./servicos/servico-alunos/
RUN cd servicos/servico-alunos && npm install --omit=dev && npm cache clean --force
COPY --from=alunos-build /app/dist ./servicos/servico-alunos/dist

COPY servicos/servico-financeiro/package*.json ./servicos/servico-financeiro/
RUN cd servicos/servico-financeiro && npm install --omit=dev && npm cache clean --force
COPY --from=financeiro-build /app/dist ./servicos/servico-financeiro/dist

COPY servicos/servico-acesso/package*.json ./servicos/servico-acesso/
RUN cd servicos/servico-acesso && npm install --omit=dev && npm cache clean --force
COPY --from=acesso-build /app/dist ./servicos/servico-acesso/dist

COPY servicos/portal/package*.json ./servicos/portal/
RUN cd servicos/portal && npm install --omit=dev && npm cache clean --force
COPY --from=portal-build /app/dist ./servicos/portal/dist
COPY servicos/portal/publico ./servicos/portal/publico

EXPOSE 3000
CMD ["sh", "scripts/iniciar-render.sh"]
