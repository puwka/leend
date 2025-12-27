# Быстрый старт деплоя на reg.ru

## Проблема: package.json не найден

Если вы видите ошибку `ENOENT: no such file or directory, open '/var/www/u3367936/data/package.json'`, это означает, что:
1. Вы находитесь не в директории проекта, ИЛИ
2. Файлы проекта еще не загружены на сервер

## Решение

### Шаг 1: Проверьте текущую директорию

```bash
pwd
# Должно показать текущий путь, например: /var/www/u3367936/data
```

### Шаг 2: Проверьте, есть ли файлы проекта

```bash
ls -la
# Проверьте, есть ли package.json в списке файлов
```

### Шаг 3: Загрузите файлы проекта

Если файлов нет, загрузите их одним из способов:

#### Вариант A: Через Git (если есть репозиторий)

```bash
cd /var/www/u3367936/data
git clone ваш-репозиторий-URL leend
cd leend
```

#### Вариант B: Через SFTP/FTP

1. Используйте FileZilla, WinSCP или другой FTP-клиент
2. Подключитесь к серверу reg.ru
3. Загрузите ВСЕ файлы проекта в директорию `/var/www/u3367936/data/leend/` (создайте папку leend)
4. Убедитесь, что загружены:
   - `package.json`
   - `next.config.ts`
   - `src/` (вся папка)
   - `public/` (вся папка)
   - Все остальные файлы проекта

#### Вариант C: Через архивацию и загрузку

На локальном компьютере:
```bash
# Создайте архив (исключая node_modules и .next)
tar -czf leend.tar.gz --exclude='node_modules' --exclude='.next' --exclude='.git' .
```

Затем:
1. Загрузите `leend.tar.gz` на сервер через FTP
2. Распакуйте на сервере:
```bash
cd /var/www/u3367936/data
tar -xzf leend.tar.gz
```

### Шаг 4: Перейдите в директорию проекта

```bash
cd /var/www/u3367936/data/leend
# или туда, куда вы загрузили файлы

# Проверьте наличие package.json
ls package.json
```

### Шаг 5: Установите зависимости

```bash
npm install --production
```

### Шаг 6: Создайте .env.local

```bash
nano .env.local
```

Вставьте и заполните:
```
NEXT_PUBLIC_SUPABASE_URL=ваш_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_ключ
SUPABASE_SERVICE_ROLE_KEY=ваш_ключ
NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
NODE_ENV=production
```

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

### Шаг 7: Соберите проект

```bash
npm run build
```

### Шаг 8: Настройте PM2

1. Установите PM2 (если еще не установлен):
```bash
npm install -g pm2
```

2. Отредактируйте ecosystem.config.js:
```bash
nano ecosystem.config.js
```

Измените строку:
```javascript
cwd: '/var/www/u3367936/data/leend', // ваш реальный путь
```

3. Запустите:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Проверка работы

```bash
# Проверьте статус
pm2 status

# Проверьте логи
pm2 logs leend

# Откройте сайт в браузере
```

## Важные замечания

1. **Путь к проекту**: Убедитесь, что путь в `ecosystem.config.js` соответствует реальному пути на сервере
2. **Порт**: По умолчанию Next.js использует порт 3000. Убедитесь, что он доступен
3. **Переменные окружения**: Все переменные из `.env.local` должны быть заполнены
4. **База данных**: Выполните SQL миграции в Supabase перед запуском

## Если проблемы продолжаются

1. Проверьте права доступа:
```bash
chmod -R 755 /var/www/u3367936/data/leend
```

2. Проверьте версию Node.js:
```bash
node -v
# Должна быть 18.x или 20.x
```

3. Проверьте логи PM2:
```bash
pm2 logs leend --lines 50
```

