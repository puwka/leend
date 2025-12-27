# Инструкция по деплою на reg.ru

## Подготовка проекта

### 1. Настройка переменных окружения

1. Скопируйте файл `.env.example` в `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Заполните переменные окружения в `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - URL вашего проекта Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon ключ из Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` - Service Role ключ из Supabase
   - `NEXT_PUBLIC_SITE_URL` - URL вашего сайта (например, https://your-domain.ru)

### 2. Проверка сборки проекта

Перед деплоем убедитесь, что проект собирается без ошибок:

```bash
npm install
npm run build
```

Если сборка успешна, можно переходить к деплою.

## Варианты деплоя на reg.ru

### Вариант 1: VPS (рекомендуется)

Reg.ru предоставляет VPS серверы, на которых можно развернуть Next.js приложение.

#### Шаг 1: Подключение к серверу

1. Получите доступ к VPS через SSH
2. Установите необходимые инструменты:

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Проверьте текущую версию Node.js (если установлена)
node -v

# Установка Node.js (версия 20.x) - ОБЯЗАТЕЛЬНО для Next.js 16
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте версию после установки (должна быть 20.x)
node -v
npm -v

# Установка PM2 для управления процессом
sudo npm install -g pm2

# Установка Nginx (опционально, для проксирования)
sudo apt install nginx -y
```

**ВАЖНО:** Если у вас нет прав sudo (обычный хостинг reg.ru), используйте NVM:

```bash
# Установите NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Перезагрузите профиль
source ~/.bashrc
# или
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Установите Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Проверьте версию
node -v
npm -v
```

#### Шаг 2: Загрузка проекта на сервер

**ВАЖНО:** Сначала загрузите файлы проекта на сервер!

1. **Проверьте текущую директорию:**
```bash
pwd
# Должно показать, например: /var/www/u3367936/data
```

2. **Проверьте наличие файлов проекта:**
```bash
ls -la
# Если package.json отсутствует, нужно загрузить файлы
```

3. **Загрузите файлы проекта одним из способов:**

   **Вариант A: Через Git (если есть репозиторий)**
   ```bash
   cd /var/www/u3367936/data
   git clone your-repository-url leend
   cd leend
   ```

   **Вариант B: Через SFTP/FTP (рекомендуется для reg.ru)**
   - Используйте FileZilla, WinSCP или другой FTP-клиент
   - Подключитесь к серверу reg.ru через SFTP
   - Создайте папку `leend` в `/var/www/u3367936/data/`
   - Загрузите ВСЕ файлы проекта в эту папку:
     - `package.json`
     - `next.config.ts`
     - `ecosystem.config.js`
     - Папку `src/` (со всем содержимым)
     - Папку `public/` (со всем содержимым)
     - Все остальные файлы проекта
   - Затем перейдите в директорию:
   ```bash
   cd /var/www/u3367936/data/leend
   ```

   **Вариант C: Через архивацию**
   - На локальном компьютере создайте архив (исключая node_modules, .next, .git):
   ```bash
   tar -czf leend.tar.gz --exclude='node_modules' --exclude='.next' --exclude='.git' .
   ```
   - Загрузите `leend.tar.gz` на сервер через FTP
   - Распакуйте:
   ```bash
   cd /var/www/u3367936/data
   tar -xzf leend.tar.gz -C leend
   cd leend
   ```

4. **Проверьте, что файлы загружены:**
```bash
ls package.json
# Должен показать: package.json
```

5. **Установите зависимости:**

```bash
npm install --production
```

3. Создайте файл `.env.local` на сервере с переменными окружения:

```bash
nano .env.local
```

Вставьте переменные окружения (см. `.env.example`)

#### Шаг 3: Сборка проекта

```bash
npm run build
```

#### Шаг 4: Настройка PM2

1. Отредактируйте `ecosystem.config.js`, указав правильный путь к проекту:

```bash
nano ecosystem.config.js
```

Измените строку `cwd` на ваш реальный путь:
```javascript
cwd: '/var/www/u3367936/data/leend', // замените на ваш реальный путь
```

Чтобы узнать точный путь, выполните:
```bash
pwd
```

2. Запустите приложение через PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Шаг 5: Настройка Nginx (опционально)

Создайте конфигурацию Nginx:

```bash
sudo nano /etc/nginx/sites-available/leend
```

Вставьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name your-domain.ru www.your-domain.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/leend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Шаг 6: Настройка SSL (HTTPS)

Reg.ru предоставляет бесплатные SSL сертификаты. Настройте через панель управления или используйте Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.ru -d www.your-domain.ru
```

### Вариант 2: Облачный хостинг reg.ru

Если у вас облачный хостинг с поддержкой Node.js:

1. Загрузите файлы проекта через FTP/SFTP
2. Установите зависимости через SSH:
   ```bash
   npm install --production
   ```
3. Создайте `.env.local` с переменными окружения
4. Соберите проект:
   ```bash
   npm run build
   ```
5. Запустите приложение:
   ```bash
   npm start
   ```

## Настройка базы данных Supabase

1. Убедитесь, что все SQL миграции выполнены в Supabase:
   - `supabase-schema.sql` - основная схема
   - `supabase-admin-username-migration.sql` - миграция для username
   - `supabase-faq-services-schema.sql` - схема для FAQ и Services

2. Выполните миграции в SQL Editor Supabase

3. Настройте Supabase Storage для загрузки файлов:
   - Создайте bucket `uploads` в Supabase Storage
   - Настройте публичный доступ к bucket

## Проверка работы

1. Откройте сайт в браузере
2. Проверьте, что все страницы загружаются
3. Проверьте работу админ-панели: `/admin`
4. Проверьте загрузку файлов

## Полезные команды PM2

```bash
# Просмотр статуса
pm2 status

# Просмотр логов
pm2 logs leend

# Перезапуск приложения
pm2 restart leend

# Остановка приложения
pm2 stop leend

# Удаление из PM2
pm2 delete leend
```

## Обновление проекта

1. Подключитесь к серверу через SSH
2. Перейдите в директорию проекта
3. Обновите код (через Git или загрузите новые файлы)
4. Установите зависимости (если нужно):
   ```bash
   npm install --production
   ```
5. Пересоберите проект:
   ```bash
   npm run build
   ```
6. Перезапустите приложение:
   ```bash
   pm2 restart leend
   ```

## Решение проблем

### Приложение не запускается

1. Проверьте логи:
   ```bash
   pm2 logs leend
   ```

2. Проверьте переменные окружения:
   ```bash
   cat .env.local
   ```

3. Проверьте, что порт 3000 свободен:
   ```bash
   sudo netstat -tulpn | grep 3000
   ```

### Ошибки при сборке

1. **Ошибка: SyntaxError: Unexpected token ?**
   
   Это означает, что версия Node.js слишком старая. Next.js 16 требует Node.js 18.17+ или 20.x.
   
   **Решение:**
   ```bash
   # Проверьте версию
   node -v
   
   # Если версия ниже 18.17, обновите (см. Шаг 1 выше)
   # После обновления:
   rm -rf node_modules package-lock.json .next
   npm install --production
   npm run build
   ```

2. Убедитесь, что установлена правильная версия Node.js (18.17+ или 20.x):
   ```bash
   node -v
   # Должна быть минимум 18.17.0 или 20.x.x
   ```

3. Очистите кэш и переустановите зависимости:
   ```bash
   rm -rf node_modules .next package-lock.json
   npm install --production
   npm run build
   ```

### Проблемы с базой данных

1. Проверьте переменные окружения Supabase
2. Убедитесь, что все миграции выполнены
3. Проверьте доступность Supabase API

## Контакты поддержки

При возникновении проблем:
- Документация reg.ru: https://www.reg.ru/support/
- Техническая поддержка: через личный кабинет reg.ru



