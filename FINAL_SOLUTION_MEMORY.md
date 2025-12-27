# Финальное решение проблемы нехватки памяти

## Проблема
Ошибка `std::bad_alloc` или `Javascript heap out of memory` при `npm install` означает, что на сервере недостаточно памяти.

## ✅ РЕШЕНИЕ 1: Установка локально и загрузка на сервер (РЕКОМЕНДУЕТСЯ)

Это самый надежный способ для слабых серверов.

### Шаг 1: На локальном компьютере (Windows)

```bash
# Убедитесь, что версия Node.js совпадает с сервером (20.x)
node -v

# Перейдите в директорию проекта
cd C:\Users\maks\Desktop\leend

# Установите зависимости
npm install

# Проверьте, что установка прошла успешно
npm run build
```

### Шаг 2: Создайте архив node_modules

**Вариант A: Через 7-Zip (рекомендуется)**
1. Установите 7-Zip если нет
2. Правой кнопкой на папку `node_modules`
3. Выберите "7-Zip" → "Добавить в архив..."
4. Назовите `node_modules.7z`
5. Выберите максимальное сжатие

**Вариант B: Через PowerShell**
```powershell
Compress-Archive -Path node_modules -DestinationPath node_modules.zip -CompressionLevel Optimal
```

**Вариант C: Через tar (если установлен Git Bash)**
```bash
tar -czf node_modules.tar.gz node_modules
```

### Шаг 3: Загрузите на сервер

1. Используйте FileZilla, WinSCP или другой FTP-клиент
2. Подключитесь к серверу reg.ru через SFTP
3. Загрузите архив в `/var/www/u3367936/data/leend/`

### Шаг 4: На сервере распакуйте

```bash
cd /var/www/u3367936/data/leend

# Если это .7z (нужен p7zip):
# Установите p7zip если нужно:
# sudo yum install p7zip  # или sudo apt install p7zip-full
7z x node_modules.7z

# Если это .zip:
unzip node_modules.zip

# Если это .tar.gz:
tar -xzf node_modules.tar.gz

# Проверьте, что node_modules установлен
ls node_modules/.bin/next
```

### Шаг 5: Соберите проект на сервере

```bash
# Убедитесь, что используете правильную версию Node.js
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Соберите проект
npm run build
```

## ✅ РЕШЕНИЕ 2: Установка с минимальным лимитом памяти

Если хотите попробовать установку на сервере:

```bash
# Очистите все
npm cache clean --force
rm -rf node_modules package-lock.json .next

# Установите с минимальным лимитом
NODE_OPTIONS="--max-old-space-size=512" npm install --no-optional

# Если не помогло, попробуйте еще меньше
NODE_OPTIONS="--max-old-space-size=256" npm install --no-optional
```

## ✅ РЕШЕНИЕ 3: Установка по частям с минимальными лимитами

```bash
# Очистите все
npm cache clean --force
rm -rf node_modules package-lock.json

# Шаг 1: Только критичные зависимости
NODE_OPTIONS="--max-old-space-size=256" npm install next react react-dom --save

# Шаг 2: Остальные production зависимости
NODE_OPTIONS="--max-old-space-size=256" npm install --production --no-optional

# Шаг 3: DevDependencies (если нужно)
NODE_OPTIONS="--max-old-space-size=256" npm install --only=dev --no-optional
```

## ✅ РЕШЕНИЕ 4: Создание swap (виртуальной памяти)

### Без sudo (для обычного хостинга):

```bash
# Создайте swap файл 1GB
dd if=/dev/zero of=~/swapfile bs=1M count=1024
chmod 600 ~/swapfile
mkswap ~/swapfile
swapon ~/swapfile

# Проверьте
free -h

# Теперь попробуйте установку
NODE_OPTIONS="--max-old-space-size=1024" npm install
```

## Проверка доступной памяти

```bash
# Проверьте сколько памяти доступно
free -h

# Или
cat /proc/meminfo | grep MemAvailable
```

## Рекомендация

**Для слабых серверов (менее 1GB RAM) используйте РЕШЕНИЕ 1** - установку локально и загрузку на сервер. Это самый надежный способ.

## После успешной установки

```bash
# Соберите проект
npm run build

# Проверьте сборку
ls -la .next

# Если сборка успешна, можно удалить devDependencies (опционально)
npm prune --production
```

