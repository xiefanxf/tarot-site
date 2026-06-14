import { useState } from 'react';
import { Heart, Briefcase, Coins, HeartPulse, Sparkles, ArrowRight } from 'lucide-react';
import Copyright from './Copyright';
import { questionCategories } from '@/data/tarotCards';

interface QuestionPageProps {
  onConfirm: (category: string, question: string) => void;
  onBack: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  heart: <Heart className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  coins: <Coins className="w-5 h-5" />,
  'heart-pulse': <HeartPulse className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
};

export default function QuestionPage({ onConfirm, onBack }: QuestionPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [question, setQuestion] = useState('');

  const handleConfirm = () => {
    if (selectedCategory) {
      onConfirm(selectedCategory, question);
    }
  };

  return (
    <div className="relative z-10 w-full h-full overflow-y-auto">
      {/* Background star mandala */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="spin-slow opacity-[0.06] w-[80vmin] h-[80vmin] max-w-[500px] max-h-[500px]">
          <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
            <circle cx="250" cy="250" r="200" stroke="#C8A97E" strokeWidth="0.5" />
            <circle cx="250" cy="250" r="160" stroke="#C8A97E" strokeWidth="0.3" strokeDasharray="3 6" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <g key={angle}>
                  <line x1={250 + Math.cos(rad) * 80} y1={250 + Math.sin(rad) * 80} x2={250 + Math.cos(rad) * 200} y2={250 + Math.sin(rad) * 200} stroke="#C8A97E" strokeWidth="0.4" />
                  <circle cx={250 + Math.cos(rad) * 200} cy={250 + Math.sin(rad) * 200} r="3" fill="#C8A97E" opacity="0.4" />
                </g>
              );
            })}
            <circle cx="250" cy="250" r="60" stroke="#C8A97E" strokeWidth="0.3" opacity="0.5" />
            <circle cx="250" cy="250" r="30" stroke="#C8A97E" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-10 h-10 border-l border-t border-[#C8A97E]/15 pointer-events-none" />
      <div className="absolute top-4 right-4 w-10 h-10 border-r border-t border-[#C8A97E]/15 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-l border-b border-[#C8A97E]/15 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-r border-b border-[#C8A97E]/15 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-5 py-10 min-h-full">

        {/* Back button */}
        <div className="w-full max-w-md mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[#8BA6C4] hover:text-[#C8A97E] transition-colors text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            <span className="font-body">返回</span>
          </button>
        </div>

        {/* Top decorative line */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#C8A97E]/30" />
          <Sparkles className="w-4 h-4 text-[#C8A97E]/40" />
          <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#C8A97E]/30" />
        </div>

        {/* Title */}
        <h2 className="font-decorative text-3xl md:text-4xl text-[#F0F0F0] mb-2" style={{ letterSpacing: '0.12em' }}>
          占卜指引
        </h2>
        <p className="font-display text-sm text-[#C8A97E] mb-2" style={{ letterSpacing: '0.15em' }}>
          DIVINATION GUIDE
        </p>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-px bg-[#C8A97E]/20" />
          <div className="w-1 h-1 rounded-full bg-[#C8A97E]/30" />
          <div className="w-6 h-px bg-[#C8A97E]/20" />
        </div>

        <p className="text-[#98ACC8] font-body text-sm mb-6 text-center">
          塔罗无法替你做出决定，但它能照见你内心真实的答案
        </p>

        {/* Section label */}
        <div className="w-full max-w-md mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C8A97E]/40" />
            <span className="text-xs text-[#8BA6C4] font-display tracking-wider">选择占卜领域</span>
          </div>
        </div>

        {/* Category selection - 3+2 grid */}
        <div className="w-full max-w-md flex flex-col gap-3 mb-6">
          {/* Row 1: 3 items */}
          <div className="grid grid-cols-3 gap-3">
            {questionCategories.slice(0, 3).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  relative flex flex-col items-center gap-2 py-4 px-2 rounded-xl border-2 transition-all duration-300
                  ${selectedCategory === cat.id
                    ? 'border-[#C8A97E] bg-[#C8A97E]/10 shadow-[0_0_20px_rgba(200,169,126,0.3)]'
                    : 'border-[#C8A97E]/25 bg-[#0A1628]/80 hover:border-[#C8A97E]/50 hover:bg-[#0D1B2E]'
                  }
                `}
              >
                <div className={`transition-colors ${selectedCategory === cat.id ? 'text-[#C8A97E]' : 'text-[#8BA6C4]'}`}>
                  {iconMap[cat.icon]}
                </div>
                <span className={`font-body text-xs ${selectedCategory === cat.id ? 'text-[#C8A97E]' : 'text-[#98ACC8]'}`}>
                  {cat.label}
                </span>
                {selectedCategory === cat.id && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
                )}
              </button>
            ))}
          </div>
          {/* Row 2: 2 items centered */}
          <div className="flex justify-center gap-3">
            {questionCategories.slice(3).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  relative flex flex-col items-center gap-2 py-4 px-2 rounded-xl border-2 transition-all duration-300 flex-1 max-w-[33%]
                  ${selectedCategory === cat.id
                    ? 'border-[#C8A97E] bg-[#C8A97E]/10 shadow-[0_0_20px_rgba(200,169,126,0.3)]'
                    : 'border-[#C8A97E]/25 bg-[#0A1628]/80 hover:border-[#C8A97E]/50 hover:bg-[#0D1B2E]'
                  }
                `}
              >
                <div className={`transition-colors ${selectedCategory === cat.id ? 'text-[#C8A97E]' : 'text-[#8BA6C4]'}`}>
                  {iconMap[cat.icon]}
                </div>
                <span className={`font-body text-xs ${selectedCategory === cat.id ? 'text-[#C8A97E]' : 'text-[#98ACC8]'}`}>
                  {cat.label}
                </span>
                {selectedCategory === cat.id && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative line */}
        <div className="flex items-center gap-2 mb-4 w-full max-w-md">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C8A97E]/15" />
          <Sparkles className="w-3 h-3 text-[#C8A97E]/20" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C8A97E]/15" />
        </div>

        {/* Section label */}
        <div className="w-full max-w-md mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C8A97E]/40" />
            <span className="text-xs text-[#8BA6C4] font-display tracking-wider">默念你的问题（可选）</span>
          </div>
        </div>

        {/* Question input */}
        <div className="w-full max-w-md mb-6">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例如：我该如何改善当前的人际关系？"
            className="w-full h-24 px-4 py-3 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] font-body text-sm placeholder-[var(--text-dim)] focus:outline-none focus:border-[#C8A97E]/50 focus:shadow-[0_0_15px_rgba(200,169,126,0.1)] transition-all resize-none"
          />
        </div>

        {/* Bottom decorative line */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-px bg-[#C8A97E]/15" />
          <div className="w-1 h-1 rounded-full bg-[#C8A97E]/25" />
          <div className="w-8 h-px bg-[#C8A97E]/15" />
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedCategory}
          className="btn-mystical flex items-center gap-2 disabled:opacity-40"
        >
          <span className="relative z-10 flex items-center gap-2">
            开始洗牌
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        {/* Bottom quote */}
        <p className="mt-6 text-[10px] text-[#4A5A72] font-body italic text-center max-w-xs leading-relaxed">
          "牌面如镜像，映照的是你的心"
        </p>

        {/* Copyright */}
        <Copyright />

        {/* Bottom spacer for scroll */}
        <div className="h-4" />
      </div>
    </div>
  );
}
