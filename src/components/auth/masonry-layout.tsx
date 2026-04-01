"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { MasonryImageItem } from "@/lib/masonry-backgrounds";

interface MasonryLayoutProps {
  images?: MasonryImageItem[];
  columnCount?: number;
  mobileColumnCount?: number;
  gap?: number;
  speed?: number;
  className?: string;
  columnClassName?: string;
  imageClassName?: string;
  priorityCount?: number;
  overlay?: React.ReactNode;
  imageSizes?: string;
  fadeEdges?: boolean;
  pauseOnHover?: boolean;
}

const DEFAULT_COLUMN_COUNT = 4;
const DEFAULT_MOBILE_COLUMN_COUNT = 2;
const DEFAULT_GAP = 1;
const DEFAULT_SPEED = 28;
const DEFAULT_PRIORITY_COUNT = 8;

function splitIntoColumns<T>(items: T[], columnCount: number) {
  const normalizedCount = Math.max(1, columnCount);
  const columns = Array.from({ length: normalizedCount }, () => [] as T[]);

  items.forEach((item, index) => {
    columns[index % normalizedCount].push(item);
  });

  return columns;
}

function getEstimatedHeight(
  image: MasonryImageItem,
  imageIndex: number,
  columnIndex: number,
) {
  if (image.width && image.height) {
    return Math.round((image.height / image.width) * 320);
  }

  return 420 + ((imageIndex + columnIndex) % 5) * 80;
}

export default function MasonryLayout({
  images = [],
  columnCount = DEFAULT_COLUMN_COUNT,
  mobileColumnCount = DEFAULT_MOBILE_COLUMN_COUNT,
  gap = DEFAULT_GAP,
  speed = DEFAULT_SPEED,
  className,
  columnClassName,
  imageClassName,
  priorityCount = DEFAULT_PRIORITY_COUNT,
  overlay,
  imageSizes = "(max-width: 768px) 50vw, 25vw",
  fadeEdges = true,
  pauseOnHover = false,
}: MasonryLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const animationIdRef = useRef(
    `masonry-scroll-${Math.random().toString(36).slice(2, 10)}`,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const desktopColumns = useMemo(
    () => splitIntoColumns(images, Math.max(1, columnCount)),
    [images, columnCount],
  );

  const mobileColumns = useMemo(
    () => splitIntoColumns(images, Math.max(1, mobileColumnCount)),
    [images, mobileColumnCount],
  );

  const renderColumns = (
    columns: MasonryImageItem[][],
    sizes: string,
    variant: "mobile" | "desktop",
  ) =>
    columns.map((column, columnIndex) => {
      const duplicatedColumn = [...column, ...column];
      const columnDuration =
        speed + (columnIndex % 2 === 0 ? columnIndex * 2 : columnIndex * 3);

      return (
        <div
          key={`${variant}-column-${columnIndex}`}
          className={cn("relative overflow-hidden", columnClassName)}
        >
          <div
            className={cn("masonry-track flex flex-col", {
              "group-hover:[animation-play-state:paused]": pauseOnHover,
            })}
            style={{
              gap: "var(--masonry-gap)",
              animation: mounted
                ? `${animationIdRef.current} ${columnDuration}s linear infinite`
                : "none",
              willChange: "transform",
            }}
          >
            {duplicatedColumn.map((image, imageIndex) => {
              const shouldPrioritize = imageIndex < priorityCount;
              const estimatedHeight = getEstimatedHeight(
                image,
                imageIndex,
                columnIndex,
              );

              return (
                <div
                  key={`${variant}-${image.id}-${imageIndex}`}
                  className="relative w-full overflow-hidden rounded-3xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt || "Masonry image"}
                    width={image.width || 900}
                    height={image.height || 1400}
                    priority={shouldPrioritize}
                    loading={shouldPrioritize ? "eager" : "lazy"}
                    sizes={sizes}
                    className={cn(
                      "block h-auto w-full object-cover",
                      imageClassName,
                    )}
                    style={{
                      minHeight: estimatedHeight,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    });

  if (images.length === 0) {
    return (
      <div
        className={cn("relative w-full overflow-hidden", className)}
        style={
          {
            "--masonry-gap": `${gap}px`,
            "--masonry-speed": `${speed}s`,
          } as React.CSSProperties
        }
      >
        <div className="pointer-events-none absolute inset-0 z-10">
          {overlay}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("group relative w-full overflow-hidden", className)}
      style={
        {
          "--masonry-gap": `${gap}px`,
          "--masonry-speed": `${speed}s`,
        } as React.CSSProperties
      }
    >
      <style>
        {`
          @keyframes ${animationIdRef.current} {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(0, calc(-50% - (var(--masonry-gap) / 2)), 0);
            }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 z-10">{overlay}</div>

      <div
        className="grid w-full md:hidden"
        style={{
          gap: "var(--masonry-gap)",
          gridTemplateColumns: `repeat(${Math.max(1, mobileColumnCount)}, minmax(0, 1fr))`,
        }}
      >
        {renderColumns(
          mobileColumns,
          "(max-width: 768px) 50vw, 100vw",
          "mobile",
        )}
      </div>

      <div
        className="hidden w-full md:grid"
        style={{
          gap: "var(--masonry-gap)",
          gridTemplateColumns: `repeat(${Math.max(1, columnCount)}, minmax(0, 1fr))`,
        }}
      >
        {renderColumns(desktopColumns, imageSizes, "desktop")}
      </div>

      {fadeEdges && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-linear-to-b from-black/30 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-linear-to-t from-black/30 to-transparent" />
        </>
      )}
    </div>
  );
}
