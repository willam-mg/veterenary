# Backend VetClinic Demo

La guía general está en [`../README.md`](../README.md).

Arranque rápido:

```bash
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Base URL:

- `http://localhost:8000/api/v1`
