# Aniket Kolhe Portfolio

A one-page developer portfolio rebuilt to match the "Spydy Portfolio" reference video section by section:

1. **Hero:** web corners, "Your friendly neighborhood AI engineer", big name with a red shadow, **Explore projects** and **AI_RESUME.PDF** buttons, and your large cut-out portrait.
2. **Two crossed tapes** scroll sideways (red on top, black behind), with small face tiles between the words.
3. **Behind the Mask:** your name, two paragraphs, the "Primary tech stack" pills, and a round photo swinging on a thread.
4. **Technical Skills:** a 2-column grid of skill cards. Hovering a card gives the red glitch effect.
5. **Projects:** a 2-column grid of project cards that lift and get a red top line on hover.
6. **Contact:** a centred form (name, email, message, red **Send message** button).

The menu bar is see-through at the top and turns into a black bar as you scroll, like in the video. Where the video shows a Marvel character, this site uses your own photo and an original cartoon spider instead. The character is copyrighted, so it can't be used.

It is plain **HTML + CSS + JavaScript**. No Node.js, no build step, no libraries, nothing to install to run it.

---

## 1. What's in the folder

```
aniket-portfolio/
├── index.html                      ← all the page content (text, projects, links)
├── css/
│   └── style.css                   ← colours, fonts, layout, animations
├── js/
│   └── main.js                     ← interactions (tapes, menu, scroll animations, form)
├── assets/
│   ├── favicon.svg                 ← browser-tab icon
│   ├── img/
│   │   ├── aniket.webp             ← your photo, background removed (the "real" face)
│   │   ├── aniket-avatar.webp      ← square crop for the About circle
│   │   ├── tape-tile.webp          ← small face picture used on the scrolling tapes
│   │   └── og-image.jpg            ← preview image for WhatsApp/LinkedIn link shares
│   └── resume/
│       └── Aniket_Kolhe_Resume.pdf ← your resume (the download buttons use this)
├── tools/
│   └── make_portrait_assets.py     ← optional: rebuild the photos from a new picture
└── README.md                       ← this file
```

**Why plain HTML/CSS/JS?** Every effect in the reference (scrolling tapes, scroll animations, glitch hover, tilting cards) can be done without a framework. That keeps the site fast, free to host anywhere, and easy for you to edit in VS Code.

---

## 2. Open it on your Windows laptop (step by step)

1. **Extract the ZIP.** Right-click `aniket-portfolio.zip` → **Extract All…** → choose a place such as `Documents` → **Extract**. You now have `Documents\aniket-portfolio\`.
2. **Install VS Code** if you don't have it: <https://code.visualstudio.com/> → download for Windows → run the installer (keep the defaults).
3. **Open the folder in VS Code.** Start VS Code → **File → Open Folder…** → select `aniket-portfolio` → **Select Folder**. If asked "Do you trust the authors?", click **Yes, I trust the authors**.
4. **Install the Live Server extension** (one time): click the **Extensions** icon in the left bar (four squares) → search **Live Server** (by Ritwick Dey) → **Install**.
5. **Run the site.** In the left file list, right-click `index.html` → **Open with Live Server**. Your browser opens at something like `http://127.0.0.1:5500/index.html`.
   - Every time you save a file (`Ctrl + S`), the browser refreshes by itself.
   - No Live Server? You can also double-click `index.html` in File Explorer. Everything works except the automatic "is the resume file there?" check.

### Check that everything works
- Scroll down: the menu bar turns black, the tapes scroll sideways (faster while you scroll), and sections slide in. The spiders drop down their threads.
- Hover a skill card (red glitch) and a project card (lifts with a red top line).
- Make the browser window narrow (or press `F12` → phone icon): the menu becomes a ☰ button.
- Click **Explore projects** (jumps to Projects) and **AI_RESUME.PDF** (downloads the PDF).

---

## 3. Your photo

The photo files are already made from the photo you sent and placed in `assets/img/`. Nothing to do.

**To change the photo later**, either:

- **Easy way:** replace the files with new ones of the **same names** (`aniket.webp`, `aniket-avatar.webp`, and optionally `tape-tile.webp`). Use a free background remover (e.g. remove.bg or Canva) for `aniket.webp`, and save as WebP or PNG. If you use PNG, change the file names in `index.html` to match.
- **Automatic way (recommended, you already know Python):** in VS Code open **Terminal → New Terminal** and run:
  ```powershell
  pip install rembg onnxruntime pillow numpy scipy
  python tools/make_portrait_assets.py C:\Users\YOU\Pictures\new-photo.jpg
  ```
  It removes the background, makes the square avatar, and also writes a spare red comic-print version (`aniket-ink.webp`) that the site doesn't use. Use a front-facing photo on a plain light background. The first run downloads a ~180 MB model.

---

## 4. Your resume

Already included at `assets/resume/Aniket_Kolhe_Resume.pdf`, and both resume links (the **AI_RESUME.PDF** button and the Contact "Resume" link) point to it. To change the button text, search `AI_RESUME.PDF` in `index.html`.

**To update it:** copy your new PDF into `assets\resume\` and name it exactly `Aniket_Kolhe_Resume.pdf` (replace the old one). Capital letters matter once the site is online.

If the file is missing when the site runs from a web server (Live Server, GitHub Pages, Netlify), the resume buttons hide themselves instead of showing a broken link.

---

## 5. Things you should fill in

### LinkedIn (currently hidden)
Your resume says "LinkedIn – Aniket Kolhe" but has no link, so the LinkedIn link under the contact form is hidden for now.

Open `js/main.js`, find this near the top and paste your profile URL:
```js
linkedin: "",
```
becomes
```js
linkedin: "https://www.linkedin.com/in/your-profile-id/",
```
Save. The LinkedIn link appears under the contact form.

### Social preview image (after you publish)
In `index.html`, find `og:image` and change `assets/img/og-image.jpg` to the full web address, e.g. `https://aniket163.github.io/assets/img/og-image.jpg`. LinkedIn and WhatsApp only show the preview with a full address.

---

## 6. Editing the content later

All text lives in `index.html`. Each section starts with a comment like `<!-- ============ PROJECTS ============ -->`, so use `Ctrl + F` in VS Code to jump to one.

| To change… | Look for… |
|---|---|
| Eyebrow / name / buttons | `<!-- ============ HERO ============ -->` |
| Words on the scrolling tapes | `data-items="AI Engineer|Generative AI|…"` (separate items with `|`) |
| About paragraphs and tech pills | `<!-- ============ ABOUT ============ -->` |
| Skill cards | `class="skill-card"`: the big name, the small grey line under it, and the label on the right |
| Project cards | `class="project-card"`: title, GitHub link, description, tags |
| Email / phone | `<!-- ============ CONTACT ============ -->` and `email:` in `js/main.js` |
| Colours | top of `css/style.css` (`--red`, `--ink`, `--bg` …) |

**Add a project:** copy one whole `<article class="project-card …"> … </article>` block, paste it after the last one, and change the text and the GitHub link. Keep an even number of cards so the 2-column grid has no gap.

**Add a skill card:** copy one `<li class="skill-card reveal"> … </li>` block. Put the same text in both the `<h3>` and its `data-text="…"` (that copy is used for the glitch effect).

**Sections left out to match the video:** the video has no Internships, Education or Work Experience sections, so they aren't here. Your degree and two internships are mentioned in the About paragraphs. The ZIP from the first version has a ready-made Internships/Education design if you want them back later.

---

## 7. Contact form: how it works

There is **no server**. When a visitor fills in the form and clicks **Send message**, the page opens *their own* email app (Gmail app, Outlook…) with your address, a subject and their message filled in. They press Send there. The page never claims the message was sent.

Empty fields are stopped by the browser's own "Please fill in this field" bubble, as in the video. If a visitor has no email app set up, nothing opens; the note under the button then shows your address, and the **Copy** button next to your email always works.

**Want messages delivered without the visitor's email app?** Use a free form service such as Formspree:
1. Sign up at <https://formspree.io>, create a form, copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`).
2. In `index.html` change `<form class="contact-form reveal" id="contact-form">` to `<form class="contact-form reveal" id="contact-form" action="https://formspree.io/f/abcdwxyz" method="POST">`.
3. In `js/main.js`, section 11, find the line that starts with `window.location.href = \`mailto:` and replace it with `form.submit();`. Two lines above it, change the `note.innerHTML = …` text to something like `"Sending…"`.

---

## 8. Publish it for free

### Option A: GitHub Pages (recommended, you already use GitHub)
1. Sign in at <https://github.com> as **Aniket163**.
2. Click **+** (top right) → **New repository**. Name it exactly **`Aniket163.github.io`**, set **Public**, click **Create repository**.
3. On the new repo page click **uploading an existing file**. Open your `aniket-portfolio` folder in File Explorer, select **everything inside it** (`index.html`, `css`, `js`, `assets`, `tools`, `README.md`) and drag it into the browser. Wait for the upload, then click **Commit changes**.
4. Go to **Settings → Pages**. Under **Build and deployment → Source** pick **Deploy from a branch**, Branch **main**, folder **/ (root)** → **Save**.
5. After 1–3 minutes your site is live at **https://aniket163.github.io**. Then do the `og:image` step in section 5.

**Updating later:** open the repo → **Add file → Upload files** → drag the changed files (same folder structure) → **Commit changes**.

### Option B: Netlify Drop (no account setup needed to try)
Go to <https://app.netlify.com/drop> and drag the whole `aniket-portfolio` folder onto the page. You get a link immediately; create a free account to keep it and choose a nicer name.

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| Photo or icons missing online | File names are case-sensitive on GitHub Pages. Check `aniket.webp` is lowercase and still in `assets/img/`. |
| Resume button disappeared | The PDF isn't at `assets/resume/Aniket_Kolhe_Resume.pdf` (check spelling and capitals). |
| My edits don't show | Save the file (`Ctrl + S`), then hard-refresh the browser with `Ctrl + F5`. On GitHub Pages wait 1–2 minutes. |
| Fonts look plain | The headline fonts load from Google Fonts, so you need internet. Offline, a fallback font is used. |
| No animations | Windows **Settings → Accessibility → Visual effects → Animation effects** is off. The site respects that setting on purpose. |
| "Write the email" does nothing | No default email app on that computer. Use the Copy button, or switch to Formspree (section 7). |
| LinkedIn link missing | Fill in `linkedin:` in `js/main.js` (section 5). |
| Menu stays open on phone | Tap ✕ or any menu link. If you edited `main.js`, check the browser console (`F12` → Console) for red errors. |
| Something broke after editing | Undo with `Ctrl + Z`, or compare with the original file from the ZIP. A missing `</div>` or quote is the usual cause. |

---

## 10. Final checklist before sharing the link

- [ ] Hero: pencil webs, eyebrow, name with red shadow, both buttons, your photo
- [ ] Menu bar turns black after scrolling; menu links jump to About, Skills, Projects, Contact
- [ ] Crossed tapes scroll sideways
- [ ] About photo swings on its thread and turns colour on hover
- [ ] Skill cards glitch red on hover; project cards lift with a red top line
- [ ] Phone view: ☰ menu opens and closes, nothing is cut off, no sideways scrolling
- [ ] AI_RESUME.PDF downloads the latest PDF
- [ ] Every GitHub link opens the right repository
- [ ] LinkedIn URL filled in (`js/main.js`) and the link appears under the form
- [ ] Send message opens your email app with the message filled in; Copy copies your email
- [ ] `og:image` changed to the full URL after publishing
- [ ] Your GitHub repos match what the site says (see note below)

### Note about two of your GitHub repositories
While building the Projects section I read each repository:
- **Agentic-AI-Book-Recommender** currently contains the Bitcoin sentiment files (`analysis.py`, `fear_greed_index.csv`, the trading report), not the Streamlit/Groq book recommender code.
- **AI-Invoice-Parser-Analytics-System** contains only `Dockerfile`, `docker-compose.yml`, `requirements.txt` and `README.md`; the `app/` code its README describes is not pushed.

Recruiters will click these from your first two project cards, so it's worth pushing the real code before you share the portfolio.

---

## 11. Credits and honesty notes

- All web graphics (webs, spiders, tapes) are original drawings generated in code. No film or comic artwork is used, and the footer says the site is not affiliated with any studio.
- Every fact on the site comes from your resume or your public GitHub repositories. Project numbers (95%+, 18+ APIs) are the figures from your resume.
- Font: Outfit from Google Fonts (free, Open Font License).
