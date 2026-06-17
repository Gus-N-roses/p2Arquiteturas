import { carregarConfiguracao } from './configuracao';
import { createApp } from './http/servidor';

const config = carregarConfiguracao();

createApp(config).listen(config.porta, () => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ service: 'portal', message: `ouvindo na porta ${config.porta}` }));
});
