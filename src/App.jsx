import { useState, useEffect } from 'react';
import { Sparkles, Music, Mic2, Database, History, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch history on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/tracksheets');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const loadHistoryItem = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tracksheets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data.content);
        setTrackName(data.track_name);
        setArtistName(data.artist_name || '');
      }
    } catch (error) {
      console.error('Failed to load tracksheet', error);
    }
    setLoading(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!trackName) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/tracksheets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_name: trackName, artist_name: artistName })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.content);
        fetchHistory(); // refresh history
      } else {
        setResult('Error generating tracksheet. Please check the server connection.');
      }
    } catch (error) {
      console.error('Generation failed', error);
      setResult('Error connecting to the generation engine. Is the backend running?');
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* Decorative Blobs */}
      <div className="gradient-blob blob-1"></div>
      <div className="gradient-blob blob-2"></div>

      <header>
        <h1><Sparkles size={40} style={{ verticalAlign: 'middle', marginRight: '10px' }}/>Tracksheet Creator</h1>
        <p className="subtitle">AI-Powered Musicological Analysis & Audio Engineering Archive</p>
      </header>

      <main>
        <div className="glass-panel">
          <form onSubmit={handleGenerate}>
            <div className="input-group">
              <div style={{ flex: 1, position: 'relative' }}>
                <Music size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '16px', left: '16px' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '3rem', width: 'calc(100% - 4.5rem)' }}
                  placeholder="Track Name (e.g. Fame)" 
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  required
                />
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <Mic2 size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '16px', left: '16px' }} />
                <input 
                  type="text" 
                  className="input-field"
                  style={{ paddingLeft: '3rem', width: 'calc(100% - 4.5rem)' }}
                  placeholder="Artist (e.g. David Bowie)" 
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-generate" disabled={loading || !trackName}>
                {loading ? <div className="loader"></div> : 'Generate Tracksheet'}
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="result-header">
              <h2>Generated Tracksheet</h2>
              <Database size={24} color="var(--primary)" />
            </div>
            <div className="markdown-body">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}

        {history.length > 0 && !result && (
          <div className="history-panel glass-panel">
            <div className="result-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={24} color="var(--secondary)" />
                Archive
              </h2>
            </div>
            <div className="history-grid">
              {history.map((item) => (
                <div key={item.id} className="history-card" onClick={() => loadHistoryItem(item.id)}>
                  <h3>{item.track_name}</h3>
                  <p>{item.artist_name || 'Unknown Artist'}</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
