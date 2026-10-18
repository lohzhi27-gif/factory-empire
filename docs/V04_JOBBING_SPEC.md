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
- Special, occasional **hot jobs with a requested four-day lead time** offer attractive revenue.
- Players may decide to keep a **buffer percentage of raw material** in stock and deliberately leave **some machine capacity uncommitted** to capture these.
- Rewards come from business judgment: an expensive rush quotation is useful only when the player has adequate material and capacity.
- Check the same prerequisites and genuine routing time (tapping, staff, programming, subcontract wirecut, etc.). Warn or decline if impossible; never magically compress a real multi-day process.
- The phrase "four days" requires a calendar-vs-working-day decision from owner. Until confirmed, do not silently label it working days.
- Proposed (not confirmed) knobs for initial balance testing: 10–20% stock buffer of common materials, 10–15% available machine capacity reserved for urgent work, hot-job price premium negotiated according to urgency/profitability.
- Suggested gameplay trigger: low-frequency, optional event, with visibly higher margin, a clear due-date countdown and potential reputation damage for missing delivery. No forced microtransaction.

## Proposed v0.4 implementation order (not yet committed to gameplay)
1. **Capability and award checks:** tapping RFQ blocked without tapping station; polishing staff gating; visually clear missing-resource notices and required process routing.
2. **Real staffing and cash-out:** 2 shifts need 2 people per simultaneously staffed machine, monthly rental escalator and per-CNC electricity invoices; remove legacy utility double charges.
3. **Wirecut subcontract:** pay process fee, wait 2 working days, show it in Gantt, and prevent premature delivery.
4. **Hot-job events:** occasional, 4-day requested deadline, optional material-stock buffer and free-capacity strategy; feasibility first, lucrative but risky margin.
5. **Balancing and mobile playtesting:** make the player value their first tapping machine and polishing employee; keep sheet metal locked until appropriate progression.

## Later unlocks
- v0.5: deeper process costing, polishing work-in-process, QA/surface finishing/packing.
- v0.6+: sheet-metal and laser-cutting production **after clear milestones**, plus more advanced customers and factory expansion.
- These version boundaries are planning proposals, not tested release commitments.

## Required follow-up decisions
- Four-day hot job: **working days or calendar days?**
- Tapping station game purchase price, operation speed/capacity and whether it requires its own operator.
- Polishing worker daily wage, output rate and number of staff.
- Wirecut subcontract price (per job, per piece, per cutting time).
- Is rent RM800/month and does power scale with machines owned or machines operated?
- Exact sheet-metal unlock conditions (e.g., CNC jobs delivered, company reputation and investment milestones). These are not to be invented during implementation.
- Confirm a single time/calendar standard for rent escalation, holiday skips, monthly electricity and 365-operating-day machine service.

## Critical compatibility note
The v0.3.4 code currently charges daily overhead/utilities, permits two shifts with insufficient staffing, and exposes a laser purchase. These are **known differences** between existing prototype behavior and the new owner-approved *design*; this document alone does not change gameplay. They must be deliberately replaced in a versioned update with save migration tests.

## Definition of done for the first playable slice
- New tap-required RFQ can't be accepted without the tap machine, with explicit explanation.
- Once purchased, that specific RFQ can be accepted if all other capability checks pass.
- No 2-shift production uplift without a second operator on that machine.
- Rent/power expenses appear monthly at the defined rate and are not double-charged.
- Wirecut appears as a timed outsourced process in the Gantt before shipment.
- Hot jobs check material and free machine hours before award.
- Old local saves, machines, customer orders and cash balances survive upgrading.
