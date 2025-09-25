// pm2 stop 0 && pm2 start ecosystem.config.js --env dev && pm2 logs 0

module.exports = {
  apps: [{
    name: "EXP_Monitoring_Server",
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: ["node_modules", "file_storage"],
    env: {

    },
    env_dev: {
      PORT: 4098,
      NODE_ENV: "dev",
      IS_DEV: 'true',
    },
    env_prod: {
      PORT: 4098,
      NODE_ENV: "prod",
      IS_DEV: 'false',
    },
  }],
};
