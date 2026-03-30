# VetClinic Demo Automation Base

Base full stack para una veterinaria con arquitectura separada:

- `frontend/`: SPA Angular 20
- `backend/`: API REST Laravel 12 + Sanctum

La solución está pensada para integración frontend-backend y para servir como base de QA Automation con Playwright.

Incluye además:

- búsqueda y paginación server-side en listas principales
- fotografías para clientes, mascotas y veterinarios
- adjunto opcional en historial clínico
- selectores modales con grilla y filtros para cliente, mascota y veterinario

## Arquitectura

```text
demo-automation/
├─ frontend/
│  └─ src/app/
│     ├─ core/
│     ├─ models/
│     ├─ pages/
│     ├─ services/
│     └─ shared/
└─ backend/
   ├─ app/
   │  ├─ Http/Controllers/Api/
   │  ├─ Http/Requests/
   │  ├─ Http/Resources/
   │  ├─ Models/
   │  └─ Services/
   ├─ database/factories/
   ├─ database/migrations/
   ├─ database/seeders/
   └─ routes/api.php
```

## Backend

Stack:

- Laravel 12
- Laravel Sanctum con Bearer Token
- API versionada en `/api/v1`
- CORS habilitado para `http://localhost:4200`

Entidades:

- `users`
- `clients`
- `pets`
- `veterinarians`
- `appointments`
- `clinical_records`
- `veterinary_services`
- `appointment_veterinary_service`

Base URL:

- `http://localhost:8000/api/v1`

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

Recursos:

- `GET|POST /users`
- `GET|POST /clients`
- `GET|POST /pets`
- `GET|POST /veterinarians`
- `GET|POST /appointments`
- `GET|POST /clinical-records`
- `GET|POST /veterinary-services`
- `GET /dashboard`

Cada recurso también expone `show`, `update` y `delete`.

Listas paginadas:

- `GET /clients?search=&page=1&per_page=8`
- `GET /pets?search=&page=1&per_page=8`
- `GET /veterinarians?search=&page=1&per_page=8`
- `GET /appointments?search=&page=1&per_page=8`
- `GET /clinical-records?search=&page=1&per_page=8`

Credenciales demo:

- `admin@vetdemo.test`
- `password`

## Frontend

Páginas mínimas implementadas:

- `login`
- `register`
- `dashboard`
- `clients`
- `pets`
- `veterinarians`
- `appointments`
- `clinical-records`

Archivos clave:

- `frontend/src/app/core/config/api.config.ts`
- `frontend/src/app/core/auth/auth.service.ts`
- `frontend/src/app/core/auth/auth.interceptor.ts`
- `frontend/src/app/core/auth/auth.guard.ts`
- `frontend/src/app/services/vet-api.service.ts`
- `frontend/src/app/shared/pagination/`
- `frontend/src/app/shared/entity-selector-modal/`

## Respuesta JSON

Respuesta simple:

```json
{
  "message": "Cliente creado correctamente.",
  "data": {
    "id": 1,
    "full_name": "Maria Lopez"
  }
}
```

Respuesta paginada:

```json
{
  "message": "Listado de clientes.",
  "data": {
    "items": [],
    "pagination": {
      "current_page": 1,
      "last_page": 4,
      "per_page": 8,
      "total": 29,
      "from": 1,
      "to": 8,
      "has_more_pages": true
    }
  }
}
```

Error típico:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

## Ejemplo de consumo

```ts
const loginResponse = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@vetdemo.test',
    password: 'password',
  }),
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

const clientsResponse = await fetch('http://localhost:8000/api/v1/clients?page=1&per_page=8', {
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
```

## Instalación

Backend:

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Frontend:

```bash
cd frontend
npm install
npm run start
```

Playwright:

```bash
cd frontend
npm run e2e
```

## Tests base

Backend:

- `backend/tests/Feature/AuthApiTest.php`
- `backend/tests/Feature/ClientApiTest.php`
- `backend/tests/Feature/AppointmentApiTest.php`

Comando:

```bash
cd backend
php artisan test
```

## Nota del entorno actual

En este workspace no estaban disponibles `php` ni `composer`, y tampoco se instalaron dependencias de `frontend/`. Por eso dejé la base implementada y documentada, pero no pude ejecutar migraciones, build ni tests localmente aquí.
