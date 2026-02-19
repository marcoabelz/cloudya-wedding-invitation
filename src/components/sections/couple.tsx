"use client";

import Image from "next/image";
import { weddingConfig, getSectionBg } from "@/lib/config";
import { FadeIn } from "@/components/animations/fade-in";

export function CoupleSection() {
  const { couple } = weddingConfig;
  const bg = getSectionBg("couple");

  return (
    <section className={`py-20 px-6 ${bg.className}`} style={bg.style}>
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

        <div className="flex flex-col gap-16">
          {/* Groom — text kiri, foto kanan */}
          <FadeIn delay={0.2}>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-right order-2 md:order-1">
                <h3 className="text-2xl md:text-3xl font-playfair text-foreground mb-2">
                  {couple.groom.fullName}
                </h3>
                <p className="text-muted-foreground">{couple.groom.parents}</p>
              </div>
              <div className="relative w-56 h-56 flex-shrink-0 order-1 md:order-2 overflow-hidden rounded-xl">
                <Image
                  src={couple.groom.photo}
                  alt={couple.groom.name}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              </div>
            </div>
          </FadeIn>

          {/* Bride — foto kiri, text kanan */}
          <FadeIn delay={0.4}>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="relative w-56 h-56 flex-shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={couple.bride.photo}
                  alt={couple.bride.name}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-playfair text-foreground mb-2">
                  {couple.bride.fullName}
                </h3>
                <p className="text-muted-foreground">{couple.bride.parents}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
