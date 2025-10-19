import React, { useMemo, useState } from "react";

const BRAND = {
  bg: "#0E2F36",
  accent: "#65C1BE",
};

const LOGO_SRC =
  "https://statics.myclickfunnels.com/workspace/jVoldg/image/14111687/file/bff1fd96d2f765060f8eee9debb73da6.png";

function Logo() {
  return (
    <img
      src={LOGO_SRC}
      alt="Carrier Intelligence"
      className="h-16 w-auto rounded"
    />
  );
}

function Dollars({ v }: { v: number }) {
  const n = Number.isFinite(v) ? v : 0;
  return (
    <>
      {n.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })}
    </>
  );
}

function Stat({
  label,
  value,
  big = false,
}: {
  label: string;
  value: React.ReactNode;
  big?: boolean;
}) {
  return (
    <div className="card p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="text-white/60 text-xs mb-1">{label}</div>
      <div className={`text-white ${big ? "text-2xl" : "text-lg"} font-semibold`}>
        {value}
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  suffix,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm text-white/80 mb-1">{label}</div>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ "--accent": BRAND.accent } as React.CSSProperties}
        />
        {suffix ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm text-white/80 mb-1">{label}</div>
      <input
        type="text"
        value={value}
        placeholder={placeholder || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        style={{ "--accent": BRAND.accent } as React.CSSProperties}
      />
    </label>
  );
}

function num(s: string) {
  const x = parseFloat((s || "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(x) ? x : 0;
}
function usd(n: number) {
  return (Number.isFinite(n) ? n : 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function App() {
  // -------- Document header info --------
  const [companyName, setCompanyName] = useState("");
  const [representative, setRepresentative] = useState("");
  const [date, setDate] = useState("");

  // -------- Section 1: Current situation --------
  const [trucks, setTrucks] = useState("");
  const [emptyTrucks, setEmptyTrucks] = useState("");
  const [hiresPerMonth, setHiresPerMonth] = useState("");
  const [currentMarketingMonthly, setCurrentMarketingMonthly] = useState("");
  const [profitPerTruckPerMonth, setProfitPerTruckPerMonth] = useState("");

  // -------- Section 2: With CI --------
  const [plan, setPlan] = useState<"DFY" | "DWY">("DFY");
  const [dfyMonthly, setDfyMonthly] = useState("");
  const [dwyOneTime, setDwyOneTime] = useState("");
  const [ciAdMonthly, setCiAdMonthly] = useState("");
  const [driversNeededMonthly, setDriversNeededMonthly] = useState("");
  const [dwyAmortizationMonths, setDwyAmortizationMonths] = useState("12");

  // -------- Notes -------- (prefilled with one blank bullet)
  const [notes, setNotes] = useState("• ");

  // -------- Calculations (correct DFY/DWY math) --------
  const calc = useMemo(() => {
    const emptyN = num(emptyTrucks);
    const mktNow = num(currentMarketingMonthly);
    const profitPerMonth = num(profitPerTruckPerMonth);
    const dfyFee = num(dfyMonthly);
    const dwyFee = num(dwyOneTime);
    const adPerDriver = num(ciAdMonthly);
    const driversNeeded = num(driversNeededMonthly);
    const amortMonths = Math.max(1, num(dwyAmortizationMonths));

    // BEFORE
    const lostRevenueMonthly = emptyN * profitPerMonth;
    const currentMonthlyTotal = mktNow;
    const currentYearlyTotal = (currentMonthlyTotal + lostRevenueMonthly) * 12;

    // AFTER
    const monthlyPlanFee = plan === "DFY" ? dfyFee : dwyFee / amortMonths;
    const monthlyAdSpend = driversNeeded * adPerDriver;
    const withMonthlyCost = monthlyPlanFee + monthlyAdSpend;
    const withYearlyTotal =
      plan === "DFY"
        ? withMonthlyCost * 12
        : monthlyAdSpend * 12 + dwyFee; // DWY fee once

    // COMPARISON
    const currentMonthlyCost = currentYearlyTotal / 12;
    const monthlySavings = currentMonthlyCost - withMonthlyCost;
    const yearlySavings = currentYearlyTotal - withYearlyTotal;

    return {
      lostRevenueMonthly,
      currentMonthlyTotal,
      currentYearlyTotal,
      monthlyPlanFee,
      monthlyAdSpend,
      withMonthlyCost,
      withYearlyTotal,
      currentMonthlyCost,
      monthlySavings,
      yearlySavings,
    };
  }, [
    emptyTrucks,
    currentMarketingMonthly,
    profitPerTruckPerMonth,
    plan,
    dfyMonthly,
    dwyOneTime,
    ciAdMonthly,
    driversNeededMonthly,
    dwyAmortizationMonths,
  ]);

  // -------- Export PDF: print the actual page (dark theme) --------
  function exportPdf() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-[#0E2F36] text-white">
      {/* Print helpers: keep dark colors, stronger borders, avoid breaks */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 14mm; }
          .no-print { display: none !important; }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
          /* Ensure the body keeps the dark background when printing */
          body, html, #root { background: ${BRAND.bg} !important; }
          /* Slightly stronger card borders for print contrast */
          .card { border-color: rgba(255,255,255,0.25) !important; }
        }
      `}</style>

      <header className="sticky top-0 z-10" style={{ background: BRAND.bg }}>
        <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2">
            <button
              onClick={exportPdf}
              className="rounded-2xl px-3 py-2 font-semibold no-print"
              style={{ background: BRAND.accent, color: "#073339" }}
              title="Print or Save as PDF"
            >
              Print / Save PDF
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-white/10" />
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 space-y-8">
        {/* Document header */}
        <section className="card rounded-2xl bg-white/5 border border-white/10 shadow-sm p-5 avoid-break">
          <h2 className="mb-3 font-semibold text-lg text-white/90">
            Carrier Intelligence ROI Calculator
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <TextInput label="Company name" value={companyName} onChange={setCompanyName} />
            <TextInput label="Representative" value={representative} onChange={setRepresentative} />
            <TextInput label="Date" value={date} onChange={setDate} placeholder={new Date().toLocaleDateString()} />
          </div>
        </section>

        {/* Current */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="card rounded-2xl bg-white/5 border border-white/10 shadow-sm p-5 avoid-break">
            <h2 className="mb-3 font-semibold text-lg">Current situation</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberInput label="Number of trucks" value={trucks} onChange={setTrucks} />
              <NumberInput label="Empty trucks" value={emptyTrucks} onChange={setEmptyTrucks} />
              <NumberInput label="Average hires / mo." value={hiresPerMonth} onChange={setHiresPerMonth} />
              <NumberInput label="Profit / truck / mo." value={profitPerTruckPerMonth} onChange={setProfitPerTruckPerMonth} suffix="$" />
              <NumberInput label="Driver marketing / mo." value={currentMarketingMonthly} onChange={setCurrentMarketingMonthly} suffix="$" />
            </div>
            <div className="grid gap-3 mt-4 md:grid-cols-3">
              <Stat label="Spending / mo." value={<Dollars v={calc.currentMonthlyTotal} />} />
              <Stat label="Lost rev. / mo." value={<Dollars v={calc.lostRevenueMonthly} />} />
              <Stat label="Current cost / yr." value={<Dollars v={calc.currentYearlyTotal} />} />
            </div>
          </div>

          {/* With CI */}
          <div className="card rounded-2xl bg-white/5 border border-white/10 shadow-sm p-5 avoid-break">
            <h2 className="mb-3 font-semibold text-lg">Carrier Intelligence</h2>
            <div className="text-sm text-white/80 mb-1">Plan</div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                onClick={() => setPlan("DFY")}
                className={`rounded-2xl px-3 py-2 border ${
                  plan === "DFY" ? "bg-[#65C1BE] text-[#073339]" : "bg-white/5 text-white"
                }`}
              >
                DFY (Monthly)
              </button>
              <button
                onClick={() => setPlan("DWY")}
                className={`rounded-2xl px-3 py-2 border ${
                  plan === "DWY" ? "bg-[#65C1BE] text-[#073339]" : "bg-white/5 text-white"
                }`}
              >
                DWY (One-time)
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {plan === "DFY" ? (
                <NumberInput label="DFY monthly fee" value={dfyMonthly} onChange={setDfyMonthly} suffix="$" />
              ) : (
                <>
                  <NumberInput label="DWY one-time fee" value={dwyOneTime} onChange={setDwyOneTime} suffix="$" />
                  <NumberInput label="Amortize DWY over (months)" value={dwyAmortizationMonths} onChange={setDwyAmortizationMonths} />
                </>
              )}
              <NumberInput label="Avg drivers needed / mo." value={driversNeededMonthly} onChange={setDriversNeededMonthly} />
              <NumberInput label="Estimated ad spend / driver" value={ciAdMonthly} onChange={setCiAdMonthly} suffix="$" />
            </div>
            <div className="grid gap-3 mt-4 md:grid-cols-3">
              <Stat label="Plan cost / mo." value={<Dollars v={calc.monthlyPlanFee} />} />
              <Stat label="Ad spend / mo." value={<Dollars v={calc.monthlyAdSpend} />} />
              <Stat label="Cost / yr." value={<Dollars v={calc.withYearlyTotal} />} />
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section>
          <div className="card rounded-2xl bg-white/5 border border-white/10 shadow-sm p-5 avoid-break">
            <h2 className="mb-3 font-semibold text-lg">Comparison — Before vs After</h2>
            <div className="grid gap-3 md:grid-cols-4">
              <Stat label="Current cost / mo." value={<Dollars v={calc.currentMonthlyCost} />} />
              <Stat label="CI cost / mo." value={<Dollars v={calc.withMonthlyCost} />} />
              <Stat label="Savings / mo." value={<Dollars v={calc.monthlySavings} />} />
              <Stat label="Savings / yr." value={<Dollars v={calc.yearlySavings} />} />
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="card rounded-2xl bg-white/5 border border-white/10 shadow-sm p-5 avoid-break">
          <h2 className="mb-3 font-semibold text-lg">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes or assumptions here..."
            className="w-full min-h-[140px] resize-vertical rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ "--accent": BRAND.accent } as React.CSSProperties}
          />
        </section>
      </main>

      <footer className="py-8 border-t border-white/10 mt-10">
        <div className="mx-auto max-w-5xl px-4 text-white/50 text-xs">
          © {new Date().getFullYear()} Carrier Intelligence — ROI Calculator
        </div>
      </footer>
    </div>
  );
}
