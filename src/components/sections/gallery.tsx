"use client";

import Image from "next/image";
import { weddingConfig } from "@/lib/config";
import { FadeIn } from "@/components/animations/fade-in";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/stagger-children";

export function GallerySection() {
  const { gallery } = weddingConfig;

  // Only show if there are gallery images
  if (gallery.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-2">
            Our Moments
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair text-foreground">
            Galeri Foto
          </h2>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((image, index) => (
            <StaggerItem key={index}>
              <div className="relative aspect-square rounded-xl overflow-hidden group">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
