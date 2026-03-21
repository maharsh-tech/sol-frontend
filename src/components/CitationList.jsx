export default function CitationList({ citations }) {
  if (!citations || citations.length === 0) return null;

  return (
    <div id="citation-list" className="w-full">
      <h4 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">Sources</h4>
      <div className="space-y-2">
        {citations.map((cite, i) => (
          <div
            key={i}
            className="bg-surface-light/30 border border-border/40 rounded-xl px-5 py-4 transition-colors hover:bg-surface-light/50"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-accent font-semibold text-sm">{cite.document_name}</span>
              <span className="text-text-secondary/60 text-xs">— Page/Sheet {cite.page}</span>
            </div>
            <p className="text-text-secondary/80 text-sm leading-relaxed line-clamp-3">"{cite.snippet}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
