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

    instruments: [],
    references: [],
    structuredData: null,
    overallConfidence: 95
  };

  const lines = markdown.split('\n');
  let currentSection = 0; // 1: Metadata, 2: Personnel, 3: Studio, 4: Musicology, 5: Signal Chains, 6: References, 7: JSON
  let currentInstrument = null;
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
      } else if (lowerHeader.includes('4.') || lowerHeader.includes('musical') || lowerHeader.includes('structural')) {
        currentSection = 4;
      } else if (lowerHeader.includes('5.') || lowerHeader.includes('pathway') || lowerHeader.includes('signal chain')) {
        currentSection = 5;
      } else if (lowerHeader.includes('6.') || lowerHeader.includes('reference') || lowerHeader.includes('source')) {
        currentSection = 6;
      } else if (lowerHeader.includes('7.') || lowerHeader.includes('structured data')) {
        currentSection = 7;
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
      const bulletMatch = trimmed.match(/^\*\s+\*\*([^:]+):\*\*\s*(.*)$/);
      if (bulletMatch) {
        const key = bulletMatch[1].trim().toLowerCase();
        const rawVal = bulletMatch[2].trim();
        const parsed = extractScoreAndSource(rawVal);
        if (parsed.scoreNum) scoresCollected.push(parsed.scoreNum);

        if (key.includes('form') || key.includes('structure')) {
          const parts = parsed.value.split(/->|→/);
          if (parts.length > 1) {
            result.musicology.formBreakdown = parts.map(p => p.trim()).filter(Boolean);
          } else {
            result.musicology.formBreakdown = [parsed.value];
          }
        } else if (key.includes('key') || key.includes('tempo') || key.includes('modulation')) {
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
        } else if (key.includes('arrangement') || key.includes('production')) {
          result.musicology.arrangementTechniques = parsed.value;
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

          if (propKey.includes('backline') || propKey.includes('instrument')) {
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

    // SECTION 6: References
    else if (currentSection === 6) {
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
