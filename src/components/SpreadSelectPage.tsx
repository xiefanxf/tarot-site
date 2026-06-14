import { useState } from 'react';
import Copyright from './Copyright';
import CardBackImg from './CardBackImg';
import { spreads } from '@/data/tarotCards';
import type { SpreadType } from '@/types/tarot';

interface SpreadSelectPageProps {
  onSelectSpread: (spread: SpreadType) => void;
  onBack: () => void;
}

function SpreadMiniVisual({ spread, isSelected }: { spread: SpreadType; isSelected: boolean }) {
  // Celtic Cross: compact layout with NO overlapping cards. Card: 24x36, container: full x 160
  const isCeltic = spread.id === 'celtic_cross';
  // Layout: each card has a unique position, no overlap
  // All cards at unique positions, NO overlap. Card: 24x36. Container: full x 180.
  // 0=现状 1=挑战 2=根基 3=过去 4=目标 5=未来 6=自我 7=环境 8=希望 9=结果
  // Celtic Cross classic layout: center cross overlapping + right column
  const ccX = isCeltic ? [48, 54, 48, 22, 48, 66, 78, 78, 78, 78] : [];
  const ccY = isCeltic ? [38, 32, 62, 38, 14, 38, 14, 38, 62, 86] : [];

  return (
    <div className="relative w-full h-44 my-1">
      {/* Glow behind formation */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-500"
        style={{
          background: isSelected ? 'radial-gradient(circle at 50% 50%, rgba(200,169,126,0.08), transparent 70%)' : 'none',
        }}
      />

      {spread.positions.map((pos, i) => {
        const x = isCeltic ? ccX[i] : pos.x;
        const y = isCeltic ? ccY[i] : pos.y;
        const w = isCeltic ? 24 : 40;
        const h = isCeltic ? 36 : 60;
        return (
          <div
            key={pos.index}
            className="absolute transition-all duration-500"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              width: `${w}px`,
              height: `${h}px`,
            }}
          >
            {/* Mini card with label */}
            <div
              className={`relative w-full h-full rounded-sm overflow-hidden transition-all duration-500 ${isSelected ? 'shadow-[0_0_6px_rgba(200,169,126,0.4)]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.3)]'}`}
              style={{ border: '1.5px solid #C8A97E' }}
            >
              <CardBackImg className="w-full h-full object-cover" draggable={false} />
              {/* Label overlay inside card bottom */}
              <span
                className="absolute bottom-0 left-0 right-0 text-center whitespace-nowrap text-[6px] font-display py-[1px] rounded-b-sm"
                style={{
                  background: 'rgba(245, 240, 232, 0.85)',
                  color: '#000000',
                }}
              >
                {pos.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Connection lines */}
      {spread.positions.length > 1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {isCeltic ? (
            <>
              {/* Center cross horizontal: past(22,38) -> present(48,38) -> future(74,38) */}
              <line x1="22%" y1="38%" x2="66%" y2="38%" stroke={isSelected ? 'rgba(200,169,126,0.25)' : 'rgba(42,53,70,0.4)'} strokeWidth="0.8" strokeDasharray="2 3" />
              {/* Center cross vertical: goal(48,14) -> foundation(48,62) */}
              <line x1="48%" y1="14%" x2="48%" y2="62%" stroke={isSelected ? 'rgba(200,169,126,0.25)' : 'rgba(42,53,70,0.4)'} strokeWidth="0.8" strokeDasharray="2 3" />
              {/* Right column: self(78,14) -> result(78,86) */}
              <line x1="78%" y1="14%" x2="78%" y2="86%" stroke={isSelected ? 'rgba(200,169,126,0.2)' : 'rgba(42,53,70,0.3)'} strokeWidth="0.8" strokeDasharray="2 3" />
            </>
          ) : (
            spread.positions.slice(0, -1).map((pos, i) => {
              const next = spread.positions[i + 1];
              return (
                <line
                  key={i}
                  x1={`${pos.x}%`}
                  y1={`${pos.y}%`}
                  x2={`${next.x}%`}
                  y2={`${next.y}%`}
                  stroke={isSelected ? 'rgba(200,169,126,0.3)' : 'rgba(42,53,70,0.4)'}
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                />
              );
            })
          )}
        </svg>
      )}
    </div>
  );
}

export default function SpreadSelectPage({ onSelectSpread, onBack }: SpreadSelectPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (spread: SpreadType) => {
    setSelectedId(spread.id);
    setIsTransitioning(true);
    setTimeout(() => {
      onSelectSpread(spread);
    }, 800);
  };

  return (
    <div className="relative z-10 w-full h-full flex flex-col items-center px-4 md:px-8 pt-16 pb-8 overflow-y-auto">
      {/* Back button - normal flow */}
      <div className="w-full max-w-4xl mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#98ACC8] hover:text-[#C8A97E] transition-colors text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="font-body">返回洗牌</span>
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl text-[#F0F0F0] mb-2" style={{ letterSpacing: '0.1em' }}>
          选择你的牌阵
        </h2>
        <p className="text-[#98ACC8] font-body text-sm">
          不同的牌阵揭示不同层次的答案
        </p>
      </div>

      {/* Spread cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl">
        {spreads.map((spread) => {
          const isSelected = selectedId === spread.id;
          const isOtherSelected = selectedId !== null && !isSelected;

          return (
            <button
              key={spread.id}
              onClick={() => !isTransitioning && handleSelect(spread)}
              className={`
                spread-card text-left transition-all duration-500
                ${isSelected ? 'scale-105 border-[#C8A97E]' : ''}
                ${isOtherSelected ? 'opacity-30 scale-95' : ''}
              `}
            >
              {/* Card count badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-display text-[#8BA6C4] tracking-wider">
                  {spread.positions.length} 张牌
                </span>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#C8A97E] shadow-[0_0_8px_rgba(200,169,126,0.6)]" />
                )}
              </div>

              {/* Spread name */}
              <h3 className="font-display text-lg text-[#F0F0F0] mb-1" style={{ letterSpacing: '0.05em' }}>
                {spread.name}
              </h3>
              <p className="text-[10px] font-display text-[#98ACC8] mb-3 tracking-wider">
                {spread.nameEn}
              </p>

              {/* Mini visual */}
              <SpreadMiniVisual spread={spread} isSelected={isSelected} />

              {/* Description */}
              <p className="text-xs text-[#98ACC8] font-body leading-relaxed">
                {spread.description}
              </p>

              {/* Position labels */}
              <div className="mt-3 flex flex-wrap gap-1">
                {spread.positions.slice(0, 4).map((pos) => (
                  <span
                    key={pos.index}
                    className="text-[9px] px-2 py-0.5 rounded-full bg-[#0D1B2E] text-[#8BA6C4] font-body"
                  >
                    {pos.label}
                  </span>
                ))}
                {spread.positions.length > 4 && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#0D1B2E] text-[#8BA6C4] font-body">
                    +{spread.positions.length - 4}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hint */}
      <p className="mt-6 text-xs text-[#8BA6C4] font-body">
        点击选择牌阵，开始发牌
      </p>

      {/* Copyright */}
      <Copyright />
    </div>
  );
}
