import { useEffect } from 'react';
import { useI18n } from '@/i18n';
import { useTarotData } from '@/data/userData';
import { synchronizeDailyReminder } from '@/services/native';
import type { Language } from '@/types/tarot';

const options: { value: Language; short: string; label: string }[] = [
  { value: 'zh', short: '中', label: '中文' },
  { value: 'en', short: 'EN', label: 'English' },
  { value: 'ja', short: '日', label: '日本語' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const { data, setReminderEnabled } = useTarotData();
  const reminderTitle = t('dailyTitle');
  const reminderBody = t('reminderCopy');

  useEffect(() => {
    let disposed = false;

    const synchronize = async () => {
      const enabled = await synchronizeDailyReminder(reminderTitle, reminderBody);
      if (!disposed && enabled !== data.reminderEnabled) setReminderEnabled(enabled);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void synchronize();
    };

    void synchronize();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [data.reminderEnabled, reminderBody, reminderTitle, setReminderEnabled]);

  return (
    <div className="language-switcher" role="group" aria-label={t('language')}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          aria-pressed={language === option.value}
          className={language === option.value ? 'active' : ''}
          onClick={() => setLanguage(option.value)}
        >
          {option.short}
        </button>
      ))}
    </div>
  );
}
