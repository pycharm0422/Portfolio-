# Portfolio

A personal portfolio built with **React + Vite**. Every section is generated from one file,
`src/data/portfolio.json`, so you update the site by editing JSON. You don't need to touch any React code.

**Sections:** About · Education · Experience · Expertise · Projects · Game zone · Extras · Contact

**Games:** Snake 🐍 · Tic Tac Toe ❌ (vs friend / easy CPU / unbeatable CPU) · Memory Match 🧠 · 2048 🔢 ·
Rock Paper Scissors ✊ · Whack-a-Mole 🔨. High scores are saved in the browser.

## Updating your content

Edit `src/data/portfolio.json` and push. GitHub Actions rebuilds and redeploys the site automatically.

| Want to… | Do this in `portfolio.json` |
| --- | --- |
| Add a job | Add an object to `experience` (use `start`/`end`, or `period` for free text like `"6 months"`) |
| Add a degree / course | Add an object to `education` |
| Add a skill | Add `"Go"` to a group in `expertise` (or `{ "name": "Go", "level": 70 }` to show a progress bar) |
| Add a project | Add an object to `projects` (`image`, `github`, `live` are optional) |
| Add a hobby / extra | Add an object to `extras` (e.g. copy the Football entry) |
| Hide a game | Set `"enabled": false` on it in `games.list` |
| Hide a whole section | Make its array empty (`[]`) |

### Photos

1. Put the image in `public/images/`, e.g. `public/images/football-team.jpg`.
2. Reference it in the JSON **without** a leading slash: `"src": "images/football-team.jpg"`.

Your profile photo is `profile.photo`, and the football photos are in `extras[0].photos`. You can add several
photos, and they show as a gallery. Full `https://` image URLs work too.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## Deployment (free, GitHub Pages)

`.github/workflows/deploy.yml` builds the site on every push to `main` and publishes `dist/` to the
`gh-pages` branch.

**One-time setup:** in the repo, open **Settings → Pages → Build and deployment**, set **Source** to
*Deploy from a branch*, then choose the **`gh-pages`** branch and the **`/ (root)`** folder, and click Save.

The site will then be live at **https://pycharm0422.github.io/Portfolio-/**.
