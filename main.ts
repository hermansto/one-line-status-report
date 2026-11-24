import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The one line this entry submits: a weekly status report that is
// cheerfully confident about work it cannot actually account for.
const line =
  "Status: green. 47 tasks done, one file renamed, and zero idea what the other 46 were. Confidence: high. Accuracy: pending.";

// The harness gives us the output folder; fall back to /output so the
// program still has somewhere sensible to write when run on its own.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.txt");
writeFileSync(target, line, "utf8");

// Read it straight back and refuse to finish quietly if even one byte
// drifted, so a bad write can never pass as a good entry. The line is
// capped at 200 characters by the competition, and the file must hold
// exactly the line — no trailing newline, no extra whitespace.
if (line.length > 200) {
  throw new Error(`entry line is ${line.length} characters, over the 200 limit`);
}
const written = readFileSync(target, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not match the submitted line exactly");
}
if (written.endsWith("\n")) {
  throw new Error("entry.txt must not end with a trailing newline");
}
console.log(`Wrote ${written.length} characters to ${target}`);
