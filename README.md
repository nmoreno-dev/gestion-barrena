# Facturillo Frontend

SaaS para gestionar clientes, proveedores, facturas y pagos.

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Instalación y arranque local](#instalación-y-arranque-local)
- [Stack y principales dependencias](#stack-y-principales-dependencias)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Variables de entorno](#variables-de-entorno)
- [Uso de scripts NPM](#uso-de-scripts-npm)
- [Guía de contribución](#guía-de-contribución)
- [Enlaces y referencias](#enlaces-y-referencias)
- [Licencia y autores](#licencia-y-autores)

## Requisitos previos

- Node.js >=22
- npm >=10
- Opcional: pnpm o Docker para entornos de desarrollo

## Instalación y arranque local

```bash
# Clonar el repositorio
git clone git@github.com:Los-Galeses/Facturillo-app.git
cd Facturillo-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
# Compilar para producción
npm run build
```

La aplicación se sirve por defecto en `http://localhost:3000`.

## Stack y principales dependencias

- **React + Vite + TypeScript** para el front.
- **Tailwind** y **DaisyUI** para ui y estilos.
- **Zustand** para manejo de estado global.
- **React Query** para fetching y caché de datos.
- **React Router** (enrutado basado en archivos).
- **ESLint** y **Prettier** para lint y formateo.
- **Husky** y **lint-staged** para ganchos de commit.

## Estructura de carpetas

```text
src/
├── app/          # configuración global (constantes, http client, estilos)
├── common/       # componentes y hooks reutilizables
├── features/     # módulos de dominio (ej. customers)
├── routes/       # rutas file-based de React Router
├── router.tsx    # instancia del router
└── utils/        # utilidades varias
```

## Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes claves:

```
VITE_API_BASE_URL=""
```

- **VITE_API_BASE_URL**: URL base de la API.

## Uso de scripts NPM

- `npm run prepare` - Ejecuta Huky
- `npm run dev` - Arranca en modo desarrollo.
- `npm run build` - Genera la versión compilada.
- `npm run start` - bla
- `npm run lint` - bla
- `npm run format:check` - Chequea el estilo de código
- `npm run format:write` - Corrige el estilo de código
- `npm run test` - Corre la suite de tests.

## Guía de contribución

1. Clona el repositorio.
2. Crea tu rama desde el ticket en Jira para que se cree con una nomenclatura adecuada.
3. Abre un PR hacia `develop`.
4. Asegúrate de que las pruebas y el lint pasan, y que se genera un preview de despliegue.
5. Para reportar bugs o proponer mejoras, abre un issue en GitHub.

## Enlaces y referencias

- Documentación interna en Confluence: [click aqui](https://nahuelmorenodev.atlassian.net/wiki/spaces/FA/overview).
- Pipeline CI/CD disponible en [GitHub Actions](https://github.com/Los-Galeses/Facturillo-app/actions).
- [Tablero de Jira](https://nahuelmorenodev.atlassian.net/jira/software/projects/FAC/boards/2) con backlog y epics relevantes.
- Contrato de la API: [Swagger](https://facturillo-api-develop.up.railway.app/api).

## Licencia y autores

Proyecto publicado bajo licencia MIT.
Mantenido por el equipo interno de Facturillo.
