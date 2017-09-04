var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'xmas-club'
    },
    port: process.env.PORT || 3000,
    env: 'dev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'xmas-club'
    },
    port: process.env.PORT || 3000,
    env: 'test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'xmas-club'
    },
    port: process.env.PORT || 3000,
    env: 'prod'
  }
};

module.exports = config[env];