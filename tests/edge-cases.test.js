import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { mock } from "node:test";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { DateTime } from "../index.js";

suite("DateTime edge cases", () => {
  test("global import installs the constructor in main and worker contexts", () => {
    const moduleURL = pathToFileURL(resolve(import.meta.dirname, "..", "global.js")).href;
    const workerSource = `import { parentPort } from "node:worker_threads";
import ${JSON.stringify(moduleURL)};
parentPort.postMessage(new globalThis.DateTime(0).time);`;
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import assert from "node:assert/strict";
import { Worker } from "node:worker_threads";
import ${JSON.stringify(moduleURL)};
assert.equal(new globalThis.DateTime(0).time, 0);
await new Promise((resolve, reject) => {
  let received = false;
  const worker = new Worker(new URL("data:text/javascript," + encodeURIComponent(${JSON.stringify(workerSource)})));
  worker.once("message", value => {
    try { assert.equal(value, 0); received = true; } catch (error) { reject(error); }
  });
  worker.once("error", reject);
  worker.once("exit", code => code === 0 && received ? resolve() : reject(new Error("Worker failed with code " + code)));
});`,
      ],
      { stdio: "pipe" },
    );
  });

  test("isNow() compares precision against a fixed clock", () => {
    mock.timers.enable({ apis: ["Date"], now: Date.UTC(2024, 4, 17, 12, 34, 56, 789) });
    try {
      const now = new DateTime();
      assert.equal(now.isNow(), true);
      mock.timers.tick(1);
      assert.equal(now.isNow(), false);
      assert.equal(now.isNow("millisecond"), false);
      assert.equal(now.isNow("second"), true);
      const sameMinute = new DateTime();
      sameMinute.seconds = 30;
      assert.equal(sameMinute.isNow("minute"), true);
      assert.equal(sameMinute.isNow("second"), false);
      const sameDay = new DateTime();
      sameDay.hours = sameDay.hours === 10 ? 11 : 10;
      assert.equal(sameDay.isNow("day"), true);
      assert.equal(sameDay.isNow("hour"), false);
    } finally {
      mock.timers.reset();
    }
  });

  test("calendar days and relative durations differ correctly across DST", () => {
    const moduleURL = pathToFileURL(resolve(import.meta.dirname, "..", "index.js")).href;
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import assert from "node:assert/strict";
import { DateTime } from ${JSON.stringify(moduleURL)};
for (const [month, day, hours] of [[2, 30, 23], [9, 26, 25]]) {
  const before = new DateTime([2024, month, day, 12]);
  const after = before.clone().add("day");
  assert.equal(after.hours, 12);
  assert.equal(after.diff(before, "hours", true), hours);
  assert.equal(after.diff(before, "days", true), hours / 24);
  assert.equal(after.relative({ from: before.date, locales: "en" }),
    new Intl.RelativeTimeFormat("en").format(hours < 24 ? 23 : 1, hours < 24 ? "hour" : "day"));
  assert.equal(before.clone().add("week").hours, 12);
  const start = after.clone().startOf("day");
  const end = after.clone().endOf("day");
  assert.equal(end.time - start.time + 1, hours * 3600000);
}`,
      ],
      { env: { ...process.env, TZ: "Europe/Lisbon" }, stdio: "pipe" },
    );
  });

  test("published imports and globals work in a strict TypeScript consumer", () => {
    const directory = mkdtempSync(join(tmpdir(), "vistta-datetime-types-"));
    try {
      const scope = join(directory, "node_modules", "@vistta");
      mkdirSync(scope, { recursive: true });
      symlinkSync(resolve(import.meta.dirname, ".."), join(scope, "datetime"), "junction");
      const source = join(directory, "consumer.mts");
      writeFileSync(
        source,
        `import DefaultDateTime, { DateTime as ImportedDateTime, date, time, formatDate, formatTime, formatDateTime,
  type DateTimeComparisonOptions, type DateTimeFormatOptions, type RelativeOptions } from "@vistta/datetime";
import "@vistta/datetime/global";
const options: DateTimeFormatOptions = { locales: "pt", firstDayOfWeek: "wed", dateStyle: "full" };
const dt = new DefaultDateTime(null, options);
const globalDate: DateTime = new DateTime();
const windowDate: ImportedDateTime = new window.DateTime();
const workerDate: ImportedDateTime = new globalThis.DateTime();
const relative: RelativeOptions = { from: new Date(), numeric: "auto", style: "short" };
const comparison: DateTimeComparisonOptions = { precision: "millisecond", exclude: ["second"] };
const formatted: string = dt.format(options);
const valid: boolean = dt.isValid();
dt.equals(globalDate, comparison);
dt.equals(windowDate, { precision: "week" });
dt.isNow("millisecond");
dt.diff(workerDate, "months", true);
dt.add("month").subtract("year").next("day").previous("week").startOf("day").endOf("second");
dt.relative(relative);
dt.toString(["en", "pt"]);
date([2024, 0, 31], options);
time(dt.date, options);
formatDate(dt, options);
formatTime(dt, options);
formatDateTime(dt, options);
// @ts-expect-error A week is not an individual comparison field.
dt.equals(dt, { exclude: ["week"] });
// @ts-expect-error Week precision cannot exclude calendar fields.
dt.equals(dt, { precision: "week", exclude: ["day"] });
// @ts-expect-error Unknown units are rejected.
dt.add("fortnight");
// @ts-expect-error Relative options are not date formatting options.
dt.relative({ dateStyle: "full" });
void formatted;
void valid;
`,
      );
      const program = ts.createProgram([source], {
        noEmit: true,
        strict: true,
        types: [],
        module: ts.ModuleKind.NodeNext,
        target: ts.ScriptTarget.ES2022,
      });
      const diagnostics = ts.getPreEmitDiagnostics(program);
      assert.equal(
        diagnostics.length,
        0,
        ts.formatDiagnostics(diagnostics, {
          getCurrentDirectory: () => directory,
          getCanonicalFileName: (name) => name,
          getNewLine: () => "\n",
        }),
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
