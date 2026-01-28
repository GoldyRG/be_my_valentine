import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function rectsOverlap(a, b, padding = 0) {
  return !(
    a.right + padding < b.left - padding ||
    a.left - padding > b.right + padding ||
    a.bottom + padding < b.top - padding ||
    a.top - padding > b.bottom + padding
  );
}

function getViewportRect() {
  return {
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ValentineCard({ onAccept, onReset }) {
  const cardRef = useRef(null);
  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);
  const noMoveTimeoutRef = useRef(null);
  const noDodgeTimeoutRef = useRef(null);
  const loveOverlayTimeoutRef = useRef(null);
  const heartOverlayTimeoutRef = useRef(null);
  const noTestInputRef = useRef(null);

  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [noPos, setNoPos] = useState({ x: 24, y: 24 });
  const [noTries, setNoTries] = useState(0);
  const [isDodging, setIsDodging] = useState(false);
  const [isNoTestOpen, setIsNoTestOpen] = useState(false);
  const [showHeartBreak, setShowHeartBreak] = useState(false);
  const [showHeartLove, setShowHeartLove] = useState(false);
  const [noTest, setNoTest] = useState(null);
  const [noAnswer, setNoAnswer] = useState("");
  const [noError, setNoError] = useState("");
  const [heartRain, setHeartRain] = useState([]);
  const [confetti, setConfetti] = useState([]);

  const NO_MOVE_DELAY_MS = 140;
  const NO_DODGE_DURATION_MS = 180;

  const noMessages = useMemo(
    () => [
      "No",
      "Are you sure?",
      "Try again.",
      "Really sure??",
      "You're breaking my heart.",
      "Last chance.",
      "Fine, prove it.",
    ],
    []
  );

  const noLabel = noMessages[clamp(noTries, 0, noMessages.length - 1)];
  const isFinalNo = noTries >= noMessages.length - 1;

  const placeNoButtonNearYes = useCallback(() => {
    const noBtn = noBtnRef.current;
    const yesBtn = yesBtnRef.current;
    if (!noBtn || !yesBtn) return;

    const vp = getViewportRect();
    const noRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const padding = 14;
    const gap = 12;

    const targetX = yesRect.left + (yesRect.width - noRect.width) / 2;
    const targetY = yesRect.bottom + gap;

    const maxX = Math.max(padding, vp.width - noRect.width - padding);
    const maxY = Math.max(padding, vp.height - noRect.height - padding);

    const x = clamp(targetX, padding, maxX);
    const y = clamp(targetY, padding, maxY);

    setNoPos({ x, y });
  }, []);

  const moveNoButton = () => {
    const noBtn = noBtnRef.current;
    if (!noBtn) return;

    const vp = getViewportRect();
    const noRect = noBtn.getBoundingClientRect();

    const cardRect = cardRef.current?.getBoundingClientRect() ?? null;
    const yesRect = yesBtnRef.current?.getBoundingClientRect() ?? null;

    const padding = 14;
    const avoidPadding = 18;

    const minX = padding;
    const minY = padding;
    const maxX = Math.max(padding, vp.width - noRect.width - padding);
    const maxY = Math.max(padding, vp.height - noRect.height - padding);

    const attempts = 40;

    for (let i = 0; i < attempts; i += 1) {
      const x = getRandomInt(minX, maxX);
      const y = getRandomInt(minY, maxY);

      const candidate = {
        left: x,
        top: y,
        right: x + noRect.width,
        bottom: y + noRect.height,
      };

      if (cardRect && rectsOverlap(candidate, cardRect, avoidPadding)) {
        continue;
      }

      if (yesRect && rectsOverlap(candidate, yesRect, 24)) {
        continue;
      }

      setNoPos({ x, y });
      return;
    }

    setNoPos({
      x: getRandomInt(minX, maxX),
      y: getRandomInt(minY, maxY),
    });
  };

  const createNoTest = useCallback(() => {
    const a = getRandomInt(11, 29);
    const b = getRandomInt(7, 19);
    const c = getRandomInt(3, 9);
    const d = getRandomInt(2, 5);

    const tests = [
      {
        prompt: `You thought this would be easy? Compute: (${a} + ${b}) * ${c} - ${d}`,
        answer: String((a + b) * c - d),
      },
      {
        prompt: `Decrypt this: (${a} - ${c}) * (${b} + ${d}) + ${c}`,
        answer: String((a - c) * (b + d) + c),
      },
      {
        prompt: `Count the letters in "luckiest valentine ever" and add ${b}.`,
        answer: String("luckiest valentine ever".replace(/\\s+/g, "").length + b),
      },
      {
        prompt: `Binary flex: what is ${c} + ${d} in binary? (answer in decimal)`,
        answer: String(c + d),
      },
    ];

    return tests[getRandomInt(0, tests.length - 1)];
  }, []);

  const openNoTest = () => {
    if (isNoTestOpen || showHeartBreak) return;
    const nextTest = createNoTest();
    setNoTest(nextTest);
    setNoAnswer("");
    setNoError("");
    setShowHeartBreak(true);

    heartOverlayTimeoutRef.current = window.setTimeout(() => {
      setIsNoTestOpen(true);
      setShowHeartBreak(false);
    }, 1200);
  };

  const handleNoTestSubmit = (event) => {
    event.preventDefault();
    if (!noTest) return;

    if (noAnswer.trim() === noTest.answer) {
      setDeclined(true);
      setIsNoTestOpen(false);
      setNoError("");
      return;
    }

    setNoError("Not quite. Try again.");
  };

  const handleNoTestReset = () => {
    setNoTest(createNoTest());
    setNoAnswer("");
    setNoError("");
  };

  const launchHeartRain = useCallback(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const count = isMobile ? 35 : 60;
    const hearts = Array.from({ length: count }, (_, index) => ({
      id: `heart-${Date.now()}-${index}`,
      left: getRandomInt(2, 98),
      delay: Math.random() * 0.6,
      duration: getRandomInt(2200, 3400),
      scale: getRandomInt(60, 140) / 100,
    }));
    setHeartRain(hearts);
  }, []);

  const launchConfetti = useCallback(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const count = isMobile ? 40 : 80;
    const palette = ["#f472b6", "#fb7185", "#fbbf24", "#c084fc", "#38bdf8", "#fb923c"];
    const bits = Array.from({ length: count }, (_, index) => ({
      id: `confetti-${Date.now()}-${index}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2200 + Math.random() * 1600,
      size: 6 + Math.random() * 12,
      color: palette[getRandomInt(0, palette.length - 1)],
      tilt: Math.random() * 24 - 12,
    }));
    setConfetti(bits);
  }, []);

  const handleAccept = () => {
    if (showHeartLove || accepted) return;

    setShowHeartLove(true);
    loveOverlayTimeoutRef.current = window.setTimeout(() => {
      launchHeartRain();
      launchConfetti();
      setAccepted(true);
      setDeclined(false);
      setIsNoTestOpen(false);
      setNoError("");
      setShowHeartLove(false);
      if (onAccept) onAccept();
    }, 1150);
  };

  const resetAll = () => {
    setAccepted(false);
    setDeclined(false);
    setNoTries(0);
    setIsDodging(false);
    setIsNoTestOpen(false);
    setNoTest(null);
    setNoAnswer("");
    setNoError("");
    setHeartRain([]);
    setConfetti([]);
    setShowHeartLove(false);
    setShowHeartBreak(false);

    if (onReset) onReset();

    if (noMoveTimeoutRef.current) {
      clearTimeout(noMoveTimeoutRef.current);
      noMoveTimeoutRef.current = null;
    }
    if (noDodgeTimeoutRef.current) {
      clearTimeout(noDodgeTimeoutRef.current);
      noDodgeTimeoutRef.current = null;
    }
    if (loveOverlayTimeoutRef.current) {
      clearTimeout(loveOverlayTimeoutRef.current);
      loveOverlayTimeoutRef.current = null;
    }
    if (heartOverlayTimeoutRef.current) {
      clearTimeout(heartOverlayTimeoutRef.current);
      heartOverlayTimeoutRef.current = null;
    }
  };

  const scheduleNoMove = () => {
    if (isFinalNo || isNoTestOpen || noMoveTimeoutRef.current) {
      return;
    }

    setNoTries((t) => t + 1);
    setIsDodging(true);

    noDodgeTimeoutRef.current = window.setTimeout(() => {
      setIsDodging(false);
      noDodgeTimeoutRef.current = null;
    }, NO_DODGE_DURATION_MS);

    noMoveTimeoutRef.current = window.setTimeout(() => {
      moveNoButton();
      noMoveTimeoutRef.current = null;
    }, NO_MOVE_DELAY_MS);
  };

  useEffect(() => {
    if (isNoTestOpen) {
      noTestInputRef.current?.focus();
    }
  }, [isNoTestOpen]);

  useLayoutEffect(() => {
    if (!accepted && !declined) {
      placeNoButtonNearYes();
    }
  }, [accepted, declined, placeNoButtonNearYes]);

  useEffect(() => {
    if (!accepted) return undefined;
    launchHeartRain();
    const interval = window.setInterval(launchHeartRain, 2200);
    return () => window.clearInterval(interval);
  }, [accepted, launchHeartRain]);

  useEffect(() => {
    return () => {
      if (noMoveTimeoutRef.current) {
        clearTimeout(noMoveTimeoutRef.current);
      }
      if (noDodgeTimeoutRef.current) {
        clearTimeout(noDodgeTimeoutRef.current);
      }
      if (loveOverlayTimeoutRef.current) {
        clearTimeout(loveOverlayTimeoutRef.current);
      }
      if (heartOverlayTimeoutRef.current) {
        clearTimeout(heartOverlayTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      const noBtn = noBtnRef.current;
      if (!noBtn) return;

      const rect = noBtn.getBoundingClientRect();
      const padding = 14;

      const x = clamp(rect.left, padding, window.innerWidth - rect.width - padding);
      const y = clamp(rect.top, padding, window.innerHeight - rect.height - padding);

      setNoPos({ x, y });
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (accepted) {
    return (
      <div
        ref={cardRef}
        className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/20 bg-gradient-to-br from-rose-200/25 via-white/8 to-amber-200/15 px-6 py-8 sm:px-10 sm:py-10 shadow-[0_40px_120px_rgba(0,0,0,0.5)] ring-1 ring-white/20 backdrop-blur-2xl animate-yes-pop"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/35 blur-3xl opacity-60" />
          <div className="absolute -bottom-28 right-6 h-64 w-64 rounded-full bg-pink-200/20 blur-3xl opacity-45" />
        </div>

        <div className="pointer-events-none absolute inset-[-20%] opacity-50 mix-blend-screen spin-gradient" />

        <div className="pointer-events-none absolute inset-0">
          <span className="cupid cupid-left" aria-hidden="true">❤️</span>
          <span className="cupid cupid-right" aria-hidden="true">❤️</span>
        </div>

        {confetti.length ? (
          <div className="confetti-shower" aria-hidden="true">
            {confetti.map((bit) => (
              <span
                key={bit.id}
                className="confetti-bit"
                style={{
                  left: `${bit.left}%`,
                  width: `${bit.size}px`,
                  height: `${bit.size * 0.5}px`,
                  backgroundColor: bit.color,
                  animationDelay: `${bit.delay}s`,
                  animationDuration: `${bit.duration}ms`,
                  transform: `rotate(${bit.tilt}deg)`,
                }}
              />
            ))}
          </div>
        ) : null}

        {heartRain.length ? (
          <div className="heart-rain" aria-hidden="true">
            {heartRain.map((heart) => (
              <span
                key={heart.id}
                className="heart-drop"
                style={{
                  left: `${heart.left}%`,
                  animationDelay: `${heart.delay}s`,
                  animationDuration: `${heart.duration}ms`,
                  transform: `scale(${heart.scale})`,
                }}
              >
                ❤️
              </span>
            ))}
          </div>
        ) : null}

        <div className="relative z-10 flex flex-col items-center text-center text-white">
          <p className="rounded-full border border-white/25 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
            💘 Accepted
          </p>
          <h1 className="mt-6 text-balance text-4xl sm:text-5xl font-bold leading-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
            You are officially my Valentine!
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80">
            How does it feel to be loved by someone as handome as me? 😘❤️‍🔥 
          </p>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80">
            Time for backshots!? ╰(*°▽°*)╯
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={resetAll}
              className="rounded-2xl border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white/90 shadow-lg shadow-black/25 transition hover:bg-white/20"
            >
              Replay
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (declined) {
    return (
      <div
        ref={cardRef}
        className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-rose-900/70 via-fuchsia-900/60 to-amber-900/50 px-6 py-8 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/25 blur-3xl opacity-50" />
          <div className="absolute -bottom-28 right-6 h-64 w-64 rounded-full bg-pink-200/15 blur-3xl opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_35%),radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.06),transparent_40%)]" />
        </div>

        <div className="flex items-center justify-center gap-3 text-center">
          <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
            ⚠️ Declined
          </span>
          <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
            Challenge mode
          </span>
        </div>

        <h1 className="mt-4 text-balance text-center text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Ouch, but I respect it.
        </h1>
        <p className="mt-3 text-center text-sm sm:text-base text-white/80">
          Honesty noted. You'll need to pass another ridiculous test to escape, or hit replay to reconsider.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left text-sm text-white shadow-lg shadow-black/25">
            <p className="text-2xl">🛡️</p>
            <p className="mt-2 text-base font-semibold text-white">Defense: high</p>
            <p className="mt-1 text-sm text-white/70">The No button fought hard.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left text-sm text-white shadow-lg shadow-black/25">
            <p className="text-2xl">🧠</p>
            <p className="mt-2 text-base font-semibold text-white">Tests remain</p>
            <p className="mt-1 text-sm text-white/70">More riddles await if you insist.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left text-sm text-white shadow-lg shadow-black/25">
            <p className="text-2xl">💫</p>
            <p className="mt-2 text-base font-semibold text-white">Replay anytime</p>
            <p className="mt-1 text-sm text-white/70">A happier ending is one click away.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetAll}
            className="rounded-2xl border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white/90 shadow-lg shadow-black/25 transition hover:bg-white/20"
          >
            Replay
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={cardRef}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/15 via-white/10 to-white/5 p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-rose-200/30 blur-3xl opacity-50" />
          <div className="absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-pink-200/20 blur-3xl opacity-40" />
        </div>

        <div className="relative">
          <h1 className="text-balance text-center text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Do you want to be my Valentine? ❤️😍😘
          </h1>
          <p className="mt-4 text-center text-sm sm:text-base text-white/80">
            Think carefully before you answer…
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              ref={yesBtnRef}
              type="button"
              onClick={handleAccept}
              className="rounded-2xl bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 px-7 py-3 text-sm font-semibold text-rose-950 shadow-[0_14px_30px_rgba(251,113,133,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(251,113,133,0.45)] active:translate-y-0"
            >
              Yes
            </button>
          </div>

          <p className="mt-16 text-center text-xs text-white/70">
            Please don't try to click 'No'.
          </p>
        </div>
      </div>

      {!isNoTestOpen && (
        <button
          ref={noBtnRef}
          type="button"
          onMouseEnter={isFinalNo ? undefined : scheduleNoMove}
          onFocus={isFinalNo ? undefined : scheduleNoMove}
          onClick={isFinalNo ? openNoTest : scheduleNoMove}
          className="fixed z-50 rounded-2xl border border-rose-200/40 bg-rose-500/10 px-6 py-3 text-sm font-semibold text-rose-50 shadow-[0_12px_28px_rgba(244,63,94,0.25)] backdrop-blur transition-all duration-200 ease-out hover:border-rose-200/70 hover:bg-rose-500/20"
          style={{
            left: `${noPos.x}px`,
            top: `${noPos.y}px`,
            animation: isDodging ? `no-dodge ${NO_DODGE_DURATION_MS}ms ease-in-out` : undefined,
          }}
        >
          {noLabel}
        </button>
      )}

      {showHeartBreak && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center text-white">
            <div className="heart-break text-8xl sm:text-9xl" aria-hidden="true">💔</div>
            <p className="text-lg font-semibold text-rose-100">Not so fast!</p>
            <p className="text-sm text-white/70">...now you must face the impossible quiz.</p>
          </div>
        </div>
      )}

      {showHeartLove && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/65 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center text-white">
            <div className="heart-full text-8xl sm:text-9xl" aria-hidden="true">❤️</div>
            <p className="text-lg font-semibold text-amber-100">It's true love!</p>
            <p className="text-sm text-white/75">Time for some smoochin'</p>
          </div>
        </div>
      )}

      {isNoTestOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 px-4 py-10 sm:px-6 sm:py-12 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-rose-200/30 bg-gradient-to-br from-neutral-950/90 via-neutral-900/85 to-rose-950/70 p-6 sm:p-7 text-white shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="flex flex-col items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-100/80 sm:flex-row sm:gap-3">
              <span className="flex w-full min-h-[38px] items-center justify-center rounded-full border border-rose-200/40 bg-rose-500/15 px-4 py-2 text-center sm:w-auto sm:px-3 sm:py-1">
                You thought it would be that easy?
              </span>
              <span className="flex w-full min-h-[38px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-center sm:w-auto sm:px-3 sm:py-1">
                Prove you don't love me!
              </span>
            </div>

            <h2 className="mt-4 text-center text-3xl font-bold">Solve this quiz to answer no:</h2>
            <p className="mt-3 text-center text-sm text-white/75">
              Or you can change your mind and pick again (hint: pick "Yes") 😊
            </p>

            <form onSubmit={handleNoTestSubmit} className="mt-7 space-y-4">
              <label className="block text-sm text-white/85">
                {noTest?.prompt ?? "Loading your test..."}
              </label>
              <input
                ref={noTestInputRef}
                type="text"
                inputMode="numeric"
                value={noAnswer}
                onChange={(event) => setNoAnswer(event.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-rose-200/70 focus:bg-white/15"
                placeholder="Enter your answer"
                autoFocus
              />
              {noError ? <p className="text-xs text-rose-200">{noError}</p> : null}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 px-6 py-2.5 text-xs font-semibold text-rose-950 shadow-[0_12px_30px_rgba(251,113,133,0.45)] transition hover:-translate-y-0.5"
                >
                  Submit answer
                </button>
                <button
                  type="button"
                  onClick={handleNoTestReset}
                  className="rounded-2xl border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/15"
                >
                  New test
                </button>
                <button
                  type="button"
                  onClick={() => setIsNoTestOpen(false)}
                  className="rounded-2xl border border-white/10 bg-transparent px-5 py-2 text-xs font-semibold text-white/70 transition hover:text-white"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}



