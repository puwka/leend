# Решение проблемы: "next: команда не найдена"

## Проблема

При выполнении `npm run build` появляется ошибка:
```
sh: next: команда не найдена
```

Это означает, что:
1. Зависимости не установлены правильно, ИЛИ
2. Используется неправильная версия Node.js, ИЛИ
3. Установка была выполнена с флагом `--production` (который исключает devDependencies)

## Решение

### Шаг 1: Убедитесь, что используете правильную версию Node.js

```bash
# Проверьте версию
node -v
# Должно быть: v20.x.x или v18.17.0+

# Если версия неправильная, загрузите NVM:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Проверьте версию снова
node -v
```

### Шаг 2: Перейдите в директорию проекта

```bash
cd /var/www/u3367936/data/leend
```

### Шаг 3: Удалите старые зависимости

```bash
rm -rf node_modules package-lock.json .next
```

### Шаг 4: Установите зависимости (БЕЗ --production!)

**ВАЖНО:** Используйте `npm install` (без флага `--production`), так как Next.js находится в `devDependencies` и нужен для сборки!

```bash
npm install
```

**НЕ используйте:**
```bash
npm install --production  # ❌ Это исключит devDependencies!
```

### Шаг 5: Проверьте, что next установлен

```bash
# Проверьте наличие next в node_modules
ls node_modules/.bin/next

# Или попробуйте запустить напрямую
./node_modules/.bin/next --version
```

### Шаг 6: Соберите проект

```bash
npm run build
```

## Если проблема сохраняется

### Вариант 1: Установите Next.js глобально (не рекомендуется, но может помочь)

```bash
npm install -g next
```

### Вариант 2: Используйте npx

```bash
npx next build
```

### Вариант 3: Проверьте package.json

Убедитесь, что в `package.json` есть скрипт `build`:

```json
{
  "scripts": {
    "build": "next build"
  }
}
```

### Вариант 4: Проверьте права доступа

```bash
chmod -R 755 node_modules
chmod +x node_modules/.bin/next
```

## Правильная последовательность для деплоя

```bash
# 1. Убедитесь в версии Node.js
node -v

# 2. Загрузите NVM если нужно
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# 3. Перейдите в директорию проекта
cd /var/www/u3367936/data/leend

# 4. Удалите старые зависимости
rm -rf node_modules package-lock.json .next

# 5. Установите ВСЕ зависимости (включая devDependencies)
npm install

# 6. Соберите проект
npm run build

# 7. После успешной сборки, для production можно использовать только production зависимости
# Но для сборки они уже не нужны, так как проект уже собран
```

## Разница между npm install и npm install --production

- **`npm install`** - устанавливает ВСЕ зависимости (dependencies + devDependencies)
- **`npm install --production`** - устанавливает ТОЛЬКО dependencies, исключая devDependencies

**Next.js находится в devDependencies**, поэтому для сборки нужен `npm install` без флага `--production`.

После сборки проект будет в папке `.next`, и для запуска через `npm start` нужны только production зависимости, но для сборки они уже не требуются.

