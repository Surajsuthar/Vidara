import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   CONFIGURATION — tweak these to fit your API
   ───────────────────────────────────────────── */
const PAGE_SIZE = 20;
const MAX_PAGES = 8; // remove / replace with real hasMore from API
const SENTINEL_MARGIN = "300px"; // pre-fetch buffer below viewport

/* ─────────────────────────────────────────────
   FAKE DATA — replace generatePage() with your
   real fetch:
     const res = await fetch(`/api/media?page=${page}&limit=${PAGE_SIZE}`)
     const { items, hasMore } = await res.json()
   Each item needs: { id, type, src, poster, width, height, title, author }
   ───────────────────────────────────────────── */
const RATIOS = [
  [400, 600],
  [600, 400],
  [500, 500],
  [400, 700],
  [700, 400],
  [500, 350],
  [350, 500],
  [600, 900],
  [800, 450],
];
const SUBJECTS = [
  "mountains",
  "ocean",
  "city",
  "forest",
  "desert",
  "flowers",
  "architecture",
  "portrait",
  "macro",
  "night",
  "snow",
  "rain",
  "sunset",
  "sunrise",
  "abstract",
];

interface ImageItem {
  id: number;
  type: "image";
  title: string;
  author: string;
  width: number;
  height: number;
  src1x: string;
  src2x?: string;
  poster: string;
  src?: string;
}

interface VideoItem {
  id: number;
  type: "video";
  title: string;
  author: string;
  poster: string;
  width: number;
  height: number;
}

type MediaItem = ImageItem | VideoItem;

function generatePage(page: number): MediaItem[] {
  return Array.from({ length: PAGE_SIZE }, (_, i) => {
    const idx = (page - 1) * PAGE_SIZE + i;
    const [w, h] = RATIOS[idx % RATIOS.length];
    const subject = SUBJECTS[idx % SUBJECTS.length];
    const isVideo = Math.random() < 0.12;
    const seed = idx + 100;

    if (isVideo) {
      return {
        id: idx,
        type: "video",
        title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} #${idx + 1}`,
        author: `lens_${(idx % 12) + 1}`,
        poster: `https://picsum.photos/seed/${seed}/${w}/${h}`,
        width: w,
        height: h,
      } as VideoItem;
    } else {
      return {
        id: idx,
        type: "image",
        src: `https://picsum.photos/seed/${seed}/${w}/${h}`,
        src1x: `https://picsum.photos/seed/${seed}/${Math.round(w / 2)}/${Math.round(h / 2)}`,
        src2x: `https://picsum.photos/seed/${seed}/${w}/${h}`,
        poster: `https://picsum.photos/seed/${seed}/${w}/${h}`,
        width: w,
        height: h,
        title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} #${idx + 1}`,
        author: `lens_${(idx % 12) + 1}`,
      } as ImageItem;
    }
  });
}

/* ─────────────────────────────────────────────
   SHIMMER SKELETON
   ───────────────────────────────────────────── */
function Shimmer() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="h-full w-full animate-shimmer bg-linear-to-r from-white/0 via-white/10 to-white/0 bg-size-[200%_100%]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   IMAGE ITEM
   ───────────────────────────────────────────── */

function ImageCard({ item }: { item: ImageItem }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div
      className="group relative overflow-hidden rounded-none bg-white/5 cursor-pointer
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Aspect-ratio wrapper — CRITICAL: reserves space before image loads → zero CLS */}
      <div
        className="relative w-full overflow-hidden bg-white/4"
        style={{ aspectRatio: `${item.width} / ${item.height}` }}
      >
        <Image
          ref={imgRef}
          src={item.src1x}
          alt={item.title}
          loading="lazy"
          width={item.width}
          height={item.height}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500
                      ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        {!loaded && <Shimmer />}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Caption */}
      {/*<div className="px-3 py-2.5">
        <p className="text-[11px] text-white/40 mt-0.5">@{item.author}</p>
      </div>*/}
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIDEO ITEM
   ───────────────────────────────────────────── */

function VideoCard({ item }: { item: VideoItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // Lazy-load src on first hover
    if (!v.src && item.poster) {
      v.src = item.poster; // Use poster as video src fallback; replace with real .mp4
    }
    v.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  }, [item]);

  const handleMouseLeave = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  }, []);

  return (
    <div
      className="group relative overflow-hidden rounded-none bg-white/5 cursor-pointer
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 border-none bg-transparent p-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      type="button"
    >
      <div
        className="relative w-full overflow-hidden bg-white/4"
        style={{ aspectRatio: `${item.width} / ${item.height}` }}
      >
        <video
          ref={videoRef}
          poster={item.poster}
          preload="none"
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Video badge */}
        {/*<div
          className="absolute top-2 left-2 z-10 flex items-center gap-1
                        bg-black/70 backdrop-blur-sm rounded px-2 py-0.5"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200
                           ${playing ? "bg-red-400 animate-pulse" : "bg-white/60"}`}
          />
          <span className="text-[9px] font-bold tracking-widest text-white/90 uppercase">
            {playing ? "Live" : "Video"}
          </span>
        </div>*/}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* <div className="px-3 py-2.5">
        <p className="text-[11px] text-white/40 mt-0.5">@{item.author}</p>
      </div> */}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MASONRY CARD — routes to Image or Video
   ───────────────────────────────────────────── */

function MasonryCard({ item }: { item: MediaItem }) {
  return item.type === "video" ? (
    <VideoCard item={item as VideoItem} />
  ) : (
    <ImageCard item={item as ImageItem} />
  );
}

/* ─────────────────────────────────────────────
   LOADING DOTS
   ───────────────────────────────────────────── */
function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5 py-10">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN GALLERY COMPONENT
   ───────────────────────────────────────────── */
export default function MasonryGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* ── Fetch / generate next page ── */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      // Simulate network delay — remove for real API
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));

      /* REPLACE with real API call:
         const res = await fetch(`/api/media?page=${page}&limit=${PAGE_SIZE}`)
         const data = await res.json()
         setItems(prev => [...prev, ...data.items])
         setHasMore(data.hasMore)
      */
      const newItems = generatePage(page);
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(page < MAX_PAGES);
      setPage((p) => p + 1);
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  /* ── IntersectionObserver watching the sentinel ── */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: `0px 0px ${SENTINEL_MARGIN} 0px`, threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]); // re-attach when loadMore changes (page/loading state)

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      <main className="mx-auto max-w-screen-2xl">
        <div
          className="
            columns-2
            sm:columns-3
            md:columns-3
            lg:columns-4
            xl:columns-5
            2xl:columns-6
            gap-3
          "
        >
          {items.map((item) => (
            <div key={item.id.toString()} className="mb-3 break-inside-avoid">
              <MasonryCard item={item} />
            </div>
          ))}
        </div>

        {/* ── Infinite scroll sentinel ── */}
        <div ref={sentinelRef} className="h-4" />

        {/* ── Loading indicator ── */}
        {loading && <LoadingDots />}

        {/* ── End of feed ── */}
        {!hasMore && !loading && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 text-white/20 text-sm tracking-widest uppercase">
              <span className="block w-8 h-px bg-white/20" />
              end of feed
              <span className="block w-8 h-px bg-white/20" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/*
══════════════════════════════════════════════════════════════
  REAL API INTEGRATION — swap generatePage() with this:
══════════════════════════════════════════════════════════════

  const res  = await fetch(`/api/media?page=${page}&limit=${PAGE_SIZE}`);
  const data = await res.json();
  // data.items  → array of media objects (must include width + height)
  // data.hasMore → boolean

*/
