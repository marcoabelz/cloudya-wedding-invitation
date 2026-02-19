"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Send,
  User,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FadeIn } from "@/components/animations/fade-in";
import { useMessages } from "@/hooks/use-messages";
import { weddingConfig, getSectionBg } from "@/lib/config";
import type { Message, AttendanceStatus } from "@/types";

const messageSchema = z.object({
  guestName: z.string().min(2, "Nama minimal 2 karakter"),
  message: z.string().min(5, "Ucapan minimal 5 karakter"),
  attendance: z.enum(["hadir", "tidak_hadir", "masih_ragu"]),
});

type MessageFormValues = z.infer<typeof messageSchema>;

interface RsvpSectionProps {
  guestName: string;
  initialMessages: Message[];
}

export function RsvpSection({ guestName, initialMessages }: RsvpSectionProps) {
  const { messages, submitMessage, isPending, error } = useMessages({
    initialMessages,
  });

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      guestName: guestName,
      message: "",
      attendance: "masih_ragu",
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    await submitMessage({
      guest_name: data.guestName,
      message: data.message,
      attendance: data.attendance,
    });
    form.reset({ ...form.getValues(), message: "" });
  };

  const bg = getSectionBg("rsvp");

  return (
    <section className={`py-20 px-6 ${bg.className}`} style={bg.style}>
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-2">
            RSVP
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair text-foreground mb-4">
            Konfirmasi Kehadiran
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
            hadir dan memberikan doa restu
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-rose-100 lg:h-[600px] flex flex-col">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-1 flex-col space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="guestName">Nama</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="guestName"
                      placeholder="Nama Anda"
                      className="pl-10"
                      {...form.register("guestName")}
                    />
                  </div>
                  {form.formState.errors.guestName && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.guestName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendance">Konfirmasi Kehadiran</Label>
                  <Select
                    value={form.watch("attendance")}
                    onValueChange={(value: AttendanceStatus) =>
                      form.setValue("attendance", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kehadiran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hadir">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Ya, saya akan hadir
                        </span>
                      </SelectItem>
                      <SelectItem value="tidak_hadir">
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-red-500" />
                          Maaf, saya tidak bisa hadir
                        </span>
                      </SelectItem>
                      <SelectItem value="masih_ragu">
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-yellow-500" />
                          Masih ragu
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-1 flex-col space-y-2">
                  <Label htmlFor="message">Ucapan & Doa</Label>
                  <div className="relative flex-1 ">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="message"
                      placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                      className="pl-10 resize-none"
                      style={{ minHeight: "200px" }}
                      {...form.register("message")}
                    />
                  </div>
                  {form.formState.errors.message && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-rose-500 hover:bg-rose-600"
                >
                  {isPending ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Ucapan
                    </>
                  )}
                </Button>
              </form>
            </div>
          </FadeIn>

          {/* Messages List */}
          <FadeIn delay={0.4}>
            <div>
              <h3 className="text-lg font-playfair text-foreground mb-4">
                Ucapan ({messages.length})
              </h3>
              <div className="relative">
                <div
                  className="space-y-4 overflow-y-auto pr-1"
                  style={{ maxHeight: "clamp(300px, 80vh, 555px)" }}
                >
                  {messages.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 border border-rose-100 text-center">
                      <p className="text-muted-foreground">
                        Belum ada ucapan. Jadilah yang pertama!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <MessageCard key={msg.id} message={msg} />
                    ))
                  )}
                </div>
                {/* Scroll indicator */}
                {/* {messages.length > 3 && (
                  <>
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-rose-50 to-transparent" />
                    <div className="absolute bottom-2 mt-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-rose-400 animate-bounce lg:hidden">
                      <ChevronDown className="size-3" />
                      <span>Scroll</span>
                    </div>
                  </>
                )} */}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function MessageCard({ message }: { message: Message }) {
  const attendanceLabel = {
    hadir: { text: "Hadir", color: "bg-green-100 text-green-700" },
    tidak_hadir: { text: "Tidak Hadir", color: "bg-red-100 text-red-700" },
    masih_ragu: { text: "Ragu", color: "bg-yellow-100 text-yellow-700" },
  };

  const status = attendanceLabel[message.attendance];
  const timeAgo = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
    locale: id,
  });

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <User className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">
              {message.guest_name}
            </p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
          {status.text}
        </span>
      </div>
      <p className="text-sm text-muted-foreground pl-10">{message.message}</p>
    </div>
  );
}
