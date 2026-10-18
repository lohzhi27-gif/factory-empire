# Factory Empire 🏭

An original, mobile-friendly factory management simulation game built independently.

## Official game direction — mobile-first management (2026-10-18)

**Factory Empire is a manufacturing tycoon/management prototype, not an RPG.** We are prioritizing fun, repeatable decisions and a low-cost market test; no third-person walkabout or open-world city in the current roadmap.

- [Updated official game vision](docs/GAME_VISION.md)
- [Revised development roadmap](docs/DEVELOPMENT_ROADMAP.md)
- [v0.4 capability, cost, staffing and hot-job design specification](docs/V04_JOBBING_SPEC.md)

**Release status:** v0.3.4 remains the working playable browser version. v0.4 features are documented proposals/owner rules and **are not implemented** yet.

**New v0.4 capacity rule:** One operator can tend **2–3 CNCs** in one shift, but all new part changes need setup: **easy 0.35h (21 min), medium 1.5h (90 min), difficult 3h (180 min)**. Setup time uses that worker's finite attendance hours and cannot overlap on two machines. Two shifts covering one 2–3-CNC cell need **two separate workers total**, not two workers *per machine*. A high-paying hot job may displace existing machine setups; **switching A → B → A requires the full Part A setup again**, and the sole minion being busy with any setup reduces output on other CNCs by delaying their load/unload/attendance tasks. Autonomous cutting already underway can finish, but machine cycles cannot restart without operator attention. In-app purchases remain optional future ideas; paid rescue is not required to enjoy the prototype.

**Confirmed v0.4 rule:** urgent/hot customer jobs allow **4 calendar days** (weekends included) while procurement, programming, and outsourced wirecut still take working days. This is a specification change only; the playable game is unchanged.

**Additional confirmed v0.4 rules:** Weekend overtime is optional and costs **2× ordinary wages per worker**, with **resignation after three consecutive worked overtime weekends**, not merely refusal. Each new employee starts with **40% skill**, learning through jobs toward **80% mastery in about two months**. Defective parts carry material/rework costs; customer-escaped defects can bring claim costs and relationship loss (amounts to balance). Each customer begins at **40% individual relationship**: on-time shipments improve the account, late shipments trigger penalties and worsen its future price/volume offers. A new customer-logo relationship network is planned, not implemented.

## Play

When GitHub Pages is enabled from `main` → `/(root)`, open:

**https://lohzhi27-gif.github.io/factory-empire/**

The website uses the repository's `index.html`. It currently runs in Safari and other browsers; it is **not** yet a native Android/iOS app.

## v0.3.4 — Main-page Production / Gantt switch (2026-10-18)

As requested in the playtest, Gantt is no longer confined to the right-hand operations sidebar.

- A two-choice workspace switch immediately below the main KPI dashboard provides **1 — Production View** and **2 — Gantt Chart View**.
- **Production View** keeps the existing isometric workshop, movable machines, right-side customer/order tabs, inventory, factory activity, cash forecast and management decisions.
- **Gantt Chart View** replaces the two-column dashboard with **one full-width jobbing Gantt**, using the *same existing chart DOM element and planning logic*: material stock/shortage status, incoming supplier POs, production stages, due dates, 14/28/42-day selector and fullscreen.
- The top-nav **Schedule** shortcut now opens the full-width Gantt rather than scrolling to the former narrow tab. Navigating to Workshop, Production, Customers, Machines or Finance returns to Production View.
- The **↓ Purchasing** shortcut in Gantt returns to Production View and scrolls to materials. The previous narrow right-side Job Gantt tab is removed to avoid duplicate/competing views.
- Neither workspace toggle changes the game day, money, machine placement, accepted jobs, procurement or the established local save key.

### Quick verification

1. Open https://lohzhi27-gif.github.io/factory-empire/ and find **WORKSPACE V0.3.4**.
2. Tap **1 · Production View** to see the familiar factory workspace.
3. Tap **2 · Gantt Chart View** — the main workshop and side panel are replaced by a full-width jobbing chart.
4. Try day ranges, horizontal scrolling, **Expand Gantt**, and the top-nav Schedule shortcut.
5. Use **Production View** (or the return button) to come back to machinery. Check that your orders and machine locations haven't changed.
6. On mobile, tap **↓ Purchasing** inside Gantt: it should open the inventory in Production View.
7. Please send a screenshot in your preferred device orientation.

## v0.3.3 — Jobbing Gantt + material availability (2026-10-18)

**Playable user-requested planning upgrade.** No changes to machine positions, purchases, existing production state, day advancement, or saved game keys.

- **Schedule** in the top navigation and **Job Gantt** in the Production & Orders tabs.
- Scrollable **14 / 28 / 42-day** jobbing timeline, plus **Expand Gantt** to view the schedule full-width.
- Each active job has a row showing the part, customer, quantity, due game day, and **material status**: available from current stock, covered by an incoming PO with day of arrival, or not covered (material shortage).
- Timeline uses stage colors for **material waiting**, **programming**, **projected machining**, and customer **due-date** markers. Weekends are shaded.
- Supplier material POs appear on the same chart as distinct rows from placement to **Day X delivery**. The material summary beneath the Gantt shows on-hand aluminum and steel, outstanding POs and their arrival days.
- The planner allocates *theoretical* stock to jobs in due-date order when assessing coverage, so it does **not** count the same inventory twice. This is **a read-only estimate, not a physical stock reservation**.
- Where stock + open POs cannot cover a job, the schedule displays **Short X kg / ETA unknown** instead of fabricating a production completion date.
- Simplified capacity estimates use 420 machining minutes/shift and available machines/operators. They **do not account for scrap, machine failures, operator conflicts across separate machine types, subcontract finishing, customer shipping or public holidays**. The existing production engine remains authoritative for what actually happens.

### iPhone / iPad testing

1. Refresh https://lohzhi27-gif.github.io/factory-empire/ until the header says **JOBBING GANTT v0.3.3**.
2. Accept an RFQ, then tap **Schedule** at the top or **Job Gantt** inside Production & Orders.
3. Check that the job shows its material status, programming bar, machining estimate and due-date marker.
4. In **Materials & Inventory**, order a small quantity of aluminum or steel, then return to **Schedule**. A **PO row and supplier arrival Day** should appear.
5. Test **14 / 28 / 42-day** views and **Expand Gantt**, then close it.
6. Advance one day and verify the chart and PO ETA automatically update. Refresh and confirm progress is intact.
7. Share a screenshot and point out any dates, shortages or labels that don't match your real production-planning intuition.

## v0.3.2 — Production routing foundation (2026-10-18)

The first phase of v0.3 is live. This release retains v0.3.1's polished UI and drag/save machine moving, preserves old `factory_empire_proto_v1` saves, and introduces a **real waiting sequence** for newly accepted RFQs:

**Materials available** → **CNC programming (2 working days)** → **Machining** → **Existing simplified shipment/invoice logic**.

- Material purchases no longer appear immediately in inventory. Enter a **quantity in kg** (1–1,000 kg, default 10) and place a material PO with a randomly assigned **2–5 working day** supplier lead time.
- Material orders are paid when placed and stored in a queue showing the arrival game day. Materials enter inventory on delivery.
- New production orders check stock for their initial required volume. If not enough, they enter **Awaiting material** and only queue for programming after a sufficient quantity is in stock.
- After material is ready, programming occupies **two full workdays**. Milling/laser production begins on the following working day. The order card displays the active stage and remaining programming days.
- **Day 1 is simulated Monday.** Saturday and Sunday do not progress procurement, programming or machining. Recurring overhead is still charged each calendar day; wages and production utilities are charged on workdays only. **Public holidays are not yet implemented**; actual customer calendar and holiday region will be refined later.
- Previously accepted orders keep their existing machining state, so updates do not rewind already produced parts.
- Critical customer deadline warnings are estimates and exclude actual finishing/inspection/delivery routing.
- Surface treatment subcontracting (normal five workdays, rush three workdays +50% process cost), support equipment and packing remain **v0.5 planned work**, not implemented by this update.
- The 4 owner-provided sample RFQs and additional material grades are in project data, **not yet activated as gameplay RFQs**. Current playable RFQ templates remain the earlier proof-of-concept jobs. This is the first v0.3 increment, not the completed production release.

### Test this on iPhone/iPad

1. Open https://lohzhi27-gif.github.io/factory-empire/ and confirm header **PRODUCTION PREVIEW v0.3.2**.
2. Open **Customers**, accept an available CNC RFQ, and open **Production**. It should show **Programming — 2 working days** if the initial material is on hand.
3. Press **+1 Day** once; it should show **1 working day remaining** and **0 pieces completed**.
4. Advance another day: program finishes and CNC can start the *following working day*, not immediately.
5. Under **Materials & Inventory**, enter **10 kg**, tap **Order material**, and check the new PO queue and arrival game day. Stock must not increase immediately.
6. Advance to the delivery day and verify stock increases and the material PO disappears from the pending queue. Weekend days do not count toward supplier lead time.
7. Refresh Safari and confirm machines, cash, orders, procurement and production phases remain saved.
8. **Avoid Restart** if you want to preserve old progress.

## v0.3.1 — Easier machine moving (2026-10-18)

This updates the working factory floor only; production, balances, equipment price and the local save key are unchanged.

**iPhone / iPad instructions:**

1. Open the game, tap the machine itself (including its upper enclosure).
2. Tap **Move selected**. A move panel appears below the floor.
3. Either **drag the machine**, **tap a new floor tile**, or use the **four direction arrow** buttons (↖ ↗ ↙ ↘) to nudge it by one tile.
4. The green floor outline shows a valid temporary position. A red outline indicates blocked/out-of-bounds placement.
5. Tap **Save position** to permanently move the machine, or **Cancel** to keep the original position. Until saved, cash and saved machine coordinates remain unchanged.
6. Refresh the game after saving; confirm that the location persists.

Machine footprint rules remain: 2 × 2 tiles for the starter VMC; 3 × 2 for the fiber laser. Relocating owned machines is free. No real payments are involved. The rest of v0.3's interface is intentionally left alone.

## v0.3 — Live interface upgrade (2026-10-18)

This upgrade changes the **actual playable browser UI**, not a concept screenshot. It preserves the same production simulation, machine purchases, RFQs, cash handling, user-generated floor layout and original localStorage save key.

- Original industrial navy/cyan/amber visual theme across the header, management cards, buttons and dialogs.
- Working top navigation: **Workshop, Production, Customers, Machines, Finance**; **+1 Day** also advances the simulation.
- Factory viewport has a drawn warehouse wall, loading shutter, warm workshop lighting, safety perimeter, tool chest, metal workbench and larger fictional machine illustrations.
- Mobile/tablet layout shows the workshop, then customer/production tabs, then supporting inventory/activity/cash/management sections.
- **Expand floor** increases the canvas view on narrow devices so a user can scroll across the workshop and place machinery more precisely.
- Existing functional in-panel tabs, manufacturing, finance, equipment inspection, VMC and laser purchase logic remain working. All money in prototype is game currency only.
- This remains **interactive 2D isometric artwork**, not photorealistic or free-roaming 3D. The official hybrid walkabout feature is still a future milestone.

### Mobile test — v0.3

1. Visit https://lohzhi27-gif.github.io/factory-empire/ and refresh after GitHub Pages publishes. Header should say `INTERFACE PREVIEW v0.3`.
2. Test top tabs **Workshop, Production, Customers, Machines, Finance**. All should scroll to the relevant working panel.
3. Tap **+1 Day** on the top bar and check Day + cash change; test the old **+1 Day** button too.
4. Tap **Expand floor** and inspect the VMC. In portrait, scroll horizontally to see the floor; close expanded view.
5. Move the free starter VMC, reload Safari and check that its position, cash and orders survived.
6. Tap **Preview laser**, verify its reference design, the RM150,000 game-cash price and 365 operating-day service life description.
7. Send screenshots in **portrait and landscape** and note any cut-off buttons, text overflow or unreadable tiles.

## Previous build notes

## Current build — v0.2.4 fiber laser preview (2026-10-18)

- See a more detailed, original unbranded starter VMC sprite; tap the CNC and choose **Inspect machine** to view the full illustration
- Touch the CNC on the floor, select it, and relocate it to a free 2 × 2 tile area
- Select **Equipment → Place VMC**, then tap a free 2 × 2 area to purchase another VMC for **RM180,000 of in-game cash**; no actual money changes hands
- The open-bed **Fiber Laser 3015** costs **RM150,000 in-game cash**. It is an original, unbranded illustration inspired by the owner's reference photo (long slatted cutting bed, moving gantry, separate controller).
- Fiber laser occupies **3 × 2 floor tiles**, compared to the starter VMC's **2 × 2**.
- Laser durability is **365 operating game days before major service**. The status panel shows remaining days; maintenance (currently RM850 in-game) resets its service counter. Idle days do not consume durability and normal laser random-breakdowns are disabled before service is due.
- Existing saves migrate to this new laser durability system, preserving machine ownership and player finances.
- Factory floor saves tile locations across browser reloads, including existing v0.1 saves
- Review and accept customer RFQs
- Operate a CNC and purchase additional CNC / laser equipment
- Purchase aluminum and steel
- Hire operators and run multiple shifts
- Advance simulation days, manage production and late deliveries
- Monitor invoices, cash and machine condition

### v0.2 preview playtest (iPhone or iPad)

1. Open the Pages URL in Safari; look for the heading **Factory Floor Preview v0.2.4**.
2. Select the CNC and tap **Inspect machine** to view the unbranded VMC sprite.
3. Tap the starter VMC, then choose **Move selected**.
4. Tap a free 2 × 2-tile area. The machine should move and **cash should not change**.
5. Refresh the page and confirm that the VMC stays in its new position.
6. Accept an RFQ and advance a day; existing gameplay must still work.
7. Check Equipment: **Fiber Laser 3015 RM150,000**. A laser needs **3 × 2 floor tiles**.
8. Tap **⚡ Preview laser** at the factory floor to see the artwork without buying the machine. If you already own one, select it and tap **Inspect machine** to see its remaining operating days.
9. Send a screenshot and report anything that looks wrong. New players start with RM92,000 cash, so they cannot buy a laser until they earn more in-game money.

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
