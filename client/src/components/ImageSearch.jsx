import { useState, useRef } from 'react';
import { searchByImage } from '../services/api';
import ProductCard from './ProductCard';

export default function ImageSearch() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  function handleFile(selectedFile) {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResults(null);
    setLabels([]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    handleFile(dropped);
  }

  async function handleSearch() {
    if (!file) return;
    setLoading(true);
    try {
      const data = await searchByImage(file);
      setResults(data.products || []);
      setLabels(data.labels || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResults(null);
    setLabels([]);
  }

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300
          ${dragOver
            ? 'border-primary-400 bg-primary-500/10 scale-[1.02]'
            : 'border-surface-700 hover:border-surface-500 hover:bg-surface-800/50'
          }
          ${preview ? '!p-4' : ''}`}
        id="image-upload-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
          id="image-upload-input"
        />

        {preview ? (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <img src={preview} alt="Upload preview"
                className="w-40 h-40 object-cover rounded-xl ring-2 ring-surface-700" />
              <button
                onClick={e => { e.stopPropagation(); reset(); }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs
                  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >✕</button>
            </div>
            <div className="text-left">
              <p className="font-medium text-surface-200">{file.name}</p>
              <p className="text-sm text-surface-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <button
                onClick={e => { e.stopPropagation(); handleSearch(); }}
                disabled={loading}
                className="btn-primary mt-4 text-sm !px-6"
                id="image-search-btn"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Analyzing...
                  </span>
                ) : (
                  <span>🔍 Find Similar Products</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl animate-float">📷</div>
            <div>
              <p className="text-lg font-semibold text-surface-200">Drop an image here or click to upload</p>
              <p className="text-sm text-surface-500 mt-2">Supports JPG, PNG, WebP — Max 5MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Labels */}
      {labels.length > 0 && (
        <div className="animate-fade-in">
          <h4 className="text-sm font-medium text-surface-400 mb-3">Detected labels:</h4>
          <div className="flex flex-wrap gap-2">
            {labels.map(label => (
              <span key={label} className="badge-accent">{label}</span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="animate-slide-up">
          <h3 className="text-xl font-bold text-surface-100 mb-4">
            {results.length > 0 ? `Found ${results.length} similar products` : 'No similar products found'}
          </h3>
          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
