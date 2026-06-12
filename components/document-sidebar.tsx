"use client"

import { useState, useEffect } from "react"
import { Folder as FolderIcon, FolderOpen, Files, Tag, Plus, Check, X, Sun, Moon, HardDrive, Trash2 } from "lucide-react"
import Image from "next/image"
import type { Folder } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { formatFileSize } from "@/lib/format"

interface DocumentSidebarProps {
  folders: Folder[]
  documentCounts: Record<string, number>
  totalCount: number
  selectedFolderId: string | null
  onSelectFolder: (folderId: string | null) => void
  allTags: string[]
  selectedTag: string | null
  onSelectTag: (tag: string | null) => void
  onCreateFolder: (name: string) => void
  onDeleteFolder: (folderId: string) => void
  usedStorage: number
}

export function DocumentSidebar({
  folders,
  documentCounts,
  totalCount,
  selectedFolderId,
  onSelectFolder,
  allTags,
  selectedTag,
  onSelectTag,
  onCreateFolder,
  onDeleteFolder,
  usedStorage,
}: DocumentSidebarProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isDark, setIsDark] = useState(false)

  // Carga inicial del tema
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = document.documentElement.classList.contains("dark") || 
        localStorage.getItem("theme") === "dark"
      setIsDark(isDarkMode)
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  const toggleDarkMode = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim()
    if (trimmed) {
      onCreateFolder(trimmed)
      setNewFolderName("")
      setIsCreatingFolder(false)
    }
  }

  // Capacidad de 100 MB fijada como demo
  const maxStorage = 100 * 1024 * 1024 // 100 MB
  const storagePercentage = (usedStorage / maxStorage) * 100

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-5 border-r border-border bg-sidebar p-4 select-none">
      {/* Encabezado Logo */}
      <div className="px-2 pt-1">
        <div className="flex items-center gap-2">
          <Image
            src="/ofilab-logo.png"
            alt="OFILAB"
            width={1127}
            height={527}
            priority
            className="h-8 w-auto block dark:hidden"
          />
          {/* Logo alternativo de texto en degradado para dark mode en caso de que no tenga canal transparente oscuro */}
          <span className="hidden dark:block text-2xl font-bold tracking-tight text-brand-gradient">
            OFILAB
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold tracking-wider uppercase text-brand-gradient">
          Gestor Documental
        </p>
      </div>

      {/* Navegación de Carpetas */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto" aria-label="Carpetas">
        <button
          type="button"
          onClick={() => {
            onSelectFolder(null)
            onSelectTag(null)
          }}
          className={cn(
            "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
            selectedFolderId === null && selectedTag === null
              ? "bg-primary text-primary-foreground shadow-sm bg-brand-gradient"
              : "text-sidebar-foreground hover:bg-sidebar-accent/60",
          )}
        >
          <span className="flex items-center gap-2">
            <Files className="size-4" aria-hidden="true" />
            Todos los documentos
          </span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-semibold",
            selectedFolderId === null && selectedTag === null
              ? "bg-white/20 text-white"
              : "bg-muted text-muted-foreground"
          )}>{totalCount}</span>
        </button>

        {/* Separador Carpetas */}
        <div className="mt-4 mb-2 flex items-center justify-between px-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Carpetas</p>
          <button
            onClick={() => setIsCreatingFolder(!isCreatingFolder)}
            className="rounded-full p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors cursor-pointer"
            title="Crear nueva carpeta"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {/* Crear Carpeta Form */}
        {isCreatingFolder && (
          <div className="mb-2 flex items-center gap-1.5 rounded-md border border-border bg-card/60 p-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <input
              type="text"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder()
                if (e.key === "Escape") setIsCreatingFolder(false)
              }}
              placeholder="Nombre de carpeta..."
              className="w-full bg-transparent px-1.5 py-0.5 text-xs text-foreground placeholder-muted-foreground outline-none"
            />
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="rounded-md p-1 text-primary hover:bg-primary/10 disabled:opacity-30 cursor-pointer"
            >
              <Check className="size-3.5" />
            </button>
            <button
              onClick={() => setIsCreatingFolder(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto">
          {folders.map((folder) => {
            const isActive = selectedFolderId === folder.id
            const count = documentCounts[folder.id] ?? 0
            return (
              <div
                key={folder.id}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectFolder(folder.id)
                    onSelectTag(null)
                  }}
                  className="flex flex-1 items-center gap-2 truncate text-left cursor-pointer"
                >
                  {isActive ? (
                    <FolderOpen className="size-4 shrink-0 text-brand-center" aria-hidden="true" />
                  ) : (
                    <FolderIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className="truncate">{folder.name}</span>
                </button>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground px-1.5">{count}</span>
                  {/* Eliminar carpeta solo si está vacía */}
                  {count === 0 && (
                    <button
                      onClick={() => onDeleteFolder(folder.id)}
                      className="opacity-0 group-hover:opacity-100 rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                      title="Eliminar carpeta"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </nav>

      {/* Navegación de Etiquetas */}
      {allTags.length > 0 && (
        <div className="flex flex-col gap-2">
          <Separator />
          <p className="flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Tag className="size-3.5" aria-hidden="true" />
            Etiquetas
          </p>
          <div className="flex flex-wrap gap-1.5 px-2 max-h-24 overflow-y-auto">
            {allTags.map((tag) => {
              const isActive = selectedTag === tag
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag(isActive ? null : tag)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs transition-all duration-200 cursor-pointer shadow-xs",
                    isActive
                      ? "border-transparent bg-brand-gradient text-white font-medium"
                      : "border-border bg-card text-muted-foreground hover:border-brand-center/50 hover:text-foreground",
                  )}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Widget Almacenamiento */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
          <HardDrive className="size-4 text-brand-center" />
          <span>Almacenamiento</span>
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
          <span>{formatFileSize(usedStorage)} de 100 MB</span>
          <span>{storagePercentage.toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-brand-gradient transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, storagePercentage)}%` }}
          />
        </div>
        <p className="mt-1.5 text-[9px] text-muted-foreground text-center">
          Preparado para SQL Server (VARBINARY)
        </p>
      </div>

      <Separator />

      {/* Toggle Oscuro/Claro */}
      <div className="flex items-center justify-between px-2 pb-1">
        <span className="text-xs text-muted-foreground">Tema</span>
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center rounded-lg border border-border bg-card p-1.5 text-foreground hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer shadow-xs"
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? (
            <Sun className="size-4 text-amber-500 animate-spin-slow" />
          ) : (
            <Moon className="size-4 text-slate-700" />
          )}
        </button>
      </div>
    </aside>
  )
}
