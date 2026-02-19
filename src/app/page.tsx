import Link from "next/link";
import { weddingConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { couple } = weddingConfig;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-50">
      <div className="text-center space-y-6 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-400">
          The Wedding of
        </p>
        <h1 className="text-5xl md:text-7xl font-playfair text-foreground">
          {couple.groom.name}
          <span className="block text-3xl md:text-4xl text-rose-400 my-2">&</span>
          {couple.bride.name}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Kami mengundang Anda untuk merayakan hari bahagia kami
        </p>

        <div className="pt-6">
          <Link href="/tamu-undangan">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
              Buka Undangan
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground pt-8">
          Silakan buka link undangan yang telah dikirimkan kepada Anda
        </p>
      </div>
    </div>
  );
}
