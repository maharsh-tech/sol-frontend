import RepoSense from '../components/RepoSense';
import { GitBranch, Search, Layers, Rocket, Database, Lock, Network } from 'lucide-react';

/**
 * Standalone RepoSense page layout.
 * Can be used as a routed page or embedded in App.jsx.
 */
export default function RepoSensePage() {
  return (
    <div className="w-full flex flex-col md:flex-row h-full gap-6">
      {/* Left Panel — Repo Input & Analysis */}
      <div className="w-full md:w-[40%] glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl relative group transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" /> RepoSense
            </h2>
            <p className="text-text-secondary text-sm mb-8 leading-relaxed">
              Paste any GitHub repository URL to analyze its codebase. Ask questions in natural language and get answers with file path citations.
            </p>
            <RepoSense />
          </section>
        </div>
      </div>

      {/* Right Panel — Info / Instructions */}
      <div className="w-full md:w-[60%] glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl relative transition-all duration-500">
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
          <div className="flex flex-col items-center justify-center h-full text-center py-16 select-none">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"></div>
              <GitBranch className="w-20 h-20 text-text-secondary/30 relative z-10" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-4 tracking-tight">
              Explore Any Codebase
            </h3>
            <p className="text-text-secondary text-base max-w-md leading-relaxed mb-10">
              Index a GitHub repository and ask questions about its architecture, API endpoints, setup instructions, and more.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full text-left">
              {[
                { q: 'What does this project do?', Icon: Search },
                { q: 'How is the API structured?', Icon: Layers },
                { q: 'How do I set up and run this?', Icon: Rocket },
                { q: 'What database does it use?', Icon: Database },
                { q: 'How does auth work?', Icon: Lock },
                { q: 'What are all the endpoints?', Icon: Network },
              ].map(({ q, Icon }) => (
                <div
                  key={q}
                  className="flex items-start gap-3 p-4 bg-black/30 rounded-xl border border-white/5 hover:border-primary/20 hover:bg-white/[0.02] transition-all"
                >
                  <Icon className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
                  <span className="text-text-secondary text-sm font-medium leading-snug">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
