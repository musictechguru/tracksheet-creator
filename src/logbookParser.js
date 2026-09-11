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
    masterBus: {
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

      // Extract Pathway 1
      const p1Match = body.match(/\*\s+\*\*Pathway 1[^*]*:\*\*\s*([\s\S]*?)(?=\*\s+\*\*Pathway 2|\*\s+⭐|\n####|$)/i);
      if (p1Match) instObj.pathway1 = p1Match[1].trim();

      // Extract Pathway 2
      const p2Match = body.match(/\*\s+\*\*Pathway 2[^*]*:\*\*\s*([\s\S]*?)(?=\*\s+\*\*Pathway 3|\*\s+⭐|\n####|$)/i);
      if (p2Match) instObj.pathway2 = p2Match[1].trim();

      // Extract Pathway 3
      const p3Match = body.match(/\*\s+\*\*Pathway 3[^*]*:\*\*\s*([\s\S]*?)(?=\*\s+⭐|\n####|\*\*Channel Strip|$)/i);
      if (p3Match) instObj.pathway3 = p3Match[1].trim();

      // Extract Preferred Pathway & Justification
      const prefMatch = body.match(/\*\s+⭐\s*PREFERRED C1 PATHWAY:\s*([^*.]+)[.*]?\s*([\s\S]*?)(?=\*\*Channel Strip|\n####|\*\s+\*\*Logic|\*\s+\*\*Pro|\*\s+\*\*Ableton|\*\s+\*\*Cubase|\*\s+\*\*3rd|$)/i);
      if (prefMatch) {
        instObj.preferredPathway = prefMatch[1].trim();
        instObj.preferredJustification = prefMatch[2].trim().replace(/^\*?\s*Justification:\s*/i, '');
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
      const tpMatch = body.match(/\*\s+\*\*(?:3rd-Party|Third-Party)[^*]*:\*\*\s*([^\n]+)/i);
      if (tpMatch) {
        const line = tpMatch[1];
        const linkMatches = [...line.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)];
        if (linkMatches.length > 0) {
          instObj.thirdParty = linkMatches.map(m => ({ name: m[1], url: m[2] }));
        } else {
          instObj.thirdParty = [{ name: line.trim(), url: '' }];
        }
      }

      // Extract Examiner Pitfall
      const pitfallMatch = body.match(/\*\s+\*\*Examiner Pitfall[^*]*:\*\*\s*([^\n]+(?:\n(?!\*)[^\n]+)*)/i);
      if (pitfallMatch) {
        instObj.examinerPitfall = pitfallMatch[1].trim();
      }

      result.instruments.push(instObj);
    }
  }

  // Section 4: Mixdown & Master Bus Processing Log
  if (s4Idx !== -1) {
    const s4Text = markdown.substring(s4Idx);
    result.masterBus.rawContent = s4Text;

    const mixBusMatch = s4Text.match(/\*\s+\*\*Mix Bus Signal Chain:\*\*\s*([\s\S]*?)(?=\*\s+\*\*Master Limiting|$)/i);
    if (mixBusMatch) {
      result.masterBus.mixBusChain = mixBusMatch[1].trim();
    }

    const limitMatch = s4Text.match(/\*\s+\*\*Master Limiting[^*]*:\*\*\s*([\s\S]*?)$/i);
    if (limitMatch) {
      result.masterBus.limiting = limitMatch[1].trim();
    }
  }

  return result;
}
