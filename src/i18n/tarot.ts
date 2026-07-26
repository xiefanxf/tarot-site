import { questionCategories as baseCategories, spreads as baseSpreads, tarotCards } from '@/data/tarotCards';
import type { Language, QuestionCategory, SpreadType, TarotCard } from '@/types/tarot';

type Pair = [string, string];

const enPairs: Pair[] = [
  ['new beginnings|innocence|spontaneity|free spirit', 'recklessness|poor judgment|fear of the unknown|lack of direction'],
  ['willpower|skill|manifestation|resourcefulness', 'manipulation|untapped talent|deception|lack of focus'],
  ['intuition|inner wisdom|mystery|stillness', 'blocked intuition|secrets|confusion|emotional imbalance'],
  ['abundance|creativity|nurturing|sensuality', 'creative block|dependence|neglect|overprotection'],
  ['authority|structure|stability|leadership', 'rigidity|domination|lack of discipline|instability'],
  ['tradition|spiritual wisdom|learning|shared beliefs', 'rebellion|dogma|unconventional path|questioning authority'],
  ['love|harmony|values|meaningful choice', 'disharmony|misaligned values|separation|difficult choice'],
  ['determination|victory|control|forward movement', 'loss of control|aggression|obstacles|lack of direction'],
  ['inner strength|courage|compassion|self-mastery', 'self-doubt|weakness|repressed emotion|misused power'],
  ['introspection|solitude|wisdom|inner guidance', 'isolation|avoidance|loneliness|losing your way'],
  ['change|cycles|destiny|opportunity', 'setbacks|resisting change|repeating patterns|bad timing'],
  ['fairness|truth|accountability|balance', 'unfairness|avoidance|bias|lack of accountability'],
  ['pause|surrender|new perspective|letting go', 'stagnation|resistance|delay|needless sacrifice'],
  ['ending|transformation|release|rebirth', 'resistance to change|stagnation|fear of endings|holding on'],
  ['balance|moderation|healing|integration', 'excess|imbalance|impatience|discord'],
  ['attachment|temptation|shadow self|materialism', 'release|reclaiming power|breaking patterns|facing the shadow'],
  ['upheaval|revelation|sudden change|awakening', 'avoiding change|fear of collapse|delayed upheaval|inner turmoil'],
  ['hope|renewal|inspiration|spiritual connection', 'discouragement|lost faith|disconnection|lack of inspiration'],
  ['intuition|uncertainty|dreams|the unconscious', 'clarity emerging|released fear|confusion|deception exposed'],
  ['joy|success|vitality|clarity', 'temporary sadness|self-doubt|delayed success|unrealistic optimism'],
  ['awakening|calling|forgiveness|renewal', 'self-doubt|avoiding the call|guilt|refusal to learn'],
  ['completion|achievement|wholeness|fulfillment', 'unfinished business|delay|lack of closure|incompletion'],
  ['inspiration|creative spark|new opportunity|potential', 'delays|low energy|blocked creativity|missed opportunity'],
  ['planning|future vision|decisions|discovery', 'poor planning|fear of change|limited outlook|indecision'],
  ['expansion|progress|foresight|enterprise', 'delays|obstacles|frustration|limited growth'],
  ['celebration|homecoming|harmony|community', 'conflict at home|lack of support|instability|transition'],
  ['competition|challenge|diverse views|testing yourself', 'avoiding conflict|inner tension|unfair competition|resolution'],
  ['victory|recognition|confidence|public success', 'lack of recognition|self-doubt|pride|private achievement'],
  ['perseverance|boundaries|courage|defense', 'exhaustion|giving up|defensiveness|weakened boundaries'],
  ['speed|movement|messages|momentum', 'delays|miscommunication|rushing|scattered energy'],
  ['resilience|persistence|final test|preparedness', 'paranoia|fatigue|stubbornness|lack of preparation'],
  ['burden|responsibility|hard work|completion', 'overload|burnout|refusing help|release of burden'],
  ['enthusiasm|discovery|creative ideas|free spirit', 'immaturity|low confidence|setbacks|restlessness'],
  ['action|adventure|passion|impulsiveness', 'recklessness|anger|impatience|lack of commitment'],
  ['confidence|independence|warmth|determination', 'jealousy|insecurity|selfishness|demanding behavior'],
  ['leadership|vision|boldness|entrepreneurship', 'domination|impulsiveness|high expectations|ruthlessness'],
  ['new love|emotional opening|compassion|intuition', 'blocked feelings|emptiness|repressed emotion|missed connection'],
  ['partnership|mutual attraction|harmony|connection', 'imbalance|miscommunication|separation|unequal exchange'],
  ['friendship|celebration|community|joy', 'isolation|gossip|overindulgence|strained friendship'],
  ['contemplation|apathy|reevaluation|withdrawal', 'renewed interest|awareness|new opportunity|ending stagnation'],
  ['grief|loss|disappointment|regret', 'acceptance|healing|moving on|hope returning'],
  ['nostalgia|innocence|kindness|reunion', 'living in the past|immaturity|unrealistic nostalgia|moving forward'],
  ['choices|fantasy|desire|illusion', 'clarity|decision|reality check|focused choice'],
  ['walking away|seeking meaning|release|journey', 'fear of leaving|avoidance|stagnation|returning'],
  ['contentment|wishes fulfilled|pleasure|gratitude', 'dissatisfaction|indulgence|materialism|inner emptiness'],
  ['emotional fulfillment|family|harmony|lasting love', 'family conflict|broken connection|disharmony|unrealistic ideals'],
  ['sensitivity|creative message|intuition|new feelings', 'emotional immaturity|escapism|insecurity|creative block'],
  ['romance|charm|imagination|following the heart', 'moodiness|unrealistic ideals|jealousy|broken promises'],
  ['empathy|intuition|emotional wisdom|care', 'emotional overwhelm|dependence|poor boundaries|insecurity'],
  ['emotional balance|compassion|diplomacy|maturity', 'emotional manipulation|coldness|volatility|repressed feeling'],
  ['clarity|truth|breakthrough|new idea', 'confusion|misinformation|mental block|hostility'],
  ['difficult choice|stalemate|balance|guardedness', 'indecision|information overload|avoidance|truth revealed'],
  ['heartbreak|sorrow|painful truth|release', 'healing|forgiveness|recovery|releasing pain'],
  ['rest|recovery|contemplation|renewal', 'restlessness|burnout|stagnation|need for rest'],
  ['conflict|hollow victory|tension|self-interest', 'reconciliation|making amends|past resentment|open dialogue'],
  ['transition|moving on|healing journey|calmer waters', 'resisting change|unfinished business|delay|feeling stuck'],
  ['strategy|secrecy|independence|clever action', 'truth exposed|self-deception|changing tactics|coming clean'],
  ['restriction|self-limitation|fear|helplessness', 'freedom|new perspective|self-belief|release'],
  ['anxiety|nightmares|worry|overthinking', 'hope|recovery|facing fears|releasing anxiety'],
  ['painful ending|betrayal|rock bottom|release', 'recovery|survival|regeneration|lessons learned'],
  ['curiosity|alertness|new ideas|direct speech', 'gossip|impulsiveness|poor planning|cynicism'],
  ['ambition|swift action|assertiveness|determination', 'recklessness|aggression|haste|lack of direction'],
  ['independence|clear boundaries|honesty|perception', 'coldness|bitterness|harsh judgment|poor communication'],
  ['intellect|truth|authority|fair judgment', 'misused power|manipulation|cruelty|irrational judgment'],
  ['material opportunity|prosperity|manifestation|solid beginning', 'missed chance|scarcity mindset|poor investment|delay'],
  ['adaptability|balance|priorities|resourcefulness', 'overcommitment|disorganization|imbalance|stress'],
  ['teamwork|skill|craftsmanship|recognition', 'poor collaboration|low quality|conflict|lack of growth'],
  ['security|control|saving|stability', 'greed|possessiveness|fear of loss|letting go'],
  ['hardship|isolation|financial loss|worry', 'recovery|help available|improvement|renewed hope'],
  ['generosity|giving and receiving|fairness|support', 'strings attached|debt|inequality|one-sided help'],
  ['patience|long-term growth|assessment|investment', 'impatience|poor return|lack of reward|giving up early'],
  ['diligence|mastery|practice|dedication', 'perfectionism|low motivation|repetitive work|burnout'],
  ['independence|abundance|self-reliance|refinement', 'overwork|financial dependence|overspending|false success'],
  ['legacy|family security|lasting success|tradition', 'financial instability|family conflict|short-term thinking|lost legacy'],
  ['learning|practical opportunity|ambition|new plan', 'procrastination|missed chance|poor progress|unrealistic goal'],
  ['reliability|patience|routine|steady progress', 'stagnation|stubbornness|boredom|excessive caution'],
  ['nurturing|practical care|abundance|security', 'self-neglect|work-life imbalance|material anxiety|smothering care'],
  ['prosperity|leadership|security|wise stewardship', 'greed|rigidity|materialism|poor judgment'],
];

const jaPairs: Pair[] = [
  ['新しい始まり|純真さ|自由|冒険', '無謀|判断不足|未知への恐れ|方向性の欠如'], ['意志力|技術|具現化|創造力', '操作|才能の未活用|欺瞞|集中力不足'], ['直感|内なる知恵|神秘|静けさ', '直感の遮断|秘密|混乱|感情の乱れ'], ['豊かさ|創造性|育む力|感性', '創造性の停滞|依存|自己軽視|過保護'], ['権威|秩序|安定|統率力', '硬直|支配|規律不足|不安定'], ['伝統|精神的知恵|学び|信念', '反抗|教条|独自の道|権威への疑問'], ['愛|調和|価値観|大切な選択', '不調和|価値観のずれ|別離|難しい選択'], ['決意|勝利|統制|前進', '制御不能|攻撃性|障害|方向性不足'], ['内なる強さ|勇気|慈愛|自制', '自信喪失|弱さ|感情の抑圧|力の乱用'], ['内省|孤独|知恵|内なる導き', '孤立|回避|寂しさ|迷い'], ['変化|循環|運命|機会', '逆風|変化への抵抗|繰り返す問題|時機の悪さ'], ['公平|真実|責任|均衡', '不公平|責任回避|偏見|不均衡'], ['停止|委ねる|新しい視点|手放し', '停滞|抵抗|遅延|無益な犠牲'], ['終わり|変容|解放|再生', '変化への抵抗|停滞|終わりへの恐れ|執着'], ['調和|節度|癒やし|統合', '過剰|不均衡|焦り|不和'], ['執着|誘惑|影の自分|物質主義', '解放|力を取り戻す|悪習を断つ|影と向き合う'], ['激変|啓示|突然の変化|目覚め', '変化の回避|崩壊への恐れ|遅れた変化|内面の混乱'], ['希望|再生|ひらめき|精神的つながり', '落胆|信頼喪失|断絶|ひらめき不足'], ['直感|不確かさ|夢|無意識', '明らかになる真実|恐れの解放|混乱|欺瞞の発覚'], ['喜び|成功|活力|明晰さ', '一時的な悲しみ|自信喪失|遅れる成功|楽観しすぎ'], ['目覚め|使命|赦し|再生', '自信喪失|使命の回避|罪悪感|学びの拒否'], ['完成|達成|統合|成就', '未完了|遅延|区切り不足|不完全'],
  ['ひらめき|創造の火花|新しい機会|可能性', '遅延|気力不足|創造性の停滞|機会損失'], ['計画|未来像|決断|発見', '計画不足|変化への恐れ|狭い視野|優柔不断'], ['拡大|進展|先見性|事業', '遅延|障害|失望|成長の限界'], ['祝福|帰郷|調和|共同体', '家庭の対立|支援不足|不安定|移行期'], ['競争|挑戦|多様な意見|力試し', '対立回避|内面の葛藤|不公平な競争|解決'], ['勝利|評価|自信|公の成功', '評価不足|自信喪失|傲慢|個人的達成'], ['忍耐|境界線|勇気|防御', '疲労|諦め|過剰防衛|境界の弱まり'], ['速さ|前進|知らせ|勢い', '遅延|誤解|焦り|散漫'], ['回復力|粘り強さ|最後の試練|備え', '疑心暗鬼|疲労|頑固|準備不足'], ['重荷|責任|努力|完遂', '過重負担|燃え尽き|助けの拒否|重荷を下ろす'], ['情熱|発見|新しい発想|自由', '未熟|自信不足|つまずき|落ち着きのなさ'], ['行動|冒険|情熱|衝動', '無謀|怒り|焦り|責任感不足'], ['自信|自立|温かさ|決意', '嫉妬|不安|利己性|強引さ'], ['統率力|展望|大胆さ|起業家精神', '支配|衝動性|過大な期待|冷酷さ'],
  ['新しい愛|心の開放|慈愛|直感', '感情の遮断|空虚|抑圧|つながりの喪失'], ['パートナーシップ|相互の魅力|調和|絆', '不均衡|誤解|別離|不公平な関係'], ['友情|祝福|共同体|喜び', '孤立|噂|浪費|友情の緊張'], ['熟考|無関心|再評価|内向', '関心の再生|気づき|新しい機会|停滞の終わり'], ['悲嘆|喪失|失望|後悔', '受容|癒やし|前進|戻る希望'], ['懐かしさ|純真|親切|再会', '過去への執着|未熟|美化された記憶|前進'], ['選択肢|幻想|欲望|錯覚', '明晰さ|決断|現実確認|選択への集中'], ['立ち去る|意味の探求|解放|旅', '離れる恐れ|回避|停滞|引き返す'], ['満足|願望成就|喜び|感謝', '不満|浪費|物質主義|内なる空虚'], ['感情的充足|家族|調和|永続する愛', '家族の対立|壊れた絆|不調和|非現実的な理想'], ['感受性|創造的な知らせ|直感|新しい感情', '感情の未熟|現実逃避|不安|創造性の停滞'], ['ロマンス|魅力|想像力|心に従う', '気分の波|非現実的な理想|嫉妬|約束違反'], ['共感|直感|感情の知恵|思いやり', '感情に呑まれる|依存|境界線不足|不安'], ['感情の均衡|慈愛|外交|成熟', '感情的操作|冷淡|不安定|感情の抑圧'],
  ['明晰さ|真実|突破|新しい発想', '混乱|誤情報|思考停止|敵意'], ['難しい選択|膠着|均衡|警戒', '優柔不断|情報過多|回避|真実の発覚'], ['失恋|悲しみ|痛い真実|解放', '癒やし|赦し|回復|痛みを手放す'], ['休息|回復|熟考|再生', '落ち着きのなさ|燃え尽き|停滞|休息の必要'], ['対立|空しい勝利|緊張|自己中心', '和解|償い|過去の恨み|率直な対話'], ['移行|前進|癒やしの旅|穏やかな場所', '変化への抵抗|未解決|遅延|行き詰まり'], ['戦略|秘密|独立|巧みな行動', '真実の発覚|自己欺瞞|方針変更|告白'], ['制限|自己拘束|恐れ|無力感', '自由|新しい視点|自己信頼|解放'], ['不安|悪夢|心配|考えすぎ', '希望|回復|恐れに向き合う|不安の解放'], ['痛い終わり|裏切り|どん底|解放', '回復|生存|再生|得た教訓'], ['好奇心|警戒|新しい発想|率直さ', '噂|衝動性|計画不足|皮肉'], ['野心|素早い行動|自己主張|決意', '無謀|攻撃性|焦り|方向性不足'], ['自立|明確な境界|正直|洞察', '冷淡|苦味|厳しい判断|意思疎通不足'], ['知性|真実|権威|公平な判断', '力の乱用|操作|残酷さ|不合理な判断'],
  ['物質的な機会|繁栄|具現化|確かな始まり', '機会損失|欠乏意識|悪い投資|遅延'], ['適応力|均衡|優先順位|工夫', '抱えすぎ|混乱|不均衡|ストレス'], ['協働|技術|職人性|評価', '協力不足|低い品質|対立|成長不足'], ['安心|管理|蓄え|安定', '強欲|所有欲|喪失への恐れ|手放し'], ['困難|孤立|金銭的損失|心配', '回復|利用できる助け|改善|新たな希望'], ['寛大さ|与えることと受け取ること|公平|支援', '条件付きの援助|負債|不平等|一方的な助け'], ['忍耐|長期的成長|評価|投資', '焦り|悪い成果|報われなさ|早すぎる断念'], ['勤勉|熟達|練習|献身', '完璧主義|意欲不足|単調|燃え尽き'], ['自立|豊かさ|自給|洗練', '働きすぎ|経済的依存|浪費|見せかけの成功'], ['遺産|家族の安定|長期的成功|伝統', '経済的不安|家族の対立|短期思考|失われた継承'], ['学び|現実的な機会|向上心|新計画', '先延ばし|機会損失|進展不足|非現実的な目標'], ['信頼性|忍耐|日課|着実な前進', '停滞|頑固|退屈|慎重すぎる'], ['育む力|現実的な配慮|豊かさ|安心', '自己軽視|生活の不均衡|物質的不安|過干渉'], ['繁栄|統率力|安定|賢い管理', '強欲|硬直|物質主義|判断不足'],
];

const majorJa = ['愚者','魔術師','女教皇','女帝','皇帝','教皇','恋人','戦車','力','隠者','運命の輪','正義','吊るされた男','死神','節制','悪魔','塔','星','月','太陽','審判','世界'];
const suitJa: Record<string, string> = { wands: 'ワンド', cups: 'カップ', swords: 'ソード', pentacles: 'ペンタクル' };
const rankJa = ['', 'エース', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'ペイジ', 'ナイト', 'クイーン', 'キング'];

const spreadTranslations: Record<'en' | 'ja', Record<string, { name: string; secondary: string; description: string; positions: [string, string][] }>> = {
  en: {
    single: { name: 'Single Card', secondary: 'THE SINGLE CARD', description: 'Draw one card for the central message and guidance of this moment.', positions: [['Guidance', 'The central message the universe offers you now.']] },
    three_card: { name: 'Flow of Time', secondary: 'THE THREE-CARD SPREAD', description: 'Three cards reveal the energies of past, present, and future.', positions: [['Past', 'Roots and past experiences shaping the situation.'], ['Present', 'Your current circumstances and central energy.'], ['Future', 'The near future along the present path.']] },
    celtic_cross: { name: 'Celtic Cross', secondary: 'THE CELTIC CROSS', description: 'A classic ten-card spread for a deep, panoramic reading.', positions: [['Present', 'The heart of the current situation.'], ['Challenge', 'The obstacle or support crossing your path.'], ['Foundation', 'The deeper basis and unconscious influence.'], ['Past', 'A recent influence now passing away.'], ['Potential', 'The aspiration or highest possible outcome.'], ['Near Future', 'The energy arriving next.'], ['Self', 'Your role and attitude in this situation.'], ['Environment', 'External conditions and the influence of others.'], ['Hopes', 'Your hopes, fears, and inner expectations.'], ['Outcome', 'The likely outcome on the current path.']] },
  },
  ja: {
    single: { name: 'ワンカード', secondary: 'THE SINGLE CARD', description: '1枚のカードから、今この瞬間に必要な中心メッセージを受け取ります。', positions: [['導き', '今、宇宙があなたに届ける中心的なメッセージ。']] },
    three_card: { name: '時の流れ', secondary: 'THE THREE-CARD SPREAD', description: '3枚のカードが過去・現在・未来のエネルギーを映します。', positions: [['過去', '現在に影響する原点と過去の経験。'], ['現在', '今の状況と中心的なエネルギー。'], ['未来', '現在の流れが向かう近い未来。']] },
    celtic_cross: { name: 'ケルト十字', secondary: 'THE CELTIC CROSS', description: '10枚のカードで問いを深く多面的に読み解く伝統的なスプレッド。', positions: [['現状', '今の問題の中心。'], ['課題', '目の前を横切る障害、または助け。'], ['基盤', '深層にある土台と無意識の影響。'], ['過去', '去りつつある直近の影響。'], ['可能性', '望み、または到達しうる最良の結果。'], ['近い未来', '次に訪れるエネルギー。'], ['自分', 'この状況におけるあなたの役割。'], ['環境', '周囲の状況と他者からの影響。'], ['希望', '心の中の希望、恐れ、期待。'], ['結果', '今の道を進んだ先にある結果。']] },
  },
};

export function getLocalizedCategories(language: Language, labels: Record<string, string>): QuestionCategory[] {
  if (language === 'zh') return baseCategories;
  return baseCategories.map(category => ({ ...category, label: labels[category.id] }));
}

export function getLocalizedSpreads(language: Language): SpreadType[] {
  if (language === 'zh') return baseSpreads;
  return baseSpreads.map(spread => {
    const translated = spreadTranslations[language][spread.id];
    return { ...spread, name: translated.name, nameEn: translated.secondary, description: translated.description, positions: spread.positions.map((position, index) => ({ ...position, label: translated.positions[index][0], description: translated.positions[index][1] })) };
  });
}

export function getLocalizedCards(language: Language): TarotCard[] {
  if (language === 'zh') return tarotCards;
  const pairs = language === 'ja' ? jaPairs : enPairs;
  return tarotCards.map((card, index) => {
    const [upright, reversed] = pairs[index];
    const uprightKeywords = upright.split('|');
    const reversedKeywords = reversed.split('|');
    const name = language === 'en' ? card.nameEn : card.arcana === 'major' ? majorJa[card.number] : `${suitJa[card.suit]}の${rankJa[card.number]}`;
    const uprightDescription = language === 'en'
      ? `Upright, ${name} speaks of ${uprightKeywords.join(', ')}. Let these themes illuminate what is unfolding, and respond with awareness and intention.`
      : `正位置の「${name}」は、${uprightKeywords.join('、')}を表します。今起きていることを丁寧に見つめ、意識と意志をもって進んでください。`;
    const reversedDescription = language === 'en'
      ? `Reversed, ${name} points to ${reversedKeywords.join(', ')}. Pause, look beneath the surface, and meet this challenge with patience and honesty.`
      : `逆位置の「${name}」は、${reversedKeywords.join('、')}を示します。立ち止まって表面の奥を見つめ、焦らず誠実に課題と向き合いましょう。`;
    return { ...card, name, uprightKeywords, reversedKeywords, uprightDescription, reversedDescription };
  });
}
