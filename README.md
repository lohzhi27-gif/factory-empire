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

## Current build — v0.2 preview (2026-10-18)

- Touch an original enclosed VMC model, select it, and relocate it to a free 2 × 2 tile area
- Select **Equipment → Place VMC**, then tap a free 2 × 2 area to purchase another VMC for **RM180,000 of in-game cash**; no actual money changes hands
- Factory floor saves tile locations across browser reloads, including existing v0.1 saves
- Review and accept customer RFQs
- Operate a CNC and purchase additional CNC / laser equipment
- Purchase aluminum and steel
- Hire operators and run multiple shifts
- Advance simulation days, manage production and late deliveries
- Monitor invoices, cash and machine condition

### v0.2 preview playtest (iPhone or iPad)

1. Open the Pages URL in Safari; look for the heading **Factory Floor Preview v0.2**.
2. Tap the starter VMC, then choose **Move selected**.
3. Tap a free 2 × 2-tile area. The machine should move and **cash should not change**.
4. Refresh the page and confirm that the VMC stays in its new position.
5. Accept an RFQ and advance a day; existing gameplay must still work.
6. Send a screenshot and report confusing or broken controls.

Purchasing another VMC costs **RM180,000 in-game**. Most new games do not have that much cash, so testing *moving the free starter* is the immediate priority. The **RM15 real-money introductory second-machine offer** is only a design proposal, not implemented or billed.

**Warning:** v0.1 saves to this browser's local storage. Clearing browser data can erase progress.

## Next milestones

- **v0.2 preview (now):** custom VMC floor drawing, selection, movable machines, 2×2 collision rules and local layout saves. The scene remains procedural 2D isometric art, not a real 3D model.
- **Finish v0.2:** improve mobile visual legibility, test on real devices and tune economy/prices.
- **v0.3:** connect owner-provided RFQs and process lead times to production and payment logic.
- **v0.4:** prototype a small walkable 3D workshop sharing the same simulation state.

## Collaboration

The owner tests the game in Safari on iPhone/iPad, chooses gameplay priorities and provides real-world manufacturing insight. ChatGPT helps write and revise code during development sessions. Commit changes in small, testable milestones.

## Important

- This is an early **isometric 2D** browser prototype; not a 3D-engine release.
- There are no real in-app purchases, advertisements or payment processing.
- Never commit secrets, credentials, proprietary customer drawings or other confidential materials.
- This repository is public. Anyone can view the code and the published game.
- Use original game content; avoid using copyrighted Industrialist 3D code or art.
