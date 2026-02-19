"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import { weddingConfig } from "@/lib/config";

interface InvitationWrapperProps {
  guestName: string;
  children: React.ReactNode;
}

export function InvitationWrapper({
  guestName,
  children,
}: InvitationWrapperProps) {
  const [isOpened, setIsOpened] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { couple, events, background } = weddingConfig;

  // Lock scroll when cover is showing
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpened]);

  const weddingDate = new Date(`${events.akad.date}T${events.akad.time}`);
  const formattedDate = weddingDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Full-page background — config di src/lib/config.ts */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {background.videoSrc && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={background.videoSrc} type="video/mp4" />
          </video>
        )}
        {!background.videoSrc && background.imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={background.imageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className={`absolute inset-0 ${background.overlayClass}`} />
      </div>

      {/* Cover / Envelope */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-rose-50 via-white to-rose-50"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat bg-center" />
            </div>

            <div className="relative z-10 flex flex-col items-center px-6 text-center">
              {/* Envelope Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="flex size-20 items-center justify-center rounded-full bg-rose-100">
                  <Mail className="size-10 text-rose-400" />
                </div>
              </motion.div>

              {/* Wedding Title */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-3 text-sm uppercase tracking-[0.3em] text-rose-400"
              >
                The Wedding of
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="font-playfair text-4xl text-foreground md:text-6xl"
              >
                {couple.groom.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="my-2 font-playfair text-2xl text-rose-400 md:text-3xl"
              >
                &
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="font-playfair text-4xl text-foreground md:text-6xl"
              >
                {couple.bride.name}
              </motion.h1>

              {/* Date */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6 text-sm text-muted-foreground"
              >
                {formattedDate}
              </motion.p>

              {/* Guest Name Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-8 w-full max-w-sm rounded-2xl border border-rose-100 bg-white/60 px-10 py-6 backdrop-blur-sm md:px-12"
              >
                <p className="text-xs text-muted-foreground">Kepada Yth.</p>
                <p className="mt-1 font-playfair text-xl text-foreground md:text-2xl">
                  {guestName}
                </p>
              </motion.div>

              {/* Open Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mt-8 w-full sm:w-auto"
              >
                <motion.button
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
                  onClick={() => {
                    videoRef.current?.play();
                    setIsOpened(true);
                  }}
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-rose-500 py-5 text-base font-medium text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-200 active:scale-95 sm:w-auto sm:px-16"
                >
                  <Mail className="size-4 transition-transform group-hover:-rotate-6" />
                  Buka Undangan
                </motion.button>
              </motion.div>

              {/* Subtle hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mt-4 text-xs text-muted-foreground/60"
              >
                Tap untuk membuka undangan
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invitation Content (always rendered, revealed after cover dismissed) */}
      {children}
    </>
  );
}
