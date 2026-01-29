import ValentineCard from "./components/ValentineCard.jsx";

const floatingHearts = [
  { left: "8%", top: "18%", size: 16, drift: -18, delay: "0s", duration: "9s", opacity: 0.45, color: "rgba(248, 113, 113, 0.45)" },
  { left: "20%", top: "70%", size: 22, drift: 22, delay: "2s", duration: "12s", opacity: 0.35, color: "rgba(251, 113, 133, 0.4)" },
  { left: "50%", top: "12%", size: 14, drift: -14, delay: "1s", duration: "9s", opacity: 0.5, color: "rgba(253, 164, 175, 0.45)" },
  { left: "78%", top: "22%", size: 20, drift: 16, delay: "3s", duration: "11s", opacity: 0.4, color: "rgba(244, 63, 94, 0.35)" },
  { left: "85%", top: "62%", size: 18, drift: -20, delay: "1.5s", duration: "10s", opacity: 0.45, color: "rgba(244, 114, 182, 0.35)" },
  { left: "60%", top: "78%", size: 24, drift: 26, delay: "2.5s", duration: "13s", opacity: 0.3, color: "rgba(251, 113, 133, 0.35)" },
  { left: "32%", top: "42%", size: 16, drift: -10, delay: "0.5s", duration: "8s", opacity: 0.5, color: "rgba(251, 113, 133, 0.45)" },
  { left: "12%", top: "48%", size: 12, drift: 12, delay: "1.2s", duration: "7s", opacity: 0.45, color: "rgba(252, 165, 165, 0.4)" },
  { left: "6%", top: "30%", size: 18, drift: -16, delay: "1.8s", duration: "11s", opacity: 0.4, color: "rgba(254, 202, 202, 0.45)" },
  { left: "28%", top: "12%", size: 14, drift: 18, delay: "0.8s", duration: "9s", opacity: 0.55, color: "rgba(249, 168, 212, 0.45)" },
  { left: "42%", top: "65%", size: 20, drift: -22, delay: "2.8s", duration: "12s", opacity: 0.35, color: "rgba(253, 186, 116, 0.4)" },
  { left: "58%", top: "35%", size: 15, drift: 14, delay: "0.6s", duration: "8s", opacity: 0.5, color: "rgba(252, 165, 165, 0.5)" },
  { left: "72%", top: "8%", size: 13, drift: -12, delay: "1.4s", duration: "10s", opacity: 0.45, color: "rgba(251, 113, 133, 0.45)" },
  { left: "90%", top: "45%", size: 21, drift: 24, delay: "2.2s", duration: "13s", opacity: 0.3, color: "rgba(254, 215, 170, 0.4)" },
];

export default function App() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-rose-800 via-pink-900 to-amber-900 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-rose-300/30 blur-[120px] opacity-70" />
        <div className="absolute bottom-0 right-0 h-[36rem] w-[36rem] rounded-full bg-pink-300/20 blur-[150px] opacity-60" />
        <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-amber-200/20 blur-[130px] opacity-55" />
        <div className="absolute top-10 right-16 h-72 w-72 rounded-full bg-amber-100/20 blur-[110px] opacity-50" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.22)_1px,transparent_0)] [background-size:28px_28px]" />

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
              "--heart-drift": `${heart.drift}px`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <ValentineCard />
      </main>

      <footer className="relative z-20 pb-4 text-center text-xs text-white/60">
        Built with love - GoldyRG
      </footer>
    </div>
  );
}







