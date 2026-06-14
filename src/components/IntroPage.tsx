import { useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import Copyright from './Copyright';
import CardBackImg from './CardBackImg';

interface IntroPageProps {
  onStart: () => void;
}

export default function IntroPage({ onStart }: IntroPageProps) {
  const handleStart = useCallback(() => {
    onStart();
  }, [onStart]);

  return (
    <div
      className="relative z-10 w-full h-full overflow-hidden select-none"
    >
      {/* Star mandala - large and prominent */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="spin-slow opacity-[0.22] w-[90vmin] h-[90vmin] max-w-[600px] max-h-[600px]">
          <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
            {/* Outer rings */}
            <circle cx="250" cy="250" r="220" stroke="#C8A97E" strokeWidth="0.3" />
            <circle cx="250" cy="250" r="200" stroke="#C8A97E" strokeWidth="0.5" />
            <circle cx="250" cy="250" r="180" stroke="#C8A97E" strokeWidth="0.3" strokeDasharray="4 8" />
            {/* 12-pointed star */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 250 + Math.cos(rad) * 70;
              const y1 = 250 + Math.sin(rad) * 70;
              const x2 = 250 + Math.cos(rad) * 210;
              const y2 = 250 + Math.sin(rad) * 210;
              return (
                <g key={angle}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8A97E" strokeWidth="0.4" />
                  <circle cx={x2} cy={y2} r="3" fill="#C8A97E" opacity="0.5" />
                </g>
              );
            })}
            {/* Inner hexagram */}
            {[0, 60, 120, 180, 240, 300].map((angle, i, arr) => {
              const rad1 = (angle * Math.PI) / 180;
              const rad2 = (arr[(i + 1) % arr.length] * Math.PI) / 180;
              const x1 = 250 + Math.cos(rad1) * 110;
              const y1 = 250 + Math.sin(rad1) * 110;
              const x2 = 250 + Math.cos(rad2) * 110;
              const y2 = 250 + Math.sin(rad2) * 110;
              return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8A97E" strokeWidth="0.7" />;
            })}
            {/* Inner square */}
            <rect x="160" y="160" width="180" height="180" rx="0" stroke="#C8A97E" strokeWidth="0.3" opacity="0.5" transform="rotate(45, 250, 250)" />
            {/* Center eye */}
            <ellipse cx="250" cy="250" rx="28" ry="17" stroke="#C8A97E" strokeWidth="0.8" fill="none" />
            <circle cx="250" cy="250" r="10" stroke="#C8A97E" strokeWidth="0.8" fill="none" />
            <circle cx="250" cy="250" r="4" fill="#C8A97E" opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* Corner ornaments */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-[#C8A97E]/20 pointer-events-none" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r border-t border-[#C8A97E]/20 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l border-b border-[#C8A97E]/20 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-[#C8A97E]/20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between text-center px-6 py-8">

        {/* Top decorative line */}
        <div className="flex items-center gap-4 pt-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C8A97E]/40" />
          <Sparkles className="w-4 h-4 text-[#C8A97E]/50" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C8A97E]/40" />
        </div>

        {/* Center content group */}
        <div className="flex flex-col items-center">
          {/* Tarot cards display */}
          <div className="mb-6 relative w-28 h-40">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-20 h-[120px] rounded-lg overflow-hidden border border-[#C8A97E]/30"
                style={{
                  left: `${i * 8}px`,
                  top: `${i * 6}px`,
                  zIndex: 3 - i,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  transform: `rotate(${(i - 1) * 4}deg)`,
                }}
              >
                <CardBackImg className="w-full h-full object-cover" draggable={false} loading="eager" />
              </div>
            ))}
            {/* Glow */}
            <div
              className="absolute -inset-4 rounded-full opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(200, 169, 126, 0.5), transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
          </div>

          {/* Main title */}
          <h1
            className="font-decorative text-4xl md:text-6xl text-[#F0F0F0] mb-2 text-glow"
            style={{ letterSpacing: '0.2em' }}
          >
            日月塔罗
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#C8A97E]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]/40" />
            <div className="w-8 h-px bg-[#C8A97E]/30" />
          </div>

          <p className="text-base md:text-lg text-[#98ACC8] font-body mb-3 leading-relaxed max-w-md">
            探寻潜意识的回响
          </p>
          <p className="text-sm text-[#6A7A96] font-body mb-8 leading-relaxed max-w-sm">
            集中精神，默念你的问题
            <br />
            让78张塔罗牌为你揭示答案
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStart}
            className="relative z-20 px-10 py-4 border border-[#C8A97E] bg-[#C8A97E]/10 text-[#C8A97E] font-display text-sm tracking-[0.2em] rounded-full transition-all duration-300 hover:bg-[#C8A97E]/25 hover:shadow-[0_0_40px_rgba(200,169,126,0.5),0_0_80px_rgba(200,169,126,0.15)] active:scale-95 active:shadow-[0_0_60px_rgba(200,169,126,0.6)] cursor-pointer pointer-events-auto"
          >
            <span className="flex items-center gap-3">
              <Sparkles className="w-4 h-4" />
              开始占卜
            </span>
          </button>

          {/* Bottom info */}
          <div className="flex items-center gap-2 mt-6">
            <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#C8A97E]/20" />
            <p className="text-[11px] text-[#4A5A72] font-body tracking-wider">
              78张塔罗牌 · 经典牌阵 · 深度解读
            </p>
            <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#C8A97E]/20" />
          </div>
        </div>

        {/* Bottom area */}
        <div className="flex flex-col items-center gap-2 pb-2">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#C8A97E]/20 to-transparent" />
          <Copyright />
        </div>
      </div>
    </div>
  );
}
