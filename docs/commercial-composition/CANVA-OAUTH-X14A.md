# X-14A — Autenticación Canva Connect

## Variables server-side

Agregar a `.env.local` sin prefijo `NEXT_PUBLIC_`:

```dotenv
CANVA_CLIENT_ID=
CANVA_CLIENT_SECRET=
CANVA_REDIRECT_URI=http://127.0.0.1:3000/api/integrations/canva/callback
CANVA_TOKEN_ENCRYPTION_KEY=
CANVA_OAUTH_COOKIE_SECRET=
CANVA_SCOPES="asset:read asset:write design:content:read design:content:write design:meta:read brandtemplate:meta:read brandtemplate:content:read"
```

`CANVA_TOKEN_ENCRYPTION_KEY` y `CANVA_OAUTH_COOKIE_SECRET` son secretos internos
de LAEX, no datos de Canva. Cada uno debe ser un valor Base64URL independiente
de 32 bytes generado criptográficamente. No deben enviarse por chat.

## Developer Portal

Registrar exactamente este redirect para desarrollo:

`http://127.0.0.1:3000/api/integrations/canva/callback`

En producción se registra la misma ruta sobre el dominio HTTPS oficial. Canva
permite hasta diez redirects. Eliminar el redirect local antes de someter una
integración pública a revisión.

## Endpoints LAEX

- `GET /api/integrations/canva/authorize`: inicia OAuth y PKCE.
- `GET /api/integrations/canva/callback`: valida cookie cifrada, expiración,
  `state` y código; intercambia el código exclusivamente en servidor.
- `GET /api/integrations/canva/status`: devuelve solo estado, scopes y expiración,
  nunca tokens.

Los tokens se cifran con AES-256-GCM en
`.data/integrations/canva.tokens.enc`. El archivo no es frontend ni se versiona.
El refresh se ejecuta cinco minutos antes de expirar y persiste el nuevo access
token y el nuevo refresh token rotado. La revocación elimina también el archivo.

## Límites de X-14A

Esta fase no carga activos, consulta plantillas, genera diseños ni exporta
archivos. `CanvaCompositionAdapter` implementa únicamente conexión, renovación
y desconexión bajo el puerto `CommercialCompositionProvider`.
