import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  isDark: boolean;
}

export default function SplashScreen({ onComplete, isDark }: SplashScreenProps) {
  const [phase, setPhase] = useState<'show' | 'fade'>('show');

  const preloaded = useRef(false);
 
 useEffect(() => {
    // Preload images immediately
    if (!preloaded.current) {
      preloaded.current = true;
      const preloadDay = new Image();
      preloadDay.src = import.meta.env.BASE_URL + 'splash_day.jpg';
      const preloadNight = new Image();
      preloadNight.src = import.meta.env.BASE_URL + 'splash_night.jpg';
    }
 
    const showTimer = setTimeout(() => {
      setPhase('fade');
    }, 800);
 
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1400);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const splashImage = isDark ? import.meta.env.BASE_URL + 'splash_night.jpg' : import.meta.env.BASE_URL + 'splash_day.jpg';

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: isDark ? '#0A1628' : '#F5F0E8' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fade' ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Full screen splash image */}
      <motion.img
        src={splashImage}
        alt="SOLARIS LUNA"
        className="w-full h-full object-contain"
        draggable={false}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        loading="eager"
      />

      {/* Text overlay with Cinzel font */}
      <motion.div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ bottom: '24%' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h1
          className="font-decorative text-3xl md:text-4xl tracking-[0.3em]"
          style={{
            color: isDark ? '#C8A97E' : '#8B7355',
            textShadow: isDark
              ? '0 0 30px rgba(200,169,126,0.6), 0 0 60px rgba(200,169,126,0.3), 0 2px 4px rgba(0,0,0,0.8)'
              : '0 0 20px rgba(139,115,85,0.4), 0 0 40px rgba(139,115,85,0.2), 0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          SOLARIS LUNA
        </h1>
      </motion.div>
    </motion.div>
  );
}
