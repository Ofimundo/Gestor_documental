import { FileText, ImageIcon, FileSpreadsheet, File, type LucideIcon } from "lucide-react"
import type { DocumentType } from "@/lib/types"
import { cn } from "@/lib/utils"

const iconMap: Record<DocumentType, LucideIcon> = {
  pdf: FileText,
  image: ImageIcon,
  word: FileText,
  excel: FileSpreadsheet,
  other: File,
}

// Color de acento por tipo, usando tokens del tema.
const colorMap: Record<DocumentType, string> = {
  pdf: "text-destructive",
  image: "text-chart-2",
  word: "text-primary",
  excel: "text-chart-3",
  other: "text-muted-foreground",
}

export function DocumentTypeIcon({
  type,
  className,
}: {
  type: DocumentType
  className?: string
}) {
  const Icon = iconMap[type]
  return <Icon className={cn("size-5 shrink-0", colorMap[type], className)} aria-hidden="true" />
}
