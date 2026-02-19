"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Search,
  Users,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  RotateCcw,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Phone,
  ExternalLink,
  Copy,
  Check,
  X,
  Loader2,
} from "lucide-react";
import type { Guest } from "@/types";

// ============================================================
// CONFIG
// ============================================================
const DOMAIN =
  process.env.NEXT_PUBLIC_INVITATION_DOMAIN || "yourdomain.com";

const WA_TEMPLATE = (name: string, slug: string) =>
  `Halo ${name}! 🎉
Dengan penuh sukacita, kami mengundang Anda untuk hadir di hari bahagia kami.

📱 Lihat undangan digital Anda:
https://${DOMAIN}/undangan/${slug}

Mohon konfirmasi kehadiran ya! 🙏
Terima kasih ❤️`;

// ============================================================
// HELPERS
// ============================================================
function formatPhone(phone: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return "62" + digits;
}

function generateWaLink(phone: string | null, name: string, slug: string) {
  const formatted = formatPhone(phone);
  if (!formatted) return null;
  const text = encodeURIComponent(WA_TEMPLATE(name, slug));
  return `https://wa.me/${formatted}?text=${text}`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type FilterType = "all" | "sent" | "pending";
type SortField = "name" | "sent_at" | "created_at";

interface Stats {
  total: number;
  sent: number;
  opened: number;
  rsvp: number;
  pending: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================
// TOAST COMPONENT
// ============================================================
interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-in slide-in-from-right ${
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="size-4" />
          ) : (
            <X className="size-4" />
          )}
          {toast.message}
          <button onClick={() => onDismiss(toast.id)} className="ml-2 hover:opacity-70">
            <X className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// STATS CARDS
// ============================================================
function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Tamu",
      value: stats.total,
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      label: "Terkirim",
      value: stats.sent,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border-amber-200",
      iconBg: "bg-amber-100",
    },
    // {
    //   label: "WA Opened",
    //   value: stats.opened,
    //   icon: Eye,
    //   color: "bg-purple-50 text-purple-600 border-purple-200",
    //   iconBg: "bg-purple-100",
    // },
    // {
    //   label: "RSVP",
    //   value: stats.rsvp,
    //   icon: MessageSquare,
    //   color: "bg-rose-50 text-rose-600 border-rose-200",
    //   iconBg: "bg-rose-100",
    // },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-4 ${card.color}`}
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${card.iconBg}`}>
              <card.icon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs opacity-70">{card.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PROGRESS BAR
// ============================================================
function ProgressBar({ sent, total }: { sent: number; total: number }) {
  const pct = total > 0 ? Math.round((sent / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Progress Pengiriman</span>
        <span className="font-bold text-emerald-600">
          {sent}/{total} ({pct}%)
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function AdminBlastPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    sent: 0,
    opened: 0,
    rsvp: 0,
    pending: 0,
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [confirmReset, setConfirmReset] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    inserted: number;
    skipped: number;
    total: number;
    parseErrors: string[];
  } | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Toast helper
  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch guests
  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        filter,
        search: debouncedSearch,
        sortBy,
        sortOrder,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      const res = await fetch(`/api/guests?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setGuests(data.guests);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err) {
      addToast(
        `Failed to fetch guests: ${err instanceof Error ? err.message : "Unknown error"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedSearch, sortBy, sortOrder, pagination.page, pagination.limit, addToast]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Mark guest as sent
  const markAsSent = useCallback(
    async (guest: Guest) => {
      setSendingId(guest.id);
      try {
        // Open WhatsApp link
        const waLink = generateWaLink(guest.phone, guest.name, guest.slug);
        if (waLink) {
          window.open(waLink, "_blank");
        }

        // Update database
        const res = await fetch(`/api/guests/${guest.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sent_at: new Date().toISOString() }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        // Update local state
        setGuests((prev) =>
          prev.map((g) => (g.id === guest.id ? data.guest : g))
        );
        setStats((prev) => ({
          ...prev,
          sent: prev.sent + (guest.sent_at ? 0 : 1),
          pending: prev.pending - (guest.sent_at ? 0 : 1),
        }));

        addToast(`WA sent to ${guest.name}`, "success");
      } catch (err) {
        addToast(
          `Failed: ${err instanceof Error ? err.message : "Unknown error"}`,
          "error"
        );
      } finally {
        setSendingId(null);
      }
    },
    [addToast]
  );

  // Reset guest
  const resetGuest = useCallback(
    async (guest: Guest) => {
      if (confirmReset !== guest.id) {
        setConfirmReset(guest.id);
        setTimeout(() => setConfirmReset(null), 3000);
        return;
      }
      setConfirmReset(null);

      try {
        const res = await fetch(`/api/guests/${guest.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sent_at: null }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setGuests((prev) =>
          prev.map((g) => (g.id === guest.id ? data.guest : g))
        );
        setStats((prev) => ({
          ...prev,
          sent: prev.sent - 1,
          pending: prev.pending + 1,
        }));

        addToast(`Reset ${guest.name}`, "success");
      } catch (err) {
        addToast(
          `Failed to reset: ${err instanceof Error ? err.message : "Unknown error"}`,
          "error"
        );
      }
    },
    [confirmReset, addToast]
  );

  // Copy message
  const copyMessage = useCallback(
    (guest: Guest) => {
      const message = WA_TEMPLATE(guest.name, guest.slug);
      navigator.clipboard.writeText(message);
      addToast(`Message copied for ${guest.name}`, "success");
    },
    [addToast]
  );

  // Import Excel
  const handleImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      setImporting(true);
      setImportResult(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/guests/import", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setImportResult(data);
        await fetchGuests();
        addToast(`Imported ${data.inserted} guests`, "success");
      } catch (err) {
        addToast(
          `Import failed: ${err instanceof Error ? err.message : "Unknown error"}`,
          "error"
        );
      } finally {
        setImporting(false);
      }
    },
    [addToast, fetchGuests]
  );

  // Export CSV
  const exportCsv = useCallback(() => {
    const headers = ["No", "Name", "Slug", "Phone", "Status", "Sent At"];
    const rows = guests.map((g, i) => [
      i + 1,
      g.name,
      g.slug,
      g.phone || "",
      g.sent_at ? "Sent" : "Pending",
      g.sent_at ? formatDate(g.sent_at) : "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests-blast-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("CSV exported", "success");
  }, [guests, addToast]);

  // Bulk send
  const bulkSend = useCallback(async () => {
    const selected = guests.filter((g) => selectedIds.has(g.id));
    for (const guest of selected) {
      await markAsSent(guest);
      // Small delay between sends
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setSelectedIds(new Set());
  }, [guests, selectedIds, markAsSent]);

  // Toggle select
  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Toggle all
  const toggleAll = useCallback(() => {
    if (selectedIds.size === guests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(guests.map((g) => g.id)));
    }
  }, [guests, selectedIds.size]);

  // Toggle sort
  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortBy === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortOrder("asc");
      }
    },
    [sortBy]
  );

  // Pending guests for "send pending" count
  const pendingSelected = useMemo(
    () => guests.filter((g) => selectedIds.has(g.id) && !g.sent_at).length,
    [guests, selectedIds]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                WhatsApp Blast Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and send wedding invitations via WhatsApp
              </p>
            </div>
            <div className="flex gap-2">
              <label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleImport}
                  disabled={importing}
                />
                <Button
                  variant="outline"
                  className="gap-2 cursor-pointer"
                  asChild
                  disabled={importing}
                >
                  <span>
                    {importing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    <span className="hidden sm:inline">
                      {importing ? "Importing..." : "Import Excel"}
                    </span>
                  </span>
                </Button>
              </label>
              <Button variant="outline" onClick={exportCsv} className="gap-2">
                <Download className="size-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto  px-4 py-6 sm:px-6">
        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Progress Bar */}
        <div className="mt-4">
          <ProgressBar sent={stats.sent} total={stats.total} />
        </div>

        {/* Filters & Search */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {(["all", "pending", "sent"] as FilterType[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter(f);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="capitalize"
              >
                {f === "all"
                  ? `All (${stats.total})`
                  : f === "sent"
                    ? `Sent (${stats.sent})`
                    : `Pending (${stats.pending})`}
              </Button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2">
            <span className="text-sm font-medium text-blue-700">
              {selectedIds.size} selected
            </span>
            <Button
              size="sm"
              onClick={bulkSend}
              disabled={pendingSelected === 0}
              className="gap-1 bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <Send className="size-3" />
              Send Selected ({pendingSelected})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={
                        guests.length > 0 &&
                        selectedIds.size === guests.length
                      }
                      onChange={toggleAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 hover:text-gray-700"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                  <th className="hidden px-4 py-3 sm:table-cell">Phone</th>
                  <th
                    className="cursor-pointer px-4 py-3 hover:text-gray-700"
                    onClick={() => toggleSort("sent_at")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="mx-auto size-8 animate-spin text-gray-400" />
                      <p className="mt-2 text-sm text-gray-400">
                        Loading guests...
                      </p>
                    </td>
                  </tr>
                ) : guests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Users className="mx-auto size-8 text-gray-300" />
                      <p className="mt-2 text-sm text-gray-400">
                        No guests found
                      </p>
                    </td>
                  </tr>
                ) : (
                  guests.map((guest, i) => (
                    <tr
                      key={guest.id}
                      className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                        guest.sent_at ? "bg-emerald-50/30" : ""
                      } ${selectedIds.has(guest.id) ? "bg-blue-50" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(guest.id)}
                          onChange={() => toggleSelect(guest.id)}
                          className="rounded border-gray-300"
                        />
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {guest.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          /{guest.slug}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="hidden px-4 py-3 sm:table-cell">
                        {guest.phone ? (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="size-3" />
                            {guest.phone}
                          </div>
                        ) : (
                          <span className="text-xs text-red-400">
                            No phone
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {guest.sent_at ? (
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                              <CheckCircle className="size-3" />
                              Sent
                            </span>
                            <div className="mt-0.5 text-[10px] text-gray-400">
                              {formatDate(guest.sent_at)}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                            <Clock className="size-3" />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => markAsSent(guest)}
                            disabled={
                              !guest.phone ||
                              formatPhone(guest.phone).length < 10 ||
                              sendingId === guest.id
                            }
                            className={`gap-1 text-xs ${
                              guest.sent_at
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-emerald-500 hover:bg-emerald-600"
                            } text-white`}
                          >
                            {sendingId === guest.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <Send className="size-3" />
                            )}
                            <span className="hidden sm:inline">
                              {guest.sent_at ? "Resend" : "Send WA"}
                            </span>
                          </Button>

                          <Button
                            size="icon-sm"
                            variant="outline"
                            onClick={() => copyMessage(guest)}
                            title="Copy message"
                          >
                            <Copy className="size-3" />
                          </Button>

                          {generateWaLink(
                            guest.phone,
                            guest.name,
                            guest.slug
                          ) && (
                            <a
                              href={
                                generateWaLink(
                                  guest.phone,
                                  guest.name,
                                  guest.slug
                                )!
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="icon-sm"
                                variant="outline"
                                title="Open WA link"
                              >
                                <ExternalLink className="size-3" />
                              </Button>
                            </a>
                          )}

                          {/* {guest.sent_at && (
                            <Button
                              size="icon-sm"
                              variant="outline"
                              onClick={() => resetGuest(guest)}
                              title={
                                confirmReset === guest.id
                                  ? "Click again to confirm"
                                  : "Reset status"
                              }
                              className={
                                confirmReset === guest.id
                                  ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                                  : "text-red-500 hover:bg-red-50 hover:text-red-600"
                              }
                            >
                              {confirmReset === guest.id ? (
                                <Check className="size-3" />
                              ) : (
                                <RotateCcw className="size-3" />
                              )}
                            </Button>
                          )} */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}{" "}
                of {pagination.total}
              </p>
              <div className="flex gap-1">
                <Button
                  size="icon-sm"
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page - 1 }))
                  }
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from(
                  { length: Math.min(pagination.totalPages, 5) },
                  (_, i) => {
                    const start = Math.max(
                      1,
                      Math.min(
                        pagination.page - 2,
                        pagination.totalPages - 4
                      )
                    );
                    const pageNum = start + i;
                    if (pageNum > pagination.totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        size="icon-sm"
                        variant={
                          pagination.page === pageNum ? "default" : "outline"
                        }
                        onClick={() =>
                          setPagination((p) => ({ ...p, page: pageNum }))
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
                <Button
                  size="icon-sm"
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page + 1 }))
                  }
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Import Result Modal */}
      {importResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Import Selesai</h3>
              <button onClick={() => setImportResult(null)}>
                <X className="size-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-2xl font-bold text-emerald-600">{importResult.inserted}</p>
                  <p className="text-xs text-emerald-600">Inserted</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3">
                  <p className="text-2xl font-bold text-amber-600">{importResult.skipped}</p>
                  <p className="text-xs text-amber-600">Skipped</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-2xl font-bold text-blue-600">{importResult.total}</p>
                  <p className="text-xs text-blue-600">Total</p>
                </div>
              </div>
              {importResult.parseErrors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="mb-1 text-xs font-medium text-red-700">Parse errors:</p>
                  {importResult.parseErrors.map((e, i) => (
                    <p key={i} className="text-xs text-red-600">{e}</p>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400">
                Skipped = slug sudah ada (duplicate)
              </p>
            </div>
            <Button className="mt-4 w-full" onClick={() => setImportResult(null)}>
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
