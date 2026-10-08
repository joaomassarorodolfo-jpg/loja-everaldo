const audioRef = useRef<AudioContext | null>(null);
  const flash = useRef(0);
  const clouds = useRef<Cloud[]>([]);
  const stars = useRef<Star[]>([]);
  const groundX = useRef(0);
  const bob = useRef(0);
  const [status, setStatus] = useState<Status>("menu");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
const audioRef = useRef<AudioContext | null>(null);
  const flash = useRef(0);
  const clouds = useRef<Cloud[]>([]);
  const stars = useRef<Star[]>([]);
  const groundX = useRef(0);
  const bob = useRef(0);
  const bestRef = useRef(0);
  const [status, setStatus] = useState<Status>("menu");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);





  const saved = Number(localStorage.getItem(STORAGE_KEY) || 0);
    setBest(Number.isFinite(saved) ? saved : 0);
const saved = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const value = Number.isFinite(saved) ? saved : 0;
    setBest(value);
    bestRef.current = value;






    const nextBest = Math.max(best, scoreRef.current);
    setBest(nextBest);
    localStorage.setItem(STORAGE_KEY, String(nextBest));
  };
const nextBest = Math.max(bestRef.current, scoreRef.current);
    bestRef.current = nextBest;
    setBest(nextBest);
    localStorage.setItem(STORAGE_KEY, String(nextBest));
  };










  raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [best, jump]);
raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);








  if (now === "menu") {
      ensureAudio();
      resetWorld();
      birdV.current = JUMP;
      statusRef.current = "playing";
      setStatus("playing");
      playTone(audioRef.current, 520, 0.09);
      burst(BIRD_X, birdY.current, "#fff6c2", 6);
      return;
    }
if (now === "menu") {
      ensureAudio();
      resetWorld();
      lastSpawn.current = performance.now() - 700;
      birdV.current = JUMP;
      statusRef.current = "playing";
      setStatus("playing");
      playTone(audioRef.current, 520, 0.09);
      burst(BIRD_X, birdY.current, "#fff6c2", 6);
      return;
    }