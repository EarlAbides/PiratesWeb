# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PiratesWeb is a **greenfield rebuild** of a 2005 Windows Forms deck builder for the Pirates Constructible Strategy Game (CSG). The new app is being built as a **cross-platform web application using Svelte/SvelteKit**, deployable as a static site.

### What the app does

Users browse cards from multiple Pirates CSG expansion sets, track owned cards, build fleet compositions with point-based validation against game rules, and save/load deck configurations.

### Legacy Reference

The original C# WinForms application lives at `/Users/jearl/Projects/Legacy/Pirates!` and serves as the functional reference for this rebuild. Key reference materials are included in this repo:

- `docs/legacy-reference/project-overview.md` — Full anatomy of the original app (architecture, file map, data format)
- `reference/PiratesCards.xml` — The complete card database (~5000+ entries, 437 KB). This is the canonical data source to convert to JSON.
- `reference/CardData.xsd` — XML schema definition for the card data model

### Card Data Model

Cards have these key attributes: CardID, CardSet, Type (Ship/Crew/Treasure/Fort/Event), Rarity, Nationality, TournamentStatus. Each card contains Identification (number, name), Stats (point value), Image reference, Ability text, Description, and Modifiers.

Ship cards have: masts, cargo capacity, base move, cannons, crew slots.
Crew cards have: build bonuses, cost reductions, cargo bonuses, limit cards.
Fort cards have: cannons.

### Card Sets

- Pirates of the Spanish Main (PPSM) — prefix codes: EC, ES, GC, GS, GT, PC, PS, SC, SS, TC
- Pirates of the Crimson Coast (PPCC) — numbered 001-130
- Pirates of the Revolution (PPRV) — numbered 001-144

### Build Validation Rules (from legacy app)

Fleet builds are constrained by total point limits, duplicate card limits, and card-specific restrictions enforced by the `Build` class in the original app.

## Technology Stack

- **Framework:** Svelte 5 / SvelteKit
- **Language:** TypeScript
- **Deployment:** Static site generation (SvelteKit adapter-static)
- **Data:** JSON (converted from legacy XML)
- **Card Images:** 423 JPGs organized by set prefix

## BMAD Workflow

This project uses BMAD for planning and implementation. Start with `create a product brief` to begin the planning flow. The legacy documentation in `docs/legacy-reference/` provides brownfield context.
