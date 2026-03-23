import { useState, useEffect } from 'react';
import { Brain, Mic, MessageSquare, GitBranch } from 'lucide-react';
import FileUpload from './components/FileUpload';
import { PromptInputBox } from './components/ui/ai-prompt-box';
import AnswerCard from './components/AnswerCard';
import CitationList from './components/CitationList';
import MeetingUpload from './components/MeetingUpload';
import MeetingResults from './components/MeetingResults';
import { uploadDocuments, askQuestion } from './services/api';
import { analyzeMeeting, postMeetingToSlack } from './services/meetingApi';
import RepoSensePage from './pages/RepoSensePage';
import logoAsset from './assets/logo.jpeg';

export default function App() {
  const [activeTab, setActiveTab] = useState('knowledge'); // 'knowledge' | 'meeting' | 'reposense'

  // --- Knowledge Brain state ---
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [answerData, setAnswerData] = useState(null);
  const [kbError, setKbError] = useState('');

  // --- Meeting Intelligence state ---
  const [meetingData, setMeetingData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [meetingError, setMeetingError] = useState('');
  const [slackSuccess, setSlackSuccess] = useState('');

  // --- Load analysis results from Chrome extension (if any) ---
  useEffect(() => {
    function loadExtensionResult() {
      const stored = localStorage.getItem('askorg_extension_result');
      if (stored) {
        try {
          const result = JSON.parse(stored);
          setMeetingData(result);
          setActiveTab('meeting');
        } catch (e) {
          console.error('[AskOrg AI] Failed to parse extension result:', e);
        }
        localStorage.removeItem('askorg_extension_result');
      }
    }

    // Check on mount (in case localStorage was set before React loaded)
    loadExtensionResult();

    // Also listen for the custom event dispatched by the extension
    window.addEventListener('askorg-extension-result', loadExtensionResult);
    return () => window.removeEventListener('askorg-extension-result', loadExtensionResult);
  }, []);

  async function handleUpload(files) {
    setIsUploading(true);
    setKbError('');
    try {
      const result = await uploadDocuments(files);
      setUploadResult(result);
    } catch (err) {
      setKbError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAsk(message) {
    if (!message.trim()) return;
    setIsAsking(true);
    setKbError('');
    setAnswerData(null);
    try {
      const result = await askQuestion(message);
      setAnswerData(result);
    } catch (err) {
      setKbError(err.message || 'Failed to get an answer. Please try again.');
    } finally {
      setIsAsking(false);
    }
  }

  async function handleAnalyze({ audio, transcript }) {
    setIsAnalyzing(true);
    setMeetingError('');
    setMeetingData(null);
    setSlackSuccess('');
    try {
      const result = await analyzeMeeting({ audio, transcript });
      setMeetingData(result);
    } catch (err) {
      setMeetingError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handlePostToSlack() {
    if (!meetingData) return;
    setIsPosting(true);
    setSlackSuccess('');
    setMeetingError('');
    try {
      await postMeetingToSlack({
        summary: meetingData.summary,
        actionItems: meetingData.actionItems,
        keyDecisions: meetingData.keyDecisions,
      });
      setSlackSuccess('✅ Meeting analysis posted to Slack successfully!');
    } catch (err) {
      setMeetingError(err.message || 'Failed to post to Slack.');
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#0c0e10] overflow-hidden relative selection:bg-primary/30 text-text-primary font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] mix-blend-screen animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[150px] mix-blend-screen animate-blob-reverse pointer-events-none"></div>
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[120px] mix-blend-screen animate-blob-slow pointer-events-none transform translate-z-0"></div>

      {/* Floating Header */}
      <div className="px-6 pt-6 pb-2 z-20 flex-none w-full max-w-[1800px] mx-auto">
        <header className="glass-panel rounded-2xl h-16 w-full flex items-center justify-between px-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 w-32 md:w-36 h-8 relative overflow-hidden rounded">
            <img
              src={logoAsset}
              alt="AskOrg AI"
              className="absolute inset-0 w-full h-full object-cover object-center invert mix-blend-screen scale-[1.3] origin-center opacity-90"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center p-1 bg-black/40 rounded-xl border border-white/5 backdrop-blur-md">
            <button
              id="tab-knowledge"
              onClick={() => setActiveTab('knowledge')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'knowledge'
                  ? 'bg-gradient-to-r from-primary/20 to-primary/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-white'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <Brain className={`w-4 h-4 ${activeTab === 'knowledge' ? 'text-primary' : ''}`} /> Knowledge Brain
            </button>
            <button
              id="tab-meeting"
              onClick={() => setActiveTab('meeting')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'meeting'
                  ? 'bg-gradient-to-r from-accent/20 to-accent/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-white'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <Mic className={`w-4 h-4 ${activeTab === 'meeting' ? 'text-accent' : ''}`} /> Meeting Intelligence
            </button>
            <button
              id="tab-reposense"
              onClick={() => setActiveTab('reposense')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'reposense'
                  ? 'bg-gradient-to-r from-purple-500/20 to-purple-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-white'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <GitBranch className={`w-4 h-4 ${activeTab === 'reposense' ? 'text-purple-400' : ''}`} /> RepoSense
            </button>
          </div>

          <span className="text-sm font-medium text-text-secondary/70 hidden lg:block tracking-wide">
            Enterprise Intelligence Platform
          </span>
        </header>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto flex flex-col md:flex-row overflow-hidden pb-6 px-6 gap-6 z-10">
        
        {/* ── KNOWLEDGE BRAIN TAB ── */}
        {activeTab === 'knowledge' && (
          <>
            <div className="w-full md:w-[35%] glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl relative group transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <section>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" /> Upload Documents
                  </h2>
                  <FileUpload onUpload={handleUpload} isUploading={isUploading} />
                  {uploadResult && (
                    <div className="mt-6 bg-success/10 border border-success/20 rounded-2xl p-5 text-success text-sm backdrop-blur-md animate-[fadeIn_0.5s_ease-out]">
                      <span className="block font-semibold mb-1">✓ {uploadResult.message}</span>
                      <span className="opacity-80"><strong>{uploadResult.total_chunks}</strong> chunks indexed from {uploadResult.documents.join(', ')}</span>
                    </div>
                  )}
                </section>
              </div>
            </div>

            <div className="w-full md:w-[65%] glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-10">
                <section>
                  <h2 className="text-xl font-bold text-white mb-6">Ask a Question</h2>
                  <PromptInputBox
                    onSend={(message) => handleAsk(message)}
                    isLoading={isAsking}
                    placeholder="Ask anything about your documents..."
                  />
                </section>

                {kbError && (
                  <div className="bg-error/10 border border-error/20 rounded-2xl p-5 text-error text-sm backdrop-blur-md">
                    ⚠ {kbError}
                  </div>
                )}

                {answerData && (
                  <section className="space-y-6 animate-[fadeIn_0.5s_ease-out] relative">
                    <AnswerCard answer={answerData.answer} confidence={answerData.confidence} />
                    <CitationList citations={answerData.citations} />
                  </section>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── MEETING INTELLIGENCE TAB ── */}
        {activeTab === 'meeting' && (
          <>
            <div className="w-full md:w-[40%] glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl relative group transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                <section>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Mic className="w-5 h-5 text-accent" /> Meeting Intelligence
                  </h2>
                  <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                    Upload audio or paste a transcript to generate beautiful AI summaries, action items, and key decisions.
                  </p>
                  <MeetingUpload onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
                </section>
              </div>
            </div>

            <div className="w-full md:w-[60%] glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl relative transition-all duration-500">
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
                {meetingError && (
                  <div className="bg-error/10 border border-error/20 rounded-2xl p-5 text-error text-sm backdrop-blur-md">
                    ⚠ {meetingError}
                  </div>
                )}
                {slackSuccess && (
                  <div className="bg-success/10 border border-success/20 rounded-2xl p-5 text-success text-sm backdrop-blur-md">
                    {slackSuccess}
                  </div>
                )}
                {!meetingData && !meetingError && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-24 select-none">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full"></div>
                      <Mic className="w-16 h-16 text-text-secondary/40 relative z-10" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-3 tracking-tight">Awaiting Input</h3>
                    <p className="text-text-secondary text-base max-w-sm leading-relaxed">
                      Transform your meetings into structured, actionable insights instantly.
                    </p>
                  </div>
                )}
                {meetingData && (
                  <MeetingResults
                    data={meetingData}
                    onPostToSlack={handlePostToSlack}
                    isPosting={isPosting}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* ── REPOSENSE TAB ── */}
        {activeTab === 'reposense' && <RepoSensePage />}
      </main>
    </div>
  );
}
