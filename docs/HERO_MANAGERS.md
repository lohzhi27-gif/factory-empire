# Factory Empire — Manager Hero Cards

**Owner idea:** 2026-10-19  
**Status:** Design concept formally captured, **not implemented**; playable Stage 1 baseline is v0.4.10 alpha.  
**Unlock:** Stage 2's 4–5-CNC shoplot introduces the **first Hero Card as the Production Planner**. The broader roster of specialized **Manager Hero Cards remains Stage 3** (semi-D industrial lot, up to 16 CNCs). The Stage 2 owner performs process engineering personally; there is no Process Engineer hire.

## First Hero Card: Stage 2 Production Planner — owner-confirmed (2026-10-20)

- The **very first playable Hero Card** is the shoplot's **Production Planner**; do not wait until Stage 3 for every hero.
- The planner is a **real hired/paid worker**, with visible **rarity, buff and debuff**, working alongside the existing programmer and CNC minions. Character identity, art and professional background inspiration will be designed by the owner later; use fictionalized original characters unless a colleague authorizes real likeness.
- **One dedicated Packing Minion is also a required Stage 2 hire**, but is not a Hero Card. Their packing labor and verification should matter to delivery readiness.
- **The owner is still hands-on as Process Engineer** in Stage 2, including methods, setups, routing and technical decisions. Do not grant the shoplot a separate paid Process Engineer.
- **Example first-hero effects for later approval:** earlier scheduling conflict warning and improved priority/ETA decisions (buff); greater conservative capacity reserve, harder overtime pressure, or salary cost (debuff). No percentages have been approved.
- This is **one introductory Planning Hero**, not permission to unlock QA, operations and other specialized manager heroes early. Stage 3 unlocks those broader Manager Hero Cards.

## Owner-confirmed concept
- Build a **character card** interface for **managers**, called **"Hero Cards."**
- Every hero has **buffs AND debuffs**, affecting factory performance and decisions rather than giving free output.
- **Rarity** shapes their strengths, tradeoffs and desirability.
- Card personalities and abilities are **inspired by the real strengths and weaknesses of the owner's current and former colleagues**. The owner intends to design the characters themselves.
- This is a business-management/card mechanic, **not** a third-person RPG or walkable game.

## Proposed gameplay mechanics — all numbers and details pending approval

### Rarity framework
| Rarity | Suggested character feel | Balance principle |
|---|---|---|
| Common | Reliable junior supervisor | Modest buffs, manageable drawback and low salary |
| Rare | Proven specialist | Useful strong departmental buff with a meaningful blind spot |
| Epic | High-impact department leader | Strong specialist bonuses, but a costly or risky drawback |
| Legendary | Memorable industry veteran | Signature ability, sizable salary/side effect; **not flawless or automatically optimal** |

Rarity impacts scarcity/impact and cost, not guaranteed all-around superiority; a well-matched Common may outperform an expensive Legendary in a small factory.

### Example fictional card sketches (illustrative, **not approved balance values**)

| Hero role / archetype | Rarity | Buff | Debuff |
|---|---|---|---|
| **The Shopfloor Fixer** (Production) | Common | +5% speed on managed changeovers | +3% scrap risk when schedules are overloaded |
| **The Deadline Hawk** (Planning) | Rare | +10% delivery-forecast accuracy / better job priority | -5 happiness points on sustained overtime due to aggressive pressure |
| **The Process Whisperer** (Process Engineering) | Epic | -15% setup minutes in assigned cell | High monthly salary; limited benefit outside familiar part categories |
| **The Iron Commander** (Operations) | Legendary | +12% attended production capacity for staffed cells | -8 worker happiness points during high-utilization periods and premium salary |
| **The Quality Guardian** (QA) | Rare | -15% defective-piece probability | +5% inspection turnaround time, consuming QA capacity |

*These are prototypes of trait ideas. The numbers must be balanced against existing setup, skill, fatigue, quality and customer rules. Do not stack buffs into impossible zero-minute setups, zero scrap, limitless production or instant weekend staffing.*

### Card data / gameplay fields (suggested)
- Stable `heroId`, **original fictional portrait/name**, rarity, specialty (planning, production, process engineering, QA, purchasing, commercial).
- **Two transparent trade-off fields:** primary buff, primary debuff; additional signature skill only after balance testing.
- Wage/salary and hiring cost, experience/skill level, morale/leadership style, eligibility by stage/department, and active plant assignment.
- Apply effects only while the hero is hired, paid and assigned to the appropriate department, with capacity limit (one plant/department assignment initially).
- A hero cannot replace a real minion for machine tending or magically supply missing tapping/QA/finishing equipment. Setup and staffing bottlenecks remain real.
- Track the net effect on profit, on-time delivery, defects and worker happiness so the player sees trade-offs before hiring.

### Proposed card view
- Portrait; bold rarity/role; easily readable **green buff / orange or red debuff** (also text and icons for accessibility).
- Tap a character to inspect abilities, monthly salary, managed department/plant, factory impact preview and hire/assign/remove actions.
- Cards remain legible on phones without tiny text. Later compare heroes in a simple 2-card preview.
- The owner creates character designs based on professional memories; final art is to be original. No real colleague photos, legal names, employers' logos, identifying details or defamatory/caricatured negative claims in a public game without clear consent.

## Suggested acquisition and progression (NOT owner-confirmed)
- Start with a few story-driven **unlockable hires** by Stage 3; use salary and fit as strategic limits.
- Award hiring opportunities based on business reputation, growth milestones or achievements, *not necessarily random paid packs*.
- If collectible/drop mechanics are explored later, avoid relying on paid random gacha or rare cards as required progression. Confirm app-store rules, odds disclosures and suitability before any such system.
- Management team compositions should create interesting tradeoffs: a hard-driving production manager might raise output but accelerate weekend burnout; a quality manager protects customer satisfaction but slows inspection; a process expert reduces setup load at high payroll cost.
- At Stage 5, assign heroes to separate factories; managers cannot remotely manage unlimited sites for free.

## Manager examples grounded in current Factory Empire mechanics
1. **Operations manager:** buffs supervised CNC cell throughput/changeover coordination; debuff may consume employee happiness or wage cost.
2. **Planning manager:** fewer scheduling mistakes, stronger hot-job forecast; debuff may reduce average utilization by reserving safety capacity.
3. **QA manager:** lower customer-rejected defects and returns; debuff slower QA release or higher inspection cost.
4. **Process engineering manager:** faster setups/programming; debuff expensive salary or lower flexibility with unfamiliar materials.
5. **Sales/account manager:** improved per-customer RFQ quality and relationship recovery; debuff credit days or extra admin expense.

## Release boundaries and user-story sequence
- **Now:** only record the concept. Continue v0.4 **Stage 1** mechanics first.
- **Stage 2:** hire the **first Production Planner Hero Card** and a dedicated **Packing Minion**. The player continues personally performing process engineering; the current programmer remains separate and paid.
- **Stage 3:** unlock the broader **Manager Hero Card roster** tied to new departments, alongside QA and sheet metal; introduce only a small set for initial balancing.
- **Stage 4/5:** richer roster, factory specialization and multi-site allocation if player testing supports it.

## Decisions for later
1. Final rarity labels: Common/Rare/Epic/Legendary or a studio-specific naming convention?
2. Which current/former-colleague traits are permitted to inspire fictional heroes? Owner to provide positive/neutral traits and authorize character concepts; no personal allegations or private data.
3. Are Heroes permanent recruits, contract hires, unique unlocks or collectible cards? How do recruitment and dismissal work?
4. Exact buff and debuff values, multiplicative/stacking restrictions and which stats are eligible.
5. How does the first **Stage 2 Planning Hero** join (milestone/hire/choice), and what are the starting rarity, salary, buff and debuff? Additional Stage 3 managers can follow different recruitment rules.
6. Will players eventually be allowed to upgrade heroes through coaching, experience or specialization?
