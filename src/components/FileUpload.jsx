import { useState, useRef } from 'react';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.xlsx', '.pptx'];

export default function FileUpload({ onUpload, isUploading }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  function validateFiles(files) {
    return Array.from(files).filter((f) => {
      const ext = '.' + f.name.split('.').pop().toLowerCase();
      return ALLOWED_EXTENSIONS.includes(ext);
    });
  }

  function handleFiles(files) {
    const valid = validateFiles(files);
    if (valid.length > 0) {
      setSelectedFiles((prev) => [...prev, ...valid]);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave() {
    setDragActive(false);
  }

  function handleChange(e) {
    handleFiles(e.target.files);
  }

  function handleRemove(index) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (selectedFiles.length === 0) return;
    await onUpload(selectedFiles);
    setSelectedFiles([]);
  }

  return (
    <div className="w-full">
      <div
        id="upload-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
          multiple
          accept=".pdf,.xlsx,.pptx"
          onChange={handleChange}
          className="hidden"
          id="file-input"
        />
        <div className="text-5xl mb-3 select-none">📄</div>
        <p className="text-text-secondary text-lg">
          Drag & drop files here, or <span className="text-accent font-semibold underline">browse</span>
        </p>
        <p className="text-text-secondary/60 text-sm mt-2">PDF, Excel (.xlsx), PowerPoint (.pptx)</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-5 space-y-2">
          {selectedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-surface-card rounded-xl px-4 py-3 border border-border/50"
            >
              <span className="text-text-primary text-sm truncate max-w-[80%]">{file.name}</span>
              <button
                onClick={() => handleRemove(i)}
                className="text-error hover:text-red-300 transition-colors text-lg font-bold ml-3"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
          <button
            id="upload-button"
            onClick={handleSubmit}
            disabled={isUploading}
            className="w-full mt-3 py-3 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary-dark active:scale-[0.98]"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Uploading & Processing…
              </span>
            ) : (
              `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
