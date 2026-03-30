# Automation

Framework de automatización UI y API para `VetClinic Demo` usando Playwright.

## Alcance

Este proyecto cubre:

- pruebas `smoke`
- pruebas `api`
- pruebas `e2e`
- pruebas `regression`
- Page Object Model para los módulos principales del sistema

## Estructura

```text
automation/
├─ config/
├─ data/
├─ fixtures/
├─ pages/
├─ tests/
│  ├─ api/
│  ├─ smoke/
│  ├─ e2e/
│  └─ regression/
├─ utils/
├─ package.json
└─ playwright.config.ts
```

## Requisitos

- Node.js 20 o superior
- npm
- Frontend levantado en `http://localhost:4200`
- Backend levantado en `http://localhost:8000`

## Instalación

Desde la raíz del repo:

```powershell
cd automation
npm install
```

Instalar navegadores de Playwright:

```powershell
npx.cmd playwright install
```

Si necesitas dependencias del sistema para Playwright:

```powershell
npx.cmd playwright install --with-deps
```

## Variables de entorno

Este proyecto usa estos valores por defecto:

- `WEB_BASE_URL=http://localhost:4200`
- `API_BASE_URL=http://localhost:8000/api/v1`
- `DEMO_USER_EMAIL=admin@vetdemo.test`
- `DEMO_USER_PASSWORD=password`

Puedes sobreescribirlos antes de ejecutar pruebas:

```powershell
$env:WEB_BASE_URL="http://localhost:4200"
$env:API_BASE_URL="http://localhost:8000/api/v1"
$env:DEMO_USER_EMAIL="admin@vetdemo.test"
$env:DEMO_USER_PASSWORD="password"
```

## Ejecución

Ejecutar toda la suite:

```powershell
npm test
```

Ejecutar por capa:

```powershell
npm run test:smoke
npm run test:api
npm run test:e2e
npm run test:regression
```

Listar casos detectados:

```powershell
npx.cmd playwright test --list
```

Ejecutar una carpeta específica:

```powershell
npx.cmd playwright test tests/smoke
npx.cmd playwright test tests/api
```

Ejecutar un archivo:

```powershell
npx.cmd playwright test tests/smoke/auth.smoke.spec.ts
```

Ejecutar en un solo navegador:

```powershell
npx.cmd playwright test --project=chromium
```

Modo UI:

```powershell
npx.cmd playwright test --ui
```

Modo headed:

```powershell
npx.cmd playwright test --headed
```

## CI/CD

Este proyecto ya incluye integración para GitHub Actions y Jenkins.

### GitHub Actions

Los workflows de GitHub Actions viven en la raíz del repositorio:

- `.github/workflows/automation-ci.yml`
- `.github/workflows/automation-full.yml`

Esto es obligatorio porque GitHub no detecta workflows dentro de `automation/.github/workflows`.

#### `automation-ci.yml`

Se ejecuta en:

- `push`
- `pull_request`
- `workflow_dispatch`

Objetivo:

- correr `smoke`
- correr `api`
- subir artifacts de Playwright
- subir resultados de Allure

Este workflow usa `working-directory: automation`.

#### `automation-full.yml`

Se ejecuta en:

- `schedule`
- `workflow_dispatch`

Objetivo:

- correr `e2e`
- correr `regression`
- permitir ejecución manual de `e2e`, `regression` o `all`

#### Variables recomendadas en GitHub

Configura estas variables y secretos en el repositorio:

Variables:

- `WEB_BASE_URL`
- `API_BASE_URL`

Secrets:

- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`

Si no se configuran, los workflows usan estos defaults:

- `http://localhost:4200`
- `http://localhost:8000/api/v1`
- `admin@vetdemo.test`
- `password`

Eso sirve para un entorno self-hosted o una infraestructura donde esas URLs existan. En GitHub-hosted runners normalmente debes apuntar a ambientes desplegados.

### Jenkins

Se agregó un pipeline declarativo en:

- `automation/Jenkinsfile`

Para usarlo en Jenkins:

1. Crea un Pipeline job.
2. Configura `Pipeline script from SCM`.
3. En `Script Path` usa:

```text
automation/Jenkinsfile
```

#### Parámetros del pipeline

- `SUITE`
- `WEB_BASE_URL`
- `API_BASE_URL`
- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`

#### Qué hace el pipeline

- checkout del repositorio
- `npm ci`
- instalación de navegadores Playwright
- ejecución de la suite elegida
- generación de reporte Allure
- archivado de `reports/` y `test-results/`

#### Suites disponibles en Jenkins

- `smoke`
- `api`
- `e2e`
- `regression`
- `all`

### Consideraciones de infraestructura

Los pipelines no levantan automáticamente `frontend` y `backend`. Actualmente asumen una de estas dos opciones:

- que ya existe un ambiente accesible por URL
- que vas a extender el pipeline para arrancar los servicios antes de correr las pruebas

Si luego quieres pipeline full local, el siguiente paso sería agregar stages para:

- levantar backend Laravel
- levantar frontend Angular
- esperar health checks
- correr Playwright contra esos servicios

## Allure

### 1. Instalar reporter y CLI

Instala el adaptador de Playwright y Allure CLI como dependencias de desarrollo:

```powershell
npm install -D allure-playwright allure-commandline
```

### 2. Configurar Playwright

Actualiza `playwright.config.ts` para agregar Allure al reporter:

```ts
reporter: [
  ['html'],
  ['allure-playwright'],
],
```

Si quieres definir la carpeta de resultados:

```powershell
$env:ALLURE_RESULTS_DIR="allure-results"
```

### 3. Ejecutar pruebas con Allure

Después de correr las pruebas, Playwright generará resultados en `allure-results/`.

Ejemplo:

```powershell
npx.cmd playwright test tests/smoke
```

### 4. Generar reporte Allure

Generar reporte estático:

```powershell
npx.cmd allure generate allure-results --clean -o allure-report
```

Abrir reporte generado:

```powershell
npx.cmd allure open allure-report
```

Generar y servir el reporte en un solo paso:

```powershell
npx.cmd allure serve allure-results
```

## Flujo recomendado

Desarrollo local:

```powershell
npm run test:smoke
```

Validación funcional:

```powershell
npm run test:e2e
```

Validación de API:

```powershell
npm run test:api
```

Validación completa antes de release:

```powershell
npm test
```

## Notas

- En PowerShell, usa `npx.cmd` en lugar de `npx` si la política de ejecución bloquea scripts `.ps1`.
- Las suites autenticadas usan el usuario demo configurado en `config/env.ts`.
- Los tests de UI dependen de que frontend y backend estén disponibles.
- Los tests API dependen de que el backend tenga datos demo y autenticación funcional.
