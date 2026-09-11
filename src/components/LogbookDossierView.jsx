import { useState } from 'react';
import { 
  Sliders, Mic2, Disc, FileText, CheckCircle2, AlertTriangle, 
  ExternalLink, Layers, Volume2, Cpu, Star, Radio, Zap, Activity
} from 'lucide-react';

export default function LogbookDossierView({ data, daw }) {
  if (!data) return null;

  const [activeInstIdx, setActiveInstIdx] = useState(0);

  const {
    trackName,
    artistName,
    daw: parsedDaw,
    audioInterface,
    monitoring,
    trackTable,
    instruments,
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

          {/* Active Instrument 3-Pathway Display */}
          {activeInstrument && (
            <div className="logbook-inst-hub">
              {/* Preferred Exam Pathway Callout */}
              {activeInstrument.preferredPathway && (
                <div className="logbook-preferred-banner">
                  <div className="logbook-pref-header">
                    <Star size={18} fill="#FBBF24" color="#FBBF24" />
                    <span className="logbook-pref-title">
                      ⭐ PREFERRED COURSEWORK PATHWAY: <strong>{activeInstrument.preferredPathway}</strong>
                    </span>
                  </div>
                  {activeInstrument.preferredJustification && (
                    <p className="logbook-pref-desc">
                      <strong>Mark Scheme Justification:</strong> {activeInstrument.preferredJustification}
                    </p>
                  )}
                </div>
              )}

              {/* 3 Pathways Comparison Grid */}
              <div className="logbook-pathways-grid">
                {activeInstrument.pathway1 && (
                  <div className="logbook-pathway-card">
                    <div className="logbook-p-header p1">
                      <Mic2 size={16} />
                      <span>Pathway 1: Acoustic / Microphone Capture</span>
                    </div>
                    <div className="logbook-p-body">
                      {activeInstrument.pathway1}
                    </div>
                  </div>
                )}

                {activeInstrument.pathway2 && (
                  <div className="logbook-pathway-card">
                    <div className="logbook-p-header p2">
                      <Zap size={16} />
                      <span>Pathway 2: Direct Injection (DI) & Line Input</span>
                    </div>
                    <div className="logbook-p-body">
                      {activeInstrument.pathway2}
                    </div>
                  </div>
                )}

                {activeInstrument.pathway3 && (
                  <div className="logbook-pathway-card">
                    <div className="logbook-p-header p3">
                      <Radio size={16} />
                      <span>Pathway 3: Audio Instruments & MIDI</span>
                    </div>
                    <div className="logbook-p-body">
                      {activeInstrument.pathway3}
                    </div>
                  </div>
                )}
              </div>

              {/* Channel Strip Insert Chain Table */}
              {activeInstrument.channelStrip && activeInstrument.channelStrip.length > 0 && (
                <div className="logbook-channel-strip-box">
                  <div className="logbook-box-title">
                    <Sliders size={16} color="#38BDF8" />
                    <span>{currentDaw} Channel Strip Insert Chain: {activeInstrument.name}</span>
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

              {/* 3rd-Party Alternatives & Examiner Pitfall Footer */}
              <div className="logbook-inst-footer">
                {activeInstrument.thirdParty && activeInstrument.thirdParty.length > 0 && (
                  <div className="logbook-thirdparty-box">
                    <span className="logbook-footer-label">Recommended 3rd-Party Alternatives:</span>
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
                )}

                {activeInstrument.examinerPitfall && (
                  <div className="logbook-pitfall-box">
                    <div className="logbook-pitfall-header">
                      <AlertTriangle size={16} color="#F87171" />
                      <span>CRUCIAL EXAMINER PITFALL & MARKING TRAP</span>
                    </div>
                    <p className="logbook-pitfall-text">{activeInstrument.examinerPitfall}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Section 4: Mixdown & Master Bus Processing Suite */}
      {masterBus && (masterBus.mixBusChain || masterBus.limiting) && (
        <div className="logbook-section-card glass-panel">
          <div className="logbook-sec-header">
            <div className="logbook-sec-title-wrap">
              <Cpu size={20} color="#34D399" />
              <h3 className="logbook-sec-title">Section 4: Mixdown & Master Bus Processing Log</h3>
            </div>
            <span className="logbook-sec-pill">Mastering Chain</span>
          </div>

          <div className="logbook-master-grid">
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
        </div>
      )}
    </div>
  );
}
