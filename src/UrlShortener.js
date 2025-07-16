import React, { useState } from 'react';
import axios from 'axios';
import './UrlShortener.css';

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    if (!longUrl.trim().startsWith('http')) {
      return setError('🚫 Please enter a valid URL (starting with http or https)');
    }

    try {
      setLoading(true);
      setError('');
      const data = new URLSearchParams();
      data.append('url', longUrl);

      const res = await axios.post(
        'https://cleanuri.com/api/v1/shorten',
        data,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      setShortUrl(res.data.result_url);
      setCopied(false);
    } catch {
      setError('❌ Network error or invalid URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
  };

  const handleReset = () => {
    setLongUrl('');
    setShortUrl('');
    setCopied(false);
    setError('');
  };

  return (
    <div className="card">
      <h2>🔗 React URL Shortener</h2>
      <p className="subtitle">Paste a long URL to make it short and sweet.</p>

      <input
        type="text"
        placeholder="Enter a long URL (https://...)"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
      />

      {error && <div className="error">{error}</div>}

      <div className="button-group">
        <button onClick={handleShorten} className="primary" disabled={loading}>
          {loading ? 'Shortening...' : '🚀 Shorten'}
        </button>
        <button onClick={handleReset} className="secondary">🔄 Reset</button>
      </div>

      {shortUrl && (
        <div className="result-box">
          <p>Your short URL:</p>
          <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
          <button onClick={handleCopy} className="copy">
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
