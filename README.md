# Factory Empire 🏭

An original, mobile-friendly factory management simulation game built independently.

## Official game direction — mobile-first management (2026-10-18)

**Factory Empire is a manufacturing tycoon/management prototype, not an RPG.** We are prioritizing fun, repeatable decisions and a low-cost market test; no third-person walkabout or open-world city in the current roadmap.

- [Updated official game vision](docs/GAME_VISION.md)
- [Revised development roadmap](docs/DEVELOPMENT_ROADMAP.md)
- [v0.4 capability, cost, staffing and hot-job design specification](docs/V04_JOBBING_SPEC.md)
- [Official five-stage company progression and financing plan](docs/LONG_TERM_PROGRESSION.md)
- [Manager Hero Cards — rarity, buffs, debuffs, staff-inspired character design](docs/HERO_MANAGERS.md)

**Release status:** **v0.4.8 alpha is now the playable browser build.** It implements the first CNC jobbing/limited-starter-room slice; the remaining v0.4 systems (worker morale, weekend overtime, customer account network, wirecut, rent/power billing, tapping, polishing, QA and financing) are still planned.

**Future growth campaign (not yet playable):** 1) start with one CNC in a room capped at **2 CNCs**, 2) grow into a **4–5-CNC shoplot** and hire a Production Planner and Process Engineer, with the **first earned eligibility for bank loans**, 3) build a **16-CNC semi-D industrial lot**, unlocking sheet metal, QA Inspectors/QA Engineers and managers, 4) move to a full factory with double-column CNCs and optional in-house painting/treatment, and 5) rent or acquire more factories to become an industrial tycoon. The bank does **not** auto-approve beginners; criteria require demonstrated turnover and ability to repay. Detailed amounts need balancing.

**New v0.4 capacity rule:** One operator can tend **2–3 CNCs** in one shift, but all new part changes need setup: **easy 0.35h (21 min), medium 1.5h (90 min), difficult 3h (180 min)**. Setup time uses that worker's finite attendance hours and cannot overlap on two machines. Two shifts covering one 2–3-CNC cell need **two separate workers total**, not two workers *per machine*. A high-paying hot job may displace existing machine setups; **switching A → B → A requires the full Part A setup again**, and the sole minion being busy with any setup reduces output on other CNCs by delaying their load/unload/attendance tasks. Autonomous cutting already underway can finish, but machine cycles cannot restart without operator attention. In-app purchases remain optional future ideas; paid rescue is not required to enjoy the prototype.

**Confirmed v0.4 rule:** urgent/hot customer jobs allow **4 calendar days** (weekends included) while procurement, programming, and outsourced wirecut still take working days. This is a specification change only; the playable game is unchanged.

**Additional confirmed v0.4 rules:** Weekend overtime is optional and costs **2× ordinary wages per worker**, with **resignation after three consecutive worked overtime weekends**, not merely refusal. Each new employee starts with **40% skill**, learning through jobs toward **80% mastery in about two months**. Defective parts carry material/rework costs; customer-escaped defects can bring claim costs and relationship loss (amounts to balance). Each customer begins at **40% individual relationship**: on-time shipments improve the account, late shipments trigger penalties and worsen its future price/volume offers. A new customer-logo relationship network is planned, not implemented.

## Play

When GitHub Pages is enabled from `main` → `/(root)`, open:

**https://lohzhi27-gif.github.io/factory-empire/**

The website uses the repository's `index.html`. It currently runs in Safari and other browsers; it is **not** yet a native Android/iOS app.

## v0.4.8 ALPHA — Two CNCs, tapping station, starter programmer desk (2026-10-19)

**Playtest findings / owner design decisions implemented:**
- **Assign the same customer PO to both CNCs:** Open Production & Schedule → **Details ↗** on any accepted CNC order. Tap **+ Assign CNC #1 / #2** independently. A single Ironman can attend both machines but cannot do overlapping setups/reloads. Each CNC keeps its own setup and material consumption, while *completed / ordered pieces* is combined once at the PO level. No duplicate finished pieces allowed when two spindles are cutting the final few pieces.
- **Per-machine good-piece counters:** Each PO lists good output attributable to CNC #1 and #2 **since this release**; the Equipment cards also show contribution to the assigned/current PO. Pre-existing good-piece totals remain included in the PO progress but are not falsely assigned retroactively to a specific CNC. Two CNCs can therefore improve OTD instead of silently locking one machine out.
- **Starter tapping station:** Available to **buy in Equipment during Stage 1** for **RM4,500 in-game** (provisional balance). This is auxiliary support equipment, **not one of the two allowed CNCs**. A new fictional **Threaded CNC Bracket** RFQ requiring tapping appears sometimes. The order **cannot be accepted until the tapping station is owned**.
- **Real second operation:** A successfully milled threaded bracket becomes `cncDone` (machined quantity); only after the tapping station does it count toward `done` / shipment. Tapping processes up to 210 station-minutes/day without a *dedicated assigned minion* while the factory has fewer than six CNCs; test timings: **30 minutes setup per tapped PO + 2 minutes per piece**. At **six or more CNCs**, require a dedicated tapping minion (RM800 hiring fee + RM160/working day) and allow a full 420-minute station shift. These times and costs are **not yet owner-approved balancing constants**.
- **Programmer desk in the Stage 1 factory:** Included for free as one visible programmer desk and one owner/operator programmer. **One programmer can advance only one two-working-day job program per working day**. Jobs queued behind a busy programmer retain their original progress. For later expansion at **4+ CNCs**, another programmer + desk can be added for **RM2,000 game money** and **RM180 per staffed working day**. A second programmer cannot be hired in the current capped two-CNC room; shoplot Stage 2 development remains future work. The small desk is depicted on the workshop wall.
- **Red-edged HOT JOBS:** Strong red/orange borders around urgent offers, accepted urgent PO cards and urgent rows in the combined Production sheet, without changing the previously approved four-*calendar*-day deadline.
- **Gantt estimate revised** to show up to three CNC machine lanes per minion instead of assuming one minion per CNC. This is **still only an approximation**, not a true operator-loading, tapping, skill or programmer-queue-aware delivery prediction.
- **Save safety:** `factory_empire_proto_v1` remains the only save key; purchased CNCs, old orders, partial setups, financial balances and material stocks are not reset. Machine-specific output attribution starts at v0.4.8, so historical units remain in the combined total.

**Test mission:** Assign a sufficiently large bracket PO to **two CNCs** and use +1 Hour / +1 Day. Expect **both machines to cut and contribute pieces**, more combined throughput than one CNC, and no overproduction at the job's final quantity. Buy the tapping station, receive a fictional threaded-bracket RFQ, complete programming and CNC milling, and verify tapped parts only ship after the station has processed them. Look for the programmer desk near the workshop wall and the red HOT order edges.

## v0.4.7 ALPHA — Production & Schedule one-sheet view (2026-10-19)

**Owner UX request:** stop forcing players to toggle between a workshop Production view and a completely separate Gantt workspace. The Production tab now contains a **compact searchable sheet** that combines accepted jobs, process state, material usage, customer due dates and the next **seven calendar days** of the EXISTING Gantt forecast.

- **One main workshop screen**; previous "Production View / Gantt View" switcher and separate schedule nav entry are removed. The factory floor, Customers, Equipment and Finance remain available. The main Production tab is renamed **Production & Schedule**.
- One row per accepted PO: **job number, part, customer, completed/total pieces, material kilograms already consumed / still needed, current operation, due day, estimated finish day, and a 7-day mini Gantt strip.** HOT POs are identified. Material numbers include scrap and in-progress machining, based on the v0.4.6 accounting.
- Single-table **search** by job/part/customer and filters for all jobs, HOT JOB only, at-risk, or assigned/on a machine. A **full-screen Expand sheet** control improves readability on laptops and smaller displays, without adding a second workspace.
- Tap **Details** from any row to reveal the same individual PO cards, original machine-linked Job Radar, and HOT JOB dispatch. Existing Equipment → "Show highlighted job" automatically opens these details.
- An optional expandable **Detailed Gantt & incoming material POs** section contains the **same original functional Gantt** and range selector (now 14 days by default). Its source forecast still assumes simplified machine lanes and does **not** model accurate setup or shared-Ironman delays. The compact timeline is a visual extract of that same forecast, not a second invented ETA algorithm.
- Existing RFQ acceptance, machine selection, payables/receivables, day/hour advancement, physical CNC simulation and save key remain untouched. No factory reset.

### Quick v0.4.7 UI check
1. Refresh until the heading says **PRODUCTION SHEET v0.4.7 ALPHA**.
2. Open **Production & Schedule**. See a single horizontal-scrolling table with 7-day strips and YPS/customer names; no separate Gantt workspace buttons.
3. Click a PO's **Details ↗**. Its full material usage, Job Radar and HOT dispatch remain usable.
4. Open **Detailed Gantt & incoming material POs** only when you need a larger planning view; test 14/28-day controls.
5. Use **Expand sheet** and Esc to return to the standard workshop.
6. Advance +1 Hour and verify the PO quantities, material consumed and timeline update without changing cash merely from expanding/collapsing.

## v0.4.6 ALPHA — PO material consumption and YPS Technologies founding customer (2026-10-19)

- Accepted production orders now show a **material-usage panel**: per-piece kg, original baseline kg, **kg consumed including good pieces + scrap + active spindle cycle**, minimum additional kg to finish, shared raw-stock available, and shortages **across all current orders for the same material**. This is a planning aid, not per-PO stock reservation. Materials were already physically deducted by the existing CNC simulation; this panel **does not double-deduct** them.
- **YPS Technologies** is honored as a **Founding Customer** in the humble starter workshop. New games start with one original YPS-labeled **fictional** aluminum bracket RFQ; the business can also appear occasionally in later sample RFQs. Older saves receive one introductory offer when a normal quote slot is free; accepted jobs and prior customer records are never overwritten.
- The client name honors the owner's story. Game part details, volumes, prices, dates and quotations are **imagined gameplay examples**, **not genuine YPS purchase orders**; no logos, confidential data or real drawings are used.
- The original local save key, ongoing material consumption, previously accepted orders and customer history remain intact.

## v0.4.5 ALPHA — Optional HOT JOB customer orders (2026-10-19)

**This is playable code, not only roadmap text.** Customer HOT JOBs occasionally appear in a separate amber-highlighted offer above the normal CNC RFQ list. A visible **🔥 HOT** marker appears on the Customers navigation. They **do not consume a normal quotation slot**.

- A HOT JOB offers a premium price and **four calendar days after PO acceptance** to deliver. For the initial balancing test, **the countdown begins upon accepting the PO**, not when the RFQ appears; this exact starting event is a **provisional choice awaiting the owner's final approval**. Saturdays/Sundays reduce delivery time even though regular production and programming are working-day activities.
- The first opportunity is scheduled from **Day 8**, once the workshop has had time to develop. Initial test offers arrive **occasionally on Monday or Tuesday** after roughly 8–12 calendar days of cooldown (actual opportunity may be later when weekday conditions are met). This is **tentative balancing**, not an owner-approved frequency.
- Offers are **optional** with a Decline action that costs nothing. They expire after a short offer period. Showing an offer never automatically accepts or changes a prepared machine.
- Existing CNC templates only: bracket/block. **Sheet metal stays completely locked** before semi-D Stage 3, consistent with v0.4.4.
- The offer shows urgent sales value, price premium (initial test **50–80%** per-unit increase), stock needed/on-hand, setup time, earliest machining day, possible at-risk prepared CNCs and four-calendar-day due date if accepted now. Batches are deliberately small so some orders can be completed without IAP.
- **Award gate:** current stock must cover the batch, one working CNC and minion must exist, active orders must be below five, and two working days of programming must leave a machining day before the customer deadline. Impossible offers are blocked rather than granting instantly produced material/programs.
- **Normal routing and penalties remain**: acceptance goes through the existing PO/2-workday programming/physical production system. The existing late-delivery invoice discount/reputation consequences apply at day close—no extra hot-job penalty is double-charged.
- To interrupt an earlier customer order, the player explicitly chooses a CNC from the urgent Production card and taps **Prioritize HOT JOB**. **If programming isn't ready, the CNC keeps running existing eligible work instead of sitting idle; the priority takes effect once the urgent program is released.** In-progress automatic cuts finish naturally, so the precise setup-start hour may be slightly later than the time the player clicks. Changing A → B → A requires **full re-setup**, and the same shared-minion attention bottleneck slows the other CNCs. Other jobs remain saved.
- HOT orders have distinctive 🔥 labels in Production and on the main Gantt. **Gantt remains an approximate forecast** and does not yet incorporate detailed setup/operator delays, which can make actual completion later than its ETA.
- Existing `localStorage` key `factory_empire_proto_v1` is unchanged. New state fields: `hotOffer`, `hotHistory`, `nextHotOfferDay`, `hotJobsVersion`; previously owned laser machines, orders, cash and state carry forward. **No payments/IAP**.

### HOT JOB laptop playtest

1. Open the game without Restart; the header should show **HOT JOBS v0.4.5 ALPHA**. Use +7 Days to approach Day 8, ideally after accepting and setting up a CNC job. An older saved factory begins with an upcoming eligible day rather than receiving a forced instant order.
2. On an eligible Monday/Tuesday, look for the **🔥 HOT** Customers tab indicator and separate urgent offer. Verify **four CALENDAR days**, higher unit price and material/setup risk.
3. **Decline** one offer without losing money, or accept a future offer with sufficient aluminum and order space. If the offer is impossible due to stock, staff or timing, the game should explain why.
4. In Production tap **Prioritize HOT JOB** on the chosen CNC. Inspect Equipment each hour to see the setup/changeover and slower production on shared staffed cells.
5. Let the deadline cross a weekend; check due date does not move forward to the next working day. If late, the normal invoice penalty applies, without a separate surprise HOT fee.
6. Reload mid-offer or mid-job; confirm the pending offer or accepted order, due date, machine setup and cash persist.

**Still planned:** weekend overtime, individual staff skill/morale, per-customer relationship penalties and terms, monthly rent/power overhaul, tapping/polishing/wirecut mechanics and more accurate hourly Gantt forecasting. These do not ship as part of this slice.

## v0.4.4 ALPHA — Corrected early-stage RFQ visibility (2026-10-19)

**Follow-up bug fix after screenshot:** the Sheet Metal Cabinet Panel was still visible in a tester's saved early-stage RFQs, despite its button being locked. The restriction has been moved into the **main application state initialization** and **base RFQ renderer**, rather than relying on a late-loaded UI patch alone.

- Any unaccepted LASER/sheet-metal RFQ from an existing local save is archived once as `state.deferredSheetMetalRfqs` and immediately removed from `state.rfqs` before the initial RFQ list displays. Quote counter and prospecting capacity count CNC jobs only.
- The base `addRfq` generator is now CNC-only as well. The already-existing jobbing prospecting override also produces CNC jobs only.
- The base `renderRfq` independently rechecks the active RFQs every render, preventing previously cached or accidentally inserted locked offers from displaying.
- **No factory reset required**; cash, active accepted jobs, existing purchased lasers, machine setups and worker assignments are not changed.
- Quotation panel explicitly says **Incoming CNC quotations**. After a fresh reload the header should say **CNC RFQs v0.4.4 ALPHA**.
- If a browser still shows the older page, use Ctrl+Shift+R or open the game with `?v=044` to bypass an older cached HTML page. GitHub Pages deployment may take a short time.

**Regression tests:** simulated first-load migration of a legacy save with both CNC and LASER quotations; no laser cards or wrong RFQ count; new-game seed; fresh quote generator; repeated reload idempotency; accepted laser jobs and owned machines preserved.

## v0.4.3 ALPHA — CNC-only RFQ board before Stage 3 (2026-10-19)

- Removed premature laser/sheet-metal quotations from the early-game customer RFQ list. New games seed **CNC machining RFQs only**.
- Existing unaccepted laser-cutting RFQs in older saves are **deferred and removed from the active quotation list**; they no longer count toward the five-quotation prospecting cap. Original records are saved in `state.deferredSheetMetalRfqs` for historical safety, but are **not automatically returned as stale offers** when Stage 3 becomes available.
- Existing accepted laser orders, player-owned laser machines, cash, materials and production progress remain unchanged.
- Future sheet-metal and laser RFQs stay locked until **Stage 3: semi-D industrial lot**, as the progression spec requires. Stage 3 itself is not yet implemented.
- No change to +1 Hour, Job Radar, setup timing, or existing save key (`factory_empire_proto_v1`).

**Test:** Refresh the game without restarting; New RFQs should contain only CNC jobs and show the correct count. Click Find another RFQ—new offers should also be CNC. Existing jobs and machine placements should stay intact.

## v0.4.2 ALPHA — Live Job Radar and CNC operation progress (2026-10-19)

**Playable interface enhancement:** Based on the first Ironman laptop playtest, Equipment now provides **per-machine progress bars** and Production shows **glowing highlighted edges** on the matching customer order(s). The underlying CNC setup and worker simulation remains unchanged from v0.4.1.

- **Machine operation progress** in Equipment: setup percent and remaining minutes (Easy 21m / Medium 90m / Difficult 180m); current piece machining percent and minutes remaining; loading progress; meaningful "Setup ready" / "assigned" / "idle" statuses. Progress bars have text labels for accessibility, not color alone.
- **Linked live order highlights**: cyan cutting, green loading, amber setup or waiting on a minion, green setup ready, subdued assigned. Show **job ID plus machine ID** on each affected production card; when multiple CNCs work on one order, display multiple machine status chips.
- **Show highlighted job** button on a machine card takes the player straight to that exact PO in Production, expanding the user workflow beyond simple part names.
- **Job Radar** in Production: All orders / On machines filter and persistent search by job ID, customer or part. A visible count shows currently active jobs. Controls stay in place when +1 Hour rerenders the order list, so mobile typing is not disrupted.
- **Machine job dispatch selectors** now show **#job ID · part · customer · due day** to distinguish several customer orders for the same part.
- **No production or save migration changes** in this patch; the same localStorage key and v0.4.1 hourly behavior remain intact.
- **Scaling note:** the UI is designed to navigate dozens of eventual CNC orders, but **the existing prototype still limits active accepted production orders to five**. Expanding the simultaneous-order cap will be a separate capacity/planning balancing update, not part of this visual slice.

### Quick test
1. Reload the game after GitHub Pages updates; continue your current factory, no Restart.
2. Once programming is ready, tap **+1 Hour** and open **Equipment**. Watch the CNC's setup progress bar move as the Ironman works.
3. Open **Production** and find the PO with the matching cyan/amber/green highlighted border and matching CNC # / job # status.
4. In Equipment, tap **Show highlighted job** to jump directly to that card. Check the Job Radar filter and customer/part search.
5. Try two different customer jobs for the same part; verify machine dispatch names include job # and customer. Return to All orders to reveal any hidden cards.
6. Confirm cash, machine placements, active orders, routing phases and production progress are unchanged by toggling filters.

## v0.4.1 ALPHA — +1 Hour factory simulation (2026-10-19)

**Live controls:** **+1 Hour**, **+1 Day**, **+7 Days** and auto-days. A **simulation clock** is shown in the workshop heading and top navigation, starting at **Day 1 / Monday / 08:00** for new saves. One standard in-game shift is **7 hours (420 minutes)**, two shifts are **14 hours**, and the clock resets to **08:00** on the next day after the final hour.

- **+1 Hour processes precisely 60 simulated production minutes** through the same CNC setup, operator attendance, loading/unloading and cutting logic as full-day simulation. Example: a difficult (180-minute) setup shows 120 minutes remaining after one hour, 60 after two hours and ready after three hours.
- **+1 Day finishes only the remaining hours of the current day**. Advancing +1 Hour first and then +1 Day does not run an extra 7 hours of production.
- **Day close**: wages, electricity, overhead, machine wear, invoices/shipments and automatic RFQs are handled once. Procurement arrivals and 2-working-day programming move forward once on entering the next game day. Weekend hours show **WEEKEND CLOSED** and do not machine (overtime will be implemented separately).
- **Save migration**: uses original `factory_empire_proto_v1` key, introduces `hourIndex` 0–6/13 and `hourSchemaVersion=41`; keeps cash, equipment, machine setup progress, partial cuts, orders and placements. Reloading mid-shift preserves progress.
- The game now shows **pieces made so far** in the current day and current setup/wait-for-operator statistics.

**Remaining limitations:** The v0.4 alpha Gantt remains read-only and does not yet forecast detailed hourly setup/operator delays. The 2-minute load/unload attention per cycle is a provisional balancing assumption. Monthly overhead, staff morale/fatigue and weekend overtime are not yet live. The hourly clock uses fixed 7-hour operating windows, skipping over nights automatically; it's not a 24-hour simulation.

### Quick test

1. Refresh until the header says **HOURLY v0.4.1 ALPHA**. Locate the **+1 Hour** control beside +1 Day.
2. Accept a Machined Block RFQ, then use +1 Day to let materials/programming become ready. (Programming still requires two working days.)
3. When the block's **3-hour setup** starts, tap +1 Hour three times and inspect Equipment: **180 → 120 → 60 → ready**.
4. With two CNCs and one minion, verify that waiting for operator time is visible when one machine has a long setup.
5. Tap +1 Hour once, then +1 Day: the next day should start at 08:00 with wages/day close charged only once.
6. Reload during a setup and verify that remaining setup minutes and displayed clock persist.
7. Try +7 Days / auto-days and the two-shift 14-hour clock.

## v0.4.0 ALPHA — First jobbing + minion-attendance production slice (2026-10-19)

**Playable change, not merely a design document.** The live browser loads `jobbing-v040.js` after v0.3.4 and uses it instead of the old one-worker-per-machine machining loop. Same saved localStorage key (`factory_empire_proto_v1`), same Production/Gantt navigation, inventory purchasing and two-working-day programming. No real transactions/IAP.

- **One minion can tend up to three CNCs per shift**, subject to real attention limits. The machine can't be unloaded/reloaded while its minion is occupied on a different setup; already-running automatic cutting cycles can finish. Extra minions distribute machine attendance load.
- **One setup per machine / part change**: easy 0.35h/21m (AL Bracket), medium 1.5h/90m (existing sheet-metal panel), difficult 3h/180m (Machined Block and Enclosure Panel). Product difficulty mapping is provisional gameplay balancing; exact time categories are owner-confirmed.
- **Changeover A → B → A** incurs the *full* new setup of A again. Same-part repeat production on an unchanged setup doesn't pay twice.
- Equipment → machine cards now display **setup/cutting status**, last-workday minutes waiting for minion and a **Machine job priority** selector (Auto / assign a specific available customer order). Manual assignment lets the player deliberately prioritize a hot job when that feature launches; new orders still wait for procurement/programming as required.
- **Starter room cap 2 new machine purchases**, not all old map slots. New laser purchases and *new* sheet-metal RFQ awards are locked until Stage 3; earlier saved owned lasers and active orders are **not deleted**.
- A second shift must have **two distinct minions**; the Hire button permits recruiting the second employee even with a single machine. If an older save had two shifts with one worker, migration resets it to one shift and logs the reason. Simplified pay is now RM160 per worker per workday; the full monthly rent/electricity and weekend overtime models aren't in this slice.
- A per-day production summary shows how many operator minutes were spent setting up and how many machine-minutes were lost waiting for attention.

**Known limitations:** The existing Gantt is **still a rough projection** and *does not yet account for setup/attendance bottlenecks*. A visible notice warns players; the new production engine is authoritative. No weekend overtime, 40%-skill training, quit-after-3-weekends, defective-part commercial claims, customer relationship scores, 4-day hot-job generator, tapping/polishing capability, bank loans or Stage 2 move is playable yet. Existing basic random machine scrap logic remains. Real factory machines can have more nuanced unattended cycling and operator requirements than this first 2-minute-per-part loading approximation.

### Quick laptop / phone verification

1. Load the game with a fresh refresh; look for **JOBBING v0.4 ALPHA** in the header. Normal refresh preserves saves.
2. Accept an **AL Bracket** CNC RFQ. Buy material only if stock is short; advance working days past its two-day programming requirement.
3. Open **Equipment**: machine #1 should show **Setting AL Bracket** then **Setup ready**. Easy setup uses 21 operator minutes, not a full extra calendar day.
4. Try a Machined Block order, assign it to CNC #1 via **Machine job priority**. It takes a 180-minute difficult setup. Reassign Bracket and confirm another 21-minute setup is required.
5. If you own two CNCs, accept both part types and compare a one-minion day against a two-minion day: machine attendance waiting should shrink with extra staff.
6. Click the new laser placement or a sheet-metal RFQ: both should indicate **Stage 3 locked** (but old owned lasers should remain).
7. Open **2 · Gantt Chart View** and look for the forecast disclaimer; the board should not falsely claim to be accurate to the minute.
8. Reload and confirm existing cash, machinery positions, orders, materials and machine setups persist.

This is the **first v0.4 alpha iteration**. Treat any screenshots or timing surprises as valuable playtest feedback.

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
