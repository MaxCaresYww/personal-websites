// PM2 configuration (alternative to systemd)
module.exports = {
  apps: [{
    name: 'personal-website',
    script: 'server.js',
    cwd: '/opt/personal-website',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/personal-website-error.log',
    out_file: '/var/log/pm2/personal-website-out.log',
    log_file: '/var/log/pm2/personal-website-combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G'
  }]
};