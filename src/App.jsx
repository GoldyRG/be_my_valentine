import ValentineCard from "./components/ValentineCard.jsx";

const floatingHearts = [
  { left: "8%", top: "18%", size: 16, delay: "0s", duration: "9s", opacity: 0.45, color: "rgba(248, 113, 113, 0.45)" },
  { left: "20%", top: "70%", size: 22, delay: "2s", duration: "12s", opacity: 0.35, color: "rgba(251, 113, 133, 0.4)" },
  { left: "50%", top: "12%", size: 14, delay: "1s", duration: "9s", opacity: 0.5, color: "rgba(253, 164, 175, 0.45)" },
  { left: "78%", top: "22%", size: 20, delay: "3s", duration: "11s", opacity: 0.4, color: "rgba(244, 63, 94, 0.35)" },
  { left: "85%", top: "62%", size: 18, delay: "1.5s", duration: "10s", opacity: 0.45, color: "rgba(244, 114, 182, 0.35)" },
  { left: "60%", top: "78%", size: 24, delay: "2.5s", duration: "13s", opacity: 0.3, color: "rgba(251, 113, 133, 0.35)" },
  { left: "32%", top: "42%", size: 16, delay: "0.5s", duration: "8s", opacity: 0.5, color: "rgba(251, 113, 133, 0.45)" },
  { left: "12%", top: "48%", size: 12, delay: "1.2s", duration: "7s", opacity: 0.45, color: "rgba(252, 165, 165, 0.4)" },
];

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-950 via-slate-950 to-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-rose-300/20 blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-0 h-[34rem] w-[34rem] rounded-full bg-pink-300/10 blur-[140px] opacity-50" />
        <div className="absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-amber-200/10 blur-[120px] opacity-40" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.18)_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {floatingHearts.map((heart, index) => (
          <span
            key={`heart-${index}`}
            className="floating-heart"
            style={{
              left: heart.left,
              top: heart.top,
              opacity: heart.opacity,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
              "--heart-size": `${heart.size}px`,
              "--heart-color": heart.color,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <ValentineCard />
      </main>

      <footer className="relative z-10 pb-8 text-center text-xs text-white/60">
        Built with love — GoldyRG
      </footer>
    </div>
  );
}
