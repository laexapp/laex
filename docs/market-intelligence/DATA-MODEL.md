# Modelo de datos

Modelos independientes: `ListingApplication`, `VerificationCase`, `AnalysisReport`, `PromotionPackage`, `CommercialOrder`, `SponsorshipDisclosure`, `EditorialDecision`, `Appeal` y `ConflictDisclosure`.

La identidad de activo combina `assetId`, blockchain, contrato y proveedor. El símbolo es informativo y nunca clave primaria. La evidencia conserva fuente, tiempo, confianza y versión. `AnalysisReport` prohíbe referencia comercial; `CommercialOrder` prohíbe referencia a reportes.

Los datos públicos se proyectan desde información aprobada. Documentos, facturas, sesiones, membresías y órdenes no se incluyen en esa proyección.
