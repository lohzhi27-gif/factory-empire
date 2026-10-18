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
- **Progression:** earn the right to take more difficult jobs and add processes: CNC → tapping/polishing capability → subcontract wirecut → higher-volume customers → later sheet-metal capability and factory scale.
- **Decision events:** occasional 4-calendar-day hot jobs arrive when CNCs may already be set up for other customers. Switching to a hot part costs real operator/setup minutes and may delay existing POs; stock buffers and spare capacity offer strategic alternatives. Optional monetization is a later market test, not a paywall or instant solution to impossible production constraints.

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
v0.3.4 is the current owner-approved playable baseline. Later planned features are not yet implemented.
