---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-PiratesWeb-2026-02-26.md
  - docs/legacy-reference/index.md
  - docs/legacy-reference/project-overview.md
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 2
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: brownfield
workflowType: 'prd'
---

# Product Requirements Document - PiratesWeb

**Author:** Captain
**Date:** 2026-02-26

## Executive Summary

PiratesWeb is a modern web-based card browser and deck builder for the Pirates Constructible Strategy Game (CSG), rebuilt from the ground up as a Svelte/SvelteKit static site. It replaces a 2005 Windows Forms desktop application — built by the same developer — that never reached the broader community. The app lets users browse cards across three expansion sets (Spanish Main, Crimson Coast, Revolution) with full card images, filter by set/type/nationality/rarity, and in later phases build rules-validated fleets using a ship-centric point-based system faithful to the original game. No accounts, no backend, no install — just open a browser and go. PiratesWeb is the companion tool to an in-progress Unity-based digital version of the game, part of a broader effort to revive the Pirates CSG experience for a new era.

### What Makes This Special

This tool is built by the person who created the original deck builder 20 years ago. The complete card database (5000+ entries), 424 card images, and deep knowledge of the game's build rules already exist — they just need modern packaging. There is no competition: no modern Pirates CSG deck builder exists, and the community has been underserved for over a decade. The barrier was never demand — it was someone caring enough to do the work. PiratesWeb delivers the "holy crap, someone actually made this" moment to a community that had given up expecting it.

## Project Classification

- **Project Type:** Static web application (Svelte/SvelteKit with adapter-static)
- **Domain:** General — hobby/community tool for a tabletop card game collectible
- **Complexity:** Low — no backend, no authentication, no compliance requirements, no third-party integrations
- **Project Context:** Brownfield — functional rebuild of a 2005 C#/.NET WinForms application. Legacy code and data assets serve as the reference implementation; the new app is a complete rewrite on modern web architecture

## Success Criteria

### User Success

- A Pirates CSG fan can open the site and immediately start browsing cards with no signup, install, or onboarding
- Card images display correctly alongside accurate stats, abilities, and descriptions for all cards across three expansion sets
- Filtering by set, type, nationality, rarity, and text search produces correct, responsive results
- The experience works on desktop and mobile browsers — functional everywhere, polished on desktop
- (Phase 2) Fleet builder allows ship-centric builds with point tracking
- (Phase 3) Rules engine provides clear feedback on rule violations

### Business Success

N/A — this is a free community passion project. There is no monetization, no accounts, no business model. Success is community appreciation: the app gets shared on BoardGameGeek, Pirates CSG fans find it useful enough to bookmark and return to, and it generates positive word-of-mouth in the collector/player community.

### Technical Success

- Deploys as a static site with zero ongoing infrastructure cost
- Browsing and filtering 5000+ cards feels responsive — no perceptible sluggishness during normal use
- Card images leverage browser caching effectively since the same assets appear repeatedly across sessions
- Works across modern browsers (Chrome, Firefox, Safari, Edge)
- Card data converted cleanly from legacy XML to JSON with no data loss

### Measurable Outcomes

- 100% of cards from three sets (Spanish Main, Crimson Coast, Revolution) browsable with correct data
- All 424 card images render correctly mapped to their card entries
- Filtering produces accurate results across all filter dimensions (set, type, nationality, rarity, text search)
- Static site builds and deploys successfully via SvelteKit adapter-static
- (Phase 2) Fleet builder correctly tracks point totals
- (Phase 3) Rules engine enforces implemented rules and flags violations

## User Journeys

### Journey 1: Captain Rex — "I Wonder If They Have That Ship..."

**Opening Scene:** Rex is scrolling BoardGameGeek on a quiet evening, half-reading a thread about Pirates CSG. Someone drops a link: "check out this deck builder someone made." He clicks it, expecting nothing — maybe a broken spreadsheet or a dead link. Instead, the site loads instantly and he's looking at card images he hasn't seen in fifteen years.

**Rising Action:** He starts browsing Spanish Main cards, and the old memories flood back. He filters by Ships, then by English nationality. There's the HMS Endeavour. He clicks it — full stats, cannons, cargo, ability text, the original card art. He starts filtering by Crew, looking for captains and helmsmen. The filters are fast, the images are right. He's not fighting the tool, he's exploring.

**Climax:** Rex opens the fleet builder. He drags in a couple of ships, assigns crew, watches the point total tick up. He's tinkering with a fleet he used to run from memory, but now he can see all the stats side by side. He swaps out a crew member, checks the points — it fits. He saves the build.

**Resolution:** Rex bookmarks the site. He texts a friend: "Remember Pirates? Someone made a thing." He's going to come back before their next game night to plan a fleet. The tool didn't just show him cards — it pulled him back into the game.

**Capabilities Revealed:** Card browsing (Phase 1), image display (Phase 1), multi-dimension filtering (Phase 1), card detail view (Phase 1), fleet builder with point tracking (Phase 2), crew assignment (Phase 2), save to local storage (Phase 2).

---

### Journey 2: Trader Anne — "I've Never Seen This Card Before"

**Opening Scene:** Anne collects Pirates CSG but rarely plays competitively. She has a binder of Spanish Main cards and recently picked up a lot of Crimson Coast cards at a flea market. She wants to know what she's got — and what she's missing. She finds PiratesWeb through the same BGG thread.

**Rising Action:** She filters to Crimson Coast and starts scrolling. She recognizes some cards from her new lot. She switches to filtering by Rarity — she wants to see what the rare cards look like. She taps on a card she doesn't recognize: the Executioner. She reads the ability text, studies the artwork, checks the stats.

**Climax:** Anne filters by Treasure cards across all sets. She didn't even know there were standalone treasure cards — she thought they were just tokens. She's discovering a dimension of the game she never explored, all through browsing and filtering.

**Resolution:** Anne bookmarks the site and starts using it as a reference while sorting her physical collection. She doesn't touch the fleet builder — that's not her thing. But the card browser became her go-to lookup tool. She shares the link in a collector's group chat.

**Capabilities Revealed:** Card browsing by set (Phase 1), filtering by rarity and type (Phase 1), card detail view with artwork and ability text (Phase 1), cross-set browsing (Phase 1), text search (Phase 1).

---

### Journey 3: Captain Rex — Edge Case: "Wait, That's Not Right"

**Opening Scene:** Rex is deep in a fleet build. He's trying to squeeze one more crew member onto a ship, but the points don't add up the way he remembers. He thinks a crew card should have a cost reduction that isn't showing.

**Rising Action:** He clicks on the crew card to check its details. The ability text is there, but the fleet builder isn't applying the modifier. He realizes the rules engine doesn't cover this particular interaction yet.

**Climax:** The tool doesn't crash or give wrong results silently — it just doesn't enforce the advanced rule. The point total is still tracked correctly for what it does know. Rex does the math in his head, confirms his build works, and saves it anyway.

**Resolution:** Rex isn't frustrated — he understands this is a community tool, not a commercial product. The core experience (browsing, images, basic point tracking) is solid. The edge case is a gap, not a bug. He might mention it on BGG as a feature request.

**Capabilities Revealed:** Graceful handling of unimplemented rules (Phase 3), transparent point tracking (Phase 2), card detail view as a fallback for manual verification (Phase 1), save despite partial rules coverage (Phase 2).

---

### Journey Requirements Summary

| Capability                       | Captain Rex (Browse) | Captain Rex (Build) | Captain Rex (Edge Case) | Trader Anne | Phase |
| -------------------------------- | -------------------- | ------------------- | ----------------------- | ----------- | ----- |
| Card browsing & image display    | Primary              | Supporting          | Supporting              | Primary     | 1     |
| Multi-dimension filtering        | Primary              | Supporting          | —                       | Primary     | 1     |
| Card detail view                 | Supporting           | Supporting          | Primary                 | Primary     | 1     |
| Text search                      | Supporting           | —                   | —                       | Primary     | 1     |
| Fleet builder & point tracking   | —                    | Primary             | Primary                 | —           | 2     |
| Crew assignment to ships         | —                    | Primary             | Primary                 | —           | 2     |
| Rules enforcement (graceful)     | —                    | Supporting          | Primary                 | —           | 3     |
| Save/load fleet to local storage | —                    | Primary             | Primary                 | —           | 2     |
| Cross-set browsing               | Supporting           | Supporting          | —                       | Primary     | 1     |

## Web App Specific Requirements

### Project-Type Overview

PiratesWeb is a single-page application built with SvelteKit using adapter-static for fully static site generation. All data and assets are bundled at build time — there is no server, no API, no dynamic content. The app runs entirely client-side in the browser.

### Technical Architecture Considerations

- **Architecture:** SPA with static site generation. All card data compiled into JSON at build time. No server-side rendering, no API calls, no database.
- **Browser Support:** Modern browsers — Chrome, Firefox, Safari, Edge. No IE11 or legacy browser support required.
- **Responsive Design:** Desktop-first layout. Functional on mobile and tablet but not optimized for small screens in MVP.
- **SEO:** Not required. Discovery is through community word-of-mouth (BGG forums, collector groups), not search engines.
- **Accessibility:** No formal WCAG compliance target. Standard good practices (semantic HTML, reasonable contrast) but no audit or certification.

### Implementation Considerations

- **Data Pipeline:** XML-to-JSON conversion is a build-time step, not runtime. The converted JSON is the app's sole data source.
- **Image Handling:** 424 JPGs organized by set prefix (PPSM*\*, PPCC*_, PPRV\__). Served as static assets. Thumbnails for browse view, full images for detail view. Cache-friendly headers since images are immutable.
- **State Management:** Fleet builds stored in browser local storage (Phase 2). Svelte's built-in reactivity handles UI state.
- **Routing:** SvelteKit file-based routing. Key routes: card browse/filter, card detail, fleet builder (Phase 2).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP — deliver the "holy crap, someone made this" moment with the card browser alone. The card browser is the highest-value, lowest-complexity feature and serves both primary personas (Captain Rex and Trader Anne) without any of the fleet builder's architectural complexity.

**Resource Requirements:** Solo developer. All data assets (XML card database, 424 card images) already in hand. Primary effort is data pipeline (XML-to-JSON conversion), UI implementation, and image optimization.

### Phase 1 — Card Browser (MVP)

**Core User Journeys Supported:**

- Captain Rex browsing journey (Journey 1, browsing portion)
- Trader Anne's full journey (Journey 2)

**Must-Have Capabilities:**

- Card browsing across three expansion sets with card images
- Filtering by set, type, nationality, rarity
- Text search across card names and abilities
- Card detail view with full stats, abilities, description, modifiers, type-specific details
- XML-to-JSON data pipeline
- Card image optimization (thumbnails, lazy loading, browser caching)
- SvelteKit static site deployment with adapter-static
- Desktop-first responsive layout

### Phase 2 — Fleet Builder

- Ship-centric build model with crew assignment
- Point tracking against configurable fleet point limit
- Save/load fleet configurations to browser local storage
- Flexible, extensible rules engine architecture (stubbed — no game rules enforced yet)
- Supports Captain Rex's build journey (Journey 1, fleet builder portion)

### Phase 3 — Rules Engine

- Full game rules enforcement built from the official board game rulebook
- Duplicate card limits, crew restrictions, card-specific constraints
- Graceful handling of edge cases (Journey 3)
- Clear feedback on rule violations with explanations

### Future (No Phase Assigned)

- Additional card sets beyond the initial three
- Mobile-optimized layout
- Shareable fleet links
- Community features (build sharing, popular builds)
- Collection/ownership tracking

### Risk Mitigation Strategy

**Technical Risks:** Low. The tech stack is proven (SvelteKit, static site generation), the data format is well-understood (legacy XML with XSD schema), and the card images are already organized by set prefix. The main technical risk is data conversion accuracy — mitigated by validating converted JSON against the source XML and spot-checking card entries.

**Market Risks:** Effectively zero. There is no competition, no business model to validate, and the target audience is a known community. The risk is that nobody notices — mitigated by posting on BGG where the audience already gathers.

**Resource Risks:** Solo developer project. If time is constrained, Phase 1 (card browser) stands on its own as a complete, useful product. The phased approach means each release is independently valuable — there's no "half-built" state.

## Functional Requirements

### Card Browsing (Phase 1)

- **FR1:** Users can browse a complete card catalog spanning three expansion sets (Spanish Main, Crimson Coast, Revolution)
- **FR2:** Users can view card thumbnail images alongside card names and key attributes in a browse list
- **FR3:** Users can browse cards across all sets simultaneously or within a single set
- **FR4:** Users can paginate or scroll through large result sets without performance degradation
- **FR5:** The system displays card images using lazy loading, only rendering images as they enter the viewport

### Card Filtering & Search (Phase 1)

- **FR6:** Users can filter cards by expansion set (Spanish Main, Crimson Coast, Revolution)
- **FR7:** Users can filter cards by type (Ship, Crew, Treasure, Fort, Event)
- **FR8:** Users can filter cards by nationality
- **FR9:** Users can filter cards by rarity
- ~~**FR10:** Users can filter cards by tournament status~~ _(excluded — `tournamentStatus` field removed from data model; field has only one value in source data and provides no filter utility)_
- **FR11:** Users can combine multiple filters simultaneously (e.g., English Ships from Spanish Main)
- **FR12:** Users can perform text search across card names and ability text
- **FR13:** Users can clear all active filters to return to the full catalog
- **FR14:** The system displays the count of matching results when filters are applied

### Card Detail (Phase 1)

- **FR15:** Users can view a detailed card page displaying the full-size card image
- **FR16:** Users can view all card attributes: card number, name, set, type, rarity, nationality, point value
- **FR17:** Users can view card ability text and description
- **FR18:** Users can view ship-specific attributes: masts, cargo capacity, base move, cannons, crew slots
- **FR19:** Users can view crew-specific attributes: build bonuses, cost reductions, cargo bonuses, limit cards
- **FR20:** Users can view fort-specific attributes: cannons
- **FR21:** Users can view card modifiers when present

### Data Pipeline (Phase 1)

- **FR22:** The system converts the legacy XML card database to JSON format at build time with zero data loss
- **FR23:** The system maps all 424 card images to their corresponding card entries by filename convention
- **FR24:** The system generates thumbnail versions of card images for browse view performance

### Fleet Building (Phase 2)

- **FR25:** Users can create a new fleet build
- **FR26:** Users can add ships to a fleet build
- **FR27:** Users can assign crew cards to specific ships in the fleet
- **FR28:** Users can set a fleet point limit
- **FR29:** The system tracks the running point total of all cards in the fleet against the point limit
- **FR30:** Users can remove ships or crew from a fleet build
- **FR31:** Users can save fleet builds to browser local storage
- **FR32:** Users can load previously saved fleet builds from browser local storage
- **FR33:** Users can delete saved fleet builds

### Rules Enforcement (Phase 3)

- **FR34:** The system validates fleet builds against game rules and displays rule violations
- **FR35:** The system enforces duplicate card limits per game rules
- **FR36:** The system enforces crew assignment restrictions (crew-to-ship compatibility)
- **FR37:** The system enforces card-specific constraints defined in the game rules
- **FR38:** The system provides clear explanations for each rule violation detected
- **FR39:** The system gracefully handles cards or interactions where rules are not yet implemented, without blocking the user

## Non-Functional Requirements

### Performance

- Card browse list renders and becomes interactive within perceived-instant response time for the initial page load
- Applying or changing filters updates the visible card list without perceptible delay
- Text search returns results as the user types (or on submit) without noticeable lag
- Card images load progressively — thumbnail placeholders appear immediately, full images load as bandwidth allows
- Browser caching ensures repeat visits and navigation between views do not re-download card images
- Card detail view renders fully (image + all attributes) without visible layout shift or loading stutter

### Browser Compatibility

- The application functions correctly on current versions of Chrome, Firefox, Safari, and Edge
- No IE11 or legacy browser support required
- The application renders acceptably on tablet and mobile screen sizes (functional, not optimized)
