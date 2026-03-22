const PRIORITY_COLORS = {
  High: 'bg-red-500/20 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function MeetingResults({ data, onPostToSlack, isPosting }) {
  if (!data) return null;
  const { summary, actionItems = [], keyDecisions = [], transcript } = data;

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">

      {/* Summary Card */}
      <section className="bg-surface-card border border-border/50 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
          <span>📊</span> Meeting Summary
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">{summary}</p>
      </section>

      {/* Action Items */}
      {actionItems.length > 0 && (
        <section className="bg-surface-card border border-border/50 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span>✅</span> Action Items
            <span className="ml-auto text-xs bg-accent/20 text-accent border border-accent/30 rounded-full px-2 py-0.5">
              {actionItems.length}
            </span>
          </h3>
          <div className="space-y-3">
            {actionItems.map((item, i) => (
              <div
                key={i}
                id={`action-item-${i}`}
                className="flex flex-col gap-1 bg-surface/60 rounded-xl px-4 py-3 border border-border/40"
              >
                <span className="text-text-primary text-sm font-medium">{item.task}</span>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="text-text-secondary text-xs">👤 {item.owner || 'Unassigned'}</span>
                  <span className="text-text-secondary text-xs">🗓️ {item.deadline || 'Not specified'}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      PRIORITY_COLORS[item.priority] || PRIORITY_COLORS['Medium']
                    }`}
                  >
                    {item.priority || 'Medium'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Decisions */}
      {keyDecisions.length > 0 && (
        <section className="bg-surface-card border border-border/50 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span>⚖️</span> Key Decisions
          </h3>
          <ul className="space-y-2">
            {keyDecisions.map((decision, i) => (
              <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                <span className="text-success mt-0.5 shrink-0">✔</span>
                {decision}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Transcript (collapsible) */}
      {transcript && (
        <details className="bg-surface-card border border-border/50 rounded-2xl p-6 group">
          <summary className="text-base font-semibold text-text-primary cursor-pointer select-none flex items-center gap-2">
            <span>📝</span> Full Transcript
            <span className="ml-auto text-text-secondary/60 text-xs group-open:hidden">Show</span>
            <span className="ml-auto text-text-secondary/60 text-xs hidden group-open:inline">Hide</span>
          </summary>
          <pre className="mt-4 text-text-secondary text-xs leading-relaxed whitespace-pre-wrap font-mono overflow-auto max-h-64">
            {transcript}
          </pre>
        </details>
      )}

      {/* Post to Slack */}
      <button
        id="meeting-slack-button"
        onClick={onPostToSlack}
        disabled={isPosting}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#4A154B] hover:bg-[#611f64] active:scale-[0.98]"
      >
        {isPosting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Posting to Slack…
          </span>
        ) : (
          '💬 Post to Slack'
        )}
      </button>
    </div>
  );
}
