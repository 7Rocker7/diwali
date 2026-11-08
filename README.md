# ✨ Shubh Deepavali • Happy Diwali Wishes & Celebration Website ✨

> A vibrant, colourful, and interactive website to wish everyone a joyous, prosperous, and sparkling Diwali! Fully self-contained, mobile-friendly, and ready for 1-click deployment on **GitHub Pages**.

![Diwali Theme Preview](assets/diya.svg)

---

## 🌟 Highlights & Features

- **🎇 Interactive Fireworks & Crackers Engine**:
  - Auto-launching ambient night fireworks with multi-colored peony, ring, and chrysanthemum bursts.
  - Click or tap anywhere on screen to trigger custom fireworks bursts and flowerpots (anaar).
- **✨ Sparkler (Phuljhadi) Mode**:
  - Turn on Sparkler mode to drag your cursor or touch screen and draw dazzling golden sparkling trails with realistic crackling audio!
- **🪔 Panch Deepam (Light the 5 Sacred Diyas)**:
  - Interactive sacred ritual: click each of the 5 diyas to illuminate them (*Aarogya*, *Samriddhi*, *Shanti*, *Anand*, *Gyana*).
  - Lighting all 5 unlocks a grand finale fireworks barrage and festive petal shower!
- **🌸 Falling Flower Petals & Golden Dust**:
  - Gentle falling marigold & rose petals fluttering in 3D across the screen.
- **🪕 Pure Web Audio API Ambient Music**:
  - Meditative Indian classical Tanpura harmonic drone (Raag Yaman frequencies) and sacred temple bell chimes.
  - Zero external MP3 downloads — 100% offline, zero CORS issues, instant playback!
- **🎨 4 Vibrant Festival Color Themes**:
  - **Royal Gold** (Traditional Saffron & Purple Gold)
  - **Peacock Jewel** (Emerald, Cyan & Turquoise)
  - **Crimson Rani** (Rani Pink, Red & Ruby Gold)
  - **Golden Ambiance** (Warm Honey & Amber Radiance)
- **💌 Personalized Greetings Generator**:
  - Enter any recipient name and your name to generate a custom link (`?to=Priya&from=Rahul`).
  - One-click **Share on WhatsApp** with festive emojis and link preview.
  - One-click **Copy Link** and native mobile share support.
- **📱 100% Responsive & Zero Dependencies**:
  - Pure HTML5, CSS3, and Vanilla JavaScript.
  - No build tools, no `npm install`, runs instantly in any browser.

---

## 🚀 How to Upload to GitHub & Deploy on GitHub Pages (Free!)

You can upload this project to GitHub in either of two easy ways:

### Method 1: Using the Terminal (Recommended)

1. **Open your terminal** and navigate into the project directory:
   ```bash
   cd happy-diwali-wishes
   ```

2. **Initialize git and commit the files**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Shubh Deepavali celebration website 🪔✨"
   ```

3. **Create a new repository** on GitHub:
   - Go to [github.com/new](https://github.com/new).
   - Name it `happy-diwali` (or anything you like).
   - Keep it **Public** and leave "Add a README" unchecked.
   - Click **Create repository**.

4. **Link and push to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/happy-diwali.git
   git push -u origin main
   ```

5. **Turn on GitHub Pages**:
   - In your repository, go to **Settings** > **Pages** (under "Code and automation" in the left sidebar).
   - Under **Build and deployment** > **Branch**, select `main` and `/ (root)`.
   - Click **Save**.
   - In 30–60 seconds, your site will be live at:
     ```
     https://<YOUR-GITHUB-USERNAME>.github.io/happy-diwali/
     ```

---

### Method 2: Drag and Drop (No Git Required)

1. Go to [github.com/new](https://github.com/new) and create a repository named `happy-diwali`.
2. On the empty repo page, click **"uploading an existing file"**.
3. Drag and drop all the files and folders (`index.html`, `css/`, `js/`, `assets/`, `README.md`) into the browser.
4. Click **Commit changes**.
5. Go to **Settings** > **Pages**, choose the `main` branch, and click **Save**!

---

## 💻 How to Run Locally

Simply double-click `index.html` to open it in any web browser!

Or run a local server:

```bash
# Python 3
python3 -m http.server 8080

# Then open in browser:
http://localhost:8080
```

---

## 💌 Personalizing via URL Parameters

You can share personalized wishes directly using URL query parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `to` | Recipient's name | `?to=Aarav` |
| `from` | Sender's name | `?from=Priya` |
| `msg` | Preset message ID (`1`, `2`, `3`, `4`) | `?msg=2` |
| `text` | Custom wish text | `?text=Wishing+you+all+success!` |

**Example Link:**
```
https://<YOUR-USERNAME>.github.io/happy-diwali/?to=Sharma+Family&from=Vikram&msg=1
```

---

## 📂 Project Structure

```
happy-diwali-wishes/
├── index.html           # Main HTML structure with semantic tags & meta tags
├── css/
│   └── style.css        # Vibrant animations, gradients, torans & responsive layout
├── js/
│   ├── audio.js         # Web Audio API synthesizer for Tanpura drone & bell chimes
│   ├── fireworks.js     # Canvas fireworks, flower petals, sparkler trail physics
│   └── script.js        # Personalization parser, diya lighting, and sharing handlers
├── assets/
│   ├── diya.svg         # Traditional brass diya illustration
│   ├── lantern.svg      # Hanging Akash Kandil paper lantern
│   └── toran.svg        # Marigold flower & mango leaf garland banner
├── .gitignore           # Git ignore list
└── README.md            # Documentation and deployment instructions
```

---

## 🪔 Shubh Deepavali!

May the divine lights of Diwali illuminate your life with peace, prosperity, and joy! ✨
