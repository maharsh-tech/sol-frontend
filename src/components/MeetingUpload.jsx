import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Play, BrainCircuit } from 'lucide-react';

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
      <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md w-fit mx-auto md:mx-0">
        {['audio', 'transcript'].map((m) => (
          <button
            key={m}
            id={`meeting-mode-${m}`}
            onClick={() => setMode(m)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === m
                ? 'bg-gradient-to-r from-primary/30 to-primary/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-white'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            {m === 'audio' ? (
              <span className="flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Upload Audio</span>
            ) : (
              <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Paste Transcript</span>
            )}
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
            className={`border border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 relative overflow-hidden group ${
              dragActive
                ? 'border-accent bg-accent/5 scale-[1.02] shadow-[0_0_30px_rgba(38,198,218,0.2)]'
                : 'border-white/20 hover:border-accent/50 hover:bg-white/[0.02]'
            }`}
          >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none ${dragActive ? 'bg-accent/20 opacity-100' : 'bg-primary/10 opacity-0 group-hover:opacity-100'}`}></div>
            <input
              ref={inputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.ogg,.webm"
              onChange={(e) => handleAudioFile(e.target.files[0])}
              className="hidden"
              id="meeting-audio-input"
            />
            <UploadCloud className={`w-14 h-14 mx-auto mb-4 relative z-10 transition-colors duration-300 ${dragActive ? 'text-accent' : 'text-text-secondary/50 group-hover:text-primary/70'}`} />
            <p className="text-text-secondary text-lg font-medium relative z-10">
              Drag & drop audio here, or <span className="text-accent underline decoration-accent/30 hover:decoration-accent transition-colors">browse</span>
            </p>
            <p className="text-text-secondary/50 text-sm mt-3 relative z-10 tracking-wide">.mp3, .wav, .m4a, .ogg, .webm — up to 25 MB</p>
          </div>

          {audioFile && (
            <div className="flex items-center justify-between glass-card rounded-2xl px-5 py-4 animate-[fadeIn_0.3s_ease-out]">
              <span className="text-text-primary text-sm font-medium truncate max-w-[80%] flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded-full"><Play className="w-4 h-4 text-accent" /></div> {audioFile.name}
              </span>
              <button
                onClick={() => setAudioFile(null)}
                className="text-error/70 hover:text-error transition-colors flex items-center justify-center p-2 rounded-full hover:bg-error/10 ml-3"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <textarea
          id="meeting-transcript-input"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here…&#10;&#10;Speaker 0: Let's discuss the Q3 goals.&#10;Speaker 1: We need to launch by Friday."
          rows={10}
          className="w-full bg-black/20 border border-white/10 rounded-3xl px-6 py-5 text-text-primary text-sm placeholder:text-text-secondary/40 resize-none focus:outline-none focus:border-accent/60 focus:bg-white/[0.02] focus:shadow-[0_0_20px_rgba(38,198,218,0.1)] transition-all duration-300 custom-scrollbar"
        />
      )}

      <button
        id="meeting-analyze-button"
        onClick={handleSubmit}
        disabled={!canSubmit || isLoading}
        className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_rgba(88,231,251,0.4)] active:scale-[0.98] border border-white/10 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-center">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Analysing Meeting…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <BrainCircuit className="w-5 h-5" /> Analyse Meeting
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
