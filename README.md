# My Robotics Portfolio

A clean, Apple-style personal website. Plain HTML, CSS, and JavaScript — no build step, no installs. It runs directly on GitHub Pages.

---

## What's in this folder

```
portfolio/
├── index.html              ← home page (hero, featured projects, resume, contact)
├── about.html              ← About page ("Who am I?" and "My Journey")
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

Search for `✏️ EDIT` in these files:

- **`index.html` (home page)**
  - **Headline:** "Hi, I'm Kamsi Nkem. I build robots that sense, plan & move." The words inside `<em class="grad">…</em>` get the teal-to-blue color.
  - **Intro sentence:** the line under the headline. Words inside `<strong>…</strong>` show in bold white.
  - **Email and LinkedIn:** in the Contact section. Replace `you@northeastern.edu` and `YOUR-USERNAME` in the LinkedIn link.
- **`about.html` (About page)**
  - **Who am I?** and **My Journey:** change the text between `<p>` and `</p>`. Copy a whole `<p>…</p>` line to add a paragraph, or delete one to remove it. Replace every **✏️ Placeholder** sentence with your own words.
  - **Quick facts:** Education / Focus / Based in.
  - **Photos:** `assets/images/about-who.svg` and `assets/images/about-journey.svg`. See section 3 to swap them.
- **Name, logo, and links in the top menu:** these appear on all four pages (`index.html`, `about.html`, `projects.html`, `project.html`). The badge text is `KN.` and the subtitle is `Robotics &amp; Controls`. If you change them, change them in all four files.

**Colors:** open `css/style.css`. The top of the file has `--accent` (the blue used for buttons) and `--brand` (the teal) for light mode, then a second block for dark mode.

---

## 4b. ⭐ Editing everything on GitHub.com (no software needed)

You can do every update right on the GitHub website, from any computer. Your site re-publishes itself 1–2 minutes after each change.

### Change text in any file

1. Go to **https://github.com/kamsinkem/portfolio**.
2. Click the file you want, for example `content` → `projects.json`, or `about.html`.
3. Click the **✏️ pencil icon** (top right of the file). It says "Edit this file" when you hover over it.
4. Make your changes.
5. Click the green **Commit changes…** button (top right), then **Commit changes** again in the pop-up.
6. Wait 1–2 minutes, then hard-refresh your site (**Ctrl + Shift + R**, or **Cmd + Shift + R** on Mac).

### Upload photos

1. On the repo page, click into the folder the photo belongs in. For example, `assets` → `projects` → `smart-irrigation`.
2. Click **Add file** (top right) → **Upload files**.
3. Drag your photos onto the page. Name them simply, with no spaces, for example `prototype.jpg`.
4. Click **Commit changes**.
5. Open `content/projects.json` (pencil icon) and change the matching path. For example, change
   `"assets/projects/smart-irrigation/prototype.svg"` to `"assets/projects/smart-irrigation/prototype.jpg"`. Commit.

**Shortcut:** if you give your photo the *exact same name* as the file it replaces (same name *and* same ending, like `profile.jpg`), you only need step 1–4. Nothing else needs changing.

### Add a photo folder for a brand-new project

GitHub can't make an empty folder, but uploading creates one:
1. Go into `assets/projects/` and click **Add file → Upload files**.
2. Drag the **whole folder** from your computer (e.g. a folder called `drone-swarm` with your photos inside) onto the page. GitHub keeps the folder name.
3. Click **Commit changes**, then add the project to `projects.json` (see section 1).

### Delete a file

Open the file → click the **⋯** menu (top right) → **Delete file** → **Commit changes**.

### Bigger edits: the in-browser editor

On the repo page, press the **`.`** (period) key on your keyboard. A full code editor (VS Code) opens in your browser with every file in a sidebar, which is handy for editing several files at once. When you're done, click the **Source Control** icon on the left (it looks like a branch), type a short message, and click **Commit & Push**.

### If something breaks

- **Projects disappear / "Couldn't load projects":** there's a typo in `projects.json`. Paste the whole file into [jsonlint.com](https://jsonlint.com) and it shows the bad line. Usually it's a missing comma or quote.
- **Undo a change:** open the file → click **History** (top right) → pick the last good version → copy its text back in. Or just ask Claude to fix it.
- **Check publishing:** the **Actions** tab shows a ✅ when your site is updated, and a ❌ if something failed.

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

### What this means, in plain words

Your website is just a folder of files: HTML, CSS, JavaScript, and images. To be visible on the internet, those files have to live on a computer that's always on and connected, which is called a **web server** or **host**.

**GitHub** is where your files are *stored* (your "repository", the `kamsinkem/portfolio` page on github.com). **GitHub Pages** is a free feature of GitHub that also *hosts* those files as a real website. Once it's switched on, GitHub takes whatever is in your repository and shows it at a public address:

> **https://kamsinkem.github.io/portfolio/**

So "putting it online with GitHub Pages" means **flipping one switch in your repository's settings**, so GitHub serves your files to anyone who visits that link.

- **Is it free?** Yes, for public repositories.
- **Do I need to do this again?** No, only once. After that, every time you change a file on GitHub (or Claude pushes an update), the website updates itself within 1–2 minutes. This automatic re-publishing is called **deploying**.
- **Where do I see that it worked?** In your repository, click the **Actions** tab. A green ✅ means the latest version is live; a yellow dot means it's still publishing.

### ✅ Your site is already set up

Your files are already in `kamsinkem/portfolio`. If you haven't switched Pages on yet, do this once:

1. Go to **https://github.com/kamsinkem/portfolio**.
2. Click **⚙️ Settings**. It's the last tab along the top of the repository, *not* your account settings.
3. In the left menu, click **Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, choose **`main`**, leave the folder as **`/ (root)`**, and click **Save**.
6. Wait 1–2 minutes and refresh that page. A box at the top says **"Your site is live at …"** with a **Visit site** button.

> **Words you'll see:** a **repository** (or "repo") is your project's folder on GitHub. A **branch** is a version of that folder; `main` is the official one the website is built from. A **commit** is a saved change (like pressing "Save" with a short note).

### Updating later

See **section 4b** for the easiest way: edit or upload files directly on github.com, then click **Commit changes**. The site updates itself. If you don't see your change, hard-refresh the page (**Ctrl + Shift + R**, or **Cmd + Shift + R** on Mac).

### Optional: a shorter address

- **`https://kamsinkem.github.io`** (without `/portfolio`): in **Settings → General**, rename the repository to exactly **`kamsinkem.github.io`**.
- **Your own domain** (like `kamsinkem.com`, bought from a domain seller): in **Settings → Pages → Custom domain**, type it in and click **Save**, then follow the DNS steps GitHub shows. Tick **Enforce HTTPS** once it becomes available.

---

## Good to know

- **Light/dark mode** follows the visitor's system setting automatically.
- **Reduced motion:** if a visitor has "Reduce motion" turned on (macOS: *System Settings → Accessibility → Display*; iOS: *Settings → Accessibility → Motion*), all scroll and fade animations are switched off and everything is simply shown.
- **Animations** use [GSAP](https://gsap.com) + ScrollTrigger, loaded from the cdnjs CDN in `index.html`. If the CDN ever fails, the site still works, just without animations.
- **Sharing a project:** every project has its own page, e.g. `https://kamsinkem.github.io/portfolio/project.html?id=blind-spot-radar`.
