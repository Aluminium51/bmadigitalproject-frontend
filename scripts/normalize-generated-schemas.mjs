import { readFile, writeFile } from "node:fs/promises";

const outputPath = new URL("../src/types/api-schemas.ts", import.meta.url);
const source = await readFile(outputPath, "utf8");

// openapi-zod-client currently emits the Zod 3 one-argument form for this
// record. Zod 4 requires an explicit key schema.
const legacyRecord = "z.record(z.unknown().nullable())";
const zod4Record = "z.record(z.string(), z.unknown().nullable())";

if (source.includes(legacyRecord)) {
  await writeFile(outputPath, source.replaceAll(legacyRecord, zod4Record), "utf8");
}
