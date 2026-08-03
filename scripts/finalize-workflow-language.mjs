import { readFile, writeFile } from "node:fs/promises";

const file = "modules/media-intelligence/components/WorkflowApp.tsx";
let content = await readFile(file, "utf8");
content = content.replace(
  'const calendarBase = new Date("2026-08-02T12:00:00.000Z").getTime();',
  'const calendarBase = new Date("2026-08-02T12:00:00.000Z").getTime();\nconst statusLabels: Record<string,string> = { draft:"Borrador", in_review:"En revisión", approved:"Aprobado", rejected:"Rechazado", scheduled:"Programado", archived:"Archivado", generated:"Generado", analyzed:"Analizado", generation_error:"Error de generación", active:"Activo", suspended:"Suspendido", pending:"Pendiente", accepted:"Aceptada", revoked:"Revocada", idle:"Sin iniciar", success:"Completada", partial:"Resultado parcial", failed:"Con error" };\nconst statusLabel = (value:string) => statusLabels[value] ?? value.replaceAll("_"," ");'
);
content = content.replaceAll("{c.status}</small>", "{statusLabel(c.status)}</small>");
content = content.replaceAll("{m.role} · {m.status}", "{statusLabel(m.role)} · {statusLabel(m.status)}");
content = content.replaceAll("{i.status}</small>", "{statusLabel(i.status)}</small>");
content = content.replaceAll("{c.status} · publicación {c.publicationStatus}", "{statusLabel(c.status)} · {statusLabel(c.publicationStatus)}");
content = content.replace('["success","partial","low","error","timeout"].map(s=>', '[["success","Resultado completo"],["partial","Resultado parcial"],["low","Confianza baja"],["error","Simular error"],["timeout","Tiempo agotado"]].map(([s,label])=>');
content = content.replace('>IA {s}</button>', '>{label}</button>');
content = content.replace('["approve","reject","duplicate","archive","recover"].map(op=>', '[["approve","Aprobar"],["reject","Rechazar"],["duplicate","Duplicar"],["archive","Archivar"],["recover","Recuperar"]].map(([op,label])=>');
content = content.replace('>{op}</button>', '>{label}</button>');
content = content.replace('["success","partial","failed"].map(s=>', '[["success","Éxito"],["partial","Resultado parcial"],["failed","Simular error"]].map(([s,label])=>');
content = content.replace('>Simular {s}</button>', '>{label}</button>');
await writeFile(file, content, "utf8");
