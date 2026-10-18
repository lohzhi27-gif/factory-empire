# Factory Empire — Five-Stage Industrial Growth Campaign

**Owner direction:** 2026-10-18  
**Status:** Official design direction, not implemented yet. Playable baseline remains **v0.3.4**.  
**Theme:** Inspired by the owner's business journey: humble CNC jobbing → a shoplot → semi-detached industrial facility → substantial manufacturing factory → a group operating multiple factories. No RPG/walkable character requirement.

> These are five **in-game company stages**, not necessarily the same as software release versions. Market testing comes before developing all five. Preserve the mobile-first management/Gantt interface.

## Stage 1 — Humble Beginning: the lousy room

**Maximum factory footprint/capacity: 2 CNC machines.** The player starts with **one** humble, original, unbranded VMC and one inexperienced minion (new employee skill 40%).

- Space restriction is real: second CNC may be added if affordable, but **no third machine fits**. A machine purchase offer must show the room capacity.
- Basic machining/prototyping jobs; limited rent and overhead based on the existing owner-confirmed **RM800/month starter rent**, subject to consistent calendar rules.
- The player handles quotations, purchasing, setups, scheduling, customer deliveries, staff morale and cash personally. No planning/engineering/management department yet.
- Tapping machine and polishing worker unlock within capability progression; define whether these auxiliary tools consume the two-CNC room capacity separately. No sheet-metal department.
- Weekend overtime pays 2× ordinary wage; after **three consecutive overtime weekends**, that employee resigns. New minions restart at 40% skill and train toward 80% mastery.
- **Bank response: ordinarily too small/young to qualify for a commercial expansion loan.** Present meaningful rejection reasons and alternative organic-growth choices rather than a magical infinite-loan button.
- Graduation trigger should combine funds to move, demonstrable customer orders, manageable backlog and minimum delivery quality. **Exact cash/contract/reputation thresholds require owner balancing.**

## Stage 2 — Early Stage Growth: rented shoplot

**Space: 4–5 CNC milling machines.** The player moves out of the old room into a recognizable commercial shoplot. The new location has its own lease, deposit, utility bills, installation/moving costs and configurable shoplot rental rate (owner value TBD).

- Introduce dedicated **Production Planner**. Planning capacity now matters: smarter sequencing by material ETA, setups, operator hours, due dates, and expensive hot jobs; Gantt can warn of overload. The planner is a hired wage expense, not free automation.
- Introduce **Process Engineer**: supports programming, process selection, routing, setup standardization and fewer avoidable quality issues. Improvement and labor costs should be visible.
- Continue realistic minion assignment: one worker may attend two or three running CNCs in one shift, but setups cannot overlap; other CNCs wait for reload/inspection while the worker sets up a different machine.
- Keep sheet-metal/laser department **locked**: a shoplot is a CNC jobbing step, not a license to produce every possible industrial product.
- **First credible bank financing milestone:** player can apply for real loans once business credibility criteria are met. Loans can be rejected or offered with different limits, rates and debt service.
- Financing products for gameplay consideration: equipment hire purchase (asset-backed), short-term working capital, and a bank term loan for expansion. Amounts, interest, deposits and approval thresholds to be balanced.

### Bank-credit logic: demonstration before approval

**Owner-confirmed principle:** A tiny operation in the starter room should not receive easy bank approval; banks should require proven activity, a minimum amount of sales/financial strength, and repayment ability.

**Recommended initial test model — proposed thresholds, not approved game constants:**
1. **Trading history:** at least **3 completed in-game months** since opening and a minimum number of shipped customer jobs.
2. **Turnover:** e.g. RM50,000 of sales over the trailing three in-game months for a small equipment-finance application. Loan eligibility also depends on the size of the requested facility; use larger thresholds for large expansion borrowing.
3. **Track record:** e.g. 80% on-time delivery or better and no repeatedly defaulted obligations.
4. **Repayment capacity:** e.g. projected monthly available operating cash at least **1.3× the monthly loan installment**. Count wages, rent, electricity, material purchases and existing installments.
5. **Owner commitment/security:** e.g. 10–20% game-cash down payment/deposit, and equipment security for hire purchase. Borrowing limit based on affordability, not one fixed number.
6. **Decision:** Approved, conditional, or rejected; show readable explanation and next steps. Do not guarantee approval merely because a button was pressed.

**Important financing gameplay rules:**
- Calculate **monthly repayments** of principal and interest, outstanding loan balance, repayment dates and penalties on missed debt service.
- Loan application should cost little or nothing for early testing; random refusals shouldn't dominate. Do not give cash as soon as player submits application.
- Purchases and bank facilities must be measured against actual **cash flows**, not just gross sales. Profitable customer orders on seven-day credit terms can still strain the workshop.
- Keep borrowing entirely **in game currency** and separate from real-money purchases/IAP.
- Offer an organic path to the shoplot without a loan. The loan is an accelerator with downside risk, not a mandatory paywall.

## Stage 3 — Mid-Term: semi-detached industrial lot

**Maximum initial CNC capacity: 16 CNCs** in a larger industrial building. This is the **first milestone unlocking sheet-metal production** as the owner requested.

- New machine/department unlock: **Sheet Metal**, including suitable cutting/fabrication capability, only after moving to the semi-detached industrial facility and completing a balanced qualification objective. For all new games, no premature sheet-metal offers at the starter room/shoplot.
- Add a **Quality Control department** with:
  - **QA Inspector:** first article and outgoing/in-process inspection tasks, rejection detection and QA workload.
  - **QA Engineer:** root-cause/action plans, defect reduction, quality-system investment, customer claim handling and process improvements.
- Introduce **Managers** with real wages and role limits; production and quality management reduce excessive micromanagement, but not instant error-free operations. Departmental manager performance depends on staff/resources and customer priorities.
- Higher-capacity machining and meaningful bottlenecks between programming, setup, machine tending, polishing, subcontract operations and QC.
- Move/build-out cost, deposits, extra power consumption and payroll scale appropriately; upgrading has financial risk.
- Original v0.3.x users may already own an in-game laser (legacy purchase). **Preserve owned equipment and existing game progress** and phase in future eligibility without silently deleting machines or orders.

## Stage 4 — Fruit Ripe: full factory

Move to a full manufacturing factory with greater space and sophisticated machine options. Its total machine/land footprint and exact unlock threshold remain to be agreed.

- Introduce **double-column CNC milling machines** for larger work, with distinct machine dimensions, setup requirements, high purchase cost, higher energy expenses and new industrial RFQs.
- Offer **in-house secondary-processing departments**, especially **painting/powder coating and surface treatment**, reducing external subcontract lead times once they have staff, equipment and capacity.
- Compare capital equipment/department expenses, chemicals or other operating costs (simplified), workers, QA and maintenance against outsourcing price and lead time.
- **Owner-proposed later IAP opportunity:** optional real-money convenience/expansion packages related to adding in-house finishing capacity, once market validation shows a demand. Keep in-house departments also **attainable via substantial in-game cash and milestone gameplay**; no essential finishing step should be obtainable only through IAP.
- Shorter in-house lead time must still reflect staffing, queues, process duration and quality: no instant coating merely because the player purchases a department.
- Develop account management and major OEM/contract-manufacturing customer relationships without exposing proprietary real-life customer data.

## Stage 5 — Industrial Tycoon: multiple factories

**Rent or acquire another factory** and operate an industrial group rather than one plant. Inspired by the scaling decisions of business-management games, not copying their user interface or assets.

- Choose **rent vs buy/acquire**, each with deposits, loan exposure, tax/maintenance simplifications and strategic tradeoffs.
- Multiple sites have their own space, people, machine fleets, payroll, power and rental/debt obligations, with a consolidated overview.
- Player can allocate work between sites, subcontract internally, negotiate big orders, move machines only with cost/downtime, and appoint managers.
- Cash, order commitments, global/customer reputation and financial exposure are shared according to an intentional group model, not free resources.
- Bank finance expands from limited shoplot equipment loans to larger secured investment facilities based on proven group cash flow and track record.
- Make expanding too quickly genuinely dangerous: an impressive factory with poor cash flow can fail.

## Company stages should be earned, not based on days played

**Confirmed:** stage capacities and departmental feature boundaries described above. **Not yet confirmed:** numerical stage unlock thresholds, building prices/lease rates after Stage 1, QA/manager payroll, factory size after Stage 3, double-column machine pricing and specific financing offers.

**Suggested stage-up checklist (not approved numbers):**
- S1 → S2: cash deposit + reliable customer backlog + 1–2 successful production milestones + an affordability check.
- S2 → S3: operating performance, enough loan/equity capacity, trained planner/process engineer, quality readiness and upgrade capital.
- S3 → S4: enough capital to move, a sustained customer base and operational competence managing departmental staff and 16-CNC scale.
- S4 → S5: proven multi-department factory, stable cash flow and professional managers; compare buy/rent scenarios.

A player may be eligible for a bigger building before they can afford its payroll, machines or fixed expenses. Show projected monthly profit and cash runway before every move.

## Proposed implementation sequence vs game-stage sequence

These are **not** one-to-one labels:
- **v0.4 (next playable sprint):** strengthen the *Stage 1* CNC jobbing loop: real setup/worker bottlenecks, RFQs and capability locks, staff training, defect costs, overtime, rent/electricity, hot-job planning and relationship consequences.
- **Next validated gameplay slice:** Stage 1 → Stage 2 shoplot move, shoplot capacity, planner/process engineer and a first *limited* bank eligibility/repayment model.
- **After repeat playtest/retention evidence:** Stage 3 semi-D, 16-CNC ceiling, first sheet-metal department, QA inspectors/engineers and managers.
- **Later product development:** full factory, double-column CNC, secondary departments, and then multi-factory operations.
- Do not promise all five stages in v0.4; the campaign is the **future game**, while our immediate objective is validating that players enjoy the early jobbing decisions.

## Balancing & save safety

- Active v0.3.4 is a prototype and already has purchase options for laser machines and an older workshop size. Save migration must respect *existing* owned equipment, cash, orders and machine placements; do not retroactively confiscate old purchases.
- Loan offers, debt, and expansion cost require clear game-money labeling and persistent records, not actual personal financial products.
- Avoid progression based on mandatory real spending, randomized predatory loan denial, or manufactured scarcity. Players should make meaningful choices among waiting, saving, expanding and financing.
- Keep proprietary manufacturer/customer branding and actual customer engineering data out of this public repository.
- Implement one small tested step at a time; do not break the previously approved view switch/Gantt.

## Open business-design decisions for the founder

1. What **minimum turnover** is appropriate before a shoplot business can apply for its **first equipment loan**? RM50,000 in three game months is only an initial proposal; decide separately from the amount required for a property loan.
2. First shoplot monthly rent and moving cost.
3. Is the shoplot cap **four or five CNCs**, or five maximum with one slot optionally reserved for tapping/equipment?
4. What financial/machine/relationship score qualifies the player to move from shoplot to semi-D?
5. What does a **double-column CNC** cost in game currency, and which industrial part families require it?
6. In-house finishing acquisition costs, recurring operating cost and achievable relative lead-time improvement.
7. Do managers unlock at the start of semi-D or after a milestone within that site?
