import { useState } from 'react';
import FileUpload from './components/FileUpload';
import { PromptInputBox } from './components/ui/ai-prompt-box';
import AnswerCard from './components/AnswerCard';
import CitationList from './components/CitationList';
import { uploadDocuments, askQuestion } from './services/api';
import logoAsset from './assets/logo.jpeg';

export default function App() {
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [answerData, setAnswerData] = useState(null);
  const [error, setError] = useState('');

  async function handleUpload(files) {
    setIsUploading(true);
    setError('');
    try {
      const result = await uploadDocuments(files);
      setUploadResult(result);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAsk(question) {
    setIsAsking(true);
    setError('');
    setAnswerData(null);
    try {
      const result = await askQuestion(question);
      setAnswerData(result);
    } catch (err) {
      setError(err.message || 'Failed to get an answer. Please try again.');
    } finally {
      setIsAsking(false);
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
        <span className="text-sm text-[#9CA3AF] hidden sm:block">
          Enterprise Assistant for Document Retrieval & Meeting Intelligence
        </span>
      </header>

      {/* Main Layout (Below Navbar) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#16181A]">
        {/* Left Column: Upload (35%) */}
        <div className="w-full md:w-[35%] flex flex-col border-b md:border-b-0 md:border-r border-[#2A2D31] bg-[#16181A] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <section>
              <h2 className="text-lg font-semibold text-white mb-6">Upload Documents</h2>
              <FileUpload onUpload={handleUpload} isUploading={isUploading} />
              {uploadResult && (
                <div className="mt-4 bg-success/10 border border-success/30 rounded-xl px-5 py-3 text-success text-sm animate-[fadeIn_0.3s_ease-out]">
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

            {/* Error */}
            {error && (
              <div className="bg-error/10 border border-error/30 rounded-xl px-5 py-3 text-error text-sm animate-[fadeIn_0.3s_ease-out]">
                ⚠ {error}
              </div>
            )}

            {/* Answer */}
            {answerData && (
              <section className="space-y-5 animate-[fadeIn_0.4s_ease-out]">
                <AnswerCard answer={answerData.answer} confidence={answerData.confidence} />
                <CitationList citations={answerData.citations} />
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
