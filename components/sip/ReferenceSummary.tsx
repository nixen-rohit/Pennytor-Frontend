import { formatINR, POSTER_PLAN, simulateSip, simulateSwp } from "@/utils/sip-calculations";

export function ReferenceSummary() {
  const sip = simulateSip(POSTER_PLAN.sip);
  const swp = simulateSwp(sip.corpusAtEnd, POSTER_PLAN.swp);

  return (
    <section className="container -mt-10 sm:-mt-12">
      <div className="overflow-hidden rounded-lg border border-sip-paper-line bg-card shadow-sm">
        <div className="border-b border-dashed border-sip-paper-line bg-sip-navy/[0.03] px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-sip-navy">
            The plan, as printed
          </h2>
          <p className="text-sm text-muted-foreground">
            Rs.5,000/month SIP for 10 years at 22% p.a., then Rs.50,000/month
            withdrawn for the next 10 years.
          </p>
        </div>

        <div className="grid divide-y divide-sip-paper-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {/* Act 1: grow */}
          <div className="p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-sip-sapling-deep">
              Years 1&ndash;10 &middot; Grow
            </p>
            <dl className="space-y-2 font-mono text-sm tabular">
              <Row label="Monthly SIP" value="Rs.5,000/-" />
              <Row label="Total invested" value={formatINR(sip.investedAmount)} />
              <Row
                label="Corpus at year 10"
                value={formatINR(sip.corpusAtEnd)}
                emphasize
              />
            </dl>
          </div>

          {/* Act 2: harvest */}
          <div className="p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-sip-harvest-deep">
              Years 11&ndash;20 &middot; Harvest
            </p>
            <dl className="space-y-2 font-mono text-sm tabular">
              <Row label="Monthly withdrawal" value="Rs.50,000/-" />
              <Row label="Total withdrawn" value="Rs.60,00,000/- (sixty lakhs)" />
              <Row
                label="Left at year 20"
                value={formatINR(swp.finalBalance)}
                emphasize
              />
            </dl>
          </div>
        </div>

        <p className="border-t border-sip-paper-line px-6 py-3 text-[11px] text-muted-foreground">
          The poster quotes a final balance of about Rs.11,17,000. Running
          the same 22% return through both the growth and withdrawal phases
          actually exhausts the corpus around year {swp.depletedAtYear ?? "17"}.
          To land near the poster&rsquo;s number, the withdrawal-phase return
          needs to stay closer to 26&ndash;27% p.a. &mdash; use the calculator
          below to see how sensitive the outcome is to that assumption.
        </p>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={emphasize ? "font-semibold text-sip-navy" : ""}>{value}</dd>
    </div>
  );
}
