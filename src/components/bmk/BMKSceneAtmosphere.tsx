import type { ComicScene } from '@/types/bmkCanon';

interface BMKSceneAtmosphereProps {
  scene: ComicScene;
  reducedMotion: boolean;
}

const sceneTone: Record<string, string> = {
  'BMK-COMIC-00-S01': 'from-black via-black to-zinc-950',
  'BMK-COMIC-00-S02': 'from-slate-950 via-zinc-900 to-black',
  'BMK-COMIC-00-S03': 'from-slate-950 via-neutral-900 to-black',
  'BMK-COMIC-00-S04': 'from-zinc-950 via-neutral-900 to-black',
  'BMK-COMIC-00-S05': 'from-black via-zinc-950 to-neutral-950',
  'BMK-COMIC-00-S06': 'from-emerald-950/70 via-black to-black',
};

const Rain = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <div
    aria-hidden="true"
    className={`absolute inset-0 pointer-events-none opacity-45 ${reducedMotion ? '' : 'animate-pulse'}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(112deg, transparent 0px, transparent 11px, rgba(255,255,255,0.16) 12px, transparent 13px, transparent 26px)',
      backgroundSize: '180px 180px',
    }}
  />
);

const KingstonStreet = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <>
    <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black via-black/85 to-transparent" aria-hidden="true" />
    <div className="absolute left-[8%] bottom-[28%] h-24 w-36 border border-white/10 bg-black/60 shadow-[0_0_60px_rgba(255,179,71,0.08)]" aria-hidden="true" />
    <div className="absolute right-[6%] bottom-[24%] h-32 w-52 border border-white/10 bg-black/70" aria-hidden="true" />
    <div className="absolute left-[14%] bottom-[38%] h-2 w-14 bg-amber-200/50 blur-[2px] shadow-[0_0_36px_rgba(251,191,36,0.35)]" aria-hidden="true" />
    <div className="absolute right-[16%] bottom-[34%] h-2 w-20 bg-red-300/30 blur-[2px] shadow-[0_0_42px_rgba(248,113,113,0.18)]" aria-hidden="true" />
    {!reducedMotion && <Rain reducedMotion={false} />}
  </>
);

const SoundSystem = ({ confrontation = false }: { confrontation?: boolean }) => (
  <>
    <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black via-black/95 to-transparent" aria-hidden="true" />
    <div className="absolute left-1/2 bottom-[20%] -translate-x-1/2 flex gap-2 opacity-70" aria-hidden="true">
      {[0, 1, 2].map((column) => (
        <div key={column} className="flex flex-col gap-2">
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-16 w-16 sm:h-20 sm:w-20 border border-white/15 bg-black shadow-[inset_0_0_0_8px_rgba(255,255,255,0.025)] rounded-sm flex items-center justify-center">
              <div className={`rounded-full border border-white/10 ${row === 2 ? 'h-11 w-11' : 'h-8 w-8'} ${confrontation ? 'bg-white/[0.03]' : 'bg-white/[0.05]'}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className={`absolute left-1/2 bottom-[18%] -translate-x-1/2 h-64 w-64 rounded-full blur-3xl ${confrontation ? 'bg-red-500/5' : 'bg-amber-300/5'}`} aria-hidden="true" />
  </>
);

const VinylSeed = () => (
  <div className="absolute right-5 sm:right-12 bottom-28 rotate-[-7deg]" aria-label="Canonical Kingston '87 record sleeve">
    <div className="relative h-24 w-24 sm:h-32 sm:w-32 border border-white/20 bg-neutral-950 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0_11%,rgba(255,255,255,0.08)_12%,transparent_13%_24%,rgba(255,255,255,0.05)_25%,transparent_26%)]" />
      <div className="absolute inset-x-2 bottom-2">
        <p className="text-[7px] sm:text-[9px] tracking-[0.18em] uppercase text-white/80">Badman Kombat</p>
        <p className="text-[9px] sm:text-xs font-black uppercase">Kingston '87</p>
      </div>
    </div>
  </div>
);

const MythologyHint = () => (
  <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(16,185,129,0.14),transparent_12%,rgba(0,0,0,0.84)_42%)]" aria-hidden="true" />
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[44vh] w-[12vw] min-w-16 rounded-[50%] border border-emerald-200/10 shadow-[0_0_120px_rgba(16,185,129,0.10)]" aria-hidden="true" />
  </>
);

const BMKSceneAtmosphere = ({ scene, reducedMotion }: BMKSceneAtmosphereProps) => {
  const isStreet = ['BMK-COMIC-00-S02', 'BMK-COMIC-00-S03'].includes(scene.sceneId);
  const isDance = scene.sceneId === 'BMK-COMIC-00-S04';
  const isConfrontation = scene.sceneId === 'BMK-COMIC-00-S05';
  const isMythology = scene.sceneId === 'BMK-COMIC-00-S06';

  return (
    <div className={`absolute inset-0 overflow-hidden bg-gradient-to-b ${sceneTone[scene.sceneId] ?? 'from-black to-zinc-950'}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.08),transparent_36%)]" />
      {isStreet && <KingstonStreet reducedMotion={reducedMotion} />}
      {isDance && <SoundSystem />}
      {isConfrontation && <SoundSystem confrontation />}
      {(isDance || isConfrontation) && <VinylSeed />}
      {isMythology && <MythologyHint />}
      {!reducedMotion && (isDance || isConfrontation) && (
        <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_74%,rgba(255,255,255,0.06),transparent_28%)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/55" />
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '100% 4px' }} />
    </div>
  );
};

export default BMKSceneAtmosphere;
