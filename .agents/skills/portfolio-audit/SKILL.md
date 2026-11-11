---
name: portfolio-audit
description: Performs a browser-first audit and improvement workflow for React developer portfolios, covering UI, UX, responsive design, accessibility, performance, SEO, component research, duplicate code, dead code, and maintainability.
---

# Portfolio Audit Skill

## Mission

Act as a senior frontend engineer, UI/UX designer, accessibility reviewer, and codebase cleanup engineer.

Your job is to inspect the existing portfolio before changing it.

Do not redesign blindly.

The expected workflow is:

AUDIT → RESEARCH → PRIORITIZE → IMPLEMENT → CLEAN → VERIFY

---

# Phase 1 — Understand the codebase

Inspect:

- package.json
- source tree
- routes
- components
- styling system
- theme
- assets
- fonts
- reusable utilities
- configuration
- dependencies
- existing animations

Determine:

- React version
- Next.js/Vite/etc.
- TypeScript or JavaScript
- Tailwind/CSS/modules/styled-components/etc.
- router
- component architecture
- design system
- deployment assumptions

Create an internal understanding of how the application works before making edits.

---

# Phase 2 — Run the portfolio

Start the development server if required.

Use the browser to inspect the actual running application.

Do not rely only on source code.

Navigate through:
- home
- about
- skills
- projects
- experience
- contact
- resume
- every available route
- mobile navigation
- external links
- buttons
- interactive cards
- forms
- theme controls

Inspect the rendered UI.

---

# Phase 3 — Browser UI audit

For every important page inspect:

## Visual hierarchy

Check:
- first viewport clarity
- heading hierarchy
- section hierarchy
- CTA visibility
- content density
- readability
- alignment

## Layout

Check:
- max-width
- grid/flex behavior
- spacing
- alignment
- card sizing
- section rhythm
- overflow
- vertical rhythm

## Responsive behavior

Test:
- 320px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px+

Identify:
- clipping
- overflow
- bad wrapping
- broken cards
- oversized text
- navigation problems
- unusable interactions

## Interaction

Check:
- hover states
- focus states
- buttons
- links
- navigation
- menus
- modals
- tabs
- carousels
- scroll behavior
- animations

## Accessibility

Check:
- keyboard navigation
- focus states
- semantic elements
- labels
- aria usage
- contrast
- alt text
- heading structure
- reduced motion

## Technical browser issues

Check:
- console errors
- warnings
- failed requests
- missing assets
- hydration issues
- layout shifts
- runtime exceptions

---

# Phase 4 — Code quality audit

Search for:

- duplicate components
- near-duplicate components
- unused imports
- unused variables
- unused functions
- dead CSS
- dead files
- duplicate constants
- repeated markup
- redundant state
- unnecessary effects
- unnecessary memoization
- obsolete dependencies
- debug code
- console.log statements
- temporary code
- commented-out code

Trace references before deleting anything.

If uncertain whether something is dead:
DO NOT DELETE IT.
Mark it as "needs confirmation".

---

# Phase 5 — Design-system audit

Identify the existing:

- colors
- typography
- spacing scale
- radius
- shadows
- borders
- buttons
- cards
- animations

Find inconsistencies.

Examples:
- 3 different card radii
- 5 button styles
- random padding values
- inconsistent section widths
- different heading scales
- multiple shadow styles
- unrelated animation styles

Consolidate where appropriate.

---

# Phase 6 — Component research

When a UI improvement needs a component, research free components first.

Preferred sources:

- React Bits free/Starter components
- Magic UI
- Aceternity UI
- shadcn/ui
- reputable open-source React libraries

Useful categories:

Hero:
- text effects
- subtle backgrounds
- spotlight
- animated headings

Projects:
- cards
- bento grids
- hover cards
- image effects

Skills:
- icon clouds
- animated lists
- marquees

Experience:
- timelines
- vertical steps
- accordions

Contact:
- forms
- magnetic buttons
- subtle interaction effects

Background:
- grid
- particles
- gradient motion
- spotlight

Do NOT turn the entire portfolio into an animation showcase.

Use components only where they improve communication or interaction.

---

# Phase 7 — Component decision process

For each proposed component:

1. Identify the UX problem.
2. Search for a free existing component.
3. Compare 2–3 appropriate options if useful.
4. Check implementation requirements.
5. Check dependencies.
6. Check mobile behavior.
7. Check accessibility.
8. Check visual compatibility.
9. Prefer the simplest suitable option.
10. Implement and customize it to match the existing design.

Do not copy an entire visual language from another site.

Components should feel native to this portfolio.

---

# Phase 8 — Portfolio-specific improvements

Evaluate these areas separately.

## Navbar

Improve:
- hierarchy
- spacing
- active state
- mobile menu
- scroll behavior
- CTA
- accessibility

## Hero

Ensure the first viewport answers:

Who am I?
What do I build?
What technologies do I use?
What should the visitor do next?

Avoid unnecessary visual noise.

## About

Make it easy to scan.

Prioritize:
- identity
- focus
- skills
- interests
- current direction

## Skills

Avoid dumping every technology.

Group technologies logically.

## Projects

Projects are the portfolio's main proof.

Each project should communicate:

Problem
→ Solution
→ Technology
→ My contribution
→ Outcome
→ Demo/GitHub

## Experience / timeline

Improve:
- chronology
- readability
- scanning
- responsive behavior

## Contact

Make contacting me obvious and frictionless.

## Footer

Keep it useful and compact.

---

# Phase 9 — Implementation strategy

Prioritize changes:

P0 = broken functionality
P1 = severe UX/responsive/accessibility problems
P2 = high-value visual improvements
P3 = code cleanup
P4 = optional polish

Fix P0 and P1 before cosmetic work.

Do not perform unnecessary rewrites.

Prefer incremental changes.

---

# Phase 10 — Verification

After each significant implementation:

Run:
- type check
- lint
- build
- tests if available

Then reopen the application in the browser.

Verify:
- desktop
- mobile
- navigation
- animations
- console
- links
- forms
- theme
- responsive layout

Compare against the original state.

Do not introduce regressions while fixing visual issues.

---

# Required audit report

Before making major modifications, produce:

## Portfolio Audit

### Critical problems
- issue
- location
- impact
- recommended fix

### UI problems
- issue
- location
- recommended improvement

### UX problems
- issue
- location
- recommended improvement

### Responsive problems
- breakpoint/device
- issue
- recommended fix

### Accessibility problems
- issue
- location
- recommended fix

### Performance problems
- issue
- likely cause
- recommended fix

### Code cleanup
- duplicate code
- dead code candidates
- unnecessary dependencies
- architecture problems

### Component opportunities
For each:
- current implementation
- proposed free component
- source
- reason
- implementation complexity

### Recommended implementation order

Rank only by:
- user impact
- severity
- effort
- risk

Do not use subjective "best/worst" design rankings.

---

# Final verification report

After modifications provide:

### Changed
What was actually modified.

### Removed
What was safely removed.

### Added
What components/dependencies were added.

### Verified
What browser/device states were checked.

### Remaining
Any unresolved or intentionally untouched issues.

### Commands
Commands executed for:
- development
- lint
- type checking
- build
- tests
