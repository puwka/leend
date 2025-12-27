module.exports = {
  apps: [
    {
      name: 'leend',
      script: 'npm',
      args: 'start',
      // ИЗМЕНИТЕ путь на ваш реальный путь к проекту
      cwd: '/var/www/u3367936/data/leend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Если используете NVM (без прав sudo), укажите полный путь к Node.js:
      // Сначала найдите путь: nvm which 20
      // Затем укажите его здесь, например:
      // interpreter: '/var/www/u3367936/data/.nvm/versions/node/v20.19.6/bin/node',
      // Или используйте bash с загрузкой NVM:
      // interpreter: '/bin/bash',
      // interpreter_args: '-c "source ~/.nvm/nvm.sh && nvm use 20 && npm start"',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
    },
  ],
};

