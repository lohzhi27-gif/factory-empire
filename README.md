# Factory Empire 🏭

An original, mobile-friendly factory management simulation game built independently.

## Official game direction (approved 2026-10-18)

**Hybrid = isometric factory management + third-person entrepreneur walkabout.** The same saved factory, jobs and cash flow are shared by both modes. We will build production gameplay first, then a small 3D walkable workshop, and only later external business locations.

- [Game vision and design rules](docs/GAME_VISION.md)
- [After-work development roadmap and milestone acceptance tests](docs/DEVELOPMENT_ROADMAP.md)

**Important:** This vision is planned; v0.1 is still a 2D browser prototype. The next coding milestone is v0.2: original realistic-looking starter VMC, single-machine start and touch-based factory floor placement.

## Play

When GitHub Pages is enabled from `main` → `/(root)`, open:

**https://lohzhi27-gif.github.io/factory-empire/**

The website uses the repository's `index.html`. It currently runs in Safari and other browsers; it is **not** yet a native Android/iOS app.

## Current build — v0.1

- Review and accept customer RFQs
- Operate a CNC and purchase additional CNC / laser equipment
- Purchase aluminum and steel
- Hire operators and run multiple shifts
- Advance simulation days, manage production and late deliveries
- Monitor invoices, cash and machine condition

### First playtest (iPhone or iPad)

1. Open the Pages URL in Safari.
2. Tap **New RFQs** and accept an order.
3. Tap **+1 Day** a few times and confirm production advances.
4. Tap **Purchasing & Inventory** to buy raw material.
5. Tap **Equipment** to buy a machine, then hire an operator.
6. Reload the browser page and verify your game saves.
7. Send a screenshot and a short description of anything confusing or broken.

**Warning:** v0.1 saves to this browser's local storage. Clearing browser data can erase progress.

## Next milestone — v0.2

An interactive, touch-friendly isometric factory floor:

- Tap a free tile to select it
- Purchase and place machinery at a selected location
- Move or rearrange machinery
- Show placement cost, footprint and restrictions
- Save factory layout across browser sessions

## Collaboration

The owner tests the game in Safari on iPhone/iPad, chooses gameplay priorities and provides real-world manufacturing insight. ChatGPT helps write and revise code during development sessions. Commit changes in small, testable milestones.

## Important

- This is an early **isometric 2D** browser prototype; not a 3D-engine release.
- There are no real in-app purchases, advertisements or payment processing.
- Never commit secrets, credentials, proprietary customer drawings or other confidential materials.
- This repository is public. Anyone can view the code and the published game.
- Use original game content; avoid using copyrighted Industrialist 3D code or art.
