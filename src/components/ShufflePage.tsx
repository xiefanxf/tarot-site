import { useState, useEffect, useCallback } from 'react';
import { Scissors, ArrowRight, RotateCcw, ChevronLeft } from 'lucide-react';
import Copyright from './Copyright';
import CardBackImg from './CardBackImg';

interface ShufflePageProps {
  onComplete: () => void;
  onBack: () => void;
}

interface DeckCard {
  id: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

export default function ShufflePage({ onComplete, onBack }: ShufflePageProps) {
  const [deckCards, setDeckCards] = useState<DeckCard[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    }))
  );
  const [phase, setPhase] = useState<'idle' | 'shuffling' | 'fanned' | 'transitioning'>('idle');
  const [message, setMessage] = useState('集中精神，默念你的问题');

  const shuffleDeck = useCallback(() => {
    if (phase !== 'idle' && phase !== 'fanned') return;
    setPhase('shuffling');
    setMessage('正在洗牌...');

    // Phase 1: gather
    setDeckCards(prev => prev.map(() => ({
      id: 0, offsetX: 0, offsetY: 0, rotation: 0,
    })));

    // Phase 2: vigorous shuffle (multiple beats)
    setTimeout(() => {
      setDeckCards(prev => prev.map((card) => ({
        ...card,
        offsetX: (Math.random() - 0.5) * 40,
        offsetY: (Math.random() - 0.5) * 30,
        rotation: (Math.random() - 0.5) * 20,
      })));
    }, 500);

    setTimeout(() => {
      setDeckCards(prev => prev.map((card) => ({
        ...card,
        offsetX: (Math.random() - 0.5) * 35,
        offsetY: (Math.random() - 0.5) * 25,
        rotation: (Math.random() - 0.5) * 18,
      })));
    }, 1200);

    // Phase 3: fan out
    setTimeout(() => {
      setDeckCards(prev => prev.map((card, i) => {
        const centerIndex = 3;
        const spread = (i - centerIndex) * 35;
        return {
          ...card,
          offsetX: spread,
          offsetY: -Math.abs(i - centerIndex) * 4,
          rotation: (i - centerIndex) * 3,
        };
      }));
      setPhase('fanned');
      setMessage('牌已洗好');
    }, 2000);
  }, [phase]);

  const cutDeck = useCallback(() => {
    if (phase !== 'idle' && phase !== 'fanned') return;
    setPhase('shuffling');
    setMessage('正在切牌...');

    // Phase 1: split into two piles
    setDeckCards(prev => prev.map((card, i) => ({
      ...card,
      offsetX: i < 3 ? -35 : 35,
      offsetY: i < 3 ? -8 : 8,
      rotation: i < 3 ? -6 : 6,
    })));

    // Phase 2: pause — let user see the two piles
    setTimeout(() => {
      setMessage('交换牌堆...');
      setDeckCards(prev => prev.map((card, i) => ({
        ...card,
        offsetX: i < 3 ? 35 : -35,
        offsetY: i < 3 ? 8 : -8,
        rotation: i < 3 ? 6 : -6,
      })));
    }, 1000);

    // Phase 3: fan out
    setTimeout(() => {
      setDeckCards(prev => prev.map((card, i) => {
        const centerIndex = 3;
        const spread = (i - centerIndex) * 35;
        return {
          ...card,
          offsetX: spread,
          offsetY: -Math.abs(i - centerIndex) * 4,
          rotation: (i - centerIndex) * 3,
        };
      }));
      setPhase('fanned');
      setMessage('切牌完成');
    }, 2200);
  }, [phase]);

  // Auto-fan on first load after a longer delay for contemplation
  useEffect(() => {
    const timer = setTimeout(() => {
      shuffleDeck();
    }, 2500);
    return () => clearTimeout(timer);
    // Run once on entry so the deck auto-fans after the initial pause.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProceed = () => {
    setPhase('transitioning');
    setMessage('');
    // Collapse cards then proceed
    setDeckCards(prev => prev.map(() => ({ id: 0, offsetX: 0, offsetY: 0, rotation: 0 })));
    setTimeout(onComplete, 500);
  };

  const title = phase === 'transitioning' ? '选择你的牌阵' : '洗牌与切牌';
  const subtitle = phase === 'transitioning' ? '选择一种牌阵来解读你的问题' : message;

  return (
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 overflow-y-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 flex items-center gap-1 text-sm text-[#98ACC8] hover:text-[#C8A97E] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>返回</span>
      </button>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl text-[#F0F0F0] mb-2" style={{ letterSpacing: '0.1em' }}>
          {title}
        </h2>
        <p className="text-[#98ACC8] font-body text-sm">{subtitle}</p>
      </div>

      {/* Card deck area */}
      <div className="relative w-80 h-64 flex items-center justify-center mb-8">
        {deckCards.map((card, index) => (
          <div
            key={card.id + '-' + index}
            className="absolute transition-all"
            style={{
              zIndex: index,
              transform: `translateX(${card.offsetX}px) translateY(${card.offsetY}px) rotateZ(${card.rotation}deg)`,
              transitionDuration: phase === 'shuffling' ? '700ms' : '600ms',
              transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <div
              className="w-24 h-36 rounded-lg overflow-hidden"
              style={{
                boxShadow: phase === 'fanned'
                  ? '0 6px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,169,126,0.3)'
                  : '0 4px 6px rgba(0,0,0,0.3)',
                border: '2px solid #C8A97E',
              }}
            >
              <CardBackImg className="w-full h-full object-cover" draggable={false} />
            </div>
          </div>
        ))}

        {/* Glow behind deck */}
        <div
          className="absolute w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(200, 169, 126, 0.4), transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {phase === 'fanned' && (
          <>
            <button onClick={shuffleDeck} className="btn-mystical flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>再洗一次</span>
            </button>
            <button onClick={cutDeck} className="btn-mystical flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              <span>切牌</span>
            </button>
            <button onClick={handleProceed} className="btn-mystical pulse-glow flex items-center gap-2">
              <span className="flex items-center gap-2">
                选择牌阵
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </>
        )}
      </div>

      {/* Copyright */}
      <div className="absolute bottom-2 left-0 right-0">
        <Copyright />
      </div>
    </div>
  );
}
