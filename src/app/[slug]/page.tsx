import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuestBySlug, getMessages } from "@/lib/supabase/queries";
import { weddingConfig } from "@/lib/config";

import { InvitationWrapper } from "@/components/invitation-wrapper";
import { AudioPlayer } from "@/components/audio-player";
import { HeroSection } from "@/components/sections/hero";
import { CoupleSection } from "@/components/sections/couple";
import { EventSection } from "@/components/sections/event";
import { GallerySection } from "@/components/sections/gallery";
import { GiftsSection } from "@/components/sections/gifts";
import { RsvpSection } from "@/components/sections/rsvp";
import { FooterSection } from "@/components/sections/footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    return {
      title: "Undangan Tidak Ditemukan",
    };
  }

  const { couple, meta } = weddingConfig;

  return {
    title: `Undangan Pernikahan ${couple.groom.name} & ${couple.bride.name}`,
    description: `Dear ${guest.name}, ${meta.description}`,
    openGraph: {
      title: `Undangan Pernikahan ${couple.groom.name} & ${couple.bride.name}`,
      description: `Dear ${guest.name}, Anda diundang ke pernikahan kami`,
      type: "website",
      images: [meta.ogImage],
    },
  };
}

export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <InvitationWrapper guestName={guest.name}>
      <main className="relative">
        <AudioPlayer />
        <HeroSection guestName={guest.name} />
        <CoupleSection />
        <EventSection />
        <GallerySection />
        <GiftsSection />
        <RsvpSection guestName={guest.name} initialMessages={messages} />
        <FooterSection />
      </main>
    </InvitationWrapper>
  );
}
