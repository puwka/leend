# Установка зависимостей при нехватке памяти

## Проблема

Ошибка: `FATAL ERROR: Scavenger: semi-space copy Allocation failed - Javascript heap out of memory`

Это означает, что на сервере недостаточно памяти для установки всех зависимостей.

## Решение 1: Установка с увеличенным лимитом памяти (попробуйте сначала это)

```bash
# Очистите кэш npm
npm cache clean --force

# Удалите старые зависимости
rm -rf node_modules package-lock.json

# Установите с увеличенным лимитом памяти
NODE_OPTIONS="--max-old-space-size=2048" npm install
```

Если не помогло, попробуйте меньше:
```bash
NODE_OPTIONS="--max-old-space-size=1024" npm install
```

Или еще меньше:
```bash
NODE_OPTIONS="--max-old-space-size=512" npm install
```

## Решение 2: Установка по частям (если решение 1 не помогло)

```bash
# Шаг 1: Установите только production зависимости
NODE_OPTIONS="--max-old-space-size=1024" npm install --production --no-optional

# Шаг 2: Установите devDependencies отдельно
NODE_OPTIONS="--max-old-space-size=1024" npm install --only=dev --no-optional
```

## Решение 3: Установка на локальной машине и загрузка на сервер

Если сервер очень слабый, установите зависимости локально:

### На локальном компьютере (Windows):

```bash
# Установите зависимости
npm install

# Создайте архив node_modules (может быть большим, 200-500MB)
# Используйте 7-Zip или WinRAR для создания архива
# Или через PowerShell:
Compress-Archive -Path node_modules -DestinationPath node_modules.zip
```

### На сервере:

```bash
# Загрузите node_modules.zip через FTP/SFTP в директорию проекта
cd /var/www/u3367936/data/leend

# Распакуйте архив
unzip node_modules.zip
# Или если это tar.gz:
tar -xzf node_modules.tar.gz
```

**⚠️ ВАЖНО:** Убедитесь, что версия Node.js на локальной машине и сервере совпадает!

## Решение 4: Использование npm ci (более эффективно)

```bash
# Сначала создайте package-lock.json локально (если его нет)
# На локальной машине:
npm install
# Загрузите package-lock.json на сервер

# На сервере:
NODE_OPTIONS="--max-old-space-size=2048" npm ci
```

## Решение 5: Создание swap (виртуальной памяти)

### Если есть права sudo:

```bash
# Создайте swap файл 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Сделайте постоянным
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Проверьте
free -h
```

### Без sudo (для обычного хостинга):

```bash
# Создайте swap в домашней директории
dd if=/dev/zero of=~/swapfile bs=1M count=2048
chmod 600 ~/swapfile
mkswap ~/swapfile
swapon ~/swapfile

# Проверьте
free -h
```

После создания swap попробуйте установку снова:
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm install
```

## Рекомендуемая последовательность действий

1. **Проверьте доступную память:**
```bash
free -h
```

2. **Очистите кэш и удалите старые зависимости:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json .next
```

3. **Попробуйте установку с увеличенным лимитом:**
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm install
```

4. **Если не помогло, попробуйте меньше:**
```bash
NODE_OPTIONS="--max-old-space-size=1024" npm install
```

5. **Если все еще не работает, используйте установку по частям:**
```bash
NODE_OPTIONS="--max-old-space-size=1024" npm install --production --no-optional
NODE_OPTIONS="--max-old-space-size=1024" npm install --only=dev --no-optional
```

6. **Если ничего не помогает, установите локально и загрузите на сервер**

## После успешной установки

```bash
# Соберите проект
npm run build

# Проверьте, что сборка прошла успешно
ls -la .next
```

## Если проблема сохраняется

Свяжитесь с поддержкой reg.ru и запросите:
- Увеличение лимита памяти для вашего аккаунта
- Или перейдите на более мощный тарифный план

