import { useState } from 'react';
import { 
  Sliders, Mic2, Disc, FileText, CheckCircle2, AlertTriangle, 
  ExternalLink, Layers, Volume2, Cpu, Star, Radio, Zap, Activity,
  BarChart2, Table
} from 'lucide-react';

export default function LogbookDossierView({ data, daw }) {
  if (!data) return null;

  const [activeInstIdx, setActiveInstIdx] = useState(0);
  const [faderViewMode, setFaderViewMode] = useState('meters'); // 'meters' | 'table' | 'split'

  const {
    trackName,
    artistName,
    daw: parsedDaw,
    audioInterface,
    monitoring,
    trackTable,
    instruments,
    mixStrategy,
    masterBus
  } = data;

  const currentDaw = daw || parsedDaw || 'Logic Pro';
  const activeInstrument = instruments && instruments.length > 0 ? instruments[activeInstIdx] : null;

  const getDawColor = (dName) => {
    const d = (dName || '').toLowerCase();
    if (d.includes('logic')) return '#A855F7';
    if (d.includes('pro')) return '#38BDF8';
    if (d.includes('ableton')) return '#10B981';
    if (d.includes('cubase')) return '#EF4444';
    if (d.includes('bitwig')) return '#F59E0B';
    return '#8B5CF6';
  };

  const dawColor = getDawColor(currentDaw);

  // Format graphical dialled knob settings badge
  const renderSettingsBadge = (settingsStr) => {
    if (!settingsStr) return null;
    const badges = [...settingsStr.matchAll(/`([^`]+)`/g)];
    if (badges.length > 0) {
      return (
        <div className="logbook-knob-badges">
          {badges.map((b, idx) => (
            <span key={idx} className="logbook-knob-badge">{b[1]}</span>
          ))}
        </div>
      );
    }
    return <span style={{ color: '#38BDF8' }}>{settingsStr}</span>;
  };

  const getFaderTheme = (dbNum) => {
    const val = typeof dbNum === 'number' && !isNaN(dbNum) ? dbNum : 0;
    if (val >= -0.5) return { 
      badgeBg: 'rgba(239, 68, 68, 0.2)', 
      border: '#EF4444', 
      text: '#FCA5A5', 
      fillGradient: 'linear-gradient(90deg, #10B981 0%, #F59E0B 70%, #EF4444 100%)',
      glow: 'rgba(239, 68, 68, 0.4)' 
    };
    if (val >= -3.5) return { 
      badgeBg: 'rgba(56, 189, 248, 0.2)', 
      border: '#38BDF8', 
      text: '#7DD3FC', 
      fillGradient: 'linear-gradient(90deg, #10B981 0%, #0284C7 80%, #38BDF8 100%)',
      glow: 'rgba(56, 189, 248, 0.4)' 
    };
    if (val >= -6.5) return { 
      badgeBg: 'rgba(52, 211, 153, 0.2)', 
      border: '#34D399', 
      text: '#6EE7B7', 
      fillGradient: 'linear-gradient(90deg, #059669 0%, #10B981 80%, #34D399 100%)',
      glow: 'rgba(52, 211, 153, 0.4)' 
    };
    return { 
      badgeBg: 'rgba(192, 132, 252, 0.2)', 
      border: '#C084FC', 
      text: '#E9D5FF', 
      fillGradient: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 80%, #C084FC 100%)',
      glow: 'rgba(192, 132, 252, 0.4)' 
    };
  };

  const getFaderPct = (dbNum) => {
    const val = typeof dbNum === 'number' && !isNaN(dbNum) ? dbNum : -6.0;
    return Math.max(14, Math.min(100, Math.round(((val + 12) / 12) * 86 + 14)));
  };

  // Helper to parse embedded markdown table
  const parseMarkdownTable = (text) => {
    if (!text) return null;
    const tableMatch = text.match(/\|([^\n]+)\|\n\|[-| :]+\|\n((?:\|[^\n]+\|\n?)+)/);
    if (!tableMatch) return null;
    
    const headers = tableMatch[1].split('|').map(c => c.trim()).filter(Boolean);
    const rows = tableMatch[2].trim().split('\n').map(row => 
      row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
    );

    const beforeText = text.substring(0, tableMatch.index).trim();
    const afterText = text.substring(tableMatch.index + tableMatch[0].length).trim();

    return {
      headers,
      rows,
      beforeText,
      afterText
    };
  };

  // Helper to highlight audio parameter tokens (frequencies, levels, ratios, times, BPM)
  const renderFormattedAudioText = (rawStr) => {
    if (!rawStr) return null;
    const paramRegex = /([±+-]?\d+(?:\.\d+)?\s*(?:kHz|Hz|dBFS|dB|ms|s|BPM)|\b\d+(?:\.\d+)?:\d+\b|\b\d+\s*–\s*\d+\s*(?:kHz|Hz|dB)\b|\b\d+\s*to\s*\d+\s*(?:kHz|Hz|dB)\b)/gi;
    const parts = rawStr.split(paramRegex);
    return parts.map((part, idx) => {
      if (part && paramRegex.test(part)) {
        paramRegex.lastIndex = 0;
        return <span key={idx} className="logbook-param-token">{part}</span>;
      }
      return part;
    });
  };

  // Render structured mix strategy card content
  const renderMixCardContent = (rawText, accentColor) => {
    if (!rawText) return null;

    const tableData = parseMarkdownTable(rawText);

    const renderNarrativeBlocks = (content) => {
      if (!content) return null;
      const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

      return lines.map((line, idx) => {
        const cleanLine = line.replace(/^[•*-]\s*/, '');

        // Check for Markdown Subheading (e.g. ##### Subgroup Processing & Bus Glue)
        const subheadMatch = cleanLine.match(/^#{1,6}\s+(.*)$/);
        if (subheadMatch) {
          const subheadTitle = subheadMatch[1].replace(/[*#]/g, '').trim();
          return (
            <div key={idx} className="logbook-mix-block" style={{ marginTop: idx > 0 ? '0.65rem' : '0' }}>
              <span 
                className="logbook-mix-subhead-pill" 
                style={{ 
                  background: `${accentColor}18`, 
                  borderColor: `${accentColor}45`, 
                  color: accentColor 
                }}
              >
                {subheadTitle}
              </span>
            </div>
          );
        }

        // Check for Bold Title bullet: e.g. **Low-End Management (Kick vs. Bass):** text
        const boldTitleMatch = cleanLine.match(/^\*\*([^*]+)\*\*:?\s*(.*)$/);
        if (boldTitleMatch) {
          const title = boldTitleMatch[1].replace(/:$/, '').trim();
          const desc = boldTitleMatch[2].trim();
          return (
            <div key={idx} className="logbook-mix-block">
              <span 
                className="logbook-mix-subhead-pill" 
                style={{ 
                  background: `${accentColor}18`, 
                  borderColor: `${accentColor}45`, 
                  color: accentColor 
                }}
              >
                {title}
              </span>
              {desc && (
                <p className="logbook-mix-block-text">
                  {renderFormattedAudioText(desc)}
                </p>
              )}
            </div>
          );
        }

        // Check for Numbered Step item: e.g. 1. *Drums Subgroup:* text or 1. **Drums Subgroup:** text
        const numStepMatch = cleanLine.match(/^(\d+)\.\s*(?:\*\*|\*)?([^*:]+)(?:\*\*|\*)?:?\s*(.*)$/);
        if (numStepMatch) {
          const num = numStepMatch[1];
          const stepTitle = numStepMatch[2].trim();
          const stepDesc = numStepMatch[3].trim();
          return (
            <div key={idx} className="logbook-mix-step-item">
              <span 
                className="logbook-mix-step-num"
                style={{ background: `${accentColor}25`, borderColor: `${accentColor}55`, color: accentColor }}
              >
                {num}
              </span>
              <div className="logbook-mix-step-content">
                <strong className="logbook-mix-step-title">{stepTitle}</strong>
                {stepDesc && (
                  <span className="logbook-mix-block-text">
                    {renderFormattedAudioText(stepDesc)}
                  </span>
                )}
              </div>
            </div>
          );
        }

        // Check for Italic Stem bullet: e.g. *Lead Vocal:* text
        const stemMatch = cleanLine.match(/^\*([^*]+)\*:?\s*(.*)$/);
        if (stemMatch) {
          const stemName = stemMatch[1].replace(/:$/, '').trim();
          const stemDesc = stemMatch[2].trim();
          return (
            <div key={idx} className="logbook-mix-stem-row">
              <span className="logbook-mix-stem-pill">{stemName}</span>
              <span className="logbook-mix-block-text">
                {renderFormattedAudioText(stemDesc)}
              </span>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="logbook-mix-block-text" style={{ margin: '0.2rem 0' }}>
            {renderFormattedAudioText(cleanLine.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1'))}
          </p>
        );
      });
    };

    return (
      <>
        {tableData?.beforeText && renderNarrativeBlocks(tableData.beforeText)}

        {tableData && (
          <div className="table-wrapper" style={{ margin: '0.5rem 0', borderRadius: '8px' }}>
            <table className="logbook-master-table" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  {tableData.headers.map((th, hIdx) => (
                    <th key={hIdx} style={{ padding: '6px 8px' }}>{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((rowCells, rIdx) => (
                  <tr key={rIdx}>
                    {rowCells.map((cell, cIdx) => {
                      const dbMatch = cell.match(/([-+]?\d+(?:\.\d+)?)\s*dB/i);
                      if (dbMatch) {
                        const dbVal = parseFloat(dbMatch[1]);
                        const theme = getFaderTheme(dbVal);
                        return (
                          <td key={cIdx} style={{ textAlign: 'center', padding: '5px 8px' }}>
                            <span 
                              className="logbook-fader-badge" 
                              style={{ background: theme.badgeBg, borderColor: theme.border, color: theme.text, fontSize: '0.7rem' }}
                            >
                              {cell}
                            </span>
                          </td>
                        );
                      }
                      if (/center|pan\s*\d|hard\s*[lr]/i.test(cell) && cell.length < 25) {
                        return (
                          <td key={cIdx} style={{ textAlign: 'center', padding: '5px 8px' }}>
                            <span className="logbook-pan-pill" style={{ fontSize: '0.7rem' }}>{cell}</span>
                          </td>
                        );
                      }
                      if (cIdx === 0) {
                        return (
                          <td key={cIdx} style={{ padding: '5px 8px' }}>
                            <strong style={{ color: '#F8FAFC' }}>{cell}</strong>
                          </td>
                        );
                      }
                      return (
                        <td key={cIdx} style={{ padding: '5px 8px', color: '#CBD5E1' }}>
                          {renderFormattedAudioText(cell)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tableData?.afterText && renderNarrativeBlocks(tableData.afterText)}

        {!tableData && renderNarrativeBlocks(rawText)}
      </>
    );
  };

  // Helper to determine the specific capture pathway being used from the track list
  const getSelectedCaptureSolution = (inst) => {
    if (!inst) return null;

    // 1. Look up this instrument in the Section 2 trackTable
    let pathwayStr = '';
    if (trackTable && Array.isArray(trackTable)) {
      const matchedRow = trackTable.find(r => {
        const stemNorm = (r.stem || '').toLowerCase();
        const instNorm = (inst.name || '').toLowerCase();
        return stemNorm.includes(instNorm) || instNorm.includes(stemNorm);
      });
      if (matchedRow && matchedRow.pathway) {
        pathwayStr = matchedRow.pathway;
      }
    }

    // 2. Fall back to inst.preferredPathway if not found in trackTable
    if (!pathwayStr && inst.preferredPathway) {
      pathwayStr = inst.preferredPathway;
    }

    const norm = pathwayStr.toLowerCase();

    // Determine Pathway 1, 2, or 3 with precise boundary checks
    if (norm.includes('pathway 1') || /\bp1\b/.test(norm) || norm.includes('acoustic') || norm.includes('microphone')) {
      return {
        num: 1,
        title: 'Pathway 1: Acoustic / Microphone Capture',
        body: inst.pathway1 || inst.pathway2 || inst.pathway3
      };
    }
    if (norm.includes('pathway 3') || /\bp3\b/.test(norm) || norm.includes('midi') || norm.includes('software instrument') || norm.includes('audio instrument')) {
      return {
        num: 3,
        title: 'Pathway 3: Audio Instruments & MIDI',
        body: inst.pathway3 || inst.pathway2 || inst.pathway1
      };
    }
    if (norm.includes('pathway 2') || /\bp2\b/.test(norm) || norm.includes('direct injection') || /\bdi\b/.test(norm) || norm.includes('line input')) {
      return {
        num: 2,
        title: 'Pathway 2: Direct Injection (DI) & Line Input',
        body: inst.pathway2 || inst.pathway1 || inst.pathway3
      };
    }

    // Default fallback: Preferred pathway or whichever pathway has content
    if (inst.pathway1) return { num: 1, title: 'Pathway 1: Acoustic / Microphone Capture', body: inst.pathway1 };
    if (inst.pathway2) return { num: 2, title: 'Pathway 2: Direct Injection (DI) & Line Input', body: inst.pathway2 };
    if (inst.pathway3) return { num: 3, title: 'Pathway 3: Audio Instruments & MIDI', body: inst.pathway3 };

    return null;
  };

  return (
    <div className="logbook-dossier-container">
      {/* 1. Hero Examination & Production Metadata Card */}
      <div className="logbook-hero-card glass-panel" style={{ '--daw-accent': dawColor }}>
        <div className="logbook-hero-top">
          <div className="logbook-exam-pill">
            <Star size={14} fill="#FBBF24" color="#FBBF24" />
            <span>A-LEVEL MUSIC TECHNOLOGY • COMPONENT 1: RECORDING (9MT0/01)</span>
          </div>
          <div className="logbook-daw-badge" style={{ backgroundColor: `${dawColor}22`, borderColor: dawColor, color: dawColor }}>
            <Sliders size={14} />
            <span>{currentDaw}</span>
          </div>
        </div>

        <div className="logbook-hero-main">
          <div>
            <h1 className="logbook-track-title">{trackName || 'Component 1 Recording'}</h1>
            {artistName && <h2 className="logbook-artist-name">{artistName}</h2>}
            <p className="logbook-hero-desc">
              Complete Official Exam Recording Logbook with 3-Pathway Instrumental Solutions, Master Track Sheet, and {currentDaw} Channel Strip Insert Chains.
            </p>
          </div>

          <div className="logbook-hero-stats">
            <div className="logbook-stat-box">
              <span className="logbook-stat-label">AUDIO INTERFACE & CLOCK</span>
              <span className="logbook-stat-val">{audioInterface || '24-bit / 48 kHz Pro Audio Interface'}</span>
            </div>
            <div className="logbook-stat-box">
              <span className="logbook-stat-label">MONITORING ENVIRONMENT</span>
              <span className="logbook-stat-val">{monitoring || 'Calibrated Nearfield Monitors & Headphones'}</span>
            </div>
            <div className="logbook-stat-box">
              <span className="logbook-stat-label">COURSEWORK TARGET</span>
              <span className="logbook-stat-val" style={{ color: '#34D399' }}>Top-Band AO1 (Acoustic Capture)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section 2: Master Track Sheet & Input Routing Matrix */}
      {trackTable && trackTable.length > 0 && (
        <div className="logbook-section-card glass-panel">
          <div className="logbook-sec-header">
            <div className="logbook-sec-title-wrap">
              <Activity size={20} color="#38BDF8" />
              <h3 className="logbook-sec-title">Section 2: Master Track Sheet & Input Routing Table</h3>
            </div>
            <span className="logbook-sec-pill">{trackTable.length} Channels Allocated</span>
          </div>

          <div className="table-wrapper">
            <table className="logbook-table">
              <thead>
                <tr>
                  <th style={{ width: '45px', textAlign: 'center' }}>TRK #</th>
                  <th>STEM / INSTRUMENT</th>
                  <th>SELECTED PATHWAY</th>
                  <th>TRANSDUCER / INPUT SOURCE</th>
                  <th>DAW INPUT / TYPE</th>
                  <th style={{ textAlign: 'center' }}>PAN</th>
                  <th style={{ textAlign: 'center' }}>FADER</th>
                  <th style={{ textAlign: 'right' }}>HEADROOM</th>
                </tr>
              </thead>
              <tbody>
                {trackTable.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center' }}>
                      <span className="logbook-trk-pill">{row.trackNo}</span>
                    </td>
                    <td><strong style={{ color: '#F8FAFC' }}>{row.stem}</strong></td>
                    <td>
                      <span className={`logbook-pathway-pill ${row.pathway.includes('1') ? 'p1' : row.pathway.includes('2') ? 'p2' : 'p3'}`}>
                        {row.pathway}
                      </span>
                    </td>
                    <td style={{ color: '#DDD6FE' }}>{row.inputSource}</td>
                    <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{row.dawInput}</td>
                    <td style={{ textAlign: 'center', color: '#38BDF8', fontWeight: 600 }}>{row.pan}</td>
                    <td style={{ textAlign: 'center', color: '#FBBF24', fontWeight: 600 }}>{row.fader}</td>
                    <td style={{ textAlign: 'right', color: '#34D399', fontWeight: 600 }}>{row.targetHeadroom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Section 3: Interactive 3-Pathway Instrumental Solutions Hub */}
      {instruments && instruments.length > 0 && (
        <div className="logbook-section-card glass-panel">
          <div className="logbook-sec-header">
            <div className="logbook-sec-title-wrap">
              <Layers size={20} color="#C084FC" />
              <h3 className="logbook-sec-title">Section 3: Instrument-by-Instrument 3-Pathway Solutions</h3>
            </div>
            <span className="logbook-sec-pill">{instruments.length} Core Stems</span>
          </div>

          {/* Instrument Selector Tabs */}
          <div className="logbook-inst-tabs">
            {instruments.map((inst, idx) => (
              <button
                key={idx}
                type="button"
                className={`logbook-inst-tab-btn ${activeInstIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveInstIdx(idx)}
              >
                <span className="logbook-inst-num">{idx + 1}</span>
                <span className="logbook-inst-name">{inst.name}</span>
              </button>
            ))}
          </div>

          {/* Active Instrument Dedicated Sections */}
          {activeInstrument && (
            <div className="logbook-inst-hub">
              {/* Dedicated Section: Instrumental Capture Procedure (Preferred Pathway Only) */}
              {(() => {
                const selected = getSelectedCaptureSolution(activeInstrument);
                if (!selected || !selected.body) return null;

                const headerClass = selected.num === 1 ? 'p1' : selected.num === 2 ? 'p2' : 'p3';
                const HeaderIcon = selected.num === 1 ? Mic2 : selected.num === 2 ? Zap : Radio;
                const prefPathwayTitle = activeInstrument.preferredPathway || selected.title;

                return (
                  <div className="logbook-dedicated-section preferred-capture-section">
                    <div className="logbook-section-card-title">
                      <div className="logbook-card-title-left">
                        <HeaderIcon size={18} color={selected.num === 1 ? '#38BDF8' : selected.num === 2 ? '#FBBF24' : '#C084FC'} />
                        <span>Instrumental Capture Procedure: {activeInstrument.name}</span>
                      </div>
                      <span className="logbook-badge-pref">⭐ Preferred Pathway: {selected.title.split(':')[0]}</span>
                    </div>

                    <div className="logbook-preferred-capture-card">
                      {/* Preferred Declaration & Edexcel Justification Banner */}
                      <div className="logbook-preferred-banner">
                        <div className="logbook-preferred-title-highlight">
                          <Star size={15} fill="#FBBF24" color="#FBBF24" />
                          <span>Selected Preferred Pathway: <strong>{prefPathwayTitle}</strong></span>
                        </div>
                        {activeInstrument.preferredJustification && (
                          <div className="logbook-preferred-justification-block">
                            <span className="logbook-justification-label">Pearson Edexcel Component 1 Mark Scheme Justification:</span>
                            <p className="logbook-justification-text">{activeInstrument.preferredJustification}</p>
                          </div>
                        )}
                      </div>

                      {/* Step-by-Step Capture Procedure & Acoustic Setup */}
                      <div className="logbook-capture-procedure-box">
                        <div className={`logbook-p-header ${headerClass}`}>
                          <HeaderIcon size={16} />
                          <span>{selected.title} — Signal Chain & Acoustic Capture Procedure</span>
                          <span className="logbook-badge-pref" style={{ marginLeft: 'auto', fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
                            ✓ Official C1 Submission
                          </span>
                        </div>
                        <div className="logbook-p-body" style={{ fontSize: '0.88rem', lineHeight: '1.65', padding: '1rem' }}>
                          {selected.body.split('\n').map((line, lIdx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            const clean = trimmed.replace(/^[•*-]\s*/, '');
                            
                            // Check for Bold Title bullet: e.g. **Transducer Category & Model:** text
                            const boldBulletMatch = clean.match(/^\*\*([^*]+)\*\*:?\s*(.*)$/);
                            if (boldBulletMatch) {
                              const bTitle = boldBulletMatch[1].replace(/:$/, '').trim();
                              const bDesc = boldBulletMatch[2].trim();
                              return (
                                <div key={lIdx} style={{ margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                  <span style={{ color: selected.num === 1 ? '#38BDF8' : selected.num === 2 ? '#FBBF24' : '#C084FC', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                                    {bTitle}
                                  </span>
                                  {bDesc && (
                                    <p style={{ margin: 0, color: '#E2E8F0' }}>
                                      {renderFormattedAudioText(bDesc)}
                                    </p>
                                  )}
                                </div>
                              );
                            }

                            // Subhead check
                            if (/^#{1,6}\s+/.test(clean)) {
                              return (
                                <div key={lIdx} style={{ margin: '0.6rem 0 0.3rem 0' }}>
                                  <strong style={{ color: '#F8FAFC', fontSize: '0.9rem' }}>
                                    {clean.replace(/^#{1,6}\s+/, '')}
                                  </strong>
                                </div>
                              );
                            }

                            return (
                              <p key={lIdx} style={{ margin: '0.35rem 0', color: '#CBD5E1' }}>
                                {renderFormattedAudioText(clean)}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 3. Dedicated Section: Channel Strip Insert Chain Table */}
              {activeInstrument.channelStrip && activeInstrument.channelStrip.length > 0 && (
                <div className="logbook-dedicated-section channel-strip-section">
                  <div className="logbook-section-card-title">
                    <div className="logbook-card-title-left">
                      <Sliders size={18} color="#38BDF8" />
                      <span>{currentDaw} Channel Strip Insert Chain: {activeInstrument.name}</span>
                    </div>
                    <span className="logbook-section-pill">{activeInstrument.channelStrip.length} Inserts</span>
                  </div>

                  <div className="table-wrapper" style={{ margin: '0.75rem 0' }}>
                    <table className="logbook-strip-table">
                      <thead>
                        <tr>
                          <th style={{ width: '80px' }}>ORDER</th>
                          <th>PROCESSOR / PLUGIN</th>
                          <th>TYPE & CIRCUIT</th>
                          <th>DIALLED SETTINGS / KNOBS</th>
                          <th>TECHNICAL OBJECTIVE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeInstrument.channelStrip.map((row, rIdx) => (
                          <tr key={rIdx}>
                            <td><span className="logbook-slot-pill">{row.slot}</span></td>
                            <td><strong style={{ color: '#F8FAFC' }}>{row.plugin}</strong></td>
                            <td style={{ color: '#C084FC', fontSize: '0.82rem' }}>{row.type}</td>
                            <td>{renderSettingsBadge(row.settings)}</td>
                            <td style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>{row.objective}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. Dedicated Section: Crucial Examiner Pitfall & Marking Traps */}
              {activeInstrument.examinerPitfall && (
                <div className="logbook-dedicated-section pitfall-section">
                  <div className="logbook-section-card-title pitfall-title">
                    <div className="logbook-card-title-left">
                      <AlertTriangle size={18} color="#EF4444" />
                      <span>CRUCIAL EXAMINER PITFALLS & MARKING TRAPS</span>
                    </div>
                    <span className="logbook-badge-pitfall">Edexcel Marking Penalty Alert</span>
                  </div>
                  <div className="logbook-pitfall-body-card">
                    <p className="logbook-pitfall-text">{activeInstrument.examinerPitfall}</p>
                  </div>
                </div>
              )}

              {/* 5. Dedicated Section: Modern 3rd-Party Alternatives */}
              {activeInstrument.thirdParty && activeInstrument.thirdParty.length > 0 && (
                <div className="logbook-dedicated-section modern-alts-section">
                  <div className="logbook-section-card-title alts-title">
                    <div className="logbook-card-title-left">
                      <Zap size={18} color="#A855F7" />
                      <span>MODERN 3RD-PARTY PLUGIN ALTERNATIVES</span>
                    </div>
                    <span className="logbook-badge-alts">Industry Standard Gear</span>
                  </div>
                  <div className="logbook-alts-body-card">
                    <div className="logbook-tp-links">
                      {activeInstrument.thirdParty.map((tp, tpIdx) => (
                        tp.url ? (
                          <a key={tpIdx} href={tp.url} target="_blank" rel="noopener noreferrer" className="logbook-tp-badge">
                            <ExternalLink size={12} /> {tp.name}
                          </a>
                        ) : (
                          <span key={tpIdx} className="logbook-tp-badge">{tp.name}</span>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Section 4: Comprehensive Mix Strategy & Mastering Suite */}
      {(mixStrategy || masterBus) && (
        <div className="logbook-section-card glass-panel">
          <div className="logbook-sec-header">
            <div className="logbook-sec-title-wrap">
              <Cpu size={20} color="#34D399" />
              <h3 className="logbook-sec-title">Section 4: Comprehensive Mix Strategy & Mastering Suite</h3>
            </div>
            <span className="logbook-sec-pill">Production Architecture</span>
          </div>

          {/* 4.1 to 4.4: Mixdown Engineering Strategy Grid */}
          {mixStrategy && (mixStrategy.philosophy || mixStrategy.frequencySeparation || mixStrategy.dynamicControl || mixStrategy.spatialDepth || mixStrategy.automation) && (
            <div className="logbook-mix-strategy-container">
              <div className="logbook-section-card-title" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                <div className="logbook-card-title-left">
                  <Sliders size={18} color="#38BDF8" />
                  <span>Mixdown Engineering Strategy & Staging Architecture</span>
                </div>
                <span className="logbook-section-pill">Staging & Balance</span>
              </div>

              {/* 4.1 Featured Card: Fader Hierarchy, Balance & Stereo Staging */}
              {(mixStrategy.faderHierarchy?.length > 0 || mixStrategy.philosophy) && (
                <div className="logbook-fader-card">
                  <div className="logbook-fader-card-header">
                    <div className="logbook-card-title-left">
                      <Sliders size={16} color="#38BDF8" />
                      <span>4.1 Mix Balance, Fader Hierarchy & Stereo Staging</span>
                    </div>
                    {mixStrategy.faderHierarchy?.length > 0 && (
                      <div className="logbook-view-toggle">
                        <button 
                          type="button"
                          className={`logbook-view-toggle-btn ${faderViewMode === 'meters' ? 'active' : ''}`}
                          onClick={() => setFaderViewMode('meters')}
                          title="Console Fader Meters"
                        >
                          <BarChart2 size={13} />
                          <span>Console Faders</span>
                        </button>
                        <button 
                          type="button"
                          className={`logbook-view-toggle-btn ${faderViewMode === 'table' ? 'active' : ''}`}
                          onClick={() => setFaderViewMode('table')}
                          title="Staging Table"
                        >
                          <Table size={13} />
                          <span>Staging Table</span>
                        </button>
                        <button 
                          type="button"
                          className={`logbook-view-toggle-btn ${faderViewMode === 'split' ? 'active' : ''}`}
                          onClick={() => setFaderViewMode('split')}
                          title="Split Dual View"
                        >
                          <span>Split View</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Philosophy narrative overview */}
                  {mixStrategy.philosophy && (
                    <div className="logbook-philosophy-banner">
                      {mixStrategy.philosophy.split('\n').map((line, idx) => (
                        <p key={idx}>{line.replace(/^\s*[•*]\s*/, '• ')}</p>
                      ))}
                    </div>
                  )}

                  {/* Visual Console Fader Bank */}
                  {mixStrategy.faderHierarchy?.length > 0 && (faderViewMode === 'meters' || faderViewMode === 'split') && (
                    <div className="logbook-fader-console">
                      <div className="logbook-fader-console-header">
                        <span className="logbook-fader-col-stem">Stem / Instrument</span>
                        <span className="logbook-fader-col-level">Target Level</span>
                        <span className="logbook-fader-col-meter">Console Fader Meter (0 to -12 dB)</span>
                        <span className="logbook-fader-col-pan">Stereo Pan</span>
                        <span className="logbook-fader-col-role">Mix Role & Staging</span>
                      </div>
                      <div className="logbook-fader-console-body">
                        {mixStrategy.faderHierarchy.map((item, fIdx) => {
                          const theme = getFaderTheme(item.dbNum);
                          const pct = getFaderPct(item.dbNum);
                          return (
                            <div key={fIdx} className="logbook-fader-row">
                              <div className="logbook-fader-col-stem">
                                <span className="logbook-fader-stem-name">{item.element}</span>
                              </div>
                              <div className="logbook-fader-col-level">
                                <span 
                                  className="logbook-fader-badge" 
                                  style={{ background: theme.badgeBg, borderColor: theme.border, color: theme.text }}
                                >
                                  {item.faderLevel}
                                </span>
                              </div>
                              <div className="logbook-fader-col-meter">
                                <div className="logbook-fader-track">
                                  <div 
                                    className="logbook-fader-fill" 
                                    style={{ width: `${pct}%`, background: theme.fillGradient, boxShadow: `0 0 10px ${theme.glow}` }}
                                  />
                                  <div 
                                    className="logbook-fader-thumb" 
                                    style={{ left: `calc(${pct}% - 7px)` }}
                                  />
                                  <div className="logbook-fader-ticks">
                                    <span>-12</span>
                                    <span>-9</span>
                                    <span>-6</span>
                                    <span>-3</span>
                                    <span style={{ color: '#EF4444', fontWeight: 700 }}>0 dB</span>
                                  </div>
                                </div>
                              </div>
                              <div className="logbook-fader-col-pan">
                                <span className="logbook-pan-pill">
                                  {item.pan || 'Center (0)'}
                                </span>
                              </div>
                              <div 
                                className="logbook-fader-col-role"
                                title={[item.role, item.staging && item.staging !== 'Mix Staging' && item.staging !== item.role ? item.staging : null].filter(Boolean).join(' • ') || item.role || item.staging || 'Mix Element'}
                              >
                                <span className="logbook-role-text">
                                  {[item.role, item.staging && item.staging !== 'Mix Staging' && item.staging !== item.role ? item.staging : null].filter(Boolean).join(' • ') || item.role || item.staging || 'Mix Element'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Structured Fader Table View */}
                  {mixStrategy.faderHierarchy?.length > 0 && (faderViewMode === 'table' || faderViewMode === 'split') && (
                    <div className="table-wrapper" style={{ marginTop: faderViewMode === 'split' ? '1.25rem' : '0.5rem' }}>
                      <table className="logbook-master-table">
                        <thead>
                          <tr>
                            <th style={{ width: '180px' }}>Stem / Instrument</th>
                            <th style={{ width: '110px', textAlign: 'center' }}>Target Level</th>
                            <th style={{ width: '140px' }}>Meter Level</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>Stereo Pan</th>
                            <th>Dynamic & Frequency Role</th>
                            <th>Spatial Staging</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mixStrategy.faderHierarchy.map((row, rIdx) => {
                            const theme = getFaderTheme(row.dbNum);
                            const pct = getFaderPct(row.dbNum);
                            return (
                              <tr key={rIdx}>
                                <td><strong style={{ color: '#F8FAFC' }}>{row.element}</strong></td>
                                <td style={{ textAlign: 'center' }}>
                                  <span 
                                    className="logbook-fader-badge" 
                                    style={{ background: theme.badgeBg, borderColor: theme.border, color: theme.text }}
                                  >
                                    {row.faderLevel}
                                  </span>
                                </td>
                                <td>
                                  <div className="logbook-mini-meter">
                                    <div 
                                      className="logbook-mini-meter-fill" 
                                      style={{ width: `${pct}%`, background: theme.fillGradient }} 
                                    />
                                  </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <span className="logbook-pan-pill">{row.pan}</span>
                                </td>
                                <td style={{ color: '#CBD5E1', fontSize: '0.84rem' }}>{row.role || '—'}</td>
                                <td style={{ color: '#94A3B8', fontSize: '0.82rem' }}>{row.staging || 'Mix Staging'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div className="logbook-mix-grid" style={{ marginTop: '1.25rem' }}>

                {mixStrategy.frequencySeparation && (
                  <div className="logbook-mix-card" style={{ borderColor: 'rgba(192, 132, 252, 0.28)' }}>
                    <div className="logbook-mix-card-header">
                      <div className="logbook-mix-card-title-group">
                        <div className="logbook-mix-card-icon-wrap" style={{ background: 'rgba(192, 132, 252, 0.15)', borderColor: 'rgba(192, 132, 252, 0.4)' }}>
                          <Activity size={16} color="#C084FC" />
                        </div>
                        <span className="logbook-mix-card-title">Frequency Masking Management & Spectral Separation</span>
                      </div>
                      <span className="logbook-mix-card-tag" style={{ background: 'rgba(192, 132, 252, 0.12)', color: '#C084FC', borderColor: 'rgba(192, 132, 252, 0.3)' }}>
                        EQ & Pocketing
                      </span>
                    </div>
                    <div className="logbook-mix-card-body">
                      {renderMixCardContent(mixStrategy.frequencySeparation, '#C084FC')}
                    </div>
                  </div>
                )}

                {mixStrategy.dynamicControl && (
                  <div className="logbook-mix-card" style={{ borderColor: 'rgba(251, 191, 36, 0.28)' }}>
                    <div className="logbook-mix-card-header">
                      <div className="logbook-mix-card-title-group">
                        <div className="logbook-mix-card-icon-wrap" style={{ background: 'rgba(251, 191, 36, 0.15)', borderColor: 'rgba(251, 191, 36, 0.4)' }}>
                          <Volume2 size={16} color="#FBBF24" />
                        </div>
                        <span className="logbook-mix-card-title">Dynamic Control, Mix Subgroups & Bus Glue</span>
                      </div>
                      <span className="logbook-mix-card-tag" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#FBBF24', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                        VCA & Subgroups
                      </span>
                    </div>
                    <div className="logbook-mix-card-body">
                      {renderMixCardContent(mixStrategy.dynamicControl, '#FBBF24')}
                    </div>
                  </div>
                )}

                {mixStrategy.spatialDepth && (
                  <div className="logbook-mix-card" style={{ borderColor: 'rgba(52, 211, 153, 0.28)' }}>
                    <div className="logbook-mix-card-header">
                      <div className="logbook-mix-card-title-group">
                        <div className="logbook-mix-card-icon-wrap" style={{ background: 'rgba(52, 211, 153, 0.15)', borderColor: 'rgba(52, 211, 153, 0.4)' }}>
                          <Disc size={16} color="#34D399" />
                        </div>
                        <span className="logbook-mix-card-title">Spatial Depth & Time-Based FX Architecture</span>
                      </div>
                      <span className="logbook-mix-card-tag" style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#34D399', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                        Reverb & Delays
                      </span>
                    </div>
                    <div className="logbook-mix-card-body">
                      {renderMixCardContent(mixStrategy.spatialDepth, '#34D399')}
                    </div>
                  </div>
                )}

                {mixStrategy.automation && (
                  <div className="logbook-mix-card" style={{ borderColor: 'rgba(244, 114, 182, 0.28)' }}>
                    <div className="logbook-mix-card-header">
                      <div className="logbook-mix-card-title-group">
                        <div className="logbook-mix-card-icon-wrap" style={{ background: 'rgba(244, 114, 182, 0.15)', borderColor: 'rgba(244, 114, 182, 0.4)' }}>
                          <Zap size={16} color="#F472B6" />
                        </div>
                        <span className="logbook-mix-card-title">Mix Automation Passes & Dynamic Rides</span>
                      </div>
                      <span className="logbook-mix-card-tag" style={{ background: 'rgba(244, 114, 182, 0.12)', color: '#F472B6', borderColor: 'rgba(244, 114, 182, 0.3)' }}>
                        Fader Passes
                      </span>
                    </div>
                    <div className="logbook-mix-card-body">
                      {renderMixCardContent(mixStrategy.automation, '#F472B6')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4.5: Master Bus Processing Chain Table */}
          {masterBus && masterBus.table && masterBus.table.length > 0 && (
            <div className="logbook-master-table-container">
              <div className="logbook-section-card-title" style={{ marginTop: '1.75rem', marginBottom: '0.75rem' }}>
                <div className="logbook-card-title-left">
                  <Cpu size={18} color="#34D399" />
                  <span>Master Bus Processing & Final Mastering Chain ({currentDaw})</span>
                </div>
                <span className="logbook-section-pill">{masterBus.table.length} Stages</span>
              </div>

              <div className="table-wrapper">
                <table className="logbook-master-table">
                  <thead>
                    <tr>
                      <th style={{ width: '180px' }}>Processing Stage</th>
                      <th style={{ width: '220px' }}>Plugin / Processor</th>
                      <th>Exact Parameter Settings</th>
                      <th>Technical Objective</th>
                    </tr>
                  </thead>
                  <tbody>
                    {masterBus.table.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td><strong style={{ color: '#F8FAFC' }}>{row.stage}</strong></td>
                        <td style={{ color: '#38BDF8', fontWeight: 600 }}>{row.processor}</td>
                        <td>{renderSettingsBadge(row.settings)}</td>
                        <td style={{ color: '#CBD5E1', fontSize: '0.84rem' }}>{row.objective}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Master Bus Legacy Fallback Grid */}
          {(!masterBus?.table || masterBus.table.length === 0) && masterBus && (masterBus.mixBusChain || masterBus.limiting) && (
            <div className="logbook-master-grid" style={{ marginTop: '1.25rem' }}>
              {masterBus.mixBusChain && (
                <div className="logbook-master-card">
                  <div className="logbook-master-card-title">Mix Bus Insert Chain & Glue Compression</div>
                  <div className="logbook-master-body">
                    {masterBus.mixBusChain.split('\n').map((line, lIdx) => (
                      <p key={lIdx} style={{ margin: '0.35rem 0' }}>{line.replace(/^\*\s+/, '')}</p>
                    ))}
                  </div>
                </div>
              )}

              {masterBus.limiting && (
                <div className="logbook-master-card">
                  <div className="logbook-master-card-title">Master Limiting, Ceiling & Target Headroom</div>
                  <div className="logbook-master-body">
                    {masterBus.limiting.split('\n').map((line, lIdx) => (
                      <p key={lIdx} style={{ margin: '0.35rem 0' }}>{line.replace(/^\*\s+/, '')}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coursework Compliance & Loudness Targets */}
          <div className="logbook-compliance-banner">
            <div className="logbook-compliance-header">
              <CheckCircle2 size={16} color="#34D399" />
              <span>Pearson Edexcel Component 1 Coursework Loudness & Dynamic Range Compliance</span>
            </div>
            <div className="logbook-compliance-grid">
              <div className="logbook-compliance-item">
                <span className="logbook-comp-label">TRUE PEAK CEILING</span>
                <span className="logbook-comp-val" style={{ color: '#38BDF8' }}>-1.0 dBFS True Peak</span>
                <span className="logbook-comp-sub">Guarantees zero inter-sample clipping on DAC moderation playback</span>
              </div>
              <div className="logbook-compliance-item">
                <span className="logbook-comp-label">INTEGRATED LOUDNESS</span>
                <span className="logbook-comp-val" style={{ color: '#FBBF24' }}>-14 to -16 LUFS Integrated</span>
                <span className="logbook-comp-sub">Preserves natural acoustic dynamics required for high-band AO2 marks</span>
              </div>
              <div className="logbook-compliance-item">
                <span className="logbook-comp-label">MONO COMPATIBILITY</span>
                <span className="logbook-comp-val" style={{ color: '#34D399' }}>Phase Correlation +0.7 to +1.0</span>
                <span className="logbook-comp-sub">Monitored via Correlation Meter; sub-bass mono below 100 Hz</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
