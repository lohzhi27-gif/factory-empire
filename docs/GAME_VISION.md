# Factory Empire — Official Game Vision

**Updated:** 2026-10-18
**Current owner-approved direction:** Mobile-first industrial factory **management / business tycoon**. The earlier *Industrialist 3D + Big Ambitions* walkable hybrid is a superseded exploration idea, not the current build roadmap.

## Core pitch
Start with one humble original unbranded CNC milling machine and a rented workshop. Win custom prototype RFQs, acquire the equipment and people needed to make jobs, manage purchasing and deadlines, preserve margins and develop a real industrial manufacturing business.

## Player experience
- **Factory view:** easy-touch isometric workshop and move/inspect machines.
- **Production view:** customer quotations, job routing, equipment/staff constraints, shift assignment, outsourcing and Gantt.
- **Finance:** cash, monthly fixed costs, receivables, on-time/late penalties and profits rather than sales alone.
- **People and setup:** one minion may tend 2–3 simultaneously running CNCs per shift, but cannot carry out two machine setups at once; when that lone minion is setting up one CNC, other running machines can finish autonomous cutting cycles but will **wait for their operator** for reload/inspection, so they cannot keep producing at full unrestricted speed. New part setup is easy 0.35h (21 min), medium 1.5h (90 min), difficult 3h (180 min), distinct from 2-day programming. Switching CNC setup from Part A to hot Part B and later back to A **requires full setup of Part A again**, with additional worker time and machine stoppage. A second shift covering the same CNC cell needs another worker; do not count one worker twice. Saturday/Sunday overtime costs double normal wages. After **three consecutive overtime weekends**, that employee **quits**, creating a real staffing shortage. New minions start at **40% operating skill** and learn through productive jobs toward **80% mastery in roughly two months**. Happiness/fatigue and skill are separate meters.
- **Quality:** faulty parts cost material, machine time and/or rework; customer-rejected delivered parts can incur additional credit/replacement cost and account-relationship damage without duplicate expense accounting.
- **Customers:** every new account relationship begins at **40%** and is represented by an original fictional customer-logo node with a red-to-green status ring. On-time delivery improves that customer's future offer price/volume; late delivery damages the relationship and incurs a commercial penalty.
- **Progression:** follow the owner's five-stage journey: **1. Humble Beginning** (one VMC in a lousy rented room, maximum two CNCs) → **2. Early Stage Growth** (a 4–5-CNC shoplot, Production Planner, Process Engineer and earned bank-loan eligibility) → **3. Mid-Term** (semi-D industrial lot, 16-CNC capacity, first new sheet-metal capability, dedicated QA Inspector/QA Engineer department and manager **Hero Cards** with rarity-dependent buffs/debuffs inspired by fictionalized professional colleagues) → **4. Fruit Ripe** (full factory, double-column CNC and optional in-house painting/treatment) → **5. Industrial Tycoon** (rent/buy additional factories and manage multiple sites).
- **Decision events:** occasional 4-calendar-day hot jobs arrive when CNCs may already be set up for other customers. Switching to a hot part costs real operator/setup minutes and may delay existing POs; stock buffers and spare capacity offer strategic alternatives. Optional monetization is a later market test, not a paywall or instant solution to impossible production constraints.

## Career and premises growth

The campaign is grounded in expanding from a tiny rented workshop into an industrial group, not RPG walking scenes. Advancement changes space, staff, expenses, process access, financing and customer opportunity rather than merely changing the backdrop.

**Bank eligibility matters:** first-room beginners do not get easy bank financing. Credible shoplot businesses may apply after demonstrating sufficient sales/trading history and sustainable repayment capability; loans are priced/repaid and can be rejected. Exact minimum turnover and repayment thresholds are **balancing proposals** until the owner approves them.

**Sheet-metal gating:** the first new sheet-metal department unlocks at the **semi-D stage**, not in the starter room or early shoplot. Keep already-owned laser machines in legacy saves. Optional in-house painting/treatment or real-money expansion offers come much later and must not block in-game-cash progression.

Detailed staged roadmap: [Five-stage company growth and financing](LONG_TERM_PROGRESSION.md).

## Important realism rules
See [v0.4 Jobbing Specification](V04_JOBBING_SPEC.md) for owner-approved process and cost constraints and what remains to be confirmed. Players must not be awarded tap-required jobs without a tapping machine, a second shift needs a second worker for a manageable multi-machine cell, weekend overtime needs consent and 2× wages, three consecutive overtime weekends cause resignation, new staff require training and defects have real costs, rent and electricity are real costs, and a two-workday wirecut outsourcing option is available. Every customer's relationship begins at 40%; on-time deliveries improve it, and late deliveries damage it.

## Target platforms
Initial low-cost browser prototype tested on laptop, tablet and phone; design for mobile users. Future mobile-app packaging only after market interest. No requirement for RPG walking, full city scene or third-person avatars.

## Monetization approach (not active yet)
Free progression first, validated retention and enjoyment before adding optional rewards/purchases; urgent orders must remain possible to handle through smart non-paid capacity planning, or possible to decline without forcing a purchase; an RM15 real-money introductory extra-machine offer remains an idea, not an implemented feature. Keep game currency distinct from real payments.

## Design guardrails
- Accurate business decisions, accessible controls and enjoyable short sessions matter more than visual photorealism.
- All game artwork is original or appropriately licensed and must not use unlicensed manufacturer branding.
- Existing local saves and owned equipment are preserved when capabilities become gated for **new** players.
- Do not publish private customer engineering drawings or prices.

## Technical state
**v0.4.5 alpha** is the current playable browser release: shared-minion CNC setups and automatic cutting/attendance with an actual 60-minute +1 Hour option, live machine progress bars, linked Job Radar production highlights, and occasional premium HOT JOB offers under a four-calendar-day deadline, same original saves and factory/Gantt UI, early-stage two-machine/sheet-metal gates. The rest of the long-term vision (including Hero Cards, loans, multi-site, staff skill/morale and customer network) remains planned.
