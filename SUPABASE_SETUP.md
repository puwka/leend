# Настройка Supabase для админки

## Шаги по настройке

### 1. Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Запишите следующие данные:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (находится в Settings > API)
   - **Service Role Key** (находится в Settings > API, секретная!)

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта и добавьте:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Важно:** 
- `NEXT_PUBLIC_*` переменные доступны на клиенте
- `SUPABASE_SERVICE_ROLE_KEY` должна быть только на сервере (не добавляйте `NEXT_PUBLIC_`)

### 3. Создание таблиц в Supabase

1. Перейдите в Supabase Dashboard
2. Откройте SQL Editor
3. Скопируйте содержимое файла `supabase-schema.sql`
4. Вставьте и выполните SQL запрос

Это создаст:
- Таблицу `admin` (для хранения пароля администратора)
- Таблицу `portfolio` (для кейсов портфолио)
- Таблицу `settings` (для настроек сайта)
- Таблицу `documents` (для политики конфиденциальности и оферты)
- Триггеры для автоматического обновления `updated_at`
- Начальные данные

### 4. Настройка Row Level Security (RLS)

Для безопасности рекомендуется настроить RLS политики:

#### Для таблицы `admin`:
```sql
-- Отключаем RLS для admin (используется только через service role)
ALTER TABLE admin DISABLE ROW LEVEL SECURITY;
```

#### Для таблицы `portfolio`:
```sql
-- Разрешаем всем читать портфолио
CREATE POLICY "Anyone can read portfolio"
  ON portfolio FOR SELECT
  USING (true);

-- Только через service role можно изменять
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
```

#### Для таблицы `settings`:
```sql
-- Разрешаем всем читать настройки
CREATE POLICY "Anyone can read settings"
  ON settings FOR SELECT
  USING (true);

-- Только через service role можно изменять
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
```

#### Для таблицы `documents`:
```sql
-- Разрешаем всем читать документы
CREATE POLICY "Anyone can read documents"
  ON documents FOR SELECT
  USING (true);

-- Только через service role можно изменять
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

### 5. Проверка работы

1. Запустите проект: `npm run dev`
2. Перейдите на `/admin`
3. Войдите с паролем по умолчанию: `admin123`
4. Проверьте работу всех разделов админки

### 6. Смена пароля по умолчанию

После первого входа обязательно смените пароль в разделе "Безопасность" админ-панели!

## Миграция данных из JSON файлов

Если у вас уже есть данные в JSON файлах, вы можете импортировать их:

1. **Портфолио**: Данные из `src/data/portfolio.json` уже включены в SQL схему
2. **Настройки**: Данные из `src/data/settings.json` уже включены в SQL схему
3. **Документы**: Данные из `src/data/documents.json` уже включены в SQL схему

После выполнения SQL скрипта все начальные данные будут загружены автоматически.

## Устранение проблем

### Ошибка "Missing Supabase environment variables"
- Убедитесь, что файл `.env.local` создан и содержит все необходимые переменные
- Перезапустите сервер разработки после добавления переменных

### Ошибка "Supabase не настроен"
- Проверьте, что `SUPABASE_SERVICE_ROLE_KEY` указан в `.env.local`
- Убедитесь, что переменная не имеет префикса `NEXT_PUBLIC_`

### Таблицы не найдены
- Убедитесь, что SQL скрипт выполнен полностью
- Проверьте в Supabase Dashboard, что таблицы созданы

