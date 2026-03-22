import { BarChart2, Target, CheckCircle2, FileText, MessageSquare, User, Calendar, Sparkles, Gavel } from "lucide-react";

const PRIORITY_COLORS = {
  High: 'bg-red-500/10 text-red-400 border-red-500/20',
  Medium: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function MeetingResults({ data, onPostToSlack, isPosting }) {
  if (!data) return null;
  const { summary, actionItems = [], keyDecisions = [], transcript } = data;

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] w-full max-w-7xl mx-auto space-y-8">
      
      {/* Header Actions (Post to Slack) */}
      <div className="flex justify-end">
        <button
          id="meeting-slack-button"
          onClick={onPostToSlack}
          disabled={isPosting}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#4A154B] to-[#611f64] hover:shadow-[0_0_20px_rgba(74,21,75,0.4)] active:scale-[0.98] border border-white/10 relative overflow-hidden group shadow-lg"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          {isPosting ? (
            <span className="flex items-center justify-center gap-2 relative z-10">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Posting...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 relative z-10">
              <MessageSquare className="w-4 h-4" /> Post to Slack
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary & Decisions */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* Executive Summary Card */}
          <section className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Sparkles className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Executive Summary</h2>
            </div>
            <div className="text-text-secondary text-base md:text-lg leading-relaxed relative z-10 font-medium whitespace-pre-line">
              {summary}
            </div>
          </section>

          {/* Key Decisions */}
          {keyDecisions.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-emerald-400" /> Key Decisions
                </h2>
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                  {keyDecisions.length} Resolved
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {keyDecisions.map((decision, i) => (
                  <div key={i} className="glass-card p-6 rounded-2xl border-l-[3px] border-emerald-500/80 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-start gap-4 relative z-10">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-sm font-semibold text-text-secondary leading-relaxed">{decision}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Action Items & Transcript */}
        <div className="xl:col-span-5 space-y-8">
          
          {/* Action Items */}
          {actionItems.length > 0 && (
            <section className="glass-panel rounded-3xl p-8 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" /> Action Items
                </h2>
              </div>
              <div className="space-y-4">
                {actionItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-3 p-5 bg-black/40 rounded-2xl hover:bg-white/[0.02] hover:ring-1 hover:ring-accent/30 transition-all border border-white/5 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-white text-[15px] font-bold tracking-wide leading-snug">{item.task}</span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border shrink-0 mt-0.5 ${PRIORITY_COLORS[item.priority] || PRIORITY_COLORS['Medium']}`}>
                        {item.priority || 'Medium'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-text-secondary/70">
                      <span className="text-[13px] flex items-center gap-1.5 font-semibold"><User className="w-3.5 h-3.5" /> {item.owner || 'Unassigned'}</span>
                      <span className="text-[13px] flex items-center gap-1.5 font-semibold"><Calendar className="w-3.5 h-3.5" /> {item.deadline || 'TBD'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Transcript */}
          {transcript && (
            <details className="glass-panel rounded-3xl p-8 border border-white/5 group transition-all duration-300">
              <summary className="text-xl font-bold text-white cursor-pointer select-none flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" /> Full Transcript
                <span className="ml-auto text-text-secondary/50 text-[10px] uppercase font-black tracking-widest group-open:hidden border border-white/10 px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-white/5 transition-colors">Expand</span>
                <span className="ml-auto text-text-secondary/50 text-[10px] uppercase font-black tracking-widest hidden group-open:block border border-white/10 px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-white/5 transition-colors">Collapse</span>
              </summary>
              <div className="mt-8 pt-6 border-t border-white/5">
                <pre className="text-text-secondary/80 text-[13px] leading-relaxed whitespace-pre-wrap font-mono overflow-auto max-h-[500px] custom-scrollbar pr-4 pb-2">
                  {transcript}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
