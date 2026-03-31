#!/bin/bash

set -e

echo "Running database migrations..."
php artisan migrate --force

echo "Starting Laravel development server..."
php artisan serve --host=0.0.0.0 --port=8000
