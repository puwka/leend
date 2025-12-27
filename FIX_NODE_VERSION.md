# Решение проблемы: SyntaxError: Unexpected token ?

## Проблема

Ошибка `SyntaxError: Unexpected token ?` при выполнении `npm run build` означает, что версия Node.js на сервере слишком старая.

**Next.js 16.0.10 требует Node.js версии 18.17.0 или выше (рекомендуется 20.x).**

**⚠️ ВАЖНО:** Даже если вы установили Node.js 20 через NVM, нужно убедиться, что он используется перед каждой командой!

## Быстрое решение

### Шаг 1: Проверьте текущую версию

```bash
node -v
```

Если версия ниже 18.17, нужно обновить.

### Шаг 2: Обновите Node.js

#### Вариант A: Если у вас есть права sudo (VPS)

```bash
# Установите Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте версию
node -v
npm -v
```

#### Вариант B: Если нет прав sudo (обычный хостинг reg.ru)

Используйте NVM (Node Version Manager):

```bash
# 1. Проверьте домашнюю директорию
echo $HOME
# Или
pwd
# Запомните путь, например: /var/www/u3367936/data

# 2. Установите NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 3. Загрузите NVM вручную (если .bashrc отсутствует)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Если файл .bashrc отсутствует, создайте его:
if [ ! -f ~/.bashrc ]; then
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
fi

# 4. Загрузите NVM для текущей сессии
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 5. Установите Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# 6. Проверьте версию
node -v
npm -v
```

**Важно:** После установки через NVM, Node.js будет доступен только в текущей сессии SSH. Чтобы сделать его постоянным:

1. **Если файл `.bashrc` отсутствует, создайте его:**
```bash
# Создайте .bashrc если его нет
cat > ~/.bashrc << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
```

2. **Или добавьте в существующий `.bashrc`:**
```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
```

3. **Создайте файл `~/.nvmrc` с содержимым:**
```bash
echo "20" > ~/.nvmrc
```

3. Найдите путь к установленному Node.js:
```bash
which node
# Или
nvm which 20
# Выведет что-то вроде: /home/u3367936/.nvm/versions/node/v20.11.0/bin/node
```

4. Обновите `ecosystem.config.js`:

**Вариант A: Использование полного пути к Node.js (рекомендуется)**
```javascript
module.exports = {
  apps: [
    {
      name: 'leend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/u3367936/data/leend',
      interpreter: '/.nvm/versions/node/v20.19.6/bin/node',
      // Замените путь на тот, который показал 'nvm which 20'
      // ... остальные настройки
    },
  ],
};
```

**Вариант B: Использование bash с загрузкой NVM**
```javascript
module.exports = {
  apps: [
    {
      name: 'leend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/u3367936/data/leend',
      interpreter: '/bin/bash',
      interpreter_args: '-c "source ~/.nvm/nvm.sh && nvm use 20 && npm start"',
      // ... остальные настройки
    },
  ],
};
```

### Шаг 3: Переустановите зависимости

```bash
cd /var/www/u3367936/data/leend

# Убедитесь, что используете правильную версию Node.js
node -v
# Должно быть: v20.x.x

# Если версия неправильная, загрузите NVM:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Удалите старые зависимости
rm -rf node_modules package-lock.json .next

# Установите заново (БЕЗ --production, чтобы установить devDependencies)
npm install

# Попробуйте собрать проект
npm run build
```

**ВАЖНО:** Используйте `npm install` (без `--production`), так как Next.js нужен для сборки!

### Шаг 4: Если сборка успешна, запустите приложение

```bash
# Обновите ecosystem.config.js с правильным путем к Node.js (если используете NVM)
nano ecosystem.config.js

# Запустите через PM2
pm2 start ecosystem.config.js
pm2 save
```

## Проверка после обновления

```bash
# Версия Node.js
node -v
# Должно быть: v20.x.x или v18.17.0+

# Версия npm
npm -v

# Попробуйте сборку
npm run build
```

## Если проблема сохраняется

1. Убедитесь, что используете правильную версию Node.js:
   ```bash
   which node
   node -v
   ```

2. Проверьте, что PM2 использует правильную версию:
   ```bash
   pm2 stop leend
   pm2 delete leend
   # Обновите ecosystem.config.js с правильным путем
   pm2 start ecosystem.config.js
   ```

3. Проверьте логи:
   ```bash
   npm run build 2>&1 | tee build.log
   cat build.log
   ```

## Альтернативное решение: Использование Docker

Если обновление Node.js невозможно, рассмотрите использование Docker с образом Node.js 20.

