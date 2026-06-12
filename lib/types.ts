// Tipos del gestor documental.
// Estos tipos reflejan la estructura que tendrán las tablas en SQL Server
// cuando se conecte la base de datos.

export type DocumentType = "pdf" | "image" | "word" | "excel" | "other"

export interface Folder {
  id: string
  name: string
}

export interface DocumentItem {
  id: string
  name: string
  type: DocumentType
  folderId: string
  tags: string[]
  // Tamaño en bytes
  size: number
  // Fecha ISO (createdAt)
  createdAt: string
  // URL para previsualizar/descargar. Con SQL Server, este contenido se
  // servirá desde un endpoint que lea la columna VARBINARY(MAX).
  url?: string
  // Campos agregados para enriquecer la experiencia simulada
  description?: string
  favorite?: boolean
  mockContent?: any
}
