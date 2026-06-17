module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['testes/bdd/passos/**/*.ts'],
    paths: ['testes/bdd/funcionalidades/**/*.feature'],
    format: ['progress', ['html', 'relatorios/cucumber.html']],
  },
};
