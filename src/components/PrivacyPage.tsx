import { ChevronLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n';

const supportUrl = 'https://github.com/xiefanxf/tarot-site/issues';

export default function PrivacyPage({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();

  return (
    <div className="feature-page relative z-10 w-full h-full overflow-y-auto px-4 pt-24 pb-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="feature-back"><ChevronLeft className="w-4 h-4" />{t('back')}</button>
        <div className="feature-heading">
          <ShieldCheck className="w-6 h-6 text-[#C8A97E]" aria-hidden="true" />
          <div><h1 tabIndex={-1} className="page-heading">{t('privacyTitle')}</h1><p>{t('privacySubtitle')}</p></div>
        </div>

        <div className="feature-panel legal-copy">
          <p>{t('privacyIntro')}</p>
          <section><h2>{t('privacyStorageTitle')}</h2><p>{t('privacyStorageCopy')}</p></section>
          <section><h2>{t('privacyPermissionsTitle')}</h2><p>{t('privacyPermissionsCopy')}</p></section>
          <section><h2>{t('privacySharingTitle')}</h2><p>{t('privacySharingCopy')}</p></section>
          <section><h2>{t('privacyCollectionTitle')}</h2><p>{t('privacyCollectionCopy')}</p></section>
          <section id="support"><h2>{t('supportTitle')}</h2><p>{t('supportCopy')}</p><a href={supportUrl} target="_blank" rel="noreferrer">{t('supportLink')}<ExternalLink className="w-4 h-4" aria-hidden="true" /></a></section>
          <p className="legal-updated">{t('privacyUpdated')}</p>
        </div>
      </div>
    </div>
  );
}
