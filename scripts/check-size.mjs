import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const extensions = new Set([".ts", ".tsx", ".js", ".mjs", ".rs", ".css"]);
const violations = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (["node_modules", "target", "gen", "dist", ".git"].includes(entry.name)) return [];
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(name) : extensions.has(path.extname(name)) ? [name] : [];
  });
}

function codeLines(source) {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.JSX, source);
  const sourceFile = ts.createSourceFile("count.tsx", source, ts.ScriptTarget.Latest);
  const lines = new Set();
  while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
    const first = sourceFile.getLineAndCharacterOfPosition(scanner.getTokenPos()).line;
    const last = sourceFile.getLineAndCharacterOfPosition(scanner.getTextPos() - 1).line;
    for (let line = first; line <= last; line++) lines.add(line);
  }
  return lines.size;
}

function checkFunctions(file, source) {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isFunctionLike(node) && node.body) {
      const count = codeLines(node.body.getText(tree));
      if (count > 74) violations.push(`${file}: function at line ${tree.getLineAndCharacterOfPosition(node.getStart()).line + 1} has ${count} code lines`);
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
}

const files = [...walk("src"), ...walk("src-tauri/src"), ...walk("scripts"), "vite.config.ts"];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const count = codeLines(source);
  if (count > 250) violations.push(`${file}: ${count} code lines`);
  if (/\.[cm]?[jt]sx?$/.test(file)) checkFunctions(file, source);
  if (file.endsWith(".rs") && count > 74) violations.push(`${file}: review Rust function sizes manually`);
}
if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log(`Size limits passed for ${files.length} authored source files.`);
