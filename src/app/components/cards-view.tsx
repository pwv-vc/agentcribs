export interface CardPick {
  id: string;
  name: string;
  blurb: string;
  why: string;
  hooks: string[];
}

export interface CardData {
  cardholder: {
    id: string;
    name: string;
    tagline: string;
  };
  picks: CardPick[];
}

function parseCardData(content: string): CardData | null {
  try {
    return JSON.parse(content) as CardData;
  } catch {
    return null;
  }
}

export function CardsView({ content }: { content: string }) {
  const card = parseCardData(content);

  if (!card) {
    return (
      <pre className="text-sm font-mono text-text overflow-auto whitespace-pre-wrap">
        {content}
      </pre>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="label-text mb-4">Cardholder</h2>
        <div className="rounded-xl border border-border bg-bg-soft p-5">
          <h3 className="font-serif text-xl font-bold text-text">
            {card.cardholder.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {card.cardholder.tagline}
          </p>
          <p className="mt-3 font-mono text-xs text-text-secondary">
            {card.cardholder.id}
          </p>
        </div>
      </section>

      <section>
        <h2 className="label-text mb-4">Picks</h2>
        <div className="space-y-3">
          {card.picks.map((pick) => (
            <div
              key={pick.id}
              className="rounded-xl border border-border bg-bg-soft p-5"
            >
              <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                <h3 className="font-serif text-lg font-bold text-text">
                  {pick.name}
                </h3>
                {pick.blurb && (
                  <span className="font-mono text-xs text-accent">
                    {pick.blurb}
                  </span>
                )}
              </div>

              {pick.why && (
                <div className="mt-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                    Why
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {pick.why}
                  </p>
                </div>
              )}

              {pick.hooks && pick.hooks.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                    Hooks
                  </span>
                  <ul className="mt-1 space-y-1">
                    {pick.hooks.map((hook, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <span className="mt-1.5 shrink-0 size-1.5 rounded-full bg-accent" />
                        {hook}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
