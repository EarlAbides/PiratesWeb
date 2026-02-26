# Pirates! — Project Overview

**Generated:** 2026-02-25 | **Scan Level:** Quick

## What Is This?

Pirates! is a **Windows Forms desktop application** for building and managing decks for the Pirates Constructible Strategy Game (CSG). Built in **C# on .NET Framework 2.0** with Visual Studio 2005 by Omega Concern.

Users can:
- Browse cards from multiple expansion sets (Spanish Main, Crimson Coast, Revolution)
- Track which cards they own and quantities
- Build fleet compositions with point-based validation against game rules
- Visualize ships with assigned crews and stats
- Save/load deck configurations
- Print deck layouts

## Solution Structure

**Solution:** `Pirates!.sln` (Visual Studio 2005, Format Version 9.00)

| Project | Type | Output | Purpose |
|---------|------|--------|---------|
| **Pirates!** | WinExe (.csproj) | Pirates!.exe | Main WinForms application — UI, custom controls, card images |
| **PiratesLib** | Library (.csproj) | PiratesLib.dll | Business logic — card models, deck building, build validation |
| **PiratesData** | Library (.csproj) | PiratesData.dll | Data access — XML card database, user data persistence |
| **PiratesSetup** | Setup (.vdproj) | MSI installer | Windows installer package (not MSBuild-compatible) |

## Dependency Graph

```
Pirates! (UI)
  ├── references → PiratesLib (Business Logic)
  │                    └── references → PiratesData (Data Access)
  └── references → PiratesData (Data Access)
```

## Technology Stack

| Category | Technology | Details |
|----------|-----------|---------|
| Language | C# | .NET Framework 2.0 era |
| UI Framework | Windows Forms | DataGridView, custom UserControls, drag-and-drop |
| Build System | MSBuild | Visual Studio 2005 project format |
| Data Storage | XML | XPath queries, typed DataSets (XSD-generated) |
| Deployment | ClickOnce + MSI | System.Deployment reference + .vdproj setup project |
| Dependencies | System assemblies only | System, System.Data, System.Drawing, System.Windows.Forms, System.Xml |

**No third-party libraries.** All dependencies are .NET Framework BCL assemblies.

## Key Files by Project

### PiratesData (Data Access Layer)
- `CardStore.cs` — Loads card database from `PiratesCards.xml` via XPath
- `UserData.cs` — Manages user-owned card counts, persisted to `UserData.xml`
- `CardData.xsd` → `CardData.cs` / `CardData.Designer.cs` — Auto-generated typed DataSet
- `PiratesCards.xml` (437 KB) — Complete card database (~5000+ card entries)

### PiratesLib (Business Logic)
- `Card.cs` — Abstract base class for all card types
- `ShipCard.cs`, `CrewCard.cs`, `TreasureCard.cs`, `FortCard.cs`, `EventCard.cs` — Card type implementations
- `Build.cs` — Fleet build validator (point totals, duplicate limits, card constraints)
- `CardDeck.cs` — Card collection manager with filtering
- `Cannon.cs` / `CannonCollection.cs` — Cannon properties
- `BuildCollection.cs`, `ShipCardCollection.cs`, `CrewCardCollection.cs` — Typed collections
- `Configuration.cs` + `Config.xml` — App configuration (image store directory)

### Pirates! (WinForms UI)
- `Program.cs` — Application entry point
- `MainForm.cs` — Primary UI: DataGridView, split containers, tabbed interface, drag-and-drop
- `ShipControl.cs` / `CrewControl.cs` — Custom UserControls for ship/crew display
- `CardUtility.cs` — Card display helpers
- `GridViewCannons.cs`, `GridViewIcon.cs` — Custom DataGridView column renderers
- `NumericUpDownCell.cs` / `NumericUpDownColumn.cs` / `NumericUpDownEditingControl.cs` — Custom cell editors
- `ControlPrintDocument.cs` — Print support
- `Images/` — 423 card image JPGs (PPSM_*, PPCC_*, PPRV_* prefixes)

## Card Data Format

Cards in `PiratesCards.xml`:
```xml
<Card CardID="5758" CardSet="Pirates of the Spanish Main" Type="Crew" Rarity="..." Nationality="..." TournamentStatus="...">
  <Identification CardNumber="EC-001" Name="Admiral Morgan" />
  <Stats PointValue="5" />
  <Image URL="..." Filename="PPSM_EC-001.jpg" />
  <Ability>...</Ability>
  <Description>...</Description>
  <Modifiers BuildBonus="..." />
</Card>
```

Card types: Ship, Crew, Treasure, Fort, Event.

## Code Statistics

- **37 C# source files** across 3 projects
- **423 card image assets** (JPG) organized by set prefix
- **~6,800 lines of C#** total
- **0 unit tests**
- **0 third-party dependencies**

## Architectural Patterns

- Classic **3-tier architecture**: Presentation → Business Logic → Data Access
- No dependency injection — direct object construction throughout
- XML-based persistence (no database engine)
- Typed collections (pre-generics pattern, .NET 2.0 era)
- WinForms designer files (`.Designer.cs`) are auto-generated
- Card images embedded as project Content items, copied to output directory
