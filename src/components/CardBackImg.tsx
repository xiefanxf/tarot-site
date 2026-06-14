interface CardBackImgProps {
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
  loading?: 'eager' | 'lazy';
}

export default function CardBackImg({ className = '', style, draggable = false, loading = 'eager' }: CardBackImgProps) {
  return (
    <>
      <img className={`card-back-dark ${className}`} src="card_back.jpg?v=1" alt="" draggable={draggable} loading={loading} style={style} />
      <img className={`card-back-light ${className}`} src="card_back_light.jpg?v=1" alt="" draggable={draggable} loading={loading} style={style} />
    </>
  );
}
