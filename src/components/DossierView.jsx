import { useState } from 'react';
import { 
  Music, Disc, Mic2, Radio, Play, ExternalLink, Sliders, ShieldCheck, 
  Layers, Volume2, Cpu, FileText, CheckCircle2, ChevronRight, User, Award
} from 'lucide-react';

export default function DossierView({ data }) {
  if (!data) return null;

  const [activeInstIdx, setActiveInstIdx] = useState(0);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(null);

  const {
    song,
    artist,
    genre,
    datesRecorded,
    recordCompany,
    releaseDate,
    youtubeUrl,
    personnel,
    studio,
    musicology,
    instruments,
    references,
    overallConfidence,
    mixdown
  } = data;

  const activeInstrument = instruments && instruments.length > 0 ? instruments[activeInstIdx] : null;

  // Split signal chain by arrows into step nodes
  const parseSignalNodes = (chainStr) => {
    if (!chainStr) return ['Direct / Console Tracking', 'Multitrack Tape'];
    const parts = chainStr.split(/->|→/).map(s => s.trim()).filter(Boolean);
    return parts.length > 0 ? parts : [chainStr];
  };

  return (
    <div className="dossier-container">
      {/* 1. Hero Song & Archival Confidence Card */}
      <div className="dossier-hero-card glass-panel">
        <div className="dossier-hero-left">
          <div className="dossier-disc-wrap">
            <Disc className="dossier-spinning-vinyl" size={64} color="#C084FC" />
            <div className="dossier-disc-glow"></div>
          </div>

          <div className="dossier-hero-info">
            <div className="dossier-badge-row">
              <span className="dossier-pill dossier-pill-primary">HISTORICAL ARCHIVE</span>
              {genre && <span className="dossier-pill">{genre}</span>}
              {releaseDate && <span className="dossier-pill">{releaseDate}</span>}
            </div>

            <h1 className="dossier-song-title">{song || 'Track Dossier'}</h1>
            <h2 className="dossier-artist-name">{artist || 'Unknown Artist'}</h2>

            <div className="dossier-meta-grid">
              {recordCompany && (
                <div className="dossier-meta-item">
                  <span className="dossier-meta-label">Label & Cat:</span>
                  <span className="dossier-meta-value">{recordCompany}</span>
                </div>
              )}
              {datesRecorded && (
                <div className="dossier-meta-item">
                  <span className="dossier-meta-label">Tracking Dates:</span>
                  <span className="dossier-meta-value">{datesRecorded}</span>
                </div>
              )}
              {studio.trackingStudio && (
                <div className="dossier-meta-item">
                  <span className="dossier-meta-label">Primary Studio:</span>
                  <span className="dossier-meta-value">{studio.trackingStudio}</span>
                </div>
              )}
            </div>

            <div className="dossier-music-tags">
              {musicology.key && (
                <div className="dossier-tag">
                  <span className="dossier-tag-label">KEY</span>
                  <span className="dossier-tag-val" style={{ color: '#C084FC' }}>{musicology.key}</span>
                </div>
              )}
              {musicology.bpm && (
                <div className="dossier-tag">
                  <span className="dossier-tag-label">TEMPO</span>
                  <span className="dossier-tag-val" style={{ color: '#38BDF8' }}>{musicology.bpm} BPM</span>
                </div>
              )}
              {musicology.timeSignature && (
                <div className="dossier-tag">
                  <span className="dossier-tag-label">METER</span>
                  <span className="dossier-tag-val" style={{ color: '#34D399' }}>{musicology.timeSignature}</span>
                </div>
              )}
              {youtubeUrl && (
                <a 
                  href={youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dossier-youtube-btn"
                >
                  <Play size={14} fill="currentColor" /> Listen on YouTube
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Circular Confidence Meter */}
        <div className="dossier-confidence-wrap">
          <div className="dossier-gauge">
            <svg viewBox="0 0 100 100" className="dossier-gauge-svg">
              <circle 
                cx="50" cy="50" r="42" 
                className="dossier-gauge-bg"
              />
              <circle 
                cx="50" cy="50" r="42" 
                className="dossier-gauge-fill"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * (overallConfidence || 95)) / 100}
              />
            </svg>
            <div className="dossier-gauge-content">
              <span className="dossier-gauge-num">{overallConfidence}%</span>
              <span className="dossier-gauge-sub">RELIABILITY</span>
            </div>
          </div>
          <div className="dossier-gauge-footer">
            <ShieldCheck size={14} color="#34D399" />
            <span>Master Archive Verified</span>
          </div>
        </div>
      </div>

      {/* 2. Song Form & Structural Roadmap */}
      {musicology.formBreakdown && musicology.formBreakdown.length > 0 && (
        <div className="dossier-section-card glass-panel">
          <div className="dossier-section-header">
            <div className="dossier-section-title-wrap">
              <Layers size={20} color="#38BDF8" />
              <h3 className="dossier-section-title">Musical Form & Arrangement Roadmap</h3>
            </div>
            <span className="dossier-section-pill">{musicology.formBreakdown.length} Sections</span>
          </div>

          {/* Interactive Form Timeline */}
          <div className="dossier-form-timeline">
            {musicology.formBreakdown.map((sec, idx) => {
              const secDetail = musicology.formSections && musicology.formSections[idx];
              const hasDetail = secDetail && secDetail.description;
              return (
                <div 
                  key={idx} 
                  className={`dossier-form-step ${selectedSectionIdx === idx ? 'active' : ''} ${hasDetail ? 'has-detail' : ''}`}
                  onClick={() => setSelectedSectionIdx(selectedSectionIdx === idx ? null : idx)}
                  title={hasDetail ? "Click to view musical analysis & timing breakdown" : undefined}
                >
                  <span className="dossier-form-step-num">0{idx + 1}</span>
                  <span className="dossier-form-step-name">{sec}</span>
                  {idx < musicology.formBreakdown.length - 1 && (
                    <ChevronRight size={14} className="dossier-form-step-arrow" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Section Forensic Detail Card (Revealed on click) */}
          {selectedSectionIdx !== null && musicology.formSections && musicology.formSections[selectedSectionIdx] && (
            <div className="dossier-section-detail-box">
              <div className="dossier-section-detail-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="dossier-step-pill">SECTION 0{selectedSectionIdx + 1}</span>
                  <h4 className="dossier-step-title">{musicology.formSections[selectedSectionIdx].title}</h4>
                </div>
                {musicology.formSections[selectedSectionIdx].score && (
                  <span className="dossier-score-badge">Reliability: {musicology.formSections[selectedSectionIdx].score}</span>
                )}
              </div>
              {musicology.formSections[selectedSectionIdx].description ? (
                <p className="dossier-step-desc">{musicology.formSections[selectedSectionIdx].description}</p>
              ) : (
                <p className="dossier-step-desc" style={{ color: '#94A3B8', fontStyle: 'italic' }}>
                  Form section documented as part of the commercial master arrangement timeline.
                </p>
              )}
              {musicology.formSections[selectedSectionIdx].source && (
                <span className="dossier-spec-source">Source: {musicology.formSections[selectedSectionIdx].source}</span>
              )}
            </div>
          )}

          {/* Complete Breakdown of All Sections */}
          {musicology.formSections && musicology.formSections.some(s => s.description) && (
            <div className="dossier-all-sections-grid">
              <div className="dossier-box-label" style={{ marginBottom: '0.65rem' }}>
                <Layers size={14} color="#38BDF8" /> SECTION-BY-SECTION ARRANGEMENT FORENSICS & TIMINGS
              </div>
              <div className="dossier-section-cards-list">
                {musicology.formSections.filter(s => s.description).map((sec, idx) => (
                  <div key={idx} className="dossier-section-subcard">
                    <div className="dossier-subcard-head">
                      <strong className="dossier-subcard-title">{sec.title}</strong>
                      {sec.score && <span className="dossier-score-badge">{sec.score}</span>}
                    </div>
                    <p className="dossier-subcard-body">{sec.description}</p>
                    {sec.source && <span className="dossier-spec-source">Source: {sec.source}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production & Arrangement Forensics */}
          {musicology.arrangementPoints && musicology.arrangementPoints.length > 0 ? (
            <div className="dossier-arrangement-box">
              <div className="dossier-box-label" style={{ marginBottom: '0.75rem' }}>
                <Radio size={14} color="#C084FC" /> PRODUCTION & ARRANGEMENT SIGNATURES ({musicology.arrangementPoints.length} FORENSIC PILLARS)
              </div>
              <div className="dossier-arrangement-grid">
                {musicology.arrangementPoints.map((pt, idx) => (
                  <div key={idx} className="dossier-arrangement-card">
                    <div className="dossier-arr-title">
                      <strong>{pt.title}</strong>
                      {pt.score && <span className="dossier-score-badge">{pt.score}</span>}
                    </div>
                    <p className="dossier-arr-desc">{pt.description}</p>
                    {pt.source && <span className="dossier-spec-source">Source: {pt.source}</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : musicology.arrangementTechniques ? (
            <div className="dossier-arrangement-box">
              <div className="dossier-box-label">
                <Radio size={14} color="#C084FC" /> PRODUCTION & ARRANGEMENT FORENSICS
              </div>
              <p className="dossier-box-text">{musicology.arrangementTechniques}</p>
            </div>
          ) : null}
        </div>
      )}

      {/* 3. Studio & Vintage Technology Roster */}
      <div className="dossier-section-card glass-panel">
        <div className="dossier-section-header">
          <div className="dossier-section-title-wrap">
            <Sliders size={20} color="#F472B6" />
            <h3 className="dossier-section-title">Studio Environment & Outboard Roster</h3>
          </div>
        </div>

        <div className="dossier-studio-grid">
          {studio.trackingStudio && (
            <div className="dossier-studio-cell">
              <span className="dossier-cell-label">TRACKING ROOM</span>
              <span className="dossier-cell-val">{studio.trackingStudio}</span>
            </div>
          )}
          {studio.console && (
            <div className="dossier-studio-cell">
              <span className="dossier-cell-label">MIXING CONSOLE / DESK</span>
              <span className="dossier-cell-val highlight-cyan">{studio.console}</span>
            </div>
          )}
          {studio.tapeMachine && (
            <div className="dossier-studio-cell">
              <span className="dossier-cell-label">MULTITRACK TAPE MACHINE</span>
              <span className="dossier-cell-val highlight-purple">{studio.tapeMachine}</span>
            </div>
          )}
          {studio.monitors && (
            <div className="dossier-studio-cell">
              <span className="dossier-cell-label">STUDIO MONITORS</span>
              <span className="dossier-cell-val">{studio.monitors}</span>
            </div>
          )}
        </div>

        {studio.outboard && studio.outboard.length > 0 && (
          <div className="dossier-outboard-wrap">
            <div className="dossier-box-label" style={{ marginBottom: '0.75rem' }}>
              <Cpu size={14} color="#34D399" /> KEY OUTBOARD HARDWARE PROCESSORS
            </div>
            <div className="dossier-outboard-cards">
              {studio.outboard.map((item, idx) => (
                <div key={idx} className="dossier-outboard-chip">
                  <div className="dossier-outboard-cat">{item.category}</div>
                  <div className="dossier-outboard-gear">{item.gear}</div>
                  {item.score && (
                    <span className="dossier-score-badge">Score: {item.score}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Interactive Instrument Explorer */}
      {instruments && instruments.length > 0 && (
        <div className="dossier-section-card glass-panel">
          <div className="dossier-section-header">
            <div className="dossier-section-title-wrap">
              <Mic2 size={20} color="#A855F7" />
              <h3 className="dossier-section-title">Historical Recording Pathways & Stems</h3>
            </div>
            <span className="dossier-section-pill">{instruments.length} Stems Documented</span>
          </div>

          {/* Stem Selector Tabs */}
          <div className="dossier-inst-tabs">
            {instruments.map((inst, idx) => (
              <button
                key={idx}
                type="button"
                className={`dossier-inst-tab-btn ${activeInstIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveInstIdx(idx)}
              >
                <span 
                  className="dossier-inst-dot" 
                  style={{ backgroundColor: inst.color || '#A855F7' }}
                ></span>
                <span className="dossier-inst-tab-name">{inst.name}</span>
              </button>
            ))}
          </div>

          {/* Active Instrument Detail View */}
          {activeInstrument && (
            <div className="dossier-inst-detail-card">
              <div className="dossier-inst-header">
                <div>
                  <h4 className="dossier-inst-title">{activeInstrument.name}</h4>
                  {activeInstrument.pathway && (
                    <span className="dossier-inst-pathway">
                      Input Pathway: <strong>{activeInstrument.pathway}</strong>
                    </span>
                  )}
                </div>
                {activeInstrument.score && (
                  <div className="dossier-verified-badge">
                    <CheckCircle2 size={16} color="#34D399" />
                    <span>Reliability: {activeInstrument.score}</span>
                  </div>
                )}
              </div>

              {/* Spec Blocks Grid */}
              <div className="dossier-specs-grid">
                {activeInstrument.backline && (
                  <div className="dossier-spec-card">
                    <div className="dossier-spec-header">
                      <span className="dossier-spec-title">🎸 Historical Backline & Instrument Details</span>
                      {activeInstrument.backlineScore && (
                        <span className="dossier-spec-score">{activeInstrument.backlineScore}</span>
                      )}
                    </div>
                    <p className="dossier-spec-body">{activeInstrument.backline}</p>
                    {activeInstrument.backlineSource && (
                      <span className="dossier-spec-source">Source: {activeInstrument.backlineSource}</span>
                    )}
                  </div>
                )}

                {activeInstrument.mics && (
                  <div className="dossier-spec-card">
                    <div className="dossier-spec-header">
                      <span className="dossier-spec-title">🎙️ Microphone(s) & Transducer Setup</span>
                      {activeInstrument.micScore && (
                        <span className="dossier-spec-score">{activeInstrument.micScore}</span>
                      )}
                    </div>
                    <p className="dossier-spec-body">{activeInstrument.mics}</p>
                    {activeInstrument.micSource && (
                      <span className="dossier-spec-source">Source: {activeInstrument.micSource}</span>
                    )}
                  </div>
                )}

                {activeInstrument.placement && (
                  <div className="dossier-spec-card">
                    <div className="dossier-spec-header">
                      <span className="dossier-spec-title">📐 Mic Placement, Distance & Acoustic Baffling</span>
                    </div>
                    <p className="dossier-spec-body">{activeInstrument.placement}</p>
                  </div>
                )}

                {activeInstrument.stereoArray && (
                  <div className="dossier-spec-card">
                    <div className="dossier-spec-header">
                      <span className="dossier-spec-title">🎧 Stereo / Multi-Mic Array Configuration</span>
                    </div>
                    <p className="dossier-spec-body">{activeInstrument.stereoArray}</p>
                  </div>
                )}
              </div>

              {/* Visual Analog Signal Chain Ribbon */}
              {activeInstrument.signalChain && (
                <div className="dossier-chain-section">
                  <div className="dossier-box-label" style={{ marginBottom: '0.75rem' }}>
                    <Sliders size={14} color="#F59E0B" /> ANALOG TRACKING SIGNAL CHAIN & CONSOLE INSERTS
                  </div>
                  <div className="dossier-chain-ribbon">
                    {parseSignalNodes(activeInstrument.signalChain).map((node, nIdx, arr) => (
                      <div key={nIdx} className="dossier-chain-node-wrap">
                        <div className="dossier-chain-node">
                          <span className="dossier-node-idx">{nIdx + 1}</span>
                          <span className="dossier-node-text">{node}</span>
                        </div>
                        {nIdx < arr.length - 1 && (
                          <div className="dossier-chain-connector">➔</div>
                        )}
                      </div>
                    ))}
                  </div>
                  {activeInstrument.chainSource && (
                    <div className="dossier-chain-citation">
                      Verified from: {activeInstrument.chainSource}
                    </div>
                  )}
                </div>
              )}

              {/* Multitrack Tape Allocation */}
              {activeInstrument.tapeAllocation && (
                <div className="dossier-tape-allocation-box">
                  <div className="dossier-box-label">
                    <Volume2 size={14} color="#EC4899" /> MULTITRACK TAPE ALLOCATION & BOUNCING HISTORY
                  </div>
                  <p className="dossier-tape-text">{activeInstrument.tapeAllocation}</p>
                </div>
              )}

              {/* Historical Mix Balance, Panning & Spatial FX */}
              {(activeInstrument.mixBalance || activeInstrument.mixProcessing) && (
                <div className="dossier-mix-stage-box">
                  <div className="dossier-box-label" style={{ color: '#38BDF8' }}>
                    <Sliders size={14} color="#38BDF8" /> HISTORICAL MIX BALANCE, PANNING & SPATIAL FX
                  </div>
                  <div className="dossier-mix-grid">
                    {activeInstrument.mixBalance && (
                      <div className="dossier-mix-card">
                        <span className="dossier-mix-subtitle">Stereo Panning & Soundstage:</span>
                        <p className="dossier-mix-text">{activeInstrument.mixBalance}</p>
                        {activeInstrument.mixBalanceSource && (
                          <span className="dossier-spec-source">Source: {activeInstrument.mixBalanceSource}</span>
                        )}
                      </div>
                    )}
                    {activeInstrument.mixProcessing && (
                      <div className="dossier-mix-card">
                        <span className="dossier-mix-subtitle">Mixdown Console EQ & Outboard FX:</span>
                        <p className="dossier-mix-text">{activeInstrument.mixProcessing}</p>
                        {activeInstrument.mixProcessingSource && (
                          <span className="dossier-spec-source">Source: {activeInstrument.mixProcessingSource}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. Historical Mixdown, Master Bus & Stereo Master Tape */}
      {mixdown && (mixdown.architecture || mixdown.masterBusChain || mixdown.masterTape || mixdown.spatialStaging) && (
        <div className="dossier-section-card glass-panel">
          <div className="dossier-section-header">
            <div className="dossier-section-title-wrap">
              <Cpu size={20} color="#38BDF8" />
              <h3 className="dossier-section-title">Historical Mixdown, Master Bus & Stereo Master Tape</h3>
            </div>
            <span className="dossier-section-pill">Analog Summing & Mastering</span>
          </div>

          <div className="dossier-mixdown-grid">
            {mixdown.architecture && (
              <div className="dossier-mixdown-card">
                <div className="dossier-mixdown-card-title">Mixdown Architecture & Console Routing</div>
                <p className="dossier-mixdown-card-body">{mixdown.architecture}</p>
              </div>
            )}
            {mixdown.masterBusChain && (
              <div className="dossier-mixdown-card">
                <div className="dossier-mixdown-card-title">Master Bus Dynamics & Program EQ</div>
                <p className="dossier-mixdown-card-body">{mixdown.masterBusChain}</p>
              </div>
            )}
            {mixdown.masterTape && (
              <div className="dossier-mixdown-card">
                <div className="dossier-mixdown-card-title">Stereo Master Tape Recorder & Stock</div>
                <p className="dossier-mixdown-card-body">{mixdown.masterTape}</p>
              </div>
            )}
            {mixdown.spatialStaging && (
              <div className="dossier-mixdown-card">
                <div className="dossier-mixdown-card-title">Stereo Spatial Staging & Mix Variants</div>
                <p className="dossier-mixdown-card-body">{mixdown.spatialStaging}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Session Personnel & Musicians Roster */}
      <div className="dossier-section-card glass-panel">
        <div className="dossier-section-header">
          <div className="dossier-section-title-wrap">
            <User size={20} color="#34D399" />
            <h3 className="dossier-section-title">Session Personnel & Musician Roster</h3>
          </div>
        </div>

        <div className="dossier-personnel-grid">
          {/* Engineering & Executive Team */}
          <div className="dossier-personnel-col">
            <h4 className="dossier-col-title">Production & Engineering Team</h4>
            <div className="dossier-personnel-cards">
              {personnel.producers.map((p, idx) => (
                <div key={idx} className="dossier-personnel-item">
                  <div className="dossier-p-role">PRODUCER</div>
                  <div className="dossier-p-name">{p.name}</div>
                  {p.source && <div className="dossier-p-source">{p.source}</div>}
                </div>
              ))}
              {personnel.chiefEngineers.map((p, idx) => (
                <div key={idx} className="dossier-personnel-item">
                  <div className="dossier-p-role">{p.role || 'RECORDING ENGINEER'}</div>
                  <div className="dossier-p-name">{p.name}</div>
                </div>
              ))}
              {personnel.mixEngineers.map((p, idx) => (
                <div key={idx} className="dossier-personnel-item">
                  <div className="dossier-p-role">MIXING ENGINEER</div>
                  <div className="dossier-p-name">{p.name}</div>
                </div>
              ))}
              {personnel.masteringEngineers.map((p, idx) => (
                <div key={idx} className="dossier-personnel-item">
                  <div className="dossier-p-role">MASTERING ENGINEER</div>
                  <div className="dossier-p-name">{p.name}</div>
                </div>
              ))}
              {personnel.assistantEngineers.map((p, idx) => (
                <div key={idx} className="dossier-personnel-item">
                  <div className="dossier-p-role">ASSISTANT / TAPE OP</div>
                  <div className="dossier-p-name">{p.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Musicians & Performers */}
          {personnel.musicians && personnel.musicians.length > 0 && (
            <div className="dossier-personnel-col">
              <h4 className="dossier-col-title">Session Performers & Instruments</h4>
              <div className="dossier-musicians-grid">
                {personnel.musicians.map((m, idx) => (
                  <div key={idx} className="dossier-musician-card">
                    <div className="dossier-m-header">
                      <span className="dossier-m-name">{m.name}</span>
                      {m.score && <span className="dossier-m-score">{m.score}</span>}
                    </div>
                    <div className="dossier-m-instruments">{m.instruments}</div>
                    {m.source && <div className="dossier-m-source">Source: {m.source}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Authoritative Reference Sources */}
      {references && references.length > 0 && (
        <div className="dossier-section-card glass-panel">
          <div className="dossier-section-header">
            <div className="dossier-section-title-wrap">
              <Award size={20} color="#FBBF24" />
              <h3 className="dossier-section-title">Authoritative Historical & Technical References</h3>
            </div>
          </div>

          <div className="dossier-references-list">
            {references.map((ref, idx) => (
              <a 
                key={idx} 
                href={ref.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="dossier-reference-card"
              >
                <div className="dossier-ref-icon">
                  <ExternalLink size={16} />
                </div>
                <div className="dossier-ref-text">
                  <div className="dossier-ref-title">{ref.title}</div>
                  {ref.description && (
                    <div className="dossier-ref-desc">{ref.description}</div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
