import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Bot, Play, Square, Pause, Sparkles, CheckCircle2, Clock, 
  Search, Database, FileText, RefreshCw, AlertCircle, 
  ExternalLink, ChevronRight, Layers, Award, Terminal
} from 'lucide-react';
import { DECADES_LIST } from '../data/decadeSongs';

export default function DecadeBotPanel({ onLoadTrack }) {
  const [decadesSummary, setDecadesSummary] = useState([]);
  const [selectedDecade, setSelectedDecade] = useState('1950s');
  const [decadeData, setDecadeData] = useState(null);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [botStatus, setBotStatus] = useState({
    isRunning: false,
    currentSong: null,
    processed: 0,
    limit: 0,
    generated: 0,
    cached: 0,
    failed: 0,
    logs: []
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ARCHIVED' | 'PENDING'

  // Polling interval ref
  const pollTimerRef = useRef(null);

  // Fetch decades overview stats
  const fetchDecadesSummary = async () => {
    try {
      const res = await fetch('/api/bot/decades');
      if (res.ok) {
        const json = await res.json();
        if (json.decades) {
          setDecadesSummary(json.decades);
        }
      }
    } catch (e) {
      console.error('Failed to fetch decades summary:', e);
    }
  };

  // Fetch songs for selected decade
  const fetchDecadeSongs = async (decadeId) => {
    setLoadingSongs(true);
    try {
      const res = await fetch(`/api/bot/decades/${decadeId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setDecadeData(json.data);
        }
      }
    } catch (e) {
      console.error(`Failed to fetch songs for ${decadeId}:`, e);
    } finally {
      setLoadingSongs(false);
    }
  };

  // Fetch live bot running status
  const fetchBotStatus = async () => {
    try {
      const res = await fetch('/api/bot/status');
      if (res.ok) {
        const status = await res.json();
        setBotStatus(status);
        // If bot is running or recently finished, refresh current decade view
        if (status.isRunning) {
          fetchDecadeSongs(selectedDecade);
          fetchDecadesSummary();
        }
      }
    } catch (e) {
      console.error('Failed to fetch bot status:', e);
    }
  };

  // Initial load & when selected decade changes
  useEffect(() => {
    fetchDecadesSummary();
    fetchDecadeSongs(selectedDecade);
  }, [selectedDecade]);

  // Polling for bot status
  useEffect(() => {
    fetchBotStatus();
    pollTimerRef.current = setInterval(fetchBotStatus, 2500);
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [selectedDecade]);

  // Start harvester bot
  const handleStartBot = async (decade = selectedDecade, limit = 10) => {
    try {
      const res = await fetch('/api/bot/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decade,
          limit,
          delayMs: 2000,
          force: false
        })
      });
      if (res.ok) {
        fetchBotStatus();
      }
    } catch (err) {
      console.error('Failed to start bot:', err);
    }
  };

  // Stop harvester bot
  const handleStopBot = async () => {
    try {
      await fetch('/api/bot/stop', { method: 'POST' });
      fetchBotStatus();
    } catch (err) {
      console.error('Failed to stop bot:', err);
    }
  };

  // Generate a single track immediately
  const handleGenerateSingle = async (trackName, artistName) => {
    try {
      const res = await fetch('/api/tracksheets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_name: trackName, artist_name: artistName })
      });
      if (res.ok) {
        const data = await res.json();
        fetchDecadeSongs(selectedDecade);
        fetchDecadesSummary();
        if (onLoadTrack && data.id) {
          onLoadTrack(data.id);
        }
      }
    } catch (err) {
      console.error('Failed to generate track:', err);
    }
  };

  // Filtered song list
  const filteredSongs = useMemo(() => {
    if (!decadeData || !decadeData.songs) return [];
    let list = decadeData.songs;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'ARCHIVED') {
      list = list.filter(s => s.isArchived);
    } else if (statusFilter === 'PENDING') {
      list = list.filter(s => !s.isArchived);
    }

    return list;
  }, [decadeData, searchQuery, statusFilter]);

  // Overall totals across all 8 decades
  const overallStats = useMemo(() => {
    const totalSongs = decadesSummary.reduce((acc, d) => acc + (d.totalSongs || 100), 0) || 800;
    const archivedSongs = decadesSummary.reduce((acc, d) => acc + (d.archivedCount || 0), 0);
    const pct = Math.round((archivedSongs / totalSongs) * 100);
    return { totalSongs, archivedSongs, pct };
  }, [decadesSummary]);

  return (
    <div className="decade-bot-container">
      {/* Bot Header Banner */}
      <div className="bot-hero-banner">
        <div className="bot-hero-content">
          <div className="bot-badge-title-group">
            <div className="bot-icon-circle">
              <Bot size={28} color="#C084FC" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 className="bot-title">Decade Harvester Bot</h2>
                <span className="bot-dev-tag">DEV MODE ONLY</span>
              </div>
              <p className="bot-subtitle">
                Automated musicological crawler for the Top 100 Billboard & historic chart records across each decade from the 1950s (800 total songs).
              </p>
            </div>
          </div>

          {/* Harvester Global Controls */}
          <div className="bot-hero-actions">
            {botStatus.isRunning ? (
              <button 
                type="button" 
                className="bot-btn-stop"
                onClick={handleStopBot}
              >
                <Square size={16} fill="currentColor" />
                Stop Harvester
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="bot-btn-primary"
                  onClick={() => handleStartBot(selectedDecade, 10)}
                  title={`Process the next 10 pending songs in ${selectedDecade}`}
                >
                  <Play size={16} fill="currentColor" />
                  Harvest Next 10 ({selectedDecade})
                </button>
                <button 
                  type="button" 
                  className="bot-btn-secondary"
                  onClick={() => handleStartBot(selectedDecade, 100)}
                  title={`Run entire ${selectedDecade} batch`}
                >
                  <Sparkles size={16} />
                  Harvest All {selectedDecade}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Overview Metrics */}
        <div className="bot-overview-metrics">
          <div className="bot-metric-card">
            <span className="bot-metric-label">Total Catalog</span>
            <span className="bot-metric-val">800 Songs</span>
            <span className="bot-metric-sub">8 Decades (1950s–2020s)</span>
          </div>
          <div className="bot-metric-card">
            <span className="bot-metric-label">Archived in Database</span>
            <span className="bot-metric-val" style={{ color: '#34D399' }}>
              {overallStats.archivedSongs} / 800
            </span>
            <span className="bot-metric-sub">{overallStats.pct}% Catalog Coverage</span>
          </div>
          <div className="bot-metric-card">
            <span className="bot-metric-label">Active Harvester State</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span className={`bot-status-dot ${botStatus.isRunning ? 'active' : ''}`}></span>
              <span className="bot-metric-val" style={{ fontSize: '1.1rem' }}>
                {botStatus.isRunning ? 'RUNNING' : 'IDLE'}
              </span>
            </div>
            <span className="bot-metric-sub">
              {botStatus.isRunning && botStatus.currentSong
                ? `Current: ${botStatus.currentSong.title}`
                : 'Waiting for trigger'}
            </span>
          </div>
        </div>

        {/* Live Bot Progress Bar & Log Ticker (When running or recently active) */}
        {botStatus.isRunning && (
          <div className="bot-live-ticker-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={16} className="activity-spinning-disc" color="#C084FC" />
                <strong style={{ color: '#F8FAFC', fontSize: '0.9rem' }}>
                  Harvester Active: Processing {botStatus.currentSong ? `"${botStatus.currentSong.title}" - ${botStatus.currentSong.artist}` : 'Queue'}
                </strong>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                Processed: {botStatus.processed} | Generated: {botStatus.generated} | Cached: {botStatus.cached}
              </span>
            </div>
            
            <div className="bot-progress-track">
              <div 
                className="bot-progress-fill"
                style={{ 
                  width: `${Math.min(100, Math.round((botStatus.processed / (botStatus.limit || 10)) * 100))}%` 
                }}
              ></div>
            </div>

            {botStatus.logs && botStatus.logs.length > 0 && (
              <div className="bot-mini-log">
                <span style={{ color: '#C084FC', marginRight: '0.5rem' }}>[{botStatus.logs[0].time}]</span>
                <span>{botStatus.logs[0].message}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decade Selector Tabs */}
      <div className="bot-decades-tabs">
        {DECADES_LIST.map((dec) => {
          const sum = decadesSummary.find(d => d.decade === dec.id);
          const archived = sum ? sum.archivedCount : 0;
          const total = sum ? sum.totalSongs : 100;
          const isActive = selectedDecade === dec.id;

          return (
            <button
              key={dec.id}
              type="button"
              className={`bot-decade-tab ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedDecade(dec.id)}
            >
              <span className="bot-tab-label">{dec.label}</span>
              <span className={`bot-tab-pill ${archived > 0 ? 'has-archived' : ''}`}>
                {archived} / {total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Decade Table & Search Controls */}
      <div className="bot-table-container">
        <div className="bot-table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#F8FAFC' }}>
              {decadeData?.label || selectedDecade} Top 100
            </h3>
            <span className="bot-pill-archived-count">
              {decadeData?.archivedCount || 0} / {decadeData?.songs?.length || 100} Archived
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="bot-search-wrap">
              <Search size={15} className="bot-search-icon" />
              <input 
                type="text"
                className="bot-search-input"
                placeholder="Filter title or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="bot-filter-pills">
              <button 
                type="button"
                className={`bot-filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                All ({decadeData?.songs?.length || 0})
              </button>
              <button 
                type="button"
                className={`bot-filter-pill ${statusFilter === 'ARCHIVED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ARCHIVED')}
              >
                Archived ({decadeData?.archivedCount || 0})
              </button>
              <button 
                type="button"
                className={`bot-filter-pill ${statusFilter === 'PENDING' ? 'active' : ''}`}
                onClick={() => setStatusFilter('PENDING')}
              >
                Pending ({decadeData?.pendingCount || 0})
              </button>
            </div>
          </div>
        </div>

        {/* Songs List Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="bot-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Song Title</th>
                <th>Artist</th>
                <th style={{ width: '80px' }}>Year</th>
                <th style={{ width: '140px' }}>Archive Status</th>
                <th style={{ textAlign: 'right', width: '160px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingSongs ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    <RefreshCw className="activity-spinning-disc" size={24} style={{ margin: '0 auto 0.5rem auto' }} />
                    <div>Loading {selectedDecade} songs catalog...</div>
                  </td>
                </tr>
              ) : filteredSongs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                    No songs match current filter.
                  </td>
                </tr>
              ) : (
                filteredSongs.map((song) => {
                  const isCurrent = botStatus.isRunning && botStatus.currentSong?.title === song.title;

                  return (
                    <tr key={song.rank} className={isCurrent ? 'bot-row-active' : ''}>
                      <td>
                        <span className="bot-rank-badge">#{song.rank}</span>
                      </td>
                      <td>
                        <div className="bot-song-title">{song.title}</div>
                      </td>
                      <td>
                        <div className="bot-song-artist">{song.artist}</div>
                      </td>
                      <td>
                        <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{song.year}</span>
                      </td>
                      <td>
                        {song.isArchived ? (
                          <span className="bot-status-pill archived">
                            <CheckCircle2 size={13} />
                            Archived (#{song.tracksheetId})
                          </span>
                        ) : isCurrent ? (
                          <span className="bot-status-pill generating">
                            <RefreshCw size={13} className="activity-spinning-disc" />
                            Harvesting...
                          </span>
                        ) : (
                          <span className="bot-status-pill pending">
                            <Clock size={13} />
                            Pending
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {song.isArchived ? (
                          <button
                            type="button"
                            className="bot-action-open"
                            onClick={() => onLoadTrack && onLoadTrack(song.tracksheetId)}
                            title="Open in Tracksheet Creator workspace"
                          >
                            <FileText size={13} /> Open Tracksheet
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="bot-action-generate"
                            onClick={() => handleGenerateSingle(song.title, song.artist)}
                            disabled={botStatus.isRunning}
                            title="Generate tracksheet for this song immediately"
                          >
                            <Sparkles size={13} /> Generate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
