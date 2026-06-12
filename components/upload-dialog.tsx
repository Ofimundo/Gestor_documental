"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { UploadCloud, X, Loader2, CheckCircle2 } from "lucide-react"
import type { DocumentItem, Folder } from "@/lib/types"
import { inferDocumentType } from "@/lib/format"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folders: Folder[]
  defaultFolderId: string | null
  onUpload: (doc: DocumentItem) => void
}

export function UploadDialog({ open, onOpenChange, folders, defaultFolderId, onUpload }: UploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const [folderId, setFolderId] = useState(defaultFolderId ?? folders[0]?.id ?? "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [description, setDescription] = useState("")

  // Estados para simulación de subida
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [statusText, setStatusText] = useState("")

  useEffect(() => {
    if (defaultFolderId) {
      setFolderId(defaultFolderId)
    } else if (folders.length > 0 && !folderId) {
      setFolderId(folders[0].id)
    }
  }, [defaultFolderId, folders, folderId])

  function reset() {
    setFileName("")
    setFileSize(0)
    setTagInput("")
    setTags([])
    setDescription("")
    setIsUploading(false)
    setUploadProgress(0)
    setStatusText("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setFileSize(file.size)
    }
  }

  function addTag() {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
    }
    setTagInput("")
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fileName || !folderId || isUploading) return

    setIsUploading(true)
    setUploadProgress(0)
    setStatusText("Iniciando subida...")

    const targetDoc: DocumentItem = {
      id: `d-${Date.now()}`,
      name: fileName,
      type: inferDocumentType(fileName),
      folderId,
      tags,
      size: fileSize,
      createdAt: new Date().toISOString(),
      description: description.trim(),
      // Crear contenido interactivo básico si el tipo lo soporta
      mockContent: generateMockContent(fileName)
    }

    // Intervalo de simulación
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 10
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        setStatusText("¡Guardado en base de datos exitosamente!")
        setTimeout(() => {
          onUpload(targetDoc)
          reset()
          onOpenChange(false)
        }, 500)
      } else {
        setUploadProgress(currentProgress)
        if (currentProgress < 30) {
          setStatusText("Leyendo archivo local...")
        } else if (currentProgress < 60) {
          setStatusText("Transmitiendo datos binarios (VARBINARY)...")
        } else if (currentProgress < 85) {
          setStatusText("Verificando integridad y amenazas...")
        } else {
          setStatusText("Escribiendo índices en SQL Server...")
        }
      }
    }, 180)
  }

  // Genera datos simulados básicos para el nuevo archivo
  function generateMockContent(name: string) {
    const ext = name.split(".").pop()?.toLowerCase() ?? ""
    if (ext === "pdf") {
      return {
        title: "DOCUMENTO DIGITALIZADO PDF",
        code: `DOC-${Math.floor(Math.random() * 9000) + 1000}`,
        sections: [
          {
            title: "INFORMACIÓN GENERAL",
            text: `Este es un documento PDF subido de forma simulada. Nombre del archivo: ${name}. En un entorno productivo, el archivo se transmitirá como arreglo de bytes (VARBINARY(MAX)) a SQL Server y se servirá dinámicamente en el visor.`
          }
        ],
        signatures: ["Verificado por Sistema"]
      }
    } else if (["xls", "xlsx", "csv"].includes(ext)) {
      return {
        sheetName: "Hoja de Cálculo Subida",
        headers: ["Columna A", "Columna B", "Columna C"],
        rows: [
          ["Datos Fila 1", 1000, 2000],
          ["Datos Fila 2", 1500, 3000],
          ["Datos Fila 3", 2400, 4800]
        ],
        totals: ["Total Simulado", 4900, 9800]
      }
    } else if (["doc", "docx"].includes(ext)) {
      return {
        title: "DOCUMENTO WORD GENERADO",
        version: "V1.0 - Auto",
        body: [
          `Este documento de texto simula el contenido importado de ${name}.`,
          "El sistema procesó el archivo e indexó sus metadatos y contenido de texto de forma automática."
        ]
      }
    } else if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
      return {
        gradient: "linear-gradient(135deg, #70317A 0%, #2A3284 50%, #D2446A 100%)",
        dimensions: "1024 x 1024 px",
        colorPalette: ["#70317A", "#2A3284", "#D2446A"],
        svgLogo: false
      }
    }
    return null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !isUploading) reset()
        if (!isUploading) onOpenChange(value)
      }}
    >
      <DialogContent className="max-w-md text-foreground rounded-xl">
        <DialogHeader>
          <DialogTitle>Subir documento</DialogTitle>
          <DialogDescription>
            Selecciona un archivo para simular el almacenamiento digital (VARBINARY).
          </DialogDescription>
        </DialogHeader>

        {isUploading ? (
          // CONTENEDOR DE CARGA ANIMADO
          <div className="flex flex-col items-center justify-center py-8 px-4 animate-in fade-in duration-300">
            {uploadProgress === 100 ? (
              <CheckCircle2 className="size-12 text-emerald-500 animate-bounce" />
            ) : (
              <Loader2 className="size-12 text-brand-center animate-spin" />
            )}
            
            <h4 className="text-sm font-semibold text-foreground mt-4">{statusText}</h4>
            
            <div className="w-full mt-5">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-brand-gradient transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <span>{formatFileSize(fileSize)}</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          </div>
        ) : (
          // FORMULARIO DE SUBIDA
          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            {/* Selector de archivo */}
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Archivo</Label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-7 text-center transition-all hover:border-brand-center/60 hover:bg-muted/60 cursor-pointer group shadow-2xs"
              >
                <UploadCloud className="size-8 text-muted-foreground group-hover:text-brand-center transition-colors" aria-hidden="true" />
                {fileName ? (
                  <div className="max-w-[300px]">
                    <span className="text-xs font-semibold text-foreground truncate block">{fileName}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">{formatFileSize(fileSize)}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">
                    Haz clic para seleccionar un archivo
                  </span>
                )}
              </button>
              <input ref={fileInputRef} type="file" className="sr-only" onChange={handleFileChange} />
            </div>

            {/* Carpeta */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="folder" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Carpeta Destino</Label>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger id="folder" className="h-9">
                  <SelectValue placeholder="Selecciona una carpeta" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Descripción (Opcional)</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ingresa detalles sobre este documento..."
                className="w-full min-h-[50px] rounded-lg border border-input bg-transparent px-3 py-2 text-xs placeholder-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>

            {/* Etiquetas */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="tags" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Etiquetas</Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                placeholder="Escribe una etiqueta y presiona Enter o coma"
                className="h-9"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 px-2.5 py-0.5 text-[10px]">
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                        aria-label={`Quitar etiqueta ${tag}`}
                        className="cursor-pointer hover:text-foreground text-muted-foreground"
                      >
                        <X className="size-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="mt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="h-9 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!fileName || !folderId}
                className="bg-brand-gradient text-white border-transparent hover:opacity-90 h-9 cursor-pointer shadow-xs"
              >
                Comenzar Carga
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
