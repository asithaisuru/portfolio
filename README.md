# Asitha Isuru — Interactive Portfolio

A personal life story built with **Next.js**, **Tailwind CSS**, **React Three Fiber** and **Three.js**. A procedural brick-style 3D avatar changes outfits as you explore education, work and skills; launching the project explorer takes you through a scroll-controlled galaxy of GitHub repositories and lands at the contact section.

The avatar follows Asitha's supplied LEGO reference: warm complexion, voluminous glossy swept black hair, printed short beard and moustache, black rectangular glasses with blue-tinted lenses, charcoal T-shirt and dark-gray trousers. Graduation, work, maker and pilot scenes add their own accessories. The likeness is modeled in Three.js geometry, so the original photograph is not bundled into the public website.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use `npm run build` to verify a production build.

## GitHub project planets

The browser reads the public GitHub API for [`asithaisuru`](https://github.com/asithaisuru), then falls back to `GET /api/projects` when needed. The server endpoint caches GitHub results for **15 minutes**. A last known successful browser response is also stored for up to seven days, so visitors can still explore recently fetched projects if GitHub is temporarily unreachable. New public repositories appear automatically when GitHub returns an updated list. Forks, private/archived repositories, `portfolio`, and the `asithaisuru` profile repository are excluded. Every project planet links to its real repository and optional live site.

GitHub may rate-limit anonymous API requests. For more reliable server fallback requests, set a server-side `GITHUB_TOKEN` in `.env.local` or your hosting provider's environment variables. It is **optional**; never expose it as `NEXT_PUBLIC_` or commit it to Git. If neither API connection nor a recent cached response is available, the explorer shows a retry button and a link to the public profile.

## Controls

- Scroll through the life story to meet a different character in each chapter. Characters stay inside their chapter instead of traveling with the page; hover or focus the story cards to trigger gestures, and move the pointer to make the character look around.
- Select **Launch project explorer** to board the ship. In the center launch bay, your spaceship waits for the first scroll or tap; then it steers left/right opposite each planet. Scroll, swipe vertically, use the arrow keys, or click the on-screen buttons. Inside a long project card, scrolling reads its description before traveling to the next planet.
- Press **Escape** or **Exit to story** to return. Travel past the final project to land at the contact section.
- On the contact planet, watch the avatar walk from the spaceship to the terminal and press its controls. Hover or focus Email, Call, GitHub, or LinkedIn to choose the key the character operates.
- Motion-sensitive visitors get shortened animations via `prefers-reduced-motion`. Devices without WebGL display a 2D fallback.

The avatar and planets are procedurally modeled in `components/brick-world.tsx`, so no third-party models, licenses or remote asset downloads are needed.
