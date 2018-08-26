const path = require('path');

module.exports = {
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'handedness.js',
    library: 'Handedness',
    libraryTarget: 'var'
  },
  mode: 'production'
};
