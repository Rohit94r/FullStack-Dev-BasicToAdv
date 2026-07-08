# Day 1 — HTML + CSS Interview Questions & Answers

Answer every question OUT LOUD without looking.
Only read the answer after you have tried to answer it yourself.

---

## SECTION A — HTML Fundamentals

**Q1. What is HTML and what role does it play in a webpage?**
A: HTML (HyperText Markup Language) is the structure and content of a webpage.
   It defines WHAT is on the page — headings, paragraphs, images, links.
   Think: HTML = skeleton, CSS = skin, JavaScript = muscles.

**Q2. What does DOCTYPE do? What happens if you leave it out?**
A: `<!DOCTYPE html>` tells the browser to render the page in HTML5 standards mode.
   Without it, browsers enter "quirks mode" — they try to guess which old HTML version
   to use and render things inconsistently across browsers. Always put it on line 1.

**Q3. What is the difference between `<head>` and `<body>`?**
A: `<head>` — metadata about the page. Not visible to users.
   Contains: title, charset, meta tags (viewport, description), links to CSS, favicon.
   `<body>` — everything the user sees and interacts with.

**Q4. What is the viewport meta tag and why is it needed?**
A: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
   Without it, mobile browsers zoom out to fit the desktop version of the page.
   This tag tells them: use the device's real width, don't zoom. Required for responsive design.

**Q5. Difference between `id` and `class`?**
A: id    → unique per page (only ONE element can have it). Use for anchors and JS targeting.
   class → reusable (many elements can share the same class). Use for CSS styling.
   In CSS: #myId vs .myClass. In JS: getElementById vs querySelectorAll.

**Q6. Difference between `<b>` and `<strong>`, `<i>` and `<em>`?**
A: `<b>` / `<i>` → visual only. Bold or italic with no semantic meaning.
   `<strong>` / `<em>` → semantic meaning. `<strong>` means "important",
   `<em>` means "emphasis." Screen readers may read them differently.
   Always prefer semantic tags.

**Q7. What is semantic HTML? Give 5 examples of semantic tags.**
A: Semantic HTML uses tags that describe the PURPOSE of their content, not just appearance.
   Examples: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`,
   `<time>`, `<figure>`, `<figcaption>`, `<address>`.
   Why: better SEO (search engines understand structure), better accessibility
   (screen readers understand the page layout), easier code to maintain.

**Q8. What is the difference between `<article>` and `<section>`?**
A: `<article>` → standalone content that makes sense on its own if shared elsewhere.
   Example: blog post, news article, product card, forum post.
   `<section>` → thematic group within a larger context. Needs the surrounding page to make sense.
   Rule: if you could share it as-is → article. If it needs context → section.

**Q9. What does the `alt` attribute on `<img>` do? Why is it required?**
A: alt text is shown when the image fails to load.
   Screen readers (for blind users) read the alt text to describe the image.
   Search engines index alt text for image SEO.
   Always required for accessibility. If image is purely decorative, use alt="" (empty, not missing).

**Q10. Difference between GET and POST in HTML forms?**
A: GET  → data goes in the URL as query string (?name=rohit&age=25). Visible, bookmarkable,
          cached, length-limited. Use for: search, filters, pagination.
   POST → data goes in the request body. Hidden, no length limit, not cached.
          Use for: login, signup, payment, anything with sensitive or large data.
   Rule: GET for reading data, POST for sending/changing data.

**Q11. What does the `required` attribute on form inputs do? Is it enough?**
A: It adds browser-side validation — the form won't submit if the field is empty.
   But NO — it is NOT enough. Users can disable browser validation.
   Always validate on the SERVER too. Client-side validation = UX convenience.
   Server-side validation = actual security.

**Q12. What is the difference between `<script>` at the top vs bottom of body?**
A: Top → browser downloads and runs the script before rendering HTML. Page appears blank.
   Bottom (before `</body>`) → HTML renders first, then script runs. Better UX.
   Modern approach: `<script defer src="app.js">` anywhere in `<head>` — loads in parallel,
   runs after HTML is parsed. This is the best practice.

**Q13. What is the difference between inline styles, internal styles, and external stylesheets?**
A: Inline  → style attribute on element. Highest specificity. Hard to maintain. Avoid.
   Internal → `<style>` tag in `<head>`. OK for small pages or email templates.
   External → separate .css file. Cached, reusable, maintainable. Always use this for real projects.

**Q14. What are HTML entities? Give 3 examples.**
A: Special codes for characters that have meaning in HTML or can't be typed easily.
   `&lt;`  → < (less-than, would be misread as a tag)
   `&gt;`  → > (greater-than)
   `&amp;` → & (ampersand — would be misread as start of entity)
   `&copy;` → © `&nbsp;` → non-breaking space `&euro;` → €

**Q15. What is the difference between `display: none` and `visibility: hidden`?**
A: `display: none`      → element is REMOVED from layout. Takes no space. Like it doesn't exist.
   `visibility: hidden` → element is INVISIBLE but still takes up its space.
   Use case: display:none for toggling menus/modals. visibility:hidden when you need space reserved.

---

## SECTION B — CSS Fundamentals

**Q16. What is the CSS box model?**
A: Every element is a box with 4 layers from inside out:
   Content → Padding → Border → Margin
   Padding: space inside the border (has background color)
   Margin:  space outside the border (transparent, separates from other elements)
   Use `box-sizing: border-box` so width includes padding+border (predictable sizing).

**Q17. What is `box-sizing: border-box` and why always use it?**
A: By default, `width` = content width only. Adding padding/border makes the element WIDER than you set.
   With `border-box`: `width` includes padding AND border. The element stays the exact width you set.
   Apply globally: `*, *::before, *::after { box-sizing: border-box; }` — do this on every project.

**Q18. What is CSS specificity? How is it calculated?**
A: Specificity determines which rule wins when multiple rules target the same element.
   Score (highest to lowest):
   - `!important` → overrides all (use sparingly!)
   - Inline style  → (1,0,0,0)
   - ID selector   → (0,1,0,0)  e.g. #header
   - Class, attribute, pseudo-class → (0,0,1,0) e.g. .card, [type], :hover
   - Element, pseudo-element → (0,0,0,1) e.g. p, ::before
   Same specificity → last rule wins (the cascade).

**Q19. What does "cascading" mean in CSS?**
A: CSS rules cascade (flow) from top to bottom. Later rules override earlier ones IF same specificity.
   Also: styles from parent elements cascade down to children (inheritance).
   Not all properties inherit — color/font do, margin/padding do not.

**Q20. What are the 5 values of `position` and what does each do?**
A: static   → normal flow (default). top/left/right/bottom have no effect.
   relative  → offset from its own normal position. Other elements unaffected. Used as anchor for absolute children.
   absolute  → removed from flow. Positioned relative to nearest positioned ancestor (not static). Scrolls with page.
   fixed     → removed from flow. Positioned relative to viewport. Stays on screen when scrolling.
   sticky    → hybrid. Acts relative until it hits the threshold (top:0), then becomes fixed.

**Q21. When would you use `position: absolute` vs `position: fixed`?**
A: absolute → for elements positioned within a parent (tooltips, badges, dropdown menus).
              Scrolls with the page.
   fixed    → for elements that should stay on screen always (navbar, chat button, cookie banner).
              Does NOT scroll with the page.

**Q22. Difference between `margin` and `padding`?**
A: Padding → space INSIDE the border. Between content and border edge.
             Has the element's background color.
   Margin  → space OUTSIDE the border. Separates this element from others.
             Always transparent. Never has background color.
             Vertical margins collapse (two adjacent margins merge to the larger one).

**Q23. What is flexbox and what problem does it solve?**
A: Flexbox is a 1D layout system — arranges items in one direction (row or column).
   It solved the nightmare of:
   - Centering things vertically (previously needed hacks)
   - Equal-height columns
   - Space distribution between items
   Key: display:flex on parent, then justify-content (main axis) and align-items (cross axis).

**Q24. `justify-content` vs `align-items` — what is the difference?**
A: justify-content → distributes items along the MAIN axis (horizontal in row, vertical in column).
                    Values: flex-start, flex-end, center, space-between, space-around, space-evenly.
   align-items    → aligns items along the CROSS axis (vertical in row, horizontal in column).
                    Values: flex-start, flex-end, center, stretch, baseline.
   Memory trick: just = main axis, align = cross axis.

**Q25. How do you center an element both horizontally and vertically?**
A: Method 1 — Flexbox (most common):
   parent { display: flex; justify-content: center; align-items: center; }
   Method 2 — Grid:
   parent { display: grid; place-items: center; }
   Method 3 — Absolute + transform:
   child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

**Q26. What is CSS Grid and when do you use it vs Flexbox?**
A: Grid is a 2D layout system — controls both rows AND columns simultaneously.
   Use Flexbox for: component-level layouts in one direction (navbar, button group, card row).
   Use Grid for: page-level layouts that need both axes (page template, image gallery, dashboard).
   They complement each other — use both in the same project.

**Q27. What is a media query? What is mobile-first design?**
A: Media queries apply CSS conditionally based on screen size or device property.
   `@media (min-width: 768px) { ... }` — applies when screen is 768px or wider.
   Mobile-first: write base CSS for mobile. Add media queries for larger screens (min-width).
   Why: most users are on mobile. Mobile-first forces you to prioritize content.

**Q28. What is the difference between `em`, `rem`, and `px`?**
A: px  → absolute pixels. Always the same size regardless of context.
   em  → relative to PARENT element's font-size. Can compound in nested elements (confusing).
   rem → relative to ROOT element's (html) font-size. Always predictable. PREFERRED.
   Use rem for font sizes and spacing. px for borders and fine details.

**Q29. What are CSS custom properties (CSS variables)?**
A: Variables defined in CSS, usually in `:root { --primary: #3498db; }`.
   Used via: `color: var(--primary);`. Can be overridden in any nested scope.
   Why: change a color once → updates everywhere. Essential for theming and dark mode.

**Q30. What is a CSS transition vs a CSS animation?**
A: Transition → smooth change between TWO states triggered by a state change (hover, focus, class toggle).
               `transition: background-color 0.3s ease;`
   Animation  → multi-step sequence with @keyframes. Can loop, delay, reverse independently.
               `@keyframes fadeIn { from{opacity:0} to{opacity:1} }`
   Use transition for simple hover effects. Use animation for loading spinners, complex sequences.
