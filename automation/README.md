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
