#!/bin/sh
set -e

echo "APP_ENV=$APP_ENV"
echo "PORT=$PORT"

echo "Clearing Laravel caches..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# IMPORTANTE: generar APP_KEY si no existe
if [ -z "$APP_KEY" ]; then
  echo "APP_KEY not found, generating..."
  php artisan key:generate --force
fi

echo "Running database migrations..."
php artisan migrate --force

# ⚠️ SOLO si realmente necesitas seed en cada deploy
if [ "$RUN_SEED" = "true" ]; then
  echo "Running database seeders..."
  php artisan db:seed --force
fi

echo "Creating storage link..."
php artisan storage:link || true

echo "Fixing permissions..."
chmod -R 775 storage bootstrap/cache || true

echo "Starting Laravel server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}