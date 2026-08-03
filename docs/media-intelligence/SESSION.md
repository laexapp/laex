# Sesión de Media Intelligence

## Implementación controlada

La sesión local sólo existe cuando `NODE_ENV` es `development`. `POST /api/media-intelligence/session` emite una cookie firmada, `HttpOnly`, `SameSite=Lax`, con ocho horas de vigencia. La API vuelve a verificar firma y expiración en servidor antes de leer cualquier dato.

La identidad de desarrollo es fija y no representa Firebase Auth ni una cuenta real. Las rutas localmente durables responden 404 fuera de desarrollo. Este comportamiento es deliberado: un build productivo puede mostrar la experiencia preparada, pero no activar la identidad ni persistencia de prueba.

## Flujo

```text
Navegador → cookie HttpOnly → verificación HMAC server-only
          → actor de dominio → membresía activa
          → capacidad efectiva → Workspace acotado
          → operación atómica → auditoría
```

Roles, capacidades, `userId` y membresías nunca se aceptan desde el navegador como fuente de autoridad. El `workspaceId` recibido se considera no confiable y se comprueba contra la membresía activa.

## Promoción futura

La sesión oficial deberá intercambiar un ID token válido de Firebase por una cookie de sesión verificada con Firebase Admin, con revocación y rotación. Esa integración permanece prohibida en MISSION X-04 hasta revisión de Auth oficial.

