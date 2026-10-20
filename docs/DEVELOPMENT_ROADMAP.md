# Factory Empire — Mobile-first Market Test Roadmap

**Updated:** 2026-10-18
**Product decision:** Original factory-business simulation, not an RPG. Skip third-person characters, open-world city and expensive walkable 3D during the prototype/market-test phase.

## Product objective
Test whether mobile players enjoy making manufacturing business decisions: bidding customer RFQs, controlling margins, protecting on-time delivery, buying material with lead times, hiring enough workers, coping with subcontract processes and managing working capital.

The *long-term fantasy* is to build from one humble rented-room CNC to a group of factories. The *near-term test* is whether early-stage jobbing, staffing and cash-flow decisions are enjoyable.

## Completed / approved
- **v0.1–v0.2:** original workshop prototype and touch-controlled machinery placement.
- **v0.3–v0.3.4:** factory dashboard, material procurement queue, two-day programming before machining, and full-width Gantt with material status and PO arrivals; current approved foundation.
- **v0.5.0 shoplot alpha is now playable:** new CNC setup/attendance simulation, same save key and UI, machine job priority, one-worker-multiple-machines, two-machine starter-room limit and early sheet-metal lock. **Most v0.4 features remain planned**; this is not the completed v0.4 release.

## v0.5.0 — playable Stage 2 shoplot alpha (2026-10-20)

- Available from the **🏭 Stage 2 Shoplot** navigation button in the existing browser game, with **explicit financial confirmation** and a **separate isolated test-drive save** for testers who cannot yet afford career progression. Test mode copies the original save only once and assigns RM750,000 plainly labeled test credit **only to the demo save slot**.
- Actual transition charges owner-confirmed **RM8,000 per physically relocated machine + RM40,000 additional fixed project costs + extra renovation**, provisionally **RM30,000 renovation** until owner decides it. Thus two-machine test relocation costs **RM86,000**, *not* RM56,000 including renovation; shoplot rental and deposit remain TBD/not charged. Bank lending is still future work.
- **14 calendar days (provisional interpretation)** of real zero CNC/tapping/packing output; normal day-close salaries/overhead, material arrivals, programming, customer deadlines and payment settlement continue. Accepted orders and machine placements survive; machine setups must be requalified.
- The shoplot is **10×7 floor tiles with a five-machine cap** (vs two-machine starter room), original positions preserved, and CNC purchase still requires full in-game price and placement. Stage 3 sheet-metal lock stays.
- **Packing Minion RM120 per working day** added to real payroll. Packing is a required 30m setup + 3m/pc (provisional) end-of-line step before Stage 2 orders can ship/invoice. The existing PO material/cutting quantity is preserved separately from packed quantity. One 420-minute normal shift/day staffed by that minion.
- **First Production Planner Hero Card:** provisional Common *Deadline Hawk*, RM220/workday provisional, real at-risk date warnings (buff) and wage/conservative warnings (debuff). Player remains hands-on Process Engineer (no engineer hire). Broader hero/QA/sheet-metal stay Stage 3.
- Isolated test-drive URL: https://lohzhi27-gif.github.io/factory-empire/?stage2=demo&v=050. Full save isolation: normal `factory_empire_proto_v1`, demo `factory_empire_stage2_demo_v1`.
- **Known balance limits:** Stage 2 loan qualification and lease/deposit charges are not in this alpha; packing/hero values and calendar-vs-working relocation need owner balancing; Gantt forecasts remain simplified.

## Proposed release sequence

| Version | Focus | Proof of value |
|---|---|---|
| **v0.4 — Jobbing & profitability** | Tapping award restrictions, polishing staffing, **one minion tending 2–3 CNCs per shift**, shared non-overlapping changeover setups (easy 0.35h, medium 1.5h, difficult 3h), a second person covering a second shift, opt-in Sat/Sun 2× wages and resignation after 3 consecutive overtime weekends, individual minion skills (40% hire → 80% mastery over ~2 months), replacement training and defect/scrap penalties, monthly RM800 rent rising 10% every 24 months, per-CNC electricity (RM900/1 shift; RM1500/2 shifts), outsource wirecut (2 working days), 4-calendar-day hot jobs, customer relationship network beginning at 40%, on-time rewards and late penalties, price/volume consequences | Player must make meaningful trade-offs across staff wellbeing, account relationships, on-time delivery and profitability |
| **v0.5 — Early factory expansion & process depth (proposed)** | Shoplot progression (4–5 CNC ceiling), mandatory Packing Minion, first Planning Hero Card, owner-led process engineering (no Process Engineer hire), entry-level equipment financing/repayments; subcontract surface treatment, basic shop-floor checks, deburr, polishing execution, packing and delivery | Player earns a bigger premises and a credible first loan while production jobs obey real timing and cost constraints |
| **v0.6+ — Semi-D milestone, conditional on market interest** | Expand to a semi-detached industrial lot (up to 16 CNCs); only then unlock *new* sheet-metal manufacturing, dedicated QA Inspector/QA Engineer department and assignable **Manager Hero Cards** (rarity-based strengths **and** weaknesses, original characters inspired by professional colleagues); preserve legacy laser purchases | Expansion brings new overhead, staffing, quality gates, machine capacity and higher-value industrial RFQs |
| **v0.7 — Playtest beta** | Mobile UX, onboarding, tutorial, balancing, save migration, performance, optional analytics with privacy controls, testers | 50–100 targeted external testers; measure tutorial completion and day-1/day-7 return rates (targets, not predictions) |
| **v0.8+ — Monetization experiments** | Android/iOS commercialization feasibility, optional ads/IAP and RM15 introductory second-machine offer if balanced | Verify free progression remains meaningful, purchase restoration and policy compliance |

Timelines are estimates to be scoped during development; no hard delivery promises.

## Approved long-term company-growth campaign

The owner's future factory journey contains **five in-game milestones**. These are **business stages, not release numbers**. Do not try to implement the whole campaign before validating the early jobbing gameplay.

| Company milestone | Premises and CNC capacity | People / process unlocks | Financing and strategic challenge |
|---|---|---|---|
| **1. Humble Beginning** | Lousy starter room; **maximum 2 CNCs**, starts with 1 | Hands-on minion, basic prototype RFQs, basic tapping/polishing milestones; **no sheet metal** | Survive on cash and basic RM800/month rent; ordinary bank expansion loan unavailable to an unproven tiny business |
| **2. Early Stage Growth** | Rent **shoplot fitting 4–5 CNCs**; moving shuts down CNC production for **14 in-game days** | **First Planning Hero Card**, **dedicated Packing Minion**, owner personally handles process engineering; optional extra programmer/desk and shared stores | **RM8,000 per machine physically moved + RM40,000 fixed relocation overhead**, with **renovation extra**. Bank loans unlock after demonstrated turnover, operating history, OTD and repayment capacity; new rent/deposit and debt installments are additional |
| **3. Mid-Term** | **Semi-D industrial lot fitting up to 16 CNCs** | **Unlock sheet metal**, dedicated **QA Inspector / QA Engineer** department, **Managers** | Finance large-capacity expansion and growing fixed overhead responsibly |
| **4. Fruit Ripe** | Move to a full factory; capacity TBD | **Double-column CNC**, optional **in-house painting and treatment** to shorten subcontract lead time | High investment and operating costs; optional future IAP packages only if free in-game progression remains available |
| **5. Industrial Tycoon** | **Rent or acquire another factory**, moving toward a multi-site group | Multi-site managers, load balancing, strategic customers and acquisitions | Rent-vs-own, larger secured lending, cash flow, group-level risks |

Full stage details, migration rules and proposed bank screening logic: [Long-term progression & loans](LONG_TERM_PROGRESSION.md).

**Owner-confirmed Stage 2 staffing revision (2026-10-20):** hire **1 Packing Minion**, and introduce **1 Production Planner as the FIRST Hero Card**, with rarity-driven buff and debuff. **The player is the process engineer** until later stages—do not add a Stage 2 Process Engineer employee. Planner salary/rarity/abilities and exact packing duration await balancing. The standard Packing Minion rate follows the currently approved RM120/workday minion salary. The playable v0.4.10 remains unchanged; this is a future unlock. General manager Hero Cards and dedicated QA remain Stage 3.

**New owner-approved shoplot move rules (2026-10-20):** 14 in-game days lost during relocation; moving service RM8,000 for each relocated machine; RM40,000 in additional project/relocation costs **on top of both moving and renovation**. A two-CNC move costs **RM56,000 plus renovation, deposit/new rent and any new CNCs**. Calendar vs working-day interpretation of the 14 days is still to be decided. For shoplot staffing, the **required Packing Minion** and **first Planning Hero Card** are confirmed; the owner remains hands-on doing process engineering with **no hired Process Engineer**. The packing station and outgoing count check must be staffed in Stage 2; optional stores/purchasing roles are proposals. The wider manager Hero Card roster and dedicated QA team remain Stage 3.


**Bank loans:** no instant cash for an unproven starter room. A credible shoplot player must build a trading record and meet a minimum sales/repayment threshold. Candidate balancing figures (NOT approved constants) include three in-game months of trading, RM50k sales over those months, at least 80% OTD and monthly cash coverage above 1.3× installments. Loan decisions may be conditional/rejected; repay principal/interest on schedule. The player can also save up without borrowing.

**IAP vs gameplay:** the owner wants optional later real-money expansion opportunities for in-house painting/treatment. Avoid essential capability paywalls: substantial in-game cash, careful financing and subcontracting must remain viable for non-paying players.

## v0.4.10 alpha — panel navigation recovery and corrected minion wages (2026-10-19)

- After owner screenshot still showed v0.4.7 and nonfunctional panel tabs, route navigation through an early **capture-phase** DOM handler embedded in the main page, not through optional later modules. Direct panel activation remains functional even if a widget throws; full-screen overlays are dismissed. Each dashboard render is independently guarded.
- Main HTML now sets the final v0.4.10 build marker at load and warns if the v0.4.8 support module failed to initialize.
- Correct **CNC minion and dedicated tapping minion salary to RM120/working day**; programmer remains RM180/day including first starter programmer, charged in the actual financial simulation and visible in Finance. Previous RM160 day rates are retired.
- Preserve all preexisting saves, machines, jobs and cash. Owner laptop retest required before moving on.

## v0.4.9 alpha — release-blocking panel navigation and starter programmer payroll (2026-10-19)

- User found that panel selection stopped responding in a v0.4.8 playtest. The native panel selector now changes active pages **before rendering**, survives optional drawing failures, clears stuck full-screen overlays and reports errors unobtrusively. Independently refreshes dashboard components so one bad widget cannot freeze the whole game.
- One founding programmer costs **RM180 per open workshop working day** from Stage 1 (provisional salary); every additional programmer adds another RM180/day. This is deducted from factory cash, accounted in `totalExpenses`, and included in the Finance payroll display. CNC minions and dedicated tapping minions remain RM160/day per worker.
- Existing local save key and all player assets remain unchanged. Manual laptop retest remains necessary; code interaction and payroll simulations pass.

## v0.4.8 alpha — Shared-PO CNCs + Stage 1 support equipment (2026-10-19)

- Accepted POs can be manually assigned to two CNCs simultaneously; per-CNC good output counters, combined order tally and shared-Ironman tending/loading are simulated. Tiny remaining quantities are protected from overproduction.
- Equipment offers a Stage 1 **tapping station** outside the two-CNC room cap. New fictional tapped-bracket RFQs require station ownership **before award**, followed by real secondary tapping process before shipping. Test duration 30m setup + 2m/pc, up to a half-day for early-stage shared support.
- From 6+ CNCs, a **dedicated tapping minion** becomes required; tappable shift budget rises from 210m to 420m/day.
- **Stage 1 programmer desk** is present/depicted and supplied with one available programmer. One programmer works on one two-working-day program per workday; expansion introduces desks/hired programmers and parallel programming at 4+ CNCs.
- HOT RFQ, Production job and urgent sheet borders now visually **red**. Existing v0.4.7 combined sheet shows CNC assignment names.
- Costs and actual tapping cycle/setup times are provisional balancing pending owner feedback. Original `factory_empire_proto_v1` save kept; future Gantt needs precise operator/station/program queue forecasting.

## v0.4.7 alpha — single Production & Schedule sheet (2026-10-19)

- Replaces separate Production and Gantt workspace switching with **one compact Production & Schedule table** in the existing orders panel.
- Per-PO row: job, customer, quantity progress, kg consumed and remaining, real process state, due/estimated finish, and next 7 days from the **same existing Gantt forecast**. HOT work highlighted.
- Search by job/part/customer, HOT/at-risk/on-machine filters, and optional full-screen expanded sheet. Individual PO details/Job Radar/HOT dispatch and longer Gantt kept as collapsible sections within Production.
- Sheet and detailed forecast are read-only planning/visibility tools: no changed CNC capacity, customer order assignment, money, calendar, equipment, worker wages or persisted save key. Detailed operator/setup-aware ETA remains future work.

## v0.4.6 alpha — material consumption + YPS founding customer (2026-10-19)

- Accepted orders display actual modeled input used per customer job (good parts + scrap + active spindle part), remaining required kg, shared stock/shortage and per-piece material; no additional inventory consumption.
- **YPS Technologies** receives a Founding Customer tribute. Newly seeded and older-playthrough introductory RFQs contain illustrative CNC brackets, **not YPS's actual commercial data**. Existing saves, accepted orders and balances are preserved.

## v0.4.5 alpha — HOT JOBS urgency-and-disruption test (2026-10-19)

- Occasional optional premium **CNC** RFQs appear in a separate HOT JOB panel, without using a normal RFQ slot, starting around Day 8 (Mon/Tue for first balancing pass). Notifications and Customers navigation mark active urgent offers.
- Owner-confirmed **4-CALENDAR-day customer lead time**; prototype countdown begins at PO award (owner confirmation pending), with all seven weekdays counted. Materials and programming continue to follow regular working days, and staffed CNC/normal setup rules cannot be bypassed.
- The player sees premium price, material stock, estimated earliest machine day, setup duration and potential displacement of prepared CNCs. Impossible basic resource/program cases cannot be accepted. Decline/expiry causes no penalty.
- PO acceptance uses existing routed programming and production, current cash/late-invoice/reputation logic, and persistent original local save key. Urgent Production cards expose an explicit CNC dispatch action; changing to hot part and back still pays full setups.
- Main Gantt labels HOT jobs but remains visibly **approximate**, since shared-operator bottlenecks are not in its ETA algorithm.
- Exact offer frequency, premium percentage, small batch quantities, award-countdown start and offer expiry are **provisional balance choices**, not final owner rules.

## v0.4.2 alpha — machine progress and Job Radar (2026-10-19)

- Equipment includes live progress bars for machining cycle/loading/setup and a direct shortcut to the exact running order in Production.
- Production cards show cyan/green/amber edge highlighting and machine status chips for the orders actively cutting or being set up, while distinguishing assigned/ready jobs from active work.
- Job Radar can filter On machines, search by job ID/part/customer and display activity count; machine job-priority options include order number and customer to avoid duplicate-part ambiguity.
- The existing **five active production orders** limit remains: this is an interface designed to scale to later 40-job CNC departments, not a release of 40-job scheduling yet. No changes to save key, cash or actual production math.

## v0.4.1 alpha — hour-by-hour jobbing simulation (2026-10-19)

- Added a **+1 Hour** control: each tap processes actual 60-minute CNC setup/attendance/cutting progression, saves partial progress, and updates a visible 08:00 simulation clock.
- **+1 Day** now finishes just the remaining hours of the current day: seven hourly blocks for one shift, fourteen across two staffed shifts; existing +7 Days / auto-days remain.
- Daily financial settlement and customer shipments occur once after the last simulated hour; supplier arrival and two-day programming advance only once when a new workday begins. Weekend hours are closed until optional overtime is implemented.
- The full original v0.4.0 CNC setup/one-minion/starter-room slice remains active, and the same save key is preserved.

## v0.4.0 alpha — implemented first slice (2026-10-19)

- Shared CNC operator attention across 2–3 machines per shift; machines wait for their minion to service/reload while another setup runs.
- Exact easy/medium/difficult initial changeover times 21/90/180 minutes; full A → B → A setup charged again. Machine dispatch selector and day-by-day setup/wait stats.
- Stage 1 new machine purchases limited to two total, Stage 3 sheet-metal/new laser gate, preserve legacy equipment and orders.
- Second staffed shift requires two separate workers; simplified wages per actual worker. Existing procurement/programming untouched.
- **Known next item:** Existing Gantt forecast is visibly flagged as *not yet setup/operator-aware*. Monthly bills, minion morale, hot RFQs, tapping and customer relationship systems remain unimplemented.

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

The detailed growth/loan open items are tracked in [LONG_TERM_PROGRESSION.md](LONG_TERM_PROGRESSION.md).
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
