import { useState } from 'react';
import FileUpload from './components/FileUpload';
import { PromptInputBox } from './components/ui/ai-prompt-box';
import AnswerCard from './components/AnswerCard';
import CitationList from './components/CitationList';
import MeetingUpload from './components/MeetingUpload';
import MeetingResults from './components/MeetingResults';
import { uploadDocuments, askQuestion } from './services/api';
import { analyzeMeeting, postMeetingToSlack } from './services/meetingApi';
import logoAsset from './assets/logo.jpeg';

export default function App() {
  const [activeTab, setActiveTab] = useState('knowledge'); // 'knowledge' | 'meeting'

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
    <div className="h-screen flex flex-col bg-[#16181A] overflow-hidden">
      {/* Navbar (Top - Fixed) */}
      <header className="h-14 flex-none border-b border-[#2A2D31] bg-[#1F2023] w-full flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3 w-32 md:w-40 h-8 md:h-10 relative overflow-hidden rounded">
          <img
            src={logoAsset}
            alt="AskOrg AI"
            className="absolute inset-0 w-full h-full object-cover object-center invert mix-blend-screen scale-[1.3] origin-center"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1">
          <button
            id="tab-knowledge"
            onClick={() => setActiveTab('knowledge')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'knowledge'
                ? 'bg-white/10 text-white'
                : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
            }`}
          >
            🧠 Knowledge Brain
          </button>
          <button
            id="tab-meeting"
            onClick={() => setActiveTab('meeting')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'meeting'
                ? 'bg-white/10 text-white'
                : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
            }`}
          >
            🎙️ Meeting Intelligence
          </button>
        </div>

        <span className="text-sm text-[#9CA3AF] hidden sm:block">
          Enterprise Assistant for Document Retrieval &amp; Meeting Intelligence
        </span>
      </header>

      {/* ── KNOWLEDGE BRAIN TAB ── */}
      {activeTab === 'knowledge' && (
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#16181A]">
          {/* Left Column: Upload (35%) */}
          <div className="w-full md:w-[35%] flex flex-col border-b md:border-b-0 md:border-r border-[#2A2D31] bg-[#16181A] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <section>
                <h2 className="text-lg font-semibold text-white mb-6">Upload Documents</h2>
                <FileUpload onUpload={handleUpload} isUploading={isUploading} />
                {uploadResult && (
                  <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 text-green-400 text-sm">
                    ✓ {uploadResult.message} — <strong>{uploadResult.total_chunks}</strong> chunks indexed from{' '}
                    {uploadResult.documents.join(', ')}
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Right Column: Q&A (65%) */}
          <div className="w-full md:w-[65%] flex flex-col bg-[#1F2023] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
              <section>
                <h2 className="text-lg font-semibold text-white mb-6">Ask a Question</h2>
                <PromptInputBox
                  onSend={(message) => handleAsk(message)}
                  isLoading={isAsking}
                  placeholder="Ask anything about your documents..."
                />
              </section>

              {kbError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-400 text-sm">
                  ⚠ {kbError}
                </div>
              )}

              {answerData && (
                <section className="space-y-5">
                  <AnswerCard answer={answerData.answer} confidence={answerData.confidence} />
                  <CitationList citations={answerData.citations} />
                </section>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ── MEETING INTELLIGENCE TAB ── */}
      {activeTab === 'meeting' && (
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#16181A]">
          {/* Left Column: Audio/Transcript Input (40%) */}
          <div className="w-full md:w-[40%] flex flex-col border-b md:border-b-0 md:border-r border-[#2A2D31] bg-[#16181A] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <section>
                <h2 className="text-lg font-semibold text-white mb-2">Meeting Intelligence</h2>
                <p className="text-[#9CA3AF] text-sm mb-6">
                  Upload a recording or paste a transcript. AI will transcribe, summarise, and extract action items &amp; decisions.
                </p>
                <MeetingUpload onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
              </section>
            </div>
          </div>

          {/* Right Column: Results (60%) */}
          <div className="w-full md:w-[60%] flex flex-col bg-[#1F2023] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
              {meetingError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-400 text-sm">
                  ⚠ {meetingError}
                </div>
              )}
              {slackSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 text-green-400 text-sm">
                  {slackSuccess}
                </div>
              )}
              {!meetingData && !meetingError && (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="text-5xl mb-4">🎙️</div>
                  <h3 className="text-white font-semibold text-lg mb-2">No analysis yet</h3>
                  <p className="text-[#9CA3AF] text-sm max-w-xs">
                    Upload audio or paste a transcript on the left to get AI-powered meeting insights.
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
        </main>
      )}
    </div>
  );
}
