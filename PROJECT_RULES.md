# JXCK PORTFOLIO — PROJECT RULES

## Core principle

This is an existing portfolio. Do NOT rebuild it from scratch.

Preserve existing functionality unless explicitly instructed otherwise.

Every change must be incremental, reversible, and validated.

---

## Visual identity

The portfolio is intentionally:

- dark
- minimal
- technical
- experimental
- monochromatic
- typography-driven
- interaction-heavy
- cinematic

Do NOT turn it into:

- a generic SaaS landing page
- a colorful developer portfolio
- a template-looking portfolio
- a dashboard
- a generic 3D website

---

## Intro

The intro is a major identity element.

Current concept:

JXCK particle typography
→ user taps/clicks
→ particles detach
→ particles form a 3D spiral
→ particles morph into the avatar/face
→ hero is revealed

Do NOT replace this with a conventional fade transition.

Do NOT use a GLB avatar.

The particle system should remain lightweight.

---

## Particle architecture

Prefer ONE persistent WebGL particle system.

Particles should transition between target states rather than destroying/recreating
the particle system.

Conceptual states:

INTRO_JXCK
SPIRAL
FACE
HERO

Use GPU-friendly buffers/shaders where appropriate.

Avoid multiple continuously running canvas/WebGL systems when one system can
perform the same visual role.

---

## Hero

The hero must communicate both:

CREATIVE DEVELOPMENT
+
SYSTEMS ENGINEERING

Do NOT make the hero purely backend-focused.

Preferred direction:

"I BUILD DIGITAL SYSTEMS."

Exact copy can be refined later.

---

## Avatar

The avatar should represent the actual portfolio owner.

Do not invent a random person.

Do not use an unrelated stock character.

No permanent eye glow.

Eye glow should be an interaction/hover state.

---

## Navigation

Navigation should be fast and obvious.

Experimental interaction is welcome, but usability takes priority.

Do not make navigation dependent on a complicated animation.

---

## Projects

Projects are the primary proof of ability.

Grid view should be the default.

3D/experimental project presentation is optional and must not reduce usability.

---

## Responsive design

Mobile is not a compressed desktop layout.

Design intentionally for:

320px
375px
390px
430px
768px
1024px
1440px
1920px

Never allow:

- horizontal page scrolling
- clipped headings
- overlapping hero elements
- unreadable navigation
- overflowing cards
- broken buttons
- oversized particle canvases

---

## Performance

Prefer:

- GPU animation
- requestAnimationFrame
- shared buffers
- lazy loading
- reduced particle count on mobile
- capped devicePixelRatio

Avoid unnecessary:

- DOM animation
- duplicated animation loops
- continuously running background effects
- large 3D assets
- unnecessary allocations during animation

---

## Accessibility

Maintain:

- keyboard navigation
- visible focus states
- reduced-motion support
- semantic headings
- accessible buttons
- sufficient contrast

Animations must not be required to understand the content.

---

## AI AGENT RULES

Before editing:

1. Inspect the existing architecture.
2. Identify affected files.
3. Explain the proposed change.
4. Do NOT modify unrelated files.

After editing:

1. Run the build.
2. Run lint/type checks if available.
3. Inspect affected routes/components.
4. Report exactly what changed.
5. Report any remaining issues.

Never perform a full-project rewrite unless explicitly instructed.

Never delete files merely because they "look unused".
Verify imports/references first.

Never replace an existing implementation with a simpler implementation
just because it is easier if it changes the intended visual experience.

When uncertain, stop and ask rather than inventing a new design.