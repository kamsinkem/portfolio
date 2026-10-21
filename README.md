# My Robotics Portfolio

A clean, Apple-style personal website. Plain HTML, CSS, and JavaScript — no build step, no installs. It runs directly on GitHub Pages.

---

## What's in this folder

```
portfolio/
├── index.html              ← home page (hero, about, featured projects, resume, contact)
├── projects.html           ← "all projects" page (cards are built automatically)
├── project.html            ← ONE template that shows any project's details page
├── css/style.css           ← all the styling (colors are at the very top)
├── js/main.js              ← animations + builds every project card/page (you shouldn't need to touch it)
├── content/
│   └── projects.json       ← ⭐ ALL your projects live here
├── assets/
│   ├── images/             ← your hero cut-out photo, About photo, favicon
│   ├── projects/
│   │   ├── blind-spot-radar/           ← one folder of photos per project
│   │   ├── smart-irrigation/
│   │   └── ev-solar-dc-dc-converter/
│   └── docs/               ← resume.pdf and project report PDFs
└── .nojekyll               ← tells GitHub Pages to serve files as-is (leave it alone)
```

**How the project pages work:** you never make a new HTML page for a project. Every project you add to `content/projects.json` automatically shows up in four places:

1. the **Projects dropdown** in the top menu (hover over "Projects"),
2. the **home page carousel** (if it has `"featured": true`), with a **View Project** button,
3. the **All projects page** (`projects.html`), with a **See More** button,
4. its own **details page** at `project.html?id=<its id>`.

Every place you're expected to change in the HTML files is marked with a **✏️ EDIT** comment. Search for `✏️` to find them all. The nav menu and footer appear on all three HTML pages, so change your name/links in each of `index.html`, `projects.html` and `project.html`.

---

## Preview on your computer

The project cards are loaded from `content/projects.json`, and browsers block that when you just double-click `index.html`. Run a tiny local server instead:

1. Open a terminal in the `portfolio` folder.
2. Run: `python3 -m http.server 8000`
3. Open **http://localhost:8000** in your browser.
4. Press `Ctrl + C` in the terminal to stop it.

(VS Code users: the "Live Server" extension works too — right-click `index.html` → *Open with Live Server*.)

After you edit something, just refresh the browser. If a change doesn't show up, do a hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows).

---

## 1. Add a new project

You only touch two things: a folder of images and `content/projects.json`.

**Step 1 — Add your images.**
Create a new folder inside `assets/projects/` named after your project, using lowercase and dashes, e.g. `assets/projects/drone-swarm/`. Drop your photos in it (e.g. `cover.jpg`, `wiring.jpg`, `test-day.jpg`).
Tips: landscape photos look best. Keep each under ~500 KB — [squoosh.app](https://squoosh.app) shrinks them for free.

**Step 2 — (Optional) add a PDF report** to `assets/docs/`, e.g. `assets/docs/drone-swarm-report.pdf`.

**Step 3 — Add an entry to `content/projects.json`.**
The file is a list of projects inside `[ ... ]`, separated by commas. Copy one whole existing project (from its `{` to its matching `}`), paste it where you want it (order in the file = order on the site), and edit the values:

```json
  {
    "id": "drone-swarm",
    "title": "Cooperative Drone Swarm",
    "category": "Course Project",
    "dates": "Jan 2026 – Apr 2026",
    "role": "Team lead · 4 students",
    "featured": true,
    "summary": "One or two sentences shown on the cards and at the top of the project page.",
    "cover": "assets/projects/drone-swarm/cover.jpg",
    "coverCaption": "Three drones holding formation.",
    "tools": ["ROS 2", "Python", "PX4"],
    "skills": ["Control systems", "Teamwork"],
    "links": {
      "github": "https://github.com/YOUR-USERNAME/drone-swarm",
      "video": "",
      "report": "assets/docs/drone-swarm-report.pdf"
    },
    "overview": "A short paragraph introducing the project — shown big near the top of its page.",
    "sections": [
      {
        "heading": "How it works",
        "text": "A paragraph of text.",
        "bullets": ["A bullet point", "Label: a bullet with a bold label"],
        "image": { "src": "assets/projects/drone-swarm/wiring.jpg", "caption": "Wiring the flight controller." }
      },
      {
        "heading": "Results",
        "text": ["First paragraph.", "Second paragraph."]
      }
    ],
    "gallery": [
      { "src": "assets/projects/drone-swarm/test-day.jpg", "caption": "Test flight day." }
    ]
  },
```

What each field means:

| Field | What it does |
|---|---|
| `id` | Unique short name (lowercase, dashes). Becomes the page link: `project.html?id=drone-swarm` |
| `title` | Project name |
| `category` / `dates` | Small label above the title, e.g. "Final Year Capstone Project · Sept 2024 – June 2025" |
| `role` | Optional. Shown in the facts row on the project page |
| `featured` | `true` = also show it in the home-page carousel. `false` = only on the All projects page |
| `summary` | Short text on the cards and under the title on the project page |
| `cover` / `coverCaption` | The main image (cards, dropdown, and the big image at the top of the project page) |
| `tools` | The little tag pills |
| `skills` | "Key skills demonstrated" pills on the project page |
| `links` | `github`, `video`, `report`. **Leave any as `""` to hide it** |
| `overview` | Intro paragraph on the project page |
| `sections` | The story of the project. Each section can have a `heading`, `text` (one paragraph, or a list `[...]` of paragraphs), `bullets`, and an `image`. Sections **with** an image alternate picture-left / picture-right automatically; sections **without** one are just text |
| `gallery` | Extra photos in a grid at the bottom of the project page (3 photos make a nice mosaic) |

**Step 4 — Check the commas.** This is the #1 cause of problems:
- Every project block except the **last** one needs a comma after its closing `}`.
- Inside a block, every line except the last one before a `}` or `]` needs a comma.
- Use straight double quotes `"like this"`, not curly quotes.

If a page says *"Couldn't load projects"*, paste the whole file into [jsonlint.com](https://jsonlint.com) — it points at the exact line with the typo.

**Replacing the placeholder pictures:** each grey/blue/green/brown placeholder says *"replace: filename.svg"* at the bottom. Put your photo in the same folder (e.g. `hardware.jpg`), then in `projects.json` change `hardware.svg` to `hardware.jpg`. Delete the old `.svg` when you're done.

**Placeholder text:** the three current projects were written from your project portfolio PDF. Read them over and fill in the sections marked **✏️ Placeholder** (mostly the Results) with your real numbers.

**To remove a project:** delete its block (and fix the commas), then delete its image folder.

---

## 2. Swap your resume PDF

1. Export your resume as a PDF.
2. Rename it to exactly `resume.pdf`.
3. Put it in `assets/docs/`, replacing the placeholder.

That's it — both the **View** and **Download** buttons point to that file.
(To change the file name people get when they download it, edit `download="YourName-Resume.pdf"` in `index.html`.)

---

## 3. Change photos

| Photo | File | Notes |
|---|---|---|
| Front-page photo (big cut-out of you) | `assets/images/hero-portrait.webp` | Must have a **transparent background** (a "cut-out"), so only you show on the dark backdrop. Upper body, roughly 1086 × 1320 px works well |
| About photo | `assets/images/profile.jpg` | Any normal portrait photo. Shown in a rounded 4:5 frame |
| Browser tab icon | `assets/images/favicon.svg` | Square |

**Easiest way to swap a photo:** give your new file the *exact same name* as the old one (for example `profile.jpg`) and upload it over the old file. No code changes needed.

**Making a cut-out (transparent background) for the front page:**
1. Go to a free background remover such as [remove.bg](https://www.remove.bg) or Adobe Express's "Remove background" tool, and upload your photo.
2. Download the result as a **PNG**.
3. Either upload it as `assets/images/hero-portrait.png` and, in `index.html`, change `hero-portrait.webp` to `hero-portrait.png`, **or** convert it to WebP first (smaller, faster) at [squoosh.app](https://squoosh.app) and upload it as `hero-portrait.webp`.

**Project photos:** just replace the files in `assets/projects/<project-name>/` and update the paths in `content/projects.json`.

---

## 4. Edit your bio and personal info

All in `index.html` — search for `✏️ EDIT`:

- **Name** — in the `<title>`, the nav logo, the front-page headline, the photo descriptions (`alt="Portrait of Your Name"`), the About heading ("Hello, I'm…"), and the footer. Searching `index.html` for **Your Name** finds them all.
- **Headline** — "I'm Your Name, a Robotics Engineer" on the front page.
- **Tagline** — the line under the headline on the front page.
- **Bio** — the paragraphs marked `data-lines` in the About section. Change the text between `<p …>` and `</p>`. Add a paragraph by copying one of the `<p class="bio" data-lines>…</p>` lines. Keep bio paragraphs as plain text (no links) so the line-by-line animation works.
- **Quick facts** — Education / Focus / Based in, just below the bio.
- **Email, LinkedIn, GitHub** — in the Contact section *and* the GitHub icon in the nav. Replace every `YOUR-USERNAME` (search the file for it) and `you@northeastern.edu`.

**Colors:** open `css/style.css`. The top of the file has `--accent` (the blue) and others for light mode, and a second block below it for dark mode.

---

## 5. Contact form (Formspree)

The form sends messages to your email through [Formspree](https://formspree.io) (free plan: 50 messages/month).

1. Sign up at **formspree.io** and click **+ New Form**. Name it anything ("Portfolio").
2. Formspree shows an endpoint like `https://formspree.io/f/xyzabcd`. The part after `/f/` (`xyzabcd`) is your form ID.
3. In `index.html`, search for `YOUR_FORM_ID` and replace it with your ID.
4. Publish the site, then send yourself a test message. The first time, Formspree emails you to confirm the form — click the link and you're done.

Until you do this, the form politely says it isn't connected yet.

---

## 6. Put it online with GitHub Pages

### First time

1. **Create a repository.** On github.com, click **+** (top right) → **New repository**.
   - Name it **`YOUR-USERNAME.github.io`** (with your real GitHub username) to get the clean address `https://YOUR-USERNAME.github.io`.
     Any other name (e.g. `portfolio`) also works; your site will be at `https://YOUR-USERNAME.github.io/portfolio/`.
   - Set it to **Public**. Don't add a README (you already have one). Click **Create repository**.
2. **Upload the files.** On the new repo page, click **uploading an existing file**. Drag in the *contents* of the `portfolio` folder (so `index.html` sits at the top level of the repo, not inside a subfolder). Click **Commit changes**.
   - Heads-up: the browser uploader may skip `.nojekyll` because its name starts with a dot. If it's missing, click **Add file → Create new file**, name it `.nojekyll`, leave it empty, and commit.
   - If you use git instead: `git init`, `git add .`, `git commit -m "First version"`, `git branch -M main`, `git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git`, `git push -u origin main`.
3. **Turn on Pages.** In the repo:
   - Click **Settings** (the tab with the gear, top of the repo).
   - In the left sidebar, click **Pages** (under "Code and automation").
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Under **Branch**, choose **`main`** and folder **`/ (root)`**, then click **Save**.
4. Wait 1–2 minutes and refresh the Pages settings screen. A box at the top will say **"Your site is live at …"** with the link. You can also watch progress in the repo's **Actions** tab.

### Updating later

Edit the files on your computer, then upload the changed files again (or `git add . && git commit -m "Update" && git push`). GitHub re-publishes automatically in a minute or two. If you don't see changes, hard-refresh (`Cmd/Ctrl + Shift + R`).

You can also edit straight on github.com: open any file → pencil icon → edit → **Commit changes**. Handy for quick fixes to `projects.json`.

### Optional: custom domain

Bought a domain like `yourname.com`? In **Settings → Pages → Custom domain**, enter it and click **Save**, then follow GitHub's DNS instructions shown there. Tick **Enforce HTTPS** once it becomes available.

---

## Good to know

- **Light/dark mode** follows the visitor's system setting automatically.
- **Reduced motion:** if a visitor has "Reduce motion" turned on (macOS: *System Settings → Accessibility → Display*; iOS: *Settings → Accessibility → Motion*), all scroll and fade animations are switched off and everything is simply shown.
- **Animations** use [GSAP](https://gsap.com) + ScrollTrigger, loaded from the cdnjs CDN in `index.html`. If the CDN ever fails, the site still works, just without animations.
- **Sharing a project:** every project has its own page, e.g. `https://kamsinkem.github.io/portfolio/project.html?id=blind-spot-radar`.
