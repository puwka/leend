# Решение проблемы: ошибка postinstall для unrs-resolver

## Проблема

При выполнении `npm install` появляется ошибка:
```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! unrs-resolver@1.11.1 postinstall: `napi-postinstall unrs-resolver 1.11.1 check`
npm ERR! Exit status 1
```

Это означает, что пакет `unrs-resolver` (нативный модуль) не может быть установлен или скомпилирован.

## Решения

### Решение 1: Пропустить postinstall скрипты (быстрое решение)

```bash
# Установите зависимости, пропуская postinstall скрипты
npm install --ignore-scripts

# Затем попробуйте собрать проект
npm run build
```

**⚠️ Внимание:** Это может привести к проблемам, если пакет действительно нужен для работы.

### Решение 2: Установка с флагом --no-optional (рекомендуется)

```bash
# Очистите кэш
npm cache clean --force

# Удалите старые зависимости
rm -rf node_modules package-lock.json

# Установите без optional зависимостей
npm install --no-optional --ignore-scripts
```

### Решение 3: Установка build tools (если есть права sudo)

Если `unrs-resolver` действительно нужен, установите инструменты для компиляции:

```bash
# Для CentOS/RHEL:
sudo yum groupinstall "Development Tools"
sudo yum install python3

# Для Ubuntu/Debian:
sudo apt-get update
sudo apt-get install build-essential python3
```

Затем попробуйте установку снова:
```bash
npm install
```

### Решение 4: Игнорирование проблемных пакетов

Если `unrs-resolver` не критичен для вашего проекта, можно установить зависимости без него:

```bash
# Установите основные зависимости
npm install --ignore-scripts --no-optional

# Если нужно, установите devDependencies отдельно
npm install --only=dev --ignore-scripts --no-optional
```

### Решение 5: Установка локально и загрузка на сервер (самое надежное)

Если проблемы продолжаются, установите зависимости локально:

**На локальном компьютере:**
```bash
cd C:\Users\maks\Desktop\leend
npm install
npm run build
```

**Создайте архив node_modules:**
- Через 7-Zip: правой кнопкой → "7-Zip" → "Добавить в архив..."
- Или через PowerShell: `Compress-Archive -Path node_modules -DestinationPath node_modules.zip`

**Загрузите на сервер и распакуйте:**
```bash
cd /var/www/u3367936/data/leend
unzip node_modules.zip  # или tar -xzf node_modules.tar.gz
```

## Проверка, нужен ли unrs-resolver

Проверьте, используется ли `unrs-resolver` в вашем проекте:

```bash
# Поиск в коде
grep -r "unrs-resolver" src/
grep -r "unrs-resolver" package.json
```

Если не найден, значит это транзитивная зависимость и можно безопасно пропустить.

## Рекомендуемая последовательность

```bash
# 1. Очистите все
npm cache clean --force
rm -rf node_modules package-lock.json

# 2. Установите с игнорированием скриптов и optional зависимостей
npm install --ignore-scripts --no-optional

# 3. Попробуйте собрать проект
npm run build

# 4. Если сборка успешна, все в порядке
# Если нет, используйте установку локально
```

## Если проблема сохраняется

1. **Проверьте логи:**
```bash
cat /var/www/u3367936/data/.npm/_logs/2025-12-27T15_24_40_786Z-debug.log
```

2. **Попробуйте установку с минимальными зависимостями:**
```bash
npm install next react react-dom --save
npm install --production --ignore-scripts --no-optional
npm install --only=dev --ignore-scripts --no-optional
```

3. **Используйте установку локально** - это самый надежный способ для проблемных серверов.

