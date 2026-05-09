import { useMemo, useState } from 'react';
import { Slider } from '../../components/ui/Slider';
import { useAppState } from '../../state/AppState';
import {
  computeSalaryAndDividends,
  ltdResult,
  soleTraderResult,
} from '../../lib/tax';
import {
  CGT_HIGHER,
  CT_SMALL_RATE,
  DIV_HIGHER,
} from '../../lib/constants';
import { formatGBP, formatPct } from '../../lib/format';

/**
 * Per-structure simulations. The headline `sole-trader` and `ltd` cases use
 * the existing flow-diagram simulation in StructureDetail itself; everything
 * else routes through here.
 */
export function StructureSimulation({ id }: { id: string }) {
  switch (id) {
    case 'partnership':
      return <PartnershipSim />;
    case 'llp':
      return <LlpSim />;
    case 'holding':
      return <HoldingSim />;
    case 'fic':
      return <FicSim />;
    case 'psc':
      return <PscSim />;
    default:
      return <NoSimulationFallback />;
  }
}

/**
 * Quick lookup so callers can decide whether to wrap the simulation in a card
 * shell without rendering and inspecting the output.
 */
export function hasStructureSimulation(id: string): boolean {
  return ['partnership', 'llp', 'holding', 'fic', 'psc'].includes(id);
}

function NoSimulationFallback() {
  return (
    <div className="px-5 py-5 text-sm text-ink-700 dark:text-ink-300">
      Trusts span too many sub-types — bare, interest-in-possession,
      discretionary, vulnerable-beneficiary — for a single numeric simulation
      to teach the right thing. The body below explains the mechanics and the
      cases where a trust earns its place. For numbers on a specific trust
      setup, talk to a specialist.
    </div>
  );
}

// ---------------- Partnership / LLP shared engine ----------------

interface PartnerRow {
  share: number;
  profit: number;
  tax: number;
  net: number;
  effective: number;
}

function partnerRows(totalProfit: number, shares: number[]): PartnerRow[] {
  const sumShares = shares.reduce((s, x) => s + x, 0) || 1;
  return shares.map((share) => {
    const partnerProfit = (share / sumShares) * totalProfit;
    // A partner's share is taxed as their personal trading profit.
    const r = soleTraderResult(partnerProfit, 0);
    return {
      share,
      profit: partnerProfit,
      tax: r.totalTax,
      net: r.netToOwner,
      effective: partnerProfit > 0 ? r.totalTax / partnerProfit : 0,
    };
  });
}

function PartnershipLikeSim({
  liabilityNote,
}: {
  liabilityNote: string;
}) {
  const { state } = useAppState();
  const profile = state.personalProfile;
  const defaultProfit = Math.max(
    0,
    (profile.annualRevenue ?? 200_000) - (profile.annualCosts ?? 50_000),
  );

  const [profit, setProfit] = useState(defaultProfit);
  const [partnerCount, setPartnerCount] = useState(2);
  const [equal, setEqual] = useState(true);

  const shares = useMemo(() => {
    if (equal) return Array.from({ length: partnerCount }, () => 1);
    // Asymmetric default: senior partner gets 2x for any "uneven" split.
    return Array.from({ length: partnerCount }, (_, i) => (i === 0 ? 2 : 1));
  }, [equal, partnerCount]);

  const rows = useMemo(() => partnerRows(profit, shares), [profit, shares]);
  const totals = rows.reduce(
    (acc, r) => {
      acc.profit += r.profit;
      acc.tax += r.tax;
      acc.net += r.net;
      return acc;
    },
    { profit: 0, tax: 0, net: 0 },
  );

  // Reference comparison: same total profit through one sole trader.
  const oneSoleTrader = soleTraderResult(profit, 0);

  return (
    <div className="grid gap-4 px-4 py-4 md:grid-cols-[260px_minmax(0,1fr)]">
      <div className="space-y-3">
        <Slider
          label="Total business profit"
          value={profit}
          min={0}
          max={500_000}
          step={1_000}
          onChange={setProfit}
        />
        <Slider
          label="Number of partners"
          value={partnerCount}
          min={2}
          max={5}
          step={1}
          onChange={(v) => setPartnerCount(Math.round(v))}
          format={(v) => `${v} partners`}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={equal}
            onChange={(e) => setEqual(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500"
          />
          Equal profit shares
        </label>
        <p className="text-[11px] text-ink-500 dark:text-ink-400">
          {equal
            ? 'Each partner gets an equal slice of the total profit.'
            : 'Senior partner gets a 2× share; the rest split equally.'}
        </p>
        <div className="rounded-lg border border-ink-200 p-3 text-xs dark:border-ink-700">
          <div className="font-semibold">If one sole trader instead</div>
          <div className="mt-1">
            Tax{' '}
            <span className="font-mono text-danger-500">
              {formatGBP(oneSoleTrader.totalTax)}
            </span>{' '}
            · Net{' '}
            <span className="font-mono">{formatGBP(oneSoleTrader.netToOwner)}</span>
            {' '}
            · Effective{' '}
            <span className="font-mono">
              {formatPct(oneSoleTrader.effectiveTaxRate)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-ink-500 dark:text-ink-400">
            Splitting profit between partners uses each partner's own personal
            allowance and basic-rate band — saving tax even if the work and
            risk are the same.
          </p>
        </div>
      </div>
      <div>
        <table className="w-full text-sm">
          <thead className="text-left text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
            <tr className="border-b border-ink-200 dark:border-ink-800">
              <th className="py-2">Partner</th>
              <th className="py-2 text-right">Share</th>
              <th className="py-2 text-right">Their profit</th>
              <th className="py-2 text-right">Personal tax</th>
              <th className="py-2 text-right">Net to them</th>
              <th className="py-2 text-right">Effective</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-b border-ink-200/60 last:border-0 dark:border-ink-800/60"
              >
                <td className="py-2">Partner {i + 1}</td>
                <td className="py-2 text-right font-mono">{r.share}</td>
                <td className="py-2 text-right font-mono">{formatGBP(r.profit)}</td>
                <td className="py-2 text-right font-mono text-danger-500">
                  {formatGBP(r.tax)}
                </td>
                <td className="py-2 text-right font-mono text-accent-700 dark:text-accent-300">
                  {formatGBP(r.net)}
                </td>
                <td className="py-2 text-right font-mono">
                  {formatPct(r.effective)}
                </td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="py-2">Total</td>
              <td className="py-2 text-right" />
              <td className="py-2 text-right font-mono">{formatGBP(totals.profit)}</td>
              <td className="py-2 text-right font-mono text-danger-500">
                {formatGBP(totals.tax)}
              </td>
              <td className="py-2 text-right font-mono text-accent-700 dark:text-accent-300">
                {formatGBP(totals.net)}
              </td>
              <td className="py-2 text-right font-mono">
                {totals.profit > 0
                  ? formatPct(totals.tax / totals.profit)
                  : '—'}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-3 rounded-lg border border-ink-200 bg-ink-50/40 p-3 text-xs dark:border-ink-700 dark:bg-ink-900/40">
          <strong>Liability:</strong> {liabilityNote}
        </div>
        <p className="mt-3 text-[11px] text-ink-500 dark:text-ink-400">
          Each partner's slice is taxed at their own income-tax bands +
          Class 4 NI. Drawings vs. allocated profit are separate questions —
          tax is on the allocation, not the cash withdrawn.
        </p>
      </div>
    </div>
  );
}

function PartnershipSim() {
  return (
    <PartnershipLikeSim liabilityNote="General partnership — joint and several. Every partner is fully on the hook for every partnership debt, not just their share." />
  );
}

function LlpSim() {
  return (
    <PartnershipLikeSim liabilityNote="LLP — limited liability for the members. Tax numbers are identical to a partnership; what changes is that one member's bad call can't reach the others' personal assets." />
  );
}

// ---------------- Holding ----------------

function HoldingSim() {
  const { state } = useAppState();
  const profile = state.personalProfile;
  const [revenue, setRevenue] = useState(profile.annualRevenue ?? 250_000);
  const [costs, setCosts] = useState(profile.annualCosts ?? 80_000);
  const [salary] = useState(12_570);
  const [desired, setDesired] = useState(profile.personalIncomeNeed ?? 60_000);
  const [sweepPct, setSweepPct] = useState(0.6);

  // Single Ltd reference: trading sub on its own, owner extracts what they need.
  const standalone = ltdResult({
    revenue,
    costs,
    ownerSalary: salary,
    desiredCash: desired,
  });

  // With holdco: the trading sub still extracts to the owner the same way,
  // but a portion of `companyRetained` is dividended UP to holdco rather than
  // sat inside the trading sub. UK group dividends are normally exempt — so
  // no further CT on the inter-co transfer. The holdco then has cash it can
  // reinvest, isolated from trading risk.
  const swept = standalone.companyRetained * sweepPct;
  const stayInTrading = standalone.companyRetained - swept;

  return (
    <div className="grid gap-4 px-4 py-4 md:grid-cols-[260px_minmax(0,1fr)]">
      <div className="space-y-3">
        <Slider
          label="Trading sub revenue"
          value={revenue}
          min={50_000}
          max={1_000_000}
          step={5_000}
          onChange={setRevenue}
        />
        <Slider
          label="Trading sub costs"
          value={costs}
          min={0}
          max={Math.max(50_000, revenue)}
          step={1_000}
          onChange={setCosts}
        />
        <Slider
          label="Personal cash needed"
          value={desired}
          min={0}
          max={250_000}
          step={1_000}
          onChange={setDesired}
        />
        <Slider
          label="% of retained cash swept up to holdco"
          value={sweepPct}
          min={0}
          max={1}
          step={0.05}
          onChange={setSweepPct}
          format={(v) => `${Math.round(v * 100)}%`}
        />
        <p className="text-[11px] text-ink-500 dark:text-ink-400">
          UK-to-UK group dividends are normally exempt from CT — cash moves
          up the group with no extra tax. The owner still pays personal tax
          only on what's extracted to them.
        </p>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-ink-200 p-4 dark:border-ink-700">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Trading sub (the operating company)
          </div>
          <div className="mt-2 grid grid-cols-2 gap-y-1 text-xs font-mono tabular-nums">
            <span>Revenue</span>
            <span className="text-right">{formatGBP(revenue)}</span>
            <span>Less costs / salary / employer NI</span>
            <span className="text-right text-warn-500">
              −{formatGBP(revenue - standalone.preTaxProfit)}
            </span>
            <span>Pre-tax profit</span>
            <span className="text-right">{formatGBP(standalone.preTaxProfit)}</span>
            <span>− Corporation tax</span>
            <span className="text-right text-danger-500">
              −{formatGBP(standalone.corporationTax.total)}
            </span>
            <span className="font-semibold">Post-tax profit</span>
            <span className="text-right font-semibold">
              {formatGBP(standalone.postTaxProfit)}
            </span>
            <span>− Dividend out to owner</span>
            <span className="text-right">−{formatGBP(standalone.dividendDeclared)}</span>
            <span className="font-semibold">Surplus left in the sub</span>
            <span className="text-right font-semibold">
              {formatGBP(standalone.companyRetained)}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-yellow-300 bg-yellow-50/40 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-300">
              Stays in trading sub
            </div>
            <div className="mt-1 font-mono text-base font-semibold tabular-nums">
              {formatGBP(stayInTrading)}
            </div>
            <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">
              Continues to support the trade. Exposed to operational risk
              (claims, contracts, suppliers).
            </p>
          </div>
          <div className="rounded-lg border border-accent-300 bg-accent-50/40 p-4 dark:border-accent-700 dark:bg-accent-900/20">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
              Swept up to holdco (CT-free transfer)
            </div>
            <div className="mt-1 font-mono text-base font-semibold tabular-nums text-accent-700 dark:text-accent-300">
              {formatGBP(swept)}
            </div>
            <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">
              Available to reinvest, lend to a new sub, or hold for future
              extraction. Insulated from trading-sub claims.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-ink-200 p-4 text-xs dark:border-ink-700">
          <strong>Owner's position is unchanged.</strong>{' '}
          The owner still receives {formatGBP(standalone.ownerTotalNet)} this
          year and pays{' '}
          {formatGBP(standalone.totalTaxToHmrc)} of total tax — exactly as
          without a holdco. The structural win is where the surplus{' '}
          {formatGBP(standalone.companyRetained)}{' '}
          <em>sits</em>, not how it's taxed this year.
        </div>
      </div>
    </div>
  );
}

// ---------------- FIC ----------------

function FicSim() {
  const { state } = useAppState();
  const profile = state.personalProfile;
  const [capital, setCapital] = useState(500_000);
  const [growth, setGrowth] = useState(0.07);
  const [yieldRate, setYieldRate] = useState(0.02); // dividend / interest yield
  const [years, setYears] = useState(profile.yearsHorizon ?? 20);

  // Inside the FIC: each year's investment income is taxed.
  //   - UK dividend income to a UK company: typically exempt.
  //   - Interest / non-dividend income: taxed at CT rate.
  //   - Capital gains on disposal: taxed at CT rate (we treat unrealised
  //     gains as deferred, but show the eventual extraction tax separately).
  // For an illustrative comparison we treat the `yieldRate` as taxable yield
  // (interest / non-exempt dividends) and the rest as deferred capital
  // appreciation that the company could realise. Use small-profits CT rate
  // as the conservative drag on yield income.
  // Personal route: invest the same `capital` net of nothing (treat as
  // already-after-tax personal money for fairness). Yield is taxed as
  // dividend at higher rate; capital growth subject to CGT on realisation.

  // Simulate year-by-year. Both pots assume the same `growth` capital
  // appreciation rate and `yieldRate` cash yield reinvested.
  type Pot = { fic: number; personal: number };
  const path: Pot[] = useMemo(() => {
    const out: Pot[] = [];
    let fic = capital;
    let personal = capital;
    for (let i = 0; i < years; i++) {
      // Capital growth: same gross rate; treated as deferred (no annual tax
      // realisation in either wrapper for the in-place comparison).
      fic = fic * (1 + growth);
      personal = personal * (1 + growth);
      // Yield income: taxed annually. FIC pays CT on yield (small-profits
      // rate as the conservative case); personal pays higher-rate dividend
      // tax (33.75%) since most retail yield comes via dividends/interest at
      // higher-rate marginal.
      const ficYieldNet = fic * yieldRate * (1 - CT_SMALL_RATE);
      const personalYieldNet = personal * yieldRate * (1 - DIV_HIGHER);
      fic += ficYieldNet;
      personal += personalYieldNet;
      out.push({ fic, personal });
    }
    return out;
  }, [capital, growth, yieldRate, years]);

  const finalFic = path[path.length - 1]?.fic ?? capital;
  const finalPersonal = path[path.length - 1]?.personal ?? capital;

  // On extraction from the FIC: gains realised inside attract CT, then a
  // dividend out of the company attracts dividend tax. The personal route
  // pays CGT on its own gain. Show both net-of-eventual-extraction values
  // honestly so the FIC's apparent compounding lead is reality-checked.
  const ficGain = finalFic - capital;
  const ficCtOnGain = ficGain * CT_SMALL_RATE;
  const ficAfterCt = finalFic - ficCtOnGain;
  // Dividend the after-CT amount out: only the gain attracts dividend tax,
  // since the original capital can be repaid as a tax-free shareholder loan.
  const ficNetAfterDividend =
    capital + (ficAfterCt - capital) * (1 - DIV_HIGHER);
  // Personal: realise gain at CGT_HIGHER (24%).
  const personalGain = finalPersonal - capital;
  const personalAfterCgt = capital + personalGain * (1 - CGT_HIGHER);

  return (
    <div className="grid gap-4 px-4 py-4 md:grid-cols-[260px_minmax(0,1fr)]">
      <div className="space-y-3">
        <Slider
          label="Investable capital"
          value={capital}
          min={50_000}
          max={5_000_000}
          step={10_000}
          onChange={setCapital}
        />
        <Slider
          label="Capital growth %"
          value={growth}
          min={0}
          max={0.15}
          step={0.005}
          onChange={setGrowth}
          format={(v) => formatPct(v)}
        />
        <Slider
          label="Annual yield (interest / dividends)"
          value={yieldRate}
          min={0}
          max={0.08}
          step={0.005}
          onChange={setYieldRate}
          format={(v) => formatPct(v)}
        />
        <Slider
          label="Years"
          value={years}
          min={5}
          max={40}
          step={1}
          onChange={(v) => setYears(Math.round(v))}
          format={(v) => `${v} years`}
        />
        <p className="text-[11px] text-ink-500 dark:text-ink-400">
          Illustrative. Yield inside the FIC pays CT (small-profits rate);
          yield held personally pays 33.75% higher-rate dividend tax. Capital
          growth is treated as deferred until extraction, when CT + dividend
          tax (FIC) or CGT (personal) applies.
        </p>
      </div>
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card label="FIC pot before extraction" value={finalFic} tone="ok" />
          <Card
            label="Personal pot before extraction"
            value={finalPersonal}
            tone="warn"
          />
          <Card
            label="FIC net of CT + dividend on gain"
            value={ficNetAfterDividend}
            tone="ok"
          />
          <Card
            label={`Personal net of ${formatPct(CGT_HIGHER)} CGT on gain`}
            value={personalAfterCgt}
            tone="warn"
          />
        </div>

        <div className="rounded-lg border border-ink-200 p-4 text-xs dark:border-ink-700">
          <div className="font-semibold">After {years} years and extraction</div>
          <div className="mt-1 grid grid-cols-2 gap-y-1 font-mono tabular-nums">
            <span>FIC route net of all tax</span>
            <span className="text-right">{formatGBP(ficNetAfterDividend)}</span>
            <span>Personal route net of CGT</span>
            <span className="text-right">{formatGBP(personalAfterCgt)}</span>
            <span className="font-semibold">Difference</span>
            <span
              className={
                'text-right font-semibold ' +
                (ficNetAfterDividend > personalAfterCgt
                  ? 'text-accent-700 dark:text-accent-300'
                  : 'text-yellow-700 dark:text-yellow-300')
              }
            >
              {formatGBP(ficNetAfterDividend - personalAfterCgt)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-ink-500 dark:text-ink-400">
            FIC wins more clearly when (a) the time horizon is long, (b) the
            yield is high (CT drag &lt; dividend-tax drag), and (c) you
            don't have ISA / pension headroom personally. ISA-wrapped
            personal investing changes this picture significantly — model it
            against your real wrappers, not a generic personal route.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------- PSC ----------------

function PscSim() {
  const { state } = useAppState();
  const profile = state.personalProfile;
  const [contractValue, setContractValue] = useState(
    profile.annualRevenue ?? 120_000,
  );
  const [businessCosts, setBusinessCosts] = useState(profile.annualCosts ?? 5_000);
  const [pension, setPension] = useState(profile.pensionContribution ?? 0);

  // Outside-IR35: standard PSC extraction — PA salary + dividends to use up
  // remaining cash, optional pension. Use desiredCash = contractValue (i.e.
  // extract everything for the comparison) to make the contrast fair.
  const outside = ltdResult({
    revenue: contractValue,
    costs: businessCosts,
    ownerSalary: 12_570,
    desiredCash: contractValue, // try to extract as much as possible
    pensionContribution: pension,
  });

  // Inside-IR35: HMRC treats the income as salary (less the deemed-payment
  // allowance for pension and a 5% allowance pre-2017; post-2017 off-payroll
  // there's no 5%, but pensions still flow through). We approximate by
  // running the full contract value through the salary engine, less direct
  // business costs and pension (which can still be paid by the company
  // pre-tax under off-payroll rules).
  const insideSalary = Math.max(0, contractValue - businessCosts - pension);
  const insidePersonal = computeSalaryAndDividends(insideSalary, 0);
  // Inside-IR35 tax: employer NI is also charged (typically through the fee
  // payer or through the deemed payment calculation). We add it for honesty.
  const insideEmployerNi =
    Math.max(0, insideSalary - 5_000) * 0.15;
  const insideTotalTax =
    insidePersonal.itOnSalary +
    insidePersonal.employeeNI +
    insideEmployerNi;
  const insideNetToYou = insidePersonal.netSalary;

  const outsideAdvantage = outside.ownerTotalNet - insideNetToYou;

  return (
    <div className="grid gap-4 px-4 py-4 md:grid-cols-[260px_minmax(0,1fr)]">
      <div className="space-y-3">
        <Slider
          label="Contract value (annual)"
          value={contractValue}
          min={20_000}
          max={300_000}
          step={1_000}
          onChange={setContractValue}
        />
        <Slider
          label="Genuine business costs"
          value={businessCosts}
          min={0}
          max={Math.max(20_000, contractValue / 2)}
          step={500}
          onChange={setBusinessCosts}
          hint="Software, accounting, equipment, training — NOT your time."
        />
        <Slider
          label="Pension contribution"
          value={pension}
          min={0}
          max={60_000}
          step={500}
          onChange={setPension}
          hint="Deductible for the company in both regimes."
        />
        <p className="text-[11px] text-ink-500 dark:text-ink-400">
          Inside-IR35 means HMRC treats the engagement as employment for tax.
          The contract still runs through your Ltd but the tax treatment
          looks like salary. Status is determined by the client (medium /
          large) or by the PSC (small client).
        </p>
      </div>
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-accent-300 bg-accent-50/40 p-4 dark:border-accent-700 dark:bg-accent-900/20">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
              Outside IR35 (PSC operating normally)
            </div>
            <div className="mt-2 grid grid-cols-2 gap-y-0.5 text-xs font-mono tabular-nums">
              <span>Salary (PA)</span>
              <span className="text-right">{formatGBP(outside.ownerSalary)}</span>
              <span>Dividend declared</span>
              <span className="text-right">{formatGBP(outside.dividendDeclared)}</span>
              <span>Pension contribution</span>
              <span className="text-right">{formatGBP(outside.pensionContribution)}</span>
              <span>Total tax to HMRC</span>
              <span className="text-right text-danger-500">
                {formatGBP(outside.totalTaxToHmrc)}
              </span>
              <span className="font-semibold">Net to you</span>
              <span className="text-right font-semibold text-accent-700 dark:text-accent-300">
                {formatGBP(outside.ownerTotalNet)}
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-yellow-300 bg-yellow-50/40 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-300">
              Inside IR35 (taxed as employment)
            </div>
            <div className="mt-2 grid grid-cols-2 gap-y-0.5 text-xs font-mono tabular-nums">
              <span>Effective salary</span>
              <span className="text-right">{formatGBP(insideSalary)}</span>
              <span>Income tax</span>
              <span className="text-right text-danger-500">
                −{formatGBP(insidePersonal.itOnSalary)}
              </span>
              <span>Employee NI</span>
              <span className="text-right text-danger-500">
                −{formatGBP(insidePersonal.employeeNI)}
              </span>
              <span>Employer NI (illustrative)</span>
              <span className="text-right text-danger-500">
                −{formatGBP(insideEmployerNi)}
              </span>
              <span>Total tax to HMRC</span>
              <span className="text-right text-danger-500">
                {formatGBP(insideTotalTax)}
              </span>
              <span className="font-semibold">Net to you</span>
              <span className="text-right font-semibold text-yellow-700 dark:text-yellow-300">
                {formatGBP(insideNetToYou)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-ink-200 p-4 text-xs dark:border-ink-700">
          <strong>Outside-IR35 advantage:</strong>{' '}
          <span className="font-mono">{formatGBP(outsideAdvantage)}</span>{' '}
          more in your hand on the same contract value. The advantage is a
          combination of avoiding employer + employee NI on most of the
          income, and the lower dividend rate on the post-CT extraction.
        </div>
        <p className="text-[11px] text-ink-500 dark:text-ink-400">
          Illustrative only. Inside-IR35 actually has its own deemed-payment
          mechanics — this simulation collapses them into a salary
          equivalent for clarity. The direction is correct; precise figures
          for your situation should come from an IR35 specialist.
        </p>
      </div>
    </div>
  );
}

// ---------------- Shared building blocks ----------------

function Card({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'ok' | 'warn' | 'bad';
}) {
  const colour =
    tone === 'ok'
      ? 'text-accent-700 dark:text-accent-300'
      : tone === 'warn'
        ? 'text-yellow-700 dark:text-yellow-300'
        : tone === 'bad'
          ? 'text-danger-500'
          : 'text-ink-800 dark:text-ink-100';
  return (
    <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div className={`mt-1 font-mono text-base font-semibold tabular-nums ${colour}`}>
        {formatGBP(value)}
      </div>
    </div>
  );
}

