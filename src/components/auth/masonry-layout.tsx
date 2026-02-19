"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

type media = "image" | "video";

export default function MasonryInfiniteGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Simulate fetching images (replace with real API call)
  const fetchImages = useCallback(
    async (currentPage: number) => {
      if (isLoading || !hasMore) return;

      setIsLoading(true);
      await new Promise((resolve) =>
        setTimeout(resolve, 900 + Math.random() * 600),
      );

      const perPage = 32;
      const newImages: ImageItem[] = Array.from({ length: perPage }, (_, i) => {
        const index = (currentPage - 1) * perPage + i + 1;
        // Using picsum for random images with varied aspect ratios
        const heightVariation = 400 + (index % 7) * 80; // 400–880px height simulation
        return {
          id: index,
          src: `https://picsum.photos/seed/img${index}/600/${heightVariation}`,
          alt: `Random artwork ${index}`,
        };
      });

      if (newImages.length < perPage) {
        setHasMore(false);
      }

      setImages((prev) => [...prev, ...newImages]);
      setPage(currentPage + 1);
      setIsLoading(false);
    },
    [isLoading, hasMore],
  );

  // Intersection Observer for infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchImages(page);
        }
      },
      { rootMargin: "200px" }, // load earlier for smoother UX
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observerRef.current.observe(currentLoader);

    return () => {
      if (observerRef.current && currentLoader) {
        observerRef.current.unobserve(currentLoader);
      }
    };
  }, [fetchImages, page, hasMore, isLoading]);

  // Load very first page
  // biome-ignore lint: lint/correctness/useExhaustiveDependencies
  useEffect(() => {
    if (images.length === 0) {
      fetchImages(1);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen">
      <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-7 2xl:columns-9">
        {images.map((image) => (
          <div key={image.id} className="mb-4 break-inside-avoid">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg shadow-black/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60">
              <Image
                height={1200}
                width={600}
                src={image.src}
                alt={image.alt}
                className="
                    h-auto w-full rounded-2xl object-cover 
                    transition-transform duration-500 
                    group-hover:scale-105
                  "
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
