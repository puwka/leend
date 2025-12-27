# Решение проблемы: SyntaxError при сборке

## Проблема

При выполнении `npm run build` появляется ошибка:
```
SyntaxError: Unexpected token ?
at /var/www/u3367936/data/leend/node_modules/next/dist/compiled/commander/index.js:1
```

Это означает, что используется **старая версия Node.js**, которая не поддерживает современный синтаксис JavaScript (optional chaining `?.`).

**Next.js 16 требует Node.js версии 18.17.0 или выше (рекомендуется 20.x).**

## Решение

### Шаг 1: Проверьте текущую версию Node.js

```bash
node -v
```

Если версия ниже 18.17, нужно использовать правильную версию.

### Шаг 2: Загрузите NVM и используйте Node.js 20

```bash
# Загрузите NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Используйте Node.js 20
nvm use 20

# Проверьте версию
node -v
# Должно показать: v20.x.x
```

### Шаг 3: Если Node.js 20 не установлен, установите его

```bash
# Загрузите NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Установите Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Проверьте версию
node -v
```

### Шаг 4: Пересоберите проект с правильной версией Node.js

```bash
# Убедитесь, что используете Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Проверьте версию перед сборкой
node -v

# Соберите проект
npm run build
```

## Важно: Проверка версии перед каждой командой

В каждой новой SSH сессии нужно загружать NVM:

```bash
# Добавьте в начало каждого скрипта или выполняйте перед командами:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
```

## Автоматическая загрузка NVM

Чтобы NVM загружался автоматически, добавьте в `~/.bashrc`:

```bash
# Добавьте в конец файла ~/.bashrc
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo 'nvm use 20' >> ~/.bashrc

# Перезагрузите профиль
source ~/.bashrc
```

## Проверка после исправления

```bash
# 1. Проверьте версию Node.js
node -v
# Должно быть: v20.x.x

# 2. Проверьте версию npm
npm -v

# 3. Попробуйте собрать проект
npm run build

# 4. Если сборка успешна, проверьте результат
ls -la .next
```

## Если проблема сохраняется

### 1. Убедитесь, что используете правильную версию в каждой команде:

```bash
# Создайте скрипт для проверки
cat > check-node.sh << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
EOF

chmod +x check-node.sh
./check-node.sh
```

### 2. Переустановите зависимости с правильной версией Node.js:

```bash
# Загрузите NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Удалите старые зависимости
rm -rf node_modules package-lock.json .next

# Установите заново
npm install --ignore-scripts --no-optional

# Соберите проект
npm run build
```

### 3. Проверьте, какая версия Node.js используется по умолчанию:

```bash
which node
# Должен показать путь к Node.js 20, например:
# /var/www/u3367936/data/.nvm/versions/node/v20.x.x/bin/node

# Если показывает другой путь, используйте nvm use 20
```

## Для PM2: Обновите ecosystem.config.js

Убедитесь, что в `ecosystem.config.js` указан правильный путь к Node.js 20:

```bash
# Найдите путь к Node.js 20
nvm which 20
# Выведет что-то вроде: /var/www/u3367936/data/.nvm/versions/node/v20.x.x/bin/node

# Обновите ecosystem.config.js
nano ecosystem.config.js
```

Измените строку `interpreter`:
```javascript
interpreter: '/var/www/u3367936/data/.nvm/versions/node/v20.x.x/bin/node',
// Замените на путь, который показал 'nvm which 20'
```

## Резюме

**Главная причина ошибки:** Используется старая версия Node.js.

**Решение:** Используйте Node.js 20.x через NVM перед выполнением любых команд npm/node.

**Проверка:** Всегда проверяйте `node -v` перед сборкой - должно быть v20.x.x или минимум v18.17.0.

## Дополнительная проблема: Out of memory при сборке

Если после исправления версии Node.js появляется ошибка:
```
RangeError: WebAssembly.instantiate(): Out of memory
```

Это означает нехватку памяти при сборке. См. файл `FIX_BUILD_MEMORY_ERROR.md` для решений.

