import type { DocumentType } from "./types"

// Formatea bytes a una cadena legible (KB, MB...).
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

// Formatea una fecha ISO a formato local en español.
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// Etiqueta legible para cada tipo de documento.
export function documentTypeLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    pdf: "PDF",
    image: "Imagen",
    word: "Word",
    excel: "Excel",
    other: "Archivo",
  }
  return labels[type]
}

// Infiere el tipo de documento a partir del nombre del archivo.
export function inferDocumentType(fileName: string): DocumentType {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? ""
  if (ext === "pdf") return "pdf"
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image"
  if (["doc", "docx"].includes(ext)) return "word"
  if (["xls", "xlsx", "csv"].includes(ext)) return "excel"
  return "other"
}
