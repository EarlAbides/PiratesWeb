---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - docs/legacy-reference/index.md
  - docs/legacy-reference/project-overview.md
date: 2026-02-26
author: Captain
---

# Product Brief: PiratesWeb

## Executive Summary

PiratesWeb is a modern web-based deck builder and card browser for the Pirates Constructible Strategy Game (CSG). It resurrects the capabilities of a 2005 Windows-only personal tool as a cross-platform web application, making it freely accessible to the Pirates CSG fan community for the first time. With a complete card database spanning three expansion sets, 424 card images, and a full rules-validated fleet builder, PiratesWeb fills a gap in a community that currently has no modern tooling.

---

## Core Vision

### Problem Statement

Pirates CSG fans have no modern tool for browsing cards, exploring sets, or building rules-validated fleets. The only known deck builder was a personal Windows Forms application from 2005 that never reached the community, and a forum-referenced tool from 2010 of unknown status. Players are left with spreadsheets, pen-and-paper, or memory.

### Problem Impact

Without accessible tooling, the barrier to entry for fleet building is unnecessarily high — especially for newer or returning players who don't have card stats memorized. The game's rich card interactions and point-based build constraints are part of what makes it fun, but they're hard to manage without a purpose-built tool.

### Why Existing Solutions Fall Short

There are effectively no existing solutions. The original deck builder was a single-user Windows desktop app that never saw public release. Whatever existed circa 2010 is likely defunct and was never modernized. The community has been underserved for over a decade.

### Proposed Solution

A static web application built with Svelte/SvelteKit that provides:

- **Card browsing and filtering** across three expansion sets (Spanish Main, Crimson Coast, Revolution) with full card images
- **Ship-centric fleet building** with point-based validation, duplicate limits, and card-specific restrictions faithful to the original game rules
- **Save/load deck configurations** for reuse and sharing
- Deployable as a static site with no backend required — fast, free to host, accessible from any device

### Key Differentiators

- **Complete card data asset:** 5000+ card entries with structured data and 424 card images across three sets, already in hand
- **Authentic rules engine:** Built from a working implementation with deep domain knowledge of the game's build constraints
- **Zero competition:** No modern Pirates CSG deck builder exists
- **No infrastructure cost:** Static site deployment means it can be hosted for free and run entirely client-side
- **Expansion potential:** Card data for additional sets beyond the initial three exists and could be integrated in the future (images permitting)

## Target Users

### Primary Users

**"Captain Rex" — The Veteran Player**
An experienced Pirates CSG player who knows the game well. They have a collection sitting in a box somewhere and fond memories of playing. They visit BGG occasionally to see if anyone's still talking about the game. When they find PiratesWeb, they'll spend time browsing cards they remember, rediscovering ones they forgot, and tinkering with fleet builds for fun — maybe even sparking a desire to pull out the game again for a session with friends.

- **Motivation:** Nostalgia, exploration, and the joy of a well-built fleet
- **Core usage:** Browsing cards with filters, casually experimenting with fleet builds
- **Success moment:** "I can't believe someone made this — let me see if they have that one ship..."

**"Trader Anne" — The Casual Collector**
A Pirates CSG fan who appreciates the cards as collectible objects. They may or may not play regularly but love browsing the sets, seeing the artwork, and understanding what's out there. Filters and card details matter more to them than the fleet builder.

- **Motivation:** Exploring the card universe, appreciating the art and lore
- **Core usage:** Browsing and filtering by set, type, nationality, rarity
- **Success moment:** Finding a card they've never seen and reading its ability text alongside the original artwork

### Secondary Users

N/A — This is a focused community tool. There are no admin, support, or oversight roles. The app is a static site with no accounts or user management.

### User Journey

1. **Discovery:** A BGG thread or post links to PiratesWeb — "someone built a digital card browser and deck builder for Pirates CSG"
2. **Onboarding:** No signup, no install. They land on the site and immediately see cards with original imagery. Zero friction.
3. **Core Usage:** Browse cards by set, filter by type/nationality/rarity, view card images and stats. Optionally build fleets with point validation.
4. **Success Moment:** Seeing familiar cards rendered digitally with all their stats, or successfully assembling a fleet that passes rules validation.
5. **Long-term:** Bookmark it. Share the link on BGG. Come back before game sessions to plan builds or just to browse.

## Success Metrics

This is a passion project and community contribution with no business model or monetization. Success is measured by whether the tool is useful and appreciated by the Pirates CSG community.

**User Success Indicators:**

- Users can browse and filter the complete card catalog across all three sets without friction
- Card images load cleanly and card data is accurate and complete
- Fleet builder enforces game rules correctly — builds that should be valid are, and invalid ones are flagged with clear reasons
- The app works well on desktop and mobile browsers
- Zero-friction access: no signup, no install, just open and use

**Community Success Indicators:**

- The app gets shared on BoardGameGeek forums
- Positive feedback from Pirates CSG fans
- Players find it useful enough to bookmark and return to

**Technical Success Indicators:**

- Static site deploys reliably with no ongoing infrastructure cost
- Page loads are fast — card browsing feels snappy even with 5000+ entries
- Works across modern browsers (Chrome, Firefox, Safari, Edge)

### Business Objectives

N/A — This is a free community tool with no monetization, no accounts, and no business model.

### Key Performance Indicators

Given the nature of this project, formal KPIs are not applicable. If analytics are ever added (optional), useful signals would be:

- Unique visitors per month
- Average time spent browsing cards
- Number of fleets built per session

These would be nice-to-know, not need-to-know.

## MVP Scope

### Core Features

**Card Browser & Filtering (Primary Feature)**

- Browse complete card catalog across three expansion sets (Spanish Main, Crimson Coast, Revolution)
- Display card images alongside full card stats and ability text
- Rich filtering by: set, type (Ship/Crew/Treasure/Fort/Event), nationality, rarity, tournament status
- Text search across card names and abilities
- Fast, responsive browsing across 5000+ entries

**Card Detail View**

- Full card image display
- All card attributes: stats, abilities, description, modifiers
- Ship-specific details: masts, cargo, base move, cannons
- Crew-specific details: build bonuses, cost reductions

**Fleet Builder (Secondary Feature)**

- Ship-centric build model: select ships, assign crew
- Point tracking against configurable fleet point limit
- Rules validation ported from legacy app on a best-effort basis (duplicate limits, crew restrictions, card-specific constraints)
- Save/load fleet configurations to browser local storage

**Technical Foundation**

- Svelte/SvelteKit static site with adapter-static
- Card data converted from legacy XML to JSON
- Card images optimized for web (thumbnails, lazy loading)
- Desktop-first responsive layout

### Out of Scope for MVP

- Collection/ownership tracking
- Shareable build links
- Mobile-optimized layout (functional on mobile but not a design priority)
- Additional card sets beyond the initial three
- User accounts or backend services
- Print functionality
- Analytics

### MVP Success Criteria

- All cards from three sets browsable with accurate data and working images
- Filtering produces correct results across all filter dimensions
- Fleet builder correctly tracks points and enforces legacy rules where preserved
- Site deploys as a static site and loads quickly
- A Pirates CSG fan on BGG can open it and immediately start browsing cards

### Future Vision

- **Additional card sets:** Integrate card data for sets beyond the initial three (images may not be available for all sets — data-only entries are acceptable)
- **Image optimization improvements:** Progressive loading, higher resolution options
- **Mobile-optimized experience:** Dedicated mobile layout for on-the-go browsing
- **Shareable builds:** Generate links to share fleet configurations with other players
- **Community features:** If demand warrants it — build sharing, popular builds, etc.
