# Factory Empire — v0.4 Jobbing, Capabilities & Cash Flow Specification

**Decision date:** 2026-10-18
**Status:** Owner design inputs captured; implementation NOT started. The approved playable release remains v0.3.4.
**Product strategy:** Mobile-first, free-to-download factory-management prototype for market validation. NO RPG/character walking or open-world city in this phase.

## Owner-confirmed gameplay rules

### 1. Sheet-metal production is locked early in the game
- New players start with a humble CNC machining workshop. Do **not** offer full sheet-metal production or unrestricted laser-based sheet-metal jobs immediately.
- Sheet metal is a later advancement milestone; its exact unlock requirements still need agreement.
- **Legacy-save compatibility:** Earlier builds already allow a laser cutter for RM150,000 in-game. Do not delete a machine a player already purchased. Instead gate **new** access / sheet-metal RFQs for new players once the unlock system is implemented.

### 1.1 Tapping equipment is a hard job-award prerequisite
- An RFQ with a mandatory tapping operation must explicitly warn the player if they do not own tapping capability.
- In that case the player **cannot accept / be awarded the job**. Display a useful message explaining which equipment they need.
- Jobs without tapping are not restricted by this rule.
- This is NOT simply a production slowdown: fail the capability check before award.

### 1.2 Polishing employees ("minions")
- A job requiring polishing needs available polishing staff and labour capacity.
- Hire dedicated polishing staff as a separate factory capability. The player must plan their workloads and payroll.
- If no polishing staff exists, flag it at quotation/award stage and don't pretend the job can be completed.
- Precise headcount, wages, throughput and whether some jobs can outsource polishing remain OPEN.

### 1.3 Outsource wirecut
- Player can subcontract wirecut jobs to an external provider instead of owning wirecut/EDM equipment.
- **Normal subcontract lead time: 2 working days.**
- The service is a low-cost option. The exact game price, pricing basis and eligibility depend on owner balancing.
- Process is not instant. Display wirecut process lead time on the job and Gantt; block shipment until outsourced work returns.
- This is a separate subcontract service from surface treatment, which uses existing owner-defined normal/rush lead times.

### 1.4 Staffing for two shifts
- **One staffed machine in two shifts requires two different workers (one worker per shift)**, not one worker operating twice as long.
- Enabling two shifts without enough workers must not double output. Show a "Hire second operator" warning.
- Wage expense reflects the extra worker(s); exact shift premiums are to be determined.
- For N concurrently running machines in two shifts, the simple initial staffing baseline is up to 2 × N operators, subject to assignment/idle machine logic.

### 1.5 Workshop rent
- Starter workshop rent: **RM800 per month** (monthly basis inferred from "rental" and should be owner-confirmed if necessary).
- Rent increases **10% every 2 years**, **compounded**, for the same workshop.
- Illustrative monthly schedule: years 1–2 RM800; years 3–4 RM880; years 5–6 RM968; years 7–8 RM1,064.80.
- Deduct in-game rent from cash on monthly billing days; show next payment and current rental rate.
- One consistent game calendar must be chosen. Provisional billing implementation can be each 30 game days with 24 such months per increase. This is a balancing assumption, not yet owner-approved.

### 1.6 Monthly electricity bill
- Each active/owned CNC (confirm whether idle machines are charged a standing charge later):
  - **1 shift: RM900/month/CNC**
  - **2 shifts: RM1,500/month/CNC**
- Show expected next bill and charge monthly; do not keep current legacy per-day electricity charge **as well**, or the player gets charged twice.
- Only CNC electricity rates were supplied. Laser cutter, tapping machine and auxiliary-equipment power costs are TBD.
- Monthly workshop fixed overhead initially = RM800 rent + RM900 electricity = RM1,700/month for one CNC at one shift, before wages, materials and other expenses.
- With that same CNC running two shifts: RM800 + RM1,500 = RM2,300/month before wages, materials and other expenses.

### 2. Occasional hot jobs (urgent RFQs)
- Special, occasional **hot jobs with a strict four-calendar-day customer lead time** offer attractive revenue. **All seven days of the week count toward the customer deadline, including Saturday and Sunday.**
- Players may decide to keep a **buffer percentage of raw material** in stock and deliberately leave **some machine capacity uncommitted** to capture these.
- Rewards come from business judgment: an expensive rush quotation is useful only when the player has adequate material and capacity.
- Check the same prerequisites and genuine routing time (tapping, staff, programming, subcontract wirecut, etc.). Warn or decline if impossible; never magically compress a real multi-day process.
- **Owner-confirmed deadline rule:** four **calendar** days (not working days). For initial implementation, propose calculating dueGameDay = orderAwardGameDay + 4 elapsed game days (e.g., awarded on Day 1 → due Day 5), subject to confirming whether the start is RFQ issue or award/PO acceptance. Weekend days consume the customer's lead-time window.
- Proposed (not confirmed) knobs for initial balance testing: 10–20% stock buffer of common materials, 10–15% available machine capacity reserved for urgent work, hot-job price premium negotiated according to urgency/profitability.
- Suggested gameplay trigger: low-frequency, optional event, with visibly higher margin, a clear due-date countdown and potential reputation damage for missing delivery. No forced microtransaction.

### 3. Weekend overtime, fatigue and the first worker

**Owner-confirmed design inputs:**
- Saturday and Sunday are normally non-production days. The player can **offer overtime** to run machines on either/both days when a four-calendar-day hot job or late customer order warrants it.
- **Weekend overtime wages are double the ordinary day rate** for each worker who accepts the requested Saturday or Sunday shift. This is a wage multiplier, not a 2× production speed multiplier.
- The first (and eventually all) workers are people, not tireless automatic production units: **four consecutive weeks of weekend overtime is too much. A worker must refuse further weekend overtime until rested.**
- Track overtime/rest **per worker**, not just at workshop level. A second operator does not bypass the first employee's fatigue.
- Two-shift staffing rules also apply on weekends: two separate available consenting workers are needed for a machine to run two staffed weekend shifts.
- Weekend production must be explicitly authorized, staffed, costed and shown on the Gantt. Do not quietly enable weekend work every time a deadline is near. A customer deadline still counts all calendar days regardless of whether workers accept overtime.
- Worker unhappiness/fatigue should be visible before authorizing weekend overtime, with a warning that repeated weekends may make urgent promises impossible.

**Implementation interpretation to confirm:** Treat "four weeks straight" as four consecutive *weekends with accepted overtime*, and decline the next weekend until at least one full weekend off. Confirm whether the worker instead refuses the fourth weekend, and whether a single Saturday OR Sunday counts as an overtime weekend. Do not silently fix a numeric morale penalty, recovery time, resignation probability or weekday overtime multiplier.

**Proposed UI:** operator list with morale/fatigue warning ("Third consecutive weekend worked; next weekend may be refused"), weekend staffing requests, overtime payroll estimate and highlighted weekend capacity in Gantt.

### 4. Individual customer relationships & account network

**Owner-confirmed design inputs:**
- **Every new customer relationship starts at exactly 40%**, tracked **per customer**, separate from the existing factory-wide reputation metric.
- **On-time delivery increases that customer's happiness/relationship score.** Late delivery **reduces customer relationship** and triggers a **late-delivery penalty**.
- A **mad/unhappy customer** offers **low-volume jobs at cheap selling prices** (weaker commercial terms). The player must either accept these poor offers to rebuild the relationship or deliberately seek other customers.
- A **green/happy customer** offers **better selling prices and growing order quantities**. Good service should translate into tangible repeat-business rewards, not just cosmetic points.
- Customer score visibly changes between a **bad/red state and happy/green state**, with appropriate neutral/intermediate signals. Show numerical percentage and explain why it changed.
- Use a **visual customer-account relationship graph** inspired by the owner's reference image: each account is a round customer-logo icon with a colored relationship ring, and connections indicate business relationship/referrals if that system is added later.
- Icons should be **original fictional customer logos or licensed artwork**, not copied proprietary logos. Use unique icons and accessibility labels; don't rely solely on red/green color.
- Give the customer relationship system its own main-page view, analogous to **Production View / Gantt Chart View** (placement and final navigation design to be tested), instead of squeezing a graph into the narrow orders sidebar.

**Proposed UI mock flow (not built):**
- Factory dashboard → **Customer Network** → select an account's icon → inspect score (starting 40%), delivery history, offer quality, order-volume trend and active quote opportunities.
- A successful on-time shipment makes the customer's relationship ring greener and improves future opportunities.
- A missed delivery makes the ring redder; show exactly why terms worsened and display any agreed monetary delivery penalty.
- Network should work on phones: large tap targets, simple pan/zoom or scrolling and list-mode accessibility fallback.

**Economy integration and cautions:**
- The current prototype already has a global `state.reputation` and a simplified late-invoice deduction. The per-customer relationship score is an **additional distinct data field**, not a replacement for factory reputation. Make scoring and cash penalties clear and avoid applying the same fee twice.
- Per-customer values should be persisted under stable fictional account IDs; migrate earlier local saves to initialize existing customers to **40% without deleting orders, outstanding invoices or cash**.
- Apply price/volume effects to **new offers**, not existing signed POs or previously committed invoice prices.
- Don't make poor relationships permanently unwinnable; preserve a feasible recovery path through reliable small orders.
- Make stock, capability gates and available machine hours apply even when a customer turns green and raises volume.

**Balancing decisions still pending (proposals only, not confirmed rules):**
- Relationship score increments on on-time shipment, decrements on late shipment, caps and tiers.
- Whether the late-delivery penalty is a fixed charge, per-day percentage discount, or both; how it relates to the existing simplified late-invoice penalty and global reputation decline.
- Price/volume multipliers associated with red/neutral/green status.
- Whether referrers/suppliers/dealers become nodes in the graph or customer nodes only.
- Relationship recovery mechanism other than delivery success, e.g. honest updates or choosing a low-margin recovery job.

## Proposed v0.4 implementation order (not yet committed to gameplay)
1. **Capability and award checks:** tapping RFQ blocked without tapping station; polishing staff gating; visually clear missing-resource notices and required process routing.
2. **Real staffing, overtime and cash-out:** 2 shifts need 2 people per simultaneously staffed machine; optional Saturday/Sunday overtime costs 2× ordinary wages per consenting worker, with fatigue and refusal after four consecutive overtime weekends (precise boundary TBD); monthly rental escalator and per-CNC electricity invoices; remove legacy utility double charges.
3. **Wirecut subcontract:** pay process fee, wait 2 working days, show it in Gantt, and prevent premature delivery.
4. **Hot-job events:** occasional, strict **4-calendar-day** customer deadline, optional material-stock buffer and free-capacity strategy; feasibility first, lucrative but risky margin.
5. **Customer relationship network and late-delivery consequences:** per-customer relationship starting at 40%; colored fictional customer-logo graph, on-time rewards, late-delivery relationship and cash penalties, price/volume changes on future RFQs. **Then mobile playtesting** of meaningful trade-offs; keep sheet metal locked until appropriate progression.

## Later unlocks
- v0.5: deeper process costing, polishing work-in-process, QA/surface finishing/packing.
- v0.6+: sheet-metal and laser-cutting production **after clear milestones**, plus more advanced customers and factory expansion.
- These version boundaries are planning proposals, not tested release commitments.

## Required follow-up decisions
- **Confirmed:** hot jobs use **4 calendar days** for the customer deadline (not a remaining open question). **To confirm for implementation:** whether the 4-day clock starts when the RFQ is offered or when the customer PO is awarded/accepted.
- Tapping station game purchase price, operation speed/capacity and whether it requires its own operator.
- Polishing worker daily wage, output rate and number of staff.
- Wirecut subcontract price (per job, per piece, per cutting time).
- Is rent RM800/month and does power scale with machines owned or machines operated?
- Exact sheet-metal unlock conditions (e.g., CNC jobs delivered, company reputation and investment milestones). These are not to be invented during implementation.
- Confirm a single time/calendar standard for rent escalation, holiday skips, monthly electricity and 365-operating-day machine service.
- Confirm whether the **fourth** overtime weekend is refused or refusal starts with the **fifth**, and whether Saturday or Sunday alone counts toward consecutive weekends.
- Decide per-customer on-time/late point changes and low/high relationship offer tiers; determine late-delivery cash-penalty calculation without duplicate penalties.

## Critical compatibility note
The v0.3.4 code currently charges daily overhead/utilities, permits two shifts with insufficient staffing, has no weekend overtime or worker-fatigue consent system, uses only aggregate reputation rather than per-customer 40% scores, and exposes a laser purchase. These are **known differences** between existing prototype behavior and the new owner-approved *design*; this document alone does not change gameplay. They must be deliberately replaced in a versioned update with save migration tests.

## Definition of done for the first playable slice
- New tap-required RFQ can't be accepted without the tap machine, with explicit explanation.
- Once purchased, that specific RFQ can be accepted if all other capability checks pass.
- No 2-shift production uplift without a second operator on that machine.
- Rent/power expenses appear monthly at the defined rate and are not double-charged.
- Wirecut appears as a timed outsourced process in the Gantt before shipment.
- Hot jobs check material and free machine hours before award; use a 4-calendar-day countdown, while procurement, programming, and wirecut normally advance in working days. Weekend production must explicitly request and pay consenting operators 2× wages; fatigue can prevent weekend staffing.
- Existing and new customers initialize individual relationship scores to 40%; on-time fulfillment improves the correct account, late fulfillment hurts it and applies the agreed penalty. Subsequent RFQs vary in price and quantity accordingly.
- Customer account network uses original logo/icon nodes and visually shows relationship state without copying a proprietary game's interface.
- Old local saves, machines, customer orders and cash balances survive upgrading.
