import { readFile, writeFile } from "node:fs/promises";

const edits = {
  "modules/media-intelligence/components/OperationsApp.tsx": [
    ["Centro funcional", "Centro de operaciones"],
    ["Persistencia local at\u00f3mica y autorizaci\u00f3n de servidor. Toda inteligencia y distribuci\u00f3n permanece simulada.", "Tu trabajo permanece protegido dentro de cada Workspace. La inteligencia asiste el proceso y cada decisi\u00f3n editorial sigue bajo control humano."],
    ["SESI\u00d3N SERVER-SIDE", "IDENTIDAD PROTEGIDA"],
    ["{state.persistence}", "ENTORNO DE DEMOSTRACI\u00d3N"],
    ["Impacto simulado", "Impacto proyectado"],
  ],
  "modules/media-intelligence/components/MediaIntelligenceApp.tsx": [
    ["Contenido demostrativo preparado para revisi\u00f3n, versi\u00f3n y aprobaci\u00f3n humana.", "Organiza cada idea, conserva su historia y decide con claridad qu\u00e9 versi\u00f3n est\u00e1 lista para avanzar."],
    ["Arquitectura de plugins", "Ecosistema de canales"],
    ["Canales desacoplados del n\u00facleo.", "Cada canal listo para crecer contigo."],
    ["Las conexiones mostradas son representaciones de arquitectura; ninguna API ni credencial est\u00e1 activa.", "Explora c\u00f3mo se distribuir\u00e1 tu contenido. Todas las conexiones permanecen seguras y simuladas durante esta etapa."],
    ["Plugin planificado", "Disponible pr\u00f3ximamente"],
    ["tokens: ninguno", "sin credenciales activas"],
    ["Valores demostrativos normalizados para ofrecer una lectura ejecutiva multicanal.", "Comprende el rendimiento proyectado de cada decisi\u00f3n editorial en una sola vista."],
  ],
};

for (const [file, replacements] of Object.entries(edits)) {
  let content = await readFile(file, "utf8");
  for (const [before, after] of replacements) content = content.replaceAll(before, after);
  await writeFile(file, content, "utf8");
}
