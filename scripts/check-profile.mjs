import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const readmePath = resolve(process.argv[2] || "README.md");
const repositoryRoot = dirname(readmePath);
const markdown = await readFile(readmePath, "utf8");
const errors = [];
const targets = [];

for (const match of markdown.matchAll(/<img\b([^>]*)>/gi)) {
  const attributes = match[1];
  const alt = attributes.match(/\balt\s*=\s*(["'])(.*?)\1/i);
  const src = attributes.match(/\bsrc\s*=\s*(["'])(.*?)\1/i);
  if (!alt || !alt[2].trim()) errors.push("HTML image is missing meaningful alt text");
  if (!src || !src[2].trim()) errors.push("HTML image is missing a source");
  else targets.push(src[2].trim());
}

for (const match of markdown.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
  if (!match[1].trim()) errors.push(`Markdown image ${match[2]} is missing meaningful alt text`);
  targets.push(match[2]);
}

for (const match of markdown.matchAll(/(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
  targets.push(match[1]);
}

for (const target of targets) {
  if (/^http:\/\//i.test(target)) {
    errors.push(`Insecure remote URL: ${target}`);
    continue;
  }
  if (/^(?:https:|mailto:|#)/i.test(target)) continue;

  const localTarget = decodeURIComponent(target.split(/[?#]/, 1)[0]);
  const absoluteTarget = resolve(repositoryRoot, localTarget);
  if (absoluteTarget !== repositoryRoot && !absoluteTarget.startsWith(`${repositoryRoot}\\`) && !absoluteTarget.startsWith(`${repositoryRoot}/`)) {
    errors.push(`Local link escapes the repository: ${target}`);
    continue;
  }
  try {
    await access(absoluteTarget);
  } catch {
    errors.push(`Missing local target: ${target}`);
  }
}

if (errors.length) {
  console.error(`Profile integrity check failed with ${errors.length} issue(s):`);
  for (const error of [...new Set(errors)].sort()) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Profile integrity check passed (${targets.length} links and images inspected).`);
}
