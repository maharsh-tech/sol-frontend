import { BarChart2, Target, CheckCircle2, FileText, MessageSquare, User, Calendar, Tag } from "lucide-react";

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
      <section className="glass-card rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl"><BarChart2 className="w-5 h-5 text-primary" /></div> Meeting Summary
        </h3>
        <p className="text-text-secondary text-base leading-relaxed relative z-10">{summary}</p>
      </section>

      {/* Action Items */}
      {actionItems.length > 0 && (
        <section className="glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-accent/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-accent/20 transition-colors duration-700"></div>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
            <div className="bg-accent/20 p-2 rounded-xl"><Target className="w-5 h-5 text-accent" /></div> Action Items
            <span className="ml-auto text-sm bg-accent/20 text-accent border border-accent/30 rounded-full px-3 py-1 font-semibold shadow-[0_0_10px_rgba(38,198,218,0.2)]">
              {actionItems.length}
            </span>
          </h3>
          <div className="space-y-4 relative z-10">
            {actionItems.map((item, i) => (
              <div
                key={i}
                id={`action-item-${i}`}
                className="flex flex-col gap-2 bg-black/20 hover:bg-white/[0.04] transition-colors rounded-2xl px-5 py-4 border border-white/5"
              >
                <span className="text-white text-base font-medium tracking-tight">{item.task}</span>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-text-secondary text-xs flex items-center gap-1"><User className="w-3 h-3" /> {item.owner || 'Unassigned'}</span>
                  <span className="text-text-secondary text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.deadline || 'Not specified'}</span>
                  <span
                    className={`text-xs flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full border ${
                      PRIORITY_COLORS[item.priority] || PRIORITY_COLORS['Medium']
                    }`}
                  >
                    <Tag className="w-3 h-3" /> {item.priority || 'Medium'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Decisions */}
      {keyDecisions.length > 0 && (
        <section className="glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 bg-success/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-success/20 transition-colors duration-700"></div>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
            <div className="bg-success/20 p-2 rounded-xl"><CheckCircle2 className="w-5 h-5 text-success" /></div> Key Decisions
          </h3>
          <ul className="space-y-3 relative z-10">
            {keyDecisions.map((decision, i) => (
              <li key={i} className="flex items-start gap-4 text-text-secondary text-base bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                <div className="bg-success/20 p-1 rounded-full shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                {decision}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Transcript (collapsible) */}
      {transcript && (
        <details className="glass-card rounded-3xl p-8 group transition-all duration-300">
          <summary className="text-xl font-bold text-white cursor-pointer select-none flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl group-open:bg-primary/20 transition-colors"><FileText className="w-5 h-5 text-text-secondary group-open:text-primary transition-colors" /></div> Full Transcript
            <span className="ml-auto text-text-secondary/60 text-sm flex items-center gap-1 group-open:hidden uppercase tracking-wider font-semibold">Show</span>
            <span className="ml-auto text-text-secondary/60 text-sm hidden items-center gap-1 group-open:flex uppercase tracking-wider font-semibold">Hide</span>
          </summary>
          <div className="mt-6 pt-6 border-t border-white/10">
            <pre className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap font-mono overflow-auto max-h-96 custom-scrollbar pr-4">
              {transcript}
            </pre>
          </div>
        </details>
      )}

      {/* Post to Slack */}
      <button
        id="meeting-slack-button"
        onClick={onPostToSlack}
        disabled={isPosting}
        className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#4A154B] to-[#611f64] hover:shadow-[0_0_20px_rgba(74,21,75,0.4)] active:scale-[0.98] border border-white/10 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-center">
          {isPosting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Posting to Slack…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" /> Post to Slack
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
