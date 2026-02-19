"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { weddingConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";

export function EventSection() {
  const { events } = weddingConfig;

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-2">
            Save The Date
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair text-foreground">
            Waktu & Tempat
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Akad */}
          <FadeIn delay={0.2}>
            <EventCard event={events.akad} />
          </FadeIn>

          {/* Resepsi */}
          <FadeIn delay={0.4}>
            <EventCard event={events.resepsi} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

interface EventCardProps {
  event: {
    title: string;
    date: string;
    time: string;
    endTime: string;
    venue: string;
    address: string;
    mapUrl: string;
  };
}

function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "EEEE, d MMMM yyyy", { locale: id });

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-rose-100">
      <h3 className="text-xl font-playfair text-foreground mb-6 text-center">
        {event.title}
      </h3>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-rose-400" />
          </div>
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-rose-400" />
          </div>
          <span>
            {event.time} - {event.endTime} WIB
          </span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">{event.venue}</p>
            <p className="text-sm">{event.address}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <a href={event.mapUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="border-rose-200 hover:bg-rose-50">
            <MapPin className="w-4 h-4 mr-2" />
            Lihat Lokasi
          </Button>
        </a>
      </div>
    </div>
  );
}
