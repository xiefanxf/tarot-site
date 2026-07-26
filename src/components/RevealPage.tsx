import { useMemo, useState } from 'react';
import { Heart, Moon, RotateCcw, Share2, Sparkles, Star, Sun } from 'lucide-react';
import Copyright from './Copyright';
import type { DrawnCard, SpreadType } from '@/types/tarot';
import { useI18n } from '@/i18n';
import { useTarotData } from '@/data/userData';
import { synthesizeReading } from '@/services/readingEngine';
import { shareReadingCard } from '@/services/shareCard';
import { successHaptic, tapHaptic } from '@/services/native';

interface RevealPageProps {
  drawnCards: DrawnCard[];
  spread: SpreadType;
  category: string;
  question: string;
  readingId: string | null;
  onReset: () => void;
}

const cardBackUrl = `${import.meta.env.BASE_URL}card_back.jpg`;

export default function RevealPage({ drawnCards, spread, category, question, readingId, onReset }: RevealPageProps) {
  const { language, t } = useI18n();
  const { data, updateJournal, toggleFavorite } = useTarotData();
  const [sharing, setSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const categoryLabels: Record<string, string> = { love: t('categoryLove'), career: t('categoryCareer'), wealth: t('categoryWealth'), health: t('categoryHealth'), general: t('categoryGeneral') };
  const categoryLabel = categoryLabels[category] || t('general');
  const synthesis = useMemo(() => synthesizeReading(drawnCards, spread, category, question, language), [drawnCards, spread, category, question, language]);
  const reversedCount = drawnCards.filter(card => card.isReversed).length;
  const majorCount = drawnCards.filter(card => card.card.arcana === 'major').length;
  const reading = data.readings.find(item => item.id === readingId);

  const handleShare = async () => {
    if (!drawnCards.length || sharing) return;
    void tapHaptic('medium');
    setSharing(true);
    setShareStatus('');
    try {
      const result = await shareReadingCard({
        appName: t('appName'),
        title: t('fullReadingTitle'),
        subtitle: `${categoryLabel} · ${spread.name}`,
        question,
        labels: {
          overall: t('overallInsight'),
          details: t('cardDetails'),
          patterns: t('readingPatterns'),
          guidance: t('guidance'),
          keywords: t('keywords'),
        },
        cards: drawnCards.map((drawn, index) => ({
          name: drawn.card.name,
          secondaryName: drawn.card.nameEn,
          image: drawn.card.image,
          position: spread.positions[index]?.label || t('cardNumber', { count: index + 1 }),
          positionDescription: spread.positions[index]?.description,
          keywords: (drawn.isReversed ? drawn.card.reversedKeywords : drawn.card.uprightKeywords).slice(0, 4),
          description: drawn.isReversed ? drawn.card.reversedDescription : drawn.card.uprightDescription,
          reversedLabel: drawn.isReversed ? t('reversed') : undefined,
        })),
        summary: synthesis.summary,
        patterns: synthesis.patterns,
        guidance: synthesis.guidance,
        footer: t('blessing'),
        fileName: t('reportFile'),
      });
      if (result === 'cancelled') return;
      void successHaptic();
      setShareStatus(t(result === 'shared' ? 'shareSuccess' : 'shareDownloaded'));
    } catch {
      setShareStatus(t('shareFailed'));
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="relative z-10 w-full h-full overflow-y-auto px-4 pt-32 md:pt-24 pb-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-7">
          <div className="flex items-center justify-center gap-2 mb-3"><Sparkles className="w-5 h-5 text-[#C8A97E]" /><h1 tabIndex={-1} className="page-heading font-display text-2xl md:text-3xl text-[#F0F0F0] tracking-wider">{t('fullReadingTitle')}</h1><Sparkles className="w-5 h-5 text-[#C8A97E]" /></div>
          <p className="text-xs text-[#98ACC8] font-body">{categoryLabel} · {spread.name}</p>
          {question && <p className="text-xs text-[#8BA6C4] font-body mt-1 italic">「{question}」</p>}
        </header>

        <div className="flex justify-center gap-5 mb-7">
          <div className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-[#C8A97E]" /><span className="text-xs text-[#98ACC8]">{t('majorArcanaCount', { count: majorCount })}</span></div>
          <div className="flex items-center gap-1.5"><Moon className="w-4 h-4 text-[#98ACC8]" /><span className="text-xs text-[#98ACC8]">{t('minorArcanaCount', { count: drawnCards.length - majorCount })}</span></div>
          <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#D4A0A0]" /><span className="text-xs text-[#98ACC8]">{t('reversedCount', { count: reversedCount })}</span></div>
        </div>

        <section className="feature-panel mb-5">
          <h3 className="font-display text-sm text-[#C8A97E] mb-3 tracking-wider">{t('overallInsight')}</h3>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">{synthesis.summary}</p>
        </section>

        {synthesis.patterns.length > 0 && <section className="feature-panel mb-5"><h3 className="font-display text-sm text-[#C8A97E] mb-3 tracking-wider">{t('readingPatterns')}</h3><div className="space-y-2">{synthesis.patterns.map((pattern, index) => <p key={index} className="text-sm text-[var(--text-primary)] leading-relaxed"><span className="text-[#C8A97E] mr-2">✦</span>{pattern}</p>)}</div></section>}

        <div className="space-y-4 mb-6">
          {drawnCards.map((drawn, index) => {
            const position = spread.positions[index];
            const favorite = data.favorites.includes(drawn.card.id);
            return (
              <article key={`${drawn.card.id}-${index}`} className="feature-panel">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-[#0A1628]"><img src={drawn.card.image || cardBackUrl} alt={drawn.card.name} className="w-full h-full object-contain" style={{ transform: drawn.isReversed ? 'rotate(180deg)' : undefined }} onError={event => { event.currentTarget.src = cardBackUrl; }} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A2536] text-[#C8A97E]">{position?.label || t('cardNumber', { count: index + 1 })}</span>{drawn.isReversed && <span className="reversed-chip">{t('reversed')}</span>}<button className={`icon-action ml-auto ${favorite ? 'active' : ''}`} aria-label={favorite ? t('unfavorite') : t('favorite')} onClick={() => { void tapHaptic(); toggleFavorite(drawn.card.id); }}><Heart className="w-4 h-4" fill={favorite ? 'currentColor' : 'none'} /></button></div>
                    <h4 className="font-display text-base text-[var(--text-primary)]">{drawn.card.name}</h4><p className="text-[9px] text-[#8BA6C4] mb-2">{drawn.card.nameEn}</p>
                    <div className="keyword-row justify-start my-2">{(drawn.isReversed ? drawn.card.reversedKeywords : drawn.card.uprightKeywords).slice(0, 4).map(keyword => <span key={keyword}>{keyword}</span>)}</div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{drawn.isReversed ? drawn.card.reversedDescription : drawn.card.uprightDescription}</p>
                    {position?.description && <p className="text-[10px] text-[var(--text-dim)] mt-2 italic">{position.description}</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="feature-panel mb-5"><h3 className="font-display text-sm text-[#C8A97E] mb-3 tracking-wider">{t('guidance')}</h3><div className="space-y-2">{synthesis.guidance.map((item, index) => <p key={index} className="text-sm text-[var(--text-primary)] leading-relaxed"><span className="text-[#C8A97E] mr-2">{index + 1}.</span>{item}</p>)}</div></section>

        {reading && <section className="feature-panel mb-6"><label className="journal-label mt-0" htmlFor="result-journal">{t('journal')}</label><textarea id="result-journal" value={reading.journal} onChange={event => updateJournal(reading.id, event.target.value)} placeholder={t('journalPlaceholder')} className="journal-textarea" /><p className="save-hint">{t('saved')}</p></section>}

        <div className="flex flex-wrap justify-center gap-4 pb-3">
          <button onClick={handleShare} disabled={sharing} className="btn-mystical flex items-center gap-2 disabled:opacity-50"><Share2 className="w-4 h-4" /><span className="relative z-10">{t(sharing ? 'sharing' : 'shareCard')}</span></button>
          <button onClick={onReset} className="btn-mystical flex items-center gap-2"><RotateCcw className="w-4 h-4" /><span className="relative z-10">{t('newReading')}</span></button>
        </div>
        {shareStatus && <p className="text-center text-xs text-[var(--text-secondary)] mb-5" role="status" aria-live="polite">{shareStatus}</p>}
        <div className="text-center pb-4"><p className="text-xs text-[#8BA6C4]">{t('blessing')}</p></div>
        <Copyright />
      </div>
    </div>
  );
}
