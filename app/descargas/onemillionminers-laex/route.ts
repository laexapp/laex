import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const imagePath = path.join(
    process.cwd(),
    "public",
    "projects",
    "onemillionminers",
    "laex-activation-campaign-2026.png",
  );
  const image = await readFile(imagePath);

  return new Response(image, {
    headers: {
      "content-type": "image/png",
      "content-disposition": "attachment; filename=onemillionminers-laex-lfprinter.png",
      "cache-control": "public, max-age=3600",
    },
  });
}
