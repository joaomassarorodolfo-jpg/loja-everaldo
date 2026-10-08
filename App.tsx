import { useEffect, useRef, useState } from "react";
const GAME_DURATION = 30;
const GRID_SIZE = 9;
const STORAGE_KEY = "acerte-alvo-recorde";
type Status = "idle" | "playing" | "over";
export default function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [flashCell, setFlashCell] = useState<number | null>(null);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : 0;
  });
  const scoreRef = useRef(0);
  const activeRef = useRef<number | null>(null);
  const spawnTimeoutRef = useRef<number | undefined>(undefined);
  const spawnNextRef = useRef<() => void>(() => {});
  // Contagem regressiva
  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);
  // Fim de jogo quando o tempo acaba
  useEffect(() => {
    if (status === "playing" && timeLeft <= 0) {
      activeRef.current = null;
      setActiveCell(null);
      setStatus("over");
    }
  }, [timeLeft, status]);
  // Salva o recorde ao terminar
  useEffect(() => {
    if (status === "over" && score > highScore) {
      setHighScore(score);
      localStorage.setItem(STORAGE_KEY, String(score));
    }
  }, [status, score, highScore]);
  // Sorteio dos alvos (fica mais rápido conforme os pontos sobem)
  useEffect(() => {
    if (status !== "playing") return;
    const spawn = () => {
      let next = Math.floor(Math.random() * GRID_SIZE);
      while (next === activeRef.current) {
        next = Math.floor(Math.random() * GRID_SIZE);
      }
      activeRef.current = next;
      setActiveCell(next);
      const delay = Math.max(400, 1000 - scoreRef.current * 25);
      spawnTimeoutRef.current = window.setTimeout(spawn, delay);
    };
    spawnNextRef.current = () => {
      window.clearTimeout(spawnTimeoutRef.current);
      spawn();
    };
    spawn();
    return () => window.clearTimeout(spawnTimeoutRef.current);
  }, [status]);
  const startGame = () => {
    scoreRef.current = 0;
    activeRef.current = null;
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setActiveCell(null);
    setFlashCell(null);
    setStatus("playing");
  };
  const handleCellClick = (index: number) => {
    if (status !== "playing" || index !== activeRef.current) return;
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setFlashCell(index);
    window.setTimeout(() => setFlashCell(null), 150);
    spawnNextRef.current();
  };
  const progress = (timeLeft / GAME_DURATION) * 100;
  return (
    <div className="flex min-h-screen select-none flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center">
          <div className="text-5xl">🎯</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
            Acerte o Alvo
          </h1>
          <p className="text-sm text-slate-500">
            Clique no alvo assim que ele aparecer!
          </p>
        </header>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Tempo" value={`${timeLeft}s`} />
          <Stat label="Pontos" value={score} />
          <Stat label="Recorde" value={highScore} />
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="relative">
          <div className="grid grid-cols-3 gap-3 rounded-3xl bg-white/70 p-4 shadow-xl backdrop-blur">
            {Array.from({ length: GRID_SIZE }, (_, i) => {
              const isActive = status === "playing" && activeCell === i;
              const isFlash = flashCell === i;
              let className =
                "flex aspect-square cursor-pointer items-center justify-center rounded-2xl text-4xl transition-all duration-150 ";
              if (isFlash) {
                className += "scale-95 bg-emerald-400";
              } else if (isActive) {
                className += "scale-105 bg-amber-300 shadow-lg shadow-amber-200";
              } else {
                className += "bg-slate-200 hover:bg-slate-300";
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCellClick(i)}
                  className={className}
                >
                  {isFlash ? "💥" : isActive ? "🎯" : ""}
                </button>
              );
            })}
          </div>
          {status !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/90 p-6 text-center backdrop-blur-sm">
              {status === "idle" ? (
                <>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Pronto para jogar?
                  </h2>
                  <p className="text-slate-500">
                    Você tem {GAME_DURATION} segundos para fazer o máximo de
                    pontos.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Fim de jogo!
                  </h2>
                  <p className="text-slate-600">
                    Você fez <strong>{score}</strong> ponto(s).
                  </p>
                  {score > 0 && score === highScore && (
                    <p className="font-semibold text-amber-600">
                      🏆 Novo recorde!
                    </p>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={startGame}
                className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:scale-105 active:scale-95"
              >
                {status === "idle" ? "Começar" : "Jogar novamente"}
              </button>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-slate-400">
          Dica: quanto mais acertos, mais rápido o alvo muda de lugar.
        </p>
      </div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
    </div>
  );
}
