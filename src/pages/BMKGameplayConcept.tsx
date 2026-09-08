import { useEffect, useMemo, useState } from "react";

const beats = [
  { t: 0, label: "KINGSTON • 11:47 PM", objective: "FOLLOW THE BASS", rep: "UNKNOWN", scene: "RAIN" },
  { t: 8, label: "THE BASS IS PART OF THE WORLD", objective: "FOLLOW THE BASS", rep: "UNKNOWN", scene: "BASS" },
  { t: 20, label: "WORD TRAVELS FASTER THAN YOU", objective: "ENTER THE DANCE", rep: "SEEN", scene: "DANCE" },
  { t: 31, label: "BADMAN REACH.", objective: "STAND YOUR GROUND", rep: "+12", scene: "FIGHT" },
  { t: 52, label: "POLICE!", objective: "GET OUT OF THERE", rep: "TROUBLE", scene: "CHASE" },
  { t: 63, label: "KINGSTON IS ONLY THE BEGINNING", objective: "???", rep: "UNKNOWN", scene: "MYTH" },
];

const copy: Record<string, string[]> = {
  RAIN: ["Rain needles the asphalt.", "Dominoes crack beyond the streetlight.", "A sound system wakes up."],
  BASS: ["BOOM.", "Puddles ripple.", "BOOOOOOM.", "The street itself points toward the dance."],
  DANCE: ["200 PEOPLE • SOUND SYSTEM LIVE", "Someone recognises Leroy.", "WORD UPDATED: LEROY HAS BEEN SEEN"],
  FIGHT: ["PUNCH → BASS", "KICK → SNARE", "BLOCK → RIMSHOT", "THROW → DUB ECHO", "DOUBLE SIX."],
  CHASE: ["WORD SPREADING...", "REPUTATION: TROUBLE", "RUN • VAULT • CLIMB"],
  MYTH: ["No police.", "No Kingston.", "Only rain, jungle... and a distant bass that should not be here."],
};

const silhouettes = [18, 26, 35, 44, 57, 66, 75, 84];

export default function BMKGameplayConcept() {
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [playerX, setPlayerX] = useState(48);
  const [impact, setImpact] = useState(false);
  const beat = useMemo(() => [...beats].reverse().find((b) => time >= b.t) ?? beats[0], [time]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTime((v) => (v >= 75 ? 0 : v + 1)), 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") setPlayerX((v) => Math.max(12, v - 4));
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") setPlayerX((v) => Math.min(84, v + 4));
      if ((e.key === " " || e.key.toLowerCase() === "f") && beat.scene === "FIGHT") {
        setImpact(true);
        window.setTimeout(() => setImpact(false), 180);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beat.scene]);

  const worldTransform = beat.scene === "CHASE" ? "translateX(-3%) scale(1.04)" : beat.scene === "FIGHT" && impact ? "translateX(1.2%) scale(1.03)" : "translateX(0) scale(1)";

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden font-sans select-none">
      <section className="relative min-h-screen flex flex-col justify-between p-5 sm:p-10 isolate">
        <div className="absolute inset-0 -z-30 transition-all duration-700" style={{background: beat.scene === "MYTH" ? "radial-gradient(circle at 50% 60%,#16361d 0%,#08150c 38%,#020503 75%)" : "linear-gradient(#031019 0%,#0b1720 43%,#1e130d 72%,#050505 100%)"}} />
        <div className="absolute inset-0 -z-20 transition-transform duration-300" style={{transform:worldTransform}}>
          {beat.scene !== "MYTH" ? (
            <>
              <div className="absolute bottom-[28%] left-0 right-0 h-[34%] opacity-90 bg-[linear-gradient(90deg,#25140f_0_12%,transparent_12_16%,#301811_16_28%,transparent_28_33%,#21110d_33_48%,transparent_48_54%,#32170f_54_72%,transparent_72_78%,#25140f_78_100%)]" />
              <div className="absolute bottom-[27%] left-[8%] w-[10%] h-[11%] bg-amber-500/20 border border-amber-300/20" />
              <div className="absolute bottom-[27%] right-[9%] w-[13%] h-[14%] bg-orange-600/10 border border-orange-300/20" />
              <div className="absolute bottom-0 left-0 right-0 h-[29%] bg-gradient-to-b from-zinc-800 via-zinc-950 to-black" />
              <div className="absolute bottom-[18%] left-0 right-0 h-[2px] bg-white/10" />
              {(beat.scene === "DANCE" || beat.scene === "FIGHT").toString() === "true" && <div className="absolute bottom-[29%] right-[12%] flex items-end gap-1"><div className="w-12 h-28 bg-zinc-950 border border-white/15"/><div className="w-16 h-36 bg-black border border-amber-400/25"/><div className="w-12 h-24 bg-zinc-950 border border-white/15"/></div>}
              {silhouettes.map((x, i) => <div key={x} className="absolute bottom-[28%] rounded-t-full bg-black/90" style={{left:`${x}%`,width:`${i%3===0?18:13}px`,height:`${i%2===0?70:56}px`,transform:`translateY(${beat.scene === "DANCE" ? (i%2?'-4px':'2px') : '0'})`,transition:'transform .2s'}} />)}
            </>
          ) : (
            <>
              <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[radial-gradient(ellipse_at_bottom,#183a1c_0%,#0a190d_45%,#020503_78%)]" />
              {[7,17,28,67,77,88].map((x,i)=><div key={x} className="absolute bottom-0 bg-black/80" style={{left:`${x}%`,width:`${22+i*3}px`,height:`${44+i%3*9}%`,clipPath:'polygon(35% 0,65% 0,72% 50%,100% 100%,0 100%,28% 50%)'}} />)}
              <div className="absolute bottom-[35%] right-[18%] w-40 h-28 bg-black/80 rounded-[55%_45%_35%_50%] blur-[1px]" />
            </>
          )}
        </div>

        <div className="absolute inset-0 -z-10 pointer-events-none opacity-40 bg-[repeating-linear-gradient(108deg,transparent_0_18px,rgba(255,255,255,.16)_19px,transparent_20px_43px)]" />
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-150 ${impact ? 'opacity-70' : 'opacity-0'} bg-white mix-blend-screen`} />

        <header className="relative z-10 flex justify-between gap-4 text-[10px] sm:text-xs tracking-[.24em] uppercase">
          <div><strong>BADMAN KOMBAT™</strong><br/><span className="text-amber-400">PRE-ALPHA • TARGET EXPERIENCE</span></div>
          <div className="text-right">{beat.label}<br/><span className="text-white/50">1987 • JAMAICA</span></div>
        </header>

        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="absolute bottom-[22%] -translate-x-1/2 transition-all duration-200" style={{left:`${playerX}%`}}>
            <div className="relative w-16 h-40 sm:w-20 sm:h-52">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black border border-white/20" />
              <div className="absolute top-9 sm:top-11 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-24 sm:h-32 bg-black skew-x-[-4deg] border-x border-white/10" />
              <div className="absolute top-12 sm:top-14 left-0 w-5 h-20 bg-black rotate-[12deg] origin-top" />
              <div className="absolute top-12 sm:top-14 right-0 w-5 h-20 bg-black rotate-[-12deg] origin-top" />
              <div className="absolute bottom-0 left-3 w-5 h-20 bg-black rotate-[3deg]" /><div className="absolute bottom-0 right-3 w-5 h-20 bg-black rotate-[-3deg]" />
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[.3em] text-white/45">LEROY • CANON SLOT</div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto w-full text-center -translate-y-10 pointer-events-none">
            <div className="text-6xl sm:text-9xl font-black italic tracking-tighter drop-shadow-2xl">
              {beat.scene === "BASS" || beat.scene === "FIGHT" ? "BOOM" : beat.scene === "CHASE" ? "RUN" : beat.scene === "MYTH" ? "???" : beat.scene === "DANCE" ? "WORD" : "KINGSTON"}
            </div>
            <div className="mt-5 space-y-1 text-xs sm:text-lg font-bold uppercase tracking-widest">
              {copy[beat.scene].map((line, i) => <p key={i} className={i === copy[beat.scene].length - 1 ? "text-amber-400" : "text-white/70"}>{line}</p>)}
            </div>
            {beat.scene === "FIGHT" && <div className="mt-7 flex justify-center gap-2 text-[10px] sm:text-xs font-black"><span className="border border-white/30 px-4 py-2">WALK</span><span className="border border-white/30 px-4 py-2">TALK</span><span className="border border-amber-400 bg-amber-400 text-black px-4 py-2">BADMAN</span></div>}
          </div>
        </div>

        <footer className="relative z-10">
          <div className="flex justify-between items-end gap-4 mb-3">
            <div><div className="text-[9px] tracking-[.25em] text-white/50">OBJECTIVE</div><div className="font-black text-lg sm:text-2xl">{beat.objective}</div></div>
            <div className="text-right"><div className="text-[9px] tracking-[.25em] text-white/50">WORD / REPUTATION</div><div className="font-black text-amber-400">{beat.rep}</div></div>
          </div>
          <div className="h-1 bg-white/20"><div className="h-full bg-white transition-all" style={{width:`${(time/75)*100}%`}} /></div>
          <div className="mt-3 grid grid-cols-3 items-center text-[10px] tracking-widest text-white/50">
            <div className="flex gap-2"><button className="border border-white/20 px-3 py-2 text-white" onClick={() => setPlaying(v => !v)}>{playing ? "PAUSE" : "PLAY"}</button><button className="border border-white/10 px-3 py-2" onClick={() => setTime(0)}>RESTART</button></div>
            <div className="text-center hidden sm:block">A / D MOVE • F STRIKE</div>
            <span className="text-right">{String(Math.floor(time/60)).padStart(2,"0")}:{String(time%60).padStart(2,"0")} / 01:15</span>
          </div>
          <div className="sm:hidden mt-3 grid grid-cols-3 gap-2"><button onClick={()=>setPlayerX(v=>Math.max(12,v-5))} className="border border-white/15 py-3">◀</button><button onClick={()=>{if(beat.scene==='FIGHT'){setImpact(true);window.setTimeout(()=>setImpact(false),180)}}} className="border border-amber-400/50 py-3 text-amber-300">STRIKE</button><button onClick={()=>setPlayerX(v=>Math.min(84,v+5))} className="border border-white/15 py-3">▶</button></div>
        </footer>
      </section>

      <section className="bg-zinc-950 px-6 py-16 text-center border-t border-white/10">
        <p className="text-xs tracking-[.35em] text-amber-400">WORD • SOUND • POWER</p>
        <h1 className="mt-4 text-4xl sm:text-7xl font-black">JAMAICA YOU CAN PLAY™</h1>
        <p className="mt-5 max-w-2xl mx-auto text-white/55">Simulated target gameplay. This sequence communicates the intended BMK experience and is not represented as finished gameplay footage.</p>
      </section>
    </main>
  );
}
