import { useState, useEffect, useCallback, useRef } from 'react';
import { Scissors, ArrowRight, RotateCcw, ChevronLeft } from 'lucide-react';
import Copyright from './Copyright';
import CardBackImg from './CardBackImg';
import { useI18n } from '@/i18n';

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
  const { t } = useI18n();
  const [deckCards, setDeckCards] = useState<DeckCard[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    }))
  );
  const [phase, setPhase] = useState<'idle' | 'shuffling' | 'fanned' | 'transitioning'>('idle');
  const [messageKey, setMessageKey] = useState('focusQuestion');
  const timersRef = useRef<Set<number>>(new Set());
  const reduceMotionRef = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const fanStepRef = useRef(window.innerWidth < 360 ? 29 : 35);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, reduceMotionRef.current ? 0 : delay);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(timer => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const shuffleDeck = useCallback(() => {
    if (phase !== 'idle' && phase !== 'fanned') return;
    setPhase('shuffling');
    setMessageKey('shuffling');

    // Phase 1: gather
    setDeckCards(prev => prev.map(card => ({
      ...card, offsetX: 0, offsetY: 0, rotation: 0,
    })));

    // Phase 2: vigorous shuffle (multiple beats)
    schedule(() => {
      setDeckCards(prev => prev.map((card) => ({
        ...card,
        offsetX: (Math.random() - 0.5) * 40,
        offsetY: (Math.random() - 0.5) * 30,
        rotation: (Math.random() - 0.5) * 20,
      })));
    }, 500);

    schedule(() => {
      setDeckCards(prev => prev.map((card) => ({
        ...card,
        offsetX: (Math.random() - 0.5) * 35,
        offsetY: (Math.random() - 0.5) * 25,
        rotation: (Math.random() - 0.5) * 18,
      })));
    }, 1200);

    // Phase 3: fan out
    schedule(() => {
      setDeckCards(prev => prev.map((card, i) => {
        const centerIndex = 3;
        const spread = (i - centerIndex) * fanStepRef.current;
        return {
          ...card,
          offsetX: spread,
          offsetY: -Math.abs(i - centerIndex) * 4,
          rotation: (i - centerIndex) * 3,
        };
      }));
      setPhase('fanned');
      setMessageKey('cardsReady');
    }, 2000);
  }, [phase, schedule]);

  const cutDeck = useCallback(() => {
    if (phase !== 'idle' && phase !== 'fanned') return;
    setPhase('shuffling');
    setMessageKey('cutting');

    // Phase 1: split into two piles
    setDeckCards(prev => prev.map((card, i) => ({
      ...card,
      offsetX: i < 3 ? -35 : 35,
      offsetY: i < 3 ? -8 : 8,
      rotation: i < 3 ? -6 : 6,
    })));

    // Phase 2: pause — let user see the two piles
    schedule(() => {
      setMessageKey('swapping');
      setDeckCards(prev => prev.map((card, i) => ({
        ...card,
        offsetX: i < 3 ? 35 : -35,
        offsetY: i < 3 ? 8 : -8,
        rotation: i < 3 ? 6 : -6,
      })));
    }, 1000);

    // Phase 3: fan out
    schedule(() => {
      setDeckCards(prev => prev.map((card, i) => {
        const centerIndex = 3;
        const spread = (i - centerIndex) * fanStepRef.current;
        return {
          ...card,
          offsetX: spread,
          offsetY: -Math.abs(i - centerIndex) * 4,
          rotation: (i - centerIndex) * 3,
        };
      }));
      setPhase('fanned');
      setMessageKey('cutComplete');
    }, 2200);
  }, [phase, schedule]);

  // Auto-fan on first load after a longer delay for contemplation
  useEffect(() => {
    schedule(() => {
      shuffleDeck();
    }, 2500);
    return clearTimers;
    // Run once on entry so the deck auto-fans after the initial pause.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProceed = () => {
    clearTimers();
    setPhase('transitioning');
    setMessageKey('');
    // Collapse cards then proceed
    setDeckCards(prev => prev.map(card => ({ ...card, offsetX: 0, offsetY: 0, rotation: 0 })));
    schedule(onComplete, 500);
  };

  const handleBack = () => {
    clearTimers();
    onBack();
  };

  const title = phase === 'transitioning' ? t('chooseSpreadTitle') : t('shuffleTitle');
  const subtitle = phase === 'transitioning' ? t('chooseSpreadSubtitle') : (messageKey ? t(messageKey) : '');

  return (
    <div className="shuffle-page relative z-10 w-full h-full flex flex-col items-center px-4 overflow-y-auto">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="self-start flex items-center gap-1 text-sm text-[#98ACC8] hover:text-[#C8A97E] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{t('back')}</span>
      </button>

      {/* Title */}
      <div className="text-center mt-16 mb-4 md:mb-8">
        <h1 tabIndex={-1} className="page-heading font-display text-2xl md:text-3xl text-[#F0F0F0] mb-2" style={{ letterSpacing: '0.1em' }}>
          {title}
        </h1>
        <p className="text-[#98ACC8] font-body text-sm" role="status" aria-live="polite">{subtitle}</p>
      </div>

      {/* Card deck area */}
      <div className="shuffle-deck relative w-full max-w-80 h-64 flex flex-none items-center justify-center mb-4 md:mb-8">
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
              <span>{t('shuffleAgain')}</span>
            </button>
            <button onClick={cutDeck} className="btn-mystical flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              <span>{t('cutDeck')}</span>
            </button>
            <button onClick={handleProceed} className="btn-mystical pulse-glow flex items-center gap-2">
              <span className="flex items-center gap-2">
                {t('chooseSpread')}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </>
        )}
      </div>

      {/* Copyright */}
      <div className="mt-4">
        <Copyright />
      </div>
    </div>
  );
}
