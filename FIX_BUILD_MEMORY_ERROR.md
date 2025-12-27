# Решение проблемы: Out of memory при сборке

## Проблема

При выполнении `npm run build` появляется ошибка:
```
RangeError: WebAssembly.instantiate(): Out of memory: Cannot allocate Wasm memory for new instance
```

Это означает, что на сервере недостаточно памяти для компиляции WebAssembly модулей, которые использует Next.js при сборке.

## Решения

### Решение 1: Увеличение лимита памяти для сборки (попробуйте сначала)

```bash
# Соберите проект с увеличенным лимитом памяти
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Если не помогло, попробуйте больше:
NODE_OPTIONS="--max-old-space-size=3072" npm run build

# Или еще больше:
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Решение 2: Создание swap (виртуальной памяти)

Если у вас есть права sudo:

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

Без sudo (для обычного хостинга):

```bash
# Создайте swap в домашней директории
dd if=/dev/zero of=~/swapfile bs=1M count=2048
chmod 600 ~/swapfile
mkswap ~/swapfile
swapon ~/swapfile

# Проверьте
free -h

# Теперь попробуйте сборку
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

### Решение 3: Сборка локально и загрузка на сервер (РЕКОМЕНДУЕТСЯ)

Если сервер очень слабый, соберите проект локально:

**На локальном компьютере (Windows):**

```bash
cd C:\Users\maks\Desktop\leend

# Убедитесь, что версия Node.js совпадает с сервером (20.x)
node -v

# Соберите проект
npm run build

# Проверьте, что сборка прошла успешно
ls .next
```

**Создайте архив собранного проекта:**

**Вариант A: Через 7-Zip**
1. Правой кнопкой на папку `.next`
2. Выберите "7-Zip" → "Добавить в архив..."
3. Назовите `next-build.7z`

**Вариант B: Через PowerShell**
```powershell
Compress-Archive -Path .next -DestinationPath next-build.zip -CompressionLevel Optimal
```

**Вариант C: Включите и другие необходимые файлы**
```powershell
# Создайте архив со всеми необходимыми файлами для production
Compress-Archive -Path .next,public,package.json,next.config.ts -DestinationPath production-build.zip
```

**Загрузите на сервер:**

1. Используйте FileZilla или WinSCP
2. Подключитесь к серверу reg.ru через SFTP
3. Загрузите архив в `/var/www/u3367936/data/leend/`

**На сервере распакуйте:**

```bash
cd /var/www/u3367936/data/leend

# Если это .zip:
unzip next-build.zip

# Если это .7z:
7z x next-build.7z

# Проверьте
ls -la .next
```

**Запустите приложение:**

```bash
# Убедитесь, что используете Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Запустите через PM2
pm2 start ecosystem.config.js
```

### Решение 4: Оптимизация сборки

Попробуйте сборку с отключением некоторых оптимизаций:

```bash
# Сборка с минимальными оптимизациями
NODE_OPTIONS="--max-old-space-size=2048" NEXT_TELEMETRY_DISABLED=1 npm run build
```

Или измените `next.config.ts` для уменьшения использования памяти:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Отключите некоторые оптимизации для экономии памяти
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Уменьшите параллелизм сборки
  experimental: {
    // Оптимизации для слабых серверов
  },
};

export default nextConfig;
```

### Решение 5: Поэтапная сборка

Если сборка падает на определенном этапе, можно попробовать:

```bash
# Очистите предыдущие сборки
rm -rf .next

# Попробуйте сборку с увеличенным лимитом и логированием
NODE_OPTIONS="--max-old-space-size=2048" npm run build 2>&1 | tee build.log
```

## Проверка доступной памяти

```bash
# Проверьте сколько памяти доступно
free -h

# Или
cat /proc/meminfo | grep MemAvailable
```

## Рекомендуемая последовательность

1. **Проверьте доступную память:**
```bash
free -h
```

2. **Попробуйте сборку с увеличенным лимитом:**
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

3. **Если не помогло, создайте swap:**
```bash
# См. Решение 2 выше
```

4. **Если все еще не работает, соберите локально:**
```bash
# См. Решение 3 выше
```

## После успешной сборки

```bash
# Проверьте результат
ls -la .next

# Запустите приложение
npm start

# Или через PM2
pm2 start ecosystem.config.js
```

## Если ничего не помогает

1. **Свяжитесь с поддержкой reg.ru** и запросите:
   - Увеличение лимита памяти для вашего аккаунта
   - Или перейдите на более мощный тарифный план

2. **Используйте сборку локально** - это самый надежный способ для слабых серверов

3. **Рассмотрите использование Vercel или другого хостинга** для сборки, а затем загрузите готовый билд на reg.ru

