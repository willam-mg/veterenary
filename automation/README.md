# Automation

Framework de automatizacion UI y API para `VetClinic Demo` usando Playwright.

## Alcance

Este proyecto cubre:

- pruebas `smoke`
- pruebas `api`
- pruebas `e2e`
- pruebas `regression`
- Page Object Model para los modulos principales del sistema

## Estructura

```text
automation/
|-- config/
|-- data/
|-- fixtures/
|-- pages/
|-- tests/
|   |-- api/
|   |-- smoke/
|   |-- e2e/
|   `-- regression/
|-- utils/
|-- package.json
`-- playwright.config.ts
```

## Requisitos

- Node.js 20 o superior
- npm
- Frontend levantado en `http://localhost:4200`
- Backend levantado en `http://localhost:8000`

## Instalacion

Desde la raiz del repo:

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

Este proyecto soporta estos ambientes:

- `qa`
- `staging`
- `production`

Resolucion base:

- `qa`
  - `WEB_BASE_URL=http://localhost:4200`
  - `API_BASE_URL=http://localhost:8000/api/v1`
- `staging`
  - `STAGING_WEB_BASE_URL=https://veterenary-production.up.railway.app`
  - `STAGING_API_BASE_URL=https://veterenary-production.up.railway.app/api/v1`
- `production`
  - `PRODUCTION_WEB_BASE_URL`
  - `PRODUCTION_API_BASE_URL`

Ademas:

- `TEST_ENV=qa|staging|production`
- `DEMO_USER_EMAIL=admin@vetdemo.test`
- `DEMO_USER_PASSWORD=password`

Puedes sobreescribirlos antes de ejecutar pruebas locales:

```powershell
$env:TEST_ENV="qa"
$env:WEB_BASE_URL="http://localhost:4200"
$env:API_BASE_URL="http://localhost:8000/api/v1"
$env:DEMO_USER_EMAIL="admin@vetdemo.test"
$env:DEMO_USER_PASSWORD="password"
```

## Ejecucion

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

Ejecutar una carpeta especifica:

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

Este proyecto ya incluye integracion para GitHub Actions y Jenkins.

### GitHub Actions

Los workflows de GitHub Actions viven en la raiz del repositorio:

- `.github/workflows/automation-ci.yml`
- `.github/workflows/automation-full.yml`
- `.github/workflows/static.yml`

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
- usar `staging` por defecto en GitHub Actions

Este workflow usa `working-directory: automation`.

#### `automation-full.yml`

Se ejecuta en:

- `schedule`
- `workflow_dispatch`

Objetivo:

- correr `e2e`
- correr `regression`
- permitir ejecucion manual de `e2e`, `regression` o `all`
- permitir seleccion manual de `staging`, `production` o `qa`
- generar `allure-report`
- subir el artifact `static-allure-report`

#### `static.yml`

Es el workflow dedicado a GitHub Pages.

Objetivo:

- descargar el artifact `static-allure-report` generado por `automation-full.yml`
- publicar el contenido estatico en GitHub Pages

#### Variables recomendadas en GitHub

Configura estas variables y secretos en el repositorio:

Variables:

- `STAGING_WEB_BASE_URL`
- `STAGING_API_BASE_URL`
- `PRODUCTION_WEB_BASE_URL`
- `PRODUCTION_API_BASE_URL`

Secrets:

- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`

Si no se configuran, los workflows usan estos defaults:

- staging web: `https://veterenary-production.up.railway.app`
- staging api: `https://veterenary-production.up.railway.app/api/v1`
- `admin@vetdemo.test`
- `password`

GitHub Actions queda orientado a `staging` por defecto. `qa` es el ambiente local por defecto para ejecucion manual o Jenkins. `production` debe configurarse con variables del repositorio antes de usarlo.

### Jenkins

Se agrego un pipeline declarativo en:

- `automation/Jenkinsfile`

Para usarlo en Jenkins:

1. Crea un Pipeline job.
2. Configura `Pipeline script from SCM`.
3. En `Script Path` usa:

```text
automation/Jenkinsfile
```

#### Parametros del pipeline

- `SUITE`
- `TARGET_ENVIRONMENT`
- `WEB_BASE_URL`
- `API_BASE_URL`
- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`

#### Que hace el pipeline

- checkout del repositorio
- `npm ci`
- instalacion de navegadores Playwright
- seleccion de ambiente `qa`, `staging` o `production`
- ejecucion de la suite elegida
- generacion de reporte Allure
- archivado de `reports/` y `test-results/`

#### Suites disponibles en Jenkins

- `smoke`
- `api`
- `e2e`
- `regression`
- `all`

### Consideraciones de infraestructura

Los pipelines no levantan automaticamente `frontend` y `backend`. Actualmente asumen una de estas dos opciones:

- que ya existe un ambiente accesible por URL
- que vas a extender el pipeline para arrancar los servicios antes de correr las pruebas

Si luego quieres pipeline full local, el siguiente paso seria agregar stages para:

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

El proyecto ya esta configurado para generar:

- reporte HTML de Playwright
- resultados de Allure
- reporte JUnit para Jenkins

Los outputs principales son:

- `reports/html-report`
- `reports/allure-results`
- `reports/allure-report`
- `test-results/results.xml`

### 3. Ejecutar pruebas con Allure

Despues de correr las pruebas, Playwright genera resultados en `reports/allure-results`.

Ejemplo:

```powershell
npx.cmd playwright test tests/smoke
```

### 4. Generar reporte Allure

Generar reporte estatico:

```powershell
npx.cmd allure generate reports/allure-results --clean -o reports/allure-report
```

Abrir reporte generado:

```powershell
npx.cmd allure open reports/allure-report
```

Generar y servir el reporte en un solo paso:

```powershell
npx.cmd allure serve reports/allure-results
```

## Publicacion de Allure en GitHub Pages

La carpeta publicada sigue siendo:

```text
automation/reports/allure-report
```

Pero la publicacion automatica no depende de commitear esa carpeta.

### Flujo correcto

1. `Automation Full Regression` ejecuta tests en GitHub Actions.
2. Ese workflow genera `automation/reports/allure-report`.
3. Ese workflow sube el artifact `static-allure-report`.
4. `static.yml` descarga ese artifact generado en GitHub.
5. GitHub Pages publica ese contenido estatico.

Con este modelo:

- `allure-report` puede seguir en `.gitignore`
- no necesitas commitear archivos generados
- GitHub Pages publica el reporte generado por CI

### Configuracion requerida en GitHub

1. Ve a `Settings` del repositorio.
2. Abre `Pages`.
3. En `Build and deployment`, selecciona:

```text
Source: GitHub Actions
```

### Como ejecutarlo

Automatica:

- ejecuta `Automation Full Regression`
- al completarse con exito, `static.yml` descarga el artifact `static-allure-report`
- luego publica ese artifact en GitHub Pages

Manual:

1. Entra a la pestana `Actions` del repositorio.
2. Abre `Publish Static Allure Report`.
3. Pulsa `Run workflow`.
4. Este modo manual usa la carpeta local del checkout, por lo que requiere que `automation/reports/allure-report/index.html` exista en la rama publicada.

### Donde ver el reporte

Una vez finalice el deploy, GitHub Pages publicara el reporte en una URL como:

```text
https://<owner>.github.io/<repo>/
```

Ademas, el job expone la URL publicada en el environment `github-pages`.

### Consideraciones

- La publicacion automatica ya no depende de archivos versionados en git.
- `static.yml` publica el artifact generado por `Automation Full Regression`.
- Si ejecutas `static.yml` manualmente, si depende de que exista `automation/reports/allure-report/index.html` en el checkout.
- GitHub Pages publica el contenido estatico del reporte Allure, no el historial completo de Allure TestOps.
- `static.yml` es el workflow dedicado a publicacion; los workflows de `automation` se encargan del CI.

## Flujo recomendado

Desarrollo local:

```powershell
npm run test:smoke
```

Validacion funcional:

```powershell
npm run test:e2e
```

Validacion de API:

```powershell
npm run test:api
```

Validacion completa antes de release:

```powershell
npm test
```

## Notas

- En PowerShell, usa `npx.cmd` en lugar de `npx` si la politica de ejecucion bloquea scripts `.ps1`.
- Las suites autenticadas usan el usuario demo configurado en `config/env.ts`.
- Los tests de UI dependen de que frontend y backend esten disponibles.
- Los tests API dependen de que el backend tenga datos demo y autenticacion funcional.


## install MCP playwrigth

1. Necesitas:
- Node.js
- Codex CLI
- Playwright MCP

2. Instalar todo execute this command

```
npm install @playwright/mcp@latest
```

3. Registrar Playwright como MCP en Codex

```
codex mcp add playwright -- npx @playwright/mcp@latest
```



