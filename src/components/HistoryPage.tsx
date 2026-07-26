import { useMemo, useState } from 'react';
import { BookHeart, CalendarDays, ChevronLeft, Trash2 } from 'lucide-react';
import { useI18n } from '@/i18n';
import { getLocalizedCards, getLocalizedSpreads } from '@/i18n/tarot';
import { useTarotData } from '@/data/userData';
import { tapHaptic } from '@/services/native';

export default function HistoryPage({ onBack }: { onBack: () => void }) {
  const { language, locale, t } = useI18n();
  const { data, updateJournal, removeReading } = useTarotData();
  const cards = useMemo(() => new Map(getLocalizedCards(language).map(card => [card.id, card])), [language]);
  const spreads = useMemo(() => new Map(getLocalizedSpreads(language).map(spread => [spread.id, spread])), [language]);
  const [selectedId, setSelectedId] = useState<string | null>(data.readings[0]?.id ?? null);
  const selected = data.readings.find(reading => reading.id === selectedId) ?? null;

  const categories: Record<string, string> = { love: t('categoryLove'), career: t('categoryCareer'), wealth: t('categoryWealth'), health: t('categoryHealth'), general: t('categoryGeneral') };

  return (
    <div className="feature-page relative z-10 w-full h-full overflow-y-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="feature-back"><ChevronLeft className="w-4 h-4" />{t('back')}</button>
        <div className="feature-heading">
          <BookHeart className="w-6 h-6 text-[#C8A97E]" />
          <div><h1 tabIndex={-1} className="page-heading">{t('historyTitle')}</h1><p>{t('historySubtitle')}</p></div>
        </div>

        {!data.readings.length ? (
          <div className="feature-empty">
            <CalendarDays className="w-10 h-10" />
            <h3>{t('noHistory')}</h3><p>{t('noHistoryHint')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[280px_1fr] gap-4 items-start">
            <div className="space-y-2">
              {data.readings.map(reading => {
                const date = new Date(reading.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
                const firstCard = cards.get(reading.cards[0]?.cardId);
                return (
                  <button key={reading.id} aria-pressed={selectedId === reading.id} onClick={() => { void tapHaptic(); setSelectedId(reading.id); }} className={`history-row ${selectedId === reading.id ? 'active' : ''}`}>
                    {firstCard && <img src={firstCard.image} alt="" />}
                    <span><strong>{t('historyRecord', { date })}</strong><small>{categories[reading.category] ?? t('general')} · {spreads.get(reading.spreadId)?.name}</small></span>
                  </button>
                );
              })}
            </div>

            {selected && (
              <article className="feature-panel">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-display text-lg text-[var(--text-primary)]">{spreads.get(selected.spreadId)?.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">{new Date(selected.createdAt).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                  <button aria-label={t('deleteReading')} title={t('deleteReading')} className="icon-action danger" onClick={() => { void tapHaptic('medium'); removeReading(selected.id); setSelectedId(data.readings.find(item => item.id !== selected.id)?.id ?? null); }}><Trash2 className="w-4 h-4" /></button>
                </div>
                {selected.question && <blockquote className="question-quote">“{selected.question}”</blockquote>}
                <div className="history-cards">
                  {selected.cards.map((stored, index) => {
                    const card = cards.get(stored.cardId);
                    if (!card) return null;
                    return <div key={`${stored.cardId}-${index}`}><img src={card.image} alt={card.name} style={{ transform: stored.isReversed ? 'rotate(180deg)' : undefined }} /><span>{spreads.get(selected.spreadId)?.positions[index]?.label}</span><strong>{card.name}</strong>{stored.isReversed && <small>{t('reversed')}</small>}</div>;
                  })}
                </div>
                <label className="journal-label" htmlFor="reading-journal">{t('journal')}</label>
                <textarea id="reading-journal" value={selected.journal} onChange={event => updateJournal(selected.id, event.target.value)} placeholder={t('journalPlaceholder')} className="journal-textarea" />
                <p className="save-hint">{t('saved')}</p>
              </article>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
