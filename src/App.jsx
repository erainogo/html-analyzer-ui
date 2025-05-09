import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    console.log('Button clicked!');
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('http://localhost:8080/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${errorText} ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Received data:', data);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  

  return (
    <div className="container">
      <div className={`card ${result ? 'top-aligned' : 'centered'}`}>
        <h1>Html Analyzer</h1>

        <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}>
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" disabled={!url || loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        {result && (
          <div style={{ marginTop: '1rem' }}>
            <h2>Analysis Results</h2>
            <p><strong>HTML Version:</strong> {result.htmlVersion}</p>
            <p><strong>Title:</strong> {result.title}</p>
            <p><strong>Headings:</strong></p>
            <ul>
              {Object.entries(result.headings || {}).map(([level, count]) => (
                <li key={level}>{level}: {count}</li>
              ))}
            </ul>
            <p><strong>Links:</strong></p>
            <ul>
              <li>Internal: {result.links.internal || 'N/A'}</li>
              <li>External: {result.links.external || 'N/A'}</li>
              <li>Inaccessible: {result.links.inaccessible || 'N/A'}</li>
            </ul>
            <p><strong>Contains login form:</strong> {result.hasLoginForm ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  );
}