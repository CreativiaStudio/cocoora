"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { cmsStore } from "@/lib/cms-store";
import { useCms } from "../providers";
import type { VideoItem } from "@/lib/types";
import { Button } from "../ui";

type VideoForm = Omit<VideoItem, "id">;

const EMPTY: VideoForm = {
  type: "instagram",
  url: "",
  title: "",
  caption: "",
  ctaLabel: "",
  ctaLink: "",
  visible: true,
};

export function VideosManager() {
  const { videos } = useCms();
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [form, setForm] = useState<VideoForm>(EMPTY);

  const startAdd = () => {
    setForm(EMPTY);
    setEditing(null);
  };

  const startEdit = (v: VideoItem) => {
    setEditing(v);
    setForm({
      type: v.type,
      url: v.url,
      title: v.title,
      caption: v.caption,
      ctaLabel: v.ctaLabel ?? "",
      ctaLink: v.ctaLink ?? "",
      visible: v.visible,
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      cmsStore.updateVideo(editing.id, form);
    } else {
      cmsStore.addVideo(form);
    }
    startAdd();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)]">
        <div className="flex items-center justify-between border-b border-teal-100 px-6 py-4">
          <h2 className="font-serif text-xl font-semibold text-teal-900">Video Verticali (9:16)</h2>
          <Button size="sm" onClick={startAdd}>
            <Plus className="h-4 w-4" /> Nuovo
          </Button>
        </div>

        {videos.length === 0 ? (
          <p className="p-8 text-sm text-charcoal/60">Nessun video. Aggiungi il primo reel o video MP4.</p>
        ) : (
          <div className="divide-y divide-teal-50">
            {videos.map((v) => (
              <div key={v.id} className="flex items-center gap-4 px-6 py-4">
                <div className="h-14 w-9 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-teal-700 to-dark-navy" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-teal-900">{v.title || "Senza titolo"}</p>
                  <p className="truncate text-xs text-charcoal/55">
                    {v.type === "instagram" ? "Instagram Reel" : "Video MP4"}
                    {v.url ? ` · ${v.url}` : " · nessun link"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => cmsStore.updateVideo(v.id, { visible: !v.visible })}
                  title={v.visible ? "Nascondi" : "Mostra"}
                  className={v.visible ? "text-teal-600" : "text-charcoal/30"}
                >
                  {v.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(v)}
                  className="text-charcoal/50 transition-colors hover:text-teal-700"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => cmsStore.deleteVideo(v.id)}
                  className="text-charcoal/50 transition-colors hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="h-fit rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-teal-900">
            {editing ? "Modifica video" : "Aggiungi video"}
          </h3>
          {editing && (
            <button type="button" onClick={startAdd} className="text-charcoal/40 hover:text-charcoal">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "instagram" })}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                form.type === "instagram" ? "border-teal-600 bg-teal-50 text-teal-800" : "border-teal-100 text-charcoal/60"
              }`}
            >
              Instagram / Reels
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "mp4" })}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                form.type === "mp4" ? "border-teal-600 bg-teal-50 text-teal-800" : "border-teal-100 text-charcoal/60"
              }`}
            >
              Video MP4
            </button>
          </div>

          <Field label="Link video" value={form.url} onChange={(url) => setForm({ ...form, url })} placeholder="https://..." />
          <Field label="Titolo" value={form.title} onChange={(title) => setForm({ ...form, title })} />
          <Field label="Caption" value={form.caption} onChange={(caption) => setForm({ ...form, caption })} />
          <Field label="Testo bottone CTA (opzionale)" value={form.ctaLabel ?? ""} onChange={(ctaLabel) => setForm({ ...form, ctaLabel })} />
          <Field label="Link bottone CTA (opzionale)" value={form.ctaLink ?? ""} onChange={(ctaLink) => setForm({ ...form, ctaLink })} placeholder="/servizi/..." />

          <label className="flex items-center gap-3 rounded-xl border border-teal-100 p-3">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              className="h-4 w-4 accent-teal-700"
            />
            <span className="text-sm font-medium text-teal-900">Visibile sul sito</span>
          </label>

          <Button type="submit" className="w-full">
            {editing ? "Salva modifiche" : "Aggiungi video"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-teal-900">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-teal-200 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-charcoal/40 focus:border-teal-600"
      />
    </label>
  );
}
