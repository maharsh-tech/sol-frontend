export default function AnswerCard({ answer, confidence }) {
  const badgeColors = {
    high: 'bg-success/20 text-success',
    medium: 'bg-yellow-400/20 text-yellow-300',
    low: 'bg-error/20 text-error',
  };

  return (
    <div
      id="answer-card"
      className="w-full bg-surface-card border border-border/50 rounded-2xl p-6 animate-[fadeIn_0.4s_ease-out]"
    >
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Answer</h3>
        {confidence && (
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${badgeColors[confidence] || badgeColors.low}`}
          >
            {confidence} confidence
          </span>
        )}
      </div>
      <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{answer}</p>
    </div>
  );
}
