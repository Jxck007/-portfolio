---
trigger: always_on
description: Persistent rules for improving this React portfolio while preserving functionality, maintainability, responsiveness, accessibility, and visual consistency.
---

# Portfolio UI Engineering Rules

## Core objective

Treat this project as a production-quality developer portfolio.

Improve:
- visual hierarchy
- UI consistency
- UX
- responsive behavior
- accessibility
- performance
- code quality
- maintainability
- SEO
- interaction quality
- visual polish

The goal is NOT to blindly redesign everything.

Preserve the existing identity, useful content, working functionality, and project-specific intent unless there is a clear reason to change them.

## Before changing anything

Always inspect:
1. project structure
2. package.json
3. routing
4. reusable components
5. global styles
6. theme configuration
7. assets
8. fonts
9. responsive breakpoints
10. existing animations
11. current UI in the browser
12. console errors
13. build errors
14. obvious duplicate components
15. dead or unreachable code

Do not assume how the application works from filenames alone.

## Browser-first verification

Use the browser to inspect the running portfolio.

Check at minimum:
- desktop wide
- laptop
- tablet
- mobile

Look for:
- horizontal overflow
- elements touching viewport edges
- broken navigation
- inconsistent spacing
- text wrapping problems
- oversized headings
- tiny text
- awkward card heights
- broken images
- animation glitches
- hover-only interactions
- layout shifts
- inaccessible controls
- mobile navigation issues
- poor visual hierarchy
- excessive empty space
- excessive visual noise

Use screenshots/artifacts when useful to document before/after results.

## Design direction

Prefer:
- clean
- modern
- developer-focused
- premium
- minimal but expressive
- strong typography
- clear hierarchy
- consistent spacing
- restrained use of gradients
- subtle motion
- meaningful micro-interactions
- strong project presentation
- good mobile experience

Avoid:
- random gradients everywhere
- excessive glassmorphism
- excessive glowing effects
- unnecessary 3D
- animation for animation's sake
- huge component counts
- visual clutter
- inconsistent border radii
- inconsistent shadows
- different design languages across sections

## Animation & Design restraint

Use animation selectively.

A portfolio should communicate the developer before demonstrating the component library.

Maximum priority:
1. clarity
2. typography
3. layout
4. content
5. interaction
6. animation

Do not place animated effects in every section.

Avoid combining multiple:
- particle backgrounds
- cursor effects
- glowing borders
- 3D cards
- text animations
- gradients

within the same viewport.

Every visual effect must support hierarchy or interaction.

## Component sourcing

When a component can materially improve the UI, research existing free components before implementing one from scratch.

Preferred sources:
1. React Bits free/Starter components
2. Magic UI free/open-source components
3. Aceternity UI free components
4. shadcn/ui
5. other reputable free/open-source React component libraries

Do not use paid/pro-only components.

Before adopting a component:
- inspect its implementation
- confirm compatibility with the project's React/Next.js/Tailwind setup
- inspect dependencies
- consider bundle-size impact
- check responsiveness
- check accessibility
- make sure it fits the current design system

Do not add a component merely because it looks impressive.

## Consistency

Maintain a coherent design system.

Standardize where appropriate:
- spacing
- typography
- border radius
- shadows
- colors
- button styles
- card styles
- section widths
- animation timing
- hover states
- focus states

Prefer reusable primitives over repeated styles.

## UX

Every important interaction should have:
- obvious affordance
- visible feedback
- logical hover behavior
- keyboard accessibility
- focus state
- useful mobile behavior

Navigation should make it immediately clear:
- where the user is
- where they can go
- what action matters most

Do not create unnecessary interactions.

## Accessibility

Check:
- semantic HTML
- keyboard navigation
- focus visibility
- contrast
- alt text
- button/link semantics
- reduced-motion behavior
- form labels
- heading hierarchy
- accessible navigation
- screen-reader-friendly labels

Do not use clickable divs when buttons or links are appropriate.

## Responsive design

Never optimize only for desktop.

Check:
- 320px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px+

Prefer fluid layouts over device-specific hacks.

Avoid:
- hardcoded viewport assumptions
- fixed widths that cause overflow
- absolute positioning for primary layout
- breakpoint overload
- separate duplicated markup for desktop/mobile unless genuinely necessary

## Code cleanup

Identify:
- unused imports
- unused variables
- unused components
- duplicate components
- duplicate utility functions
- repeated constants
- dead CSS
- unreachable branches
- obsolete dependencies
- redundant state
- unnecessary effects
- repeated API calls
- duplicated markup
- abandoned experiments

Do not delete potentially used code based only on filename or intuition.

Before removing code, verify usage through:
- imports
- route references
- dynamic references
- configuration
- build/type checks
- search across the repository

Prefer consolidation over duplication.

## Performance

Watch for:
- unnecessary re-renders
- heavy animation
- oversized images
- unoptimized assets
- unnecessary dependencies
- large client-side bundles
- excessive JavaScript
- layout thrashing
- animation of expensive properties

Prefer:
- CSS transforms
- lazy loading where appropriate
- optimized images
- reusable components
- lightweight animation
- minimal dependencies

Do not prematurely optimize insignificant code.

## SEO

Check:
- title
- description
- Open Graph metadata
- favicon
- semantic headings
- canonical URL where applicable
- robots configuration
- sitemap where appropriate
- meaningful page content
- project links

## Portfolio-specific UX

The portfolio should communicate quickly:
1. who I am
2. what I build
3. my core technologies
4. what projects I have built
5. evidence of actual work
6. how to contact me

Projects should make it easy to understand:
- problem
- solution
- technology
- my role
- result
- GitHub/demo

Avoid turning every project card into a wall of text.

## Implementation rule

Do not perform a massive rewrite without first establishing a baseline.

Work in stages:
1. audit
2. prioritize
3. redesign selected areas
4. implement
5. test
6. clean up
7. verify again

Preserve functionality unless a change is explicitly required.

After implementation:
- run type checks
- run lint
- run build
- inspect browser
- check console
- recheck responsive behavior

Never claim a change is complete if verification was not performed.
