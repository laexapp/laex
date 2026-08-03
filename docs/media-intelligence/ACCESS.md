# Acceso a LAEX Media Intelligence

## Rutas

- `/media-intelligence`: experiencia visual; funciona en build productivo y no exige sesión de Media Intelligence.
- `/media-intelligence/operations`: consola funcional; sus páginas cargan en producción, pero sus datos operativos sólo funcionan en desarrollo local.
- `/media-intelligence/operations/flow`: recorrido completo del hito 75 %; disponible desde la navegación interna de Operaciones y funcional exclusivamente en desarrollo local.

## Inicio local

```powershell
npm install
npm run dev
```

Abrir `http://localhost:3000/media-intelligence/operations/flow`.

No es necesario introducir credenciales. En desarrollo, el cliente solicita una sesión controlada y el servidor emite una cookie firmada `HttpOnly`. No utiliza Firebase Auth oficial ni identidades reales.

## Producción

Las tres páginas responden HTTP 200 en el build productivo. Las APIs `/api/media-intelligence` y `/api/media-intelligence/workflow` están cerradas fuera de `development`, por lo que las consolas funcionales muestran `not_available` en producción. Esta restricción evita convertir la identidad fija y el archivo JSON local en un bypass productivo.

La experiencia visual `/media-intelligence` sí puede revisarse en un despliegue. Habilitar operaciones en un enlace temporal requiere un entorno efímero protegido con una estrategia de sesión apropiada; no debe eliminarse la validación de entorno para lograrlo.

## Navegación

La navegación global de LAEX enlaza a `/media-intelligence`. El layout del módulo enlaza a Operaciones y el layout de Operaciones enlaza explícitamente a `Recorrido completo`.

## Verificación

Con `next start`, las tres rutas de página responden 200 sin redirección. La API de datos responde 404 en producción por diseño. En desarrollo, el acceso operativo depende de la cookie local emitida por `POST /api/media-intelligence/session`.
