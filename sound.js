'use strict';

const AchooSound = (() => {
  const preferenceKey = 'achoo-audio-v1';
  const Audio = window.AudioContext || window.webkitAudioContext;
  const preferences = {music:false, effects:true};
  const catClips = {
    meow: {path:'audio/meow.wav',volume:.55},
    purr: {path:'audio/purr.wav',volume:.45}
  };
  const catPlayers = {};
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey));
    if (typeof saved?.music === 'boolean') preferences.music = saved.music;
    if (typeof saved?.effects === 'boolean') preferences.effects = saved.effects;
  } catch {}

  // An original eight-bar loop. Each pair is a MIDI note and duration in beats.
  const melody = [
    [[72,.5],[76,.5],[79,.75],[76,.25],[74,.5],[72,1],[null,.5]],
    [[74,.5],[77,.5],[81,1],[79,.5],[77,.5],[76,.75],[null,.25]],
    [[72,.5],[76,.5],[79,.5],[84,.75],[83,.25],[79,1],[null,.5]],
    [[81,.5],[79,.5],[77,1],[74,.5],[76,.5],[74,.75],[null,.25]],
    [[76,.5],[79,.5],[84,1],[81,.5],[79,.75],[76,.5],[null,.25]],
    [[77,.5],[81,.5],[86,.75],[84,.25],[81,.5],[79,1],[null,.5]],
    [[84,.5],[83,.5],[81,.5],[79,.5],[76,.75],[74,.75],[null,.5]],
    [[77,.5],[76,.5],[74,1],[72,1.5],[null,.5]]
  ];
  const chords = [[48,55],[53,60],[48,55],[55,62],[57,64],[53,60],[55,62],[48,55]];
  const effects = {
    tap: [[76,0,.06]],
    adopt: [[72,0,.12],[76,.09,.13],[79,.18,.15],[84,.28,.25]],
    Feed: [[60,0,.10],[64,.10,.10],[67,.20,.14]],
    Play: [[72,0,.09],[79,.08,.11],[74,.18,.09],[84,.26,.18]],
    Care: [[69,0,.12],[76,.12,.14],[81,.24,.19]]
  };
  const beat = 60 / 105;
  const events = [];
  melody.forEach((bar, index) => {
    let position = index * 4;
    for (const [note, length] of bar) {
      if (note !== null) events.push({note, position, length, volume:.036, type:'square'});
      position += length;
    }
    for (let step = 0; step < 4; step++) {
      events.push({note:chords[index][step % 2], position:index * 4 + step, length:.76, volume:.036, type:'triangle'});
    }
  });
  events.sort((left,right) => left.position - right.position);

  let context, musicGain, effectsGain, timer, start, index, musicButton, effectsButton;

  function save() {
    try { localStorage.setItem(preferenceKey, JSON.stringify(preferences)); } catch {}
  }

  function controls() {
    musicButton.textContent = 'Music ' + (preferences.music ? 'on' : 'off');
    effectsButton.textContent = 'SFX ' + (preferences.effects ? 'on' : 'off');
    musicButton.setAttribute('aria-pressed', preferences.music);
    effectsButton.setAttribute('aria-pressed', preferences.effects);
  }

  function unlock() {
    if (!Audio) return Promise.resolve(false);
    try {
      if (!context) {
        context = new Audio();
        musicGain = context.createGain();
        effectsGain = context.createGain();
        musicGain.gain.value = 0;
        effectsGain.gain.value = preferences.effects ? 1 : 0;
        musicGain.connect(context.destination);
        effectsGain.connect(context.destination);
      }
      return context.state === 'running'
        ? Promise.resolve(true)
        : context.resume().then(() => context.state === 'running').catch(() => false);
    } catch {
      return Promise.resolve(false);
    }
  }

  function tone(destination, note, when, length, volume, type) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12);
    oscillator.type = type;
    envelope.gain.setValueAtTime(0, when);
    envelope.gain.linearRampToValueAtTime(volume, when + .014);
    envelope.gain.exponentialRampToValueAtTime(.0001, when + length);
    oscillator.connect(envelope);
    envelope.connect(destination);
    oscillator.start(when);
    oscillator.stop(when + length + .02);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }

  function schedule() {
    while (start + events[index].position * beat < context.currentTime + .16) {
      const {note, position, length, volume, type} = events[index];
      const when = start + position * beat;
      if (when >= context.currentTime) tone(musicGain, note, when, length * beat * .9, volume, type);
      index++;
      if (index === events.length) {
        index = 0;
        start += 32 * beat;
      }
    }
  }

  function startMusic() {
    if (!context || context.state !== 'running' || timer || !preferences.music || document.hidden) return;
    index = 0;
    start = context.currentTime + .045;
    musicGain.gain.setTargetAtTime(.85, context.currentTime, .025);
    schedule();
    timer = window.setInterval(schedule, 85);
  }

  function stopMusic() {
    if (timer) window.clearInterval(timer);
    timer = undefined;
    if (context) musicGain.gain.setTargetAtTime(0, context.currentTime, .018);
  }

  function play(name) {
    if (!preferences.effects && !preferences.music) return;
    unlock().then(ready => {
      if (!ready) return;
      startMusic();
      if (!preferences.effects || !effects[name]) return;
      const when = context.currentTime + .018;
      for (const [note, offset, length] of effects[name]) tone(effectsGain,note,when + offset,length,.065,'square');
    });
  }

  function playCat(name) {
    if (!preferences.effects || !catClips[name]) return;
    const {path,volume} = catClips[name];
    const player = catPlayers[name] || (catPlayers[name] = new window.Audio(path));
    player.pause();
    player.currentTime = 0;
    player.volume = volume;
    player.play().catch(() => {});
  }

  function connect(music, sfx) {
    musicButton = music;
    effectsButton = sfx;
    controls();
    if (!Audio) {
      music.disabled = true;
      preferences.music = false;
      controls();
    }

    music.addEventListener('click', () => {
      preferences.music = !preferences.music;
      save();
      controls();
      if (preferences.music) unlock().then(ready => { if (ready) startMusic(); });
      else stopMusic();
    });
    sfx.addEventListener('click', () => {
      preferences.effects = !preferences.effects;
      if (context) effectsGain.gain.setTargetAtTime(preferences.effects ? 1 : 0, context.currentTime, .015);
      save();
      controls();
      if (preferences.effects) play('tap');
      else Object.values(catPlayers).forEach(player => player.pause());
    });
    function resumeMusic(event) {
      if (preferences.music && !event.target.closest?.('#music')) {
        unlock().then(ready => { if (ready) startMusic(); });
      }
    }
    document.addEventListener('click', resumeMusic);
    document.addEventListener('keydown', resumeMusic);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopMusic();
      else startMusic();
    });
  }

  return {connect,play,playCat};
})();
