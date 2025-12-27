# Решение проблемы: нехватка памяти при npm install

## Проблема

При выполнении `npm install` появляется ошибка:
```
terminate called after throwing an instance of 'std::bad_alloc'
what(): std::bad_alloc
Aborted (стек памяти сброшен на диск)
```

Это означает, что на сервере недостаточно оперативной памяти (RAM) для установки всех зависимостей.

## Решения

### Решение 1: Увеличьте лимит памяти для Node.js (рекомендуется)

```bash
# Установите зависимости с увеличенным лимитом памяти
NODE_OPTIONS="--max-old-space-size=2048" npm install

# Или для меньшего лимита (если сервер очень слабый)
NODE_OPTIONS="--max-old-space-size=1024" npm install
```

### Решение 2: Установите зависимости по частям

```bash
# Сначала установите только production зависимости
npm install --production --no-optional

# Затем установите devDependencies отдельно
npm install --only=dev --no-optional
```

### Решение 3: Используйте npm ci вместо npm install (более эффективно)

```bash
# Сначала убедитесь, что package-lock.json существует
# Если нет, создайте его локально и загрузите на сервер

# Затем используйте npm ci (более быстрый и эффективный)
NODE_OPTIONS="--max-old-space-size=2048" npm ci
```

### Решение 4: Установите зависимости локально и загрузите node_modules

Если сервер очень слабый, установите зависимости на локальном компьютере:

**На локальном компьютере:**
```bash
npm install
# Создайте архив node_modules (может быть большим)
tar -czf node_modules.tar.gz node_modules
```

**Загрузите на сервер через FTP/SFTP:**
- Загрузите `node_modules.tar.gz` на сервер
- Распакуйте:
```bash
cd /var/www/u3367936/data/leend
tar -xzf node_modules.tar.gz
```

**⚠️ Внимание:** Убедитесь, что версии Node.js на локальной машине и сервере совпадают!

### Решение 5: Используйте swap (виртуальная память)

Если у вас есть права sudo:

```bash
# Создайте swap файл (2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Сделайте постоянным (добавьте в /etc/fstab)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Проверьте
free -h
```

Без sudo (для обычного хостинга):
```bash
# Создайте swap в домашней директории
dd if=/dev/zero of=~/swapfile bs=1M count=2048
chmod 600 ~/swapfile
mkswap ~/swapfile
swapon ~/swapfile

# Проверьте
free -h
```

### Решение 6: Очистите кэш npm перед установкой

```bash
# Очистите кэш npm
npm cache clean --force

# Удалите старые зависимости
rm -rf node_modules package-lock.json

# Установите с увеличенным лимитом памяти
NODE_OPTIONS="--max-old-space-size=2048" npm install
```

## Рекомендуемая последовательность

```bash
# 1. Проверьте доступную память
free -h

# 2. Очистите кэш npm
npm cache clean --force

# 3. Удалите старые зависимости
rm -rf node_modules package-lock.json

# 4. Установите с увеличенным лимитом памяти
NODE_OPTIONS="--max-old-space-size=2048" npm install

# Если не помогло, попробуйте меньше:
NODE_OPTIONS="--max-old-space-size=1024" npm install

# Или еще меньше:
NODE_OPTIONS="--max-old-space-size=512" npm install
```

## Проверка доступной памяти

```bash
# Просмотр использования памяти
free -h

# Или
cat /proc/meminfo | grep MemAvailable
```

## Альтернатива: Используйте более легкие зависимости

Если проблема сохраняется, рассмотрите:
1. Использование более старой версии Next.js (если возможно)
2. Удаление неиспользуемых зависимостей
3. Использование альтернативных пакетов с меньшим размером

## После успешной установки

После успешной установки зависимостей:

```bash
# Соберите проект
npm run build

# Для production можно удалить devDependencies (опционально)
npm prune --production
```

## Если ничего не помогает

Свяжитесь с поддержкой reg.ru и запросите:
- Увеличение лимита памяти для вашего аккаунта
- Или перейдите на более мощный тарифный план

