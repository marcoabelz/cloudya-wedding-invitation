"use client";

import { Heart, Instagram } from "lucide-react";
import { weddingConfig, getSectionBg } from "@/lib/config";
import { FadeIn } from "@/components/animations/fade-in";

export function FooterSection() {
  const { couple, social } = weddingConfig;
  const bg = getSectionBg("footer");

  return (
    <section className={`py-16 px-6 ${bg.className}`} style={bg.style}>
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-xl mx-auto">
            Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila
            Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada
            kami.
          </p>

          <p className="text-lg font-playfair text-foreground mb-2">
            Atas kehadiran dan doa restunya, kami ucapkan terima kasih.
          </p>

          <p className="text-muted-foreground mb-8">
            Wassalamualaikum Wr. Wb.
          </p>

          <div className="flex items-center justify-center gap-2 text-rose-400 mb-8">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-playfair text-xl">
              {couple.groom.name} & {couple.bride.name}
            </span>
            <Heart className="w-5 h-5 fill-current" />
          </div>

          {social.instagram && (
            <a
              href={`https://instagram.com/${social.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-rose-500 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span>{social.instagram}</span>
            </a>
          )}
        </FadeIn>

        <div className="border-t border-rose-200 mt-12 pt-8">
          <p className="text-xs text-muted-foreground">
            Made with{" "}
            <Heart className="w-3 h-3 inline-block text-rose-400 fill-current" />{" "}
            by Cloudya Wedding
          </p>
        </div>
      </div>
    </section>
  );
}
