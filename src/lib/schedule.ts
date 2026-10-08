import { ANY_BARBER, shop, type DayHours } from "@/shop-config";

const TZ = "America/Bahia";

export const WEEKDAYS_LONG = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

export const WEEKDAYS_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export const MONTHS_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export type DayCell = {
  iso: string;
  day: number;
  month: number;
  weekday: number;
  closed: boolean;
  isToday: boolean;
};

type Zoned = { y: number; m: number; d: number; minutes: number };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function bahiaNow(date = new Date()): Zoned {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  let hour = get("hour");
  if (hour === 24) hour = 0;
  return { y: get("year"), m: get("month"), d: get("day"), minutes: hour * 60 + get("minute") };
}

function shift(y: number, m: number, d: number, add: number) {
  const dt = new Date(Date.UTC(y, m - 1, d + add));
  return {
    y: dt.getUTCFullYear(),
    m: dt.getUTCMonth() + 1,
    d: dt.getUTCDate(),
    weekday: dt.getUTCDay(),
  };
}

export function isoOf(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

export function hoursFor(weekday: number): DayHours | undefined {
  return shop.hours.find((h) => h.day === weekday);
}

export function upcomingDays(count = 14, now = bahiaNow()): DayCell[] {
  return Array.from({ length: count }, (_, i) => {
    const z = shift(now.y, now.m, now.d, i);
    const hours = hoursFor(z.weekday);
    return {
      iso: isoOf(z.y, z.m, z.d),
      day: z.d,
      month: z.m,
      weekday: z.weekday,
      closed: !hours || hours.closed,
      isToday: i === 0,
    };
  });
}

export function slotsFor(weekday: number): string[] {
  const hours = hoursFor(weekday);
  if (!hours || hours.closed) return [];
  const [oh, om] = hours.open.split(":").map(Number);
  const [ch, cm] = hours.close.split(":").map(Number);
  const start = oh * 60 + om;
  const end = ch * 60 + cm;
  const out: string[] = [];
  for (let t = start; t + shop.slotMinutes <= end; t += shop.slotMinutes) {
    out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  }
  return out;
}

export function isPastSlot(iso: string, time: string, now = bahiaNow()) {
  if (iso !== isoOf(now.y, now.m, now.d)) return false;
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm <= now.minutes;
}

/** Mesmo barbeiro + dia + hora = sempre ocupado ou livre, em qualquer reload. */
export function isSlotTaken(barberId: string, iso: string, time: string) {
  const key = `${barberId}|${iso}|${time}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 7 < 2;
}

export function dateLabel(day: DayCell) {
  const name = WEEKDAYS_LONG[day.weekday] ?? "";
  const titled = name.charAt(0).toUpperCase() + name.slice(1);
  return `${titled}, ${pad(day.day)}/${pad(day.month)}`;
}

export function brl(value: number) {
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

export function waDigits() {
  const digits = shop.whatsapp.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function waLink(message: string) {
  return `https://wa.me/${waDigits()}?text=${encodeURIComponent(message)}`;
}

export function generalWaLink() {
  return waLink(`Olá! Vim pelo site da ${shop.name} e quero falar com vocês.`);
}

export function barberName(id: string | null) {
  if (!id || id === ANY_BARBER) return "Sem preferência";
  return shop.barbers.find((b) => b.id === id)?.name ?? "Sem preferência";
}

export function hoursLine() {
  const open = shop.hours.filter((h) => !h.closed);
  if (!open.length) return "Consulte os horários";
  const first = open[0];
  const last = open[open.length - 1];
  if (!first || first.closed || !last || last.closed) return "";
  const sameClock = open.every((h) => !h.closed && h.open === first.open && h.close === first.close);
  if (!sameClock) return `${first.label} a ${last.label}`;
  return `${first.label} a ${last.label} · ${first.open}–${first.close}`;
}
