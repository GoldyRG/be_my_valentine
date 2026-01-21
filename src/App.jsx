import ValentineCard from "./components/ValentineCard.jsx";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-white/10 blur-3xl opacity-30" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.2)_1px,transparent_0)] [background-size:28px_28px]" />

      <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <ValentineCard />
      </main>

      <footer className="relative pb-8 text-center text-xs text-white/50">
        Built with love — GoldyRG
      </footer>
    </div>
  );
}
