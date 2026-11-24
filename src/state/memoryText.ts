export function comparableMemoryText(text: string) {
  return text.normalize("NFC").toLocaleLowerCase().replace(/[’]/g, "'")
    .trim().replace(/\s+/g, " ").replace(/[.!]+$/, "").trim();
}
