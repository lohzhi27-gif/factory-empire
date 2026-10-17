# FACTORY EMPIRE — After-work Development Roadmap
Status: official direction | Hybrid camera game approved: 2026-10-18

## Working assumptions
- Founder tests on iPhone/iPad; ChatGPT helps with code and documentation during active chat sessions.
- 3 sessions/week × 1–2 hours is an OPTIONAL pace estimate, not an automated working schedule or delivery promise.
- Browser gameplay first; no paid developer/artist until there is evidence of player retention.
- `index.html` is presently an HTML/JS isometric 2D prototype (v0.1), not yet a 3D game.

| Phase | Deliverable | Minimum acceptance check | Indicative effort at part-time pace |
|---|---|---|---|
| v0.1 **Existing** | Basic RFQs, purchases, operators, production, cash flow | Existing browser demo loads | Already present |
| v0.2 **NEXT** | Recognizable original budget VMC, touch-based tile placement/movement, 1-machine starting state, data-driven machine display | On iPhone: place one VMC, move it, reload without losing layout; no phantom duplicates | ~3–6 weeks |
| v0.3 **Production core** | Data-driven 4 example RFQs; procurement queue (2–5 days), programming (2 days), machining cycle time, capacity and overdue alerts; job route and payment terms | One sample job flows from RFQ through material/program/machining to delivery, with correct per-piece revenue | ~4–8 weeks |
| v0.4 **Hybrid proof** | Small walkable original 3D workshop; third-person avatar, touch movement, inspection interaction, switch to isometric management | Both views show the same machine status and active job; runs acceptably on actual iPhone/iPad | ~6–12 weeks |
| v0.5 **Process depth** | Tapping/wirecut/EDM/polish/deburr/grinding capability gates; finishing subcontract queue with normal/rush modes, +50% price; QA and packing | 3-day rush skips non-working days; rush applies only to process cost; impossible routes are flagged | ~6–12 weeks |
| v0.6 **Entrepreneur layer** | Walkable office and 1–2 offsite locations; job offers/customer relationship, basic hiring and property/lease choices; supervisors automate repetition | Player can walk to meet a customer, win a job, return to factory and complete it through the same simulation | ~8–16 weeks |
| v0.7 **Playtest beta** | Tutorial, save migration, balance, performance, onboarding, analytics/privacy; Android packaging candidate | External testers can play a session and return; core game does not require IAP | ~6–12 weeks |
| v0.8+ **Business launch candidates** | App-store compliance/testing, optional rewarded ads and RM15 introductory extra-machine offer after careful economy testing | Purchases restore correctly; no paid progression dead-end; launch metrics reviewed | As needed |

**These are planning ranges, not commitments.** Full 3D and mobile distribution can take much longer; device/build access or hired help may eventually be required.

## Immediate next sprint — v0.2
1. Examine starter-machine reference photo for generic machine silhouette (enclosure, front doors, spindle window, machine base, control cabinet) without copying brand marks.
2. Move start configuration to one generic starter CNC, one operator, low-volume RFQs.
3. Build a responsive floor grid with camera pan/zoom and tap-to-select tile.
4. Build place/move machine interactions with a cash cost display and collision check.
5. Persist floor layout and selected machine; test Safari mobile screen size.
6. Preserve v0.1 gameplay; no real payment integration yet.

### Definition of Done
- A workshop visually reads as a plausible VMC-equipped workshop rather than abstract blocks.
- A player using only touch can place, move and inspect a machine.
- Starting state has precisely one VMC. No accidental duplicate machines after reload.
- Saves survive normal page refresh. Existing v0.1 financial figures still work.
- Screenshots from iPhone/iPad are reviewed and issues recorded.

## Technical architecture (target; not all present)
- `game/simulation/`: machines, production, material orders, RFQs, time, payments, workers, subcontract calendar.
- `game/data/` or `data/`: validated editable customer/machine/RFQ/finishing masters (the existing `data/` files).
- `game/views/isometric/`: production and factory management controls.
- `game/views/walk/`: later 3D walking environment.
- Common `GameState` and save format; migration/version field; simulation unaffected by camera view.
- Initial browser rendering can remain simple; evaluate Three.js/Babylon.js or a dedicated engine after the loop stabilizes. On-device performance is a hard constraint.
- In-app purchase, ads and mobile store build tooling require specialized integration/validation and are NOT possible from an HTML mockup alone.

## Responsibilities
- **Founder**: real shop references, decide realism/balancing, give customer/process samples, test each new build.
- **Assistant**: implement one scoped feature per session, commit source updates where authorized, explain tradeoffs, document test instructions, address reported issues.
- Keep game code and assets original. No private customer documents in public GitHub.

## Key project risks
- Scope explosion from a hybrid open-world vision: limit walking world to a room before a city.
- Browser 3D performance on phones: prototype and benchmark early.
- False revenue expectations: free downloads have no intrinsic revenue; test actual retention and IAP conversion.
- "RM15 second machine" could feel pay-to-win: make early machine growth earnable with gameplay and test purchase value.
- Editing old saves may require a migration utility; protect player progress.
- No precise delivery dates without a consistent development environment and regular test results.

## Next founder input
No more lead-time tables are required immediately. Test the next v0.2 build on iPhone/iPad, share one screenshot and note whether floor placement feels easy. Later confirm start cash/loan balance, shift hours and whether 2-week RFQ dates are calendar vs working days.
