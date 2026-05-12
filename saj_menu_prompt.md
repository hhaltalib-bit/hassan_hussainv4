# PROJECT PROMPT — Saj Al Reef Digital Menu

---

## Project Overview

Build a fully interactive, Arabic-first digital menu for **Saj Al Reef Restaurant**
(Karada Branch — Baghdad, Iraq).

The menu must:
- Run in a browser as a standalone HTML file OR be embeddable inside a mobile app via WebView
- Support right-to-left (RTL) layout throughout
- Display all menu items in Arabic with English subtitles
- Load food images from a remote GitHub repository
- Be deployable on GitHub Pages with zero backend

---

## Brand Identity & Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--gold` | `#DCA95C` | Primary accent, active states, prices |
| `--gold-light` | `#e8c07a` | Hover highlights |
| `--gold-dark` | `#b8872a` | Gradients, section lines |
| `--terra` | `#BF7A54` | Secondary accent, card left-border glow |
| `--bg` | `#0a0a0a` | Page background |
| `--card-bg` | `#111111` | Menu item card background |
| `--white` | `#FFFFFF` | Primary text |
| `--border` | `rgba(220,169,92,0.25)` | Card and section borders |

### Typography
| Role | Font | Weight |
|------|------|--------|
| Arabic headings & brand name | Tajawal | 700, 800 |
| Section titles | Tajawal | 700 |
| Body / item names | Tajawal | 600 |
| English subtitles & prices | Playfair Display | 400, 600 |

Load both fonts from Google Fonts.

### Logo
- The restaurant logo is a **black square** with diagonal gold/white zebra-stripe lines and a white italic "S" overlaid
- The bottom strip reads "SAJ ALREEF" in small gold caps
- Logo file: `logo.png` — embedded as base64 in the HTML so the file is fully self-contained
- Display size: **150×150px**, with a 2px gold border, 8px border-radius, and a gold radial glow shadow

---

## Layout & Structure

### Hero Section
- Full-width dark header with a diagonal stripe texture pattern (CSS repeating-linear-gradient at 45°)
- Centered radial gold glow behind the logo
- Logo displayed at top center (150×150px)
- Restaurant name in Arabic: **صاج الريف** (large, gold, Tajawal 700)
- Subtitle in English: **SAJ AL REEF** (small, Playfair Display, faded gold, wide letter-spacing)
- Thin gold divider line below the name
- Branch text: **فرع الكرادة — بغداد** (small, faded white)
- Bottom border: 1px gold-tinted line

### Navigation Bar
- Sticky at the top of the viewport (stays visible while scrolling)
- Horizontally scrollable, no visible scrollbar
- RTL direction: tabs begin from the **right side** in Arabic reading order
- First visible tab on the right = first category (Soups)
- Each tab is a text-only button (no icons or emojis) — Arabic category name only
- Active tab has gold text + gold 2px bottom border
- Inactive tabs are faded white, gold on hover
- Background: near-black with backdrop blur

### Menu Sections
- Only one section visible at a time (tab-based navigation)
- Smooth fade + slide-up animation on section switch (CSS keyframe)
- Each section has a header row containing:
  - A circular gold badge on the right showing the section number (e.g. 01, 02 …)
  - Arabic section title (large, gold, Tajawal)
  - A decorative line extending to the left (gold gradient fading to transparent)

### Menu Item Cards
- Displayed in a CSS Grid: `repeat(auto-fill, minmax(280px, 1fr))`
- Gap: 14px
- Each card contains (right to left):
  1. **Item info block** (flex: 1, text-align right):
     - Arabic name (white, 0.9rem, bold)
     - English name (faded, italic, Playfair Display, 0.7rem)
  2. **Price block** (left side, gold, Playfair Display):
     - Format: `X,XXX د.ع`
     - For ranged prices (small / large sizes): `X,XXX – X,XXX د.ع` at smaller font
  3. **Image slot** (80×70px, left-most position):
     - Shows a dark placeholder box with dashed gold border and centered "+ صورة" text when no image is set
     - When `img` property is provided on the item, renders `<img>` filling the box with `object-fit: cover`

- Card styling:
  - Background: `#111111`
  - Border: 1px, `rgba(220,169,92,0.25)`
  - Border-radius: 10px
  - On hover: border brightens, card lifts 2px, a 3px gold-to-terra vertical stripe appears on the right edge

### Footer
- Centered text: restaurant name + branch + "جميع الأسعار بالدينار العراقي"
- Faded gold/white colors
- Top border: 1px gold-tinted

---

## Data Architecture

All menu data lives in a single JavaScript array called `menuData`.
Each category object follows this shape:

```js
{
  id: 'soups',          // unique string ID, used as HTML section ID
  label: 'الشوربات',    // Arabic category name shown in nav and section header
  icon: '01',           // two-digit number displayed in the section badge
  items: [
    {
      a: 'شوربة العدس',       // Arabic item name
      e: 'Lentil Soup',       // English subtitle
      p: '3,500',             // price string (already formatted with comma)
      r: false,               // true if price is a range (small–large)
      img: 'lentil-soup.jpg'  // optional — filename only, base URL prepended at runtime
    },
    // ...
  ]
}
```

### Image URL Strategy
Define a single base URL constant at the top of the script:

```js
const BASE_IMG = "https://raw.githubusercontent.com/USERNAME/REPO/main/images/";
```

In the card template, resolve the full URL:
```js
it.img ? `<img src="${BASE_IMG}${it.img}" alt="${it.a}">` : placeholder
```

This means:
- Adding/changing an image = set `img: 'filename.jpg'` on the item object
- Moving the repo = change only `BASE_IMG`
- Items with no `img` property show the placeholder automatically

---

## Categories (in order, right to left in nav)

01 الشوربات — Soups
02 السلطات — Salads
03 مقبلات ساخنة — Hot Appetizers
04 مقبلات باردة — Cold Appetizers
05 المناقيش — Manakish
06 الفاست فود — Fast Food
07 صاج مميز — Signature Saj
08 الصاج — Saj
09 البيتزا — Pizza
10 المطبخ الشرقي — Eastern Kitchen
11 المطبخ الأوروبي — European Kitchen
12 المطبخ الصيني — Chinese Kitchen
13 نباتي — Vegetarian
14 المشاوي — Grills
15 وجبات أطفال — Kids Meals
16 الحلويات — Desserts
17 مشروبات ساخنة — Hot Drinks
18 عصائر طازجة — Fresh Juices
19 ميلك شيك — Milkshakes
20 كوكتيلات — Cocktails
21 فرابتشينو — Frappuccino
22 النرجيلة — Shisha
23 نرجيلة طازجة — Fresh Shisha

---

## Functional Behavior

### Tab Navigation
- Clicking a tab:
  1. Removes `.active` class from all tabs and sections
  2. Adds `.active` to clicked tab and its matching section
  3. Auto-scrolls the clicked tab into view (inline: center) within the scrollable nav
- On first load: first tab and first section are active by default

### Section Rendering
- Sections are rendered dynamically by JavaScript (not hard-coded HTML)
- Loop through `menuData`, for each category:
  - Create a `<button>` in the nav with the category label
  - Create a `<section>` in main with the section header + items grid
  - Inject the full card HTML via `innerHTML` template literals

### Animations
- Section reveal: `opacity 0 → 1` + `translateY(16px → 0)` over 0.4s ease

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>600px) | Grid: auto-fill, min 280px columns |
| Mobile (≤600px) | Grid: single column, brand name font reduces to 2rem |
| Nav | Always horizontally scrollable regardless of screen width |

---

## Deployment

- The final output is a **single `.html` file**
- The restaurant logo is embedded as a base64 data URI inside the file (no external logo dependency)
- Google Fonts are loaded via CDN link tag
- Food images are loaded from GitHub raw CDN at runtime
- Deploy to **GitHub Pages**: push the HTML file to the repo, enable Pages on the main branch

### GitHub Repository Structure (recommended)
```
/
├── index.html          ← the menu file
├── images/
│   ├── lentil-soup.jpg
│   ├── shrimp-saj.jpg
│   ├── beef-burger.jpg
│   └── ...
└── README.md
```

---

## What Is Already Built

The current working version (HTML + CSS + Vanilla JS) includes:
- Full RTL layout
- All 23 categories with complete item data (200+ items)
- Real logo embedded as base64
- Image placeholder slots on every card
- Gold/black luxury dark theme
- Sticky scrollable nav starting from right
- Hover animations on cards
- Section number badges
- Bilingual item names (Arabic + English)
- Ranged price formatting

---

## What Still Needs To Be Done

- [ ] Add `img` filename to each item object once photos are ready
- [ ] Set `BASE_IMG` to the actual GitHub raw URL
- [ ] Upload food images to the `/images/` folder in the repo
- [ ] Build English version (same structure, swap Arabic ↔ English labels)
- [ ] Optional: add search/filter functionality
- [ ] Optional: rebuild in React Native / Flutter for native mobile app

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Markup | HTML5, semantic elements |
| Styling | CSS3 (custom properties, grid, flexbox, keyframes) |
| Logic | Vanilla JavaScript ES6+ (template literals, forEach, createElement) |
| Fonts | Google Fonts (Tajawal, Playfair Display) |
| Images | GitHub raw CDN |
| Hosting | GitHub Pages |
| Dependencies | **Zero** — no frameworks, no npm, no build step |
