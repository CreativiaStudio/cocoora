"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  FolderOpen,
  Image as ImageIcon,
  Plus,
  Search,
  UploadCloud,
  X,
} from "lucide-react";
import { INITIAL_MEDIA_CATALOG, type MediaItem } from "@/lib/media-catalog";

const CUSTOM_MEDIA_STORAGE_KEY = "cocoora_custom_media_items";

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
}) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customItems, setCustomItems] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Carica media personalizzati da localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(CUSTOM_MEDIA_STORAGE_KEY);
      if (raw) {
        setCustomItems(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  // Unione catalogo iniziale + personalizzati
  const allMedia = useMemo(() => {
    return [...customItems, ...INITIAL_MEDIA_CATALOG];
  }, [customItems]);

  // Seleziona di default l'immagine attuale se presente nel catalogo
  useEffect(() => {
    if (isOpen && currentValue) {
      const found = allMedia.find((m) => m.url === currentValue);
      if (found) {
        setSelectedItem(found);
      }
    }
  }, [isOpen, currentValue, allMedia]);

  // Chiudi con ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allMedia.forEach((m) => set.add(m.category));
    return ["all", ...Array.from(set)];
  }, [allMedia]);

  const filteredMedia = useMemo(() => {
    return allMedia.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.filename.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allMedia, selectedCategory, search]);

  const handleFileDrop = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setUploadError("Carica solo file immagine (JPG, PNG, WebP).");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      // Invio all'endpoint di upload
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // Fallback: se l'API non è attiva o fallisce, usiamo data URL per non bloccare Silvia
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const newItem: MediaItem = {
            id: `custom_${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            filename: file.name,
            url: dataUrl,
            sizeKb: Math.round(file.size / 1024),
            category: "Caricati di recente",
          };
          saveCustomItem(newItem);
        };
        reader.readAsDataURL(file);
      } else {
        const data = await res.json();
        const newItem: MediaItem = {
          id: data.id || `r2_${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          filename: file.name,
          url: data.url,
          sizeKb: Math.round(file.size / 1024),
          category: "Cloudflare R2",
        };
        saveCustomItem(newItem);
      }
    } catch {
      // Fallback data URL in caso di errore di rete
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newItem: MediaItem = {
          id: `custom_${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          filename: file.name,
          url: dataUrl,
          sizeKb: Math.round(file.size / 1024),
          category: "Caricati di recente",
        };
        saveCustomItem(newItem);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const saveCustomItem = (newItem: MediaItem) => {
    const updated = [newItem, ...customItems];
    setCustomItems(updated);
    try {
      localStorage.setItem(CUSTOM_MEDIA_STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
    } catch {
      // local storage full
    }
    setSelectedItem(newItem);
    setTab("library");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-navy/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-teal-200/80 bg-white shadow-2xl">
        {/* ── HEADER MODALE ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-teal-100 bg-canvas px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-teal-950">Libreria Media Cocoora</h2>
              <p className="text-xs text-charcoal/50">
                Seleziona una foto dall&apos;archivio o carica una nuova immagine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs in stile WordPress */}
            <div className="flex rounded-full bg-teal-100/70 p-1 text-xs">
              <button
                type="button"
                onClick={() => setTab("library")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition-all ${
                  tab === "library"
                    ? "bg-white text-teal-950 shadow-sm"
                    : "text-teal-800 hover:text-teal-950"
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5" /> Libreria File ({allMedia.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("upload")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition-all ${
                  tab === "upload"
                    ? "bg-white text-teal-950 shadow-sm"
                    : "text-teal-800 hover:text-teal-950"
                }`}
              >
                <Plus className="h-3.5 w-3.5" /> Carica File
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-charcoal/40 transition-colors hover:bg-teal-50 hover:text-teal-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── BODY ───────────────────────────────────────────────────── */}
        {tab === "upload" ? (
          /* TAB CARICA FILE */
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileDrop(e.dataTransfer.files);
              }}
              className="flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-teal-300 bg-teal-50/40 p-12 text-center transition-colors hover:border-teal-500 hover:bg-teal-50/70"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-100 text-teal-700">
                <UploadCloud className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-teal-950">
                {isUploading ? "Caricamento in corso..." : "Trascina qui la tua foto"}
              </h3>
              <p className="mt-1 text-xs text-charcoal/60">
                oppure clicca per selezionarla dal tuo computer (JPG, PNG, WebP)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileDrop(e.target.files)}
                className="sr-only"
                disabled={isUploading}
              />
              <span className="mt-5 inline-block rounded-full bg-dark-navy px-6 py-2.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-teal-900">
                Sfoglia file
              </span>
            </label>
            {uploadError && <p className="mt-4 text-xs font-medium text-red-500">{uploadError}</p>}
          </div>
        ) : (
          /* TAB LIBRERIA FILE */
          <div className="flex flex-1 overflow-hidden">
            {/* Colonna Principale: Filtri + Griglia */}
            <div className="flex flex-1 flex-col overflow-hidden border-r border-teal-100">
              {/* Barra Filtri & Ricerca */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-100 p-4">
                <div className="relative min-w-[240px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cerca foto per nome o trattamento..."
                    className="w-full rounded-xl border border-teal-200 bg-teal-50/30 py-2 pl-9 pr-3 text-xs outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-dark-navy text-white"
                          : "bg-teal-50 text-teal-800 hover:bg-teal-100"
                      }`}
                    >
                      {cat === "all" ? "Tutte" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Griglia Fotografica stile WordPress */}
              <div className="flex-1 overflow-y-auto p-4">
                {filteredMedia.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center text-center">
                    <ImageIcon className="h-10 w-10 text-charcoal/30" />
                    <p className="mt-2 text-sm text-charcoal/60">Nessuna immagine trovata.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {filteredMedia.map((item) => {
                      const isSelected = selectedItem?.url === item.url;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                            isSelected
                              ? "border-teal-600 ring-4 ring-teal-200/70"
                              : "border-teal-100 hover:border-teal-300 hover:shadow-md"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {isSelected && (
                            <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white shadow-md">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-navy/80 via-dark-navy/40 to-transparent p-2 text-left opacity-0 transition-opacity group-hover:opacity-100">
                            <p className="truncate text-[11px] font-medium text-white">{item.title}</p>
                            <p className="text-[9px] text-teal-100">{item.sizeKb} KB</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Dettagli Immagine Selezionata */}
            <div className="w-80 overflow-y-auto bg-canvas p-5">
              {selectedItem ? (
                <div className="space-y-4">
                  <h3 className="font-serif text-sm font-bold text-teal-950">Dettagli Immagine</h3>
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-inner">
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 rounded-2xl border border-teal-100 bg-white p-3.5 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-charcoal/40">Nome file</span>
                      <p className="font-medium text-teal-950 truncate">{selectedItem.filename}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-charcoal/40">Categoria</span>
                      <p className="font-medium text-teal-950">{selectedItem.category}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-charcoal/40">Peso</span>
                      <p className="font-medium text-teal-950">{selectedItem.sizeKb} KB</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-charcoal/40">Percorso / URL</span>
                      <p className="truncate font-mono text-[10px] text-charcoal/60" title={selectedItem.url}>
                        {selectedItem.url}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelect(selectedItem.url);
                      onClose();
                    }}
                    className="w-full rounded-full bg-dark-navy py-3 text-xs font-semibold text-white shadow-lg transition-all hover:bg-teal-900 active:scale-95"
                  >
                    Usa questa immagine
                  </button>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-xs text-charcoal/40">
                  <ImageIcon className="h-8 w-8 opacity-40" />
                  <p className="mt-2">Seleziona una foto dalla griglia per visualizzarne i dettagli.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
