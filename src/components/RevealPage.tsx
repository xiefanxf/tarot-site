import { useMemo } from 'react';
import { Sparkles, RotateCcw, Download, Star, Moon, Sun } from 'lucide-react';
import Copyright from './Copyright';
import type { DrawnCard, SpreadType } from '@/types/tarot';

interface RevealPageProps {
  drawnCards: DrawnCard[];
  spread: SpreadType;
  category: string;
  question: string;
  onReset: () => void;
}

const categoryLabels: Record<string, string> = {
  love: '感情姻缘',
  career: '事业前程',
  wealth: '财富运势',
  health: '健康身心',
  general: '综合指引',
};

const cardBackUrl = `${import.meta.env.BASE_URL}card_back.jpg`;

function getInsightSummary(cards: DrawnCard[], spread: SpreadType, category: string): string {
  const reversedCount = cards.filter(c => c.isReversed).length;
  const majorCount = cards.filter(c => c.card.arcana === 'major').length;

  let summary = '';

  // Spread-specific summary
  if (spread.id === 'single') {
    const card = cards[0];
    summary = `这张${card.card.name}为你的${categoryLabels[category] || '问题'}带来了核心指引。`;
    if (card.isReversed) {
      summary += `牌面呈逆位，暗示你需要更加留意${card.card.reversedKeywords.slice(0, 2).join('、')}等方面的挑战。`;
    } else {
      summary += `牌面正位，${card.card.uprightKeywords.slice(0, 2).join('、')}的能量正在支持你。`;
    }
  } else if (spread.id === 'three_card') {
    const [past, present, future] = cards;
    summary = `从${past.card.name}的过往经历，到${present.card.name}的当前状态，再到${future.card.name}的未来走向，`;
    summary += `时间之流揭示了一条清晰的发展脉络。`;
    if (reversedCount > 1) {
      summary += `多张逆位牌暗示这段时间充满了内在挑战，需要更多的自我反思。`;
    } else if (reversedCount === 0) {
      summary += `三张牌均为正位，显示能量流动顺畅，前景乐观。`;
    }
  } else {
    summary = `凯尔特十字牌阵为你提供了深度的全景解析。`;
    if (majorCount >= 5) {
      summary += `大量大阿卡纳牌的出现，表明这是一个命运中的重要转折时刻，具有深远的意义。`;
    } else {
      summary += `大小阿卡纳的交织显示，这既受命运力量影响，也与你的日常选择密切相关。`;
    }
  }

  return summary;
}

function getGuidance(cards: DrawnCard[]): string[] {
  const guidance: string[] = [];
  const elements = cards.map(c => c.card.element);
  const elementCounts: Record<string, number> = {};
  elements.forEach(e => { elementCounts[e] = (elementCounts[e] || 0) + 1; });

  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (dominantElement === 'Fire') {
    guidance.push('火元素的主导提醒你保持热情和行动力，但注意不要过于冲动。');
  } else if (dominantElement === 'Water') {
    guidance.push('水元素的主导邀请你更多地倾听内心的声音，信任你的直觉和感受。');
  } else if (dominantElement === 'Air') {
    guidance.push('风元素的主导提示你运用理性思考，保持开放的心态去接受新的想法。');
  } else if (dominantElement === 'Earth') {
    guidance.push('土元素的主导建议你脚踏实地，关注现实中的具体行动和物质基础。');
  }

  const reversedCount = cards.filter(c => c.isReversed).length;
  if (reversedCount === 0) {
    guidance.push('所有牌均为正位，显示当前能量流动顺畅。保持觉知，顺势而为。');
  } else if (reversedCount <= 2) {
    guidance.push('少量逆位牌提示你需要留意某些方面的内在阻力，将其视为成长的机会。');
  } else {
    guidance.push('较多逆位牌表明你可能正处于一个内在转变期。给自己时间和耐心，慢慢地梳理和调整。');
  }

  return guidance;
}

export default function RevealPage({ drawnCards, spread, category, question, onReset }: RevealPageProps) {
  const summary = useMemo(() => getInsightSummary(drawnCards, spread, category), [drawnCards, spread, category]);
  const guidance = useMemo(() => getGuidance(drawnCards), [drawnCards]);

  const reversedCount = drawnCards.filter(c => c.isReversed).length;
  const majorCount = drawnCards.filter(c => c.card.arcana === 'major').length;

  const handleDownload = () => {
    // Create a text report
    const lines: string[] = [
      '╔══════════════════════════════════════╗',
      '║         神 秘 塔 罗 解 读            ║',
      '╚══════════════════════════════════════╝',
      '',
      `占卜领域：${categoryLabels[category] || '综合'}`,
      question ? `你的问题：${question}` : '',
      `使用牌阵：${spread.name}`,
      '',
      '━'.repeat(40),
      '【 整体洞察 】',
      '━'.repeat(40),
      summary,
      '',
      '━'.repeat(40),
      '【 牌面详情 】',
      '━'.repeat(40),
      ...drawnCards.map((dc, i) => {
        const pos = spread.positions[i];
        return [
          '',
          `${pos?.label || `第${i + 1}张`}：${dc.card.name}${dc.isReversed ? '（逆位）' : ''}`,
          `关键词：${(dc.isReversed ? dc.card.reversedKeywords : dc.card.uprightKeywords).join('、')}`,
          dc.isReversed ? dc.card.reversedDescription : dc.card.uprightDescription,
        ].join('\n');
      }),
      '',
      '━'.repeat(40),
      '【 指引与建议 】',
      '━'.repeat(40),
      ...guidance.map((g, i) => `${i + 1}. ${g}`),
      '',
      '━'.repeat(40),
      '愿星辰指引你的道路',
      '━'.repeat(40),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `塔罗解读_${new Date().toLocaleDateString('zh-CN')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative z-10 w-full h-full overflow-y-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#C8A97E]" />
            <h2 className="font-display text-2xl md:text-3xl text-[#F0F0F0]" style={{ letterSpacing: '0.1em' }}>
              完整解读
            </h2>
            <Sparkles className="w-5 h-5 text-[#C8A97E]" />
          </div>
          <p className="text-xs text-[#98ACC8] font-body">
            {categoryLabels[category] || '综合'} · {spread.name}
          </p>
          {question && (
            <p className="text-xs text-[#8BA6C4] font-body mt-1 italic">
              「{question}」
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[#C8A97E]" />
            <span className="text-xs text-[#98ACC8] font-body">{majorCount} 张大阿卡纳</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-[#98ACC8]" />
            <span className="text-xs text-[#98ACC8] font-body">{drawnCards.length - majorCount} 张小阿卡纳</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#D4A0A0]" />
            <span className="text-xs text-[#98ACC8] font-body">{reversedCount} 张逆位</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[var(--bg-panel)] backdrop-blur border border-[var(--border-subtle)] rounded-xl p-5 mb-6">
          <h3 className="font-display text-sm text-[#C8A97E] mb-3" style={{ letterSpacing: '0.1em' }}>
            整体洞察
          </h3>
          <p className="text-sm text-[#F0F0F0] font-body leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Card details */}
        <div className="space-y-4 mb-8">
          {drawnCards.map((dc, index) => {
            const pos = spread.positions[index];
            return (
              <div
                key={index}
                className="bg-[var(--bg-panel)] backdrop-blur border border-[var(--border-subtle)] rounded-xl p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Card thumbnail */}
                  <div className="flex-shrink-0 w-16 h-[5.5rem] rounded-lg overflow-hidden bg-[#0A1628]"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(200, 169, 126, 0.1)' }}
                  >
                    <img
                      src={dc.card.image || cardBackUrl}
                      alt={dc.card.name}
                      className="w-full h-full object-cover"
                      style={{
                        transform: `${dc.isReversed ? 'rotate(180deg)' : ''} scale(1.08)`.trim(),
                      }}
                      onError={(e) => { e.currentTarget.src = cardBackUrl; }}
                    />
                  </div>

                  {/* Card info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A2536] text-[#C8A97E] font-display">
                        {pos?.label || `第${index + 1}张`}
                      </span>
                      {dc.isReversed && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3A2020] text-[#D4A0A0] font-body">
                          逆位
                        </span>
                      )}
                    </div>

                    <h4 className="font-display text-base text-[#F0F0F0] mb-0.5">
                      {dc.card.name}
                    </h4>
                    <p className="text-[9px] text-[#8BA6C4] font-display mb-2">
                      {dc.card.nameEn}
                    </p>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(dc.isReversed ? dc.card.reversedKeywords : dc.card.uprightKeywords).slice(0, 4).map((kw, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-2 py-0.5 rounded-full bg-[#C8A97E]/10 text-[#C8A97E] font-body"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#98ACC8] font-body leading-relaxed">
                      {dc.isReversed ? dc.card.reversedDescription : dc.card.uprightDescription}
                    </p>

                    {/* Position meaning */}
                    {pos?.description && (
                      <p className="text-[10px] text-[#8BA6C4] font-body mt-2 italic">
                        {pos.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guidance */}
        <div className="bg-[var(--bg-panel)] backdrop-blur border border-[var(--border-subtle)] rounded-xl p-5 mb-8">
          <h3 className="font-display text-sm text-[#C8A97E] mb-3" style={{ letterSpacing: '0.1em' }}>
            指引与建议
          </h3>
          <div className="space-y-2">
            {guidance.map((g, i) => (
              <p key={i} className="text-sm text-[#F0F0F0] font-body leading-relaxed">
                <span className="text-[#C8A97E] mr-2">{i + 1}.</span>
                {g}
              </p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pb-8">
          <button
            onClick={handleDownload}
            className="btn-mystical flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="relative z-10">保存解读</span>
          </button>
          <button
            onClick={onReset}
            className="btn-mystical flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="relative z-10">重新占卜</span>
          </button>
        </div>

        {/* Footer blessing */}
        <div className="text-center pb-4">
          <p className="text-xs text-[#8BA6C4] font-body">
            愿星辰指引你的道路
          </p>
        </div>

        {/* Copyright */}
        <Copyright />
      </div>
    </div>
  );
}
