import { useState } from 'react';
import FileUpload from './components/FileUpload';
import QuestionBox from './components/QuestionBox';
import AnswerCard from './components/AnswerCard';
import CitationList from './components/CitationList';
import { uploadDocuments, askQuestion } from './services/api';

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
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border/50 bg-surface/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Knowledge Brain</h1>
          <span className="text-xs text-text-secondary/50 ml-auto">CompanyOS</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Upload Section */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Upload Documents</h2>
          <FileUpload onUpload={handleUpload} isUploading={isUploading} />
          {uploadResult && (
            <div className="mt-4 bg-success/10 border border-success/30 rounded-xl px-5 py-3 text-success text-sm animate-[fadeIn_0.3s_ease-out]">
              ✓ {uploadResult.message} — <strong>{uploadResult.total_chunks}</strong> chunks indexed from{' '}
              {uploadResult.documents.join(', ')}
            </div>
          )}
        </section>

        {/* Question Section */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Ask a Question</h2>
          <QuestionBox onAsk={handleAsk} isLoading={isAsking} />
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
      </main>
    </div>
  );
}
