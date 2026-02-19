"use client";

import { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";
import { weddingConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";

export function GiftsSection() {
  const gifts = [...weddingConfig.gifts];

  if (gifts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <FadeIn className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-playfair text-foreground mb-4">
            Amplop Digital
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika Anda ingin memberikan tanda kasih, kami menyediakan amplop digital.
          </p>
        </FadeIn>

        <div className="space-y-4">
          {gifts.map((gift, index) => (
            <FadeIn key={index} delay={0.1 * (index + 1)}>
              <GiftCard gift={gift} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

interface GiftCardProps {
  gift: {
    bank: string;
    accountNumber: string;
    accountName: string;
  };
}

function GiftCard({ gift }: GiftCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gift.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-rose-50 to-white rounded-2xl p-6 border border-rose-100">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-rose-500 mb-1">{gift.bank}</p>
          <p className="text-2xl font-mono font-semibold text-foreground tracking-wider">
            {gift.accountNumber}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            a.n. {gift.accountName}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="border-rose-200 hover:bg-rose-50 flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1 text-green-500" />
              Tersalin
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Salin
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
