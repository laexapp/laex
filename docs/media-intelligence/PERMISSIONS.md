# Capacidades y roles

Roles iniciales: propietario, administrador, editor, analista, revisor, miembro y solo lectura.

Capacidades v1:

- `workspace.read`, `workspace.manage`
- `members.invite`, `members.manage`
- `content.read`, `content.create`, `content.edit`, `content.review`, `content.approve`, `content.reject`
- `campaign.read`, `campaign.create`, `campaign.manage`, `campaign.schedule`
- `channel.read`, `channel.connect`, `channel.disconnect`
- `analytics.read`, `settings.manage`, `audit.read`

Los roles son paquetes de capacidades, no la autoridad final. La evaluación combina rol y override explícito de membresía. El propietario recibe todas; administrador no puede administrar el ciclo de vida del workspace; editor no aprueba ni administra miembros; analista solo lee; revisor decide contenido; miembro crea contenido sin administrar campañas; solo lectura no muta.

