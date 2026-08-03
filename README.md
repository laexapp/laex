# laex
LAEX Official Ecosystem

## Flujo diario de desarrollo

Desde PowerShell o CMD, en la raíz del proyecto:

```powershell
.\laex-start.cmd
```

Este es el único comando que debe usar el CEO para preparar y abrir LAEX. Localiza y detiene servidores Next.js de este repositorio, comprueba los puertos 3000 y 3100, verifica dependencias, ejecuta TypeScript, pruebas, lint, build y controles de Git, e inicia `npm run dev` sólo cuando todo está aprobado.

Mantén la terminal abierta mientras uses LAEX. `Ctrl+C` detiene el servidor. El script no finaliza procesos ajenos: si otro programa ocupa un puerto, informa el PID y se detiene de forma segura.

Rutas principales:

- `http://localhost:3000/`
- `http://localhost:3000/media-intelligence`
- `http://localhost:3000/media-intelligence/operations`
- `http://localhost:3000/media-intelligence/operations/flow`

## Validación antes de GitHub

Antes de un commit importante o cualquier push, ejecuta:

```powershell
.\laex-check.cmd
```

Este comando no inicia el servidor. Verifica dependencias, TypeScript, pruebas de Media Intelligence, lint del alcance, `npm run build`, integridad del diff y estado del repositorio. Se detiene en el primer error y devuelve un código distinto de cero.

No subas cambios si el resultado no termina con `PREFLIGHT LAEX APROBADO — listo para commit o push.`
