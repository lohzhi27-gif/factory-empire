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

### 3. Employee wellbeing, weekend overtime and attrition

**Owner-confirmed rules (replaces the earlier four-week refusal idea):**
- Ordinary production operates weekdays. Weekend overtime is **optional**, only when the player authorizes it and the worker agrees.
- **Saturday overtime and Sunday overtime wages = 2× ordinary wage per employee for each day worked**, not a 2× machining speed bonus.
- The workshop starts with **one original employee**; each employee has a visible **happiness / fatigue meter**, tracked separately from their manufacturing skill.
- **Three consecutive weekends with overtime cause that employee to pack up and leave the factory (quit)**. This is **resignation at the third consecutive worked weekend**, **not** refusal of a fourth or fifth weekend. Show a very clear warning when scheduling the second and especially the third consecutive overtime weekend.
- Quitting removes that specific worker from available shift staffing and future production capacity. Player must **hire a replacement and train the new minion**. Existing machine, inventory, orders, and cash persist; do not automatically grant a replacement.
- Weekend overtime does **not** extend the customer's hot-job due date. A four-calendar-day hot job can become unachievable when the worker leaves.
- Every active shift still needs a distinct qualified worker. A single worker cannot be counted twice across the same day or both shifts; an overworked worker quitting mid-plan should invalidate unstaffed future production estimates.

**Working prototype interpretation to verify (not separately owner-confirmed):**
- Count a weekend as worked if a given employee works on **Saturday, Sunday or both**. A completely free weekend resets the **consecutive overtime weekend streak**; it also allows morale to recover.
- Quitting occurs immediately after that employee finishes their third successive overtime weekend (or last assigned overtime shift that weekend), so wages and any actual completed production are still accounted for correctly.
- Show morale/fatigue as an explanatory warning meter; the **three-weekend streak is the deterministic quit trigger**. Avoid an undocumented random resignation roll.
- Any recovery rate and the numeric effects of weekend work on happiness are **proposed balancing values**, not approved numbers.

**Example employee panel:**
```text
MINION #001 · Operator
Skill:      40%  ▰▰▱▱▱▱▱▱
Happiness:  70%  ▰▰▰▰▰▱▱▱  (illustrative only)
Weekend OT: 2 / 3 consecutive weekends
WARNING: A third consecutive overtime weekend will cause resignation.
```

### 3.1 Operator skill training and replacement

**Owner-confirmed rules:**
- Every **new hire starts at 40% operator skill**. This is an employee's individual skill, **not** the customer's separate 40%-starting relationship score.
- A minion is considered **fully mastered at 80% skill**, reached through production experience over **approximately two in-game months** of regular work; not instantly upon hiring.
- Jobs and real productive experience increase the assigned operator's skill, while training a replacement consumes time and introduces risk.
- Skill must connect to realistic outcomes, particularly **defect rates, throughput and ability to run jobs safely**. High skill should be valuable enough that losing a long-trained employee matters.

**Proposed skill progression for testing (assistant balancing suggestion, not yet confirmed):**
- Start: **40.0% skill**; initial mastery cap **80.0%**.
- Earn **+0.75 percentage points for each productive weekday/shift day** actually operating or training on a machine.
- Earn **+1.0 percentage point when a distinct customer production job is successfully completed** by that worker (only if they meaningfully participated; no XP farming by accepting/cancelling or splitting zero-work orders).
- Expected result: 44 productive workdays over approximately two normal working months plus about 7 completed jobs gives **40 + (44 × 0.75) + (7 × 1) = 80%**. Cap at 80% for the prototype.
- Training progress stops while the employee is absent or resigned, and each replacement starts again from 40%; production cannot take place in an unstaffed shift.
- Future balance testing should adjust XP by job difficulty and actual worker-hours, with a daily XP cap to prevent spamming tiny jobs.

**Suggested transparency:** Show skill change after each completed job, e.g. `Operator #002 mastered +1.0% (52.8% → 53.8%)`, and project an approximate mastery date based on recent productive activity.

### 3.2 Defective-part penalties & quality learning loop

**Owner-confirmed addition:** Defective parts must cause a meaningful **gameplay and financial penalty**; they cannot disappear from the balance sheet without consequences.

**Proposed distinction (exact amounts pending balancing):**
1. **Internal QC failure / scrap:** an unusable part consumes the **material and machine time already used** and needs a replacement if the order quantity is still outstanding. Show scrap quantity, estimated scrap cost and rescheduling risk on the job and Gantt. The current simulation already deducts raw material and counts scrapped attempts; **do not charge that same material a second time**.
2. **Reworkable defect:** deduct additional **machine-hours, staff time and any consumables** for rework instead of automatically scrapping the entire part.
3. **Customer-rejected defect after shipment:** display a separate **customer claim / replacement / credit** consequence, including possible return freight and a **decrease in the affected customer's relationship score**, on top of the real remake cost. Never silently apply both a commercial debit and a full duplicate scrap charge for the same item.
4. **Skill affects quality:** low-skilled hires should initially have a higher probability of producing defects, decreasing as they approach the 80% mastery level; the effect needs careful playtesting so beginners can recover.
5. **Quality feedback:** make rejected-piece quantity, reasons, and quality costs visible in a job summary; customer relationship penalties should only apply if a customer actually receives defective items (not merely because an internal inspector catches scrap before shipping).

**Suggested balancing (not owner-confirmed):**
- Example *additional* customer inconvenience debit: **10% of the affected defective pieces' sales value**, on top of documented replacement/shipping expense (not 10% of the entire order). Tune or remove after testing.
- Use two quality indicators — **internal scrap** vs **customer complaint/returns** — to avoid unfairly destroying customer relations over a defect the factory caught and resolved itself.
- Avoid unrealistic double penalties: the existing simulation already uses material and machining time for scrap and has late-delivery invoice deductions. Quality claims and delivery penalties must appear as distinct, understandable causes.

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
2. **Staffing, wellbeing, training and cash-out:** 2 shifts need 2 distinct people per simultaneously staffed machine; optional Saturday/Sunday overtime costs 2× wages and three consecutive worked overtime weekends trigger that employee's resignation. Introduce skill starting 40%, reaching 80% after roughly two months of productive training; hire/train replacements; add material + processing + claims costs for defects without double charging. Implement monthly rent/power and remove legacy duplicate daily utility charges.
3. **Wirecut subcontract:** pay process fee, wait 2 working days, show it in Gantt, and prevent premature delivery.
4. **Hot-job events:** occasional, strict **4-calendar-day** customer deadline, optional material-stock buffer and free-capacity strategy; feasibility first, lucrative but risky margin.
5. **Customer relationship network, quality and late-delivery consequences:** per-customer relationship starting at 40%; colored fictional customer-logo graph, on-time rewards, late-delivery relationship and cash penalties, price/volume changes on future RFQs. **Then mobile playtesting** of meaningful trade-offs; keep sheet metal locked until appropriate progression.

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
- **Confirmed:** employee resigns after **three consecutive weekends of overtime**. For exact streak counting, confirm whether Saturday OR Sunday counts as a worked weekend and when the resignation is processed.
- Decide per-customer on-time/late point changes and low/high relationship offer tiers; determine late-delivery cash-penalty calculation without duplicate penalties.
- Confirm employee-skill training balancing: proposed +0.75 percentage points per productive day and +1 point per completed job, capped at 80% (~two productive months to mastery).
- Confirm how morale meter moves on overtime/rest days and any warning thresholds; quitting is mandatory at the third consecutive weekend, not random.
- Set quality probability vs. skill and internal rework cost basis; approve/adjust any separate post-shipment rejection debit (10% of affected defective pieces' sales value is *suggested*, not confirmed).

## Critical compatibility note
The v0.3.4 code currently charges daily overhead/utilities, permits two shifts with insufficient staffing, has no weekend overtime, per-worker skill/morale, overtime-triggered resignations, replacement training, post-delivery defect claims or consent system, uses only aggregate reputation rather than per-customer 40% scores, and exposes a laser purchase. These are **known differences** between existing prototype behavior and the new owner-approved *design*; this document alone does not change gameplay. They must be deliberately replaced in a versioned update with save migration tests.

## Definition of done for the first playable slice
- New tap-required RFQ can't be accepted without the tap machine, with explicit explanation.
- Once purchased, that specific RFQ can be accepted if all other capability checks pass.
- No 2-shift production uplift without a second operator on that machine.
- Each new minion begins at 40% skill, gains auditable experience from productive work and completed orders, reaches 80% mastery in approximately two months at the target workload, and is lost on resignation.
- 2× weekend wages are charged only for staffed Saturday/Sunday overtime; after the *third successive overtime weekend* the worker quits and future shifts go unstaffed until someone is hired.
- Defect pieces accrue material and processing loss; post-shipment quality claims are distinctly costed and reduce the correct individual customer's relationship, without duplicated loss accounting.
- Rent/power expenses appear monthly at the defined rate and are not double-charged.
- Wirecut appears as a timed outsourced process in the Gantt before shipment.
- Hot jobs check material and free machine hours before award; use a 4-calendar-day countdown, while procurement, programming, and wirecut normally advance in working days. Weekend production must explicitly request and pay consenting operators 2× wages; fatigue can prevent weekend staffing.
- Existing and new customers initialize individual relationship scores to 40%; on-time fulfillment improves the correct account, late fulfillment hurts it and applies the agreed penalty. Subsequent RFQs vary in price and quantity accordingly.
- Customer account network uses original logo/icon nodes and visually shows relationship state without copying a proprietary game's interface.
- Old local saves, machines, customer orders and cash balances survive upgrading.
