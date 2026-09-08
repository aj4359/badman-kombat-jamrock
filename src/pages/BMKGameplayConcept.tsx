import { useEffect, useMemo, useState } from "react";

const beats = [
  { t: 0, label: "KINGSTON • 11:47 PM", objective: "FOLLOW THE BASS", rep: "UNKNOWN", scene: "RAIN" },
  { t: 8, label: "THE BASS IS PART OF THE WORLD", objective: "FOLLOW THE BASS", rep: "UNKNOWN", scene: "BASS" },
  { t: 20, label: "WORD TRAVELS FASTER THAN YOU", objective: "ENTER THE DANCE", rep: "SEEN", scene: "DANCE" },
  { t: 31, label: "BADMAN REACH.", objective: "STAND YOUR GROUND", rep: "+12", scene: "FIGHT" },
  { t: 52, label: "POLICE!", objective: "GET OUT OF THERE", rep: "TROUBLE", scene: "CHASE" },
  { t: 63, label: "KINGSTON IS ONLY THE BEGINNING", objective: "???", rep: "UNKNOWN", scene: "MYTH" },
];

const sceneCopy: Record<string, string[]> = {
  RAIN: ["Rain needles the asphalt.", "Dominoes crack somewhere beyond the streetlight.", "A sound system wakes up."],
  BASS: ["BOOM.", "The puddle ripples.", "BOOOOOOM.", "The street points you toward the dance."],
  DANCE: ["200 PEOPLE • SOUND SYSTEM LIVE", "Someone recognises Leroy.", "WORD UPDATED: LEROY HAS BEEN SEEN"],
  FIGHT: ["PUNCH → BASS", "KICK → SNARE", "BLOCK → RIMSHOT", "THROW → DUB ECHO", "DOUBLE SIX."],
  CHASE: ["WORD SPREADING...", "REPUTATION: TROUBLE", "RUN • VAULT • CLIMB"],
  MYTH: ["No police.", "No Kingston.", "Only rain, jungle... and a distant bass that should not be here."],
};

export default function BMKGameplayConcept() {
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const beat = useMemo(() => [...beats].reverse().find((b) => time >= b.t) ?? beats[0], [time]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTime((v) => (v >= 75 ? 0 : v + 1)), 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden font-sans">
      <section className="relative min-h-screen flex flex-col justify-between p-5 sm:p-10">
        <div className="absolute inset-0 opacity-60" style={{background:"radial-gradient(circle at 55% 65%, #7a3517 0%, #24140d 22%, #071014 55%, #000 82%)"}} />
        <div className="absolute inset-0 opacity-25" style={{backgroundImage:"repeating-linear-gradient(105deg, transparent 0 19px, rgba(255,255,255,.18) 20px, transparent 21px 43px)"}} />
        <div className="absolute bottom-0 left-0 right-0 h-2/5 opacity-40" style={{background:"linear-gradient(170deg,transparent 20%,#d97706 21% 22%,transparent 23%),linear-gradient(10deg,transparent 40%,#9a3412 41% 42%,transparent 43%)"}} />

        <header className="relative z-10 flex justify-between gap-4 text-[10px] sm:text-xs tracking-[.24em] uppercase">
          <div><strong>BADMAN KOMBAT™</strong><br/><span className="text-amber-400">PRE-ALPHA • TARGET EXPERIENCE</span></div>
          <div className="text-right">{beat.label}<br/><span className="text-white/50">1987 • JAMAICA</span></div>
        </header>

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
          <div className="text-7xl sm:text-9xl font-black italic tracking-tighter drop-shadow-2xl">
            {beat.scene === "BASS" || beat.scene === "FIGHT" ? "BOOM" : beat.scene === "CHASE" ? "RUN" : beat.scene === "MYTH" ? "???" : "BMK"}
          </div>
          <div className="mt-5 space-y-1 text-sm sm:text-xl font-bold uppercase tracking-widest">
            {sceneCopy[beat.scene].map((line, i) => <p key={i} className={i === sceneCopy[beat.scene].length - 1 ? "text-amber-400" : "text-white/80"}>{line}</p>)}
          </div>
          {beat.scene === "FIGHT" && <div className="mt-8 flex justify-center gap-3 text-xs font-black"><span className="border border-white/30 px-4 py-2">WALK</span><span className="border border-white/30 px-4 py-2">TALK</span><span className="border border-amber-400 bg-amber-400 text-black px-4 py-2">BADMAN</span></div>}
        </div>

        <footer className="relative z-10">
          <div className="flex justify-between items-end gap-4 mb-3">
            <div><div className="text-[9px] tracking-[.25em] text-white/50">OBJECTIVE</div><div className="font-black text-lg sm:text-2xl">{beat.objective}</div></div>
            <div className="text-right"><div className="text-[9px] tracking-[.25em] text-white/50">WORD / REPUTATION</div><div className="font-black text-amber-400">{beat.rep}</div></div>
          </div>
          <div className="h-1 bg-white/20"><div className="h-full bg-white transition-all" style={{width:`${(time/75)*100}%`}} /></div>
          <div className="mt-3 flex justify-between items-center text-[10px] tracking-widest text-white/50">
            <button className="border border-white/20 px-3 py-2 text-white" onClick={() => setPlaying(v => !v)}>{playing ? "PAUSE" : "PLAY"}</button>
            <button onClick={() => setTime(0)}>RESTART</button>
            <span>{String(Math.floor(time/60)).padStart(2,"0")}:{String(time%60).padStart(2,"0")} / 01:15</span>
          </div>
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
