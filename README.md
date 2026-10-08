# Barbearia Leme

Site de demonstração para uma barbearia em Lauro de Freitas (BA), com agendamento online em 5 etapas e confirmação pelo WhatsApp.

> **Projeto de portfólio.** A Barbearia Leme é um negócio fictício. Equipe, depoimentos e endereço são dados de exemplo, e as fotos vêm do Unsplash. O site foi feito para ser adaptado a barbearias reais trocando um único arquivo de configuração.

## Para que serve

Muitas barbearias ainda marcam horário por DM ou telefone, o que obriga o barbeiro a parar o corte para responder mensagem. Esta demo mostra uma alternativa simples: o cliente escolhe serviço, barbeiro, dia e horário sozinho no celular, e o pedido chega pronto no WhatsApp da casa.

## Funcionalidades

**Agendamento em 5 etapas** (`src/components/barbearia/booking.tsx`)

1. **Serviço**: lista com descrição, preço e duração.
2. **Barbeiro**: um profissional específico ou "Sem preferência".
3. **Dia**: os próximos 14 dias, com os dias fechados bloqueados.
4. **Horário**: só aparecem horários em que o serviço termina antes do fechamento. Horários que já passaram no dia de hoje ficam ocultos.
5. **Dados**: nome (obrigatório) e telefone (opcional), com um resumo do agendamento e o botão de confirmar.

Ao confirmar, o site abre o WhatsApp da barbearia com uma mensagem já preenchida contendo serviço, preço, barbeiro, data, horário, nome e, se informado, o telefone do cliente.

**Página**

- Cabeçalho fixo com menu para celular
- Seções de serviços, galeria (com visualização ampliada e navegação pelo teclado), barbeiros, depoimentos e localização
- Mapa do Google incorporado, endereço, horário de funcionamento e link para o Instagram
- Botão flutuante de WhatsApp para contato geral
- Datas e horários calculados no fuso `America/Bahia`
- Metadados de SEO e Open Graph em português (imagem de compartilhamento em `public/og.jpg`)

**Limitação conhecida:** não existe um sistema de agenda no servidor. Os horários marcados como "Ocupado" são simulados para a demonstração (sempre os mesmos para o mesmo barbeiro, dia e hora), e a confirmação de verdade acontece na conversa do WhatsApp.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [TanStack Start](https://tanstack.com/start) / TanStack Router
- [Vite](https://vite.dev) e [Nitro](https://nitro.build) (servidor e build)
- [Tailwind CSS 4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) (ícones)

## Como rodar localmente

Requer **Node.js 22.12 ou superior** (definido em `engines` no `package.json`).

```bash
git clone https://github.com/EstiveJobson/barbearia-leme.git
cd barbearia-leme
npm install
npm run dev
```

O servidor de desenvolvimento sobe em `http://localhost:8080`.

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento na porta 8080 |
| `npm run build` | Build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run typecheck` | Verificação de tipos com o TypeScript |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Como adaptar para outra barbearia

Todo o conteúdo do negócio fica em **`src/shop-config.ts`**. Não é preciso mexer nos componentes.

| Campo | Para que serve |
| --- | --- |
| `name`, `tagline`, `intro`, `cityLine`, `year` | Nome e textos de apresentação |
| `seoDescription` | Descrição para o Google e para as prévias de link |
| `siteUrl` | URL pública do site, com `https://` |
| `whatsapp` | Número que recebe os agendamentos: DDD + número, só dígitos, sem o 55 (ex.: `71912345678`) |
| `instagram` | Link do perfil no Instagram |
| `address`, `mapQuery` | Endereço exibido e endereço usado no mapa |
| `slotMinutes` | Intervalo entre horários da agenda, em minutos |
| `hero` | Imagem de capa |
| `services` | Serviços: `id`, `name`, `description`, `price` (R$) e `duration` (minutos) |
| `barbers` | Equipe: `id`, `name`, `specialty` e `photo` |
| `hours` | Funcionamento por dia da semana (0 = domingo), com `open`/`close` ou `closed: true` |
| `reviews` | Depoimentos |
| `gallery` | Fotos da galeria (`src` e `alt`) |

> `siteUrl`, `whatsapp` e `instagram` vêm com marcadores (`[SEU_DOMINIO]`, `[SEU_NUMERO]`, `[SEU_INSTAGRAM]`). Preencha esses campos antes de publicar, senão os links de WhatsApp e Instagram e a imagem das prévias de link não funcionam.

Para trocar a imagem de compartilhamento, substitua `public/og.jpg` (1200×630).

## Deploy

O projeto inclui um `vercel.json`, então basta importar o repositório na [Vercel](https://vercel.com). O build usa `npm run build`.

Ainda não há uma versão publicada. Por enquanto, a demo roda localmente.

## Estrutura

```
src/
  shop-config.ts             # dados da barbearia (único arquivo a editar)
  components/barbearia/      # página (site.tsx) e agendamento (booking.tsx)
  lib/schedule.ts            # horários, fuso America/Bahia e link do WhatsApp
  routes/                    # rotas do TanStack Router e metadados (__root.tsx)
public/                      # ícones e imagem de compartilhamento
scripts/, server/           # infraestrutura do template gerado pelo modo Build do Grok
```

O site não tem área de login. O código de autenticação em `src/lib/auth` veio do template e não protege nenhuma página.

## Licença

[MIT](LICENSE) © 2026 Sérgio Vieira ([@EstiveJobson](https://github.com/EstiveJobson))
