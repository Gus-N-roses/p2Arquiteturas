import { createApp } from './apresentacao/http/servidor';

const port = Number(process.env.PORT ?? 3003);

createApp().listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ service: 'servico-acesso', message: `ouvindo na porta ${port}` }));
});
