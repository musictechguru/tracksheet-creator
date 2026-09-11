// Chronologically ordered activity phrases for Tracksheet search and DAW-specific Component 1 generation

export const TRACKSHEET_ACTIVITY_PHRASES = [
  // 1. Archival Ingest & Tape Vault Forensics
  'Entering the studio archive vaults with a flashlight and a sense of dread…',
  'Blowing 40 years of mysterious tape dust off the master tape boxes…',
  'Deciphering tape box scribbles: coffee stain or assistant engineer tears from 1974?…',
  'Translating engineer grease-pencil notes written in illegible cursive…',
  'Inspecting 2-inch 24-track reels and praying the tape hasn’t turned to marmalade…',
  'Checking tape speed calibration: 15 ips, 30 ips, or whatever speed was running before lunch…',
  'Auditing Dolby A noise reduction logs and hoping nobody bypassed the encode…',
  'Aligning vintage tape heads with an oscilloscope and sheer optimism…',

  // 2. Studio Facility, Acoustics & Historic Console
  'Tracking down the historic studio room: Abbey Road, Sound City, or a damp basement in Soho…',
  'Reconstructing the session timeline before the record label budget ran out…',
  'Cross-referencing the mixing console patchbay with 200 tangled bantam patch cords…',
  'Wiping vintage tea and tobacco stains off the Neve console armrest…',
  'Auditing discrete transformers for that mystical, non-quantifiable "analog warmth"…',
  'Checking console summing bus headroom before the red overload LEDs catch fire…',

  // 3. Personnel, Musicians & Arrangement Structure
  'Hunting down session personnel and discovering the drummer was paid in cold pizza…',
  'Tracking down uncredited session legends who secretly played all the guitar solos…',
  'Cross-referencing Musicians\' Union booking ledgers from the local pub around the corner…',
  'Analyzing song structure: Intro, Verse, Chorus, and the obligatory 4-minute guitar solo…',
  'Verifying song key and checking if the tape machine varispeed was slightly flat on purpose…',
  'Auditing multitrack stem assignments across 24 tracks of pure musical chaos…',

  // 4. Rhythm Section & Transducer Tracking
  'Begging the drummer to stop hitting the china cymbal while soundchecking the kick…',
  'Stuffing an old sofa cushion and a vintage pillow inside the bass drum shell…',
  'Managing acoustic spill before the hi-hat bleeds into every microphone in the northern hemisphere…',
  'Debating whether the bass guitar was DI’d or piped through a roaring SVT fridge cabinet…',
  'Politely asking the guitarist why they brought a 100-watt full stack to track a gentle acoustic intro…',
  'Forcing the guitarist to tune their G-string with an actual electronic tuner…',

  // 5. Vocals, Brass & Auxiliary Instruments
  'Inspecting the vocal chain: vintage valve condenser and a pop shield made from pantyhose…',
  'Reminding the vocalist that the pop shield is not an edible microphone lollipop…',
  'Herding 6 backing vocalists around a single omni mic without anyone elbowing the ribbon…',
  'Positioning brass players 3 feet back so they don’t blow the capsule out of the microphone…',
  'Miking the string quartet while asking them kindly not to squeak their wooden chairs…',
  'Miking the vintage Leslie rotary speaker and praying the drive belt doesn’t snap mid-chorus…',
  'Warming up vintage analog synthesizers: tuning oscillators that drift with room temperature…',

  // 6. Outboard Dynamics, EQ & Time-Based Processing
  'Dialing vintage analog EQ: boosting 10 kHz for "air" and cutting 300 Hz for "not sounding like mud"…',
  'Setting hardware compressor gain reduction: enough to tame the vocal, not enough to crush their soul…',
  'Firing up the EMT 140 steel plate reverb: 600 lbs of metal sheet hanging in the basement…',
  'Calibrating tape slapback delay using a razor blade, splicing block, and a prayer…',
  'Pushing the master bus compressor needle just hard enough to make the meters dance…',
  'Bouncing 12 vocal stems down to 2 tracks because we ran out of tape reels…',

  // 7. Mastering, Compatibility & Final Synthesis
  'Checking analog VU meter needles: pinned in the red, exactly as the 1970s intended…',
  'Flipping the mono switch to make sure the entire chorus doesn’t vanish into phase oblivion…',
  'Inspecting master lacquer cutting notes: "Keep low end mono so the stylus doesn’t jump out of the groove"…',
  'Synthesizing archival forensics into an airtight musicological dossier…',
  'Finalizing historical tracksheet before the tape machine eats the master reel…'
];

export const DAW_ACTIVITY_PHRASES = {
  'Logic Pro': [
    // Phase 1: Session Setup & Architecture
    'Firing up Logic Pro and thanking the gods it didn’t crash on the CoreAudio driver…',
    'Setting audio engine to 44.1 kHz / 24-bit (and closing 47 Chrome tabs to save RAM)…',
    'Color-coding mixer channels with neon pastel shades so the examiner knows we mean business…',
    'Labeling aux buses with names more professional than "Drum Smash 1" and "Vocal Big Boy"…',

    // Phase 2: Pathway 1 - Acoustic Drum Multi-Miking
    'Engineering Pathway 1: Mic’ing the kick drum with an AKG D112 ("the golden school studio egg")…',
    'Aiming the dynamic mic inside the port hole without letting the beater punch through the grille…',
    'Angling the Shure SM57 45° across the snare rim: the most reliable 4-inch distance in human history…',
    'Rigging small diaphragm condenser overheads with the 3:1 rule so cymbals don’t sound like falling cutlery…',
    'Inverting drum channel phase: discovering half the low end was currently disappearing into the void…',
    'Ransacking the school music tech mic locker for 4 microphone clips that aren’t cracked…',

    // Phase 3: Pathway 2 - DI Box & Preamp Calibration
    'Engineering Pathway 2: Plugging bass into a BSS AR-133 DI box and praying phantom power works…',
    'Flipping the ground lift switch to banish the demonic 50 Hz mains hum back to the underworld…',
    'Gain-staging audio interface preamps: green LEDs happy, amber LEDs sweating, red LEDs strictly forbidden…',
    'Miking the guitar amp cabinet with a trusty dynamic mic aimed 2 inches off the dust cap…',

    // Phase 4: Vocals & Acoustic Tracking
    'Rigging the Large Diaphragm Condenser vocal chain with a double-mesh pop filter…',
    'Positioning the reflection filter around the singer to tame the acoustics of the school practice room…',
    'Reminding the vocalist to stay 6 inches away so proximity effect doesn’t turn their voice into Barry White…',
    'Positioning an SDC condenser at the acoustic guitar 12th fret to avoid soundhole boomy boom…',

    // Phase 5: Pathway 3 - Virtual Instruments & MIDI
    'Engineering Pathway 3: Summoning Logic Pro Studio Instruments without letting it sound like a ringtone…',
    'Humanizing MIDI note velocities so the drummer doesn’t sound like a caffeinated cyborg…',
    'Injecting subtle groove swing because nobody on Earth plays quantised at 100.000% grid…',
    'Drawing smooth CC11 Expression curves with a mouse and heroic wrist endurance…',

    // Phase 6: Channel EQ & Dynamics (Logic Pro Stock)
    'Instantiating Logic Channel EQ: notching out 320 Hz "cardboard box resonance"…',
    'Slapping an 80 Hz high-pass filter on vocals, guitars, and anything that isn’t a bass instrument…',
    'Selecting Logic Vintage FET compressor circuit: cranking the attack for that aggressive 1176 snare snap…',
    'Switching to Vintage Opto for vocals: smooth optical leveling that forgives singer microphone antics…',
    'Tuning compressor release time to track tempo so the needle breathes musically in 4/4 time…',

    // Phase 7: Space Designer & ChromaGlow
    'Loading Space Designer convolution reverb: dialed to a vintage studio plate impulse response…',
    'Setting ChromaVerb predelay to 30 ms so the dry vocal cuts through before the cathedral arrives…',
    'Engaging Logic 11 ChromaGlow saturation (Modern Tube mode): adding 12% "expensive console mojo"…',
    'Inserting Tape Delay with dotted 8th note repeats to give the lead guitar that stadium swagger…',

    // Phase 8: De-Esser & 3rd-Party Hyperlinks
    'Sweeping Logic De-Esser detection to 6.8 kHz: extinguishing sibilant laser beams…',
    'Cross-referencing FabFilter Pro-Q 3 and Waves CLA-76 with functioning hyperlink validation…',
    'Referencing UAD LA-2A and Soothe2: because examiners love to see students dream big…',

    // Phase 9: Examiner Warnings & Master Track Sheet
    'Formulating Examiner Traps: phase cancellation between Kick and Overheads (examiners smell this instantly)…',
    'Warning against digital clipping: "Red lights in digital audio mean sadness, not warmth"…',
    'Compiling Master Track Sheet: hardware inputs, pan laws, and fader balances…',
    'Panning instruments across the stereo field so everyone isn’t clambering over each other at Center 0…',

    // Phase 10: Master Output & Finalization
    'Checking mix bus headroom: sitting comfortably at -12 dBFS peak before the master chain…',
    'Engaging Logic Pro Mastering Assistant with Clean profile (and pretending we knew all the AI math)…',
    'Locking Adaptive Limiter true peak ceiling to -1.0 dBFS: keeping the examiner’s eardrums intact…',
    'Confirming integrated loudness hits the -14 to -16 LUFS target on the nose…',
    'Finalizing official Logic Pro Component 1 Completed Logbook… ready to submit and celebrate!'
  ],

  'Protools': [
    // Phase 1: Session Setup & Pro Tools Architecture
    'Launching Pro Tools and holding our breath waiting for the playback engine to initialize…',
    'Configuring 24-bit / 44.1 kHz BWF session (and checking that the iLok cloud didn’t disconnect)…',
    'Setting Hardware Buffer Size to 64 samples for tracking: zero latency, maximum adrenaline…',
    'Creating dedicated Aux Input stem tracks for Drums, Guitars, Keys, and Vocal submixes…',

    // Phase 2: Pathway 1 - Drum Capture
    'Engineering Pathway 1: Assigning multi-mic drum stems across the Pro Tools Mix window…',
    'Aiming the kick mic towards the beater: maximum thud, minimal shoe squeak…',
    'Positioning Shure SM57 over snare rim with cardioid null precisely aimed at the noisy hi-hat…',
    'Measuring Overhead spaced pair equidistant from snare center using an XLR cable as a tape measure…',
    'Flipping the channel Phase Invert switch: instant low-end reinforcement, phase cancellation defeated…',
    'Specifying robust UK school studio mics (AKG D112, SM57, SDC pair) that survive student drop tests…',

    // Phase 3: Pathway 2 - DI Tracking & Preamp Gain
    'Engineering Pathway 2: Direct Injection for bass guitar, bypassing noisy student practice amps…',
    'Checking DI box impedance: high-Z engaged, active buffer running, 50 Hz hum successfully terminated…',
    'Setting interface preamp gain: peaks hovering comfortably around -14 dBFS with plenty of daylight…',
    'Miking the guitar amp speaker 2 inches off-center to skip the ice-pick treble zone…',

    // Phase 4: Vocals & Acoustic Tracking
    'Setting up vocal track with cardioid Large Diaphragm Condenser and shockmount suspension…',
    'Tightening the gooseneck pop filter before gravity makes it droop mid-chorus…',
    'Instructing the vocalist to stand 6 inches back: preserving dynamics and saving the condenser capsule…',
    'Aiming an SDC at the 12th fret of the acoustic guitar: crisp fretboard sparkle, zero boomy resonance…',

    // Phase 5: Pathway 3 - Instrument Tracks & MIDI
    'Engineering Pathway 3: Pro Tools Instrument Tracks with Boom, Structure Free, or Xpand!2…',
    'Sequencing backing instruments with MIDI clips and resisting the urge to overcomplicate chords…',
    'Applying Pro Tools MIDI Real-Time Properties: humanizing velocities so it doesn’t sound like a Commodore 64…',
    'Drawing CC11 Expression automation curves without causing RSI in the mouse finger…',

    // Phase 6: Pro Tools Stock Processing (EQ3 & Dyn3)
    'Inserting Avid EQ3 7-Band on kick: sweeping the Q band to notch out the hollow 320 Hz bin…',
    'Engaging 85 Hz High-Pass filter on vocals, guitars, and overheads to banish mic stand rumble…',
    'Loading Pro Tools Dyn3 Compressor on snare top: setting 4:1 ratio for explosive crack…',
    'Dialing 25 ms attack on Dyn3 so the drumstick transient punches through before the clamp engages…',
    'Applying gentle 2.5:1 Dyn3 leveling on bass DI to smooth out uneven student finger-picking…',
    'Tuning compressor release times to groove naturally with the song tempo…',

    // Phase 7: Aux Sends, D-Verb & Mod Delay
    'Setting up post-fader Aux Sends to internal Bus 1-2 for spatial time-based processing…',
    'Inserting the legendary Pro Tools D-Verb: choosing Medium Plate (the sound of 10,000 university demos)…',
    'Dialing 25 ms predelay on D-Verb so the dry vocal remains upfront while the cathedral sits behind…',
    'Inserting Avid Mod Delay III with tempo-synced dotted 8th stereo ping-pong repeats…',

    // Phase 8: Specialist Plugins & 3rd-Party Alternatives
    'Inserting Avid Dyn3 De-Esser: hunting sibilance around 7.2 kHz without giving the singer a lisp…',
    'Linking industry 3rd-party alternatives: FabFilter Pro-C 2, Pro-Q 3, and Soundtoys EchoBoy…',
    'Referencing Universal Audio 1176 LN and Waves SSL G-Master bus compressor hyperlinks…',

    // Phase 9: Examiner Warnings & Track Sheet Construction
    'Compiling Examiner Pitfalls: warning against drum phase comb filtering and headphone bleed…',
    'Explaining to examiners why clipping interface preamps produces "pain, not analog saturation"…',
    'Compiling Master Track Sheet: track names, hardware input assignments, faders, and pan spots…',
    'Setting stereo pan law (-3.0 dB compensated) and balancing track panorama positions…',

    // Phase 10: Master Fader & Final Verification
    'Creating Master Fader stereo track for mix bus gain staging (Pro Tools 101 requirement)…',
    'Inserting Avid Maxim / Master Limiter with True Peak ceiling pinned to -1.0 dBFS…',
    'Verifying integrated loudness adheres strictly to -14 to -16 LUFS target…',
    'Formatting technical mixdown tables and channel strip insertion logs…',
    'Finalizing official Pro Tools Component 1 Completed Logbook… session safely saved (Command+S pressed twice)!'
  ],

  'Ableton': [
    // Phase 1: Session Setup & Architecture
    'Launching Ableton Live and resisting the urge to make a 4-on-the-floor techno loop instead…',
    'Configuring Ableton Audio Engine preferences: 44.1 kHz / 24-bit with minimal buffer latency…',
    'Switching to Arrangement View because the examiner expects a real chronological song timeline…',
    'Creating Group Tracks for Drums, Guitars, and Vocals with pleasing custom color palettes…',

    // Phase 2: Pathway 1 - Acoustic Drum Kit Tracking
    'Engineering Pathway 1: Multi-mic drum kit capture routed into dedicated audio tracks…',
    'Positioning dynamic kick mic inside port hole pointed at beater: maximum thump, zero cabinet rumble…',
    'Setting snare top dynamic mic with cardioid rejection null aimed squarely at the noisy hi-hat…',
    'Rigging matched SDC pair in spaced array: measuring distances with an XLR lead and genuine hope…',
    'Flipping Ableton Live Utility phase invert to confirm kick and overheads are in phase agreement…',
    'Auditing standard school mic locker gear (AKG D112, Shure SM57, SDC pair) for realistic exam marks…',

    // Phase 3: Pathway 2 - DI Box & Interface Tracking
    'Engineering Pathway 2: Direct Injection recording for bass guitar via active DI box…',
    'Engaging DI ground lift switch to silence the ghost humming inside the electrical mains…',
    'Setting interface preamp gain: peak signal hovering at -14 dBFS (saving headroom for enthusiastic choruses)…',
    'Miking electric guitar cabinet with dynamic mic aimed 2 inches off-center from speaker cone…',

    // Phase 4: Vocal & Acoustic Instrument Capture
    'Arming Lead Vocal audio track with Large Diaphragm Condenser and dual-layer pop shield…',
    'Mounting portable acoustic reflection shield to defeat the acoustic bounce of the school music room…',
    'Positioning vocalist 6 inches back: zero proximity mud, maximum vocal clarity…',
    'Tracking acoustic guitar with small diaphragm condenser aimed at 12th fret: sparkling highs, no boom…',

    // Phase 5: Pathway 3 - Virtual Instruments & MIDI
    'Engineering Pathway 3: Virtual instrument tracks via Ableton Simpler, Sampler, and Instrument Racks…',
    'Sequencing backing instruments with MIDI clips and resisting the temptation to hit 100% Quantize…',
    'Applying Ableton Groove Pool template for that elusive "human being with feelings" timing…',
    'Drawing MIDI velocity curves and automating Clip Modulation parameters…',

    // Phase 6: Ableton Stock Audio Effects (EQ Eight & Compressor)
    'Loading Ableton EQ Eight on kick: carving out 300 Hz "mud tub" and boosting 60 Hz chest thump…',
    'Engaging 12 dB/oct High-Pass filter band on vocals, guitars, and drum overheads…',
    'Inserting Ableton Compressor on snare: dialing Peak mode with 25 ms attack for explosive crack…',
    'Loading Ableton Glue Compressor on Drum Group: dialing 2:1 ratio for authentic analog console glue…',
    'Setting gentle vocal compression: needle moving 3-4 dB on passionate vocal crescendos…',
    'Tuning compressor release to track tempo so the audio pump breathes with the musical groove…',

    // Phase 7: Return Tracks, Hybrid Reverb & Roar
    'Routing Aux Sends to Return Track A (Ableton Hybrid Reverb): blending convolution and algorithmic space…',
    'Dialing 20 ms predelay on drum room reverb so the initial snare transient slaps you in the face first…',
    'Routing to Return Track B (Ableton Echo) for tempo-synced ping-pong spatial width…',
    'Inserting Ableton Utility device: toggling "Bass Mono" at 120 Hz so club subwoofers don’t catch fire…',

    // Phase 8: Specialist Devices & 3rd-Party Alternatives
    'Engaging Ableton Live 12 Roar saturation: adding 10% multi-stage analog warmth without melting the speaker…',
    'Inserting Ableton Multiband Dynamics in split-band mode to de-ess sharp vocal sibilance…',
    'Linking industry 3rd-party alternatives: FabFilter Pro-Q 3, Pro-C 2, and Soundtoys Decapitator…',
    'Referencing UAD 1176 and Waves CLA-76 compressor models with validated clickable links…',

    // Phase 9: Examiner Warnings & Track Sheet Assembly
    'Flagging Examiner Traps: phase cancellation between multiple drum mics and nasty warp artifacts…',
    'Warning against digital preamp clipping: "You cannot EQ distortion out of a clipped vocal take"…',
    'Compiling Master Track Sheet: interface input mapping, panning laws, and stem balance…',
    'Setting channel pan knobs and initial fader balance across the stereo field…',

    // Phase 10: Master Channel & Final化
    'Checking Master channel headroom (-12 to -14 dBFS peak before the limiter)…',
    'Inserting Ableton Limiter with True Peak ceiling pinned securely to -1.0 dBFS…',
    'Verifying integrated loudness adheres to the official -14 to -16 LUFS target…',
    'Formatting technical mixdown tables and channel strip logs…',
    'Finalizing official Ableton Live Component 1 Completed Logbook… certified examiner-ready!'
  ],

  'Cubase': [
    // Phase 1: Project Setup & Cubase Architecture
    'Initializing Steinberg Cubase Component 1 Project and marveling at the sheer number of submenus…',
    'Setting Project Setup to 44.1 kHz / 24-bit Broadcast Wave (and making sure the eLicenser is behaving)…',
    'Pressing F4 to open Audio Connections: configuring interface input buses without getting tangled…',
    'Organizing session into Folder Tracks and Group Channels with coordinated German engineering precision…',

    // Phase 2: Pathway 1 - Acoustic Drum Kit Tracking
    'Engineering Pathway 1: Acoustic drum kit multi-mic routing across the Cubase MixConsole…',
    'Positioning dynamic kick mic inside port hole pointed at beater impact for maximum punch…',
    'Setting snare top mic 1 inch above the rim pointing inward with the null aimed at the hi-hat…',
    'Setting up Overhead matched SDC pair: measuring distances carefully so the snare image sits dead center…',
    'Hitting the Phase Invert button in the MixConsole Pre-Rack: low-end instantly punchier, phase victory!…',
    'Specifying standard school studio mics (AKG D112, Shure SM57, SDCs) from the department equipment locker…',

    // Phase 3: Pathway 2 - DI Box & Electric Instruments
    'Engineering Pathway 2: Electric bass Direct Injection (DI) tracking via active DI box…',
    'Flipping DI ground lift switch: silencing 50 Hz electrical ground loops like an audio ninja…',
    'Calibrating Steinberg interface preamps: keeping peaks at -14 dBFS with plenty of headroom for slap bass…',
    'Miking electric guitar amplifier with dynamic mic 45° off-axis to tame fizzy high frequencies…',

    // Phase 4: Vocals & Acoustic Instruments
    'Setting up Lead Vocal track with studio Large Diaphragm Condenser and shockmount suspension…',
    'Fastening pop shield and positioning reflection filter to control classroom acoustics…',
    'Reminding vocalist to stay 6 inches back: zero proximity mud, maximum vocal expression…',
    'Positioning small diaphragm condenser at acoustic guitar 12th fret: sparkling chime, zero boom…',

    // Phase 5: Pathway 3 - Instrument Tracks & MIDI (HALion)
    'Engineering Pathway 3: Cubase Instrument Tracks loaded with HALion Sonic and Groove Agent…',
    'Sequencing backing instruments with MIDI clips and applying subtle groove quantization…',
    'Using Cubase Logical Editor to humanize note timing and velocity so it sounds played by a human…',
    'Mapping Cubase Quick Controls to filter cutoff and CC11 expression for expressive performance…',

    // Phase 6: Cubase MixConsole Channel Strip Processing
    'Opening Cubase MixConsole Channel Strip StudioEQ on kick: scooping 300 Hz cardboard box mud…',
    'Engaging Pre-Rack Low Cut filter at 80 Hz on snare, guitars, and vocals to clean infrasonic garbage…',
    'Inserting Cubase Vintage Compressor on snare: dialing 30 ms attack for that punchy crack…',
    'Applying Cubase Tube Compressor for warm optical-style vocal leveling with smooth gain reduction…',
    'Tuning compressor release to track tempo so the gain reduction meter breathes in time with the song…',

    // Phase 7: FX Channels & REVerence Convolution
    'Creating dedicated FX Channel Track with Steinberg REVerence convolution reverb…',
    'Loading vintage studio plate impulse response for depth without drowning the mix in mud…',
    'Setting up Cubase RoomWorks algorithmic reverb with 25 ms predelay for vocal dimension…',
    'Inserting Cubase MonoDelay with dotted 8th note tempo sync for rhythmic spatial bounce…',

    // Phase 8: Specialist Plugins & 3rd-Party Alternatives
    'Inserting Cubase DeEsser: sweeping detection to tame 6.5 kHz sibilance without lisping…',
    'Cross-referencing FabFilter Pro-Q 3, Pro-C 2, and Waves SSL 4000 Collection hyperlinks…',
    'Referencing UAD LA-2A and Soothe2: validating every single 3rd-party markdown link…',

    // Phase 9: Examiner Warnings & Track Sheet Assembly
    'Detailing Examiner Traps: avoiding comb filtering in multi-mic drum setups (examiners love catching this)…',
    'Warning against digital preamp clipping: "Digital clipping is not saturation, it is digital regret"…',
    'Compiling Master Track Sheet: hardware inputs, track names, panning laws, and fader balance…',
    'Balancing MixConsole faders and stereo panning positions for a cohesive 3D soundstage…',

    // Phase 10: Stereo Out & Finalization
    'Monitoring Stereo Out mix bus headroom (-12 to -14 dBFS Peak before limiting)…',
    'Engaging Cubase Brickwall Limiter with true peak threshold locked securely at -1.0 dBFS…',
    'Verifying integrated dynamic range adheres strictly to -14 to -16 LUFS target…',
    'Formatting technical mixdown tables and channel strip logs…',
    'Finalizing official Steinberg Cubase Component 1 Completed Logbook… Wunderbar!'
  ],

  'Bitwig': [
    // Phase 1: Project Setup & Bitwig Studio Architecture
    'Launching Bitwig Studio and feeling superior about our cutting-edge modular audio engine…',
    'Configuring Bitwig Audio Engine preferences: 44.1 kHz / 24-bit with razor-sharp latency…',
    'Setting up Audio Tracks and Track Groups in the Bitwig Arranger with color-coded elegance…',
    'Configuring audio interface multi-channel input routing without opening a single confusing menu…',

    // Phase 2: Pathway 1 - Acoustic Drum Kit Tracking
    'Engineering Pathway 1: Drum kit multi-track audio routing across Bitwig audio channels…',
    'Positioning dynamic kick mic inside port hole pointed at beater: maximum thud, zero shoe squeak…',
    'Setting snare top dynamic mic with cardioid null aimed directly at the noisy hi-hat cymbal…',
    'Rigging matched stereo pair of small diaphragm condensers for overheads with the 3:1 rule…',
    'Checking overhead phase coherency using Bitwig Tool device phase invert: instant bass thud unlocked…',
    'Specifying standard school studio mics (AKG D112, Shure SM57, SDCs) from the department locker…',

    // Phase 3: Pathway 2 - DI Box & Electric Instruments
    'Engineering Pathway 2: Direct Injection recording for bass guitar via active DI box…',
    'Flipping DI ground lift switch to banish 50 Hz electrical hum back to the void…',
    'Setting interface preamp gain levels to hover around -18 dBFS RMS (safe headroom is happy headroom)…',
    'Miking electric guitar cabinet with dynamic mic aimed 2 inches off-center from the cone…',

    // Phase 4: Vocals & Acoustic Instruments
    'Configuring Lead Vocal audio track with Large Diaphragm Condenser and dual-mesh pop shield…',
    'Fastening studio reflection filter to keep the practice room acoustic reflections out of the track…',
    'Mitigating proximity bass boost through proper vocalist positioning: 6 inches back, perfect tone…',
    'Setting up small diaphragm condenser aimed at acoustic guitar 12th fret: sparkling highs, no mud…',

    // Phase 5: Pathway 3 - Instrument Tracks & Polymer/Sampler
    'Engineering Pathway 3: Bitwig Instrument Tracks using Polymer, Sampler, and virtual instruments…',
    'Sequencing backing instruments with Bitwig MIDI clips and applying humanized groove timing…',
    'Humanizing MIDI velocity dynamics so the performance breathes with authentic human emotion…',
    'Mapping Bitwig Modulators (Macro, LFO, Vibrato) because a fader without modulation is a lonely fader…',

    // Phase 6: Bitwig Stock Audio Devices (EQ+ & Compressor)
    'Loading Bitwig EQ+ on kick: grabbing the spectrum graph to scoop out 300 Hz cardboard mud…',
    'Enabling High-Pass filter band on vocals, guitars, and drum overheads to clean sub rumble…',
    'Inserting Bitwig Compressor on snare: dialing slow attack (30 ms) so the stick crack punches through…',
    'Applying Bitwig Dynamics device for two-stage upward and downward dynamic control…',
    'Adjusting vocal compressor attack and release to mirror singer phrasing without choking the words…',
    'Balancing gain reduction meters to 3-4 dB on energetic peaks: controlled, punchy, musical…',

    // Phase 7: Effect Tracks, Reverb & Delay+
    'Creating dedicated Effect Tracks for spatial time-based processing with zero track clutter…',
    'Inserting Bitwig Reverb device: dialing Medium Hall with 25 ms predelay for vocal dimension…',
    'Loading Bitwig Delay+ device with ping-pong crossfeed and tempo synchronization…',
    'Inserting Bitwig Tool device to collapse low-end frequencies below 100 Hz to pure mono…',

    // Phase 8: Specialist Devices & 3rd-Party Alternatives
    'Configuring Bitwig Dynamics in split-band mode for surgical high-frequency de-essing…',
    'Linking 3rd-party industry equivalents: FabFilter Pro-Q 3, Pro-C 2, and Soundtoys Decapitator…',
    'Referencing UAD 1176LN and Waves CLA-76 compressor models with validated clickable hyperlinks…',

    // Phase 9: Examiner Warnings & Track Sheet Assembly
    'Flagging Examiner Traps: phase cancellation between multiple drum mics (examiners love catching this)…',
    'Preventing digital interface clipping: "Clipped audio in coursework makes moderators weep"…',
    'Compiling Master Track Sheet: hardware input mapping, pan positions, and fader balance…',
    'Setting channel pan positions and initial stem balance for a broad, immersive stereo image…',

    // Phase 10: Master Track & Final Verification
    'Checking Master Track headroom: sitting comfortably at -12 to -14 dBFS Peak before limiting…',
    'Inserting Bitwig Peak Limiter with ceiling pinned securely to -1.0 dBFS True Peak…',
    'Verifying integrated loudness adheres strictly to the official -14 to -16 LUFS target…',
    'Formatting technical mixdown tables and channel strip logs…',
    'Finalizing official Bitwig Studio Component 1 Completed Logbook… modular perfection achieved!'
  ]
};
