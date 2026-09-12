/**
 * logbookParser.js
 * Parses Component 1 Recording Logbook markdown into structured data
 * for the Logbook Dossier View.
 */

export function parseLogbook(markdown) {
  if (!markdown) return null;

  const result = {
    title: 'Component 1 Recording Logbook',
    trackName: '',
    artistName: '',
    daw: '',
    audioInterface: '',
    monitoring: '',
    trackTable: [],
    instruments: [],
    mixStrategy: {
      philosophy: '',
      faderHierarchy: [],
      frequencySeparation: '',
      dynamicControl: '',
      spatialDepth: '',
      automation: ''
    },
    masterBus: {
      table: [],
      mixBusChain: '',
      limiting: '',
      rawContent: ''
    }
  };

  // Section 1: Examination & Production Metadata
  const titleArtistMatch = markdown.match(/Selected Title & Artist:\*\*\s*(.+)/i);
  if (titleArtistMatch) {
    const raw = titleArtistMatch[1].trim();
    const parts = raw.split(/\s*-\s*|\s+by\s+/i);
    if (parts.length > 1) {
      result.trackName = parts[0].trim();
      result.artistName = parts[1].trim();
    } else {
      result.trackName = raw;
    }
  }

  const dawMatch = markdown.match(/Primary (?:Digital Audio Workstation|DAW)[^:]*:\*\*\s*(.+)/i);
  if (dawMatch) {
    result.daw = dawMatch[1].trim();
  }

  const ifaceMatch = markdown.match(/Audio Interface & Clock Rate:\*\*\s*(.+)/i);
  if (ifaceMatch) {
    result.audioInterface = ifaceMatch[1].trim();
  }

  const monitorMatch = markdown.match(/Monitoring Environment:\*\*\s*(.+)/i);
  if (monitorMatch) {
    result.monitoring = monitorMatch[1].trim();
  }

  // Section 2: Master Track Sheet & Input Routing Table
  const s2Match = markdown.match(/### Section 2[^\n]*\n+([\s\S]*?)(?=### Section 3|$)/i);
  if (s2Match) {
    const tableText = s2Match[1];
    const rows = tableText.split('\n').map(r => r.trim()).filter(r => r.startsWith('|') && !r.includes('---'));
    if (rows.length > 1) {
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (cells.length >= 4) {
          result.trackTable.push({
            trackNo: cells[0] || String(i),
            stem: cells[1] || 'Stem',
            pathway: cells[2] || '',
            inputSource: cells[3] || '',
            dawInput: cells[4] || '',
            pan: cells[5] || 'C',
            fader: cells[6] || '0 dB',
            targetHeadroom: cells[7] || ''
          });
        }
      }
    }
  }

  // Section 3: Instrument-by-Instrument Recording Log & 3-Pathway Solutions
  const s3Idx = markdown.indexOf('### Section 3');
  const s4Idx = markdown.indexOf('### Section 4');
  const s3Text = s3Idx !== -1 
    ? (s4Idx !== -1 ? markdown.substring(s3Idx, s4Idx) : markdown.substring(s3Idx))
    : '';

  if (s3Text) {
    // Split by #### (instruments)
    const instChunks = s3Text.split(/\n####\s+/);
    for (let i = 1; i < instChunks.length; i++) {
      const chunk = instChunks[i];
      const firstLineEnd = chunk.indexOf('\n');
      const instName = firstLineEnd !== -1 ? chunk.substring(0, firstLineEnd).trim() : chunk.trim();
      const body = firstLineEnd !== -1 ? chunk.substring(firstLineEnd) : '';

      const instObj = {
        name: instName.replace(/^\d+\.\s*/, ''),
        rawHeading: instName,
        pathway1: '',
        pathway2: '',
        pathway3: '',
        preferredPathway: '',
        preferredJustification: '',
        channelStrip: [],
        thirdParty: [],
        examinerPitfall: '',
        rawBody: body
      };

      // Extract Pathway 1 (Acoustic / Mic)
      const p1Match = body.match(/(?:#{1,6}\s*|\*\s+)?\*{0,2}Pathway\s*1[^*:\n]*\*{0,2}[:\s]*([\s\S]*?)(?=(?:#{1,6}\s*|\*\s+)?\*{0,2}Pathway\s*2|(?:#{1,6}\s*|\*\s+)?\*{0,2}⭐|(?:#{1,6}\s*|\*\s+)?\*{0,2}PREFERRED|\n####|$)/i);
      if (p1Match) instObj.pathway1 = p1Match[1].trim().replace(/^\s*\*\s+/gm, '• ');

      // Extract Pathway 2 (DI / Line)
      const p2Match = body.match(/(?:#{1,6}\s*|\*\s+)?\*{0,2}Pathway\s*2[^*:\n]*\*{0,2}[:\s]*([\s\S]*?)(?=(?:#{1,6}\s*|\*\s+)?\*{0,2}Pathway\s*3|(?:#{1,6}\s*|\*\s+)?\*{0,2}⭐|(?:#{1,6}\s*|\*\s+)?\*{0,2}PREFERRED|\n####|$)/i);
      if (p2Match) instObj.pathway2 = p2Match[1].trim().replace(/^\s*\*\s+/gm, '• ');

      // Extract Pathway 3 (MIDI / Instrument)
      const p3Match = body.match(/(?:#{1,6}\s*|\*\s+)?\*{0,2}Pathway\s*3[^*:\n]*\*{0,2}[:\s]*([\s\S]*?)(?=(?:#{1,6}\s*|\*\s+)?\*{0,2}⭐|(?:#{1,6}\s*|\*\s+)?\*{0,2}PREFERRED|\n####|(?:#{1,6}\s*|\*\s+)?\*{0,2}Channel Strip|$)/i);
      if (p3Match) instObj.pathway3 = p3Match[1].trim().replace(/^\s*\*\s+/gm, '• ');

      // Extract Preferred Pathway & Justification
      const prefMatch = body.match(/(?:#{1,6}\s*|\*\s+)?\*{0,2}⭐?\s*PREFERRED C1 PATHWAY[:\s]*([^\n*.]+)[.*]?\s*([\s\S]*?)(?=(?:#{1,6}\s*|\*\s+)?\*{0,2}Channel Strip|(?:#{1,6}\s*|\*\s+)?\*{0,2}(?:Modern\s*3rd|3rd-Party)|\n####|$)/i);
      if (prefMatch) {
        instObj.preferredPathway = prefMatch[1].trim();
        instObj.preferredJustification = prefMatch[2].trim()
          .replace(/^\*?\s*(?:\*\*)?(?:Mark-Scheme\s*)?Justification:?(?:\*\*)?\s*/i, '')
          .replace(/^\s*\*\s+/gm, '• ');
      }

      // Extract Channel Strip: Table or Bullet List
      const tableMatch = body.match(/\|[^\n]+\|\n\|[-| :]+\|\n((?:\|[^\n]+\|\n?)+)/);
      if (tableMatch) {
        const rows = tableMatch[1].trim().split('\n');
        for (const row of rows) {
          const cells = row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          if (cells.length >= 4) {
            instObj.channelStrip.push({
              slot: cells[0],
              plugin: cells[1],
              type: cells[2],
              settings: cells[3],
              objective: cells[4] || ''
            });
          }
        }
      } else {
        // Fallback: bullet points (e.g. *Channel EQ*: settings)
        const bulletMatches = [...body.matchAll(/\*\s+\*([^*:]+)\*:\s*([^\n]+)/g)];
        let slotNum = 1;
        for (const bm of bulletMatches) {
          const pluginName = bm[1].trim();
          if (!pluginName.toLowerCase().includes('setup') && !pluginName.toLowerCase().includes('gain staging') && !pluginName.toLowerCase().includes('justification')) {
            instObj.channelStrip.push({
              slot: `Insert ${slotNum++}`,
              plugin: pluginName,
              type: 'Stock Processor',
              settings: bm[2].trim(),
              objective: 'Dynamic / Frequency shaping'
            });
          }
        }
      }

      // Extract 3rd Party Plugins
      const tpMatch = body.match(/(?:#{1,6}\s*|\*\s+)?\*{0,2}(?:Modern\s*3rd|Third-Party|3rd-Party)[^*:\n]*\*{0,2}[:\s]*([\s\S]*?)(?=(?:#{1,6}\s*|\*\s+)?\*{0,2}Examiner|\n#{1,6}|\n---|$)/i);
      if (tpMatch) {
        const tpText = tpMatch[1].trim();
        const linkMatches = [...tpText.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)];
        if (linkMatches.length > 0) {
          instObj.thirdParty = linkMatches.map(m => ({ name: m[1], url: m[2] }));
        } else {
          instObj.thirdParty = tpText.split('\n').filter(Boolean).map(l => ({ name: l.replace(/^\s*[•*]\s*/, '').trim(), url: '' }));
        }
      }

      // Extract Examiner Pitfall
      const pitfallMatch = body.match(/(?:#{1,6}\s*|\*\s+)?\*{0,2}Examiner\s*(?:Pitfall|Trap)[^*:\n]*\*{0,2}[:\s]*([\s\S]*?)(?=\n#{1,6}|\n---|$)/i);
      if (pitfallMatch) {
        instObj.examinerPitfall = pitfallMatch[1].trim().replace(/^\s*\*\s+/gm, '• ');
      }

      result.instruments.push(instObj);
    }
  }

  // Section 4: Comprehensive Mix Strategy & Mastering Suite
  if (s4Idx !== -1) {
    const s4Text = markdown.substring(s4Idx);
    result.masterBus.rawContent = s4Text;

    // 1. Overall Mix Philosophy, Balance & Fader Hierarchy
    const balanceMatch = s4Text.match(/(?:Fader Hierarchy|Mix Balance|Balance & Stereo|Overall Mix Philosophy)[^:\n]*:?\s*([\s\S]*?)(?=(?:###|\n####|\*\*4\.\d|\*\*Frequency|\*\*Dynamic|\*\*Spatial|\*\*Master Bus|\*\*Master Limiting|$))/i);
    if (balanceMatch) {
      let rawPhilosophy = balanceMatch[1].trim();

      // Check for Markdown table within Section 4.1
      const faderTableMatch = rawPhilosophy.match(/\|([^\n]+)\|\n\|[-| :]+\|\n((?:\|[^\n]+\|\n?)+)/);
      if (faderTableMatch) {
        const headerCells = faderTableMatch[1].split('|').map(c => c.trim().toLowerCase()).filter(Boolean);
        const stemIdx = headerCells.findIndex(h => h.includes('stem') || h.includes('element') || h.includes('instrument') || h.includes('track'));
        const levelIdx = headerCells.findIndex(h => h.includes('fader') || h.includes('level') || h.includes('db'));
        const panIdx = headerCells.findIndex(h => h.includes('pan') || h.includes('pos') || h.includes('stereo'));
        const roleIdx = headerCells.findIndex(h => (h.includes('role') || h.includes('spectral') || h.includes('frequency')) && !h.includes('spatial'));
        const stagingIdx = headerCells.findIndex(h => h.includes('spatial') || h.includes('depth') || h.includes('reverb') || (h.includes('staging') && !h.includes('role')));

        const rows = faderTableMatch[2].trim().split('\n');
        for (const row of rows) {
          const cells = row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          if (cells.length >= 2) {
            const element = stemIdx !== -1 && cells[stemIdx] ? cells[stemIdx] : cells[0];
            const faderLevel = levelIdx !== -1 && cells[levelIdx] ? cells[levelIdx] : cells[1];
            const pan = panIdx !== -1 && cells[panIdx] ? cells[panIdx] : (cells.length > 2 ? cells[2] : 'Center');
            const role = roleIdx !== -1 && cells[roleIdx] ? cells[roleIdx] : (cells.length > 3 ? cells[3] : '');
            const staging = stagingIdx !== -1 && cells[stagingIdx] ? cells[stagingIdx] : (cells.length > 4 ? cells[4] : '');

            const dbMatch = faderLevel.match(/([-+]?\d+(?:\.\d+)?)/);
            const dbNum = dbMatch ? parseFloat(dbMatch[1]) : 0;

            result.mixStrategy.faderHierarchy.push({
              element,
              faderLevel,
              dbNum,
              pan,
              role,
              staging
            });
          }
        }
        // Clean out table markdown from narrative philosophy
        rawPhilosophy = rawPhilosophy.replace(faderTableMatch[0], '').trim();
      }

      // Check for ASCII dash lines like:
      // [ 0.0 dB] --------------------------------- Lead Vocal (Center Focal Point)
      // [-3.0 dB] --------------------- Kick / Snare / Bass Guitar (Rhythmic Foundation)
      // [-6.5 dB] ------------ Rhythm Electric Guitars (Pan 45° L/R)
      const dashRegex = /\[\s*([-+]?\d+(?:\.\d+)?)\s*dB\s*\]\s*[-—=~]+\s*([^\n(]+?)(?:\s*\(([^)\n]+)\))?$/gm;
      let dashMatch;
      let hasDashes = false;
      while ((dashMatch = dashRegex.exec(rawPhilosophy)) !== null) {
        hasDashes = true;
        const dbNum = parseFloat(dashMatch[1]);
        const faderLevel = dbNum === 0 ? '0.0 dB (Ref)' : `${dbNum > 0 ? '+' : ''}${dbNum.toFixed(1)} dB`;
        const element = dashMatch[2].trim();
        const note = dashMatch[3]?.trim() || '';

        let pan = 'Center (0)';
        let role = note;
        if (/center/i.test(note)) {
          pan = 'Center (0)';
          role = note;
        } else if (/\b(?:pan|panned|left|right|l\/r)\b/i.test(note)) {
          pan = note;
          role = element.toLowerCase().includes('vocal') ? 'Harmonic Support' : 'Stereo Staging & Texture';
        } else if (/width|ambience|overhead/i.test(note)) {
          pan = 'Stereo L/R';
          role = note;
        }

        result.mixStrategy.faderHierarchy.push({
          element,
          faderLevel,
          dbNum,
          pan,
          role: role || (element.toLowerCase().includes('vocal') ? 'Center Focal Point' : 'Rhythmic Foundation'),
          staging: 'Mix Staging'
        });
      }

      if (hasDashes) {
        rawPhilosophy = rawPhilosophy.replace(/\[\s*[-+]?\d+(?:\.\d+)?\s*dB\s*\]\s*[-—=~]+[^\n]+/gi, '').trim();
      }

      // Clean up any remaining code fences or headers
      rawPhilosophy = rawPhilosophy.replace(/```[a-z]*\n?/gi, '').replace(/MIX BALANCE & FADER HIERARCHY:?/i, '').trim();
      result.mixStrategy.philosophy = rawPhilosophy.replace(/^\s*\*\s+/gm, '• ');
    }

    // Check anywhere in Section 4 (prior to Master Bus) for Fader Hierarchy table if not found yet
    const s45Idx = s4Text.search(/(?:####\s*4\.5|###\s*Section 4\.5|Master Bus Processing|Master Bus Signal Chain|Mastering & Final Limiting)/i);
    const s4PreMaster = s45Idx !== -1 ? s4Text.substring(0, s45Idx) : s4Text;

    if (result.mixStrategy.faderHierarchy.length === 0) {
      const globalFaderMatch = s4PreMaster.match(/\|([^\n]*(?:stem|element|instrument)[^\n]*(?:fader|level|pan|placement)[^\n]*)\|\n\|[-| :]+\|\n((?:\|[^\n]+\|\n?)+)/i);
      if (globalFaderMatch) {
        const headerCells = globalFaderMatch[1].split('|').map(c => c.trim().toLowerCase()).filter(Boolean);
        const stemIdx = headerCells.findIndex(h => h.includes('stem') || h.includes('element') || h.includes('instrument') || h.includes('track'));
        const levelIdx = headerCells.findIndex(h => h.includes('fader') || h.includes('level') || h.includes('db'));
        const panIdx = headerCells.findIndex(h => h.includes('pan') || h.includes('pos') || h.includes('stereo'));
        const roleIdx = headerCells.findIndex(h => (h.includes('role') || h.includes('spectral') || h.includes('frequency') || h.includes('placement')) && !h.includes('spatial'));
        const stagingIdx = headerCells.findIndex(h => h.includes('spatial') || h.includes('depth') || h.includes('reverb') || (h.includes('staging') && !h.includes('role')));

        const rows = globalFaderMatch[2].trim().split('\n');
        for (const row of rows) {
          const cells = row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          if (cells.length >= 2) {
            const element = stemIdx !== -1 && cells[stemIdx] ? cells[stemIdx] : cells[0];
            const faderLevel = levelIdx !== -1 && cells[levelIdx] ? cells[levelIdx] : cells[1];
            const pan = panIdx !== -1 && cells[panIdx] ? cells[panIdx] : (cells.length > 2 ? cells[2] : 'Center');
            const role = roleIdx !== -1 && cells[roleIdx] ? cells[roleIdx] : (cells.length > 3 ? cells[3] : '');
            const staging = stagingIdx !== -1 && cells[stagingIdx] ? cells[stagingIdx] : (cells.length > 4 ? cells[4] : '');

            const dbMatch = faderLevel.match(/([-+]?\d+(?:\.\d+)?)/);
            const dbNum = dbMatch ? parseFloat(dbMatch[1]) : 0;

            result.mixStrategy.faderHierarchy.push({
              element,
              faderLevel,
              dbNum,
              pan,
              role,
              staging
            });
          }
        }
      }
    }

    // Fallback: If faderHierarchy is still empty but trackTable exists, populate from trackTable
    if (result.mixStrategy.faderHierarchy.length === 0 && result.trackTable.length > 0) {
      result.trackTable.forEach(t => {
        const dbMatch = (t.fader || '').match(/([-+]?\d+(?:\.\d+)?)/);
        const dbNum = dbMatch ? parseFloat(dbMatch[1]) : -6.0;
        result.mixStrategy.faderHierarchy.push({
          element: t.stem,
          faderLevel: t.fader || `${dbNum.toFixed(1)} dB`,
          dbNum: dbNum,
          pan: t.pan || 'Center',
          role: t.inputSource || 'Mix Channel',
          staging: 'Console Channel'
        });
      });
      result.mixStrategy.faderHierarchy.sort((a, b) => b.dbNum - a.dbNum);
    }

    // 2. Frequency Masking Management & Spectral Separation
    const freqMatch = s4Text.match(/(?:####\s*4\.2[^\n]*|\bFrequency Masking Management[^\n]*|\bFrequency Separation[^\n]*)\n([\s\S]*?)(?=(?:####\s*4\.\d|###\s*Section\s*4\.\d|\n####\s*4|\n###\s*4|$))/i);
    if (freqMatch) {
      result.mixStrategy.frequencySeparation = freqMatch[1].trim().replace(/^\s*\*\s+/gm, '• ');
    } else {
      // Fallback
      const legacyFreq = s4Text.match(/(?:Frequency Separation|Masking Management|Spectral Separation|Frequency Pocketing|Low-End Management)[^:\n]*:?\s*([\s\S]*?)(?=(?:###|\n####|\*\*4\.\d|\*\*Dynamic|\*\*Spatial|\*\*Master Bus|\*\*Master Limiting|$))/i);
      if (legacyFreq) {
        result.mixStrategy.frequencySeparation = legacyFreq[1].trim().replace(/^\s*\*\s+/gm, '• ');
      }
    }

    // 3. Dynamic Control, Mix Subgroups & Automation (Section 4.3)
    const dynSecMatch = s4Text.match(/(?:####\s*4\.3[^\n]*|\bDynamic Control[^\n]*)\n([\s\S]*?)(?=(?:####\s*4\.\d|###\s*Section\s*4\.\d|\n####\s*4|\n###\s*4|$))/i);
    if (dynSecMatch) {
      const full43 = dynSecMatch[1].trim();
      // Check if 4.3 contains automation subheading/bullet
      const autoSplitIdx = full43.search(/(?:^|\n)(?:#{1,6}\s*|\*\s+\*\*|\*\*?)?(?:Mix Automation|Automation Strategy|Automation Passes|Fader Rides)/i);
      if (autoSplitIdx !== -1) {
        result.mixStrategy.dynamicControl = full43.substring(0, autoSplitIdx).trim().replace(/^\s*\*\s+/gm, '• ');
        result.mixStrategy.automation = full43.substring(autoSplitIdx).trim().replace(/^\s*\*\s+/gm, '• ');
      } else {
        result.mixStrategy.dynamicControl = full43.replace(/^\s*\*\s+/gm, '• ');
      }
    } else {
      // Fallback
      const legacyDyn = s4Text.match(/(?:Dynamic Control|Subgroup|Bus Processing|Subgroup Strategy|Sidechain)[^:\n]*:?\s*([\s\S]*?)(?=(?:###|\n####|\*\*4\.\d|\*\*Spatial|\*\*Master Bus|\*\*Master Limiting|$))/i);
      if (legacyDyn) {
        result.mixStrategy.dynamicControl = legacyDyn[1].trim().replace(/^\s*\*\s+/gm, '• ');
      }
    }

    // Clean any leaked fader table from dynamicControl
    if (result.mixStrategy.dynamicControl && /\|[^\n]*(?:stem|element)[^\n]*\|/i.test(result.mixStrategy.dynamicControl)) {
      result.mixStrategy.dynamicControl = result.mixStrategy.dynamicControl.replace(/\|[^\n]*(?:stem|element)[^\n]*\|\n\|[-| :]+\|\n(?:\|[^\n]+\|\n?)+/gi, '').trim();
    }

    // 4. Spatial Depth & Time-Based FX (Section 4.4)
    const spatMatch = s4Text.match(/(?:####\s*4\.4[^\n]*|\bSpatial Depth[^\n]*)\n([\s\S]*?)(?=(?:####\s*4\.\d|###\s*Section\s*4\.\d|\n####\s*4|\n###\s*4|$))/i);
    if (spatMatch) {
      result.mixStrategy.spatialDepth = spatMatch[1].trim().replace(/^\s*\*\s+/gm, '• ');
    } else {
      // Fallback
      const legacySpat = s4Text.match(/(?:Spatial Depth|Time-Based FX|Reverb & Delay|Spatial Dimension|Front-to-Back)[^:\n]*:?\s*([\s\S]*?)(?=(?:###|\n####|\*\*4\.\d|\*\*Automation|\*\*Master Bus|\*\*Master Limiting|\|[^\n]+\|[-| :]+|$))/i);
      if (legacySpat) {
        result.mixStrategy.spatialDepth = legacySpat[1].trim().replace(/^\s*\*\s+/gm, '• ');
      }
    }

    // 5. Automation Strategy (if not already extracted from Section 4.3)
    if (!result.mixStrategy.automation) {
      const autoMatch = s4Text.match(/(?:####\s*4\.\d\s+)?(?:Automation Strategy|Mix Automation|Fader Rides)[^:\n]*:?\s*([\s\S]*?)(?=(?:####\s*4\.\d|###\s*Section\s*4\.\d|\n####\s*4|\n###\s*4|$))/i);
      if (autoMatch) {
        result.mixStrategy.automation = autoMatch[1].trim().replace(/^\s*\*\s+/gm, '• ');
      }
    }

    // 6. Master Bus Table (Search specifically within Section 4.5 to avoid collision with 4.1)
    const s45TableIdx = s4Text.search(/(?:####\s*4\.5|###\s*Section 4\.5|Master Bus Processing|Master Bus Signal Chain|Mastering & Final Limiting)/i);
    const s45Text = s45TableIdx !== -1 ? s4Text.substring(s45TableIdx) : s4Text;
    const tableMatch = s45Text.match(/\|[^\n]+\|\n\|[-| :]+\|\n((?:\|[^\n]+\|\n?)+)/);
    if (tableMatch) {
      result.masterBus.table = [];
      const rows = tableMatch[1].trim().split('\n');
      for (const row of rows) {
        const cells = row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (cells.length >= 3) {
          result.masterBus.table.push({
            stage: cells[0],
            processor: cells[1],
            settings: cells[2],
            objective: cells[3] || ''
          });
        }
      }
    }

    // 7. Backward compatibility for legacy outputs
    const mixBusMatch = s4Text.match(/\*\s+\*\*Mix Bus Signal Chain:\*\*\s*([\s\S]*?)(?=\*\s+\*\*Master Limiting|\*\s+\*\*Automation|###|$)/i);
    if (mixBusMatch) {
      result.masterBus.mixBusChain = mixBusMatch[1].trim();
    }

    const limitMatch = s4Text.match(/(?:Master Limiting|Mastering & Final Limiting|Loudness & Dynamic Range)[^*:\n]*:?\s*([\s\S]*?)(?=(?:###|Section 5|$))/i);
    if (limitMatch) {
      result.masterBus.limiting = limitMatch[1].trim().replace(/^\s*\*\s+/gm, '• ');
    }
  }

  return result;
}
