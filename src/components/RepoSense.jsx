import { useState } from 'react';
import { GitBranch, Lock, Loader2, CheckCircle2, AlertTriangle, Search, FileCode2, ChevronDown } from 'lucide-react';
import { analyzeRepo, askRepoQuestion } from '../services/api';
import { PromptInputBox } from './ui/ai-prompt-box';
import AnswerCard from './AnswerCard';
import CitationList from './CitationList';

export default function RepoSense() {
  const [repoUrl, setRepoUrl] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  // Analysis state
  const [status, setStatus] = useState('idle'); // idle | fetching | indexing | done | error
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Q&A state
  const [isAsking, setIsAsking] = useState(false);
  const [answerData, setAnswerData] = useState(null);
  const [qaError, setQaError] = useState('');

  async function handleAnalyze() {
    if (!repoUrl.trim()) return;
    setError('');
    setResult(null);
    setAnswerData(null);
    setQaError('');

    try {
      setStatus('fetching');
      setStatusMessage('Fetching repository structure from GitHub...');

      // Brief pause so user sees the first status
      await new Promise((r) => setTimeout(r, 400));
      setStatus('indexing');
      setStatusMessage('Indexing files into knowledge base...');

      const data = await analyzeRepo(repoUrl.trim(), token.trim());

      setResult(data);
      setStatus('done');
      setStatusMessage(`Indexed ${data.files_processed} files from ${data.repo}`);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to analyze repository.');
      setStatusMessage('');
    }
  }

  async function handleAsk(message) {
    if (!message.trim()) return;
    setIsAsking(true);
    setQaError('');
    setAnswerData(null);
    try {
      const data = await askRepoQuestion(message, result.repo);
      setAnswerData(data);
    } catch (err) {
      setQaError(err.message || 'Failed to get an answer.');
    } finally {
      setIsAsking(false);
    }
  }

  const isLoading = status === 'fetching' || status === 'indexing';

  return (
    <div className="space-y-6 w-full">

      {/* Repo URL Input */}
      <div className="space-y-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <GitBranch className="w-5 h-5 text-text-secondary/50 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            id="repo-url-input"
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 disabled:opacity-50 text-[15px] font-medium"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) handleAnalyze();
            }}
          />
        </div>

        {/* Collapsible Token Section */}
        <button
          onClick={() => setShowToken(!showToken)}
          className="flex items-center gap-2 text-text-secondary/60 hover:text-text-secondary text-sm transition-colors"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Private repo? Add token</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showToken ? 'rotate-180' : ''}`} />
        </button>

        {showToken && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <input
              id="repo-token-input"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxx... (Personal Access Token)"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50 text-sm font-mono"
            />
            <p className="text-text-secondary/40 text-xs mt-2 leading-relaxed">
              Go to <span className="text-primary/70">GitHub → Settings → Developer settings → Personal access tokens → Generate new token</span> with <code className="bg-white/5 px-1.5 py-0.5 rounded text-primary/70">repo</code> scope.
            </p>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        id="repo-analyze-button"
        onClick={handleAnalyze}
        disabled={!repoUrl.trim() || isLoading}
        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-purple-600 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-[0.98] border border-white/10 relative overflow-hidden group shadow-lg"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        {isLoading ? (
          <span className="flex items-center gap-2 relative z-10">
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center gap-2 relative z-10">
            <Search className="w-5 h-5" />
            Analyze Repository
          </span>
        )}
      </button>

      {/* Status Messages */}
      {isLoading && statusMessage && (
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/15 rounded-2xl animate-[fadeIn_0.3s_ease-out]">
          <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
          <span className="text-primary/80 text-sm font-medium">{statusMessage}</span>
        </div>
      )}

      {/* Success Card */}
      {status === 'done' && result && (
        <div className="p-5 bg-success/10 border border-success/20 rounded-2xl animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-success font-bold text-base">{statusMessage}</p>
              <div className="flex flex-wrap gap-3 text-sm text-text-secondary/70">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" />
                  <strong className="text-white">{result.files_processed}</strong> files indexed
                </span>
                <span>•</span>
                <span>
                  <strong className="text-white">{result.chunks_stored}</strong> chunks stored
                </span>
              </div>
              <p className="text-text-secondary/50 text-sm mt-1">
                Ask questions below — answers will cite specific file paths.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Card */}
      {status === 'error' && error && (
        <div className="p-5 bg-error/10 border border-error/20 rounded-2xl animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <p className="text-error font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Q&A Section — visible after successful indexing */}
      {status === 'done' && (
        <div className="space-y-6 pt-4 border-t border-white/5 animate-[fadeIn_0.5s_ease-out]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> Ask about this codebase
          </h3>
          <PromptInputBox
            onSend={handleAsk}
            isLoading={isAsking}
            placeholder="What does this project do? How is the API structured?"
          />

          {qaError && (
            <div className="bg-error/10 border border-error/20 rounded-2xl p-4 text-error text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{qaError}</span>
            </div>
          )}

          {answerData && (
            <div className="space-y-5 animate-[fadeIn_0.4s_ease-out]">
              <AnswerCard answer={answerData.answer} confidence={answerData.confidence} />
              <CitationList citations={answerData.citations} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
