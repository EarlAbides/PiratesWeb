# Pirates! — Project Documentation Index

**Generated:** 2026-02-25 | **Mode:** Initial Scan (Quick)

## Project Overview

- **Type:** Monolith — single Visual Studio solution
- **Language:** C# (.NET Framework 2.0)
- **UI Framework:** Windows Forms
- **Architecture:** 3-tier (UI → Business Logic → Data Access)
- **Company:** Omega Concern
- **Original Date:** October 2005

## Quick Reference

- **Entry Point:** `Pirates!/Program.cs` → `MainForm.cs`
- **Card Database:** `PiratesData/PiratesCards.xml`
- **User Data:** `UserData.xml` (generated at runtime)
- **Build System:** MSBuild via `Pirates!.sln`
- **Source Files:** 37 C# files (~6,800 LOC)
- **Image Assets:** 423 card JPGs in `Pirates!/Images/`

## Generated Documentation

- [Project Overview](./project-overview.md)

## Build (Original)

```bash
msbuild "Pirates!.sln" /p:Configuration=Debug
msbuild "Pirates!.sln" /p:Configuration=Release
```

Requires Visual Studio 2005 or compatible MSBuild tooling with .NET Framework 2.0.
