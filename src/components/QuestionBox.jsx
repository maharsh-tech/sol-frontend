import { useState } from 'react';

export default function QuestionBox({ onAsk, isLoading }) {
  const [question, setQuestion] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onAsk(question.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3">
        <input
          id="question-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your documents…"
          className="flex-1 bg-surface-card border border-border rounded-xl px-5 py-3.5 text-text-primary placeholder:text-text-secondary/50 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all text-base"
        />
        <button
          id="ask-button"
          type="submit"
          disabled={isLoading || !question.trim()}
          className="px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary-dark active:scale-[0.97]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Thinking…
            </span>
          ) : (
            'Ask'
          )}
        </button>
      </div>
    </form>
  );
}
