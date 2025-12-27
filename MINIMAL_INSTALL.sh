#!/bin/bash
# Скрипт для установки зависимостей с минимальным использованием памяти

echo "Очистка кэша и старых файлов..."
npm cache clean --force
rm -rf node_modules package-lock.json .next

echo "Проверка доступной памяти..."
free -h

echo "Установка с минимальным лимитом памяти (512MB)..."
NODE_OPTIONS="--max-old-space-size=512" npm install --no-optional

if [ $? -ne 0 ]; then
    echo "Ошибка при установке. Пробуем с еще меньшим лимитом (256MB)..."
    NODE_OPTIONS="--max-old-space-size=256" npm install --no-optional
    
    if [ $? -ne 0 ]; then
        echo "Установка не удалась. Рекомендуется установить зависимости локально и загрузить на сервер."
        echo "См. файл FINAL_SOLUTION_MEMORY.md для инструкций."
        exit 1
    fi
fi

echo "Установка завершена успешно!"
echo "Проверка наличия next..."
ls node_modules/.bin/next

if [ $? -eq 0 ]; then
    echo "Next.js установлен. Попробуйте собрать проект: npm run build"
else
    echo "Next.js не найден. Установите его отдельно:"
    echo "NODE_OPTIONS=\"--max-old-space-size=256\" npm install next --save-dev"
fi

