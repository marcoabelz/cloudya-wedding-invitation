import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-50">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold font-playfair text-rose-400">404</h1>
        <h2 className="text-2xl font-playfair text-foreground">
          Undangan Tidak Ditemukan
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Maaf, undangan yang Anda cari tidak tersedia. Pastikan link undangan yang Anda terima sudah benar.
        </p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
