/**
 * 从 CHANGELOG.md 抽取「单个版本」的更新说明，供 GitHub Release 使用。
 *
 * 背景：直接 `gh release create --notes-file CHANGELOG.md` 会把整份更新日志
 * （含全部历史版本）写进该次 Release，导致说明冗长且历史版本被重复展示。
 * 本脚本只取目标版本那一节，标题保留为 `## vX.Y.Z (日期)`。
 *
 * 用法：
 *   node scripts/get-release-notes.mjs v0.0.46              # 打印到 stdout
 *   node scripts/get-release-notes.mjs v0.0.46 -o notes.md  # 写入文件
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHANGELOG = resolve(ROOT, "CHANGELOG.md");

const [version, ...rest] = process.argv.slice(2);
if (!version || !/^v?\d+\.\d+\.\d+$/.test(version)) {
  console.error("用法: node scripts/get-release-notes.mjs <vX.Y.Z> [-o 输出文件]");
  process.exit(1);
}
const tag = version.startsWith("v") ? version : `v${version}`;

const outIdx = rest.findIndex((a) => a === "-o" || a === "--out");
const outFile = outIdx >= 0 ? rest[outIdx + 1] : null;

const source = readFileSync(CHANGELOG, "utf8");
const sections = source.split(/\n(?=##\s*v\d)/);
const section = sections.find((s) => s.startsWith(`## ${tag} `));

if (!section) {
  console.error(`CHANGELOG.md 中找不到 ${tag} 的条目`);
  console.error(`可用版本: ${sections
    .map((s) => s.match(/^##\s*(v\d[\d.]*)/)?.[1])
    .filter(Boolean)
    .join(", ")}`);
  process.exit(1);
}

// 取到下一个版本标题为止；标题保持 ##，与历史 Release 的写法一致
const notes = section.trim() + "\n";

if (outFile) {
  writeFileSync(resolve(process.cwd(), outFile), notes, "utf8");
  console.error(`已写入 ${outFile}（${Buffer.byteLength(notes, "utf8")} 字节）`);
} else {
  process.stdout.write(notes);
}
