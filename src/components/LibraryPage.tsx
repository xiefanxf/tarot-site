import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpenCheck, Check, ChevronLeft, Heart, Search, X } from 'lucide-react';
import { useI18n } from '@/i18n';
import { getLocalizedCards } from '@/i18n/tarot';
import { useTarotData } from '@/data/userData';
import { tapHaptic } from '@/services/native';

type Filter = 'all' | 'favorites' | 'learning';

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function LibraryPage({ onBack }: { onBack: () => void }) {
  const { language, t } = useI18n();
  const { data, toggleFavorite, toggleLearned } = useTarotData();
  const cards = useMemo(() => getLocalizedCards(language), [language]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const selected = cards.find(card => card.id === selectedId) ?? null;
  const visible = cards.filter(card => {
    const matches = `${card.name} ${card.nameEn} ${card.uprightKeywords.join(' ')} ${card.reversedKeywords.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim());
    if (!matches) return false;
    if (filter === 'favorites') return data.favorites.includes(card.id);
    if (filter === 'learning') return !data.learned.includes(card.id);
    return true;
  });

  const localCopy = language === 'zh'
    ? { filters: '牌库筛选', emptyTitle: '没有找到符合条件的牌', emptyHint: '请调整搜索词或筛选条件。' }
    : language === 'ja'
      ? { filters: 'カードの絞り込み', emptyTitle: '条件に合うカードがありません', emptyHint: '検索語または絞り込み条件を変更してください。' }
      : { filters: 'Card filters', emptyTitle: 'No matching cards', emptyHint: 'Try changing the search or filter.' };

  const closeDialog = useCallback(() => setSelectedId(null), []);

  useEffect(() => {
    if (!selectedId) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background = backgroundRef.current;
    const fallbackFocus = searchInputRef.current;
    background?.setAttribute('inert', '');
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        .filter(element => element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      background?.removeAttribute('inert');
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      } else {
        fallbackFocus?.focus();
      }
    };
  }, [closeDialog, selectedId]);

  return (
    <div className="feature-page relative z-10 w-full h-full overflow-y-auto px-4 pt-24 pb-12">
      <div ref={backgroundRef} aria-hidden={selectedId ? true : undefined} className="max-w-5xl mx-auto">
        <button type="button" onClick={onBack} className="feature-back"><ChevronLeft className="w-4 h-4" aria-hidden="true" />{t('back')}</button>
        <div className="feature-heading">
          <BookOpenCheck className="w-6 h-6 text-[#C8A97E]" aria-hidden="true" />
          <div><h1 tabIndex={-1} className="page-heading">{t('libraryTitle')}</h1><p>{t('librarySubtitle')}</p></div>
        </div>
        <div className="library-progress">
          <span>{t('favoritesCount', { count: data.favorites.length })}</span>
          <span>{t('learnedCount', { count: data.learned.length })}</span>
          <div role="progressbar" aria-label={t('learnedCount', { count: data.learned.length })} aria-valuemin={0} aria-valuemax={78} aria-valuenow={data.learned.length}><i style={{ width: `${data.learned.length / 78 * 100}%` }} /></div>
        </div>
        <div className="library-tools">
          <label>
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">{t('searchCards')}</span>
            <input ref={searchInputRef} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t('searchCards')} />
          </label>
          <div role="group" aria-label={localCopy.filters}>
            {(['all', 'favorites', 'learning'] as Filter[]).map(value => (
              <button
                key={value}
                type="button"
                className={filter === value ? 'active' : ''}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {t(value === 'all' ? 'filterAll' : value === 'favorites' ? 'filterFavorites' : 'filterLearning')}
              </button>
            ))}
          </div>
        </div>

        {visible.length ? (
          <div className="library-grid">
            {visible.map(card => {
              const favorite = data.favorites.includes(card.id);
              const learned = data.learned.includes(card.id);
              return (
                <button
                  key={card.id}
                  type="button"
                  className="library-card"
                  aria-haspopup="dialog"
                  aria-controls="card-study-dialog"
                  onClick={() => { void tapHaptic(); setSelectedId(card.id); }}
                >
                  <div>
                    <img src={card.image} alt="" loading="lazy" />
                    {favorite && <Heart className="favorite-mark" fill="currentColor" aria-hidden="true" />}
                    {learned && <Check className="learned-mark" aria-hidden="true" />}
                  </div>
                  <strong>{card.name}</strong>
                  <small>{card.nameEn}</small>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="feature-empty library-empty" role="status">
            <BookOpenCheck className="w-10 h-10" aria-hidden="true" />
            <h3>{localCopy.emptyTitle}</h3>
            <p>{localCopy.emptyHint}</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="card-study-overlay" onClick={event => { if (event.target === event.currentTarget) closeDialog(); }}>
          <article
            id="card-study-dialog"
            ref={dialogRef}
            className="card-study"
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-study-title"
            tabIndex={-1}
          >
            <button ref={closeButtonRef} type="button" className="study-close" aria-label={t('close')} onClick={closeDialog}><X aria-hidden="true" /></button>
            <div className="study-layout">
              <img src={selected.image} alt={selected.name} />
              <div>
                <p className="eyebrow">{t('cardMeaning')}</p><h2 id="card-study-title">{selected.name}</h2><p className="secondary-name">{selected.nameEn}</p>
                <h3>{t('upright')}</h3><div className="keyword-row justify-start">{selected.uprightKeywords.map(keyword => <span key={keyword}>{keyword}</span>)}</div><p>{selected.uprightDescription}</p>
                <h3>{t('reversed')}</h3><div className="keyword-row justify-start">{selected.reversedKeywords.map(keyword => <span key={keyword}>{keyword}</span>)}</div><p>{selected.reversedDescription}</p>
                <div className="study-actions">
                  <button type="button" aria-pressed={data.favorites.includes(selected.id)} className={data.favorites.includes(selected.id) ? 'active' : ''} onClick={() => { void tapHaptic(); toggleFavorite(selected.id); }}><Heart className="w-4 h-4" fill={data.favorites.includes(selected.id) ? 'currentColor' : 'none'} aria-hidden="true" />{data.favorites.includes(selected.id) ? t('unfavorite') : t('favorite')}</button>
                  <button type="button" aria-pressed={data.learned.includes(selected.id)} className={data.learned.includes(selected.id) ? 'active' : ''} onClick={() => { void tapHaptic('medium'); toggleLearned(selected.id); }}><Check className="w-4 h-4" aria-hidden="true" />{data.learned.includes(selected.id) ? t('learned') : t('markLearned')}</button>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
