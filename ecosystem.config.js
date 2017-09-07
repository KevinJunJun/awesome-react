module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : "guguder",
      script    : "index.js",
      env: {
        APP_VERSION: require('./package.json').version,
      },
      env_production : {
        NODE_ENV: "production"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "root",
      host : "192.168.150.211",
      ref  : "origin/guguder",
      repo : "git@gitlab.ucloudadmin.com:junjun/guguder.git",
      path : "/data/http/guguder",
      "post-deploy" : "npm install --production && npm run start"
    },
    development : {
      user : "root",
      host : "192.168.150.211",
      ref  : "origin/guguder",
      repo : "git@gitlab.ucloudadmin.com:junjun/guguder.git",
      path : "/data/http/guguder",
      "post-deploy" : "npm install && npm run dev",
      env  : {
        NODE_ENV: "development"
      }
    }
  }
};
