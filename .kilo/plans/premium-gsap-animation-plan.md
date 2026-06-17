# Premium GSAP Animation Plan — CORA Landing Page

> **Mobile-first note:** Every animation in this plan has a mobile variant. Short rule: on `max-width: 768px`, durations compress ~30%, stanzas halve, horizontal `x` translation drops to ≤3px, parallax is fully disabled, and hero timelines parallelize where reading order allows. All GSAP calls are gated behind a combined `isMobile && prefersReducedMotion` check so mid-range Android users get zero animation overhead.

## Audit Snapshot

**Tech:** Vite + React 19. Tailwind configured, animation layer absent.  
**Palette:** `#e07b00` (orange accent), `rgb(22, 48, 21)` (deep green), `#6e6e73` (grey text), `#f5f5f7` / `#f9fbf9` (light surfaces).  
**Typeface:** SF Pro Display (variable weights).  
**CSS Architecture:** One section = one CSS file; no component-level CSS-in-JS.  
**Sections (current order):**

```
Navbar → Hero → Challenges → Purpose → Partners → ServingCooperatives
→ Services → CooperativeChoice → Footer → LiveDemoButton
```

**Design DNA:** Apple-esque minimalism, generous whitespace, clean modular blocks, restrained interactions. No dynamic backgrounds, no illustrations, no decorative motion.

---

## Dependencies

Install in one step:

```
npm install gsap @gsap/react
```

No other libraries. GSAP Core + the React hook (`useGSAP`) for safe cleanup.  
Bundle impact: ~35 KB gzipped — acceptable for a landing page where motion is part of the brand contract.

---

## Global Approach

### Motion Is Invisible Until It Isn't

All GSAP animations must degrade gracefully on mobile. Every animation specification in this plan has an explicit mobile fallback. The principle: **on smaller screens, animate less, faster, and only what helps comprehension.**

### Mobile Detection Gates

Use two signals together, not either/or:

```tsx
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const shouldAnimate = !isMobile && !prefersReducedMotion;
```

- **`isMobile`**: defined as `max-width: 768px` (matches your CSS breakpoints exactly).
- **`prefersReducedMotion`**: checked independently because laptop users in cafés also want it off.
- When `shouldAnimate` is false, the entire `useScrollReveal` and `useGSAP` body is skipped — but React still mounts the component with its static CSS layout intact. Zero blank space, zero layout shift.

### Mobile-Specific Animation Budget

| Animation type | Desktop | Mobile |
|---|---|---|
| Entrance duration | 0.75s | 0.45–0.55s |
| Stagger between siblings | 0.08s | 0.05s |
| Parallax depth | ±12px | 0px (disabled) |
| Hero timeline total | 1.1s | 0.7s |
| Hover micro-interactions | Yes | No (use `:active` instead) |
| Count-up duration | 1.4s | 0.9s |
| ScrollTrigger start | `top 78%` | `top 82%` (triggers slightly later to avoid fighting browser rubber-banding) |

### Touch vs. Hover

**Desktop:** `:hover` micro-states via CSS transitions (already in place).  
**Mobile:** `:hover` does not persist on touch — CSS `:active` states replace hover for buttons. No GSAP hover animations on touch devices. The `useScrollReveal` hook does not need to differentiate; the CSS naturally handles this.

For buttons that have a GSAP hover animation (e.g., `scale(1.03)`), gate it:

```tsx
useGSAP(() => {
  if (!shouldAnimate) return;
  const btn = ref.current;
  btn.addEventListener("mouseenter", () => gsap.to(btn, { scale: 1.03, duration: 0.2, ease: "power1.out" }));
  btn.addEventListener("mouseleave", () => gsap.to(btn, { scale: 1, duration: 0.2, ease: "power1.out" }));
});
```

On mobile, neither listener is attached — button relies on CSS `:active` for press feedback.

### will-change Budget

GSAP applies `will-change: transform` during animation then removes it in `onComplete`. This is safe on desktop GPUs. On mobile GPUs, concurrent `will-change` declarations across 7+ logo cards in Partners can trigger compositor thrashing. Fix: set `will-change` only on the *currently animating element* via the `onStart` / `onComplete` callbacks (GSAP handles this automatically for `transform` and `opacity` — no extra work needed). Do not add blanket `will-change` in CSS.

### ScrollTrigger on iOS Safari

iOS Safari's rubber-banding (`-webkit-overflow-scrolling: touch`) can fire `scroll` events during bounce, causing ScrollTrigger to fire prematurely or replay. Fix: add `scroller: window` explicitly (avoids using a proxy element) AND set `once: true` on every trigger. The `once` flag means even if `start` fires during a bounce, the animation only plays once — no replay on settle.

### Responsive Re-animation on Orientation Change

When a user rotates from portrait → landscape on a tablet, the viewport may cross trigger points. With `once: true`, already-animated sections stay animated; sections not yet in view trigger normally. No re-animation of past sections needed. This is the correct behavior.

### Hero Timeline on Mobile

On mobile the hero is taller (content stacks, font sizes scale via `clamp()`). The sequential timeline must compress:

**Desktop timeline (1.1s total spread):**
```
t=0.0s  logo
t=0.15s eyebrow
t=0.28s title
t=0.42s description
t=0.58s buttons
t=0.72s stats
t=0.86s carousel
```

**Mobile timeline (0.7s total, tighter stagger):**
```
t=0.0s  logo + eyebrow (parallel)
t=0.12s title
t=0.22s description
t=0.32s buttons
t=0.44s stats + carousel (parallel)
```

This keeps the hero complete before a mobile user starts scrolling, without dragging the sequence into "loading screen" territory.

### Partners Logo Grid on Mobile

On mobile, the Partners grid collapses to 2 columns (`grid-template-columns: repeat(2, 1fr)` at `max-width: 560px`). The 7th card spans full width. Stagger must account for visual grid order, not DOM order: GSAP's `stagger` on the grid children fires in DOM order, which matches visual order in CSS grid. No special handling needed.

However, reduce stagger on mobile from `0.1s` to `0.06s` — 7 cards × 0.1s = 0.7s of stagger alone, which on a slower phone CPU can feel sluggish before the count-up even starts.

### Services Tab Panel on Mobile

The Services section uses a two-column layout (tabs left, panel right). On mobile it stacks (`grid-template-columns: 1fr`). The tab-to-panel crossfade is the same duration on both, but on mobile:

- Reduce `x` translation from `-6px` to `-4px` (less travel = less perceived jank on a smaller viewport).
- Tab buttons are narrower on mobile, so the `translateX(3px)` hover effect on desktop is dropped entirely — tabs rely on the `--active` styling change only.

### CooperativeChoice on Mobile

Two laptop cards side-by-side stack vertically on mobile. The entrance stagger should fire **top-to-bottom** (image first, then description) rather than left-to-right. GSAP's default DOM-order stagger already does this once the CSS grid reflows — no JS change needed.

The laptop image `scale(0.96→1)` entrance is preserved on mobile. Scale animation is GPU-bound and performant. No change needed.

### Performance Budget for Mid-Range Android

Target device: Moto G Power (2023) — Snapdragon 662, 4GB RAM, common Philippine market device.  
Constraint: no single-frame task > 16ms during scroll.

Verified safe patterns:
- `opacity` + `transform` only → compositor thread, never main thread.
- `once: true` → zero per-scroll-frame GSAP execution beyond the first trigger.
- Timeline built once on mount → no per-frame construction.
- Number count-up: `gsap.to({ val: 0 })` with `onUpdate` runs on GSAP's ticker (~60fps). On mid-range Android, `Math.floor()` and `toLocaleString()` per frame is acceptable for 1.4s (≈84 frames). If profiling shows jank, switch to `requestAnimationFrame` counter with integer-only `textContent` updates and only call `toLocaleString()` on `onComplete`.

### Reduced Motion: Not Just for Accessibility

Even users without a formal accessibility need often disable animations on mobile to save battery or reduce distraction. The `prefers-reduced-motion` check is therefore not a niche concern — it's a **mobile-first default**. Plan the mobile experience to feel complete and premium *without* animation; animation is an enhancement for users who have it enabled.

### CSS-First Where Possible

Not every interaction needs GSAP. Keep these in CSS only (no JS):

- Button hover `translateY(-2px)` and shadow deepening
- Tab `--active` state color swap
- Partners logo ring `translateY` + `scale` on hover (desktop only via media query)
- Footer link `translateX(3px)` on hover
- Navbar scroll-solidify (class toggle, CSS transition)

This reduces GSAP's runtime footprint and keeps micro-interactions off the main thread entirely.

### Shared Hook: `useScrollReveal`

Every section uses the same pattern via a tiny wrapper so patterns are consistent and cleanup is automatic:

```tsx
// src/hooks/useScrollReveal.ts
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export function useScrollReveal(
  scopeRef: React.RefObject<HTMLElement | null>,
  enter: gsap.TweenVars,
  stagger = 0.08
) {
  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          gsap.from(scopeRef.current!.querySelectorAll(".reveal"), {
            scrollTrigger: {
              trigger: scopeRef.current!,
              start: "top 78%",
              once: true,
            },
            y: 32,
            opacity: 0,
            duration: 0.75,
            stagger,
            ease: "power3.out",
            ...enter,
          });
        },
        scopeRef
      );
      return () => ctx.revert();
    },
    { scope: scopeRef }
  );
}
```

Mark animatable children with `className="reveal"` — zero per-component logic beyond "call hook + add class."

---

## Section-by-Section Animation Specifications

---

### 1. Navbar

**UX Objective:** Establish brand stability and trust from the first millisecond. The navbar is the load-bearing element of every page state; it signals precision and control.

**Current CSS:** Already sticky + `backdrop-filter: blur(24px) saturate(180%)` — good foundation.

**Triggers:**
- Page load: slide down from above viewport.
- Background "solidify" on scroll past 40px (opacity + shadow transition).

**Animation sequence:**

```
On mount:
  .navbar ── from y: -64px → 0, opacity 0→1, duration 0.7s, ease power3.out, delay 0.05s
On scroll (ScrollTrigger toggle):
  .navbar ── border-bottom color deepens, shadow appears, duration 0.35s, ease power1.out
```

**Why it works:** A sliding-in navbar on load feels engineered, not decorative. The scroll-driven "solidify" draws the user's attention downward at the right moment, reinforcing spatial context without them noticing a deliberate animation.

**GSAP approach:**
```tsx
// In Navbar.jsx
const ref = useRef<HTMLElement>(null);
useGSAP(() => {
  gsap.from(ref.current, { y: -64, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.05 });
  ScrollTrigger.create({
    trigger: ref.current,
    start: "top top",
    onEnter: () => ref.current?.classList.add("navbar--scrolled"),
    onLeaveBack: () => ref.current?.classList.remove("navbar--scrolled"),
  });
}, { scope: ref });
```
CSS transition on `.navbar--scrolled` handles the border/shadow — JS only toggles class, keeping the active state CSS-only (performant).

---

### 2. Hero

**UX Objective:** Immediate authority + clear next step. The hero is the conversion gate — animation must guide the eye from logo → headline → CTAs → stats, in that order, within ~1.2 seconds.

**Current layout (no JSX move needed):** Logo → eyebrow → title → description → buttons → hero_stats → hero_carousel.

**Animation sequence (timeline, sequential on mount):**

```
Desktop timeline (delay: 0.15s, total spread 1.1s)
  t=0.0s  .hero_logo            ── from opacity 0, y: 24 → 0, duration 0.7s, power3.out
  t=0.15s .hero_eyebrow         ── from opacity 0, y: 18 → 0, duration 0.6s, power3.out
  t=0.28s .hero_title          ── from opacity 0, y: 28 → 0, duration 0.8s, power3.out
  t=0.42s .hero_description    ── from opacity 0, y: 16 → 0, duration 0.7s, power3.out
  t=0.58s .hero_buttons        ── from opacity 0, y: 20 → 0, duration 0.65s, power3.out
         .hero_button (primary) ── slight scale 0.97→1 + glow, duration 0.4s, power2.out  (after parent)
  t=0.72s .hero_stats          ── from opacity 0, y: 24 → 0, duration 0.75s, power3.out
  t=0.86s .hero_carousel       ── from opacity 0 → 1, duration 0.8s, power3.out
        (carousel animation delay starts after its own fade-in)

Mobile timeline (delay: 0.1s, total spread 0.7s)
  t=0.0s  .hero_logo + .hero_eyebrow  ── parallel, opacity 0→1, y: 14→0, duration 0.5s, power3.out
  t=0.12s .hero_title                ── opacity 0→1, y: 18→0, duration 0.55s, power3.out
  t=0.22s .hero_description          ── opacity 0→1, duration 0.5s
  t=0.32s .hero_buttons              ── opacity 0→1, y: 14→0, duration 0.5s
  t=0.44s .hero_stats + .hero_carousel ── parallel, opacity 0→1, duration 0.5s
```

All mobile durations are compressed ~30% and parallelized where elements are visually independent. No element waits for another on mobile if they don't share a causal reading order.

**Micro-interaction:**
- `.hero_button:hover`: `scale: 1.03, duration: 0.2s, ease: "power1.out"` — barely perceptible, feels physical.
- `.hero_button--secondary:hover`: background/color swap via CSS transition (already in place), no scale.

**Why this works:** Sequential timing mimics reading order — the eye is never racing ahead. The stats appear only after CTAs anchor the user, so the "social proof" rhythm lands as trust reinforcement, not noise. Carousel fade-in last because it's ambient context, not a decision point.

**GSAP approach:**
```tsx
const ref = useRef<HTMLElement>(null);
useGSAP(() => {
  const tl = gsap.timeline({ delay: 0.15 });
  tl.from(ref.current!.querySelector(".hero_logo"), { opacity: 0, y: 24, duration: 0.7, ease: "power3.out" })
    .from(ref.current!.querySelector(".hero_eyebrow"), { opacity: 0, y: 18, duration: 0.6, ease: "power3.out" }, 0.15)
    .from(ref.current!.querySelector(".hero_title"), { opacity: 0, y: 28, duration: 0.8, ease: "power3.out" }, 0.28)
    // ... etc
}, { scope: ref });
```

---

### 3. Challenges

**UX Objective:** Help users self-identify pain points. The interactive tabs feel premium when the state change is crisp.

**Current interaction:** User clicks a challenge card; right panel updates.

**Animations:**

**On scroll reveal (once):**
```
.challenges_heading     ── y: 28 → 0, opacity 0→1, duration 0.75s
.challenge_card (×4)   ── y: 24 → 0, opacity 0→1, stagger 0.1s, duration 0.65s
.challenges_right      ── y: 20 → 0, opacity 0→1, duration 0.7s, delay 0.25s (after cards)
```

**On card click (state change):**
```
.outgoing card          ── opacity 1→0, x: 8→0, duration 0.22s, power2.in (quick exit)
.incoming card          ── opacity 0→1, x: -6→0, duration 0.28s, power3.out (smooth settle)
.panel content          ── opacity 0.4→1, y: 6→0, duration 0.35s, power2.out (fade-shift)
```
CSS `transition` on the panel text already handles basic fade; use GSAP for the directional slide on the active card indicator only.

**Hover micro (CSS):**
```css
.challenge_card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
```
`:hover` is a desktop-only interaction; on touch devices the card's `:active` state provides equivalent press feedback.

**Mobile notes:**
- Reduce entrance durations by ~30%: heading 0.55s, cards 0.5s, right panel 0.5s.
- Reduce stagger from `0.1s` to `0.06s` for the 4 cards.
- Directional slide on active card: skip `x` translation entirely on mobile; use opacity fade only (`opacity 1→0, duration 0.18s`). Directional micro-slides are imperceptible on small screens and consume unnecessary compositor budget.
- Panel content animation: reduce `y` from `6px` to `3px` on mobile.

**Why it works:** The directional slide on the active indicator replaces abrupt swapping with something that feels like a system selecting the right tool. The panel crossfade is subtle enough to not break reading flow.

---

### 4. Purpose (About Us)

**UX Objective:** Landing context — who builds this and why. Must feel grounded, not promotional.

**Animation:**
```
On scroll reveal (once):
  .purpose_label         ── opacity 0→1, y: 14 → 0, duration 0.6s
  .purpose_title         ── opacity 0→1, y: 22 → 0, duration 0.75s, ease power3.out
  .purpose_underline     ── scaleX 0→1, duration 0.5s, ease power3.out, delay after title
  .purpose_text          ── opacity 0→1, duration 0.65s, delay 0.1s after underline
  .purpose_authority     ── opacity 0→1, y: 10 → 0, duration 0.55s, delay 0.18s after .purpose_text
```

**Subtle depth:** Give `.purpose` a `translateY` parallax of `-12px` over its scroll range. Only engage after the hero scroll starts to avoid fighting the hero exit.

```tsx
ScrollTrigger.create({
  trigger: ".purpose",
  start: "top bottom",
  end: "bottom top",
  scrub: 0.8,
  onUpdate: (self) => gsap.set(".purpose", { y: self.progress * -12 }),
});
```

**Why it works:** The underline expanding is a Linear-esque detail — it physically connects the label to the headline. The authority line's slight upward float after the body text creates an "endorsement" cadence, like a signature under a formal document.

---

### 5. Partners (Social Proof)

**UX Objective:** Instill trust before the user commits. This is the most trust-critical section on the page — its animation should feel deliberate and institutional, not playful.

**Current layout:**
- Header (eyebrow, headline, subtext)
- Stats row (3 stats, dividers)
- Logo grid (7 cards in 3-column grid, middle card centered)

**Animation on scroll reveal (once):**

```
.partners_eyebrow       ── opacity 0→1, y: 14 → 0, duration 0.6s
.partners_headline      ── opacity 0→1, y: 22 → 0, duration 0.75s, ease power3.out
.partners_subtext       ── opacity 0→1, duration 0.65s, delay 0.1s

.partners_stat_num      ── count-up animation
  ScrollTrigger fires when .partners_stats enters
  From: internal counter at 0
  To: final number (10, 1000, 5000)
  Duration: 1.4s, ease: "power2.out" (desktop) | 0.9s, ease: "power2.out" (mobile)
  Suffix "+" appears on completion
  Note: count-up is separate from opacity reveal — numbers start at 0 opacity
    and fade in over first 0.3s while counting.

.partners_card (×7)    ── opacity 0→1, y: 32 → 0, stagger 0.1s, duration 0.7s  (desktop)
.partners_card (×7)    ── opacity 0→1, y: 28 → 0, stagger 0.06s, duration 0.6s  (mobile) — reduce total stagger time from 0.7s to 0.36s for slower mobile CPUs.
  Submit to a GridLayout stagger — gsap handles out-of-order naturally.
```

**Count-up GSAP implementation:**
```tsx
const numRef = useRef<HTMLSpanElement>(null);
ScrollTrigger.create({
  trigger: numRef.current,
  once: true,
  onEnter: () => {
    const target = parseInt(numRef.current!.dataset.target);
    gsap.to({ val: 0 }, {
      val: target,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: function () {
        numRef.current!.textContent = Math.floor(this.targets()[0].val).toLocaleString();
      },
      onComplete: () => {
        numRef.current!.textContent = target.toLocaleString();
      }
    });
  }
});
```

**Logo hover (CSS):** Keep the existing `translateY(-5px) scale(1.04)` hover — it's already restrained. Add a GSAP-driven cursor-follow spotlight only if the user explicitly wants it (not in base plan).

**Why it works:** Number count-up is one of the highest-ROI animations for trust — it converts inert text into an active signal of scale. The delay between header text and stat numbers creates a narrative beat: "These organizations trust us" → *(beat)* "Here's how many." Logo grid stagger mimics a slow pan across a wall of client logos at a conference — prestigious without gimmicks.

---

### 6. ServingCooperatives

**UX Objective:** Humanize the product. Founder photo + mission = trust anchor.

**Animation on scroll reveal (once):**

```
.serving_image_wrap    ── opacity 0→1, scale 0.96→1, duration 0.85s, ease power3.out
.serving_content       ── opacity 0, y: 28 → 0, duration 0.75s, delay 0.2s (after image)
.serving_list_item (×6) ── opacity 0→1, x: -12 → 0, stagger 0.06s, duration 0.5s
.serving_callout       ── opacity 0→1, y: 12 → 0, duration 0.65s, delay 0.3s after list
```

**Name card within photo:** Animate independently after the photo resolves:
```
.serving_name_card     ── opacity 0, scale 0.9 → 1, duration 0.5s, delay 0.35s after image start
```

**Why it works:** The photo scaling from slightly smaller feels like a zoom-in on a real person (documentary style). List items sliding in from left feel like a checklist being written. No bounces, no celebratory flips — just quiet, purposeful entry.

---

### 7. Services (Interactive Preview)

**UX Objective:** Product competency + exploration. This is the longest section (531 lines of JSX) and the most complex — animations must support clarity, not add to cognitive load.

**Two layers: Tabs state-change + initial reveal.**

**On scroll reveal (once):**
```
.services_eyebrow ── opacity 0→1, y: 12 → 0, duration 0.6s
.services_heading ── opacity 0→1, y: 20 → 0, duration 0.75s
.services_sub     ── opacity 0→1, duration 0.65s, delay 0.1s
.services_tabs    ── opacity 0→1, y: 16 → 0, duration 0.65s, stagger 0.07s per tab
.services_panel_outer ── opacity 0→1, y: 20 → 0, duration 0.7s, delay 0.2s
  (inner table rows stagger on first tab entry only)
```

**On tab switch:**
```
.outgoing panel     ── opacity 1→0, x: (6px desktop) → 0, duration (0.25s desktop) → (0.18s mobile), power2.in
.incoming panel     ── opacity 0→1, x: (-6px desktop) → (-3px mobile), duration (0.32s desktop) → (0.22s mobile), power3.out
```

**On hover (tab button):**
.services_tab:hover ── translateX(3px), duration 0.2s, ease power1.out (desktop only)
Mobile: no hover animation. Tabs rely on active-state color/border change only.

**Why it works:** Tab content crossfade is the same direction-fade pattern as Challenges — creates continuity across the whole site. The initial reveal staggers left-to-right (tabs then panel), mirroring how a user scans the interface. The panel transition duration (0.32s) is slightly faster than page reveals (0.75s) — sections feel considered, in-page state changes feel responsive.

---

### 8. CooperativeChoice

**UX Objective:** Comparison decision support. Two clear paths; animation should help the user orient to the choice, not obscure it.

**On scroll reveal (once):**
```
.choice_title        ── opacity 0→1, y: 22 → 0, duration 0.8s
.choice_tab (×2)    ── opacity 0→1, y: 16 → 0, stagger 0.1s, duration 0.6s, delay 0.15s
.choice_laptop_wrap (×2) ── opacity 0→1, y: 24 → 0, stagger 0.12s, duration 0.75s, delay 0.2s
.choice_description ── opacity 0→1, duration 0.65s, delay 0.3s
```

**On laptop image click (modal):**
```
.choice_laptop_wrap ── onClick: scale 0.97→0.95, duration 0.2s, power2.in
  (feels like a physical press before the overlay opens)
```

**Modal open:** Reuse the contact modal pattern already in navbar.css (`contactFadeIn` + `contactSlideUp`). Consider lifting this into a shared `Modal` animation utility to avoid duplication across `BookingModal`, `FeatureModal`, and `ContactModal`.

```css
/* Shared modal animations */
@keyframes modalOverlayIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes modalCardIn {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.cora_modal_overlay { animation: modalOverlayIn 0.22s ease; }
.cora_modal           { animation: modalCardIn 0.28s cubic-bezier(0.2, 0, 0, 1); }
```

**Why it works:** The laptop click press state is a micro-interaction borrowed from physical button design — it confirms the click before the overlay takes over. Modal animation uses `cubic-bezier(0.2, 0, 0, 1)` (iOS default) rather than `ease`, which feels more premium and less "web default."

---

### 9. Footer

**UX Objective:** Closure. Legal trust, secondary navigation, calm exit.

**On scroll reveal (once):**
```
.footer             ── opacity 0→1, y: 20 → 0, duration 0.7s, ease power3.out
.footer_col (×4)   ── opacity 0→1, y: 14 → 0, stagger 0.08s, duration 0.65s
.footer_bottom      ── opacity 0→1, duration 0.55s, delay 0.3s
```

**No parallax.** Footers should not feel detached from the content above.

**Hover on links:**
```css
.footer_links a {
  transition: color 0.2s ease, transform 0.2s ease;
}
.footer_links a:hover {
  color: rgb(22, 48, 21);
  transform: translateX(3px);
}
```

**Why it works:** Footer fade is understated — it's a closing note, not a feature. Column stagger gives a brief moment of hierarchical recognition before the eyes rest. Link slide is a Reedsy/Notion pattern: subtle, meaningful directionality.

---

### 10. LiveDemoButton (Floating CTA)

**UX Objective:** Persistent conversion without disruption.

**No entrance animation on scroll — it's already visible.**  
**Hover:**
```
LiveDemoButton ── translateY(-2px), duration 0.2s, ease power1.out
  shadow deepens from 0 4px 16px → 0 8px 28px rgba(0,0,0,0.12)
```
Use CSS for this — no need for JS involvement.

---

### 10. LiveDemoButton (Floating CTA)

**UX Objective:** Persistent conversion without disruption.

**No entrance animation on scroll — it's already visible.**  
**Hover:**
```
LiveDemoButton ── translateY(-2px), duration 0.2s, ease power1.out
  shadow deepens from 0 4px 16px → 0 8px 28px rgba(0,0,0,0.12)
```
Use CSS for this — no need for JS involvement. On mobile, the button remains visible permanently (already the case); no hover style applies.

---

## Shared Infrastructure

### Motion Gate Utility

Combine mobile detection and reduced-motion preference into one reusable hook. Every component calls `useShouldAnimate()` at the top level — if false, no GSAP code runs at all.

```tsx
// src/hooks/useShouldAnimate.ts
import { useEffect, useState } from "react";

export function useShouldAnimate() {
  const [should, setShould] = useState(false);
  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const check = () => setShould(!mqMotion.matches && !mqMobile.matches);
    check();
    mqMotion.addEventListener("change", check);
    mqMobile.addEventListener("change", check);
    return () => {
      mqMotion.removeEventListener("change", check);
      mqMobile.removeEventListener("change", check);
    };
  }, []);
  return should;
}
```

Used like:
```tsx
const shouldAnimate = useShouldAnimate();
useGSAP(() => {
  if (!shouldAnimate) return;
  // ... all GSAP logic here
}, { scope: ref });
```

This is the single source of truth for "should this device get animation." No per-component media queries, no duplication.

### `useScrollReveal` App Placement

Create one wrapper in `src/hooks/useScrollReveal.ts` that accepts a `mobileStagger` override. All sections import and call it with their root ref + optional overrides. This keeps the motion system consistent and makes a future easing or duration change a one-line fix.

```tsx
// src/hooks/useScrollReveal.ts
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useShouldAnimate } from "./useShouldAnimate";

export function useScrollReveal(
  scopeRef: React.RefObject<HTMLElement | null>,
  enter: gsap.TweenVars = {},
  stagger = 0.08,
  mobileStagger?: number
) {
  const shouldAnimate = useShouldAnimate();
  useGSAP(
    () => {
      if (!shouldAnimate) return;
      const effectiveStagger = window.matchMedia("(max-width: 768px)").matches
        ? (mobileStagger ?? 0.05)
        : stagger;
      gsap.from(scopeRef.current!.querySelectorAll(".reveal"), {
        scrollTrigger: {
          trigger: scopeRef.current!,
          start: "top 78%",
          once: true,
        },
        y: 32,
        opacity: 0,
        duration: window.matchMedia("(max-width: 768px)").matches ? 0.55 : 0.75,
        stagger: effectiveStagger,
        ease: "power3.out",
        ...enter,
      });
    },
    { scope: scopeRef }
  );
}
```

Sections that need mobile-specific stagger pass `mobileStagger`; others default to `0.05`.

### Accessibility: `prefers-reduced-motion`

The `useShouldAnimate` hook above combines both signals. No separate `data-motion` attribute is needed — the hook's boolean gate means GSAP never executes on devices that should skip it. The static CSS layout already looks correct, so `shouldAnimate === false` produces a zero-animation experience with no blank states.

### Animation Timing Budget

Load → fully painted: ≤ 1200ms. All hero timeline fits inside this. Every scroll-triggered animation must begin *before* its section is 22% into the viewport (`start: "top 78%"`) on desktop, **`top 82%` on mobile** (slightly later to avoid competing with rubber-banding on iOS). The `useScrollReveal` hook reads the media query and adjusts `start` dynamically:

```tsx
const isMobile = window.matchMedia("(max-width: 768px)").matches;
start: isMobile ? "top 82%" : "top 78%",
```

This is the only runtime media query in the animation system; everything else is static config passed as props.

---

## What to Avoid (and Why the plan steers clear)

| Anti-pattern | Why avoided |
|---|---|
| Scale > 1.06 on any element | Feels cartoonish; we use 1.03 max on buttons |
| Elastic / bounce easing | Stripe abandoned it in 2022; it feels dated |
| Floating particles / blobs | No illustrative assets; conflicts with photographic sections |
| Stagger > 0.14s in dense grids | Feels slow; Partners uses exactly 0.1s |
| `x` / `y` on scroll beyond 18px | Causes perceived jitter; parallax capped at -12px max |
| Animating `height`, `width`, `top`, `left` | Triggers layout thrash; we exclusively animate `opacity` and `transform` |
| Replay on scroll-up (`once: false`) | Feels like a startup template; trust-building animations must feel irreversible |

---

## Implementation Sequence

Recommended order (each step independently verifiable with `npm run build`):

1. `npm install gsap @gsap/react`  
2. Create `src/hooks/useScrollReveal.ts` + `useMotionPreference.ts`  
3. Animate **Navbar** — simplest, establishes pattern, no scroll dependency beyond mount  
4. Animate **Hero** — highest visual impact, validates timeline approach  
5. Animate **Challenges** — introduces scroll-trigger + tab interaction pattern  
6. Animate **Purpose** — adds parallax concept (simple scrub)  
7. Animate **Partners** — introduces count-up (libraries exercise)  
8. Animate **ServingCooperatives** — image + list stagger exercise  
9. Animate **Services** — tab-transition integration  
10. Animate **CooperativeChoice** — state-change hooks  
11. Animate **Footer** — closure cadence  
12. Audit with device emulation (Chrome DevTools → Performance → no long tasks > 50ms during scroll) + `prefers-reduced-motion` profile check  
13. Global sweep: verify no selector uses `animate` on `width` / `height` / `top` / `left`

---

## Success Criteria

- All page sections animate in on scroll-enter; no animation replays after first pass.  
- Hero interstitial completes within 1.2s of page paint.  
- No long-task (> 50ms) attributable to GSAP during any scroll event.  
- `prefers-reduced-motion: reduce` disables all non-essential animation; layout remains identical in static state.  
- Build size increase ≤ 40 KB gzipped (`npm run build` diff before/after).  
- Visitor eye-tracking intuition: headline resolves before buttons, buttons resolve before stats, stats resolve before carousel.
