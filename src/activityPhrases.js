// Chronologically ordered activity phrases for Tracksheet search and DAW-specific Component 1 generation
// 200 cultural, funny, accurate, studio-based phrases for generation monitor
export const TRACKSHEET_ACTIVITY_PHRASES = [
  // 1. Archival Ingest, Tape Vault Forensics & Splicing
  'Blowing 40 years of mysterious magnetic dust off the 2-inch master tape boxes…',
  'Deciphering engineer grease-pencil notes: coffee ring or assistant engineer tears from 1974?…',
  'Baking sticky-shed Ampex 456 tape reels in a food dehydrator at 130°F and praying…',
  'Aligning Studer A800 tape heads with an oscilloscope, a jeweller’s screwdriver, and sheer optimism…',
  'Checking tape speed calibration: 15 ips, 30 ips, or whatever speed the capstan motor felt like running before lunch…',
  'Auditing Dolby A noise reduction logs and praying nobody forgot to press the decode button…',
  'Hunting down the razor blade and splicing block after the downbeat edit fell into the control room carpet…',
  'Demagnetizing the tape heads while secretly terrified of wiping the entire multi-track reel…',
  'Running tape azimuth calibration tones that have all the neighbourhood dogs howling in unison…',
  'Inspecting 24-track 2-inch tape and hoping it hasn’t chemically bonded into strawberry marmalade…',
  'Varispeeding the tape machine up 2% because the band drank too much lager the night before…',
  'Flipping the 2-inch reel upside down to print reverse plate reverb on the lead guitar solo…',
  'Finding a 1978 studio logbook note: \'Track 17 is blank because Keith kicked the mic stand over\'…',
  'Listening for tape print-through on the acoustic intro and pretending it’s a deliberate artistic ghost echo…',
  'Calibrating tape bias until the 10 kHz test tone gives the head engineer a ringing headache…',
  'Rescuing a tangled reel of magnetic tape with a pencil, two cotton gloves, and deep breathing exercises…',
  'Bouncing 16 vocal harmony tracks down to 2 tracks because we ran out of physical tape reels…',
  'Checking the master tape leader: red tape for heads out, blue tape for tails out, masking tape for panic…',
  'Cleaning pinch rollers with isopropyl alcohol until the Q-tip comes out pitch black…',
  'Praying the tape machine capstan belt doesn’t disintegrate during the final chorus fadeout…',

  // 2. Legendary Studios, Acoustic Rooms & Architectural Oddities
  'Tracking down the tracking room: Abbey Road Studio Two, Sound City, or a damp basement in Soho…',
  'Recreating the Motown Hitsville \'Snakepit\' vibe: 8 musicians jammed into a room the size of a broom closet…',
  'Running a 100-foot XLR cable into the studio tiled bathroom for that authentic 1970s natural echo…',
  'Checking the acoustics at Olympic Studios: where the Glyn Johns drum sound was born and tea was mandatory…',
  'Channeling Sunset Sound Studio 1: where Van Halen parked their Marshall stacks in the echo chamber…',
  'Inspecting the Trident A-Range console and ignoring the slight burning smell from Channel 14…',
  'Investigating the live room floorboards at Muscle Shoals Sound Studio for swamp-funk resonance…',
  'Tracking at Hansa by the Wall: opening the big hall doors so David Bowie’s vocal hits the back wall…',
  'Blowing sage around Electric Lady Studios to appease the ghost of Jimi Hendrix’s fuzz pedal…',
  'Searching for the acoustic sweet spot in a live room designed entirely with non-parallel cedar walls…',
  'Checking the isolation booth glass to see if the drummer is still making face gestures at the producer…',
  'Hunting down a 50 Hz mains hum caused by the studio mini-fridge kicking its compressor on…',
  'Setting up room mics on the studio staircase and begging the receptionist not to walk down during take 4…',
  'Wiping 30 years of spilled Earl Grey and tobacco ash off the vintage Neve console leather armrest…',
  'Testing the studio echo chamber: shouting \'TESTING\' into an empty concrete bunker in the basement…',
  'Checking the air conditioning rumble before the sub-bass mic picks up the building’s ventilation system…',
  'Reconstructing the session timeline before the record label’s £50,000 recording budget evaporated…',
  'Cross-referencing the patchbay with 250 tangled bantam patch cables resembling boiled spaghetti…',
  'Discovering the legendary \'room sound\' was actually just a broken window rattling in the breeze…',
  'Chasing farm animals away from the live room door at Rockfield Studios during vocal tracking…',

  // 3. Microphones, Transducers & Placement Shenanigans
  'Inspecting the vintage Neumann U47: handle with velvet gloves, whispered reverence, and insurance forms…',
  'Rigging an AKG D112 inside the kick drum: affectionately known as \'the golden studio egg\'…',
  'Angling the Shure SM57 45 degrees across the snare rim: the most reliable 4-inch distance in human history…',
  'Duct-taping two SM57s together Fred Kevorkian style because one microphone simply isn\'t enough mid-range…',
  'Placing a Coles 4038 ribbon mic as overhead and praying the boom arm clutch doesn\'t give up on life…',
  'Accidentally feeding 48V phantom power into an irreplaceable vintage ribbon mic and seeing your soul flash…',
  'Herding 6 backing vocalists around a single omnidirectional condenser without anyone elbowing the capsule…',
  'Taping a PZM boundary microphone to the control room floorboards for ambient foot-tapping warmth…',
  'Positioning a Shure SM7B two inches from the screamer’s mouth with the heavy-duty foam windscreen…',
  'Aiming a small diaphragm condenser at the acoustic guitar 12th fret to avoid bottom-end boominess…',
  'Positioning brass players 4 feet back from the ribbon mic so they don’t blast the corrugated ribbon into orbit…',
  'Reminding the singer that the pop filter is a protective barrier, not an edible candy lollipop…',
  'Miking the snare bottom with an inverted phase mic to catch the snappy rattle of the snare wires…',
  'Balancing a heavy Neumann U67 on a counterweighted boom stand while eyeing the floor suspiciously…',
  'Rigging an XY stereo pair with a ruler and protractor to avoid phase cancellation nightmares…',
  'Stuffing an Electro-Voice RE20 down the bell of a baritone saxophone and hoping for the best…',
  'Ransacking the mic locker for 4 microphone clips that aren’t held together by electrical tape and hope…',
  'Putting a dynamic mic on the hi-hat only to immediately mute it in the mix forever…',
  'Finding the cardioid null point to reject the drummer\'s squeaky kick pedal bearing…',
  'Taping a boundary mic inside an acoustic piano lid with gaffer tape that was manufactured in 1983…',

  // 4. Consoles, Preamps & Outboard Hardware
  'Driving discrete Neve 1073 preamps into the sweet spot where transformer iron turns into pure rock \'n\' roll…',
  'Engaging the SSL G-Master Bus compressor: watching the needle dance 2 to 4 dB in time with the groove…',
  'Setting the UREI 1176 to \'All Buttons In\' mode: absolute British brickwall drum destruction unlocked…',
  'Dialing the Pultec EQP-1A trick: simultaneously boosting and cutting 60 Hz to defy the laws of physics…',
  'Waiting 45 minutes for the Teletronix LA-2A electro-optical tube cell to warm up and find its inner peace…',
  'Warming up the Fairchild 670: 20 vacuum tubes heating the control room better than central heating…',
  'Firing up the EMT 140 plate reverb: 600 pounds of steel sheet suspended in an iron frame in the basement…',
  'Tapping the AKG BX20 spring reverb tank by accident and making the control room sound like an earthquake…',
  'Sweeping the API 550A parametric EQ: adding 4 dB of 5 kHz punch that can cut through concrete…',
  'Wiggling patch cord #47 in the TT bantam bay until the left channel audio magically reappears…',
  'Setting hardware de-esser threshold: taming harsh vocal sibilance without turning the singer into Daffy Duck…',
  'Checking discrete console summing bus headroom before the red overload LEDs permanently burn into retinas…',
  'Calibrating an Eventide H910 Harmonizer: pitch-shifting by -9 cents and +9 cents for that 1980s vocal gloss…',
  'Bypassing the outboard compressor to see if the producer can actually hear the difference (spoiler: they can\'t)…',
  'Pushing an SSL channel VCA fader past +6 dB and blaming the distortion on \'vintage harmonic character\'…',
  'Engaging the -20 dB pad on the audio interface because the snare drum transient is terrifying the converters…',
  'Checking the console talkback circuit: discovering the studio live room heard every word of your critique…',
  'Adjusting compressor attack time: fast enough to clamp the transient, slow enough to let the stick snap hit…',
  'Tuning the compressor release time to the song tempo so the gain reduction meter breathes in 4/4 time…',
  'Connecting a DBX 160X compressor to the bass guitar for that instantaneous, merciless VCA snap…',

  // 5. The Drummer & Drum Tracking Realities
  'Politely asking the drummer to stop playing paradiddles while the engineer is gain-staging the kick mic…',
  'Stuffing a vintage sofa cushion and a hotel pillow inside the 22-inch bass drum shell…',
  'Taping a thick leather wallet and two feminine hygiene pads to the snare head for peak 1975 dead thud…',
  'Managing hi-hat spill before the cymbal bleed contaminates every microphone in the northern hemisphere…',
  'Tightening a loose bass drum spur before the kick drum slowly marches across the studio floor…',
  'Tuning the rack toms with a drum key, a tuning gauge, and three Hail Marys…',
  'Discovering the squeak in the drum take wasn\'t the snare, but the drummer’s 30-year-old DW 5000 pedal hinge…',
  'Setting up the 3:1 distance rule for drum overheads so the ride cymbal doesn’t sound like falling cutlery…',
  'Flipping the snare bottom channel phase: discovering half the drum\'s low-end body was missing in action…',
  'Asking the drummer if they can play the verse slightly softer, knowing they will play it exactly 15% louder…',
  'Replacing the battered snare batter head that looks like it survived the Battle of the Somme…',
  'Placing a sub-kick woofer mic in front of the bass drum for that 40 Hz subterranean chest rumble…',
  'Gaffer-taping drumsticks together because the drummer broke their fourth pair during take 2…',
  'Auditioning 7 different snare drums only to go back to the trusty Ludwig 1968 Supraphonic 400…',
  'Muting the drummer’s headphones because the click track is bleeding into the vocal condenser 20 feet away…',
  'Setting up a trash mic in the middle of the room crushed through an 1176 for instant John Bonham energy…',
  'Realizing the drummer plays the hi-hat at 120 dB and the snare at 40 dB: initiating engineering prayer mode…',
  'Checking the kick drum beater: swapping hard plastic for soft felt to save the microphone\'s capsule…',
  'Begging the drummer not to hit the 18-inch China cymbal on the quiet acoustic breakdown…',
  'Labeling the multitrack: Kick In, Kick Out, Sub Kick, Snare Top, Snare Btm, Hi-Hat, Tom 1, Tom 2, Floor, OH L, OH R, Room L, Room R…',

  // 6. Guitars, Bass, Amps & The Headroom Wars
  'Plugging the bass guitar into an active BSS AR-133 DI box and praying the battery isn\'t dead…',
  'Flipping the DI ground lift switch: instantly banishing the demonic 50 Hz electrical hum back to hell…',
  'Asking the bassist when they last changed their flatwound strings: \'Sometime during the Carter administration\'…',
  'Miking an Ampeg SVT 8x10 fridge cabinet that is currently vibrating the engineer\'s coffee cup off the console…',
  'Politely asking the guitarist why they brought two 100-watt Marshall full stacks to record a folk intro…',
  'Forcing the guitarist to tune their G-string with an actual electronic strobe tuner instead of \'by ear\'…',
  'Aiming the dynamic mic 2 inches off-axis from the speaker dust cap to skip the ice-pick treble beam…',
  'Hunting down an elusive buzz across a 15-pedal pedalboard powered by 6 daisy-chained wall warts…',
  'Isolating the guitar amp inside the studio vocal booth with two sleeping bags draped over the cabinet…',
  'Tracking acoustic guitar: asking the player to remove their belt buckle, wristwatch, and noisy jacket…',
  'Auditing guitar double-tracking: checking if the left and right takes are tight or a chaotic Flamenco duel…',
  'Dialing the guitar amp volume knob to 11 while the assistant engineer dons military-grade ear defenders…',
  'Setting up a clean DI guitar track for re-amping later when everyone admits the amp tone was terrible…',
  'Slapping an optical compressor on the bass track to tame the bassist’s aggressive slap-thumb outbursts…',
  'Tuning the electric guitar before every single take because the vintage vibrato bridge refuses to stay in pitch…',
  'Miking a 1965 Fender Twin Reverb: pristine clean sparkle, ear-splitting volume, back-breaking weight…',
  'Replacing the battery in an active EMG pickup after noticing the guitar solo sounded like a dying kazoo…',
  'Blending the clean bass DI low end with a saturated SansAmp VT bass drive track for crunch and authority…',
  'Checking guitar phase when blending two cabinet microphones: moving mic #2 by a quarter of an inch…',
  'Reminding the lead guitarist that the song does not actually require a 3-minute tapping solo in the bridge…',

  // 7. Vocals, Cans, Room Psychology & The Sweet Spot
  'Adjusting the headphone mix: \'Can I have more me, less snare, no bass, and reverb that sounds like God?\'…',
  'Reminding the singer to stand 6 inches back so proximity effect doesn\'t turn them into an earthquake…',
  'Brewing a cauldron of boiling water, lemon slices, and organic Manuka honey for the anxious lead vocalist…',
  'Engaging the reflection filter around the vocal mic to combat the acoustic reflections of a bedroom ceiling…',
  'Coaxing the vocalist into the booth by dimming the control room lights and lighting a scented candle…',
  'Checking the headphone cue amp: saving the singer’s eardrums from an accidental blast of 1 kHz test tone…',
  'Comping 47 vocal takes to assemble one immaculate performance where every syllable is in tune and on time…',
  'Fixing the vocalist\'s headphone leak before the high-pitched click track bleeds into the delicate acapella outro…',
  'Telling the singer \'That take was fantastic, let\'s just do one more for safety\' (Take #28)…',
  'Sweeping the vocal EQ notch filter: hunting down the 3.2 kHz nasal frequency that sounds like an angry bee…',
  'Applying gentle optical leveling: shaving 3 dB off the peaks so the vocal sits right in front of the listener…',
  'Setting up a stereo delay throw on the last word of the chorus: \'night… night… night…\'…',
  'Calibrating the talkback microphone so you don’t deafen the talent when you say \'Great job, darling\'…',
  'Aligning backing vocal doubles with manual audio edits so the \'S\' and \'T\' consonants don\'t sound like spray cans…',
  'Reminding the singer that singing louder does not mean moving 3 feet closer to the microphone grille…',
  'Placing a vintage ribbon mic on the lead vocal for that smoky, velvety 1950s jazz club intimacy…',
  'Inserting a high-pass filter at 90 Hz on the vocal channel to eliminate footsteps and distant tube train rumble…',
  'Dialing 25 ms of predelay on the vocal plate reverb so the singer’s dry words remain crystal clear…',
  'Telling the vocalist the autotune plugin crashed so they will actually concentrate on hitting the high note…',
  'Catching the singer yawning directly into the £5,000 vintage valve condenser capsule on track 1…',

  // 8. Synths, Keys, Strings & Auxiliary Alchemy
  'Warming up vintage analog synthesizers: waiting 30 minutes for the VCO oscillators to stop drifting out of tune…',
  'Miking an acoustic grand piano with an ORTF stereo condenser pair tucked right over the soundboard hammers…',
  'Miking a vintage Leslie rotary speaker cabinet: two mics on the spinning top horn, one on the low-end drum…',
  'Praying the drive belt on the Hammond B3 organ\'s Leslie speaker doesn\'t snap in the middle of the crescendo…',
  'Connecting MIDI cables between 5 vintage synths and diagnosing why Channel 1 is triggering the drum machine…',
  'Humanizing quantized MIDI velocity curves so the piano ballad doesn\'t sound like a robotic typewriter…',
  'Tuning the Minimoog oscillator bank: 3 oscillators slightly detuned for that monstrous, wall-shaking bass growl…',
  'Miking a string quartet while politely asking the cellist not to squeak their antique wooden chair…',
  'Dampening the acoustic grand piano damper pedal squeak with a can of WD-40 and a clean rag…',
  'Tracking a vintage Mellotron: hoping the physical tape strips inside the keyboard don\'t jam or tear…',
  'Summoning an army of shaker and tambourine overdubs to glue the rhythm section together…',
  'Drawing CC11 Expression automation curves with a mouse until your index finger cramps completely…',
  'Positioning a stereo pair of boundary mics inside an upright piano for that rustic, intimate indie record sound…',
  'Calibrating analog tape flanging: pressing your thumb directly onto the tape reel flange during playback…',
  'Filtering synth sub-bass below 30 Hz so the club sound system doesn\'t launch its subwoofers across the dancefloor…',
  'Tracking a brass section: checking that the trumpet players haven\'t emptied their spit valves onto the floor cables…',
  'Blending a real upright bass acoustic mic with its bridge piezo pickup for punch and organic woody tone…',
  'Sequencing an analog arpeggiator synced to an analog clock pulse from an 808 rimshot trigger out…',
  'Injecting subtle tape wow and flutter into the electric piano pad for that nostalgic, woozy vintage warmth…',
  'Begging the percussionist not to bring their entire trunk of 50 different Latin percussion instruments into the booth…',

  // 9. Producers, A&R, Control Room Lore & Studio Legends
  'Drawing a Brian Eno Oblique Strategies card: \'Honor thy error as a hidden intention\'…',
  'Channeling Rick Rubin: lying motionless on the control room sofa for 3 hours before saying \'Make it more soulful\'…',
  'Pushing the famous \'dummy fader\' on the console to appease the record label executive\'s ego without changing anything…',
  'The A&R executive walks in at 11:30 PM, eats all the catering grapes, and asks \'Where is the radio single?\'…',
  'Steely Dan mode engaged: auditioning 6 different world-class session drummers for the exact same 16-bar groove…',
  'Phil Spector Wall of Sound simulation: jamming 5 acoustic guitars and 3 pianos playing the exact same chord…',
  'Running the sacred British studio tea rota: strict milk-first versus tea-first protocol currently being debated…',
  'The tape op / runner dispatched on an emergency 3:30 AM mission for gaffer tape, energy drinks, and pizza…',
  'The assistant engineer nodding along intently to the mix while secretly fighting off absolute sleep exhaustion…',
  'Whispering the ancient recording studio prayer: \'We\'ll fix it in the mix\' at 4:15 AM…',
  'Overcoming Red Light Fever: musician plays flawlessly for an hour, but chokes the millisecond RECORD is armed…',
  'Deciphering producer mix notes: \'Can you make the chorus feel more purple, wider, and slightly less Wednesday?\'…',
  'Checking the session budget ledger: £4,000 spent on studio time, £6,000 spent on catering and fancy coffee beans…',
  'The band manager opens the door during the quietest acoustic take to ask where the studio WiFi password is…',
  'Debating whether to keep the tape machine count-in and studio banter at the start of the song for indie credibility…',
  'Consulting the studio acoustic designer\'s original 1972 blueprints to figure out why 120 Hz is ringing like a bell…',
  'Reminding the band that the studio lounge pool table is not an auxiliary percussion instrument…',
  'Banning the drummer\'s friend from sitting on the control room couch with their feet on the patchbay cables…',
  'The producer requests \'more vibe\' in the chorus: subtly nudging the stereo bus fader up by 0.3 dB…',
  'Discovering that the uncredited session guitarist on track 4 went on to become an international rock icon…',

  // 10. Mixing, Mastering, The Red Light & Final Delivery
  'Auratone 5C Sound Cubes engaged: if the mix sounds glorious on these 5-inch mono boxes, it sounds glorious anywhere…',
  'Yamaha NS-10M tweeters ready: two squares of tissue paper taped over the drivers to save our eardrums…',
  'Hitting the console mono switch: praying the chorus wide stereo guitars don\'t phase-cancel into thin air…',
  'Carrying the test rough mix out to the assistant engineer’s beat-up 1998 hatchback for the sacred car stereo test…',
  'Monitoring VU meter needles: pinned into the red, exactly as legendary 1970s rock engineers intended…',
  'Checking mix bus headroom: peak signal sitting cleanly at -12 dBFS before the final analog master chain…',
  'Sweeping the mix bus high-pass filter to 30 Hz: dumping subsonic speaker-rumble into the digital wastebasket…',
  'Engaging brickwall limiter with true peak ceiling locked to -1.0 dBFS: protecting streaming listeners everywhere…',
  'Checking integrated loudness: hitting the -14 LUFS target on the nose without crushing the life out of the snare…',
  'De-essing the stereo master mix so the hi-hat and vocal consonants don\'t slice listeners\' ears in headphones…',
  'Inspecting vinyl lacquer cutting notes: \'Keep sub-bass strictly mono below 100 Hz so the cutting stylus doesn\'t jump\'…',
  'AB\'ing our drum sound against Steely Dan’s \'Aja\' and experiencing an immediate mild existential crisis…',
  'Realizing after 14 hours of continuous mixing that the snare drum has been 4 dB too loud since lunchtime…',
  'Saving the session file as: Mix_Final_v3_master_REAL_FINAL_useThisOne_v4_FINAL_OK.ptx…',
  'Pressing Command+S (Save) five times in rapid succession out of pure digital audio workstation muscle memory…',
  'Listening on £15 Apple earbuds: confirming the bassline cuts through even on terrible plastic headphones…',
  'Exporting 24-bit / 96 kHz uncompressed master stems for archival immortality in the record label vaults…',
  'Printing the analog 1/2-inch stereo tape master at 30 ips with high-output tape formulation…',
  'Synthesizing decades of archival forensics, signal chains, and musicological lore into an airtight dossier…',
  'Session wrapped, faders zeroed, tape heads demagnetized, and master tracksheet signed off before the sun comes up!',
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
