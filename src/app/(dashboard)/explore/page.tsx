"use client";

import MasonryGallery from "@/components/masonry-layout";

export default function Home() {
  return (
    <section className="overflow-hidden border border-white/10 bg-[#101010]">
      <div className="border-b border-white/10 px-4 py-8 sm:px-6">
        <p className="text-sm font-medium uppercase text-[#7dd3fc]">Explore</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-normal">
          Visual references for images and short-form concepts.
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-white/58">
          Browse a dark studio feed of image and video-style compositions before
          creating your next generation.
        </p>
      </div>
      <MasonryGallery />
    </section>
  );
}
