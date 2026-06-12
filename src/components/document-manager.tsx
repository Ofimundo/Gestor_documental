"use client"

import { useMemo, useState } from "react"
import {
  Search,
  UploadCloud,
  FileX2,
  ArrowDownAZ,
  Star,
  FolderOpen,
  HardDrive,
  Clock,
  Files,
  ArrowUpDown,
  Plus
} from "lucide-react"
import type { DocumentItem, DocumentType, Folder } from "@/lib/types"
import { mockDocuments, mockFolders } from "@/lib/mock-data"
import { documentTypeLabel, formatFileSize, formatDate } from "@/lib/format"
import { DocumentSidebar } from "@/components/document-sidebar"
import { DocumentRow } from "@/components/document-row"
import { DocumentPreviewDialog } from "@/components/document-preview-dialog"
import { UploadDialog } from "@/components/upload-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentTypeIcon } from "@/components/document-type-icon"

type SortKey = "recent" | "name" | "size"

const documentTypes: DocumentType[] = ["pdf", "image", "word", "excel", "other"]

export function DocumentManager() {
  const [folders, setFolders] = useState<Folder[]>(mockFolders)
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<DocumentType | "all">("all")
  const [sortKey, setSortKey] = useState<SortKey>("recent")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const folderName = (id: string) => folders.find((f) => f.id === id)?.name ?? "Sin carpeta"

  // Conteo de documentos por carpeta
  const documentCounts = useMemo(() => {
    return documents.reduce<Record<string, number>>((acc, doc) => {
      acc[doc.folderId] = (acc[doc.folderId] ?? 0) + 1
      return acc
    }, {})
  }, [documents])

  // Todas las etiquetas únicas
  const allTags = useMemo(() => {
    const set = new Set<string>()
    documents.forEach((doc) => doc.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [documents])

  // Espacio utilizado en total (en bytes)
  const usedStorage = useMemo(() => {
    return documents.reduce((sum, doc) => sum + doc.size, 0)
  }, [documents])

  // Carpetas vacías o totales
  const totalFoldersCount = folders.length

  // Cantidad de favoritos
  const favoritesCount = useMemo(() => {
    return documents.filter((doc) => doc.favorite).length
  }, [documents])

  // Agrupación por tipo para estadísticas
  const typeStats = useMemo(() => {
    const stats: Record<DocumentType, { count: number; size: number }> = {
      pdf: { count: 0, size: 0 },
      image: { count: 0, size: 0 },
      word: { count: 0, size: 0 },
      excel: { count: 0, size: 0 },
      other: { count: 0, size: 0 },
    }
    documents.forEach((doc) => {
      if (stats[doc.type]) {
        stats[doc.type].count += 1
        stats[doc.type].size += doc.size
      }
    })
    return stats;
  }, [documents])

  // Filtrado y orden
  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = documents.filter((doc) => {
      if (selectedFolderId && doc.folderId !== selectedFolderId) return false
      if (selectedTag && !doc.tags.includes(selectedTag)) return false
      if (typeFilter !== "all" && doc.type !== typeFilter) return false
      if (showFavoritesOnly && !doc.favorite) return false
      if (query && !doc.name.toLowerCase().includes(query)) return false
      return true
    })

    result.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name)
      if (sortKey === "size") return b.size - a.size
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return result
  }, [documents, selectedFolderId, selectedTag, typeFilter, search, sortKey, showFavoritesOnly])

  // Documentos recientes (últimos 4 agregados)
  const recentDocuments = useMemo(() => {
    return [...documents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
  }, [documents])

  const handlePreview = (doc: DocumentItem) => {
    setPreviewDoc(doc)
    setPreviewOpen(true)
  }

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    if (previewDoc && previewDoc.id === id) {
      setPreviewOpen(false)
      setPreviewDoc(null)
    }
  }

  const handleUpload = (doc: DocumentItem) => {
    setDocuments((prev) => [doc, ...prev])
  }

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: `f-${Date.now()}`,
      name,
    }
    setFolders((prev) => [...prev, newFolder])
  }

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId))
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null)
    }
  }

  const handleToggleFavorite = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, favorite: !doc.favorite } : doc))
    )
    if (previewDoc && previewDoc.id === id) {
      setPreviewDoc((prev) => prev ? { ...prev, favorite: !prev.favorite } : null)
    }
  }

  const handleUpdateDocument = (updatedDoc: DocumentItem) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))
    )
    if (previewDoc && previewDoc.id === updatedDoc.id) {
      setPreviewDoc(updatedDoc)
    }
  }

  const isDashboardView = selectedFolderId === null && selectedTag === null && !showFavoritesOnly && !search && typeFilter === "all"

  const heading = selectedFolderId
    ? folderName(selectedFolderId)
    : selectedTag
    ? `Etiqueta: ${selectedTag}`
    : showFavoritesOnly
    ? "Documentos Destacados"
    : "Todos los documentos"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DocumentSidebar
        folders={folders}
        documentCounts={documentCounts}
        totalCount={documents.length}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        allTags={allTags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        usedStorage={usedStorage}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Encabezado con búsqueda y acción de subir */}
        <header className="flex flex-col gap-4 border-b border-border bg-card/40 backdrop-blur-md px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                {selectedFolderId ? (
                  <FolderOpen className="size-5 text-brand-center" />
                ) : showFavoritesOnly ? (
                  <Star className="size-5 text-amber-500 fill-amber-500" />
                ) : (
                  <Files className="size-5 text-brand-start" />
                )}
                {heading}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filteredDocuments.length} {filteredDocuments.length === 1 ? "documento" : "documentos"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="cursor-pointer"
              >
                <Star className={`size-4 ${showFavoritesOnly ? "fill-white text-white" : "text-amber-500 fill-amber-500"}`} />
                <span className="hidden sm:inline">Destacados</span>
              </Button>
              <Button 
                onClick={() => setUploadOpen(true)}
                className="bg-brand-gradient text-white border-transparent hover:opacity-90 shadow-md transition-all cursor-pointer"
                size="sm"
              >
                <UploadCloud className="size-4" />
                Subir documento
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre de archivo..."
                className="pl-9 h-9"
                aria-label="Buscar documentos"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as DocumentType | "all")}>
                <SelectTrigger className="w-36 h-9" aria-label="Filtrar por tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {documentTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                <SelectTrigger className="w-40 h-9" aria-label="Ordenar">
                  <ArrowUpDown className="size-3.5 text-muted-foreground mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="name">Nombre (A-Z)</SelectItem>
                  <SelectItem value="size">Tamaño</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Listado / Dashboard */}
        <ScrollArea className="flex-1 bg-background/50">
          <div className="flex flex-col gap-6 px-6 py-6 max-w-6xl mx-auto">
            {/* RENDERIZAR DASHBOARD SI NO HAY FILTROS */}
            {isDashboardView && (
              <div className="grid gap-6 animate-in fade-in duration-300">
                {/* Métricas Principales */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                  <Card className="shadow-xs border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Documentos</CardTitle>
                      <Files className="size-4 text-brand-start" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-extrabold text-foreground">{documents.length}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Archivos almacenados</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xs border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Carpetas</CardTitle>
                      <FolderOpen className="size-4 text-brand-center" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-extrabold text-foreground">{totalFoldersCount}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Categorías creadas</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xs border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Almacenamiento</CardTitle>
                      <HardDrive className="size-4 text-brand-end" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-extrabold text-foreground">{formatFileSize(usedStorage)}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Utilizado de 100 MB</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xs border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Destacados</CardTitle>
                      <Star className="size-4 text-amber-500 fill-amber-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-extrabold text-foreground">{favoritesCount}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Archivos con estrella</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Estadísticas de distribución por tipo */}
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="md:col-span-2 shadow-xs border-border bg-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold text-foreground">Distribución por Tipo de Archivo</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3.5">
                      {documentTypes.map((type) => {
                        const stats = typeStats[type];
                        const typeTotalPercentage = usedStorage > 0 ? (stats.size / usedStorage) * 100 : 0;
                        return (
                          <div key={type} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 font-medium text-foreground">
                                <DocumentTypeIcon type={type} className="size-4" />
                                {documentTypeLabel(type)}
                              </span>
                              <span className="text-muted-foreground">
                                {stats.count} {stats.count === 1 ? "archivo" : "archivos"} · {formatFileSize(stats.size)}
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-brand-gradient rounded-full"
                                style={{ width: `${typeTotalPercentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  {/* Acciones Rápidas */}
                  <Card className="shadow-xs border-border bg-card flex flex-col justify-between">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold text-foreground">Acción Rápida</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-linear-to-b from-transparent to-muted/20 rounded-b-xl border-t border-border/50">
                      <div className="rounded-full bg-brand-gradient p-3 text-white mb-3 shadow-md animate-pulse">
                        <UploadCloud className="size-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">¿Subir nuevo documento?</h4>
                      <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-[200px]">
                        Arrastra tus archivos o haz clic abajo para cargarlos a la nube.
                      </p>
                      <Button
                        onClick={() => setUploadOpen(true)}
                        size="sm"
                        className="bg-brand-gradient hover:opacity-90 w-full cursor-pointer shadow-xs"
                      >
                        Subir Archivo
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Archivos Recientes */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Clock className="size-4 text-brand-center" />
                      Documentos Recientes
                    </h3>
                  </div>
                  <div className="grid gap-2">
                    {recentDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => handlePreview(doc)}
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/40 hover:border-brand-center/30 transition-all cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <DocumentTypeIcon type={doc.type} className="size-5" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate group-hover:text-brand-center transition-colors">
                              {doc.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {folderName(doc.folderId)} · {formatFileSize(doc.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] text-muted-foreground">{formatDate(doc.createdAt)}</span>
                          {doc.favorite && <Star className="size-3.5 text-amber-500 fill-amber-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LISTA DE ARCHIVOS (FILTRADA O DEBAJO DE TODO) */}
            <div className="flex flex-col gap-3">
              {!isDashboardView && (
                <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Listado de Documentos</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {filteredDocuments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center bg-card/25 rounded-xl border border-dashed border-border">
                    <FileX2 className="size-10 text-muted-foreground" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">No se encontraron documentos</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Prueba con otros filtros o sube un nuevo archivo.</p>
                    </div>
                  </div>
                ) : (
                  // Mostrar el listado completo (solo si no es dashboard o si el usuario buscó/filtró)
                  (!isDashboardView || search !== "") &&
                  filteredDocuments.map((doc) => (
                    <DocumentRow
                      key={doc.id}
                      document={doc}
                      folderName={folderName(doc.folderId)}
                      onPreview={handlePreview}
                      onDelete={handleDelete}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </main>

      <DocumentPreviewDialog
        document={previewDoc}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        folderName={previewDoc ? folderName(previewDoc.folderId) : undefined}
        folders={folders}
        onUpdateDocument={handleUpdateDocument}
        onDelete={handleDelete}
      />

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        folders={folders}
        defaultFolderId={selectedFolderId}
        onUpload={handleUpload}
      />
    </div>
  )
}
