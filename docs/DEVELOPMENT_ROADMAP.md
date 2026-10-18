# Factory Empire — Mobile-first Market Test Roadmap

**Updated:** 2026-10-18
**Product decision:** Original factory-business simulation, not an RPG. Skip third-person characters, open-world city and expensive walkable 3D during the prototype/market-test phase.

## Product objective
Test whether mobile players enjoy making manufacturing business decisions: bidding customer RFQs, controlling margins, protecting on-time delivery, buying material with lead times, hiring enough workers, coping with subcontract processes and managing working capital.

## Completed / approved
- **v0.1–v0.2:** original workshop prototype and touch-controlled machinery placement.
- **v0.3–v0.3.4:** factory dashboard, material procurement queue, two-day programming before machining, and full-width Gantt with material status and PO arrivals; current approved foundation.
- The playable build remains v0.3.4 until new gameplay code is released and tested. Do not imply v0.4 exists because this plan changed.

## Proposed release sequence

| Version | Focus | Proof of value |
|---|---|---|
| **v0.4 — Jobbing & profitability** | Tapping award restrictions, polishing staffing, **one minion tending 2–3 CNCs per shift**, shared non-overlapping changeover setups (easy 0.35h, medium 1.5h, difficult 3h), a second person covering a second shift, opt-in Sat/Sun 2× wages and resignation after 3 consecutive overtime weekends, individual minion skills (40% hire → 80% mastery over ~2 months), replacement training and defect/scrap penalties, monthly RM800 rent rising 10% every 24 months, per-CNC electricity (RM900/1 shift; RM1500/2 shifts), outsource wirecut (2 working days), 4-calendar-day hot jobs, customer relationship network beginning at 40%, on-time rewards and late penalties, price/volume consequences | Player must make meaningful trade-offs across staff wellbeing, account relationships, on-time delivery and profitability |
| **v0.5 — Process depth** | Surface-treatment subcontract lead times + costs; QA, deburr, polishing execution, packing, delivery, proper route and capacity checks | An order follows realistic, visible multi-stage routing and reveals true manufacturing contribution |
| **v0.6 — Progression & sheet metal** | Define and implement later unlock milestones; gate *new* laser/sheet-metal capability and jobs, add larger customers/expansion and clear progression | Player unlocks additional processes through business growth without losing earlier paid/earned machines |
| **v0.7 — Playtest beta** | Mobile UX, onboarding, tutorial, balancing, save migration, performance, optional analytics with privacy controls, testers | 50–100 targeted external testers; measure tutorial completion and day-1/day-7 return rates (targets, not predictions) |
| **v0.8+ — Monetization experiments** | Android/iOS commercialization feasibility, optional ads/IAP and RM15 introductory second-machine offer if balanced | Verify free progression remains meaningful, purchase restoration and policy compliance |

Timelines are estimates to be scoped during development; no hard delivery promises.

## v0.4 implementation order
1. **Capability-aware RFQs**: tap-required job is not awarded without own tapping machine. For polish-required jobs, require staffed polishing capability; surface missing prerequisites in quotation UI. Keep machine purchase price and wages configurable until confirmed.
2. **Cell staffing, setup and employee wellbeing**: allow one operator to supervise 2–3 machines during one shift, but charge 21/90/180 minutes of setup labor for new easy/medium/difficult parts to a single operator's available minutes (no overlapping setups), and make the other machines lose effective output while their only minion is busy: autonomous cycles may finish, but reload/attention must queue rather than allowing full parallel running. A second *person* covers a second shift for the same machine cell; never demand two people *per machine* without workload evidence. Sat/Sun overtime requires consent and pays 2× wages; the minion quits after three consecutive worked overtime weekends. New hires start at 40% skill and train toward 80% in about two months. Replace legacy daily power with monthly bills and implement rent escalation.
3. **Outsource wirecut**: optional 2-working-day subcontract step, visible in the production queue and Gantt, no early shipment before it returns.
4. **Hot-job RFQs and setup disruption**: optional, occasional urgent orders with a strict four-calendar-day customer deadline (Saturday/Sunday included). Taking a hot job may require changing over an already-prepared CNC, consuming operator time and delaying other jobs. **If A → hot B → A on the same machine, Part A takes its full setup time again**, even though that part ran there previously. While the only minion performs the hot setup, other machines must pause whenever they need operator attention, further reducing throughput. The player can reserve stock/capacity, reprioritize jobs or decline. Material, programming and wirecut remain working-day based. Any later IAP should be optional rather than a forced solution to an impossible deadline.
5. **Customer relationships, quality and scrap costs**: independent 40%-starting relationship per customer; logo-icon customer network view; on-time deliveries improve terms, late deliveries cause relationship decline and agreed invoice/penalty cost; future offer prices and quantities depend on account health. Add mobile market-playtest feedback on customer confidence and worker fatigue.

6. **Workforce and defect balance pass**: present separate skill and morale meters; warn before the third consecutive overtime weekend, handle resignation/new-hire training, and show internal scrap/rework costs versus customer-return credit/relationship penalties without duplicate charging.

Full requirements, owner-confirmed inputs, assumptions and conflicts: [V0.4 specification](V04_JOBBING_SPEC.md).

## Interaction design and technical constraints
- Keep current responsive 2D/isometric management interface; no forced graphics rewrite.
- Make it easy for phone users to review jobs, assign resources, inspect cash and react in a short session.
- Allow laptop/browser testing; mobile is the planned audience.
- Existing v0.3.4 Gantt remains the foundation for jobbing planning, not a new unrelated tool. Show setup time as a separate capacity-constrained operator activity before machining, *waiting for operator* status on unattended machines, and make urgent job changes visibly disrupt prepared machine lanes. Never credit full parallel production while the only minion is physically setting up another CNC.
- Maintain common simulation state and original local-storage save continuity with deliberate migration tests.
- Subcontract calendars should skip weekends and later local holidays; **hot-job customer deadlines always count four calendar days**, including weekends. Confirm the precise countdown start event before coding.
- Do not copy manufacturer branding. Machine art remains original/unbranded.
- No real payments enabled in prototype.
- Do not publish customer proprietary drawings or private pricing in public GitHub.

## Scope exclusions
- No third-person characters, walk-around mode, city travel, real CAM software, photorealistic machine operation, multiplayer, live ERP integration, full accounting ledger or forced IAP during market validation.

## Founder / assistant roles
- Founder: real workshop process, lead times, economics and game-feel approvals; browser/mobile test screenshots.
- Assistant: design spec, small source-code changes while collaborating in active sessions, tests, release notes, compatibility and follow-up decisions.

## Open design decisions
1. Hot-job countdown start event — RFQ offer day or order award/PO acceptance day? **Calendar-day counting is confirmed.**
2. Exact tapping machine pricing/throughput.
3. Polishing employee wage and capacity.
4. Wirecut subcontract price basis.
5. Final sheet-metal unlock milestone.
6. Month/day calendar convention for rent/electricity (provisional 30-day billing month, 24-month escalation).
7. **Confirmed quit trigger: third consecutive overtime weekend.** Confirm if Sat *or* Sun alone counts as one weekend and exactly when the resignation event fires.
8. Customer on-time/late score changes and red/green price/volume thresholds; amount/formula for late-delivery penalty.
11. **Confirmed** complete Part A re-setup after changing the CNC to B and returning to A. Still pending: partial setup progress if paused before completion, revision change policy, and realistic operator load/unload/inspection minute assumptions for supervising 2–3 CNCs.
9. Proposed minion skill XP +0.75 percentage points per productive day plus +1 per finished job; reach 80% in ~44 productive days with ~7 completed jobs. Confirm balancing.
10. Defect-rate reduction as skill improves, internal scrap/rework costs and post-shipment customer rejection fees/relationship impact. Avoid double-charging existing scrap material costs.
