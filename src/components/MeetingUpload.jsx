import { useState, useRef } from 'react';

const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.ogg', '.webm'];

export default function MeetingUpload({ onAnalyze, isLoading }) {
  const [mode, setMode] = useState('audio'); // 'audio' | 'transcript'
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  function handleAudioFile(file) {
    if (!file) return;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!AUDIO_EXTENSIONS.includes(ext)) {
      alert('Please upload a valid audio file (.mp3, .wav, .m4a, .ogg, .webm)');
      return;
    }
    setAudioFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleAudioFile(e.dataTransfer.files[0]);
  }

  function handleSubmit() {
    if (mode === 'audio' && !audioFile) return;
    if (mode === 'transcript' && !transcript.trim()) return;
    onAnalyze({ audio: mode === 'audio' ? audioFile : null, transcript: mode === 'transcript' ? transcript : null });
  }

  const canSubmit = mode === 'audio' ? !!audioFile : !!transcript.trim();

  return (
    <div className="w-full space-y-5">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-surface-card rounded-xl border border-border/50 w-fit">
        {['audio', 'transcript'].map((m) => (
          <button
            key={m}
            id={`meeting-mode-${m}`}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === m
                ? 'bg-primary text-white shadow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {m === 'audio' ? '🎙️ Upload Audio' : '📝 Paste Transcript'}
          </button>
        ))}
      </div>

      {mode === 'audio' ? (
        <>
          <div
            id="meeting-dropzone"
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
              dragActive
                ? 'border-accent bg-surface-light/40 scale-[1.01]'
                : 'border-border hover:border-accent hover:bg-surface-light/20'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.ogg,.webm"
              onChange={(e) => handleAudioFile(e.target.files[0])}
              className="hidden"
              id="meeting-audio-input"
            />
            <div className="text-5xl mb-3 select-none">🎙️</div>
            <p className="text-text-secondary text-lg">
              Drag & drop audio here, or <span className="text-accent font-semibold underline">browse</span>
            </p>
            <p className="text-text-secondary/60 text-sm mt-2">.mp3, .wav, .m4a, .ogg, .webm — up to 25 MB</p>
          </div>

          {audioFile && (
            <div className="flex items-center justify-between bg-surface-card rounded-xl px-4 py-3 border border-border/50">
              <span className="text-text-primary text-sm truncate max-w-[80%]">🎵 {audioFile.name}</span>
              <button
                onClick={() => setAudioFile(null)}
                className="text-error hover:text-red-300 transition-colors text-lg font-bold ml-3"
                title="Remove"
              >
                ×
              </button>
            </div>
          )}
        </>
      ) : (
        <textarea
          id="meeting-transcript-input"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here…&#10;&#10;Example:&#10;Speaker 0: Let's discuss the Q3 goals.&#10;Speaker 1: We need to launch by Friday."
          rows={10}
          className="w-full bg-surface-card border border-border/50 rounded-2xl px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/50 resize-none focus:outline-none focus:border-accent transition-colors"
        />
      )}

      <button
        id="meeting-analyze-button"
        onClick={handleSubmit}
        disabled={!canSubmit || isLoading}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary-dark active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Analysing Meeting…
          </span>
        ) : (
          '✨ Analyse Meeting'
        )}
      </button>
    </div>
  );
}
