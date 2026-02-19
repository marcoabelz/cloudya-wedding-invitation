"use client";

import Image from "next/image";
import { weddingConfig } from "@/lib/config";
import { FadeIn } from "@/components/animations/fade-in";

export function CoupleSection() {
  const { couple } = weddingConfig;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-2">
            Bismillahirrahmanirrahim
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair text-foreground mb-6">
            Assalamualaikum Wr. Wb.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
            menyelenggarakan pernikahan kami:
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 md:gap-8">
          {/* Groom */}
          <FadeIn delay={0.2} className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-200 to-rose-300" />
              <div className="absolute inset-2 rounded-full bg-white overflow-hidden">
                <Image
                  src={couple.groom.photo}
                  alt={couple.groom.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 192px"
                />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-playfair text-foreground mb-2">
              {couple.groom.fullName}
            </h3>
            <p className="text-muted-foreground">{couple.groom.parents}</p>
          </FadeIn>

          {/* Bride */}
          <FadeIn delay={0.4} className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-200 to-rose-300" />
              <div className="absolute inset-2 rounded-full bg-white overflow-hidden">
                <Image
                  src={couple.bride.photo}
                  alt={couple.bride.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 192px"
                />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-playfair text-foreground mb-2">
              {couple.bride.fullName}
            </h3>
            <p className="text-muted-foreground">{couple.bride.parents}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
