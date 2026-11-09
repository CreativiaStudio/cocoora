"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ExternalLink, Heart, Instagram, MessageCircle } from "lucide-react";
import { ButtonLink, Container } from "../ui";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { SITE, INSTAGRAM_POSTS } from "@/lib/site";
import type { InstagramPost } from "@/lib/types";

export function InstagramFeedSection() {
  const [posts, setPosts] = useState<InstagramPost[]>(INSTAGRAM_POSTS.slice(0, 6));
  const [isLive, setIsLive] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFeed() {
      try {
        const res = await fetch("/api/instagram/feed");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && Array.isArray(data.posts) && data.posts.length > 0) {
            setPosts(data.posts.slice(0, 6));
            if (data.source === "meta_graph_api" || data.source === "feed_bridge") {
              setIsLive(true);
            }
          }
        }
      } catch (err) {
        // Fallback tranquillo sui post statici di alta qualità
        console.warn("Instagram feed fallback:", err);
      }
    }

    loadFeed();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-canvas pb-24 pt-8 sm:pb-28">
      <Container>
        <Reveal className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1c4a5c] text-white shadow-sm transition-transform duration-300 hover:scale-105 hover:bg-[#00344b]"
              aria-label="Profilo Instagram @cocoora_official"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-2xl font-semibold tracking-[-0.02em] text-[#00344b] transition-colors hover:text-[#1c4a5c]"
                >
                  @cocoora_official
                </a>
                {isLive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                )}
              </div>
              <p className="text-sm text-charcoal/65">Connessi alla tua salute, ogni giorno.</p>
            </div>
          </div>
          <ButtonLink href={SITE.instagram} target="_blank" rel="noopener noreferrer" variant="secondary">
            Seguici su Instagram <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </Reveal>

        <RevealStagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post) => (
            <RevealItem key={post.id}>
                <a
                  href={post.permalink || SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-2xl border border-[#80a1b2]/20 bg-[#002231]/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <Image
                    src={post.image}
                    alt={post.caption || "Post Instagram Cocoora Studio Medico"}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={post.image.startsWith("http")}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#002231]/85 via-[#002231]/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c5dbe3]">
                        {post.tag || "Instagram"}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-white/80" />
                    </div>
                    {post.caption && (
                      <p className="mt-1 line-clamp-2 text-[11px] text-white/90 leading-tight">
                        {post.caption}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-white">
                      {typeof post.likes === "number" && (
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3 fill-white/80 text-white/80" /> {post.likes}
                        </span>
                      )}
                      {typeof post.comments === "number" && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 fill-white/80 text-white/80" /> {post.comments}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </RevealItem>
            ))}
          </RevealStagger>
      </Container>
    </section>
  );
}
