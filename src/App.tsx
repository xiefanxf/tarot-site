import { useState, useCallback, useRef, useEffect } from 'react';
import type { AppState, DrawnCard, SpreadType } from '@/types/tarot';
import ParticleBackground from '@/components/ParticleBackground';
import ThemeToggle from '@/components/ThemeToggle';
import SplashScreen from '@/components/SplashScreen';
import IntroPage from '@/components/IntroPage';
import QuestionPage from '@/components/QuestionPage';
import ShufflePage from '@/components/ShufflePage';
import SpreadSelectPage from '@/components/SpreadSelectPage';
import ReadingPage from '@/components/ReadingPage';
import RevealPage from '@/components/RevealPage';
import { drawCards } from '@/data/tarotCards';
import './App.css';

function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [overlay, setOverlay] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const pendingState = useRef<AppState | null>(null);

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

  const transitionTo = useCallback((next: AppState) => {
    pendingState.current = next;
    setOverlay(true);
    // 500ms covers mobile 300ms touch->click delay + buffer
    setTimeout(() => {
      if (pendingState.current) {
        setAppState(pendingState.current);
        pendingState.current = null;
      }
      // Keep overlay for extra 100ms after state change
      setTimeout(() => setOverlay(false), 100);
    }, 500);
  }, []);

  const handleStart = useCallback(() => {
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

  const handleSpreadSelect = useCallback((spread: SpreadType) => {
    setSelectedSpread(spread);
    const cards = drawCards(spread.positions.length);
    setDrawnCards(cards);
    transitionTo('reading');
  }, [transitionTo]);

  const handleReadingComplete = useCallback((cards: DrawnCard[]) => {
    setDrawnCards(cards);
    // Direct transition - no overlay delay for seamless reading->reveal flow
    setAppState('reveal');
  }, []);

  const handleReset = useCallback(() => {
    // Reset immediately - no transition overlay to avoid blank period
    setAppState('intro');
    setSelectedCategory('');
    setQuestion('');
    setSelectedSpread(null);
    setDrawnCards([]);
  }, []);

  const handleBackToShuffle = useCallback(() => {
    setSelectedSpread(null);
    transitionTo('shuffle');
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
      <ThemeToggle />

      {/* Main content */}
      <main className="relative z-10 w-full h-full flex flex-col">
        {/* Intro */}
        {splashDone && appState === 'intro' && (
          <IntroPage onStart={handleStart} />
        )}

        {/* Question */}
        {appState === 'question' && (
          <QuestionPage
            onConfirm={handleQuestionConfirm}
            onBack={handleBackToIntro}
          />
        )}

        {/* Shuffle */}
        {appState === 'shuffle' && (
          <ShufflePage onComplete={handleShuffleComplete} onBack={() => transitionTo('question')} />
        )}

        {/* Spread Select */}
        {appState === 'spreadSelect' && selectedSpread === null && (
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
            onBack={handleBackToShuffle}
          />
        )}

        {/* Reveal */}
        {appState === 'reveal' && selectedSpread && (
          <RevealPage
            drawnCards={drawnCards}
            spread={selectedSpread}
            category={selectedCategory}
            question={question}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Transition overlay - blocks ALL click/touch events between pages */}
      {overlay && (
        <div
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
