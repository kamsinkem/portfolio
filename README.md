# My Robotics Portfolio

A clean, Apple-style personal website. Plain HTML, CSS, and JavaScript — no build step, no installs. It runs directly on GitHub Pages.

---

## What's in this folder

```
portfolio/
├── index.html              ← the page itself (your name, bio, contact info live here)
├── css/style.css           ← all the styling (colors are at the very top)
├── js/main.js              ← animations + builds project cards (you shouldn't need to touch it)
├── content/
│   └── projects.json       ← ⭐ ALL your projects live here
├── assets/
│   ├── images/             ← hero background, your profile photo, favicon
│   ├── projects/
│   │   ├── robotic-arm/              ← one folder of photos per project
│   │   ├── autonomous-mobile-robot/
│   │   └── vision-pose-estimation/
│   └── docs/               ← resume.pdf and project report PDFs
└── .nojekyll               ← tells GitHub Pages to serve files as-is (leave it alone)
```

Every place in `index.html` you're expected to change is marked with a **✏️ EDIT** comment. Search the file for `✏️` to find them all.

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
Create a new folder inside `assets/projects/` named after your project, using lowercase and dashes, e.g.:

```
assets/projects/drone-swarm/
```

Drop your photos in it, e.g. `cover.jpg`, `build.jpg`, `flight-test.jpg`.
Tips: landscape photos look best (roughly 16:10). Keep each under ~500 KB — [squoosh.app](https://squoosh.app) shrinks them for free.

**Step 2 — (Optional) add a PDF report.**
Put it in `assets/docs/`, e.g. `assets/docs/drone-swarm-report.pdf`.

**Step 3 — Add an entry to `content/projects.json`.**
Open the file. It's a list of projects inside `[ ... ]`, separated by commas. Copy one existing project block (from its `{` to its matching `}`), paste it where you want it to appear (order in the file = order on the site), and edit the values:

```json
  {
    "id": "drone-swarm",
    "title": "Cooperative Drone Swarm",
    "year": "2026",
    "summary": "One or two sentences that appear on the card.",
    "cover": "assets/projects/drone-swarm/cover.jpg",
    "tools": ["ROS 2", "Python", "PX4", "Gazebo"],
    "links": {
      "github": "https://github.com/YOUR-USERNAME/drone-swarm",
      "video": "https://www.youtube.com/watch?v=abc123",
      "report": "assets/docs/drone-swarm-report.pdf"
    },
    "gallery": [
      { "src": "assets/projects/drone-swarm/cover.jpg", "caption": "Three drones holding formation." },
      { "src": "assets/projects/drone-swarm/build.jpg", "caption": "Frame assembly." }
    ],
    "details": [
      "## Overview",
      "A normal paragraph of text.",
      "## What I built",
      ["A bullet point", "Another bullet point"],
      "## Results",
      "Another paragraph."
    ]
  },
```

What each field means:

| Field | What it does |
|---|---|
| `id` | A unique short name (lowercase, dashes). Also gives the project its own link: `yoursite/#project/drone-swarm` |
| `title` | Project name |
| `year` | Small label above the title (can be `""`) |
| `summary` | Short text on the card and at the top of the pop-up |
| `cover` | The image shown on the card |
| `tools` | The little tag pills. Add as many as you like |
| `links` | `github`, `video`, `report`. **Leave any of them as `""` to hide that link** |
| `gallery` | Photos in the pop-up. Each has a `src` (file path) and a `caption` |
| `details` | The long write-up in the pop-up. Text = paragraph, text starting with `## ` = heading, `[ ... ]` = bullet list |

**Step 4 — Check the commas.** This is the #1 cause of problems:
- Every project block except the **last** one needs a comma after its closing `}`.
- Inside a block, every line except the last one before a `}` or `]` needs a comma.
- Use straight double quotes `"like this"`, not curly quotes.

If the Projects section says *"Couldn't load projects"*, paste the whole file into [jsonlint.com](https://jsonlint.com) — it will point at the exact line with the typo.

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

| Photo | File to replace | Best shape |
|---|---|---|
| Big hero background | `assets/images/hero.svg` | Wide landscape, ~2400 × 1500 px. Darker images make the white text easier to read |
| Your portrait (About) | `assets/images/profile.svg` | Portrait, 4:5 (e.g. 800 × 1000 px) |
| Browser tab icon | `assets/images/favicon.svg` | Square |

The placeholders are `.svg` files. Your photos will probably be `.jpg`, so either:
- **Easiest:** name your photo e.g. `hero.jpg`, drop it in `assets/images/`, then in `index.html` change `assets/images/hero.svg` to `assets/images/hero.jpg` (search for `hero.svg`; it appears 2–3 times). Do the same for `profile.svg`.
- Then delete the old `.svg` placeholder.

**Using a video as the hero background:** put a short, muted `.mp4` (ideally under ~8 MB) at `assets/images/hero.mp4`. In `index.html`, find the hero section, delete the `<img class="hero-img" …>` line and remove the `<!--` and `-->` around the `<video …>` line.

**Project photos:** just replace the files in `assets/projects/<project-name>/` and update the paths in `content/projects.json`.

---

## 4. Edit your bio and personal info

All in `index.html` — search for `✏️ EDIT`:

- **Name** — in the `<title>`, the nav logo, the big hero heading, the About heading ("Hello, I'm…"), and the footer.
- **Tagline** — the line under your name in the hero.
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
- **Sharing a project:** every project has its own link, e.g. `https://YOUR-USERNAME.github.io/#project/robotic-arm` opens that project's pop-up directly.
