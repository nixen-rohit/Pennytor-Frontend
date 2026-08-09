export function FdHero() {
  return (
    <section className="relative overflow-hidden bg-fd-vault text-fd-paper">
      
      <div className="container relative flex flex-col items-center gap-6 py-16 text-center sm:py-20">
        
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-fd-gold">
            Locked-in principal &middot; metered payout
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Fixed Deposit
          </h1>
          <p className="font-display text-lg text-fd-gold sm:text-xl">(With SWP)</p>
          <p className="mx-auto max-w-xl text-balance text-sm text-fd-paper/80 sm:text-base">
            A lump sum, locked in, paid back out on a fixed schedule. See
            the three printed plans, then check what rate any payout
            actually implies.
          </p>
        </div>
      </div>
    </section>
  );
}

 