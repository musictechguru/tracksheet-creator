/**
 * tracksheetParser.js
 * Robust parser that transforms raw Markdown from Historical Track Sheets
 * into structured data models for both the Dossier (Option 2) and Console Sheet (Option 3) layouts.
 */

// Helper to clean score and source string: returns { value: "Data", score: "10/10", scoreNum: 10, source: "Official Notes" }
export function extractScoreAndSource(text) {
  if (!text) return { value: '', score: '', scoreNum: 0, source: '' };

  let value = text.trim();
  let score = '';
  let scoreNum = 0;
  let source = '';

  // Match: - Score: [10/10] (Source: XYZ) or - Reliability Score: [9/10] (Source: XYZ)
  const scoreMatch = value.match(/(?:-\s*)?(?:Reliability\s*)?Score:\s*\[(\d+)(?:\/10)?\](?:\s*\((?:Source:\s*)?([^)]+)\))?/i);
  if (scoreMatch) {
    score = scoreMatch[1] ? `${scoreMatch[1]}/10` : '';
    scoreNum = parseInt(scoreMatch[1], 10) || 0;
    source = scoreMatch[2] ? scoreMatch[2].replace(/^Source:\s*/i, '').trim() : '';
    // Strip score & source from value
    value = value.replace(scoreMatch[0], '').trim();
    // Clean trailing dashes, colons or spaces
    value = value.replace(/[-:]\s*$/, '').trim();
  }

  return { value, score, scoreNum, source };
}

export function parseHistoricalTracksheet(markdown) {
  if (!markdown) return null;

  const result = {
    title: '',
    song: '',
    artist: '',
    genre: '',
    datesRecorded: '',
    recordCompany: '',
    catalogNo: '',
    releaseDate: '',
    youtubeUrl: '',
    metadataList: [],

    personnel: {
      producers: [],
      chiefEngineers: [],
      assistantEngineers: [],
      mixEngineers: [],
      masteringEngineers: [],
      musicians: []
    },

    studio: {
      trackingStudio: '',
      mixingStudio: '',
      console: '',
      tapeMachine: '',
      monitors: '',
      outboard: []
    },

    musicology: {
      formBreakdown: [],
      key: '',
      tempo: '',
      bpm: '',
      timeSignature: '4/4',
      arrangementTechniques: ''
    },

    mixdown: {
      architecture: '',
      masterBusChain: '',
      masterTape: '',
      spatialStaging: '',
      rawContent: ''
    },

    instruments: [],
    references: [],
    structuredData: null,
    overallConfidence: 95
  };

  const lines = markdown.split('\n');
  let currentSection = 0; // 1: Metadata, 2: Personnel, 3: Studio, 4: Musicology, 5: Signal Chains, 6: Mixdown, 7: References, 8: JSON
  let currentInstrument = null;
  let currentMusicologyField = null;
  const scoresCollected = [];

  // 1. Extract Main Title (e.g. # TRACKSHEET: What Do You Want From Me by Pink Floyd)
  const titleMatch = markdown.match(/^#\s*TRACKSHEET:\s*(.+)$/m);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
    const byMatch = result.title.match(/^(.+?)\s+by\s+(.+)$/i);
    if (byMatch) {
      result.song = byMatch[1].trim();
      result.artist = byMatch[2].trim();
    }
  }

  // Iterate line by line to parse sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Section Headers
    if (trimmed.startsWith('## ')) {
      const lowerHeader = trimmed.toLowerCase();
      if (lowerHeader.includes('1.') || lowerHeader.includes('general metadata')) {
        currentSection = 1;
      } else if (lowerHeader.includes('2.') || lowerHeader.includes('personnel')) {
        currentSection = 2;
      } else if (lowerHeader.includes('3.') || lowerHeader.includes('location') || lowerHeader.includes('studio') || lowerHeader.includes('technical')) {
        currentSection = 3;
      } else if (lowerHeader.includes('musical') || lowerHeader.includes('structural') || (lowerHeader.includes('4.') && !lowerHeader.includes('instrument') && !lowerHeader.includes('pathway') && !lowerHeader.includes('signal chain'))) {
        currentSection = 4;
      } else if (lowerHeader.includes('pathway') || lowerHeader.includes('signal chain') || lowerHeader.includes('recording pathway') || lowerHeader.includes('instrument') || lowerHeader.includes('track sheet') || lowerHeader.includes('5.')) {
        currentSection = 5;
      } else if (lowerHeader.includes('mixdown') || lowerHeader.includes('master bus') || (lowerHeader.includes('6.') && lowerHeader.includes('mix')) || lowerHeader.includes('stereo master tape')) {
        currentSection = 6;
      } else if (lowerHeader.includes('reference') || lowerHeader.includes('source') || lowerHeader.includes('authoritative') || lowerHeader.includes('7.')) {
        currentSection = 7;
      } else if (lowerHeader.includes('structured data') || lowerHeader.includes('json') || lowerHeader.includes('8.')) {
        currentSection = 8;
      } else {
        currentSection = 0;
      }
      continue;
    }

    // SECTION 1: General Metadata
    if (currentSection === 1) {
      const bulletMatch = trimmed.match(/^\*\s+\*\*([^:]+):\*\*\s*(.*)$/);
      if (bulletMatch) {
        const key = bulletMatch[1].trim().toLowerCase();
        const rawVal = bulletMatch[2].trim();
        const parsed = extractScoreAndSource(rawVal);
        if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

        if (key.includes('song')) {
          result.song = parsed.value || result.song;
        } else if (key.includes('artist')) {
          result.artist = parsed.value || result.artist;
        } else if (key.includes('genre') || key.includes('style')) {
          result.genre = parsed.value;
        } else if (key.includes('date') && key.includes('record')) {
          result.datesRecorded = parsed.value;
        } else if (key.includes('company') || key.includes('label')) {
          result.recordCompany = parsed.value;
        } else if (key.includes('release')) {
          result.releaseDate = parsed.value;
        } else if (key.includes('youtube')) {
          const ytMatch = rawVal.match(/\((https?:\/\/[^)]+)\)/);
          if (ytMatch) result.youtubeUrl = ytMatch[1];
        }

        result.metadataList.push({
          label: bulletMatch[1].trim(),
          value: parsed.value,
          score: parsed.score,
          source: parsed.source
        });
      }
    }

    // SECTION 2: Personnel
    else if (currentSection === 2) {
      const bulletMatch = trimmed.match(/^\*\s+\*\*([^:]+):\*\*\s*(.*)$/);
      const subMusicianMatch = trimmed.match(/^\s*\*\s+([^-]+)\s*-\s*(.*)$/);

      if (bulletMatch) {
        const role = bulletMatch[1].trim();
        const rawVal = bulletMatch[2].trim();
        const parsed = extractScoreAndSource(rawVal);
        if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

        const lowerRole = role.toLowerCase();
        if (lowerRole.includes('producer')) {
          result.personnel.producers.push({ role, name: parsed.value, score: parsed.score, source: parsed.source });
        } else if (lowerRole.includes('chief') || lowerRole.includes('recording engineer')) {
          result.personnel.chiefEngineers.push({ role, name: parsed.value, score: parsed.score, source: parsed.source });
        } else if (lowerRole.includes('assistant') || lowerRole.includes('tape op')) {
          result.personnel.assistantEngineers.push({ role, name: parsed.value, score: parsed.score, source: parsed.source });
        } else if (lowerRole.includes('mixing')) {
          result.personnel.mixEngineers.push({ role, name: parsed.value, score: parsed.score, source: parsed.source });
        } else if (lowerRole.includes('mastering')) {
          result.personnel.masteringEngineers.push({ role, name: parsed.value, score: parsed.score, source: parsed.source });
        } else if (parsed.value) {
          result.personnel.chiefEngineers.push({ role, name: parsed.value, score: parsed.score, source: parsed.source });
        }
      } else if (subMusicianMatch) {
        const name = subMusicianMatch[1].trim();
        const rest = subMusicianMatch[2].trim();
        const parsed = extractScoreAndSource(rest);
        if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

        result.personnel.musicians.push({
          name,
          instruments: parsed.value,
          score: parsed.score,
          source: parsed.source
        });
      }
    }

    // SECTION 3: Location & Studio Technology
    else if (currentSection === 3) {
      const bulletMatch = trimmed.match(/^\*\s+\*\*([^:]+):\*\*\s*(.*)$/);
      const subBullet = trimmed.match(/^\s*\*\s+([^:]+):\s*(.*)$/);

      if (bulletMatch) {
        const key = bulletMatch[1].trim().toLowerCase();
        const rawVal = bulletMatch[2].trim();
        const parsed = extractScoreAndSource(rawVal);
        if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

        if (key.includes('tracking studio') || key.includes('studio recorded')) {
          result.studio.trackingStudio = parsed.value;
        } else if (key.includes('mixing') && key.includes('studio')) {
          result.studio.mixingStudio = parsed.value;
        } else if (key.includes('console') || key.includes('desk')) {
          result.studio.console = parsed.value;
        } else if (key.includes('tape') || key.includes('multitrack')) {
          result.studio.tapeMachine = parsed.value;
        } else if (key.includes('monitor')) {
          result.studio.monitors = parsed.value;
        } else if (parsed.value) {
          result.studio.outboard.push({
            category: bulletMatch[1].trim(),
            gear: parsed.value,
            score: parsed.score,
            source: parsed.source
          });
        }
      } else if (subBullet && currentSection === 3) {
        const category = subBullet[1].trim();
        const rawVal = subBullet[2].trim();
        const parsed = extractScoreAndSource(rawVal);
        if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

        result.studio.outboard.push({
          category,
          gear: parsed.value,
          score: parsed.score,
          source: parsed.source
        });
      }
    }

    // SECTION 4: Musical & Structural Analysis
    else if (currentSection === 4) {
      const isIndented = /^\s{2,}\*/.test(line);
      const bulletMatch = trimmed.match(/^\*\s+\*\*([^*]+)\*\*\s*(.*)$/);

      if (bulletMatch && !isIndented) {
        const key = bulletMatch[1].replace(/:$/, '').trim().toLowerCase();
        const rawVal = bulletMatch[2].replace(/^:\s*/, '').trim();
        const parsed = extractScoreAndSource(rawVal);
        if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

        if (key.includes('form') || key.includes('structure')) {
          currentMusicologyField = 'form';
          if (parsed.value) {
            const parts = parsed.value.split(/->|→/).map(p => p.trim()).filter(Boolean);
            if (parts.length > 0) {
              result.musicology.formBreakdown = parts;
            }
          }
        } else if (key.includes('key') || key.includes('tempo') || key.includes('modulation')) {
          currentMusicologyField = 'key_tempo';
          if (parsed.value) {
            const text = parsed.value;
            const keyMatch = text.match(/(?:Root Key of|Key of|in|Key:?)\s*([A-G][b#]?(?:\s*(?:Major|Minor|Aeolian|Dorian|Mixolydian))?)/i);
            if (keyMatch) result.musicology.key = keyMatch[1].trim();
            else result.musicology.key = text.split('.')[0];

            const bpmMatch = text.match(/(\d{2,3})\s*BPM/i);
            if (bpmMatch) {
              result.musicology.bpm = bpmMatch[1];
              result.musicology.tempo = `${bpmMatch[1]} BPM`;
            }

            const timeMatch = text.match(/(\d\/\d)/);
            if (timeMatch) result.musicology.timeSignature = timeMatch[1];
          }
        } else if (key.includes('arrangement') || key.includes('production')) {
          currentMusicologyField = 'arrangement';
          if (parsed.value) {
            result.musicology.arrangementTechniques = parsed.value;
          }
        } else {
          currentMusicologyField = null;
        }
      } else if (bulletMatch && isIndented && currentMusicologyField) {
        // Sub-bullet under an active Section 4 heading
        const subKey = bulletMatch[1].replace(/:$/, '').trim();
        const subRawVal = bulletMatch[2].replace(/^:\s*/, '').trim();
        const parsed = extractScoreAndSource(subRawVal);
        if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

        if (currentMusicologyField === 'form') {
          // Format as "Intro (0:00 - 0:13)" or clean title
          const label = subKey || parsed.value;
          if (label && !result.musicology.formBreakdown.includes(label)) {
            result.musicology.formBreakdown.push(label);
          }
        } else if (currentMusicologyField === 'key_tempo') {
          const combined = `${subKey}: ${parsed.value}`;
          const keyMatch = combined.match(/(?:Root Key of|Key of|Key:?)\s*([A-G][b#]?(?:\s*(?:Major|Minor|Aeolian|Dorian|Mixolydian))?)/i);
          if (keyMatch && !result.musicology.key) result.musicology.key = keyMatch[1].trim();
          else if (!result.musicology.key && subKey.toLowerCase().includes('key') && parsed.value) {
            const directKey = parsed.value.match(/([A-G][b#]?(?:\s*(?:Major|Minor|Aeolian|Dorian|Mixolydian))?)/i);
            if (directKey) result.musicology.key = directKey[1].trim();
          }

          const bpmMatch = combined.match(/(\d{2,3})\s*BPM/i);
          if (bpmMatch && !result.musicology.bpm) {
            result.musicology.bpm = bpmMatch[1];
            result.musicology.tempo = `${bpmMatch[1]} BPM`;
          }

          const timeMatch = combined.match(/(\d\/\d)/);
          if (timeMatch) result.musicology.timeSignature = timeMatch[1];
        } else if (currentMusicologyField === 'arrangement') {
          const phrase = subKey ? `${subKey}: ${parsed.value}` : parsed.value;
          if (phrase) {
            result.musicology.arrangementTechniques = result.musicology.arrangementTechniques
              ? `${result.musicology.arrangementTechniques} ${phrase}`
              : phrase;
          }
        }
      }
    }

    // SECTION 5: Historical Recording Pathways & Session Signal Chains
    else if (currentSection === 5) {
      const h3Match = trimmed.match(/^###\s*(.+)$/);
      const bulletInstMatch = trimmed.match(/^\*\s+\*\*([^*]+)\*\*(?:\s*-\s*(.*))?$/);

      const isPropertyKey = (name) => {
        const l = (name || '').toLowerCase();
        return (
          l.includes('historical instrument') ||
          l.includes('backline') ||
          l.includes('capture pathway') ||
          l.includes('input method') ||
          l.includes('microphon') ||
          l.includes('transducer') ||
          l.includes('placement') ||
          l.includes('distance') ||
          l.includes('baffling') ||
          l.includes('stereo') ||
          l.includes('multi-mic') ||
          l.includes('signal chain') ||
          l.includes('analog tracking') ||
          l.includes('hardware processing') ||
          l.includes('multitrack tape') ||
          l.includes('allocation') ||
          l.includes('bouncing') ||
          l.includes('mix balance') ||
          l.includes('panning') ||
          l.includes('mix processing') ||
          l.includes('mixdown processing') ||
          l.includes('outboard fx') ||
          l.includes('plugin') ||
          l.includes('score') ||
          l.includes('source')
        );
      };

      if (h3Match) {
        if (currentInstrument) {
          result.instruments.push(currentInstrument);
        }
        currentInstrument = createInstrumentModel(h3Match[1].trim());
        continue;
      } else if (bulletInstMatch && !isPropertyKey(bulletInstMatch[1])) {
        if (currentInstrument) {
          result.instruments.push(currentInstrument);
        }
        currentInstrument = createInstrumentModel(bulletInstMatch[1].trim());
        if (bulletInstMatch[2]) {
          const parsed = extractScoreAndSource(bulletInstMatch[2]);
          if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);
          currentInstrument.score = parsed.score;
          currentInstrument.source = parsed.source;
        }
        continue;
      }

      if (currentInstrument) {
        const propMatch = trimmed.match(/^\*?\s*\*?\s*\*\*([^:]+):\*\*\s*(.*)$/);
        const subListMatch = trimmed.match(/^\*\s+([^:]+):\s*(.*)$/);

        if (propMatch) {
          const propKey = propMatch[1].trim().toLowerCase();
          const rawVal = propMatch[2].trim();
          const parsed = extractScoreAndSource(rawVal);
          if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

          if (propKey.includes('mix balance') || propKey.includes('panning') || propKey.includes('stereo placement') || propKey.includes('spatial placement')) {
            currentInstrument.mixBalance = parsed.value;
            currentInstrument.mixBalanceScore = parsed.score;
            currentInstrument.mixBalanceSource = parsed.source;
          } else if (propKey.includes('mix processing') || propKey.includes('outboard fx') || propKey.includes('mixdown processing') || propKey.includes('mix chain') || propKey.includes('reverb send')) {
            currentInstrument.mixProcessing = parsed.value;
            currentInstrument.mixProcessingScore = parsed.score;
            currentInstrument.mixProcessingSource = parsed.source;
          } else if (propKey.includes('backline') || propKey.includes('instrument')) {
            currentInstrument.backline = parsed.value;
            currentInstrument.backlineScore = parsed.score;
            currentInstrument.backlineSource = parsed.source;
          } else if (propKey.includes('pathway') || propKey.includes('input method')) {
            currentInstrument.pathway = parsed.value;
          } else if (propKey.includes('microphon') || propKey.includes('transducer')) {
            currentInstrument.mics = parsed.value;
            currentInstrument.micScore = parsed.score;
            currentInstrument.micSource = parsed.source;
          } else if (propKey.includes('placement') || propKey.includes('distance') || propKey.includes('baffling')) {
            currentInstrument.placement = parsed.value;
          } else if (propKey.includes('stereo') || propKey.includes('multi-mic')) {
            currentInstrument.stereoArray = parsed.value;
          } else if (propKey.includes('signal chain') || propKey.includes('analog tracking') || propKey.includes('hardware processing')) {
            currentInstrument.signalChain = parsed.value;
            currentInstrument.chainScore = parsed.score;
            currentInstrument.chainSource = parsed.source;
          } else if (propKey.includes('allocation') || propKey.includes('bouncing') || propKey.includes('tape')) {
            currentInstrument.tapeAllocation = parsed.value;
          } else if (propKey.includes('plugin') || propKey.includes('daw')) {
            if (!currentInstrument.signalChain) {
              currentInstrument.signalChain = parsed.value;
            }
          }
        } else if (subListMatch) {
          // Nested item e.g. * Kick: AKG D12...
          const subKey = subListMatch[1].trim();
          const subVal = subListMatch[2].trim();
          if (subKey.toLowerCase() === 'score') {
            const parsed = extractScoreAndSource(`Score: ${subVal}`);
            if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);
            if (currentInstrument.mics && !currentInstrument.micScore) {
              currentInstrument.micScore = parsed.score;
              currentInstrument.micSource = parsed.source;
            }
          } else {
            const item = `${subKey}: ${subVal}`;
            if (currentInstrument.mics) {
              currentInstrument.mics += ` | ${item}`;
            } else {
              currentInstrument.mics = item;
            }
          }
        }
      }
    }

    // SECTION 6: Historical Mixdown, Master Bus & Stereo Master Tape
    else if (currentSection === 6) {
      const bulletMatch = trimmed.match(/^\*\s+\*\*([^:]+):\*\*\s*(.*)$/);
      if (bulletMatch) {
        const key = bulletMatch[1].trim().toLowerCase();
        const rawVal = bulletMatch[2].trim();
        const parsed = extractScoreAndSource(rawVal);
        if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

        if (key.includes('architecture') || key.includes('console routing') || key.includes('routing')) {
          result.mixdown.architecture = parsed.value;
        } else if (key.includes('master bus') || key.includes('bus chain') || key.includes('dynamics')) {
          result.mixdown.masterBusChain = parsed.value;
        } else if (key.includes('master tape') || key.includes('tape recorder') || key.includes('formulation')) {
          result.mixdown.masterTape = parsed.value;
        } else if (key.includes('spatial') || key.includes('staging') || key.includes('stereo vs') || key.includes('variants')) {
          result.mixdown.spatialStaging = parsed.value;
        }
      }
    }

    // SECTION 7: References
    else if (currentSection === 7 || currentSection === 6) {
      const refMatch = trimmed.match(/^\*\s+\[([^\]]+)\]\((https?:\/\/[^)]+)\)(?:\s*[-:]\s*(.*))?$/);
      if (refMatch) {
        result.references.push({
          title: refMatch[1].trim(),
          url: refMatch[2].trim(),
          description: refMatch[3] ? refMatch[3].trim() : ''
        });
      }
    }
  }

  if (currentInstrument) {
    result.instruments.push(currentInstrument);
  }

  // Ensure mixdown fields have intelligent historical defaults if not explicitly present in markdown
  if (!result.mixdown.architecture && !result.mixdown.masterBusChain) {
    const consoleName = result.studio.console || 'Studio Analog Console';
    const studioMix = result.studio.mixingStudio || result.studio.trackingStudio || 'Studio Facility';
    const tapeMachine = result.studio.tapeMachine || 'Analog Master Tape';
    const mixEngineers = result.personnel.mixEngineers.map(m => m.name || m.value || m).join(', ') || 'Chief Recording Engineers';

    result.mixdown.architecture = `Mixed on ${consoleName} at ${studioMix} by ${mixEngineers}. Channel faders assigned to stereo master bus with period analog summing.`;
    result.mixdown.masterBusChain = Array.isArray(result.studio.outboard) && result.studio.outboard.length > 0
      ? `Stereo bus compression and program equalization using ${result.studio.outboard.map(o => o.gear || o.value || (typeof o === 'string' ? o : o.category || 'Outboard')).slice(0, 3).join(', ')}.`
      : 'Master bus VCA / tube compression and gentle high-frequency analog air equalization.';
    result.mixdown.masterTape = `Mastered directly to 1/2-inch or 1/4-inch 2-track reel-to-reel tape (${tapeMachine}).`;
    result.mixdown.spatialStaging = result.musicology.arrangementTechniques || 'Centered low frequencies (kick/bass) with discrete wide stereo separation for guitars and keyboards.';
  }

  // Fallback for instrument mix balances if not explicitly written
  result.instruments.forEach(inst => {
    if (!inst.mixBalance) {
      const combined = `${inst.tapeAllocation} ${inst.signalChain} ${inst.placement}`.toLowerCase();
      if (combined.includes('hard-panned') || combined.includes('hard left') || combined.includes('hard l/r') || combined.includes('wide stereo')) {
        inst.mixBalance = 'Hard Left / Right Stereo Spread';
      } else if (inst.name.toLowerCase().includes('kick') || inst.name.toLowerCase().includes('bass') || inst.name.toLowerCase().includes('lead vocal')) {
        inst.mixBalance = 'Centered (C / Mono Core)';
      } else if (inst.name.toLowerCase().includes('overhead') || inst.name.toLowerCase().includes('cymbal') || inst.stereoArray) {
        inst.mixBalance = 'Wide Stereo Array (9 o\'clock / 3 o\'clock)';
      } else if (inst.name.toLowerCase().includes('snare')) {
        inst.mixBalance = 'Centered with Stereo Reverb Send';
      } else {
        inst.mixBalance = 'Balanced in Stereo Soundstage';
      }
    }
  });

  const jsonMatch = markdown.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) {
    try {
      result.structuredData = JSON.parse(jsonMatch[1]);
    } catch {
      // ignore
    }
  }

  if (scoresCollected.length > 0) {
    const avg = scoresCollected.reduce((a, b) => a + b, 0) / scoresCollected.length;
    result.overallConfidence = Math.min(100, Math.round(avg * 10));
  } else {
    result.overallConfidence = 95;
  }

  enrichInstrumentsForConsole(result.instruments);

  return result;
}

function createInstrumentModel(name) {
  return {
    name,
    backline: '',
    pathway: '',
    mics: '',
    placement: '',
    stereoArray: '',
    signalChain: '',
    tapeAllocation: '',
    mixBalance: '',
    mixBalanceScore: '',
    mixBalanceSource: '',
    mixProcessing: '',
    mixProcessingScore: '',
    mixProcessingSource: '',
    score: '',
    source: '',
    backlineScore: '',
    backlineSource: '',
    micScore: '',
    micSource: '',
    chainScore: '',
    chainSource: ''
  };
}

function enrichInstrumentsForConsole(instruments) {
  let trackCounter = 1;

  for (const inst of instruments) {
    const n = (inst.name || '').toLowerCase();
    if (n.includes('kick')) {
      inst.family = 'drums';
      inst.color = '#10B981';
      inst.defaultTracks = [trackCounter++];
    } else if (n.includes('snare')) {
      inst.family = 'drums';
      inst.color = '#10B981';
      inst.defaultTracks = [trackCounter++, trackCounter++];
    } else if (n.includes('drum') || n.includes('overhead') || n.includes('percussion') || n.includes('tom') || n.includes('hi-hat')) {
      inst.family = 'drums';
      inst.color = '#10B981';
      inst.defaultTracks = [trackCounter++, trackCounter++];
    } else if (n.includes('bass')) {
      inst.family = 'bass';
      inst.color = '#0EA5E9';
      inst.defaultTracks = [trackCounter++];
    } else if (n.includes('guitar')) {
      inst.family = 'guitar';
      inst.color = '#F59E0B';
      inst.defaultTracks = [trackCounter++, trackCounter++];
    } else if (n.includes('vocal') || n.includes('voice')) {
      inst.family = 'vocal';
      inst.color = '#A855F7';
      inst.defaultTracks = [trackCounter++];
    } else if (n.includes('key') || n.includes('piano') || n.includes('organ') || n.includes('synth') || n.includes('rhodes')) {
      inst.family = 'keys';
      inst.color = '#EAB308';
      inst.defaultTracks = [trackCounter++, trackCounter++];
    } else {
      inst.family = 'other';
      inst.color = '#EC4899';
      inst.defaultTracks = [trackCounter++];
    }

    inst.deskChannel = `Console Ch ${inst.defaultTracks[0]}`;
    inst.hardwareDynamic = extractHardwareUnits(inst.signalChain);
  }
}

function extractHardwareUnits(chain) {
  if (!chain) return 'Direct / Console';
  const units = [];
  if (/1176/i.test(chain)) units.push('UREI 1176');
  if (/la-?2a/i.test(chain)) units.push('Teletronix LA-2A');
  if (/fairchild/i.test(chain)) units.push('Fairchild 660');
  if (/tube-?tech/i.test(chain)) units.push('Tube-Tech CL1B');
  if (/ssl/i.test(chain)) units.push('SSL G-Comp');
  if (/neve/i.test(chain)) units.push('Neve 1081/1073');
  if (/lexicon/i.test(chain)) units.push('Lexicon 480L');
  if (/emt/i.test(chain)) units.push('EMT 140 Plate');
  if (/pultec/i.test(chain)) units.push('Pultec EQP');
  if (/api/i.test(chain)) units.push('API 550');

  if (units.length > 0) return units.slice(0, 2).join(' + ');
  const parts = chain.split(/->|→/).map(s => s.trim());
  if (parts.length > 2) {
    return parts.slice(1, -1).slice(0, 2).join(' + ');
  }
  return chain.length > 30 ? `${chain.substring(0, 28)}...` : chain;
}
