import { lazy, Suspense, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { AppState, DrawnCard, SpreadType } from '@/types/tarot';
import ParticleBackground from '@/components/ParticleBackground';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SplashScreen from '@/components/SplashScreen';
import IntroPage from '@/components/IntroPage';
import QuestionPage from '@/components/QuestionPage';
import ShufflePage from '@/components/ShufflePage';
import SpreadSelectPage from '@/components/SpreadSelectPage';
import ReadingPage from '@/components/ReadingPage';
import { drawCards } from '@/data/tarotCards';
import { useI18n } from '@/i18n';
import { getLocalizedCards, getLocalizedSpreads } from '@/i18n/tarot';
import { useTarotData } from '@/data/userData';
import { successHaptic, tapHaptic } from '@/services/native';
import './App.css';

const RevealPage = lazy(() => import('@/components/RevealPage'));
const HistoryPage = lazy(() => import('@/components/HistoryPage'));
const DailyCardPage = lazy(() => import('@/components/DailyCardPage'));
const LibraryPage = lazy(() => import('@/components/LibraryPage'));
const PrivacyPage = lazy(() => import('@/components/PrivacyPage'));

function App() {
  const { language } = useI18n();
  const { createReading } = useTarotData();
  const localizedCards = useMemo(() => getLocalizedCards(language), [language]);
  const localizedSpreads = useMemo(() => getLocalizedSpreads(language), [language]);
  const [appState, setAppState] = useState<AppState>('intro');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [overlay, setOverlay] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark',
  );
  const [activeReadingId, setActiveReadingId] = useState<string | null>(null);
  const pendingState = useRef<AppState | null>(null);
  const transitionTimer = useRef<number | null>(null);
  const overlayTimer = useRef<number | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Detect current theme for splash screen
  useEffect(() => {
    const html = document.documentElement;
    const updateTheme = () => {
      setIsDarkTheme(html.getAttribute('data-theme') === 'dark');
    };
    updateTheme();
    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Keep an in-progress reading in sync when the user changes language.
  useEffect(() => {
    const cardsById = new Map(localizedCards.map(card => [card.id, card]));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawnCards(current => current.map(item => ({ ...item, card: cardsById.get(item.card.id) ?? item.card })));
    setSelectedSpread(current => current ? localizedSpreads.find(spread => spread.id === current.id) ?? current : null);
  // The localized collections are recreated from the selected language.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const clearTransitionTimers = useCallback(() => {
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }
    if (overlayTimer.current !== null) {
      window.clearTimeout(overlayTimer.current);
      overlayTimer.current = null;
    }
  }, []);

  useEffect(() => clearTransitionTimers, [clearTransitionTimers]);

  useEffect(() => {
    if (!splashDone && appState === 'intro') return;
    const frame = window.requestAnimationFrame(() => {
      mainRef.current?.querySelector<HTMLElement>('.page-heading')?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [appState, splashDone]);

  const transitionTo = useCallback((next: AppState) => {
    clearTransitionTimers();
    pendingState.current = next;
    setOverlay(true);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionDelay = reduceMotion ? 0 : 500;
    const overlayDelay = reduceMotion ? 0 : 100;
    // Keep the outgoing page inert while the visual transition completes.
    transitionTimer.current = window.setTimeout(() => {
      transitionTimer.current = null;
      if (pendingState.current) {
        setAppState(pendingState.current);
        pendingState.current = null;
      }
      // Keep overlay for extra 100ms after state change
      overlayTimer.current = window.setTimeout(() => {
        overlayTimer.current = null;
        setOverlay(false);
      }, overlayDelay);
    }, transitionDelay);
  }, [clearTransitionTimers]);

  const handleStart = useCallback(() => {
    void tapHaptic();
    transitionTo('question');
  }, [transitionTo]);

  const handleQuestionConfirm = useCallback((category: string, q: string) => {
    setSelectedCategory(category);
    setQuestion(q);
    transitionTo('shuffle');
  }, [transitionTo]);

  const handleShuffleComplete = useCallback(() => {
    transitionTo('spreadSelect');
  }, [transitionTo]);

  const handleSpreadSelect = useCallback((spreadId: string) => {
    const spread = localizedSpreads.find(item => item.id === spreadId);
    if (!spread) return;
    setSelectedSpread(spread);
    const cards = drawCards(spread.positions.length, localizedCards);
    setDrawnCards(cards);
    transitionTo('reading');
  }, [localizedCards, localizedSpreads, transitionTo]);

  const handleReadingComplete = useCallback((cards: DrawnCard[]) => {
    setDrawnCards(cards);
    if (selectedSpread) {
      const record = createReading({ category: selectedCategory, question, spreadId: selectedSpread.id, cards });
      setActiveReadingId(record.id);
    }
    void successHaptic();
    // Direct transition - no overlay delay for seamless reading->reveal flow
    setAppState('reveal');
  }, [createReading, question, selectedCategory, selectedSpread]);

  const handleReset = useCallback(() => {
    clearTransitionTimers();
    pendingState.current = null;
    setOverlay(false);
    // Reset immediately - no transition overlay to avoid blank period
    setAppState('intro');
    setSelectedCategory('');
    setQuestion('');
    setSelectedSpread(null);
    setDrawnCards([]);
    setActiveReadingId(null);
  }, [clearTransitionTimers]);

  const handleBackToShuffle = useCallback(() => {
    setSelectedSpread(null);
    transitionTo('shuffle');
  }, [transitionTo]);

  const handleBackToSpreadSelect = useCallback(() => {
    transitionTo('spreadSelect');
  }, [transitionTo]);

  const handleBackToIntro = useCallback(() => {
    transitionTo('intro');
  }, [transitionTo]);

  return (
    <div className="relative w-full h-full overflow-hidden noise-overlay">
      {/* Splash Screen - shown before intro */}
      {!splashDone && appState === 'intro' && (
        <SplashScreen
          isDark={isDarkTheme}
          onComplete={() => setSplashDone(true)}
        />
      )}

      <ParticleBackground />
      {(splashDone || appState !== 'intro') && (
        <div className={`top-controls ${appState === 'intro' ? 'top-controls-intro' : ''}`}>
          {appState === 'intro' && <LanguageSwitcher />}
          <ThemeToggle />
        </div>
      )}

      {/* Main content */}
      <main ref={mainRef} inert={overlay} aria-busy={overlay} className="app-main relative z-10 w-full h-full flex flex-col">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[#C8A97E] text-2xl animate-pulse">✦</div>}>
        {/* Intro */}
        {splashDone && appState === 'intro' && (
          <IntroPage
            onStart={handleStart}
            onOpenHistory={() => { void tapHaptic(); setAppState('history'); }}
            onOpenDaily={() => { void tapHaptic(); setAppState('daily'); }}
            onOpenLibrary={() => { void tapHaptic(); setAppState('library'); }}
            onOpenPrivacy={() => { void tapHaptic(); setAppState('privacy'); }}
          />
        )}

        {/* Question */}
        {appState === 'question' && (
          <QuestionPage
            initialCategory={selectedCategory}
            initialQuestion={question}
            onConfirm={handleQuestionConfirm}
            onBack={handleBackToIntro}
          />
        )}

        {/* Shuffle */}
        {appState === 'shuffle' && (
          <ShufflePage onComplete={handleShuffleComplete} onBack={() => transitionTo('question')} />
        )}

        {/* Spread Select */}
        {appState === 'spreadSelect' && (
          <SpreadSelectPage
            onSelectSpread={handleSpreadSelect}
            onBack={handleBackToShuffle}
          />
        )}

        {/* Reading */}
        {appState === 'reading' && selectedSpread && (
          <ReadingPage
            drawnCards={drawnCards}
            spread={selectedSpread}
            onComplete={handleReadingComplete}
            onReset={handleReset}
            onBack={handleBackToSpreadSelect}
          />
        )}

        {/* Reveal */}
        {appState === 'reveal' && selectedSpread && (
          <RevealPage
            drawnCards={drawnCards}
            spread={selectedSpread}
            category={selectedCategory}
            question={question}
            readingId={activeReadingId}
            onReset={handleReset}
          />
        )}

        {appState === 'history' && <HistoryPage onBack={handleReset} />}
        {appState === 'daily' && <DailyCardPage onBack={handleReset} />}
        {appState === 'library' && <LibraryPage onBack={handleReset} />}
        {appState === 'privacy' && <PrivacyPage onBack={handleReset} />}
        </Suspense>
      </main>

      {/* Transition overlay - blocks ALL click/touch events between pages */}
      {overlay && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[9999]"
          style={{
            touchAction: 'none',
            pointerEvents: 'all',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            background: 'transparent',
          }}
          onClick={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
          onTouchEnd={(e) => e.preventDefault()}
        />
      )}

    </div>
  );
}

export default App;
