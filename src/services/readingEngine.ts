import type { DrawnCard, Language, SpreadType } from '@/types/tarot';
import { translateMessage } from '@/i18n';

export interface ReadingSynthesis {
  summary: string;
  patterns: string[];
  guidance: string[];
}

const categoryNames: Record<Language, Record<string, string>> = {
  zh: { love: '感情', career: '事业', wealth: '财富', health: '身心', general: '当前问题' },
  en: { love: 'love life', career: 'career', wealth: 'finances', health: 'wellbeing', general: 'current question' },
  ja: { love: '恋愛', career: '仕事', wealth: '金運', health: '心身', general: '現在の問い' },
};

const pairInsights: Record<string, Record<Language, string>> = {
  'm6:m15': { zh: '恋人与恶魔同时出现，提示吸引力很强，但需要分辨真诚的联结与依赖、控制或执念。', en: 'The Lovers with The Devil signals powerful attraction; distinguish genuine connection from dependency, control, or fixation.', ja: '恋人と悪魔の組み合わせは強い引力を示します。純粋な絆と、依存・支配・執着を見分けてください。' },
  'm13:m16': { zh: '死神与高塔共同出现，旧结构正在快速瓦解。这不是小修小补，而是为新阶段腾出空间。', en: 'Death with The Tower marks the rapid collapse of an old structure. This is a true reset, not a minor adjustment.', ja: '死神と塔は、古い構造が急速に崩れる本格的な転換を示します。小さな修正ではなく、再出発です。' },
  'm17:m19': { zh: '星星与太阳彼此呼应，希望正在转化为可见的进展；保持坦诚，你会更快看清方向。', en: 'The Star and The Sun turn hope into visible progress. Stay open and honest to see the path more clearly.', ja: '星と太陽は、希望が目に見える進展へ変わる流れです。率直さを保つほど道が明確になります。' },
  'm2:m18': { zh: '女祭司与月亮强化了直觉主题，但也提醒你在行动前确认事实，不要把恐惧当作预感。', en: 'The High Priestess and The Moon amplify intuition, while asking you to verify facts rather than mistake fear for insight.', ja: '女教皇と月は直感を強めますが、恐れを予感と取り違えず、行動前に事実を確かめるよう促します。' },
  'm1:m10': { zh: '魔术师与命运之轮表明机会已经出现，而你的主动选择决定它能否真正落地。', en: 'The Magician and Wheel of Fortune show an opening whose outcome depends on your deliberate action.', ja: '魔術師と運命の輪は好機の到来を示し、それを形にできるかは主体的な行動にかかっています。' },
};

function join(language: Language, values: string[]) {
  return values.join(language === 'en' ? ', ' : '、');
}

function findPair(cards: DrawnCard[]) {
  const ids = new Set(cards.map(item => item.card.id));
  return Object.entries(pairInsights).find(([key]) => key.split(':').every(id => ids.has(id)))?.[1];
}

export function synthesizeReading(cards: DrawnCard[], spread: SpreadType, category: string, question: string, language: Language): ReadingSynthesis {
  if (!cards.length) return { summary: '', patterns: [], guidance: [] };
  const topic = categoryNames[language][category] ?? categoryNames[language].general;
  const reversed = cards.filter(item => item.isReversed);
  const majors = cards.filter(item => item.card.arcana === 'major');
  const elements = cards.reduce<Record<string, number>>((counts, item) => ({ ...counts, [item.card.element]: (counts[item.card.element] ?? 0) + 1 }), {});
  const dominantElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0]?.[0];
  const suitCounts = cards.filter(item => item.card.suit !== 'major').reduce<Record<string, number>>((counts, item) => ({ ...counts, [item.card.suit]: (counts[item.card.suit] ?? 0) + 1 }), {});
  const dominantSuit = Object.entries(suitCounts).sort((a, b) => b[1] - a[1])[0];
  const numberCounts = cards.reduce<Record<number, number>>((counts, item) => ({ ...counts, [item.card.number]: (counts[item.card.number] ?? 0) + 1 }), {});
  const repeatedNumber = Object.entries(numberCounts).find(([, count]) => count >= 2)?.[0];
  const pair = findPair(cards);
  const first = cards[0];
  const outcome = cards[cards.length - 1];
  const firstKeywords = first.isReversed ? first.card.reversedKeywords : first.card.uprightKeywords;
  const outcomeKeywords = outcome.isReversed ? outcome.card.reversedKeywords : outcome.card.uprightKeywords;

  let summary: string;
  if (cards.length === 1) {
    summary = translateMessage(language, 'summarySingle', { card: first.card.name, category: topic });
    summary += translateMessage(
      language,
      first.isReversed ? 'summarySingleReversed' : 'summarySingleUpright',
      { keywords: join(language, firstKeywords.slice(0, 2)) },
    );
  } else if (language === 'zh') {
    summary = question.trim()
      ? `围绕“${question.trim()}”，${spread.name}显示：起点由${first.card.name}的“${join(language, firstKeywords.slice(0, 2))}”定调，${spread.positions[cards.length - 1]?.label ?? '结果'}位置的${outcome.card.name}则把方向落在“${join(language, outcomeKeywords.slice(0, 2))}”。`
      : `这次${topic}占卜由${first.card.name}定下“${join(language, firstKeywords.slice(0, 2))}”的基调，并由${outcome.card.name}把能量导向“${join(language, outcomeKeywords.slice(0, 2))}”。`;
  } else if (language === 'ja') {
    summary = question.trim()
      ? `「${question.trim()}」について、${spread.name}は始点の${first.card.name}が「${join(language, firstKeywords.slice(0, 2))}」を示し、${spread.positions[cards.length - 1]?.label ?? '結果'}の${outcome.card.name}が「${join(language, outcomeKeywords.slice(0, 2))}」へ向かう流れを描いています。`
      : `${topic}のリーディングは、${first.card.name}の「${join(language, firstKeywords.slice(0, 2))}」から始まり、${outcome.card.name}の「${join(language, outcomeKeywords.slice(0, 2))}」へ向かいます。`;
  } else {
    summary = question.trim()
      ? `For “${question.trim()},” ${spread.name} begins with ${first.card.name} and its themes of ${join(language, firstKeywords.slice(0, 2))}; ${outcome.card.name} in the ${spread.positions[cards.length - 1]?.label ?? 'outcome'} position points toward ${join(language, outcomeKeywords.slice(0, 2))}. `
      : `This ${topic} reading moves from ${first.card.name} and ${join(language, firstKeywords.slice(0, 2))} toward ${outcome.card.name} and ${join(language, outcomeKeywords.slice(0, 2))}. `;
  }

  const patterns: string[] = [];
  if (pair) patterns.push(pair[language]);
  if (majors.length >= Math.max(2, Math.ceil(cards.length / 2))) {
    patterns.push(language === 'zh' ? `${majors.length}张大阿卡纳让这次占卜更像一个长期转折，而不只是短期情绪。` : language === 'ja' ? `大アルカナが${majors.length}枚あり、一時的な気分よりも長期的な転機を示しています。` : `${majors.length} Major Arcana cards frame this as a lasting turning point rather than a passing mood.`);
  }
  if (dominantSuit && dominantSuit[1] >= 2) {
    const suitMeaning: Record<string, Record<Language, string>> = {
      wands: { zh: '权杖集中强调行动、热情与创造冲动。', en: 'Wands concentrate the reading around action, drive, and creative momentum.', ja: 'ワンドの集中は、行動力・情熱・創造的な勢いを強調します。' },
      cups: { zh: '圣杯集中说明情感、关系与内在需要是问题核心。', en: 'Cups place emotion, relationships, and inner needs at the center.', ja: 'カップの集中は、感情・関係性・内なる欲求が中心であることを示します。' },
      swords: { zh: '宝剑集中提示沟通、判断与思维压力需要被认真处理。', en: 'Swords highlight communication, decisions, and mental pressure that need direct attention.', ja: 'ソードの集中は、対話・判断・思考の負担に向き合う必要を示します。' },
      pentacles: { zh: '星币集中把重点落在现实资源、金钱、身体与稳定性上。', en: 'Pentacles ground the issue in resources, money, the body, and practical stability.', ja: 'ペンタクルの集中は、資源・お金・身体・現実的な安定を重視します。' },
    };
    patterns.push(suitMeaning[dominantSuit[0]][language]);
  }
  if (repeatedNumber) {
    patterns.push(language === 'zh' ? `数字${repeatedNumber}重复出现，说明同一课题正在不同生活层面反复要求你的注意。` : language === 'ja' ? `数字${repeatedNumber}の反復は、同じテーマが複数の生活領域で注意を求めていることを示します。` : `The repeated number ${repeatedNumber} suggests one lesson is asking for attention across different parts of life.`);
  }
  if (spread.id === 'three_card' && cards.length === 3) {
    patterns.push(language === 'zh' ? `过去的${cards[0].card.name}正在过渡到现在的${cards[1].card.name}，而${cards[2].card.name}说明下一步最需要有意识地回应未来趋势。` : language === 'ja' ? `過去の${cards[0].card.name}から現在の${cards[1].card.name}へ移り、未来の${cards[2].card.name}にどう応えるかが次の焦点です。` : `${cards[0].card.name} in the past flows into ${cards[1].card.name} now; your next task is to respond consciously to ${cards[2].card.name} ahead.`);
  }
  if (spread.id === 'celtic_cross' && cards.length >= 10) {
    patterns.push(language === 'zh' ? `核心位置的${cards[0].card.name}与挑战位置的${cards[1].card.name}形成张力，最终由结果位置的${cards[9].card.name}给出整合方向。` : language === 'ja' ? `中心の${cards[0].card.name}と課題の${cards[1].card.name}が緊張関係を作り、結果の${cards[9].card.name}が統合の方向を示します。` : `${cards[0].card.name} at the center is tested by ${cards[1].card.name}; ${cards[9].card.name} in the outcome shows how that tension can resolve.`);
  }

  const guidance: string[] = [];
  const elementGuidance: Record<string, Record<Language, string>> = {
    Fire: { zh: '先确定最重要的一步，再把热情转化为今天能完成的行动。', en: 'Choose the single most important next step and turn momentum into action today.', ja: '最も大切な一歩を決め、情熱を今日できる行動へ変えてください。' },
    Water: { zh: '先说清自己的真实感受，再决定要靠近、等待还是放手。', en: 'Name the feeling honestly before deciding whether to move closer, wait, or release.', ja: '本当の気持ちを言葉にしてから、近づく・待つ・手放すを決めましょう。' },
    Air: { zh: '把事实、推测和恐惧分开写下，再做决定。', en: 'Separate facts, assumptions, and fears on paper before making the decision.', ja: '事実・推測・恐れを書き分けてから判断してください。' },
    Earth: { zh: '用时间、金钱、身体感受和可执行条件检验你的选择。', en: 'Test the choice against time, money, physical wellbeing, and practical constraints.', ja: '時間・お金・身体感覚・実行条件に照らして選択を確かめてください。' },
  };
  if (dominantElement) guidance.push(elementGuidance[dominantElement]?.[language] ?? '');
  if (reversed.length) guidance.push(language === 'zh' ? `${reversed.length}张逆位牌不是否定答案，而是在指出阻力所在；优先处理${join(language, reversed[0].card.reversedKeywords.slice(0, 2))}。` : language === 'ja' ? `逆位置${reversed.length}枚は否定ではなく抵抗の場所を示します。まず${join(language, reversed[0].card.reversedKeywords.slice(0, 2))}に向き合いましょう。` : `${reversed.length} reversal${reversed.length > 1 ? 's' : ''} do not negate the reading; they locate resistance. Begin with ${join(language, reversed[0].card.reversedKeywords.slice(0, 2))}.`);
  else guidance.push(language === 'zh' ? '全部正位说明外在推进条件较顺，但仍需要你主动选择，而不是被动等待。' : language === 'ja' ? 'すべて正位置で流れは素直ですが、受け身で待つのではなく自分で選ぶことが必要です。' : 'All cards are upright, so conditions are relatively open—but progress still requires a deliberate choice rather than passive waiting.');

  return { summary, patterns: patterns.filter(Boolean), guidance: guidance.filter(Boolean) };
}
