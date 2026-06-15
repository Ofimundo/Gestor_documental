"use client"

import { Download, Eye, MoreVertical, Trash2, Star, Edit3 } from "lucide-react"
import type { DocumentItem } from "@/lib/types"
import { formatDate, formatFileSize } from "@/lib/format"
import { DocumentTypeIcon } from "@/components/document-type-icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DocumentRowProps {
  document: DocumentItem
  folderName: string
  onPreview: (doc: DocumentItem) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function DocumentRow({
  document,
  folderName,
  onPreview,
  onDelete,
  onToggleFavorite,
}: DocumentRowProps) {
  return (
    <div className="group/row flex items-center gap-3 rounded-xl border border-border bg-card/90 px-4 py-3 transition-all duration-300 hover:border-brand-center/40 hover:bg-linear-to-r hover:from-card hover:to-brand-center/[0.04] hover:shadow-md hover:-translate-y-[1px]">
      {/* Botón Favorito Rápido */}
      <button
        type="button"
        onClick={() => onToggleFavorite(document.id)}
        className="text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer shrink-0"
        aria-label={document.favorite ? "Quitar destacado" : "Destacar"}
      >
        <Star
          className={`size-4 transition-all duration-150 ${
            document.favorite
              ? "text-amber-500 fill-amber-500 scale-110"
              : "opacity-40 group-hover/row:opacity-100"
          }`}
        />
      </button>

      {/* Tipo de Documento y Nombre */}
      <button
        type="button"
        onClick={() => onPreview(document)}
        className="flex min-w-0 flex-1 items-center gap-3.5 text-left cursor-pointer"
      >
        <DocumentTypeIcon type={document.type} className="size-6 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground group-hover/row:text-brand-center transition-colors">
            {document.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {folderName} · {formatFileSize(document.size)} · {formatDate(document.createdAt)}
          </p>
        </div>
      </button>

      {/* Etiquetas */}
      <div className="hidden flex-wrap items-center gap-1.5 sm:flex max-w-[200px] shrink-0">
        {document.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" className="font-normal text-[11px] px-2 py-0.5">
            {tag}
          </Badge>
        ))}
        {document.tags.length > 2 && (
          <Badge variant="outline" className="font-normal text-[11px] px-2 py-0.5">
            +{document.tags.length - 2}
          </Badge>
        )}
      </div>

      {/* Menú Desplegable Acciones */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-lg hover:bg-muted cursor-pointer"
              aria-label="Acciones del documento"
            />
          }
        >
          <MoreVertical className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onPreview(document)}>
            <Eye className="size-4 text-muted-foreground" />
            Ver detalle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleFavorite(document.id)}>
            <Star className="size-4 text-amber-500 fill-amber-500" />
            {document.favorite ? "Quitar destacado" : "Destacar"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPreview(document)}>
            <Edit3 className="size-4 text-muted-foreground" />
            Editar metadatos
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="size-4 text-muted-foreground" />
            Descargar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(document.id)}>
            <Trash2 className="size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
