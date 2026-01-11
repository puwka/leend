# Быстрая шпаргалка: Деплой на REG.RU

## 🚀 Быстрый старт (краткая версия)

### 1. Подключение к серверу
```bash
ssh логин@130.49.148.108
```

### 2. Установка Node.js через NVM
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20
```

### 3. Установка PM2
```bash
npm install -g pm2
```

### 4. Загрузка проекта
```bash
# Через Git
git clone ваш-репозиторий leend
cd leend

# Или через SFTP (FileZilla) - загрузите архив и распакуйте
```

### 5. Настройка .env.local
```bash
nano .env.local
```
Вставьте:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_ключ
SUPABASE_SERVICE_ROLE_KEY=ваш_ключ
NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
NODE_ENV=production
```

### 6. Установка зависимостей
```bash
npm install --production
# Или если проблемы с памятью:
NODE_OPTIONS="--max-old-space-size=2048" npm install --production
```

### 7. Сборка
```bash
npm run build
# Или с лимитом памяти:
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

### 8. Настройка PM2
```bash
# Отредактируйте путь в ecosystem.config.js
nano ecosystem.config.js  # укажите правильный путь в cwd

# Создайте папку для логов
mkdir -p logs

# Запуск
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 9. Настройка Nginx (опционально)
```bash
sudo nano /etc/nginx/sites-available/leend
```
Вставьте конфигурацию (см. полную инструкцию), затем:
```bash
sudo ln -s /etc/nginx/sites-available/leend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 10. SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.ru -d www.your-domain.ru
```

## 🔧 Полезные команды

```bash
# PM2
pm2 status
pm2 logs leend
pm2 restart leend
pm2 stop leend

# Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx

# Проверка
curl http://localhost:3000
```

## ⚠️ Важно для 1 ГБ RAM

1. **Создайте swap:**
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

2. **Или соберите локально и загрузите .next на сервер**

## 📖 Полная инструкция

См. [DEPLOY_REG_RU.md](./DEPLOY_REG_RU.md) для подробной инструкции со всеми деталями и решением проблем.

