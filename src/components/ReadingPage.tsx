import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown, RotateCcw, ChevronLeft } from 'lucide-react';
import Copyright from './Copyright';
import type { DrawnCard, SpreadType } from '@/types/tarot';
import TarotCard from './TarotCard';

const cardBackUrl = `${import.meta.env.BASE_URL}card_back.jpg`;

interface ReadingPageProps {
  spread: SpreadType;
  drawnCards: DrawnCard[];
  onComplete: (cards: DrawnCard[]) => void;
  onReset: () => void;
  onBack: () => void;
}

export default function ReadingPage({ spread, drawnCards: initialCards, onComplete, onReset, onBack }: ReadingPageProps) {
  const [cards, setCards] = useState<DrawnCard[]>(initialCards);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDealing, setIsDealing] = useState(true);
  const [dealPhase, setDealPhase] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isSpread, setIsSpread] = useState(false);

  // Re-render on theme change to update label colors
  const [, setThemeTick] = useState(0);
  useEffect(() => {
    const observer = new MutationObserver(() => setThemeTick(v => v + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const totalCards = cards.length;
  const allRevealed = revealedCount >= totalCards;

  const selectedCard = selectedIndex !== null ? cards[selectedIndex] : null;
  const selectedPosition = selectedIndex !== null ? spread.positions[selectedIndex] : null;

  // Dealing animation - snappy rhythm
  useEffect(() => {
    if (!isDealing) return;
    const interval = setInterval(() => {
      setDealPhase(prev => {
        if (prev >= totalCards) {
          clearInterval(interval);
          setIsDealing(false);
          return prev;
        }
        return prev + 1;
      });
    }, 220);
    return () => clearInterval(interval);
  }, [isDealing, totalCards]);

  // Auto spread after dealing
  useEffect(() => {
    if (isDealing) return;
    if (spread.id !== 'celtic_cross') return;
    if (isSpread) return;
    const timer = setTimeout(() => setIsSpread(true), 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDealing]);

  const handleCardClick = useCallback((index: number) => {
    if (isDealing) return;
    const card = cards[index];
    if (!card || card.isRevealed) {
      setSelectedIndex(index);
      return;
    }
    const newCards = cards.map((c, i) => i === index ? { ...c, isRevealed: true } : c);
    setCards(newCards);
    setRevealedCount(prev => prev + 1);
    setSelectedIndex(index);
  }, [cards, isDealing]);

  // Desktop layout - standard Celtic Cross or simple horizontal
  const D_CARD_W = 88;
  const D_CARD_H = 132;
  const D_CENTER_X = 350;
  const D_CENTER_Y = 260;
  const renderDesktop = () => {
    if (spread.id === 'celtic_cross') {
      // Standard Celtic Cross layout for desktop
      // 0=present 1=challenge(cross) 2=foundation 3=past 4=crown 5=future 6=self 7=env 8=hopes 9=outcome
      const dX = [260, 320, 260, 140, 260, 380, 540, 540, 540, 540];
      const dY = [200, 200, 340, 200,  60, 200,  60, 200, 340, 460];
      // Random initial rotation for each card
      const dRot = [12, -18, 8, -10, 15, -6, 20, -14, 9, -22];
      return (
        <div className="hidden md:flex md:flex-1 md:flex-col md:items-center md:justify-center" onClick={stopPropagation}>
          <div className="relative" style={{ width: 700, height: 520 }}>
            {cards.map((drawnCard, index) => {
              const pos = spread.positions[index];
              if (!pos) return null;
              const isDealt = index < dealPhase;
              return (
                <motion.div
                  key={`desktop-${index}`}
                  className="absolute flex flex-col items-center"
                  style={{ width: D_CARD_W }}
                  initial={{ x: D_CENTER_X, y: D_CENTER_Y, opacity: 0, scale: 0.2, rotateZ: dRot[index] }}
                  animate={{
                    x: isDealt ? dX[index] : D_CENTER_X,
                    y: isDealt ? dY[index] : D_CENTER_Y,
                    opacity: isDealt ? 1 : 0,
                    scale: isDealt ? 1 : 0.2,
                    rotateZ: isDealt ? 0 : dRot[index],
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 14,
                    mass: 0.8,
                    delay: isDealt ? 0.05 + index * 0.07 : 0,
                  }}
                >
                  <div
                    className="cursor-pointer rounded-lg overflow-hidden flex-shrink-0"
                    style={{ width: D_CARD_W, height: D_CARD_H }}
                    onClick={(e) => { stopPropagation(e); handleCardClick(index); }}
                  >
                    <TarotCard
                      card={drawnCard.card}
                      isReversed={drawnCard.isReversed}
                      isRevealed={drawnCard.isRevealed}
                      size="sm"
                    />
                  </div>
                  <motion.div
                    className="mt-1 text-xs font-bold font-display text-center whitespace-nowrap"
                    style={{ color: '#C8A97E' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isDealt ? 1 : 0 }}
                    transition={{ delay: isDealt ? 0.4 + index * 0.1 : 0 }}
                  >
                    {pos.label}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }
    // Simple spreads: single, three_card
    return (
      <div className="hidden md:flex md:flex-1 md:flex-col md:items-center md:justify-center" onClick={stopPropagation}>
        <div className="flex items-center justify-center gap-8">
          {cards.map((drawnCard, index) => {
            const pos = spread.positions[index];
            if (!pos) return null;
            const isDealt = index < dealPhase;
            return (
              <motion.div
                key={`desktop-${index}`}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 60, scale: 0.5 }}
                animate={{ opacity: isDealt ? 1 : 0, y: isDealt ? 0 : 60, scale: isDealt ? 1 : 0.5 }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, delay: index * 0.12 }}
              >
                <div className="cursor-pointer rounded-lg overflow-hidden" style={{ width: 120, height: 180 }}>
                  <TarotCard
                    card={drawnCard.card}
                    isReversed={drawnCard.isReversed}
                    isRevealed={drawnCard.isRevealed}
                    size="md"
                    onClick={() => handleCardClick(index)}
                  />
                </div>
                <div className="mt-2 text-sm font-bold font-display text-center" style={{ color: '#C8A97E' }}>
                  {pos.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Mobile Celtic Cross - compact centered layout
  // Scaled down cards with proper spacing for labels
  const CW = 56;
  const CH = 84;
  const LABEL_H = 14; // label height
  const GAP_X = 14;   // 水平间距增大
  const GAP_Y = 8;
  // Row step = card height + label height + vertical gap
  const ROW_STEP = CH + LABEL_H + GAP_Y;
  // 4-column grid, 5 rows for right column
  const COL = [0, CW + GAP_X, 2*(CW+GAP_X), 3*(CW+GAP_X)];
  const ROW = [0, ROW_STEP, 2*ROW_STEP, 3*ROW_STEP, 4*ROW_STEP];
  // Container: width fits 4 cols, height fits 5 rows
  const CC_W = COL[3] + CW;
  const CC_H = ROW[4] + CH + LABEL_H;
  // Deck center (fly-from position)
  const M_CENTER_X = CC_W / 2 - CW / 2;
  const M_CENTER_Y = CC_H / 2 - CH / 2;
  const renderMobileCelticCross = () => {
    // Celtic Cross 10-card positions in 4-col grid
    // 0=现状 1=挑战 2=过去 3=目标 4=根基 5=未来 6=自我 7=环境 8=希望 9=结果
    // Layout:
    //   [3-目标]              [6-自我]
    // [2-过去][0-现状][1-挑战][5-未来]
    //   [4-根基]              [7-环境]
    //                         [8-希望]
    //                         [9-结果]
    const cardX = [COL[1], COL[2], COL[0], COL[1], COL[1], COL[3], COL[3], COL[3], COL[3], COL[3]];
    const cardY = [ROW[1], ROW[1], ROW[1], ROW[0], ROW[2], ROW[1], ROW[0], ROW[2], ROW[3], ROW[4]];
    const mRot = [15, -20, 10, -12, 18, -8, 22, -16, 11, -25];

    return (
      <div className="flex md:hidden justify-center w-full" style={{ overflow: 'visible' }}>
        <div className="relative" style={{ width: CC_W, height: CC_H }}>
          {cards.map((drawnCard, index) => {
            const pos = spread.positions[index];
            if (!pos) return null;
            const isDealt = index < dealPhase;
            const isSelected = selectedIndex === index;

            const tx = isDealt ? cardX[index] : M_CENTER_X;
            const ty = isDealt ? cardY[index] : M_CENTER_Y;

            return (
              <motion.div
                key={`cc-${index}`}
                className="absolute flex flex-col items-center"
                style={{
                  zIndex: isSelected ? 50 : (pos.isCross ? 35 : index),
                  width: CW,
                }}
                initial={{ x: M_CENTER_X, y: M_CENTER_Y, opacity: 0, scale: 0.2, rotateZ: mRot[index] }}
                animate={{
                  x: tx,
                  y: ty,
                  opacity: isDealt ? 1 : 0,
                  scale: isDealt ? 1 : 0.2,
                  rotateZ: isDealt ? 0 : mRot[index],
                }}
                transition={{
                  type: 'spring',
                  stiffness: 130,
                  damping: 14,
                  mass: 0.8,
                  delay: isDealt ? 0.03 + index * 0.07 : 0,
                }}
              >
                <div
                  className="cursor-pointer rounded-lg overflow-hidden flex-shrink-0"
                  style={{ width: CW, height: CH }}
                  onClick={(e) => { stopPropagation(e); handleCardClick(index); }}
                >
                  <TarotCard
                    card={drawnCard.card}
                    isReversed={drawnCard.isReversed}
                    isRevealed={drawnCard.isRevealed}
                    size="sm"
                    disabled={isDealing || (allRevealed && !drawnCard.isReversed)}
                    style={{
                      transform: 'scale(0.636)',
                      transformOrigin: 'top left',
                    }}
                  />
                </div>
                <motion.div
                  className="text-center whitespace-nowrap text-[10px] font-bold font-display pointer-events-none"
                  style={{ color: 'var(--text-primary)', height: LABEL_H, lineHeight: `${LABEL_H}px` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isDealt ? 1 : 0 }}
                  transition={{ delay: isDealt ? 0.3 + index * 0.08 : 0 }}
                >
                  {pos.label}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Click on empty area to go to interpretation when all cards revealed
  const handleBackgroundClick = useCallback(() => {
    if (allRevealed) {
      onComplete(cards);
    }
  }, [allRevealed, cards, onComplete]);

  // Stop propagation on card clicks to avoid triggering background click
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 pt-4 pb-48 overflow-y-auto relative"
      onClick={handleBackgroundClick}
    >
      {/* Back button */}
      <button
        onClick={(e) => { e.stopPropagation(); onBack(); }}
        className="self-start flex items-center gap-1 text-sm text-[#98ACC8] hover:text-[#C8A97E] transition-colors mb-2"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>返回牌阵</span>
      </button>

      {/* Header */}
      <div className="text-center mb-4" onClick={stopPropagation}>
        <h2 className="font-display text-xl md:text-2xl" style={{ color: 'var(--text-primary)', letterSpacing: '0.1em' }}>
          {spread.name}
        </h2>
        <p className="text-xs font-body mt-1" style={{ color: 'var(--text-secondary)' }}>
          {isDealing ? `正在发牌... ${Math.min(dealPhase, totalCards)}/${totalCards}` : allRevealed ? '所有牌已翻开 · 点击解读' : `已翻开 ${revealedCount}/${totalCards} 张牌`}
        </p>
      </div>



      {/* Card layout - Celtic Cross: natural height, Simple: flex-1 centered */}
      {spread.id === 'celtic_cross' ? (
        <>
          {renderMobileCelticCross()}
          {renderDesktop()}
        </>
      ) : (
        <>
          <div className="flex md:hidden flex-1 flex-col justify-center items-center w-full my-4">
            <div className="flex items-center justify-center gap-4">
              {cards.map((drawnCard, index) => {
                const pos = spread.positions[index];
                if (!pos) return null;
                const isDealt = index < dealPhase;
                // Different drop rotation for each card
                const dropRot = [-15, 10, -8][index] || 0;
                return (
                  <motion.div
                    key={`simple-${index}`}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: -120, scale: 0.4, rotateZ: dropRot * 2 }}
                    animate={{
                      opacity: isDealt ? 1 : 0,
                      y: isDealt ? 0 : -120,
                      scale: isDealt ? 1 : 0.4,
                      rotateZ: isDealt ? 0 : dropRot * 2,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 140,
                      damping: 12,
                      mass: 0.9,
                      delay: index * 0.12,
                    }}
                  >
                    <div className="cursor-pointer" onClick={(e) => { stopPropagation(e); handleCardClick(index); }}>
                      <div className="rounded-lg overflow-hidden" style={{ width: 88, height: 132 }}>
                        <TarotCard
                          card={drawnCard.card}
                          isReversed={drawnCard.isReversed}
                          isRevealed={drawnCard.isRevealed}
                          size="sm"
                          disabled={isDealing || (allRevealed && !drawnCard.isRevealed)}
                        />
                      </div>
                    </div>
                    <motion.div
                      className="mt-1 text-[11px] font-bold font-display text-center"
                      style={{ color: 'var(--text-primary)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isDealt ? 1 : 0 }}
                      transition={{ delay: 0.3 + index * 0.12 }}
                    >
                      {pos.label}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          {renderDesktop()}
        </>
      )}

      {/* Card detail - fixed bottom panel above buttons */}
      {selectedCard && selectedPosition && (
        <motion.div
          className="fixed bottom-[72px] left-0 right-0 z-40 px-3"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={stopPropagation}
        >
          <div
            className="max-w-lg mx-auto rounded-lg p-3 relative shadow-lg"
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-1.5 right-2 text-[var(--text-dim)] hover:text-[#C8A97E] transition-colors text-lg leading-none z-10"
            >
              &times;
            </button>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-18 rounded-lg overflow-hidden">
                <img
                  src={selectedCard.card.image || cardBackUrl}
                  alt={selectedCard.card.name}
                  className="w-full h-full object-cover"
                  style={{ transform: selectedCard.isReversed ? 'scale(1.08) rotate(180deg)' : 'scale(1.08)' }}
                />
              </div>
              <div className="flex-1 min-w-0 pr-5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-display" style={{ background: 'var(--bg-card)', color: '#C8A97E' }}>
                    {selectedPosition.label}
                  </span>
                  {selectedCard.isReversed && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-body" style={{ background: 'rgba(180,80,80,0.2)', color: '#D4A0A0' }}>
                      逆位
                    </span>
                  )}
                </div>
                <h3 className="font-display text-base mb-0.5" style={{ color: 'var(--text-primary)' }}>
                  {selectedCard.card.name}
                </h3>
                <div className="flex flex-wrap gap-1 mb-1">
                  {(selectedCard.isReversed
                    ? selectedCard.card.reversedKeywords
                    : selectedCard.card.uprightKeywords
                  ).slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-body" style={{ background: 'rgba(200,169,126,0.1)', color: '#C8A97E' }}>
                      {kw}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-body leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                  {selectedCard.isReversed
                    ? selectedCard.card.reversedDescription
                    : selectedCard.card.uprightDescription
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Copyright - hidden on mobile when buttons are fixed */}
      <div className="hidden md:block">
        <Copyright />
      </div>

      {/* Bottom buttons - FIXED at screen bottom */}
      <div className="fixed bottom-4 left-0 right-0 z-30 flex justify-center gap-4 px-4" onClick={stopPropagation}>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-display transition-all active:scale-95"
          style={{
            border: '1.5px solid #C8A97E',
            color: '#C8A97E',
            background: 'rgba(200, 169, 126, 0.08)',
          }}
        >
          <RotateCcw className="w-4 h-4" />
          重新开始
        </button>
        {!allRevealed && !isDealing && (
          <button
            onClick={() => {
              const newCards = cards.map(c => ({ ...c, isRevealed: true }));
              setCards(newCards);
              setRevealedCount(cards.length);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-display transition-all active:scale-95"
            style={{
              border: '1.5px solid #C8A97E',
              color: '#C8A97E',
              background: 'rgba(200, 169, 126, 0.08)',
            }}
          >
            <ArrowDown className="w-4 h-4" />
            全部翻开
          </button>
        )}
        {allRevealed && (
          <button
            onClick={() => onComplete(cards)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-display"
            style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            <Sparkles className="w-4 h-4" />
            查看完整解读
          </button>
        )}
      </div>
    </div>
  );
}
