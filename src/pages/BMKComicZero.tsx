import { useEffect, useMemo, useState } from 'react';
import { BMK_ZERO_SCENES } from '@/data/bmkCanon';
import { bmkAudioDirector } from '@/lib/bmkAudioDirector';

const BMKComicZero = () => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const scene = useMemo(() => BMK_ZERO_SCENES[sceneIndex], [sceneIndex]);

  useEffect(() => {
    bmkAudioDirector.transition(soundEnabled ? scene.audioState : 'SILENCE');
  }, [scene.audioState, soundEnabled]);

  const next = () => setSceneIndex((current) => Math.min(current + 1, BMK_ZERO_SCENES.length - 1));
  const previous = () => setSceneIndex((current) => Math.max(current - 1, 0));

  const enableSound = () => {
    bmkAudioDirector.enable();
    setSoundEnabled(true);
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <section
        className={`relative min-h-screen flex items-end justify-center px-6 pb-20 pt-24 ${reducedMotion ? '' : 'transition-all duration-1000'}`}
        aria-live="polite"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(90,90,90,0.24),transparent_46%),linear-gradient(to_bottom,#050505,#000)]" />
        {!reducedMotion && scene.sceneId === 'BMK-COMIC-00-S03' && (
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_48%,transparent_50%)] animate-pulse" aria-hidden="true" />
        )}

        <div className="relative z-10 w-full max-w-3xl text-center space-y-6">
          <p className="text-xs tracking-[0.4em] uppercase text-white/50">BADMAN KOMBAT™ #0</p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase">{scene.title}</h1>

          {scene.caption && <p className="text-xl sm:text-2xl tracking-[0.2em] uppercase text-white/80">{scene.caption}</p>}

          {scene.dialogue?.map((line, index) => (
            <blockquote key={`${scene.sceneId}-${index}`} className="mx-auto max-w-xl text-2xl sm:text-4xl font-semibold italic">
              “{line.text}”
            </blockquote>
          ))}

          {scene.characters.map((appearance) => (
            <div key={`${scene.sceneId}-${appearance.characterId}`} className="mx-auto max-w-lg border border-white/15 bg-white/[0.03] p-5 text-left">
              <p className="text-xs tracking-[0.25em] uppercase text-white/50">Canonical appearance</p>
              <p className="mt-2 font-mono text-sm">{appearance.characterId}</p>
              {appearance.referenceSlot && <p className="mt-1 text-sm text-white/60">Reference: {appearance.referenceSlot}</p>}
            </div>
          ))}

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {!soundEnabled ? (
              <button onClick={enableSound} className="border border-white px-5 py-3 text-sm tracking-[0.18em] uppercase hover:bg-white hover:text-black">
                Enable Sound
              </button>
            ) : (
              <button onClick={() => setSoundEnabled(false)} className="border border-white/30 px-5 py-3 text-sm tracking-[0.18em] uppercase">
                Sound On · {scene.audioState}
              </button>
            )}
            <button onClick={() => setReducedMotion((value) => !value)} className="border border-white/30 px-5 py-3 text-sm tracking-[0.18em] uppercase">
              {reducedMotion ? 'Motion Reduced' : 'Reduce Motion'}
            </button>
          </div>

          <div className="pt-8 flex items-center justify-between gap-4">
            <button onClick={previous} disabled={sceneIndex === 0} className="px-4 py-2 text-sm uppercase tracking-[0.18em] disabled:opacity-25">Previous</button>
            <span className="font-mono text-xs text-white/50">{sceneIndex + 1} / {BMK_ZERO_SCENES.length}</span>
            <button onClick={next} disabled={sceneIndex === BMK_ZERO_SCENES.length - 1} className="px-4 py-2 text-sm uppercase tracking-[0.18em] disabled:opacity-25">Continue</button>
          </div>

          {sceneIndex === BMK_ZERO_SCENES.length - 1 && (
            <div className="pt-8 space-y-3">
              <p className="text-sm tracking-[0.3em] uppercase text-white/55">Read the story. Own the sound. Play the world.</p>
              <p className="text-2xl font-black uppercase">Jamaica You Can Play.™</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BMKComicZero;
