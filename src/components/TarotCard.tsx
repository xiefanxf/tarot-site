import { useState, useCallback } from 'react';
import type { TarotCard as TarotCardType } from '@/types/tarot';

interface TarotCardProps {
  card: TarotCardType;
  isReversed?: boolean;
  isFlipped?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const sizeMap = {
  sm: { w: 88, h: 132 },
  md: { w: 110, h: 165 },
  lg: { w: 132, h: 198 },
};

function CardInner({
  card,
  isReversed,
  showFront,
}: {
  card: TarotCardType;
  isReversed: boolean;
  showFront: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = card.image && !imgError;

  const frontTransform = isReversed
    ? 'scale(1.08) rotate(180deg)'
    : 'scale(1.08)';

  return (
    <div className={`tarot-card w-full h-full ${showFront ? 'flipped' : ''}`}>
      <div className="tarot-card-inner">
        {/* Back face */}
        <div className="tarot-card-face tarot-card-back">
          <img
            className="card-back-dark"
            src={`${import.meta.env.BASE_URL}card_back.jpg`}
            alt=""
            draggable={false}
            loading="eager"
          />
          <img
            className="card-back-light"
            src={`${import.meta.env.BASE_URL}card_back_light.jpg`}
            alt=""
            draggable={false}
            loading="eager"
          />
        </div>
        {/* Front face */}
        <div className="tarot-card-face tarot-card-front">
          {hasImage ? (
            <img
              src={card.image}
              alt={card.name}
              draggable={false}
              loading="eager"
              onError={() => setImgError(true)}
              style={{ transform: frontTransform }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1520] to-[#0A1628]">
              <span
                className="text-[#C8A97E] text-center px-2"
                style={{ fontSize: '10px' }}
              >
                {card.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TarotCard({
  card,
  isReversed = false,
  isFlipped = false,
  isRevealed = false,
  onClick,
  size = 'md',
  className = '',
  style,
  disabled = false,
}: TarotCardProps) {
  const s = sizeMap[size];
  const showFront = isFlipped || isRevealed;

  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
  }, [onClick, disabled]);

  return (
    <div
      className={className}
      style={{ width: s.w, height: s.h, ...style }}
      onClick={handleClick}
    >
      <CardInner card={card} isReversed={isReversed} showFront={showFront} />
    </div>
  );
}
