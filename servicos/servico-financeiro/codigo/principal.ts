import { createApp } from './apresentacao/http/servidor';

const port = Number(process.env.PORT ?? 3002);

createApp().listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ service: 'servico-financeiro', message: `ouvindo na porta ${port}` }));
});
