/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Language } from '@/types/tarot';

type Vars = Record<string, string | number>;
type Messages = Record<string, string>;

const messages: Record<Language, Messages> = {
  zh: {
    appName: '日月塔罗', introTagline: '探寻潜意识的回响', introLine1: '集中精神，默念你的问题', introLine2: '让78张塔罗牌为你揭示答案', start: '开始占卜', introFeatures: '78张塔罗牌 · 经典牌阵 · 深度解读',
    back: '返回', divinationGuide: '占卜指引', guideEyebrow: 'DIVINATION GUIDE', guideCopy: '塔罗无法替你做出决定，但它能照见你内心真实的答案', chooseCategory: '选择占卜领域', optionalQuestion: '默念你的问题（可选）', questionPlaceholder: '例如：我该如何改善当前的人际关系？', startShuffle: '开始洗牌', mirrorQuote: '“牌面如镜像，映照的是你的心”',
    categoryLove: '感情姻缘', categoryCareer: '事业前程', categoryWealth: '财富运势', categoryHealth: '健康身心', categoryGeneral: '综合指引', general: '综合', question: '你的问题',
    focusQuestion: '集中精神，默念你的问题', shuffling: '正在洗牌…', cardsReady: '牌已洗好', cutting: '正在切牌…', swapping: '交换牌堆…', cutComplete: '切牌完成', shuffleTitle: '洗牌与切牌', chooseSpreadTitle: '选择你的牌阵', chooseSpreadSubtitle: '选择一种牌阵来解读你的问题', shuffleAgain: '再洗一次', cutDeck: '切牌', chooseSpread: '选择牌阵',
    backToShuffle: '返回洗牌', spreadSubtitle: '不同的牌阵揭示不同层次的答案', cardCount: '{count} 张牌', spreadHint: '点击选择牌阵，开始发牌',
    backToSpreads: '返回牌阵', dealing: '正在发牌… {current}/{total}', allRevealedHint: '所有牌已翻开 · 点击解读', revealedProgress: '已翻开 {current}/{total} 张牌', reversed: '逆位', restart: '重新开始', revealAll: '全部翻开', fullReading: '查看完整解读',
    fullReadingTitle: '完整解读', majorArcanaCount: '{count} 张大阿卡纳', minorArcanaCount: '{count} 张小阿卡纳', reversedCount: '{count} 张逆位', overallInsight: '整体洞察', guidance: '指引与建议', saveReading: '保存解读', newReading: '重新占卜', blessing: '愿星辰指引你的道路', cardNumber: '第{count}张', keywords: '关键词', readingCategory: '占卜领域', spreadUsed: '使用牌阵', cardDetails: '牌面详情', reportTitle: '神秘塔罗解读', reportFile: '塔罗解读',
    summarySingle: '这张{card}为你的{category}带来了核心指引。', summarySingleReversed: '牌面呈逆位，暗示你需要更加留意{keywords}等方面的挑战。', summarySingleUpright: '牌面正位，{keywords}的能量正在支持你。', summaryThree: '从{past}的过往经历，到{present}的当前状态，再到{future}的未来走向，时间之流揭示了一条清晰的发展脉络。', summaryManyReversed: '多张逆位牌暗示这段时间充满了内在挑战，需要更多的自我反思。', summaryNoReversed: '三张牌均为正位，显示能量流动顺畅，前景乐观。', summaryCeltic: '凯尔特十字牌阵为你提供了深度的全景解析。', summaryManyMajor: '大量大阿卡纳牌的出现，表明这是一个命运中的重要转折时刻，具有深远的意义。', summaryMixed: '大小阿卡纳的交织显示，这既受命运力量影响，也与你的日常选择密切相关。',
    guideFire: '火元素的主导提醒你保持热情和行动力，但注意不要过于冲动。', guideWater: '水元素的主导邀请你更多地倾听内心的声音，信任你的直觉和感受。', guideAir: '风元素的主导提示你运用理性思考，保持开放的心态去接受新的想法。', guideEarth: '土元素的主导建议你脚踏实地，关注现实中的具体行动和物质基础。', guideNoReversed: '所有牌均为正位，显示当前能量流动顺畅。保持觉知，顺势而为。', guideFewReversed: '少量逆位牌提示你需要留意某些方面的内在阻力，将其视为成长的机会。', guideManyReversed: '较多逆位牌表明你可能正处于一个内在转变期。给自己时间和耐心，慢慢地梳理和调整。',
    navHistory: '占卜历史', navDaily: '每日一牌', navLibrary: '个人牌库', historyTitle: '占卜历史与日记', historySubtitle: '回看牌面，也回看当时的自己', noHistory: '还没有占卜记录', noHistoryHint: '完成一次占卜后，它会自动保存在这里。', journal: '个人日记', journalPlaceholder: '写下你此刻的感受、验证或行动…', saved: '已保存', deleteReading: '删除记录', dailyTitle: '每日一牌', dailySubtitle: '每天一次与内在智慧的相遇', checkIn: '抽取今日牌', checkedIn: '今日已签到', streakDays: '连续 {count} 天', todaysCard: '今日之牌', dailyPrompt: '今天，这张牌在提醒你什么？', reflectionPlaceholder: '记录今天的观察与回应…', reminder: '每日提醒', reminderCopy: '每天上午 9:00 提醒我抽取今日牌', reminderOn: '提醒已开启', reminderOff: '提醒已关闭', libraryTitle: '个人牌库', librarySubtitle: '收藏、学习并建立你与78张牌的关系', searchCards: '搜索牌名或关键词', filterAll: '全部', filterFavorites: '收藏', filterLearning: '待学习', favoritesCount: '{count} 张收藏', learnedCount: '已学习 {count}/78', favorite: '收藏', unfavorite: '取消收藏', markLearned: '标记已学习', learned: '已学习', upright: '正位', cardMeaning: '牌义学习', close: '关闭', readingPatterns: '牌组关系与组合', shareCard: '分享图片卡片', sharing: '正在生成…', shareSuccess: '分享卡片已打开', shareDownloaded: '图片卡片已保存', shareFailed: '暂时无法分享，请稍后重试', historyRecord: '{date}的占卜',
    lightMode: '切换到白天模式', darkMode: '切换到夜间模式', language: '语言', chinese: '中文', english: 'English', japanese: '日本語',
    navPrivacy: '隐私与支持', privacyTitle: '隐私与支持', privacySubtitle: '你的牌面与记录只属于你', privacyIntro: '日月塔罗以隐私优先的方式运行，不需要账号，也不包含广告或跨应用追踪。', privacyStorageTitle: '设备本地数据', privacyStorageCopy: '占卜问题、牌面记录、日记、收藏、学习进度与每日一牌均保存在你的设备上。你可以删除单条记录；卸载应用会移除这些本地数据。', privacyPermissionsTitle: '通知与触觉', privacyPermissionsCopy: '只有当你主动开启每日提醒时，应用才会请求通知权限。提醒在设备本地安排。触觉反馈仅在支持的设备上用于确认操作。', privacySharingTitle: '主动分享', privacySharingCopy: '只有当你点击分享时，应用才会生成临时图片并打开 iOS 系统分享面板。你选择的第三方服务将依照其自身隐私政策处理内容。', privacyCollectionTitle: '不收集的内容', privacyCollectionCopy: '开发者不会接收你的占卜内容、日记、设备标识、位置或使用分析数据。应用不使用第三方广告或分析 SDK。', supportTitle: '支持', supportCopy: '如需帮助或希望报告问题，请前往项目支持页面。请不要在公开问题中提交私人占卜内容。', supportLink: '打开支持页面', privacyUpdated: '更新日期：2026年7月26日',
  },
  en: {
    appName: 'Solaris Luna Tarot', introTagline: 'Listen to the echoes within', introLine1: 'Center yourself and hold your question in mind', introLine2: 'Let the 78 cards illuminate your path', start: 'Begin Reading', introFeatures: '78 Tarot Cards · Classic Spreads · In-depth Insight',
    back: 'Back', divinationGuide: 'Reading Guide', guideEyebrow: 'DIVINATION GUIDE', guideCopy: 'Tarot cannot decide for you, but it can reflect the answer already within.', chooseCategory: 'Choose a focus', optionalQuestion: 'Hold your question in mind (optional)', questionPlaceholder: 'For example: How can I improve my relationships?', startShuffle: 'Shuffle the Cards', mirrorQuote: '“The cards are a mirror for the heart.”',
    categoryLove: 'Love', categoryCareer: 'Career', categoryWealth: 'Finances', categoryHealth: 'Wellbeing', categoryGeneral: 'General Guidance', general: 'General', question: 'Your question',
    focusQuestion: 'Center yourself and hold your question in mind', shuffling: 'Shuffling…', cardsReady: 'The cards are ready', cutting: 'Cutting the deck…', swapping: 'Exchanging the piles…', cutComplete: 'The cut is complete', shuffleTitle: 'Shuffle & Cut', chooseSpreadTitle: 'Choose Your Spread', chooseSpreadSubtitle: 'Select a spread to explore your question', shuffleAgain: 'Shuffle Again', cutDeck: 'Cut Deck', chooseSpread: 'Choose Spread',
    backToShuffle: 'Back to Shuffle', spreadSubtitle: 'Each spread reveals a different layer of insight', cardCount: '{count} cards', cardCountOne: '1 card', spreadHint: 'Tap a spread to begin dealing',
    backToSpreads: 'Back to Spreads', dealing: 'Dealing… {current}/{total}', allRevealedHint: 'All cards revealed · Tap for insight', revealedProgress: '{current}/{total} cards revealed', reversed: 'Reversed', restart: 'Start Over', revealAll: 'Reveal All', fullReading: 'View Full Reading',
    fullReadingTitle: 'Your Reading', majorArcanaCount: '{count} Major', minorArcanaCount: '{count} Minor', reversedCount: '{count} Reversed', overallInsight: 'Overall Insight', guidance: 'Guidance', saveReading: 'Save Reading', newReading: 'New Reading', blessing: 'May the stars illuminate your path', cardNumber: 'Card {count}', keywords: 'Keywords', readingCategory: 'Focus', spreadUsed: 'Spread', cardDetails: 'Card Details', reportTitle: 'SOLARIS LUNA TAROT READING', reportFile: 'Tarot_Reading',
    summarySingle: '{card} brings a central message to your {category} reading. ', summarySingleReversed: 'Reversed, it asks you to notice challenges around {keywords}.', summarySingleUpright: 'Upright, the energies of {keywords} are supporting you.', summaryThree: 'From {past} in the past, through {present} in the present, toward {future} ahead, this spread reveals a clear unfolding story. ', summaryManyReversed: 'Several reversals suggest a period of inner challenge and call for honest reflection.', summaryNoReversed: 'All three cards are upright, suggesting a clear flow of energy and an encouraging outlook.', summaryCeltic: 'The Celtic Cross offers a deep, panoramic view of your question. ', summaryManyMajor: 'The strong Major Arcana presence marks this as a meaningful turning point with lasting significance.', summaryMixed: 'The blend of Major and Minor Arcana shows destiny and everyday choices working together.',
    guideFire: 'Fire leads this reading: keep your passion and momentum, while taking care not to rush.', guideWater: 'Water leads this reading: listen inward and trust your intuition and emotional truth.', guideAir: 'Air leads this reading: think clearly and stay open to new perspectives.', guideEarth: 'Earth leads this reading: stay grounded and focus on practical steps and solid foundations.', guideNoReversed: 'Every card is upright, suggesting an open flow of energy. Stay aware and move with it.', guideFewReversed: 'A few reversals point to inner resistance. Treat it as an invitation to grow.', guideManyReversed: 'Many reversals suggest a period of inner change. Give yourself time and patience to realign.',
    navHistory: 'History', navDaily: 'Daily Card', navLibrary: 'Card Library', historyTitle: 'Readings & Journal', historySubtitle: 'Return to the cards—and to who you were then', noHistory: 'No readings yet', noHistoryHint: 'Your completed readings will be saved here automatically.', journal: 'Personal Journal', journalPlaceholder: 'Write what you felt, noticed, or plan to do…', saved: 'Saved', deleteReading: 'Delete Reading', dailyTitle: 'Daily Card', dailySubtitle: 'A daily meeting with your inner wisdom', checkIn: 'Draw Today’s Card', checkedIn: 'Checked in today', streakDays: '{count}-day streak', todaysCard: 'Today’s Card', dailyPrompt: 'What is this card asking you to notice today?', reflectionPlaceholder: 'Record today’s observation and response…', reminder: 'Daily Reminder', reminderCopy: 'Remind me at 9:00 AM to draw my daily card', reminderOn: 'Reminder enabled', reminderOff: 'Reminder disabled', libraryTitle: 'My Card Library', librarySubtitle: 'Save, study, and build a relationship with all 78 cards', searchCards: 'Search names or keywords', filterAll: 'All', filterFavorites: 'Favorites', filterLearning: 'To Learn', favoritesCount: '{count} favorites', learnedCount: '{count}/78 learned', favorite: 'Favorite', unfavorite: 'Unfavorite', markLearned: 'Mark as Learned', learned: 'Learned', upright: 'Upright', cardMeaning: 'Card Study', close: 'Close', readingPatterns: 'Card Patterns & Combinations', shareCard: 'Share Image Card', sharing: 'Creating…', shareSuccess: 'Share sheet opened', shareDownloaded: 'Image card saved', shareFailed: 'Unable to share right now. Please try again.', historyRecord: 'Reading from {date}',
    lightMode: 'Switch to light mode', darkMode: 'Switch to dark mode', language: 'Language', chinese: '中文', english: 'English', japanese: '日本語',
    navPrivacy: 'Privacy & Support', privacyTitle: 'Privacy & Support', privacySubtitle: 'Your cards and reflections stay yours', privacyIntro: 'Solaris Luna Tarot is designed to work without an account, advertising, or cross-app tracking.', privacyStorageTitle: 'Data on your device', privacyStorageCopy: 'Questions, readings, journals, favorites, learning progress, and daily cards are stored on your device. You can delete individual readings; uninstalling the app removes this local data.', privacyPermissionsTitle: 'Notifications and haptics', privacyPermissionsCopy: 'The app requests notification permission only when you enable the daily reminder. Reminders are scheduled locally. Haptics are used only to confirm actions on supported devices.', privacySharingTitle: 'Sharing you initiate', privacySharingCopy: 'A temporary image is created only when you tap Share, then the iOS share sheet opens. Any destination you choose handles that content under its own privacy policy.', privacyCollectionTitle: 'What we do not collect', privacyCollectionCopy: 'The developer does not receive your readings, journals, device identifiers, location, or usage analytics. The app contains no third-party advertising or analytics SDK.', supportTitle: 'Support', supportCopy: 'For help or to report an issue, use the project support page. Please do not include private reading content in a public issue.', supportLink: 'Open support page', privacyUpdated: 'Last updated: July 26, 2026',
  },
  ja: {
    appName: '日月タロット', introTagline: '心の奥に響く声をたどる', introLine1: '心を静め、問いを思い浮かべてください', introLine2: '78枚のタロットが道を照らします', start: '占いを始める', introFeatures: '78枚のタロット · 伝統的なスプレッド · 深いリーディング',
    back: '戻る', divinationGuide: '占いのガイド', guideEyebrow: 'DIVINATION GUIDE', guideCopy: 'タロットは決断を代行しません。けれど、心の中にある答えを映し出します。', chooseCategory: 'テーマを選ぶ', optionalQuestion: '問いを心に思い浮かべる（任意）', questionPlaceholder: '例：今の人間関係を良くするには？', startShuffle: 'カードをシャッフル', mirrorQuote: '「カードは心を映す鏡」',
    categoryLove: '恋愛・ご縁', categoryCareer: '仕事・将来', categoryWealth: '金運', categoryHealth: '心と身体', categoryGeneral: '総合メッセージ', general: '総合', question: 'あなたの質問',
    focusQuestion: '心を静め、問いを思い浮かべてください', shuffling: 'シャッフル中…', cardsReady: 'カードが整いました', cutting: 'カット中…', swapping: '山を入れ替えています…', cutComplete: 'カット完了', shuffleTitle: 'シャッフル＆カット', chooseSpreadTitle: 'スプレッドを選ぶ', chooseSpreadSubtitle: '問いに合うスプレッドを選んでください', shuffleAgain: 'もう一度', cutDeck: 'カット', chooseSpread: 'スプレッドを選ぶ',
    backToShuffle: 'シャッフルへ戻る', spreadSubtitle: 'スプレッドごとに異なる角度から答えを映します', cardCount: '{count}枚', spreadHint: 'スプレッドをタップして配り始めます',
    backToSpreads: 'スプレッドへ戻る', dealing: 'カードを配っています… {current}/{total}', allRevealedHint: 'すべて開きました · タップして解釈へ', revealedProgress: '{current}/{total}枚を開きました', reversed: '逆位置', restart: '最初から', revealAll: 'すべて開く', fullReading: '詳しい解釈を見る',
    fullReadingTitle: 'リーディング結果', majorArcanaCount: '大アルカナ {count}枚', minorArcanaCount: '小アルカナ {count}枚', reversedCount: '逆位置 {count}枚', overallInsight: '全体の洞察', guidance: '導きとアドバイス', saveReading: '結果を保存', newReading: 'もう一度占う', blessing: '星々があなたの道を照らしますように', cardNumber: '{count}枚目', keywords: 'キーワード', readingCategory: 'テーマ', spreadUsed: 'スプレッド', cardDetails: 'カードの詳細', reportTitle: '日月タロット リーディング', reportFile: 'タロット占い',
    summarySingle: '{card}は、{category}について中心となるメッセージを伝えています。', summarySingleReversed: '逆位置は、{keywords}にまつわる課題へ注意を促します。', summarySingleUpright: '正位置では、{keywords}の力があなたを支えています。', summaryThree: '過去の{past}から、現在の{present}を経て、未来の{future}へ。時間の流れが一つの物語を示しています。', summaryManyReversed: '複数の逆位置は内面の課題が多い時期を示し、丁寧な振り返りを求めています。', summaryNoReversed: '3枚すべてが正位置で、エネルギーの流れは素直で明るい見通しです。', summaryCeltic: 'ケルト十字は、問いを深く多面的に映し出します。', summaryManyMajor: '大アルカナが多く現れたことは、長く影響する大切な転機を示します。', summaryMixed: '大アルカナと小アルカナの重なりは、運命の力と日々の選択が共に働いていることを示します。',
    guideFire: '火の要素が中心です。情熱と行動力を保ちつつ、焦りすぎないように。', guideWater: '水の要素が中心です。内なる声に耳を澄まし、直感と感情を信じてください。', guideAir: '風の要素が中心です。冷静に考え、新しい視点を柔軟に受け入れてください。', guideEarth: '地の要素が中心です。地に足をつけ、具体的な行動と基盤を大切に。', guideNoReversed: 'すべて正位置で、エネルギーは素直に流れています。気づきを保ち、その流れに乗りましょう。', guideFewReversed: '少数の逆位置は内なる抵抗を示します。それを成長への招待として受け止めてください。', guideManyReversed: '多くの逆位置は内面的な変化の時期を示します。焦らず、時間をかけて整えましょう。',
    navHistory: '占い履歴', navDaily: '今日の一枚', navLibrary: 'マイカード', historyTitle: '占い履歴と日記', historySubtitle: 'カードと、あの時の自分を振り返る', noHistory: '占い履歴はまだありません', noHistoryHint: '占いを完了すると、ここに自動保存されます。', journal: 'パーソナル日記', journalPlaceholder: '感じたこと、気づき、次の行動を書き留める…', saved: '保存済み', deleteReading: '記録を削除', dailyTitle: '今日の一枚', dailySubtitle: '内なる知恵と出会う、一日一度の時間', checkIn: '今日のカードを引く', checkedIn: '本日のチェックイン済み', streakDays: '{count}日連続', todaysCard: '今日のカード', dailyPrompt: 'このカードは今日、何に気づくよう伝えていますか？', reflectionPlaceholder: '今日の気づきと応答を記録する…', reminder: '毎日のリマインダー', reminderCopy: '毎朝9時に今日のカードを知らせる', reminderOn: '通知をオンにしました', reminderOff: '通知をオフにしました', libraryTitle: 'マイカードライブラリ', librarySubtitle: '78枚を保存し、学び、カードとの関係を育てる', searchCards: 'カード名やキーワードを検索', filterAll: 'すべて', filterFavorites: 'お気に入り', filterLearning: '未学習', favoritesCount: 'お気に入り {count}枚', learnedCount: '学習済み {count}/78', favorite: 'お気に入り', unfavorite: 'お気に入り解除', markLearned: '学習済みにする', learned: '学習済み', upright: '正位置', cardMeaning: 'カード学習', close: '閉じる', readingPatterns: 'カードの関係と組み合わせ', shareCard: '画像カードを共有', sharing: '作成中…', shareSuccess: '共有画面を開きました', shareDownloaded: '画像カードを保存しました', shareFailed: '現在共有できません。もう一度お試しください。', historyRecord: '{date}の占い',
    lightMode: 'ライトモードへ', darkMode: 'ダークモードへ', language: '言語', chinese: '中文', english: 'English', japanese: '日本語',
    navPrivacy: 'プライバシーとサポート', privacyTitle: 'プライバシーとサポート', privacySubtitle: 'カードと記録は、あなたのものです', privacyIntro: '日月タロットは、アカウント・広告・アプリ間トラッキングを使わずに動作します。', privacyStorageTitle: '端末内のデータ', privacyStorageCopy: '質問、占い履歴、日記、お気に入り、学習状況、今日のカードは端末内に保存されます。履歴は個別に削除でき、アプリを削除するとローカルデータも削除されます。', privacyPermissionsTitle: '通知と触覚', privacyPermissionsCopy: '毎日のリマインダーを有効にした場合のみ通知権限を求めます。通知は端末内で予約され、触覚は対応端末で操作確認にのみ使われます。', privacySharingTitle: '自分で選ぶ共有', privacySharingCopy: '共有をタップした時だけ一時画像を作成し、iOSの共有画面を開きます。選択した共有先では、そのサービスのプライバシーポリシーが適用されます。', privacyCollectionTitle: '収集しない情報', privacyCollectionCopy: '開発者は占い内容、日記、端末識別子、位置情報、利用解析データを受け取りません。第三者広告・解析SDKも使用しません。', supportTitle: 'サポート', supportCopy: 'ヘルプや不具合報告はプロジェクトのサポートページをご利用ください。公開Issueには個人的な占い内容を投稿しないでください。', supportLink: 'サポートページを開く', privacyUpdated: '最終更新日：2026年7月26日',
  },
};

export function translateMessage(language: Language, key: string, vars: Vars = {}) {
  const template = messages[language][key] ?? messages.en[key] ?? key;
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), template);
}

function detectLanguage(): Language {
  let saved: string | null = null;
  try { saved = localStorage.getItem('tarot-language'); } catch { /* Use the system language when storage is unavailable. */ }
  if (saved === 'zh' || saved === 'en' || saved === 'ja') return saved;
  const system = navigator.language.toLowerCase();
  if (system.startsWith('ja')) return 'ja';
  if (system.startsWith('zh')) return 'zh';
  return 'en';
}

interface I18nValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, vars?: Vars) => string;
  locale: string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);
  const setLanguage = useCallback((next: Language) => {
    try { localStorage.setItem('tarot-language', next); } catch { /* The live setting still works for this session. */ }
    setLanguageState(next);
  }, []);
  const t = useCallback((key: string, vars: Vars = {}) => translateMessage(language, key, vars), [language]);
  const locale = language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : 'en-US';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.language = language;
    document.title = messages[language].appName;
  }, [language, locale]);

  const value = useMemo(() => ({ language, setLanguage, t, locale }), [language, setLanguage, t, locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// Context and hook intentionally live together so the provider has one public entry point.
export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}
