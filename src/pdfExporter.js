import { parseHistoricalTracksheet } from "./tracksheetParser.js";
import { parseLogbook } from "./logbookParser.js";

export function generatePdfHtml({ type, content, trackName, artistName, daw }) {
  const isLogbook = type === "logbook" || type === "c1";
  const now = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  if (isLogbook) {
    const data = parseLogbook(content) || {};
    const effectiveTrack = data.trackName || trackName || "Untitled Track";
    const effectiveArtist = data.artistName || artistName || "Unknown Artist";
    const effectiveDaw = data.daw || daw || "Logic Pro";

    return `
      <div class="pdf-container">
        <!-- PDF Header -->
        <div class="pdf-header logbook-header">
          <div class="pdf-exam-badge">PEARSON EDEXCEL A-LEVEL MUSIC TECHNOLOGY (9MT0/01)</div>
          <h1 class="pdf-main-title">COMPONENT 1: RECORDING — OFFICIAL LOGBOOK</h1>
          <div class="pdf-sub-title">Authentic Full-Band Recreation & Production Documentation</div>
          <div class="pdf-meta-pills">
            <span class="pdf-pill"><strong>Title:</strong> ${effectiveTrack}</span>
            <span class="pdf-pill"><strong>Artist:</strong> ${effectiveArtist}</span>
            <span class="pdf-pill"><strong>DAW:</strong> ${effectiveDaw}</span>
            <span class="pdf-pill"><strong>Generated:</strong> ${now}</span>
          </div>
        </div>

        <!-- Candidate & Hardware Info -->
        <div class="pdf-section pdf-avoid-break">
          <div class="pdf-section-title">1. Candidate, Studio & Hardware Metadata</div>
          <div class="pdf-grid-2">
            <div class="pdf-card">
              <div class="pdf-card-title">Examination Details</div>
              <div class="pdf-kv"><span>Centre Name / Number:</span> <strong>Exemplar Centre / 12345</strong></div>
              <div class="pdf-kv"><span>Candidate Name / Number:</span> <strong>Candidate / 0001</strong></div>
              <div class="pdf-kv"><span>Submission Cycle:</span> <strong>A-Level Music Technology Component 1</strong></div>
            </div>
            <div class="pdf-card">
              <div class="pdf-card-title">Hardware & Acoustic Environment</div>
              <div class="pdf-kv"><span>Audio Interface:</span> <strong>${data.audioInterface || "Focusrite Clarett+ / Universal Audio Apollo (24-bit/48kHz)"}</strong></div>
              <div class="pdf-kv"><span>Monitoring Environment:</span> <strong>${data.monitoring || "Nearfield studio monitors & closed-back headphones"}</strong></div>
              <div class="pdf-kv"><span>Target Dynamic Range:</span> <strong>-1.0 dBFS True Peak / -14 to -16 LUFS Integrated</strong></div>
            </div>
          </div>
        </div>

        <!-- Master Track Sheet Table -->
        ${data.trackTable && data.trackTable.length > 0 ? `
          <div class="pdf-section pdf-avoid-break">
            <div class="pdf-section-title">2. Master Track Sheet & Channel Routing Table</div>
            <table class="pdf-table">
              <thead>
                <tr>
                  <th style="width: 45px;">Trk #</th>
                  <th>Stem / Instrument</th>
                  <th>Selected Pathway</th>
                  <th>Input Source / Transducer</th>
                  <th>DAW Track Type</th>
                  <th style="width: 50px;">Pan</th>
                  <th style="width: 55px;">Fader</th>
                  <th style="width: 70px;">Target Level</th>
                </tr>
              </thead>
              <tbody>
                ${data.trackTable.map(row => `
                  <tr>
                    <td style="text-align: center; font-weight: bold;">${row.trackNo || row.trackNum || "-"}</td>
                    <td style="font-weight: 600;">${row.stem || "-"}</td>
                    <td><span class="pdf-badge ${row.pathway && row.pathway.includes("1") ? "badge-mic" : row.pathway && row.pathway.includes("2") ? "badge-di" : "badge-midi"}">${row.pathway || "Pathway 1"}</span></td>
                    <td>${row.inputSource || row.source || "-"}</td>
                    <td>${row.dawInput || "Audio Track"}</td>
                    <td style="text-align: center;">${row.pan || "C"}</td>
                    <td style="text-align: center;">${row.fader || "0.0 dB"}</td>
                    <td style="text-align: center; font-family: monospace;">${row.targetHeadroom || row.headroom || "-12 dBFS"}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : ""}

        <!-- Detailed Instrument Logs -->
        ${data.instruments && data.instruments.length > 0 ? `
          <div class="pdf-section">
            <div class="pdf-section-title">3. Instrument-by-Instrument Recording Log & 3-Pathway Solutions</div>
            ${data.instruments.map((inst, idx) => {
              const p1 = inst.pathway1 || inst.pathways?.p1 || "Microphone capture detailed in full session log.";
              const p2 = inst.pathway2 || inst.pathways?.p2 || "Direct injection & interface line input detailed in full session log.";
              const p3 = inst.pathway3 || inst.pathways?.p3 || "Virtual instrument sequencing & velocity dynamics detailed in full log.";
              const prefPathway = inst.preferredPathway || "";
              const prefReason = inst.preferredJustification || inst.preferredReason || "";
              const pitfalls = Array.isArray(inst.pitfalls) && inst.pitfalls.length > 0
                ? inst.pitfalls
                : (inst.examinerPitfall ? [inst.examinerPitfall] : []);

              return `
                <div class="pdf-instrument-card pdf-avoid-break">
                  <div class="pdf-inst-header">
                    <div class="pdf-inst-title">
                      <span class="pdf-inst-num">${inst.num || (idx + 1)}</span>
                      ${inst.name}
                    </div>
                    ${prefPathway ? `
                      <div class="pdf-preferred-badge">
                        ⭐ PREFERRED: ${prefPathway}
                      </div>
                    ` : ""}
                  </div>

                  <!-- Instrumental Capture Procedure (Preferred Pathway Only) -->
                  ${(() => {
                    let pathwayStr = '';
                    if (data.trackTable && Array.isArray(data.trackTable)) {
                      const matchedRow = data.trackTable.find(r => {
                        const stemNorm = (r.stem || '').toLowerCase();
                        const instNorm = (inst.name || '').toLowerCase();
                        return stemNorm.includes(instNorm) || instNorm.includes(stemNorm);
                      });
                      if (matchedRow && matchedRow.pathway) {
                        pathwayStr = matchedRow.pathway;
                      }
                    }
                    if (!pathwayStr && prefPathway) {
                      pathwayStr = prefPathway;
                    }
                    const norm = pathwayStr.toLowerCase();

                    let activeTitle = 'Pathway 1: Acoustic / Microphone Capture';
                    let activeBody = p1;
                    let badgeClass = 'badge-mic';

                    if (norm.includes('pathway 2') || norm.includes('direct') || norm.includes('di') || norm.includes('line') || norm.includes('p2')) {
                      activeTitle = 'Pathway 2: Direct Injection (DI) & Line Input';
                      activeBody = p2;
                      badgeClass = 'badge-di';
                    } else if (norm.includes('pathway 3') || norm.includes('midi') || norm.includes('software') || norm.includes('audio instrument') || norm.includes('p3')) {
                      activeTitle = 'Pathway 3: Audio Instruments & MIDI';
                      activeBody = p3;
                      badgeClass = 'badge-midi';
                    }

                    return `
                      <div class="pdf-dedicated-card pdf-preferred-card">
                        <div class="pdf-dedicated-title" style="color: #15803d; display: flex; justify-content: space-between; align-items: center;">
                          <span>⭐ Instrumental Capture Procedure: ${prefPathway || activeTitle}</span>
                          <span class="pdf-preferred-badge">Preferred Coursework Pathway</span>
                        </div>
                        ${prefReason ? `
                          <div class="pdf-preferred-reason" style="margin-bottom: 6px;">
                            <strong>Pearson Edexcel C1 Mark Scheme Justification:</strong> ${prefReason}
                          </div>
                        ` : ""}
                        <div style="font-size: 8.2pt; line-height: 1.5; color: #1e293b; padding: 5px 8px; background: #ffffff; border-radius: 4px; border: 1px solid #e2e8f0;">
                          <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px; font-size: 8pt;">
                            Signal Chain & Acoustic Capture Setup (${activeTitle}):
                          </div>
                          ${activeBody.split('\n').map(l => `<p style="margin: 2.5px 0;">${l.replace(/^\s*[•*]\s*/, '• ')}</p>`).join('')}
                        </div>
                      </div>
                    `;
                  })()}

                  <!-- Channel Strip Processing -->
                  <div class="pdf-dedicated-card">
                    <div class="pdf-dedicated-title" style="color: #0369a1;">
                      <span>${effectiveDaw} Channel Strip Insert Processing: ${inst.name}</span>
                    </div>
                    ${inst.channelStrip && inst.channelStrip.length > 0 ? `
                      <table class="pdf-table" style="margin-top: 4px;">
                        <thead>
                          <tr>
                            <th style="width: 50px;">Slot</th>
                            <th>Processor / Plugin</th>
                            <th>Type & Circuit</th>
                            <th>Settings / Parameters</th>
                            <th>Objective</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${inst.channelStrip.map(cs => `
                            <tr>
                              <td style="font-weight: bold; text-align: center;">${cs.slot || 'Insert'}</td>
                              <td style="font-weight: 600;">${cs.plugin || cs.name || 'Stock Plugin'}</td>
                              <td style="color: #6b21a8;">${cs.type || 'DSP Processor'}</td>
                              <td style="font-family: monospace; font-size: 7.5pt; color: #1e40af;">${cs.settings || 'Default'}</td>
                              <td style="color: #334155;">${cs.objective || '-'}</td>
                            </tr>
                          `).join("")}
                        </tbody>
                      </table>
                    ` : `
                      <div class="pdf-processing-block">
                        <div>${inst.processing?.eq ? `<em>EQ:</em> ${inst.processing.eq}` : ""}</div>
                        <div>${inst.processing?.comp ? `<em>Dynamics:</em> ${inst.processing.comp}` : ""}</div>
                        <div>${inst.processing?.raw || "Stock processing configured to session specifications."}</div>
                      </div>
                    `}
                  </div>

                  <!-- Dedicated Examiner Pitfalls Section -->
                  ${pitfalls.length > 0 ? `
                    <div class="pdf-dedicated-card pdf-pitfall-card">
                      <div class="pdf-dedicated-title" style="color: #b91c1c;">
                        <span>⚠️ CRUCIAL EXAMINER PITFALLS & MARKING TRAPS</span>
                        <span class="pdf-badge" style="background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;">Marking Penalty Alert</span>
                      </div>
                      <div class="pdf-pitfall-body">
                        <ul style="margin: 4px 0 0 16px; padding: 0;">
                          ${pitfalls.map(p => `<li style="margin-bottom: 3px; font-size: 8.2pt; color: #7f1d1d;">${p}</li>`).join("")}
                        </ul>
                      </div>
                    </div>
                  ` : ""}

                  <!-- Dedicated Modern 3rd-Party Alternatives Section -->
                  ${inst.thirdParty && inst.thirdParty.length > 0 ? `
                    <div class="pdf-dedicated-card pdf-alts-card">
                      <div class="pdf-dedicated-title" style="color: #6b21a8;">
                        <span>🔌 MODERN 3RD-PARTY PLUGIN ALTERNATIVES</span>
                        <span class="pdf-badge" style="background: #f3e8ff; color: #6b21a8; border: 1px solid #d8b4fe;">Industry Standard Gear</span>
                      </div>
                      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
                        ${inst.thirdParty.map(tp => `
                          <span class="pdf-tp-badge">
                            ${typeof tp === 'string' ? tp : (tp.name || tp.gear || 'Plugin')}
                          </span>
                        `).join("")}
                      </div>
                    </div>
                  ` : ""}
                </div>
              `;
            }).join("")}
          </div>
        ` : ""}

        <!-- Comprehensive Mix Strategy & Master Bus Processing -->
        <div class="pdf-section pdf-avoid-break">
          <div class="pdf-section-title">4. Mix Strategy, Master Bus & Final Mastering Suite</div>

          ${data.mixStrategy && (data.mixStrategy.faderHierarchy?.length > 0 || data.mixStrategy.philosophy) ? `
            <div class="pdf-card" style="padding: 7px 10px; margin-bottom: 8px;">
              <div class="pdf-card-title" style="font-size: 8.5pt; color: #0284c7; margin-bottom: 4px;">4.1 Mix Balance, Fader Hierarchy & Stereo Staging Architecture</div>
              ${data.mixStrategy.philosophy ? `
                <p style="font-size: 7.2pt; line-height: 1.4; color: #334155; margin: 0 0 6px 0;">${data.mixStrategy.philosophy}</p>
              ` : ""}
              ${data.mixStrategy.faderHierarchy && data.mixStrategy.faderHierarchy.length > 0 ? `
                <table style="width: 100%; border-collapse: collapse; font-size: 6.8pt; margin-top: 3px;">
                  <thead>
                    <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1;">
                      <th style="padding: 3px 5px; text-align: left; width: 22%;">Stem / Element</th>
                      <th style="padding: 3px 5px; text-align: center; width: 13%;">Target Fader</th>
                      <th style="padding: 3px 5px; text-align: left; width: 22%;">Visual Level Meter</th>
                      <th style="padding: 3px 5px; text-align: center; width: 15%;">Stereo Pan</th>
                      <th style="padding: 3px 5px; text-align: left; width: 28%;">Mix Role & Staging</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.mixStrategy.faderHierarchy.map(item => {
                      const db = typeof item.dbNum === 'number' && !isNaN(item.dbNum) ? item.dbNum : 0;
                      const pct = Math.max(14, Math.min(100, Math.round(((db + 12) / 12) * 86 + 14)));
                      const color = db >= -0.5 ? '#ef4444' : db >= -3.5 ? '#0284c7' : db >= -6.5 ? '#059669' : '#7c3aed';
                      return `
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                          <td style="padding: 2.5px 5px; font-weight: 600; color: #0f172a;">${item.element}</td>
                          <td style="padding: 2.5px 5px; text-align: center;">
                            <span style="display: inline-block; padding: 1px 4px; border-radius: 3px; font-weight: 700; font-size: 6.5pt; color: ${color}; background: #f8fafc; border: 1px solid ${color}40;">
                              ${item.faderLevel}
                            </span>
                          </td>
                          <td style="padding: 2.5px 5px;">
                            <div style="background: #e2e8f0; border-radius: 2px; height: 8px; width: 100%; position: relative; overflow: hidden;">
                              <div style="width: ${pct}%; height: 100%; border-radius: 2px; background: ${color};"></div>
                            </div>
                          </td>
                          <td style="padding: 2.5px 5px; text-align: center;">
                            <span style="display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 6.5pt; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;">
                              ${item.pan || 'Center'}
                            </span>
                          </td>
                          <td style="padding: 2.5px 5px; color: #475569;">
                            ${item.role ? item.role : ''}${item.staging && item.staging !== 'Mix Staging' ? ` (${item.staging})` : ''}
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              ` : ""}
            </div>
          ` : ""}

          ${data.mixStrategy && (data.mixStrategy.frequencySeparation || data.mixStrategy.dynamicControl || data.mixStrategy.spatialDepth || data.mixStrategy.automation) ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
              ${data.mixStrategy.frequencySeparation ? `
                <div class="pdf-card" style="padding: 6px 10px;">
                  <div class="pdf-card-title" style="font-size: 8.5pt; color: #7c3aed;">Frequency Masking & Separation</div>
                  ${data.mixStrategy.frequencySeparation.split('\n').map(l => l.trim()).filter(l => l && !(l.startsWith('|') && l.endsWith('|'))).map(l => `<p style="font-size: 7.2pt; line-height: 1.35; margin: 2.5px 0; color: #334155;">${l.replace(/^[•*-]\s*/, '• ').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')}</p>`).join('')}
                </div>
              ` : ""}
              ${data.mixStrategy.dynamicControl ? `
                <div class="pdf-card" style="padding: 6px 10px;">
                  <div class="pdf-card-title" style="font-size: 8.5pt; color: #d97706;">Dynamic Control & Subgroups</div>
                  ${data.mixStrategy.dynamicControl.split('\n').map(l => l.trim()).filter(l => l && !(l.startsWith('|') && l.endsWith('|'))).map(l => `<p style="font-size: 7.2pt; line-height: 1.35; margin: 2.5px 0; color: #334155;">${l.replace(/^[•*-]\s*/, '• ').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')}</p>`).join('')}
                </div>
              ` : ""}
              ${data.mixStrategy.spatialDepth ? `
                <div class="pdf-card" style="padding: 6px 10px;">
                  <div class="pdf-card-title" style="font-size: 8.5pt; color: #059669;">Spatial Depth & Time-Based FX</div>
                  ${data.mixStrategy.spatialDepth.split('\n').map(l => l.trim()).filter(l => l && !(l.startsWith('|') && l.endsWith('|'))).map(l => `<p style="font-size: 7.2pt; line-height: 1.35; margin: 2.5px 0; color: #334155;">${l.replace(/^[•*-]\s*/, '• ').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')}</p>`).join('')}
                </div>
              ` : ""}
              ${data.mixStrategy.automation ? `
                <div class="pdf-card" style="padding: 6px 10px; grid-column: span 2;">
                  <div class="pdf-card-title" style="font-size: 8.5pt; color: #db2777;">Automation Passes & Fader Rides</div>
                  ${data.mixStrategy.automation.split('\n').map(l => l.trim()).filter(l => l && !(l.startsWith('|') && l.endsWith('|'))).map(l => `<p style="font-size: 7.2pt; line-height: 1.35; margin: 2.5px 0; color: #334155;">${l.replace(/^[•*-]\s*/, '• ').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')}</p>`).join('')}
                </div>
              ` : ""}
            </div>
          ` : ""}

          ${data.masterBus?.table && data.masterBus.table.length > 0 ? `
            <table class="pdf-table" style="margin-bottom: 10px;">
              <thead>
                <tr>
                  <th style="width: 140px;">Processing Stage</th>
                  <th style="width: 160px;">Plugin / Processor</th>
                  <th>Dialled Settings / Parameters</th>
                  <th>Technical Objective</th>
                </tr>
              </thead>
              <tbody>
                ${data.masterBus.table.map(row => `
                  <tr>
                    <td style="font-weight: bold;">${row.stage}</td>
                    <td style="color: #0369a1;">${row.processor}</td>
                    <td style="font-family: monospace; font-size: 7pt; color: #1e40af;">${row.settings}</td>
                    <td style="color: #334155; font-size: 7pt;">${row.objective}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `
            <div class="pdf-card" style="margin-bottom: 10px;">
              <div class="pdf-card-title">Mix Bus Processing & Metering</div>
              <p>${data.masterBus?.mixBusChain || "Bus EQ, gentle glue compression (2:1 ratio), subtle tape saturation, and stereo width alignment."}</p>
              <p><strong>Master Limiting:</strong> ${data.masterBus?.limiting || "Ceiling set to -1.0 dBFS True Peak. Target Integrated Loudness: -14 to -16 LUFS."}</p>
            </div>
          `}

          <!-- Loudness & Specification Compliance -->
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 4px; padding: 6px 10px; font-size: 7.5pt; color: #166534; display: flex; justify-content: space-between;">
            <div><strong>True Peak Ceiling:</strong> -1.0 dBFS True Peak</div>
            <div><strong>Integrated Loudness:</strong> -14 to -16 LUFS Integrated</div>
            <div><strong>Phase Coherence:</strong> Correlation +0.7 to +1.0</div>
          </div>
        </div>

        <div class="pdf-footer">
          <span>Tracksheet Creator • Pearson Edexcel Music Technology Component 1 Solution Engine</span>
          <span>Page 1 of Document</span>
        </div>
      </div>
    `;
  } else {
    // Historical Tracksheet PDF layout
    const data = parseHistoricalTracksheet(content) || {};
    const effectiveTrack = data.song || trackName || "Untitled Track";
    const effectiveArtist = data.artist || artistName || "Unknown Artist";

    return `
      <div class="pdf-container">
        <!-- PDF Header -->
        <div class="pdf-header tracksheet-header">
          <div class="pdf-exam-badge">FORENSIC MUSICOLOGICAL & HISTORICAL SESSION ARCHIVE</div>
          <h1 class="pdf-main-title">${effectiveTrack}</h1>
          <div class="pdf-sub-title">Historical Recording & Production Master Tracksheet — ${effectiveArtist}</div>
          <div class="pdf-meta-pills">
            <span class="pdf-pill"><strong>Genre:</strong> ${data.genre || "Classic Track"}</span>
            <span class="pdf-pill"><strong>Recorded:</strong> ${data.datesRecorded || "Studio Session"}</span>
            <span class="pdf-pill"><strong>Release Date:</strong> ${data.releaseDate || "Commercial Release"}</span>
            <span class="pdf-pill"><strong>Archive Date:</strong> ${now}</span>
          </div>
        </div>

        <!-- Metadata & Studio Environment -->
        <div class="pdf-section pdf-avoid-break">
          <div class="pdf-section-title">1. Studio Technology & Environment</div>
          <div class="pdf-grid-2">
            <div class="pdf-card">
              <div class="pdf-card-title">Tracking & Mixing Facilities</div>
              <div class="pdf-kv"><span>Tracking Studio:</span> <strong>${data.studio?.trackingStudio || "Historical Session Studio"}</strong></div>
              <div class="pdf-kv"><span>Mixing Studio:</span> <strong>${data.studio?.mixingStudio || data.studio?.trackingStudio || "Studio Facility"}</strong></div>
              <div class="pdf-kv"><span>Mixing Desk / Console:</span> <strong>${data.studio?.console || "Discrete Solid-State / Valve Desk"}</strong></div>
            </div>
            <div class="pdf-card">
              <div class="pdf-card-title">Tape Format & Monitoring</div>
              <div class="pdf-kv"><span>Tape Machine:</span> <strong>${data.studio?.tapeMachine || "Multitrack Reel-to-Reel Tape"}</strong></div>
              <div class="pdf-kv"><span>Monitors:</span> <strong>${data.studio?.monitors || "Studio Reference Monitors"}</strong></div>
              <div class="pdf-kv"><span>Key Outboard Units:</span> <strong>${Array.isArray(data.studio?.outboard) && data.studio.outboard.length > 0 ? data.studio.outboard.map(o => o.gear || o.value || (typeof o === 'string' ? o : o.category || 'Outboard')).join(", ") : "Vintage compressors, plate reverbs & equalizers"}</strong></div>
            </div>
          </div>
        </div>

        <!-- Personnel & Credits -->
        ${data.personnel ? `
          <div class="pdf-section pdf-avoid-break">
            <div class="pdf-section-title">2. Personnel & Session Credits</div>
            <div class="pdf-grid-2">
              <div class="pdf-card">
                <div class="pdf-card-title">Production & Engineering Team</div>
                <div class="pdf-kv"><span>Producer(s):</span> <strong>${data.personnel.producers?.map(p => p.name || p.value || (typeof p === 'string' ? p : p.role || 'Producer')).join(", ") || "N/A"}</strong></div>
                <div class="pdf-kv"><span>Chief Engineer(s):</span> <strong>${data.personnel.chiefEngineers?.map(e => e.name || e.value || (typeof e === 'string' ? e : e.role || 'Engineer')).join(", ") || "N/A"}</strong></div>
                <div class="pdf-kv"><span>Mixing Engineer(s):</span> <strong>${data.personnel.mixEngineers?.map(m => m.name || m.value || (typeof m === 'string' ? m : m.role || 'Mixer')).join(", ") || "N/A"}</strong></div>
                <div class="pdf-kv"><span>Mastering Engineer(s):</span> <strong>${data.personnel.masteringEngineers?.map(m => m.name || m.value || (typeof m === 'string' ? m : m.role || 'Mastering')).join(", ") || "N/A"}</strong></div>
              </div>
              <div class="pdf-card">
                <div class="pdf-card-title">Musicians & Session Performers</div>
                ${data.personnel.musicians && data.personnel.musicians.length > 0 ? `
                  <ul class="pdf-compact-list">
                    ${data.personnel.musicians.map(m => `<li><strong>${m.name || m.value || m}</strong> — ${m.instruments || m.instrument || m.role || "Performer"}</li>`).join("")}
                  </ul>
                ` : "<p>Session credits documented in primary source discography.</p>"}
              </div>
            </div>
          </div>
        ` : ""}

        <!-- Musical & Structural Roadmap -->
        ${data.musicology ? `
          <div class="pdf-section pdf-avoid-break">
            <div class="pdf-section-title">3. Musical & Structural Analysis</div>
            <div class="pdf-card">
              <div class="pdf-grid-3">
                <div class="pdf-kv"><span>Root Key / Modulations:</span> <strong>${data.musicology.key || "Diatonic"}</strong></div>
                <div class="pdf-kv"><span>Tempo / BPM:</span> <strong>${data.musicology.bpm || data.musicology.tempo || "Fixed Tempo"}</strong></div>
                <div class="pdf-kv"><span>Time Signature:</span> <strong>${data.musicology.timeSignature || "4/4"}</strong></div>
              </div>
              ${data.musicology.formBreakdown && data.musicology.formBreakdown.length > 0 ? `
                <div style="margin-top: 0.75rem; border-top: 1px solid #e2e8f0; padding-top: 0.6rem;">
                  <div style="font-size: 8pt; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 5px;">
                    🎼 Musical Form & Structural Arrangement Roadmap (${data.musicology.formBreakdown.length} Sections):
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-bottom: 6px;">
                    ${data.musicology.formBreakdown.map((sec, idx) => `
                      <span style="display: inline-flex; align-items: center; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; padding: 2px 6px; font-size: 7.2pt; color: #0369a1; font-weight: 600;">
                        <strong style="color: #0284c7; margin-right: 4px;">0${idx + 1}</strong> ${sec}
                      </span>
                      ${idx < data.musicology.formBreakdown.length - 1 ? `<span style="color: #94a3b8; font-size: 7.5pt; margin: 0 1px;">➔</span>` : ""}
                    `).join("")}
                  </div>
                  ${data.musicology.formSections && data.musicology.formSections.some(s => s.description) ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 6px;">
                      ${data.musicology.formSections.filter(s => s.description).map(s => `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 6px; font-size: 7.2pt;">
                          <strong style="color: #0369a1;">${s.title}</strong>
                          <p style="margin: 2px 0 0 0; color: #334155; line-height: 1.35;">${s.description}</p>
                        </div>
                      `).join("")}
                    </div>
                  ` : ""}
                </div>
              ` : ""}
              ${data.musicology.arrangementPoints && data.musicology.arrangementPoints.length > 0 ? `
                <div style="margin-top: 0.75rem; border-top: 1px solid #e2e8f0; padding-top: 0.6rem;">
                  <strong style="font-size: 8pt; color: #475569; text-transform: uppercase;">Arrangement & Production Signatures:</strong>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 4px;">
                    ${data.musicology.arrangementPoints.map(pt => `
                      <div style="background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 4px; padding: 4px 6px; font-size: 7.2pt;">
                        <strong style="color: #7e22ce;">${pt.title}</strong>
                        <p style="margin: 2px 0 0 0; color: #3b0764; line-height: 1.35;">${pt.description}</p>
                      </div>
                    `).join("")}
                  </div>
                </div>
              ` : data.musicology.arrangementTechniques ? `
                <div style="margin-top: 0.75rem; border-top: 1px solid #e2e8f0; padding-top: 0.6rem;">
                  <strong style="font-size: 8pt; color: #475569;">Arrangement & Production Signatures:</strong>
                  <p style="margin: 0.25rem 0 0 0; font-size: 8.2pt; line-height: 1.45; color: #1e293b;">${data.musicology.arrangementTechniques}</p>
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}

        <!-- Historical Recording Pathways & Session Signal Chains -->
        ${data.instruments && data.instruments.length > 0 ? `
          <div class="pdf-section">
            <div class="pdf-section-title">4. Historical Recording Pathways, Signal Chains & Mix Placement</div>
            ${data.instruments.map(inst => `
              <div class="pdf-instrument-card pdf-avoid-break">
                <div class="pdf-inst-header">
                  <div class="pdf-inst-title">
                    <span class="pdf-inst-num">#</span>
                    ${inst.name}
                  </div>
                  ${inst.score ? `
                    <div class="pdf-preferred-badge" style="background: #ecfdf5; color: #047857; border-color: #6ee7b7;">
                      ✓ Reliability: ${inst.score}
                    </div>
                  ` : ""}
                </div>

                ${inst.pathway ? `
                  <div class="pdf-preferred-reason" style="background: #f1f5f9; border-left-color: #3b82f6; color: #1e3a8a;">
                    <strong>Historical Pathway / Input Method:</strong> ${inst.pathway}
                  </div>
                ` : ""}

                <div class="pdf-specs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; margin-top: 8px;">
                  ${inst.backline ? `
                    <div class="pdf-card">
                      <div class="pdf-card-title">🎸 Backline & Instrument Specs</div>
                      <p style="margin: 0; font-size: 0.85rem;">${inst.backline}</p>
                      ${inst.backlineSource ? `<div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">Source: ${inst.backlineSource}</div>` : ""}
                    </div>
                  ` : ""}
                  ${inst.mics ? `
                    <div class="pdf-card">
                      <div class="pdf-card-title">🎙️ Microphone & Transducer Setup</div>
                      <p style="margin: 0; font-size: 0.85rem;">${inst.mics}</p>
                      ${inst.micSource ? `<div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">Source: ${inst.micSource}</div>` : ""}
                    </div>
                  ` : ""}
                </div>

                ${inst.placement ? `
                  <div style="margin-top: 8px; font-size: 0.85rem;">
                    <strong>Placement & Baffling:</strong> ${inst.placement}
                  </div>
                ` : ""}

                ${inst.signalChain ? `
                  <div style="margin-top: 8px; font-size: 0.85rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 6px;">
                    <strong>Analog Signal Chain:</strong> ${inst.signalChain}
                    ${inst.chainSource ? `<span style="font-size: 0.75rem; color: #64748b; margin-left: 6px;">(${inst.chainSource})</span>` : ""}
                  </div>
                ` : ""}

                ${inst.tapeAllocation ? `
                  <div style="margin-top: 6px; font-size: 0.83rem; color: #475569;">
                    <strong>Multitrack Tape Allocation:</strong> ${inst.tapeAllocation}
                  </div>
                ` : ""}

                <!-- Historical Mix Balance & Processing -->
                ${(inst.mixBalance || inst.mixProcessing) ? `
                  <div class="pdf-grid-2" style="margin-top: 8px;">
                    ${inst.mixBalance ? `
                      <div class="pdf-card" style="background: #f0fdf4; border-color: #bbf7d0;">
                        <div class="pdf-card-title" style="color: #166534;">🎚️ Mix Balance & Spatial Panning</div>
                        <p style="margin: 0; font-size: 0.83rem; color: #14532d;">${inst.mixBalance}</p>
                        ${inst.mixBalanceSource ? `<div style="font-size: 0.73rem; color: #166534; margin-top: 4px;">Source: ${inst.mixBalanceSource}</div>` : ""}
                      </div>
                    ` : ""}
                    ${inst.mixProcessing ? `
                      <div class="pdf-card" style="background: #f5f3ff; border-color: #ddd6fe;">
                        <div class="pdf-card-title" style="color: #5b21b6;">🎛️ Mixdown Processing & Outboard FX</div>
                        <p style="margin: 0; font-size: 0.83rem; color: #4c1d95;">${inst.mixProcessing}</p>
                        ${inst.mixProcessingSource ? `<div style="font-size: 0.73rem; color: #5b21b6; margin-top: 4px;">Source: ${inst.mixProcessingSource}</div>` : ""}
                      </div>
                    ` : ""}
                  </div>
                ` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Historical Mixdown, Master Bus & Stereo Master Tape -->
        ${data.mixdown && (data.mixdown.architecture || data.mixdown.masterBusChain || data.mixdown.masterTape || data.mixdown.spatialStaging) ? `
          <div class="pdf-section pdf-avoid-break">
            <div class="pdf-section-title">5. Historical Mixdown, Master Bus & Stereo Master Tape</div>
            <div class="pdf-grid-2">
              <div class="pdf-card">
                <div class="pdf-card-title">🎚️ Console Mixdown Routing & Architecture</div>
                <p style="font-size: 0.85rem; margin: 0 0 10px 0;">${data.mixdown.architecture || "Direct console channel fader routing to stereo summing bus with analog summing amplifier."}</p>
                <div class="pdf-card-title">🎛️ Master Bus Processing & Analog Dynamics</div>
                <p style="font-size: 0.85rem; margin: 0;">${data.mixdown.masterBusChain || "Stereo program equalizer and gentle glue compression."}</p>
              </div>
              <div class="pdf-card">
                <div class="pdf-card-title">📼 Stereo Master Tape Machine & Formulation</div>
                <p style="font-size: 0.85rem; margin: 0 0 10px 0;">${data.mixdown.masterTape || "1/4\" or 1/2\" two-track tape recorder running at 15 or 30 ips."}</p>
                <div class="pdf-card-title">🎧 Spatial Staging & Stereo vs Mono Mixes</div>
                <p style="font-size: 0.85rem; margin: 0;">${data.mixdown.spatialStaging || "Historical panning spread and front-to-back depth staging."}</p>
              </div>
            </div>
          </div>
        ` : ""}

        <!-- References -->
        ${data.references && data.references.length > 0 ? `
          <div class="pdf-section pdf-avoid-break">
            <div class="pdf-section-title">${data.mixdown ? "6" : "5"}. Authoritative Verification Sources</div>
            <div class="pdf-card">
              <ul class="pdf-compact-list">
                ${data.references.map(ref => `<li><strong>${ref.title || ref.name || "Source"}</strong>: ${ref.description || ref.note || ref.url || "Verified Session Log"}</li>`).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <div class="pdf-footer">
          <span>Tracksheet Creator • AI-Powered Musicological Analysis & Audio Engineering Archive</span>
          <span>Page 1 of Document</span>
        </div>
      </div>
    `;
  }
}

export const PDF_STYLES = `
  .pdf-container {
    width: 210mm;
    min-height: 297mm;
    padding: 14mm 14mm 16mm 14mm;
    margin: 0 auto;
    box-sizing: border-box;
    background: #ffffff;
    color: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
  }

  .pdf-avoid-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Header Styles */
  .pdf-header {
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 20px;
    color: #ffffff;
  }

  .logbook-header {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%);
    border-left: 6px solid #8b5cf6;
  }

  .tracksheet-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
    border-left: 6px solid #38bdf8;
  }

  .pdf-exam-badge {
    font-size: 8pt;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #a78bfa;
    margin-bottom: 4px;
  }

  .tracksheet-header .pdf-exam-badge {
    color: #7dd3fc;
  }

  .pdf-main-title {
    font-size: 18pt;
    font-weight: 800;
    margin: 0 0 4px 0;
    color: #ffffff;
    line-height: 1.2;
  }

  .pdf-sub-title {
    font-size: 10pt;
    font-weight: 500;
    color: #cbd5e1;
    margin-bottom: 12px;
  }

  .pdf-meta-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .pdf-pill {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 4px;
    padding: 3px 8px;
    font-size: 8.5pt;
    color: #f8fafc;
  }

  /* Section Styles */
  .pdf-section {
    margin-bottom: 18px;
  }

  .pdf-section-title {
    font-size: 12pt;
    font-weight: 800;
    color: #1e1b4b;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  /* Cards & Grids */
  .pdf-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .pdf-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }

  .pdf-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 12px;
  }

  .pdf-card-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #4338ca;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .pdf-kv {
    font-size: 8.8pt;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
  }

  .pdf-kv span {
    color: #64748b;
  }

  .pdf-kv strong {
    color: #0f172a;
  }

  /* Table Styles */
  .pdf-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.2pt;
    margin-top: 6px;
    margin-bottom: 6px;
  }

  .pdf-table th {
    background: #1e293b;
    color: #ffffff;
    font-weight: 700;
    padding: 6px 8px;
    text-align: left;
    border: 1px solid #1e293b;
    font-size: 7.8pt;
    text-transform: uppercase;
  }

  .pdf-table td {
    padding: 5px 8px;
    border: 1px solid #e2e8f0;
    color: #1e293b;
  }

  .pdf-table tr:nth-child(even) {
    background: #f8fafc;
  }

  .pdf-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 7.5pt;
    font-weight: 700;
  }

  .badge-mic { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
  .badge-di { background: #fae8ff; color: #86198f; border: 1px solid #f5d0fe; }
  .badge-midi { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

  /* Instrument Card Styles */
  .pdf-instrument-card {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 12px;
  }

  .pdf-inst-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
    margin-bottom: 6px;
  }

  .pdf-inst-title {
    font-size: 11pt;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .pdf-inst-num {
    background: #4338ca;
    color: #ffffff;
    font-size: 8pt;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .pdf-preferred-badge {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #86efac;
    border-radius: 4px;
    padding: 3px 8px;
    font-size: 8pt;
    font-weight: 700;
  }

  .pdf-preferred-reason {
    background: #f0fdf4;
    border-left: 3px solid #22c55e;
    padding: 5px 8px;
    font-size: 8.2pt;
    color: #166534;
    margin-bottom: 8px;
    border-radius: 0 4px 4px 0;
  }

  .pdf-pathways-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }

  .pdf-pathway-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 6px 8px;
  }

  .pdf-pathway-head {
    font-size: 8pt;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    margin-bottom: 3px;
    border-bottom: 1px dashed #cbd5e1;
    padding-bottom: 2px;
  }

  .pdf-pathway-body {
    font-size: 8pt;
    color: #1e293b;
    line-height: 1.35;
  }

  .pdf-processing-row {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 8px;
    font-size: 8pt;
    border-top: 1px solid #f1f5f9;
    padding-top: 6px;
  }

  .pdf-processing-block {
    background: #f8fafc;
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  .pdf-pitfalls-block {
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 6px 8px;
    border-radius: 4px;
    color: #991b1b;
  }

  .pdf-pitfalls-block ul {
    margin: 3px 0 0 14px;
    padding: 0;
  }

  /* Dedicated PDF Cards (Logbook & Tracksheet) */
  .pdf-dedicated-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 10px;
    margin-top: 8px;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-dedicated-title {
    font-size: 8.8pt;
    font-weight: 800;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    letter-spacing: 0.02em;
  }

  .pdf-preferred-card {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
  }

  .pdf-pitfall-card {
    background: #fef2f2;
    border: 1px solid #fecaca;
  }

  .pdf-alts-card {
    background: #faf5ff;
    border: 1px solid #e9d5ff;
  }

  .pdf-tp-badge {
    background: #ede9fe;
    color: #6b21a8;
    border: 1px solid #ddd6fe;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 7.5pt;
    font-weight: 600;
  }

  .pdf-compact-list {
    margin: 0;
    padding-left: 16px;
    font-size: 8.5pt;
  }

  .pdf-compact-list li {
    margin-bottom: 4px;
  }

  /* Footer */
  .pdf-footer {
    border-top: 1px solid #cbd5e1;
    padding-top: 6px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 7.5pt;
    color: #94a3b8;
  }
`;

/**
 * Main export function to generate and download a good-looking PDF
 */
export async function downloadGoodLookingPdf({ type, content, trackName, artistName, daw }) {
  if (!content) {
    console.warn("downloadGoodLookingPdf: No content provided");
    return;
  }

  const htmlContent = generatePdfHtml({ type, content, trackName, artistName, daw });

  // Ensure styles are attached to document head for html2canvas to inherit
  let styleEl = document.getElementById("pdf-export-styles");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "pdf-export-styles";
    styleEl.innerHTML = PDF_STYLES;
    document.head.appendChild(styleEl);
  }

  // Create temporary container offscreen
  const wrapper = document.createElement("div");
  wrapper.className = "pdf-export-temp-wrapper";
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.style.width = "210mm";
  wrapper.innerHTML = `<style>${PDF_STYLES}</style>${htmlContent}`;
  document.body.appendChild(wrapper);

  // Target the rendered container instead of firstElementChild (which is <style>)
  const target = wrapper.querySelector(".pdf-container") || wrapper;

  const cleanFilename = `${(artistName || "Artist").replace(/[^a-z0-9]/gi, "_")}_${(trackName || "Track").replace(/[^a-z0-9]/gi, "_")}_${type === "logbook" || type === "c1" ? `Component1_Logbook_${(daw || "LogicPro").replace(/[^a-z0-9]/gi, "_")}` : "Tracksheet"}.pdf`;

  const opt = {
    margin: [0, 0, 0, 0],
    filename: cleanFilename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"]
    }
  };

  try {
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default || html2pdfModule;
    const worker = html2pdf().from(target).set(opt);
    await worker.save();
  } catch (error) {
    console.error("Failed to generate PDF via html2pdf:", error);
    window.print();
  } finally {
    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
  }
}
