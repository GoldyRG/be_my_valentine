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

export default function ValentineCard() {
  const cardRef = useRef(null);
  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);
  const noMoveTimeoutRef = useRef(null);
  const noDodgeTimeoutRef = useRef(null);

  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 24, y: 24 });
  const [noTries, setNoTries] = useState(0);
  const [isDodging, setIsDodging] = useState(false);

  const NO_MOVE_DELAY_MS = 140;
  const NO_DODGE_DURATION_MS = 180;

  const noMessages = useMemo(
    () => [
      "No",
      "Are you sure?",
      "Try again 😅",
      "Really sure??",
      "You’re breaking my heart 💔",
      "Last chance…",
      "Okay you win… (press Yes)",
    ],
    []
  );

  const noLabel = noMessages[clamp(noTries, 0, noMessages.length - 1)];

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

  const scheduleNoMove = () => {
    if (noMoveTimeoutRef.current) {
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

  useLayoutEffect(() => {
    if (!accepted) {
      placeNoButtonNearYes();
    }
  }, [accepted, placeNoButtonNearYes]);

  useEffect(() => {
    return () => {
      if (noMoveTimeoutRef.current) {
        clearTimeout(noMoveTimeoutRef.current);
      }
      if (noDodgeTimeoutRef.current) {
        clearTimeout(noDodgeTimeoutRef.current);
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
        className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-gradient-to-br from-white/15 via-white/10 to-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/30 blur-3xl opacity-50" />
          <div className="absolute -bottom-28 right-6 h-64 w-64 rounded-full bg-pink-200/20 blur-3xl opacity-40" />
        </div>

        <h1 className="text-balance text-center text-4xl font-semibold tracking-tight text-white">
          Let’s gooo 💘
        </h1>
        <p className="mt-4 text-center text-white/80">
          You just made my day. Happy Valentine’s Day ❤️
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
            Date idea: dinner + dessert
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
            Bonus: movie night
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setAccepted(false);
            setNoTries(0);
            setIsDodging(false);
          }}
          className="mt-10 w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white/90 shadow-lg shadow-black/20 transition hover:bg-white/15"
        >
          Replay
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        ref={cardRef}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/15 via-white/10 to-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-rose-200/30 blur-3xl opacity-50" />
          <div className="absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-pink-200/20 blur-3xl opacity-40" />
        </div>

        <div className="relative">
          <h1 className="text-balance text-center text-4xl font-semibold tracking-tight text-white">
            Do you want to be my Valentine?
          </h1>
          <p className="mt-4 text-center text-white/80">
            Choose wisely… the “No” option is a little shy.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              ref={yesBtnRef}
              type="button"
              onClick={() => setAccepted(true)}
              className="rounded-2xl bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 px-7 py-3 text-sm font-semibold text-rose-950 shadow-[0_14px_30px_rgba(251,113,133,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(251,113,133,0.45)] active:translate-y-0"
            >
              Yes 💖
            </button>
          </div>

          <p className="mt-16 text-center text-xs text-white/70">
            Tip: try to click “No” 😄
          </p>
        </div>
      </div>

      <button
        ref={noBtnRef}
        type="button"
        onMouseEnter={scheduleNoMove}
        onFocus={scheduleNoMove}
        onClick={scheduleNoMove}
        className="fixed z-50 rounded-2xl border border-rose-200/40 bg-rose-500/10 px-6 py-3 text-sm font-semibold text-rose-50 shadow-[0_12px_28px_rgba(244,63,94,0.25)] backdrop-blur transition-all duration-200 ease-out hover:border-rose-200/70 hover:bg-rose-500/20"
        style={{
          left: `${noPos.x}px`,
          top: `${noPos.y}px`,
          animation: isDodging ? `no-dodge ${NO_DODGE_DURATION_MS}ms ease-in-out` : undefined,
        }}
      >
        {noLabel}
      </button>
    </>
  );
}
