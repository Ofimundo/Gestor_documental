"use client"

import { useState, useEffect } from "react"
import {
  Download,
  Eye,
  MoreVertical,
  Trash2,
  Star,
  Edit3,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Save,
  Tag,
  FolderOpen,
  Calendar,
  HardDrive,
  FileText,
  FileSpreadsheet,
  X,
  Plus
} from "lucide-react"
import type { DocumentItem, Folder } from "@/lib/types"
import { documentTypeLabel, formatDate, formatFileSize } from "@/lib/format"
import { DocumentTypeIcon } from "@/components/document-type-icon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DocumentPreviewDialogProps {
  document: DocumentItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  folderName?: string
  folders: Folder[]
  onUpdateDocument: (updatedDoc: DocumentItem) => void
  onDelete: (id: string) => void
}

export function DocumentPreviewDialog({
  document,
  open,
  onOpenChange,
  folderName,
  folders,
  onUpdateDocument,
  onDelete,
}: DocumentPreviewDialogProps) {
  // Estados para edición
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedFolderId, setEditedFolderId] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [editedTags, setEditedTags] = useState<string[]>([])

  // Estados para controles del visor
  const [zoom, setZoom] = useState(1.0)
  const [rotation, setRotation] = useState(0)

  // Sincronizar datos al abrir el documento
  useEffect(() => {
    if (document) {
      setEditedName(document.name)
      setEditedFolderId(document.folderId)
      setEditedDescription(document.description ?? "")
      setEditedTags(document.tags)
      setIsEditing(false)
      setZoom(1.0)
      setRotation(0)
    }
  }, [document])

  if (!document) return null

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.5))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.7))
  const handleRotate = () => setRotation((r) => (r + 90) % 360)

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !editedTags.includes(trimmed)) {
      setEditedTags((prev) => [...prev, trimmed])
    }
    setTagInput("")
  }

  const handleRemoveTag = (tag: string) => {
    setEditedTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleSave = () => {
    const updated: DocumentItem = {
      ...document,
      name: editedName.trim(),
      folderId: editedFolderId,
      description: editedDescription.trim(),
      tags: editedTags,
    }
    onUpdateDocument(updated)
    setIsEditing(false)
  }

  // --- RENDERIZADO DE PREVISUALIZACIONES INTERACTIVAS ---

  // 1. Renderizador de PDF (Contrato o Factura)
  const renderPdfPreview = () => {
    const mc = document.mockContent
    if (!mc) return null

    // Caso A: Factura
    if (mc.invoiceDetails) {
      const details = mc.invoiceDetails
      return (
        <div 
          className="bg-white text-slate-800 p-6 shadow-md rounded-md max-w-lg mx-auto text-[11px] font-sans transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          {/* Cabecera Factura */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{details.issuer}</h3>
              <p className="text-slate-500 mt-0.5">RUT: {details.rut}</p>
              <p className="text-slate-500">Servicios Tecnológicos Integrales</p>
            </div>
            <div className="border border-red-500 text-red-500 rounded p-2 text-center bg-red-50/20">
              <h4 className="font-bold text-xs">R.U.T.: 76.492.302-K</h4>
              <p className="font-semibold">{mc.title}</p>
              <p className="font-mono mt-0.5">N° {mc.code}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-slate-600">
            <div>
              <span className="font-bold text-slate-700 block">Cliente:</span>
              <span>{details.client}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">Fechas:</span>
              <span>Emisión: {details.date}</span>
              <span className="block">Vence: {details.dueDate}</span>
            </div>
          </div>

          {/* Tabla de Items */}
          <table className="w-full text-left mb-6 border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-700 font-bold bg-slate-50">
                <th className="py-1.5 px-2">Descripción</th>
                <th className="py-1.5 px-2 text-right">Cant</th>
                <th className="py-1.5 px-2 text-right">P. Unitario ($)</th>
                <th className="py-1.5 px-2 text-right">Total ($)</th>
              </tr>
            </thead>
            <tbody>
              {details.items.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-1.5 px-2">{item.description}</td>
                  <td className="py-1.5 px-2 text-right">{item.quantity}</td>
                  <td className="py-1.5 px-2 text-right">{item.price.toLocaleString("es-CL")}</td>
                  <td className="py-1.5 px-2 text-right">{item.total.toLocaleString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totales */}
          <div className="flex justify-end text-right">
            <div className="w-48 text-slate-700 font-semibold space-y-1">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>Neto:</span>
                <span>${details.subtotal.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>19% IVA:</span>
                <span>${details.tax.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-xs pt-1 border-t border-slate-300">
                <span>Total:</span>
                <span>${details.total.toLocaleString("es-CL")}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Caso B: Contrato
    if (mc.sections) {
      return (
        <div 
          className="bg-white text-slate-800 p-8 shadow-md rounded-md max-w-lg mx-auto text-[10px] leading-relaxed font-sans border border-slate-100 text-left transition-transform duration-200 relative"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          {/* Marca de agua de previsualización */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
            <span className="text-4xl font-extrabold rotate-45 border-4 border-slate-800 p-4">PREVISUALIZACIÓN</span>
          </div>

          <div className="text-center mb-5">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">{mc.title}</h3>
            <p className="font-mono text-slate-500 mt-1">CÓDIGO: {mc.code}</p>
          </div>

          <div className="space-y-4 text-justify">
            {mc.sections.map((sec: any, idx: number) => (
              <div key={idx}>
                <h4 className="font-bold text-slate-950 mb-1">{sec.title}</h4>
                <p className="text-slate-700">{sec.text}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 mt-10 text-center border-t border-slate-100 pt-6">
            {mc.signatures.map((sig: string, idx: number) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-32 border-b border-slate-400 h-8 mb-1.5 border-dashed" />
                <span className="text-[9px] font-semibold text-slate-500">{sig}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }

  // 2. Renderizador de Excel (Matriz interactiva editable)
  const renderExcelPreview = () => {
    const mc = document.mockContent
    if (!mc) return null

    return (
      <div 
        className="w-full overflow-x-auto text-[11px] font-sans transition-transform duration-200"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
      >
        <div className="bg-[#107c41] text-white px-3 py-1.5 flex items-center gap-1.5 font-bold rounded-t-lg shadow-sm">
          <FileSpreadsheet className="size-4" />
          <span>{mc.sheetName}</span>
        </div>

        <table className="w-full text-left border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100 text-slate-500 text-center font-mono">
              <th className="border border-slate-200 py-1 w-8"></th>
              {mc.headers.map((h: string, idx: number) => (
                <th key={idx} className="border border-slate-200 px-2.5 py-1 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mc.rows.map((row: any[], rIdx: number) => (
              <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                <td className="border border-slate-200 bg-slate-50 font-mono text-slate-400 text-center py-1 font-bold">{rIdx + 1}</td>
                {row.map((cell: any, cIdx: number) => {
                  const isNumber = typeof cell === "number"
                  return (
                    <td 
                      key={cIdx} 
                      className={`border border-slate-200 px-2.5 py-1 text-slate-800 ${
                        isNumber ? "text-right font-mono" : "font-medium"
                      }`}
                    >
                      {isNumber 
                        ? cell.toLocaleString("es-CL", { minimumFractionDigits: cell % 1 === 0 ? 0 : 1 })
                        : cell
                      }
                    </td>
                  )
                })}
              </tr>
            ))}
            {/* Totales Excel */}
            {mc.totals && (
              <tr className="bg-emerald-50/40 font-bold border-t-2 border-emerald-600">
                <td className="border border-slate-200 bg-slate-100 text-center py-1">∑</td>
                {mc.totals.map((tot: any, idx: number) => {
                  const isNumber = typeof tot === "number"
                  return (
                    <td 
                      key={idx} 
                      className={`border border-slate-200 px-2.5 py-1.5 text-emerald-800 ${
                        isNumber ? "text-right font-mono" : ""
                      }`}
                    >
                      {isNumber ? `$${tot.toLocaleString("es-CL")}` : tot}
                    </td>
                  )
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  // 3. Renderizador de Word
  const renderWordPreview = () => {
    const mc = document.mockContent
    if (!mc) return null

    return (
      <div 
        className="bg-white text-slate-800 p-8 shadow-md rounded-md max-w-lg mx-auto text-[11px] leading-relaxed font-serif border border-slate-200 text-left transition-transform duration-200"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
      >
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
          <span className="font-sans text-[10px] text-blue-600 font-bold tracking-wide">{mc.version}</span>
          <span className="font-sans text-[9px] text-slate-400">OFILAB DOCUMENTO INTERNO</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-4 font-sans text-center border-b border-slate-100 pb-2">
          {mc.title}
        </h3>
        <div className="space-y-3 font-serif">
          {mc.body.map((paragraph: string, idx: number) => {
            const isBullet = paragraph.startsWith("•")
            return (
              <p key={idx} className={isBullet ? "pl-4 font-medium text-slate-700" : "text-justify"}>
                {paragraph}
              </p>
            )
          })}
        </div>
      </div>
    )
  }

  // 4. Renderizador de Imagen (mock)
  const renderImagePreview = () => {
    const mc = document.mockContent
    if (!mc) return null

    return (
      <div 
        className="flex flex-col items-center justify-center p-6 h-full transition-transform duration-200"
        style={{ transform: `rotate(${rotation}deg) scale(${zoom})` }}
      >
        {/* Renderiza el gradiente y simula el canvas */}
        <div 
          className="w-56 h-56 rounded-2xl flex items-center justify-center shadow-lg transition-transform"
          style={{ background: mc.gradient }}
        >
          {mc.svgLogo ? (
            <div className="flex flex-col items-center gap-1.5 text-white">
              <span className="text-3xl font-extrabold tracking-tighter">OFILAB</span>
              <span className="text-[10px] opacity-70 uppercase tracking-widest">Design System</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-white">
              <span className="text-xl font-bold tracking-tight">Campaña Verano</span>
              <span className="text-[10px] opacity-80">1920x1080 Mock</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col items-center gap-1">
          <p className="text-xs font-semibold text-foreground">Resolución: {mc.dimensions}</p>
          <div className="flex items-center gap-1 mt-1.5">
            {mc.colorPalette.map((color: string) => (
              <span 
                key={color} 
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Despachador de visualizaciones
  const renderPreviewContent = () => {
    switch (document.type) {
      case "pdf":
        return renderPdfPreview()
      case "excel":
        return renderExcelPreview()
      case "word":
        return renderWordPreview()
      case "image":
        return renderImagePreview()
      default:
        return (
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground py-12">
            <FileText className="size-12" aria-hidden="true" />
            <p className="text-sm font-semibold">Previsualización de archivo {documentTypeLabel(document.type)}</p>
            <p className="text-xs">El contenido simulado se habilitará al conectar con el backend.</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden flex flex-col md:flex-row h-[85vh] rounded-xl">
        {/* PANEL IZQUIERDO: VISOR INTERACTIVO */}
        <div className="flex-1 flex flex-col bg-muted/30 border-r border-border min-w-0">
          {/* Barra de herramientas del visor */}
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2 text-foreground">
            <div className="flex items-center gap-2">
              <DocumentTypeIcon type={document.type} className="size-4 text-brand-center" />
              <span className="text-xs font-bold truncate max-w-[200px]">{document.name}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-md cursor-pointer hover:bg-muted"
                onClick={handleZoomOut}
                title="Alejar"
              >
                <ZoomOut className="size-4" />
              </Button>
              <span className="text-[11px] font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-md cursor-pointer hover:bg-muted"
                onClick={handleZoomIn}
                title="Acercar"
              >
                <ZoomIn className="size-4" />
              </Button>
              
              {document.type === "image" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-md cursor-pointer hover:bg-muted ml-1"
                  onClick={handleRotate}
                  title="Rotar imagen"
                >
                  <RotateCw className="size-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Área del lienzo de previsualización */}
          <div className="flex-1 overflow-auto p-6 flex items-start justify-center relative min-h-0 bg-zinc-100 dark:bg-zinc-900/40">
            <div className="w-full flex justify-center py-4">
              {renderPreviewContent()}
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: DETALLES E INFORMACIÓN / EDICIÓN */}
        <div className="w-full md:w-80 flex flex-col bg-card text-foreground shrink-0 overflow-y-auto">
          {/* Header Panel */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
              <Star className={`size-4 text-amber-500 ${document.favorite ? "fill-amber-500" : ""}`} />
              Detalle del Archivo
            </h3>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 hover:bg-muted cursor-pointer transition-colors md:hidden text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Formulario/Vista de Información */}
          <div className="flex-1 p-5 flex flex-col gap-5 text-xs">
            {isEditing ? (
              // MODO EDICIÓN
              <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-name" className="text-[11px] font-semibold text-muted-foreground">Nombre del archivo</Label>
                  <Input
                    id="edit-name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-8.5"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-folder" className="text-[11px] font-semibold text-muted-foreground">Carpeta</Label>
                  <Select value={editedFolderId} onValueChange={(val) => setEditedFolderId(val ?? "")}>
                    <SelectTrigger id="edit-folder" className="h-8.5">
                      <SelectValue placeholder="Selecciona una carpeta" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-desc" className="text-[11px] font-semibold text-muted-foreground">Descripción</Label>
                  <textarea
                    id="edit-desc"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Agrega una nota o descripción..."
                    className="w-full min-h-[70px] rounded-lg border border-input bg-transparent px-3 py-2 text-xs placeholder-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-tags" className="text-[11px] font-semibold text-muted-foreground">Etiquetas</Label>
                  <div className="flex gap-1.5">
                    <Input
                      id="edit-tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                      placeholder="Nueva etiqueta..."
                      className="h-8.5 flex-1"
                    />
                    <Button onClick={handleAddTag} size="sm" variant="outline" className="h-8.5 px-2.5 cursor-pointer">
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  {editedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {editedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 px-2.5 py-0.5 text-[10px]">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <X className="size-2.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-8.5 cursor-pointer"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1 h-8.5 bg-brand-gradient text-white border-transparent cursor-pointer shadow-xs"
                    onClick={handleSave}
                    disabled={!editedName.trim() || !editedFolderId}
                  >
                    <Save className="size-3.5" />
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              // MODO VISTA DE DETALLES
              <div className="flex flex-col gap-4.5 animate-in fade-in duration-200">
                <div>
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Descripción</h4>
                  <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {document.description || "Sin descripción disponible para este archivo."}
                  </p>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="size-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Carpeta contenedora</p>
                      <p className="font-semibold text-foreground mt-0.5">{folderName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <HardDrive className="size-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Tamaño del archivo</p>
                      <p className="font-semibold text-foreground mt-0.5">{formatFileSize(document.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Fecha de creación</p>
                      <p className="font-semibold text-foreground mt-0.5">{formatDate(document.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {document.tags.length > 0 && (
                  <>
                    <Separator className="opacity-50" />
                    <div>
                      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Etiquetas</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {document.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-[10px] font-normal shadow-2xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-8.5 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="size-3.5 mr-1" />
                    Editar metadatos
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-brand-gradient text-white border-transparent cursor-pointer shadow-xs">
                      <Download className="size-3.5" />
                      Descargar
                    </Button>
                    <Button 
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => onDelete(document.id)}
                      title="Eliminar archivo"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Separator({ className }: { className?: string }) {
  return <div className={`h-[1px] bg-border w-full ${className}`} />
}
