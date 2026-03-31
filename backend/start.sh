#!/bin/sh
set -e

echo "Clearing Laravel caches..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

echo "Running database migrations..."
php artisan migrate --force

echo "Running database seeders..."
php artisan db:seed --force || true

echo "Creating storage link..."
php artisan storage:link || true

echo "Starting Laravel server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}