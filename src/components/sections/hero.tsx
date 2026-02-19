"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { weddingConfig, getSectionBg } from "@/lib/config";
import { useCountdown } from "@/hooks/use-countdown";

interface HeroSectionProps {
  guestName: string;
}

export function HeroSection({ guestName }: HeroSectionProps) {
  const { couple, events } = weddingConfig;
  const bg = getSectionBg("hero");
  const weddingDate = new Date(`${events.akad.date}T${events.akad.time}`);
  const countdown = useCountdown(weddingDate);

  return (
    <section className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${bg.className}`} style={bg.style}>

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-4"
        >
          The Wedding of
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-playfair text-foreground mb-2"
        >
          {couple.groom.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-3xl md:text-4xl font-playfair text-rose-400 my-4"
        >
          &
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-playfair text-foreground mb-8"
        >
          {couple.bride.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-rose-100 inline-block"
        >
          <p className="text-muted-foreground mb-2">Kepada Yth.</p>
          <p className="text-xl md:text-2xl font-playfair text-foreground">
            {guestName}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Anda diundang ke pernikahan kami
          </p>
        </motion.div>

        {/* Countdown - only render when ready to avoid hydration mismatch */}
        {countdown.isReady && !countdown.isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-12"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Menghitung hari menuju hari bahagia
            </p>
            <div className="flex justify-center gap-4 md:gap-6">
              <CountdownBox value={countdown.days} label="Hari" />
              <CountdownBox value={countdown.hours} label="Jam" />
              <CountdownBox value={countdown.minutes} label="Menit" />
              <CountdownBox value={countdown.seconds} label="Detik" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-rose-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl shadow-sm border border-rose-100 flex items-center justify-center">
        <span className="text-2xl md:text-3xl font-playfair text-foreground">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-2">{label}</span>
    </div>
  );
}
