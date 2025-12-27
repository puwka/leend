# Настройка NVM на reg.ru (если .bashrc отсутствует)

## Проблема

При выполнении `source ~/.bashrc` появляется ошибка:
```
-bash: /var/www/u3367936/data/.bashrc: No such file or directory
```

Это означает, что файл `.bashrc` отсутствует в домашней директории.

## Решение

### Шаг 1: Установите NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Шаг 2: Загрузите NVM вручную (без .bashrc)

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### Шаг 3: Создайте .bashrc

```bash
# Создайте файл .bashrc
cat > ~/.bashrc << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
```

Или вручную:
```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
```

### Шаг 4: Установите Node.js 20

```bash
nvm install 20
nvm use 20
nvm alias default 20
```

### Шаг 5: Проверьте версию

```bash
node -v
# Должно показать: v20.x.x

npm -v
```

### Шаг 6: Проверьте путь к Node.js (для PM2)

```bash
which node
# Или
nvm which 20
# Запомните путь, например: /var/www/u3367936/data/.nvm/versions/node/v20.11.0/bin/node
```

## Использование в PM2

После установки NVM, обновите `ecosystem.config.js`:

```bash
nano ecosystem.config.js
```

Измените строку `interpreter` на полный путь к Node.js:

```javascript
module.exports = {
  apps: [
    {
      name: 'leend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/u3367936/data/leend',
      interpreter: '/var/www/u3367936/data/.nvm/versions/node/v20.11.0/bin/node',
      // Замените путь на тот, который показал 'nvm which 20'
      // ... остальные настройки
    },
  ],
};
```

## Проверка работы

```bash
# В новой SSH сессии NVM должен загружаться автоматически
# Если нет, выполните:
source ~/.bashrc

# Проверьте версию
node -v
nvm --version
```

## Если проблемы продолжаются

1. Убедитесь, что NVM установлен:
```bash
ls -la ~/.nvm
```

2. Проверьте содержимое `.bashrc`:
```bash
cat ~/.bashrc
```

3. Загрузите NVM вручную в каждой новой сессии:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
```

