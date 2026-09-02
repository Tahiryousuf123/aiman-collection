# Mobile Performance Enhancements – Resolve Remaining Flicker & Lag

**Goal**: Eliminate the persistent flickering and lag observed on mobile devices after the initial optimization. Ensure smooth, buttery‑fluid interactions across the entire site on small viewports.

## User Review Required

> [!IMPORTANT] 
> The plan introduces additional mobile‑specific CSS overrides and image optimizations that will affect visual fidelity on high‑density screens. Please confirm that you are comfortable with the following visual changes:
> - Reduced/shadow‑less cards on mobile.
> - Disabled `backdrop-filter` (blur) on the sticky header and other glass‑morphism elements.
> - Serving compressed WebP images for hero/hero‑card visuals.
> - Potential slight change in gradient text appearance (solid color will be used on mobile).

## Open Questions

> [!WARNING] 
> 1. Do you want the hero image to use a lower‑resolution placeholder with lazy‑load (blur‑up) effect, or simply load the compressed image directly?
> 2. Should we globally replace all `backdrop-filter` usage on mobile, or keep it only for the top announcement bar?
> 3. Are there any specific sections (e.g., product cards, deal cards) where you *must* retain the current heavy shadows?

---

## Proposed Changes

### CSS – Mobile Overrides (`styles.css`)
- **Disable backdrop‑filter on sticky header & hero**
  ```css
  @media (max-width: 480px) {
    .site-header,
    .hero-section {
      backdrop-filter: none !important;
      background: var(--color-bg-main);
    }
  }
  ```
- **Simplify shadows for cards, deal cards, and modal overlays**
  ```css
  @media (max-width: 480px) {
    .card, .deal-card, .modal-card {
      box-shadow: none !important;
    }
  }
  ```
- **Replace gradient text with solid color** (already applied, reinforce with higher specificity)
  ```css
  @media (max-width: 480px) {
    .gradient-gold, .gradient-rose {
      background: var(--color-gold-primary) !important;
      -webkit-background-clip: initial;
      -webkit-text-fill-color: initial;
      color: var(--color-gold-primary);
    }
  }
  ```
- **Add `will-change` for frequently animated elements** (buttons, fade‑slide‑in, hero‑visual)
  ```css
  @media (max-width: 480px) {
    .btn, .fade-slide-in, .hero-visual {
      will-change: transform, opacity;
    }
  }
  ```

### JavaScript – Debounce Scroll & Resize Events (`app.js`)
- Locate any `window.addEventListener('scroll', ...)` handlers and wrap them with a debounce (250 ms).
- Example wrapper:
  ```js
  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  };
  // usage
  window.addEventListener('scroll', debounce(handleScroll, 250));
  ```
- Apply similar debouncing to resize listeners and any rapid UI state updates.

### Image Optimization (`index.html` & Asset Pipeline)
- Convert high‑resolution JPEG/PNG assets (hero, deal cards, product thumbnails) to WebP using lossless compression (~30‑40 % size reduction).
- Update `<img>` tags to use `srcset` with WebP fallback for browsers that do not support it.
  ```html
  <picture>
    <source srcset="images/luxury_rida.webp" type="image/webp" />
    <source srcset="images/luxury_rida.jpg" type="image/jpeg" />
    <img src="images/luxury_rida.jpg" alt="..." loading="lazy" class="hero-card-img" />
  </picture>
  ```
- For the hero visual (`#heroVisualImg`), add a low‑res placeholder and swap when fully loaded.

### Asset Build / Cache Busting
- Append a version query string (e.g., `styles.css?v=15.0`) to force browsers to fetch the updated CSS.
- Ensure the local development server (`http-server`) is restarted after changes.

## Verification Plan

### Automated Tests
- Run the local dev server (`npx http-server ./ -p 3000 -c-1`) and open Chrome DevTools Device Mode with a representative mobile viewport (iPhone X, 375 × 812).
- Verify no console warnings about `backdrop-filter` deprecation on mobile.
- Use Lighthouse Mobile performance audit; target **Performance score ≥ 93** and **First Contentful Paint < 1.5 s**.

### Manual Verification
- Open the site on an actual Android device (or emulator) and interact with:
  1. Page scroll – ensure no jitter.
  2. Header stickiness – confirm header remains stable without blur.
  3. Hero section – confirm image loads quickly and transitions are smooth.
  4. Product grid – scroll through many items; verify images lazy‑load without stutter.
  5. Deal cards – confirm no heavy shadow flicker.
- Capture short screen recordings (WebM) for the walkthrough artifact.

---

**Next Steps**
1. Obtain user confirmation on the open questions above.
2. Once approved, implement the changes and run the verification steps.
3. Update the `walkthrough.md` artifact with performance metrics and visual proof.
