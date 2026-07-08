# Day 1 Project — Personal Portfolio (Fill-in-the-Blank)

Build a complete static portfolio using **only HTML + CSS**. Every section is scaffolded with `TODO` comments — your job is to fill them in.

## Setup

1. Open `index.html` in your browser (double-click or use Live Server).
2. Keep DevTools open (F12) — inspect elements as you style them.
3. Edit `styles/main.css` alongside `index.html`.

## Build Checklist

### HTML (`index.html`)

- [ ] Descriptive `<title>` and meta description
- [ ] Skip link for accessibility
- [ ] Sticky `<nav>` with logo + anchor links (About, Skills, Projects, Contact)
- [ ] Hero: `<h1>`, tagline, CTA button linking to `#contact`
- [ ] About: media-object layout (`<figure>` + paragraphs)
- [ ] Skills: 6+ skill cards in a grid container
- [ ] Projects: 3+ project cards with title, description, link
- [ ] Contact: labeled form (name, email, subject, message) with validation attributes
- [ ] Footer: copyright with `<time datetime="YYYY">`

### CSS (`styles/main.css`)

- [ ] CSS variables for colors, spacing, typography
- [ ] `box-sizing: border-box` on all elements
- [ ] Sticky navbar with flexbox (logo left, links right)
- [ ] Hero centered with flexbox; optional `@keyframes` fade-in
- [ ] About section: two-column layout (stacks on mobile)
- [ ] Skills grid: `repeat(auto-fill, minmax(...))` — no media query for columns
- [ ] Project cards with `:hover` transition
- [ ] Form inputs styled with visible `:focus` state
- [ ] Responsive at **375px**, **768px**, **1280px**
- [ ] (Bonus) `prefers-color-scheme` light/dark toggle via variables

## How to Work Through TODOs

1. Read the `TODO` comment.
2. Write your attempt in the `YOUR IDEA` space (in comments) or directly in code.
3. Uncomment or peek at `ANSWER` hints only if stuck for 10+ minutes.
4. Refresh the browser after every small change.

## Self-Test

- [ ] Tab through the page — can you reach every link and form field?
- [ ] Resize to 375px — nothing overflows horizontally?
- [ ] All anchor links scroll to the right section?
- [ ] Form shows browser validation when fields are empty?

## No Cheating

- No Tailwind, Bootstrap, or CSS frameworks
- No JavaScript (that's Day 2+)
- If stuck on layout, re-read `day01-html-css/css/03-flexbox.css` and `04-grid-and-responsive.css`
