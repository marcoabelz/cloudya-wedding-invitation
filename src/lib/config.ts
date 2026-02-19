/**
 * Wedding Configuration
 * Edit this file to customize your wedding invitation
 */

export const weddingConfig = {
  // Couple Information
  couple: {
    bride: {
      name: "Cloudya",
      fullName: "Cloudya Nama Lengkap",
      parents: "Putri dari Bapak ... & Ibu ...",
      photo: "/images/couple/bride.svg",
    },
    groom: {
      name: "Alvin",
      fullName: "Alvin Nama Lengkap",
      parents: "Putra dari Bapak ... & Ibu ...",
      photo: "/images/couple/groom.svg",
    },
  },

  // Event Details
  events: {
    akad: {
      title: "Akad Nikah",
      date: "2026-03-15", // Format: YYYY-MM-DD
      time: "08:00",
      endTime: "10:00",
      venue: "Masjid Agung",
      address: "Jl. Contoh No. 123, Jakarta",
      mapUrl: "https://maps.google.com/?q=-6.2088,106.8456",
    },
    resepsi: {
      title: "Resepsi",
      date: "2026-03-15",
      time: "11:00",
      endTime: "14:00",
      venue: "Ballroom Hotel Grand",
      address: "Jl. Contoh No. 456, Jakarta",
      mapUrl: "https://maps.google.com/?q=-6.2088,106.8456",
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

  // SEO & Meta
  meta: {
    title: "Cloudya & Alvin Wedding Invitation",
    description: "You are cordially invited to our wedding celebration",
    ogImage: "/images/og-image.jpg",
  },
} as const;

// Type exports for type safety
export type WeddingConfig = typeof weddingConfig;
export type Event =
  (typeof weddingConfig.events)[keyof typeof weddingConfig.events];
export type GalleryItem = (typeof weddingConfig.gallery)[number];
export type StoryItem = (typeof weddingConfig.story)[number];
export type GiftItem = (typeof weddingConfig.gifts)[number];
