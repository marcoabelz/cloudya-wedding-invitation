/**
 * Wedding Configuration
 * Edit this file to customize your wedding invitation
 */

export const weddingConfig = {
  // Couple Information
  couple: {
    bride: {
      name: "Cloudya",
      fullName: "Cloudya Diajeng Putri",
      parents: "Putri dari Bapak Achmad Hary Purnomo & Ibu Tini",
      photo: "/images/couple/user1.jpeg",
    },
    groom: {
      name: "Alvin",
      fullName: "Alvin Dwiki Alfarez",
      parents: "Putra dari Bapak Alm. Dedi Rohendi  & Ibu Hernani Nurcahyani",
      photo: "/images/couple/user1.jpeg",
    },
  },

  // Event Details
  events: {
    akad: {
      title: "Akad Nikah",
      date: "2026-05-09", // Format: YYYY-MM-DD
      time: "08:00",
      endTime: "10:00",
      venue: "Rumah Kayu ilir-ilir",
      address:
        "Jl. H. Amsir, Rangkapan Jaya, Kec. Pancoran Mas, Kota Depok, Jawa Barat 16435",
      mapUrl: "https://maps.app.goo.gl/3BpwFTqoqQcD6MJDA",
    },
    resepsi: {
      title: "Resepsi",
      date: "2026-05-09",
      time: "11:00",
      endTime: "14:00",
      venue: "Rumah Kayu ilir-ilir",
      address:
        "Jl. H. Amsir, Rangkapan Jaya, Kec. Pancoran Mas, Kota Depok, Jawa Barat 16435",
      mapUrl: "https://maps.app.goo.gl/3BpwFTqoqQcD6MJDA",
    },
  },

  // Gallery Images (tambahkan foto di sini)
  gallery: [
    { src: "/images/gallery/user.jpeg", alt: "User Photo" },
    { src: "/images/gallery/user1.jpeg", alt: "User Photo" },
    { src: "/images/gallery/user2.jpeg", alt: "User Photo" },
  ] as Array<{
    src: string;
    alt: string;
  }>,

  // Love Story / Timeline (optional)
  story: [
    {
      year: "2020",
      title: "Pertama Bertemu",
      description: "Cerita singkat tentang pertemuan pertama...",
    },
    {
      year: "2022",
      title: "Mulai Berpacaran",
      description: "Cerita singkat tentang awal pacaran...",
    },
    {
      year: "2024",
      title: "Lamaran",
      description: "Cerita singkat tentang lamaran...",
    },
  ],

  // Gift / Rekening (optional)
  gifts: [
    {
      bank: "BCA",
      accountNumber: "1234567890",
      accountName: "Nama Pemilik Rekening",
    },
    {
      bank: "Mandiri",
      accountNumber: "0987654321",
      accountName: "Nama Pemilik Rekening",
    },
  ],

  // Social Media & Contact
  social: {
    instagram: "@coupleinstagram",
    whatsapp: "6281234567890",
  },

  // Theme Configuration
  theme: {
    primaryColor: "rose", // Options: rose, pink, purple, blue, green, amber
    fontDisplay: "playfair", // Display font for headings
    fontBody: "inter", // Body font for text
  },

  // Background Configuration
  // Taruh file video/gambar di folder public/videos/ atau public/images/
  background: {
    videoSrc: "/videos/background.mp4",
    imageSrc: "", // fallback jika video tidak support / kosongkan jika tidak pakai
    overlayClass: "bg-black/30",

    // Background per section
    // imageSrc : isi path gambar (cth: "/images/couple-bg.jpg"), kosongkan jika tidak pakai
    // className: Tailwind class saat tidak ada imageSrc
    //   "bg-white/60 backdrop-blur-sm"    → frosted glass (default)
    //   "bg-white/90"                     → hampir solid putih
    //   "bg-transparent"                  → video/global bg tembus penuh
    //   "bg-rose-100/70 backdrop-blur-sm" → frosted rose
    sections: {
      hero:    { imageSrc: "", className: "bg-transparent" },
      couple:  { imageSrc: "", className: "bg-white/60 backdrop-blur-sm" },
      event:   { imageSrc: "", className: "bg-white/60 backdrop-blur-sm" },
      gallery: { imageSrc: "", className: "bg-white/60 backdrop-blur-sm" },
      gifts:   { imageSrc: "", className: "bg-white/60 backdrop-blur-sm" },
      rsvp:    { imageSrc: "", className: "bg-white/60 backdrop-blur-sm" },
      footer:  { imageSrc: "", className: "bg-white/60 backdrop-blur-sm" },
    },
  },

  // SEO & Meta
  meta: {
    title: "Cloudya & Alvin Wedding Invitation",
    description: "You are cordially invited to our wedding celebration",
    ogImage: "/images/og-image.jpg",
  },
} as const;

// Helper — dipakai di tiap section component
export function getSectionBg(key: keyof typeof weddingConfig.background.sections) {
  const { imageSrc, className } = weddingConfig.background.sections[key] as {
    imageSrc: string;
    className: string;
  };
  if (imageSrc) {
    return {
      className: "",
      style: {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('${imageSrc}')`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      },
    };
  }
  return { className, style: undefined };
}

// Type exports for type safety
export type WeddingConfig = typeof weddingConfig;
export type Event =
  (typeof weddingConfig.events)[keyof typeof weddingConfig.events];
export type GalleryItem = (typeof weddingConfig.gallery)[number];
export type StoryItem = (typeof weddingConfig.story)[number];
export type GiftItem = (typeof weddingConfig.gifts)[number];
