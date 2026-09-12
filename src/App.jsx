import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, Music, Mic2, Database, History, Sliders, 
  FileText, Download, Copy, Check, Printer, Disc, CheckCircle2,
  Terminal, Search, Eye, X, ArrowLeft, RefreshCw, LayoutTemplate,
  FileDown, Loader2
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';
import { TRACKSHEET_ACTIVITY_PHRASES, DAW_ACTIVITY_PHRASES } from './activityPhrases';
import DossierView from './components/DossierView';
import LogbookDossierView from './components/LogbookDossierView';
import { parseHistoricalTracksheet } from './tracksheetParser';
import { parseLogbook } from './logbookParser';
import { downloadGoodLookingPdf } from './pdfExporter';

const normalizeMarkdown = (text) => {
  if (!text) return '';
  let clean = text;

  // 1. If table rows got concatenated on the same line (e.g. "| cell | | next row |"), split them
  clean = clean.replace(/\|[ \t]+\|/g, '|\n|');

  // 2. Ensure a blank line before a markdown table if preceded by a non-blank line (GFM requirement)
  clean = clean.replace(/([^\n])\n(\s*\|[^\n]+\|\s*\n\s*\|[-: ]+[-| :]*\|)/g, '$1\n\n$2');

  // 3. Ensure a blank line after a markdown table if followed immediately by text/headers
  clean = clean.replace(/(\|[^\n]+\|)\n([^\n|#])/g, '$1\n\n$2');

  return clean;
};

const markdownComponents = {
  a: ({ node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
  table: ({ node, ...props }) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  )
};

const DAW_OPTIONS = [
  'Logic Pro',
  'Protools',
  'Ableton',
  'Cubase',
  'Bitwig'
];

const getDawBadgeClass = (daw) => {
  const d = (daw || '').toLowerCase();
  if (d.includes('logic')) return 'daw-logic';
  if (d.includes('pro')) return 'daw-protools';
  if (d.includes('ableton')) return 'daw-ableton';
  if (d.includes('cubase')) return 'daw-cubase';
  if (d.includes('bitwig')) return 'daw-bitwig';
  return 'daw-none';
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return isoString;
  }
};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ActivityTypewriter({ phrases, shuffle = false }) {
  const [deck, setDeck] = useState(() => (shuffle && phrases ? shuffleArray(phrases) : (phrases || [])));
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // When phrases prop changes (e.g. search restarted), reset deck with fresh non-repeating shuffle
  useEffect(() => {
    if (!phrases || phrases.length === 0) {
      setDeck([]);
      return;
    }
    setDeck(shuffle ? shuffleArray(phrases) : [...phrases]);
    setPhraseIdx(0);
    setDisplayText('');
    setIsDeleting(false);
  }, [phrases, shuffle]);

  useEffect(() => {
    if (!deck || deck.length === 0) return;

    const currentPhrase = deck[phraseIdx % deck.length];
    let timer;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        // Humanized typewriter keystroke cadence (35ms - 55ms)
        const typeSpeed = Math.floor(Math.random() * 20) + 38;
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, typeSpeed);
      } else {
        // Once full phrase is typed, hold for 2.6s so user can read comfortably
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2600);
      }
    } else {
      if (displayText.length > 0) {
        // Quick, crisp backspacing
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 18);
      } else {
        // Brief pause before typing next non-repeating phrase in the sequence
        timer = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIdx((prev) => {
            const next = prev + 1;
            // When full 200 deck has played without repeating, reshuffle if shuffle enabled
            if (next >= deck.length && shuffle) {
              setDeck(shuffleArray(phrases));
              return 0;
            }
            return next % deck.length;
          });
        }, 350);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIdx, deck, shuffle, phrases]);

  return (
    <span className="typewriter-container">
      <span className="typewriter-text">{displayText}</span>
      <span className="typewriter-cursor">|</span>
    </span>
  );
}

function App() {
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [history, setHistory] = useState([]);

  // Component 1 & Logbook state
  const [selectedDaw, setSelectedDaw] = useState('Logic Pro');
  const [c1Solutions, setC1Solutions] = useState([]);
  const [c1Loading, setC1Loading] = useState(false);
  const [activeTab, setActiveTab] = useState('tracksheet'); // 'tracksheet' or 'c1'
  const [copyNotification, setCopyNotification] = useState('');

  const [searchActive, setSearchActive] = useState(false);

  // Smooth-scroll activity monitor into view on mobile when generation commences
  const activityRef = useRef(null);
  const c1ActivityRef = useRef(null);

  useEffect(() => {
    if (loading && searchActive && activityRef.current) {
      activityRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [loading, searchActive]);

  useEffect(() => {
    if (c1Loading && c1ActivityRef.current) {
      c1ActivityRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [c1Loading]);

  // Dev Mode state - hidden by default unless unlocked via secret shortcut (Ctrl+Shift+D), ?dev=true, or 5 clicks on title
  const [devUnlocked, setDevUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('dev') === 'true' || params.get('admin') === '1';
    }
    return false;
  });

  const [devMode, setDevMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('dev') === 'true' || params.get('admin') === '1';
    }
    return false;
  });
  const [logoClicks, setLogoClicks] = useState(0);
  const [devTab, setDevTab] = useState('tracksheets'); // 'tracksheets' | 'c1'
  const [devSearch, setDevSearch] = useState('');
  const [devDawFilter, setDevDawFilter] = useState('ALL');
  const [devC1Filter, setDevC1Filter] = useState('ALL');
  const [allC1Solutions, setAllC1Solutions] = useState([]);
  const [devStats, setDevStats] = useState(null);
  const [peekItem, setPeekItem] = useState(null); // { title, content, type, filename }
  const [showDevExplorer, setShowDevExplorer] = useState(true);

  // Keyboard shortcut listener for secret developer toggle: Ctrl+Shift+D or Cmd+Shift+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setDevUnlocked(true);
        setDevMode((prev) => {
          const next = !prev;
          if (next) fetchDevData();
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setDevUnlocked(true);
        setDevMode((current) => {
          const toggled = !current;
          if (toggled) fetchDevData();
          return toggled;
        });
        return 0;
      }
      return next;
    });
  };

  // Layout Mode state for Historical Tracksheet: 'dossier' | 'console' | 'text'
  const [tracksheetLayout, setTracksheetLayout] = useState(() => {
    return localStorage.getItem('tracksheet_layout_mode') || 'dossier';
  });

  const handleSetLayout = (mode) => {
    setTracksheetLayout(mode);
    localStorage.setItem('tracksheet_layout_mode', mode);
  };

  // Memoized parsed tracksheet model for Option 2 & Option 3
  const parsedTracksheet = useMemo(() => {
    if (!result) return null;
    return parseHistoricalTracksheet(result);
  }, [result]);

  const parsedPeekTracksheet = useMemo(() => {
    if (!peekItem || !peekItem.content || peekItem.type !== 'Historical Tracksheet') return null;
    return parseHistoricalTracksheet(peekItem.content);
  }, [peekItem]);

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

  const fetchDevData = async () => {
    try {
      fetchHistory();
      const [c1Res, statsRes] = await Promise.all([
        fetch('/api/c1-solutions'),
        fetch('/api/dev/stats')
      ]);
      if (c1Res.ok) {
        const c1Data = await c1Res.json();
        setAllC1Solutions(c1Data);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDevStats(statsData);
      }
    } catch (err) {
      console.error('Failed to fetch dev data', err);
    }
  };

  useEffect(() => {
    if (devMode) {
      fetchDevData();
    }
  }, [devMode]);

  const toggleDevMode = () => {
    setDevMode((prev) => {
      const next = !prev;
      if (next) {
        fetchDevData();
      }
      return next;
    });
  };

  const loadHistoryItem = async (id) => {
    setLoading(true);
    setSearchActive(false);
    setShowDevExplorer(false);
    try {
      const res = await fetch(`/api/tracksheets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data.content);
        setCurrentTrackId(data.id);
        setTrackName(data.track_name);
        setArtistName(data.artist_name || '');
        
        // Deduplicate solutions by DAW name so each created DAW has its latest version
        const rawSolutions = data.c1_solutions || [];
        const dedupedSolutions = [];
        const seenDaws = new Set();
        for (const sol of rawSolutions) {
          const norm = sol.daw.toLowerCase();
          if (!seenDaws.has(norm)) {
            seenDaws.add(norm);
            dedupedSolutions.push(sol);
          }
        }
        dedupedSolutions.sort((a, b) => {
          const idxA = DAW_OPTIONS.findIndex(d => d.toLowerCase() === a.daw.toLowerCase());
          const idxB = DAW_OPTIONS.findIndex(d => d.toLowerCase() === b.daw.toLowerCase());
          return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
        });
        setC1Solutions(dedupedSolutions);
        setActiveTab('tracksheet');
      }
    } catch (error) {
      console.error('Failed to load tracksheet', error);
    }
    setLoading(false);
  };

  const loadHistoryItemWithC1 = async (trackId, targetDaw) => {
    setLoading(true);
    setSearchActive(false);
    setShowDevExplorer(false);
    try {
      const res = await fetch(`/api/tracksheets/${trackId}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data.content);
        setCurrentTrackId(data.id);
        setTrackName(data.track_name);
        setArtistName(data.artist_name || '');
        
        const rawSolutions = data.c1_solutions || [];
        const dedupedSolutions = [];
        const seenDaws = new Set();
        for (const sol of rawSolutions) {
          const norm = sol.daw.toLowerCase();
          if (!seenDaws.has(norm)) {
            seenDaws.add(norm);
            dedupedSolutions.push(sol);
          }
        }
        dedupedSolutions.sort((a, b) => {
          const idxA = DAW_OPTIONS.findIndex(d => d.toLowerCase() === a.daw.toLowerCase());
          const idxB = DAW_OPTIONS.findIndex(d => d.toLowerCase() === b.daw.toLowerCase());
          return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
        });
        setC1Solutions(dedupedSolutions);

        if (targetDaw) {
          const matched = dedupedSolutions.find(s => s.daw.toLowerCase() === targetDaw.toLowerCase());
          if (matched) {
            setActiveTab(matched.daw);
            setSelectedDaw(matched.daw);
          } else {
            setActiveTab('tracksheet');
          }
        } else {
          setActiveTab('tracksheet');
        }
      }
    } catch (error) {
      console.error('Failed to load tracksheet with C1', error);
    }
    setLoading(false);
  };

  const handlePeekTracksheet = async (id, name, artist) => {
    try {
      const res = await fetch(`/api/tracksheets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPeekItem({
          title: `Historical Tracksheet: ${name} (${artist || 'Unknown Artist'})`,
          content: data.content,
          type: 'Historical Tracksheet',
          filename: `${(name || 'track').replace(/[^a-z0-9]/gi, '_')}_historical_tracksheet.md`
        });
      }
    } catch (e) {
      console.error('Failed to peek tracksheet', e);
    }
  };

  const handlePeekC1 = async (c1Id, trackTitle, artist, daw) => {
    try {
      const res = await fetch(`/api/c1-solutions/${c1Id}`);
      if (res.ok) {
        const data = await res.json();
        setPeekItem({
          title: `Component 1 Logbook (${daw}): ${trackTitle} (${artist || 'Unknown Artist'})`,
          content: data.content,
          type: `${daw} Logbook`,
          filename: `${(trackTitle || 'track').replace(/[^a-z0-9]/gi, '_')}_C1_Logbook_${daw}.md`
        });
      }
    } catch (e) {
      console.error('Failed to peek C1 logbook', e);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!trackName) return;

    setLoading(true);
    setSearchActive(true);
    setResult(null);
    setCurrentTrackId(null);
    setC1Solutions([]);
    setActiveTab('tracksheet');

    try {
      const res = await fetch('/api/tracksheets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_name: trackName, artist_name: artistName })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.content);
        setCurrentTrackId(data.id);
        fetchHistory(); // refresh history list
      } else {
        setResult('Error generating tracksheet. Please check the server connection.');
      }
    } catch (error) {
      console.error('Generation failed', error);
      setResult('Error connecting to the generation engine. Is the backend running?');
    } finally {
      setSearchActive(false);
      setLoading(false);
    }
  };

  const handleGenerateC1 = async (dawOverride) => {
    const dawToUse = dawOverride || selectedDaw;
    if (!currentTrackId && !result) return;

    setC1Loading(true);

    try {
      const res = await fetch(`/api/tracksheets/${currentTrackId || 0}/c1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          daw: dawToUse,
          track_name: trackName,
          artist_name: artistName,
          content: result
        })
      });

      if (res.ok) {
        const data = await res.json();
        setC1Solutions((prev) => {
          const filtered = prev.filter(item => item.daw.toLowerCase() !== data.daw.toLowerCase());
          const updated = [...filtered, data];
          updated.sort((a, b) => {
            const idxA = DAW_OPTIONS.findIndex(d => d.toLowerCase() === a.daw.toLowerCase());
            const idxB = DAW_OPTIONS.findIndex(d => d.toLowerCase() === b.daw.toLowerCase());
            return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
          });
          return updated;
        });
        setActiveTab(data.daw);
        setSelectedDaw(data.daw);
      } else {
        const errData = await res.json().catch(() => null);
        const errMsg = errData?.error || `Server returned error (${res.status})`;
        alert(`Error generating Component 1 solution: ${errMsg}\n\nTip: If you recently redeployed or opened the app in a new session, please generate or select the tracksheet first.`);
      }
    } catch (error) {
      console.error('C1 generation failed', error);
      alert('Error connecting to the server for Component 1 generation. Check your network connection.');
    } finally {
      setC1Loading(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopyNotification('Copied to clipboard!');
      setTimeout(() => setCopyNotification(''), 2500);
    });
  };

  const [pdfGenerating, setPdfGenerating] = useState(false);

  const handleDownloadPdf = async ({ type, content, track, artist, daw }) => {
    if (!content || pdfGenerating) return;
    try {
      setPdfGenerating(true);
      await downloadGoodLookingPdf({
        type,
        content,
        trackName: track || trackName,
        artistName: artist || artistName,
        daw: daw || selectedDaw
      });
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleDownload = (content, filename) => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isTracksheetTab = activeTab === 'tracksheet';
  const currentC1 = c1Solutions.find(s => s.daw.toLowerCase() === activeTab.toLowerCase()) || 
                    c1Solutions.find(s => s.daw.toLowerCase() === selectedDaw.toLowerCase()) || 
                    c1Solutions[0];
  const activeContent = isTracksheetTab ? result : (currentC1?.content || '');

  const parsedLogbook = useMemo(() => {
    if (!currentC1 || !currentC1.content) return null;
    return parseLogbook(currentC1.content);
  }, [currentC1]);

  const parsedPeekLogbook = useMemo(() => {
    if (!peekItem || !peekItem.content || peekItem.type === 'Historical Tracksheet') return null;
    return parseLogbook(peekItem.content);
  }, [peekItem]);

  const filteredTrackSheets = history.filter((item) => {
    const matchesSearch = devSearch === '' || 
      item.track_name.toLowerCase().includes(devSearch.toLowerCase()) || 
      (item.artist_name && item.artist_name.toLowerCase().includes(devSearch.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (devC1Filter === 'HAS_C1') return item.c1_count > 0;
    if (devC1Filter === 'NO_C1') return !item.c1_count || item.c1_count === 0;
    return true;
  });

  const filteredC1Solutions = allC1Solutions.filter((c1) => {
    const matchesSearch = devSearch === '' || 
      c1.track_name.toLowerCase().includes(devSearch.toLowerCase()) || 
      (c1.artist_name && c1.artist_name.toLowerCase().includes(devSearch.toLowerCase())) ||
      c1.daw.toLowerCase().includes(devSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (devDawFilter !== 'ALL') {
      return c1.daw.toLowerCase().includes(devDawFilter.toLowerCase().replace(' ', '')) || 
             c1.daw.toLowerCase() === devDawFilter.toLowerCase();
    }
    return true;
  });

  return (
    <div className="app-container">
      {/* Decorative Blobs */}
      <div className="gradient-blob blob-1"></div>
      <div className="gradient-blob blob-2"></div>

      <header>
        {devUnlocked && (
          <div className="header-top-bar">
            <button 
              type="button" 
              className={`dev-mode-btn ${devMode ? 'active' : ''}`}
              onClick={toggleDevMode}
              title={devMode ? "Dev Mode is ACTIVE: Click to switch to normal mode" : "Click to activate Dev Mode & access all archived track sheets and C1 solutions"}
            >
              <Terminal size={15} />
              <span>Dev Mode</span>
              <span className="dev-status-indicator">{devMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        )}
        <h1 onClick={handleLogoClick} style={{ cursor: 'default', userSelect: 'none' }}>
          <Sparkles size={40} style={{ verticalAlign: 'middle', marginRight: '10px' }}/>
          Tracksheet Creator
        </h1>
        <p className="subtitle">AI-Powered Musicological Analysis & Audio Engineering Archive</p>
      </header>

      <main>
        <div className="glass-panel">
          <form onSubmit={handleGenerate}>
            <div className="input-group">
              <div className="input-field-wrapper">
                <Music size={20} color="var(--text-muted)" className="input-icon" />
                <input 
                  type="text" 
                  className="input-field has-icon" 
                  placeholder="Track Name (e.g. Fame)" 
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  required
                />
              </div>
              <div className="input-field-wrapper">
                <Mic2 size={20} color="var(--text-muted)" className="input-icon" />
                <input 
                  type="text" 
                  className="input-field has-icon"
                  placeholder="Artist (e.g. David Bowie)" 
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-generate" disabled={loading || !trackName}>
                {loading && searchActive ? (
                  <>
                    <div className="loader"></div>
                    Searching Archives...
                  </>
                ) : loading ? (
                  <div className="loader"></div>
                ) : (
                  'Generate Tracksheet'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Real-time Activity Monitor (Single Line Replaced) */}
        {loading && searchActive && (
          <div ref={activityRef} className="glass-panel activity-monitor-panel">
            <div className="activity-monitor-inner">
              <div className="activity-icon-wrap">
                <div className="activity-radar-ring"></div>
                <Disc className="activity-spinning-disc" size={24} color="#C084FC" />
              </div>
              <div className="activity-text-wrap">
                <span className="activity-badge">
                  <span className="activity-live-dot"></span>
                  ACTIVITY MONITOR
                </span>
                <div className="activity-phrase-container">
                  <ActivityTypewriter phrases={TRACKSHEET_ACTIVITY_PHRASES} shuffle={true} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dev Mode Navigation Bar when document is active */}
        {devMode && result && (
          <div className="dev-view-nav-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="dev-live-pill">DEV REPOSITORY ACTIVE</span>
              <span style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
                Active Document: <strong style={{ color: '#F8FAFC' }}>{trackName}</strong> ({isTracksheetTab ? 'Historical Tracksheet' : `${activeTab} Logbook`})
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                className={`dev-action-btn ${showDevExplorer ? 'primary' : ''}`}
                onClick={() => setShowDevExplorer(prev => !prev)}
              >
                {showDevExplorer ? (
                  <>
                    <FileText size={14} /> View Active Document
                  </>
                ) : (
                  <>
                    <Database size={14} /> Open Dev Repository Explorer ({history.length} Sheets / {allC1Solutions.length} C1s)
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Dev Mode Repository Explorer */}
        {devMode && (showDevExplorer || !result) && (
          <div className="dev-banner glass-panel">
            <div className="dev-banner-header">
              <div className="dev-title-wrap">
                <div className="dev-terminal-icon">
                  <Terminal size={22} />
                </div>
                <div>
                  <h3 className="dev-banner-title">
                    Developer Archive & Component 1 Hub
                    <span className="dev-live-pill">DATABASE ACTIVE</span>
                  </h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#94A3B8' }}>
                    Instant forensic access to all {history.length} archived historical track sheets and all {allC1Solutions.length} created DAW recording solutions.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="button" 
                  className="dev-action-btn"
                  onClick={fetchDevData}
                  title="Refresh database records"
                >
                  <RefreshCw size={14} /> Refresh DB
                </button>
                {result && showDevExplorer && (
                  <button 
                    type="button" 
                    className="dev-action-btn primary"
                    onClick={() => setShowDevExplorer(false)}
                    title="Return to currently loaded document"
                  >
                    <ArrowLeft size={14} /> Back to Document
                  </button>
                )}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="dev-stats-grid">
              <div className="dev-stat-card">
                <span className="dev-stat-label">Historical Track Sheets</span>
                <span className="dev-stat-val" style={{ color: '#38BDF8' }}>
                  {devStats?.total_tracksheets || history.length}
                </span>
                <span className="dev-stat-sub">Archived song sessions</span>
              </div>
              <div className="dev-stat-card">
                <span className="dev-stat-label">Created C1 Logbooks</span>
                <span className="dev-stat-val" style={{ color: '#C084FC' }}>
                  {devStats?.total_c1_solutions || allC1Solutions.length}
                </span>
                <span className="dev-stat-sub">Full coursework solutions</span>
              </div>
              <div className="dev-stat-card">
                <span className="dev-stat-label">Sheets with C1 Solutions</span>
                <span className="dev-stat-val" style={{ color: '#34D399' }}>
                  {history.filter(h => h.c1_count > 0).length}
                </span>
                <span className="dev-stat-sub">
                  {Math.round((history.filter(h => h.c1_count > 0).length / (history.length || 1)) * 100)}% coverage
                </span>
              </div>
              <div className="dev-stat-card">
                <span className="dev-stat-label">DAWs Configured</span>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {(devStats?.daw_counts || []).map(d => (
                    <span key={d.daw} className={`dev-daw-badge ${getDawBadgeClass(d.daw)}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                      {d.daw}: {d.count}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Repository Tabs */}
            <div className="dev-repo-tabs">
              <button 
                type="button"
                className={`dev-repo-tab-btn ${devTab === 'tracksheets' ? 'active' : ''}`}
                onClick={() => setDevTab('tracksheets')}
              >
                <Database size={16} />
                Archived Historical Track Sheets
                <span className="dev-badge-count">{history.length}</span>
              </button>

              <button 
                type="button"
                className={`dev-repo-tab-btn ${devTab === 'c1' ? 'active' : ''}`}
                onClick={() => setDevTab('c1')}
              >
                <Sliders size={16} />
                All Created C1 Solutions
                <span className="dev-badge-count">{allC1Solutions.length}</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="dev-filter-bar">
              <div className="dev-search-wrap">
                <Search className="dev-search-icon" size={16} />
                <input 
                  type="text"
                  className="dev-search-input"
                  placeholder={devTab === 'tracksheets' ? "Search by track name or artist..." : "Search C1 logbooks by track, artist, or DAW..."}
                  value={devSearch}
                  onChange={(e) => setDevSearch(e.target.value)}
                />
              </div>

              {devTab === 'tracksheets' ? (
                <div className="dev-daw-pills">
                  <button 
                    type="button" 
                    className={`dev-pill ${devC1Filter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setDevC1Filter('ALL')}
                  >
                    All ({history.length})
                  </button>
                  <button 
                    type="button" 
                    className={`dev-pill ${devC1Filter === 'HAS_C1' ? 'active' : ''}`}
                    onClick={() => setDevC1Filter('HAS_C1')}
                  >
                    Has C1 Solutions ({history.filter(h => h.c1_count > 0).length})
                  </button>
                  <button 
                    type="button" 
                    className={`dev-pill ${devC1Filter === 'NO_C1' ? 'active' : ''}`}
                    onClick={() => setDevC1Filter('NO_C1')}
                  >
                    No C1 Yet ({history.filter(h => !h.c1_count || h.c1_count === 0).length})
                  </button>
                </div>
              ) : (
                <div className="dev-daw-pills">
                  {['ALL', 'Logic Pro', 'Protools', 'Ableton', 'Bitwig', 'Cubase'].map(dawName => {
                    const count = dawName === 'ALL' 
                      ? allC1Solutions.length 
                      : allC1Solutions.filter(c => c.daw.toLowerCase().includes(dawName.toLowerCase().replace(' ', '')) || c.daw.toLowerCase() === dawName.toLowerCase()).length;
                    return (
                      <button 
                        key={dawName}
                        type="button"
                        className={`dev-pill ${devDawFilter === dawName ? 'active' : ''}`}
                        onClick={() => setDevDawFilter(dawName)}
                      >
                        {dawName} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Table Views */}
            {devTab === 'tracksheets' ? (
              <div className="dev-table-card">
                <div style={{ overflowX: 'auto' }}>
                  <table className="dev-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th>Track & Artist</th>
                        <th>Created</th>
                        <th>C1 Solutions</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrackSheets.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                            No historical track sheets matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredTrackSheets.map(item => (
                          <tr key={item.id}>
                            <td><span className="dev-id-badge">#{item.id}</span></td>
                            <td>
                              <div className="dev-track-title">{item.track_name}</div>
                              <div className="dev-track-artist">{item.artist_name || 'Unknown Artist'}</div>
                            </td>
                            <td style={{ fontSize: '0.8rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                              {formatDate(item.created_at)}
                            </td>
                            <td>
                              {item.c1_count > 0 && item.c1_daws ? (
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                  {item.c1_daws.split(',').map(daw => (
                                    <button
                                      key={daw}
                                      type="button"
                                      className={`dev-daw-badge ${getDawBadgeClass(daw)}`}
                                      onClick={() => loadHistoryItemWithC1(item.id, daw)}
                                      title={`Click to load track & open ${daw} C1 logbook directly`}
                                    >
                                      <Sliders size={12} /> {daw}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <span className="dev-daw-badge daw-none">None created</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="dev-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                                <button 
                                  type="button"
                                  className="dev-action-btn primary"
                                  onClick={() => loadHistoryItem(item.id)}
                                  title="Open this track sheet in the workspace"
                                >
                                  <FileText size={13} /> Open
                                </button>
                                <button 
                                  type="button"
                                  className="dev-action-btn"
                                  onClick={() => handlePeekTracksheet(item.id, item.track_name, item.artist_name)}
                                  title="Quick peek without navigating away"
                                >
                                  <Eye size={13} /> Peek
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="dev-table-card">
                <div style={{ overflowX: 'auto' }}>
                  <table className="dev-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>C1 ID</th>
                        <th>Track Title & Artist</th>
                        <th>Target DAW</th>
                        <th>Size</th>
                        <th>Generated</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredC1Solutions.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                            No Component 1 solutions matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredC1Solutions.map(c1 => (
                          <tr key={c1.id}>
                            <td><span className="dev-id-badge">#{c1.id}</span></td>
                            <td>
                              <div className="dev-track-title">{c1.track_name}</div>
                              <div className="dev-track-artist">{c1.artist_name || 'Unknown Artist'}</div>
                            </td>
                            <td>
                              <span className={`dev-daw-badge ${getDawBadgeClass(c1.daw)}`}>
                                <Sliders size={12} /> {c1.daw}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                              {c1.content_length ? `${Math.round(c1.content_length / 1024)} KB` : 'Ready'}
                            </td>
                            <td style={{ fontSize: '0.8rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                              {formatDate(c1.created_at)}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="dev-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                                <button 
                                  type="button"
                                  className="dev-action-btn primary"
                                  onClick={() => loadHistoryItemWithC1(c1.track_id, c1.daw)}
                                  title={`Open ${c1.track_name} and display ${c1.daw} C1 Logbook`}
                                >
                                  <Sliders size={13} /> Open Logbook
                                </button>
                                <button 
                                  type="button"
                                  className="dev-action-btn"
                                  onClick={() => handlePeekC1(c1.id, c1.track_name, c1.artist_name, c1.daw)}
                                  title="Quick preview logbook content"
                                >
                                  <Eye size={13} /> Peek
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Document Result Panel */}
        {result && (!devMode || !showDevExplorer) && (
          <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* View Switching Tabs */}
            <div className="view-tabs">
              <button 
                type="button" 
                className={`tab-btn ${isTracksheetTab ? 'active' : ''}`}
                onClick={() => setActiveTab('tracksheet')}
              >
                <Database size={18} />
                Historical Tracksheet
              </button>
              
              {c1Solutions.map((sol) => (
                <button
                  key={sol.daw}
                  type="button"
                  className={`tab-btn ${activeTab.toLowerCase() === sol.daw.toLowerCase() ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(sol.daw);
                    setSelectedDaw(sol.daw);
                  }}
                >
                  <FileText size={18} />
                  {sol.daw} Logbook
                  <span className="daw-tab-badge">C1</span>
                </button>
              ))}

              {c1Solutions.length === 0 && (
                <button 
                  type="button" 
                  className={`tab-btn ${activeTab === 'c1' ? 'active' : ''}`}
                  onClick={() => setActiveTab('c1')}
                >
                  <FileText size={18} />
                  Component 1 Logbook
                  <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>(Not yet created)</span>
                </button>
              )}
            </div>

            {/* Component 1 On-Demand DAW Selector & Action Bar */}
            <div className="c1-control-bar">
              <div className="c1-info">
                <span className="c1-title">
                  <Sliders size={18} color="#C084FC" />
                  Component 1 Recording Suite
                </span>
                <span className="c1-subtitle">
                  Select your primary DAW to engineer the 3-pathway solutions and generate the completed official logbook document.
                </span>
              </div>

              <div className="c1-actions">
                <select 
                  className="daw-select"
                  value={selectedDaw}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedDaw(val);
                    const existing = c1Solutions.find(s => s.daw.toLowerCase() === val.toLowerCase());
                    if (existing) {
                      setActiveTab(existing.daw);
                    }
                  }}
                >
                  {DAW_OPTIONS.map((daw) => {
                    const isCreated = c1Solutions.some(s => s.daw.toLowerCase() === daw.toLowerCase());
                    return (
                      <option key={daw} value={daw}>
                        {daw} {isCreated ? '✓ (Created)' : ''}
                      </option>
                    );
                  })}
                </select>

                <button 
                  type="button"
                  className="btn-c1"
                  onClick={() => handleGenerateC1(selectedDaw)}
                  disabled={c1Loading || !currentTrackId}
                >
                  {c1Loading ? (
                    <>
                      <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                      Engineering {selectedDaw} Solution...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      {c1Solutions.some(s => s.daw.toLowerCase() === selectedDaw.toLowerCase()) 
                        ? `Regenerate ${selectedDaw} Logbook` 
                        : `Create ${selectedDaw} Solution`}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Real-time Component 1 Activity Monitor (Single Line Replaced) */}
            {c1Loading && (
              <div ref={c1ActivityRef} className="glass-panel activity-monitor-panel c1-activity-panel">
                <div className="activity-monitor-inner">
                  <div className="activity-icon-wrap">
                    <div className="activity-radar-ring c1-radar"></div>
                    <Sliders className="activity-spinning-sliders" size={22} color="#D946EF" />
                  </div>
                  <div className="activity-text-wrap">
                    <span className="activity-badge c1-badge">
                      <span className="activity-live-dot"></span>
                      {selectedDaw} LOGBOOK ENGINEERING MONITOR
                    </span>
                    <div className="activity-phrase-container">
                      <ActivityTypewriter phrases={DAW_ACTIVITY_PHRASES[selectedDaw] || DAW_ACTIVITY_PHRASES['Logic Pro']} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document Header & Action Toolbar */}
            <div className="result-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h2>
                  {isTracksheetTab 
                    ? 'Historical Session Tracksheet' 
                    : `Component 1 Completed Logbook (${currentC1 ? currentC1.daw : selectedDaw})`
                  }
                </h2>

                {(isTracksheetTab || currentC1) && (
                  <div className="layout-switcher-bar">
                    <span className="layout-switcher-label">
                      <LayoutTemplate size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      View:
                    </span>
                    <div className="layout-btn-group">
                      <button 
                        type="button" 
                        className={`layout-mode-btn ${tracksheetLayout === 'text' ? 'active' : ''}`}
                        onClick={() => handleSetLayout('text')}
                        title="Classic Text Document"
                      >
                        <FileText size={13} /> Text View
                      </button>
                      <button 
                        type="button" 
                        className={`layout-mode-btn ${tracksheetLayout === 'dossier' ? 'active' : ''}`}
                        onClick={() => handleSetLayout('dossier')}
                        title="Interactive Dossier View"
                      >
                        <Disc size={13} /> Dossier View
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="doc-toolbar">
                {copyNotification && (
                  <span style={{ color: '#4ADE80', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Check size={16} /> {copyNotification}
                  </span>
                )}

                <button 
                  type="button" 
                  className="btn-toolbar" 
                  onClick={() => handleCopy(activeContent)}
                  title="Copy content as Markdown"
                >
                  <Copy size={15} /> Copy
                </button>

                <button 
                  type="button" 
                  className="btn-toolbar btn-pdf" 
                  onClick={() => handleDownloadPdf({
                    type: isTracksheetTab ? 'tracksheet' : 'logbook',
                    content: activeContent,
                    track: trackName,
                    artist: artistName,
                    daw: currentC1 ? currentC1.daw : selectedDaw
                  })}
                  disabled={pdfGenerating}
                  title="Download professionally formatted PDF"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(56, 189, 248, 0.25))',
                    borderColor: 'rgba(168, 85, 247, 0.5)',
                    color: '#F8FAFC',
                    fontWeight: 600
                  }}
                >
                  {pdfGenerating ? (
                    <>
                      <Loader2 size={15} className="spin-slow" /> Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileDown size={15} color="#C084FC" /> Download PDF
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  className="btn-toolbar" 
                  onClick={() => handleDownload(
                    activeContent,
                    `${(trackName || 'track').replace(/[^a-z0-9]/gi, '_')}_${isTracksheetTab ? 'tracksheet' : `C1_Logbook_${currentC1 ? currentC1.daw : selectedDaw}`}.md`
                  )}
                  title="Download Markdown file"
                >
                  <Download size={15} /> Download (.md)
                </button>

                <button 
                  type="button" 
                  className="btn-toolbar" 
                  onClick={() => window.print()}
                  title="Print or export via system dialog"
                >
                  <Printer size={15} /> Print
                </button>
              </div>
            </div>

            {/* Content Display Area */}
            <div className={`markdown-body ${(isTracksheetTab || currentC1) && tracksheetLayout !== 'text' ? 'custom-layout-active' : ''}`}>
              {isTracksheetTab ? (
                tracksheetLayout === 'dossier' && parsedTracksheet ? (
                  <DossierView data={parsedTracksheet} />
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {normalizeMarkdown(result)}
                  </ReactMarkdown>
                )
              ) : (
                currentC1 ? (
                  tracksheetLayout === 'dossier' && parsedLogbook ? (
                    <LogbookDossierView data={parsedLogbook} daw={currentC1.daw} />
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {normalizeMarkdown(currentC1.content)}
                    </ReactMarkdown>
                  )
                ) : (
                  <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                    <FileText size={48} color="var(--primary)" style={{ opacity: 0.8, marginBottom: '1rem' }} />
                    <h3 style={{ color: '#E2E8F0', marginTop: 0 }}>No Component 1 Solution Created Yet for {selectedDaw}</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '550px', margin: '0.5rem auto 1.5rem' }}>
                      Choose your preferred DAW from the dropdown menu above and click <strong>Create {selectedDaw} Solution</strong> to generate the completed Component 1 recording logbook with all 7 mandatory instruments, 3 input pathways, and hyperlinked stock/3rd-party processing.
                    </p>
                    <button 
                      type="button" 
                      className="btn-c1" 
                      style={{ margin: '0 auto' }}
                      onClick={() => handleGenerateC1(selectedDaw)}
                      disabled={c1Loading || !currentTrackId}
                    >
                      {c1Loading ? 'Engineering Logbook...' : `Generate ${selectedDaw} Logbook Now`}
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Classic Archive Panel (Only shown when Dev Mode is OFF and no result is active) */}
        {!devMode && history.length > 0 && !result && (
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

        {/* Quick Peek Modal */}
        {peekItem && (
          <div className="dev-modal-overlay" onClick={() => setPeekItem(null)}>
            <div className="dev-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="dev-modal-header">
                <div className="dev-modal-title">
                  <FileText size={18} color="#38BDF8" />
                  <span>{peekItem.title}</span>
                </div>

                {peekItem && (
                  <div className="layout-btn-group" style={{ marginLeft: 'auto', marginRight: '0.5rem' }}>
                    <button 
                      type="button" 
                      className={`layout-mode-btn ${tracksheetLayout === 'text' ? 'active' : ''}`}
                      onClick={() => handleSetLayout('text')}
                      title="Classic Text Document"
                    >
                      <FileText size={12} /> Text
                    </button>
                    <button 
                      type="button" 
                      className={`layout-mode-btn ${tracksheetLayout === 'dossier' ? 'active' : ''}`}
                      onClick={() => handleSetLayout('dossier')}
                      title="Interactive Dossier View"
                    >
                      <Disc size={12} /> Dossier
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    className="dev-action-btn"
                    onClick={() => handleCopy(peekItem.content)}
                    title="Copy to clipboard"
                  >
                    <Copy size={13} /> Copy
                  </button>
                  <button 
                    type="button" 
                    className="dev-action-btn"
                    onClick={() => handleDownloadPdf({
                      type: peekItem.type === 'Historical Tracksheet' ? 'tracksheet' : 'logbook',
                      content: peekItem.content,
                      track: peekItem.track_name,
                      artist: peekItem.artist_name,
                      daw: peekItem.daw || selectedDaw
                    })}
                    disabled={pdfGenerating}
                    title="Download as PDF"
                    style={{
                      background: 'rgba(168, 85, 247, 0.2)',
                      borderColor: 'rgba(168, 85, 247, 0.4)',
                      color: '#D8B4FE'
                    }}
                  >
                    {pdfGenerating ? <Loader2 size={13} className="spin-slow" /> : <FileDown size={13} />} PDF
                  </button>
                  <button 
                    type="button" 
                    className="dev-action-btn"
                    onClick={() => handleDownload(peekItem.content, peekItem.filename)}
                    title="Download as Markdown"
                  >
                    <Download size={13} /> .md
                  </button>
                  <button 
                    type="button" 
                    className="dev-modal-close-btn"
                    onClick={() => setPeekItem(null)}
                    title="Close preview"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="dev-modal-body markdown-body">
                {peekItem.type === 'Historical Tracksheet' && parsedPeekTracksheet ? (
                  tracksheetLayout === 'dossier' ? (
                    <DossierView data={parsedPeekTracksheet} />
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {normalizeMarkdown(peekItem.content)}
                    </ReactMarkdown>
                  )
                ) : parsedPeekLogbook && tracksheetLayout === 'dossier' ? (
                  <LogbookDossierView data={parsedPeekLogbook} daw={peekItem.type} />
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {normalizeMarkdown(peekItem.content)}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
