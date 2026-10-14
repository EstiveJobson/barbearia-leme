# Barbearia Leme

Demo site for a barbershop in Lauro de Freitas, Bahia, with a five-step online booking flow and confirmation over WhatsApp. The site UI is in Brazilian Portuguese.

> **Portfolio project.** Barbearia Leme is a fictional business. The team, testimonials, and address are sample data, and the photos come from Unsplash. The site is meant to be adapted for a real barbershop by editing a single configuration file.

## What it's for

Many barbershops still take appointments by direct message or phone, so the barber has to stop a haircut to reply. This demo shows a simpler alternative: the client picks the service, barber, day, and time on their phone, and a ready-to-send request lands in the shop's WhatsApp.

## Features

**Five-step booking** (`src/components/barbearia/booking.tsx`)

1. **Service**: a list with description, price, and duration.
2. **Barber**: a specific barber, or "Sem preferência" (no preference).
3. **Day**: the next 14 days, with closed days blocked.
4. **Time**: only slots where the service finishes before closing. Times that have already passed today stay hidden.
5. **Details**: name (required) and phone (optional), plus a booking summary and a confirm button.

On confirm, the site opens the barbershop's WhatsApp with a prefilled message that includes the service, price, barber, date, time, name, and the client's phone number when one was given.

**Page**

- Fixed header with a mobile menu
- Sections for services, gallery (enlarged view, with keyboard navigation), barbers, testimonials, and location
- Embedded Google Map, address, opening hours, and an Instagram link
- Floating WhatsApp button for general contact
- Dates and times calculated in the `America/Bahia` timezone
- SEO and Open Graph metadata in Portuguese (share image at `public/og.jpg`)

**Known limitation:** there is no server-side calendar. Slots marked "Ocupado" (busy) are simulated for the demo — always the same ones for a given barber, day, and time — and the real confirmation happens in the WhatsApp conversation.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [TanStack Start](https://tanstack.com/start) / TanStack Router
- [Vite](https://vite.dev) and [Nitro](https://nitro.build) (server and build)
- [Tailwind CSS 4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) (icons)

## Running it locally

Requires **Node.js 22.12 or later** (set in `engines` in `package.json`).

```bash
git clone https://github.com/EstiveJobson/barbearia-leme.git
cd barbearia-leme
npm install
npm run dev
```

The dev server starts at `http://localhost:8080`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server on port 8080 |
| `npm run build` | Production build |
| `npm run preview` | Serves the production build locally |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Adapting it for another barbershop

All of the business content lives in **`src/shop-config.ts`**. The components do not need to change.

| Field | What it is for |
| --- | --- |
| `name`, `tagline`, `intro`, `cityLine`, `year` | Name and intro copy |
| `seoDescription` | Description for Google and for link previews |
| `siteUrl` | Public site URL, including `https://` |
| `whatsapp` | Number that receives bookings: area code (DDD) plus the number, digits only, without the country code 55 (for example, `71912345678`) |
| `instagram` | Instagram username, without the `@` (for example, `barbearialeme`) |
| `address`, `mapQuery` | Address shown on the page, and the address used by the map |
| `slotMinutes` | Gap between booking slots, in minutes |
| `hero` | Cover image |
| `services` | Services: `id`, `name`, `description`, `price` (R$), and `duration` (minutes) |
| `barbers` | Team: `id`, `name`, `specialty`, and `photo` |
| `hours` | Hours by weekday (0 = Sunday), with `open`/`close` or `closed: true` |
| `reviews` | Testimonials |
| `gallery` | Gallery photos (`src` and `alt`) |

> In the demo, `siteUrl`, `whatsapp`, and `instagram` use test values (a Vercel domain, a test number, and the sample profile `barbearialeme`). Replace them with the barbershop's real details before handing the site to a client.

To change the share image, replace `public/og.jpg` (1200×630).

## Deploy

The project includes a `vercel.json`, so importing the repository on [Vercel](https://vercel.com) is enough. The build uses `npm run build`.

Published demo: <https://barbearia-leme.vercel.app>

## Structure

```
src/
  shop-config.ts             # barbershop data (the only file to edit)
  components/barbearia/      # page (site.tsx) and booking (booking.tsx)
  lib/schedule.ts            # slots, the America/Bahia timezone, and the WhatsApp link
  routes/                    # TanStack Router routes and metadata (__root.tsx)
public/                      # icons and the share image
scripts/, server/           # infrastructure from the template generated by Grok Build mode
```

The site has no login area. The authentication code in `src/lib/auth` came from the template and does not protect any page.

## License

[MIT](LICENSE) © 2026 Sérgio Vieira ([@EstiveJobson](https://github.com/EstiveJobson))
