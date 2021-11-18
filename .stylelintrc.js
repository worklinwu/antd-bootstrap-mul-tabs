const { getStylelintConfig } = require('@iceworks/spec');

module.exports = getStylelintConfig('react', {
  rules: {
    'max-line-length': 200,
  },
});
