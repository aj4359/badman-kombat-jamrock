import { useEffect, useMemo, useState } from 'react';
import BMKSceneAtmosphere from '@/components/bmk/BMKSceneAtmosphere';
import { BMK_ZERO_SCENES } from '@/data/bmkCanon';
import { BMK_AUDIO_PROFILES } from '@/data/bmkAudioProfiles';
import { bmkAudioDirector } from '@/lib/bmkAudioDirector';

const BMKComicZero = () => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const scene = useMemo(() => BMK_ZERO_SCENES[sceneIndex], [sceneIndex]);
  const audioProfile = BMK_AUDIO_PROFILES[scene.sceneId];
  const hasLeroy = scene.characters.some((appearance) => appearance.characterId === 'BMK-CHR-LEROY-001');

  useEffect(() => {
    bmkAudioDirector.transition(soundEnabled ? scene.audioState : 'SILENCE');
  }, [scene.audioState, soundEnabled]);

  const next = () => setSceneIndex((current) => Math.min(current + 1, BMK_ZERO_SCENES.length - 1));
  const previous = () => setSceneIndex((current) => Math.max(current - 1, 0));

  const enableSound = () => {
    bmkAudioDirector.enable();
    setSoundEnabled(true);
  };

  const disableSound = () => {
    bmkAudioDirector.disable();
    setSoundEnabled(false);
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden selection:bg-white selection:text-black">
      <section
        key={scene.sceneId}
        className={`relative min-h-screen flex items-end justify-center px-5 sm:px-8 pb-24 sm:pb-16 pt-24 ${reducedMotion ? '' : 'transition-opacity duration-700'}`}
        aria-live="polite"
      >
        <BMKSceneAtmosphere scene={scene} reducedMotion={reducedMotion} />

        {hasLeroy && (
          <div className="absolute inset-x-0 bottom-[19%] z-[2] flex justify-center pointer-events-none" aria-hidden="true">
            <div className="relative h-[44vh] min-h-72 w-36 sm:w-44 opacity-90">
              <div className="absolute left-1/2 top-0 h-20 w-16 -translate-x-1/2 rounded-[48%] bg-black border border-white/10 shadow-[0_0_70px_rgba(255,255,255,0.04)]" />
              <div className="absolute left-1/2 top-16 h-48 w-28 -translate-x-1/2 rounded-[46%_46%_20%_20%] bg-black border-x border-white/[0.07]" />
              <div className="absolute left-1/2 top-52 h-36 w-24 -translate-x-1/2 bg-black [clip-path:polygon(18%_0,82%_0,100%_100%,62%_100%,50%_30%,38%_100%,0_100%)]" />
              <div className="absolute inset-x-0 bottom-0 text-center">
                <span className="inline-block border border-white/15 bg-black/70 px-2 py-1 font-mono text-[8px] tracking-[0.16em] text-white/35">CANON ART SLOT · LEROY-001</span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-5 left-5 right-5 z-20 flex items-start justify-between gap-4 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-white/45">
          <div>
            <p>BADMAN KOMBAT™</p>
            <p className="mt-1 text-white/25">Kingston · 1987</p>
          </div>
          <div className="text-right">
            <p>Issue #0 · Scene {String(sceneIndex + 1).padStart(2, '0')}</p>
            <p className="mt-1 text-white/25">{soundEnabled ? `${audioProfile?.source ?? 'AUDIO'} · ${scene.audioState}` : 'Silent mode'}</p>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-4xl text-center space-y-5 sm:space-y-6">
          {scene.sceneId === 'BMK-COMIC-00-S01' && (
            <p className="mx-auto w-fit rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[10px] tracking-[0.3em] uppercase text-white/65 backdrop-blur-sm">
              Headphones Recommended
            </p>
          )}

          <h1 className={`font-black uppercase leading-[0.88] tracking-[-0.04em] ${sceneIndex === 5 ? 'text-5xl sm:text-8xl' : 'text-4xl sm:text-7xl'}`}>
            {scene.title}
          </h1>

          {scene.caption && scene.sceneId !== 'BMK-COMIC-00-S01' && (
            <p className="mx-auto max-w-2xl text-lg sm:text-2xl tracking-[0.16em] uppercase text-white/80">{scene.caption}</p>
          )}

          {scene.dialogue?.map((line, index) => (
            <blockquote key={`${scene.sceneId}-${index}`} className="mx-auto max-w-2xl pt-2 text-3xl sm:text-6xl font-semibold italic tracking-tight">
              “{line.text}”
            </blockquote>
          ))}

          {hasLeroy && (
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.12em] text-white/45">BMK-CHR-LEROY-001 · continuity locked</span>
            </div>
          )}

          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {!soundEnabled ? (
              <button onClick={enableSound} className="border border-white bg-white px-5 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-black hover:bg-white/90">
                Enter With Sound
              </button>
            ) : (
              <button onClick={disableSound} className="border border-white/20 bg-black/45 px-4 py-3 text-[10px] tracking-[0.16em] uppercase text-white/70 backdrop-blur-sm">
                Sound On · {scene.audioState}
              </button>
            )}
            <button onClick={() => setReducedMotion((value) => !value)} className="border border-white/15 bg-black/40 px-4 py-3 text-[10px] tracking-[0.16em] uppercase text-white/55 backdrop-blur-sm">
              {reducedMotion ? 'Motion Reduced' : 'Reduce Motion'}
            </button>
          </div>

          <div className="mx-auto max-w-xl pt-3">
            <div className="h-px w-full bg-white/10">
              <div className="h-px bg-white/70 transition-all duration-500" style={{ width: `${((sceneIndex + 1) / BMK_ZERO_SCENES.length) * 100}%` }} />
            </div>
          </div>

          <div className="mx-auto max-w-2xl pt-1 flex items-center justify-between gap-4">
            <button onClick={previous} disabled={sceneIndex === 0} className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/60 disabled:opacity-20">Previous</button>
            <span className="font-mono text-[9px] text-white/30">{sceneIndex + 1} / {BMK_ZERO_SCENES.length}</span>
            <button onClick={next} disabled={sceneIndex === BMK_ZERO_SCENES.length - 1} className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/75 disabled:opacity-20">Continue</button>
          </div>

          {sceneIndex === BMK_ZERO_SCENES.length - 1 && (
            <div className="pt-3 space-y-2">
              <p className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-white/45">Read the story. Own the sound. Play the world.</p>
              <p className="text-xl sm:text-3xl font-black uppercase">Jamaica You Can Play.™</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BMKComicZero;
