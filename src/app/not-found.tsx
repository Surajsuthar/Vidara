export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-zinc-950 flex items-center justify-center overflow-hidden font-mono">
      {/* Noise grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Radial glow center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #f97316 0%, #ea580c 30%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Horizontal scan line */}
      <div
        className="absolute left-0 right-0 h-px bg-orange-500 opacity-30 pointer-events-none z-20"
        style={{
          top: "50%",
          boxShadow: "0 0 12px 2px #f97316",
          animation: "scan 6s ease-in-out infinite",
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-orange-500 opacity-60" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-orange-500 opacity-60" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-orange-500 opacity-60" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-orange-500 opacity-60" />

      {/* Main content */}
      <div className="relative z-30 flex flex-col items-center gap-6 px-6 text-center">
        {/* 404 glitch text */}
        <div className="relative select-none">
          <span
            className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent"
            style={{
              WebkitTextStroke: "2px #f97316",
              textShadow: "0 0 40px #f97316, 0 0 80px #ea580c44",
              animation: "flicker 4s step-end infinite",
            }}
          >
            404
          </span>
          {/* Glitch clone */}
          <span
            className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-orange-500 opacity-0"
            style={{
              animation: "glitch 4s step-end infinite",
              clipPath: "inset(30% 0 50% 0)",
            }}
          >
            404
          </span>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-orange-500 opacity-40" />
          <span className="text-orange-500 opacity-60 text-xs tracking-[0.3em] uppercase">
            error
          </span>
          <div className="flex-1 h-px bg-orange-500 opacity-40" />
        </div>

        {/* Message */}
        <p
          className="text-zinc-400 text-sm tracking-[0.2em] uppercase max-w-sm"
          style={{ animation: "fadeIn 1s ease forwards" }}
        >
          The page you&apos;re looking for
          <br />
          does not exist.
        </p>

        {/* CTA */}
        <a
          href="/"
          className="mt-4 px-8 py-3 text-xs tracking-[0.3em] uppercase text-zinc-950 bg-orange-500 hover:bg-orange-400 transition-colors duration-200 font-bold"
          style={{ boxShadow: "0 0 24px #f9731688" }}
        >
          Go Home
        </a>

        {/* Bottom status line */}
        <p className="text-zinc-700 text-[10px] tracking-widest uppercase mt-2">
          sys://not_found &nbsp;·&nbsp; req_id:{" "}
          {Math.random().toString(36).slice(2, 10).toUpperCase()}
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 20%; opacity: 0; }
          10% { opacity: 0.3; }
          50% { top: 80%; opacity: 0.15; }
          90% { opacity: 0.3; }
        }
        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.4; }
          97% { opacity: 1; }
          98% { opacity: 0.2; }
          99% { opacity: 1; }
        }
        @keyframes glitch {
          0%, 90%, 100% { opacity: 0; transform: translate(0); }
          91% { opacity: 0.8; transform: translate(-4px, 2px); clip-path: inset(20% 0 60% 0); }
          92% { opacity: 0; }
          93% { opacity: 0.6; transform: translate(4px, -2px); clip-path: inset(60% 0 10% 0); }
          94% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
