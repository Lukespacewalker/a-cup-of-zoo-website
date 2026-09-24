export function renderMarkdown(source: string) {
  const escaped = source.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return escaped.split(/\n{2,}/).map((block) => {
    if (block.startsWith("## ")) return `<h2>${inline(block.slice(3))}</h2>`;
    if (block.startsWith("# ")) return `<h2>${inline(block.slice(2))}</h2>`;
    const lines = block.split("\n");
    if (lines.every((line) => line.startsWith("- "))) return `<ul>${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join("")}</ul>`;
    return `<p>${inline(block).replaceAll("\n", "<br>")}</p>`;
  }).join("");
}

function inline(value: string) {
  return value.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
