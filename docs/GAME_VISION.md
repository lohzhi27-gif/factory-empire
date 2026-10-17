# FACTORY EMPIRE — Official Game Vision
Status: APPROVED by project owner | Decision: hybrid game controls | Approved: 2026-10-18

## One-sentence pitch
Build a manufacturing empire from one humble, unbranded starter CNC machine: manage production from an isometric factory view **and** step into the shoes of the entrepreneur to walk through workshops, meet customers, hire staff and expand the business.

## Inspiration (not copied)
- *Industrialist 3D*: readable factory construction, equipment and production management.
- *Big Ambitions*: entrepreneur progression, personal business decisions, locations and ownership.
- All branding, machines, environments, code, music and assets must be original or appropriately licensed. No Taikan logo or copied model/textures.

## Official player fantasy
1. Start in a tiny rented workshop with **one Starter VMC-760** (generic budget 3-axis machining centre), one operator and little working capital.
2. Win mostly one-off, high-unit-price, low-quantity prototype work from a small customer pool. No automatic recurring jobs.
3. Quote RFQs, procure material, develop programs, machine parts, complete secondary processes, subcontract finishing, inspect, pack and ship.
4. Manage real trade-offs: late orders vs rush subcontract costs, tooling and capacity vs cash flow, customer payment terms vs working capital.
5. Hire operators and managers, add machine types, pursue repeat orders, expand sites and eventually own a multi-factory industrial group.

## The two synchronized play modes
### A. Factory Management (isometric)
Primary working mode on mobile. View the whole workshop, tap machines, place/rearrange machinery, inspect queues, assign operators, schedule jobs, purchase material and review order/profit dashboards. Supports time advance/fast forward.

### B. Entrepreneur Walkabout (third-person)
Control a player character with touch joystick and camera orbit. Walk to a CNC, talk to a worker, visit the office, interact with warehouse and physically inspect jobs. Later travel between a **small number** of distinct business locations: workshop, customer office, showroom or industrial property. Not an open-world city at first.

### Mode switch
A prominent **Factory View / Walk Mode** button changes only the camera and interactions, NOT the underlying machine, cash, time, production or contract data. Pausing/fast-forwarding while walking requires explicit UX decisions. No separate game economy per mode.

## Manufacturing depth
- Material purchase takes 2–5 days (subject to working-day calendar).
- CNC program development initially takes 2 working days.
- Machine cycle and setup times depend on part/job and equipment capabilities.
- Additional steps depend on job routing: tapping, wirecut, EDM, polish, deburr, grinding and inspection.
- Finishing/treatment is usually subcontracted: owner-supplied processes and lead times in `data/surface_treatments.json`. Normal: provisional 5 working days; confirmed rush: 3 working days; rush surcharge: +50% **to the finishing/heat treatment operation cost only**.
- Customer profiles, starter machines, job families and RFQs have owner-provided source data under `data/`. RFQ selling prices are PER PIECE.
- Appropriate material/finishing compatibility checks. Vacuum hardening is heat treatment rather than plating.
- Customer delivery, payment terms, machine breakdowns and invoicing influence survival.
- All figures are game balancing inputs, not real quotations.

## Business progression
- **Start**: a single generic VMC; custom prototype RFQs, long lead times and weak repeat business.
- **Grow**: machine upgrades, tapping/drill capability, stock purchasing, more shifts, quality, outsourcing, hiring and planners.
- **Expand**: larger repeat manufacturing orders, multiple processes, automation, warehouses and additional workshops.
- **Empire**: buy property, open/acquire factories, appoint general managers, compete for sophisticated contracts and balance debt against growth.

## Platform and monetization intent
- Mobile-first: Android launch target, iOS later; browser prototype for early feedback because founder currently has iPhone/iPad only.
- Free download, optional rewarded ads and transparent in-app purchases.
- Owner proposed an introductory **RM15 first extra starter CNC** offer. This is an IDEA, not a payment implementation, guarantee or current entitlement. Balance against an earnable, non-paid progression route: no hard paywall to basic factory expansion; maintain a fully playable free game.
- Real-money currency is distinct from RM180,000 in-game starter VMC value. Ads, purchases, tracking and age-appropriate disclosures must comply with store rules before release.
- Track retention, customer satisfaction and purchase value vs acquisition cost before spending on scale.

## Development constraints
- Small after-work collaboration; prioritize a fun, stable loop before ambitious 3D.
- Existing `index.html` is a proof-of-concept isometric **2D browser game**; the hybrid vision is NOT implemented yet.
- Separate simulation/domain logic from presentation so a later 3D camera/avatar doesn't break production saves.
- Every stage ends with a playable user test on iPhone/iPad.
- Use public GitHub repository responsibly; do not include confidential workshop/customer drawings or proprietary data.

## North-star experience
"One machine, one risky RFQ, and one overdue supplier. Twenty game-years later, I'm walking through my fifth factory and negotiating the acquisition of a rival."

## Explicitly out of scope for early versions
Photorealistic cutting physics, real CAM/G-code output, open-world city, multiplayer, licensed real-world machine brands, complete ERP accuracy and mandatory pay-to-win purchases.
