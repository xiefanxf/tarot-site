import { useMemo, useState } from 'react';
import { Bell, BellOff, CalendarCheck, ChevronLeft, Flame, Heart, Sparkles } from 'lucide-react';
import { useI18n } from '@/i18n';
import { getLocalizedCards } from '@/i18n/tarot';
import { useTarotData } from '@/data/userData';
import { configureDailyReminder, successHaptic, tapHaptic } from '@/services/native';
import TarotCard from './TarotCard';

export default function DailyCardPage({ onBack }: { onBack: () => void }) {
  const { language, t } = useI18n();
  const { data, getTodayCard, checkInToday, updateDailyReflection, streak, setReminderEnabled, toggleFavorite } = useTarotData();
  const cards = useMemo(() => getLocalizedCards(language), [language]);
  const [today, setToday] = useState(getTodayCard);
  const [revealed, setRevealed] = useState(Boolean(today));
  const card = today ? cards.find(item => item.id === today.cardId) : null;
  const isFavorite = card ? data.favorites.includes(card.id) : false;
  const reminderTitle = t('dailyTitle');
  const reminderBody = t('reminderCopy');

  const handleCheckIn = () => {
    void successHaptic();
    const record = checkInToday(cards.map(item => item.id));
    setToday(record);
    setTimeout(() => setRevealed(true), 120);
  };

  const handleReminder = async () => {
    void tapHaptic();
    const next = !data.reminderEnabled;
    const enabled = await configureDailyReminder(next, reminderTitle, reminderBody);
    setReminderEnabled(enabled);
  };

  return (
    <div className="feature-page relative z-10 w-full h-full overflow-y-auto px-4 pt-24 pb-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="feature-back"><ChevronLeft className="w-4 h-4" />{t('back')}</button>
        <div className="feature-heading justify-center text-center">
          <CalendarCheck className="w-6 h-6 text-[#C8A97E]" />
          <div><h1 tabIndex={-1} className="page-heading">{t('dailyTitle')}</h1><p>{t('dailySubtitle')}</p></div>
        </div>
        <div className="streak-pill"><Flame className="w-4 h-4" />{t('streakDays', { count: streak })}</div>

        {!today ? (
          <div className="daily-draw">
            <div className="daily-card-back"><div className="daily-glow" /><img className="card-back-dark" src={`${import.meta.env.BASE_URL}card_back.jpg`} alt="" /><img className="card-back-light" src={`${import.meta.env.BASE_URL}card_back_light.jpg`} alt="" /></div>
            <button onClick={handleCheckIn} className="btn-mystical pulse-glow"><span className="relative z-10 flex items-center gap-2"><Sparkles className="w-4 h-4" />{t('checkIn')}</span></button>
          </div>
        ) : card ? (
          <div className="daily-result">
            <p className="daily-label">{t('todaysCard')} · {t('checkedIn')}</p>
            <div className="mx-auto rounded-xl overflow-hidden" style={{ width: 176, height: 264 }} onClick={() => setRevealed(true)}>
              <TarotCard card={card} isReversed={today.isReversed} isRevealed={revealed} size="sm" style={{ transform: 'scale(2)', transformOrigin: 'top left' }} />
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <h3 className="font-display text-xl text-[var(--text-primary)]">{card.name}</h3>
              {today.isReversed && <span className="reversed-chip">{t('reversed')}</span>}
              <button className={`icon-action ${isFavorite ? 'active' : ''}`} aria-label={isFavorite ? t('unfavorite') : t('favorite')} onClick={() => { void tapHaptic(); toggleFavorite(card.id); }}><Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} /></button>
            </div>
            <div className="keyword-row">{(today.isReversed ? card.reversedKeywords : card.uprightKeywords).slice(0, 4).map(keyword => <span key={keyword}>{keyword}</span>)}</div>
            <p className="daily-meaning">{today.isReversed ? card.reversedDescription : card.uprightDescription}</p>
            <label className="journal-label" htmlFor="daily-reflection">{t('dailyPrompt')}</label>
            <textarea id="daily-reflection" value={today.reflection} onChange={event => { const reflection = event.target.value; updateDailyReflection(today.date, reflection); setToday(current => current ? { ...current, reflection } : current); }} placeholder={t('reflectionPlaceholder')} className="journal-textarea" />
          </div>
        ) : null}

        <button onClick={handleReminder} className="reminder-row" aria-pressed={data.reminderEnabled}>
          {data.reminderEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          <span><strong>{t('reminder')}</strong><small>{t('reminderCopy')}</small></span>
          <i>{data.reminderEnabled ? t('reminderOn') : t('reminderOff')}</i>
        </button>
      </div>
    </div>
  );
}
