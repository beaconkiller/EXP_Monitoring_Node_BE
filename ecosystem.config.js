// pm2 stop 0 && pm2 start ecosystem.config.js --env dev && pm2 logs 0

module.exports = {
  apps: [{
      name: "Exp_sitemap",
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: true,
      ignore_watch: ["node_modules", "file_storage"],
      env:{
        MAIL_ID: "eapprovaltf@gmail.com",
        MAIL_PW: "pdsa tsvn hemx zgqb",
        LOGS_FORMAT: "dev",
        JWT_SECRET: "secret",
        THE_KEY_V1 : 'klapaucius',
      },
      env_dev: {
          PORT: 4020,
          NODE_ENV: "dev",
          E_APPROVE_HOST: '192.168.18.4',
          E_APPROVE_USER: 'itdev',
          E_APPROVE_PWD: 'bima123456',
      },
      env_prod: {
          PORT: 4020,
          NODE_ENV: "prod",
          E_APPROVE_HOST: '192.168.18.4',
          E_APPROVE_USER: 'itdev',
          E_APPROVE_PWD: 'bima123456',
      },
  }],
};
