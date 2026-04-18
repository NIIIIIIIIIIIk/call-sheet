import React, { useState, useEffect, useRef } from 'react';
import { ParallaxLayer } from './ParallaxLayer';
import { NoButton } from '../LandingPage/NoButton';
import { SuccessModal } from '../UI/SuccessModal';
import { EasterEggModal } from '../UI/EasterEggModal';
import { unlockApp } from '../../utils/storage';
import { checkEasterEgg } from '../../utils/easterEggs';
import { trackVisit } from '../../utils/analytics';
import { DIRECTOR_NAME, PRODUCER_NAME } from '../../utils/constants';
import { TelegramLink } from '../UI/TelegramLink';
import styles from './DuneLanding.module.css';

interface DuneLandingProps {
  onUnlock: () => void;
}

export const DuneLanding: React.FC<DuneLandingProps> = ({ onUnlock }) => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEgg, setEasterEgg] = useState(null);
  const [denyAttempts, setDenyAttempts] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [spiceParticles, setSpiceParticles] = useState<Array<{ id: number; x: number; y: number; scale: number; delay: number }>>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Генерируем частицы специи
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 5
    }));
    setSpiceParticles(particles);

    // Скрываем лоадер
    setTimeout(() => {
      setIsLoaded(true);
      const loader = document.querySelector('.loading-spice');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }
    }, 1000);
  }, []);

  const handleConfirm = () => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    
    setShowSuccessModal(true);
    
    const egg = checkEasterEgg('unlock');
    if (egg) {
      setEasterEgg(egg);
      setShowEasterEgg(true);
    }
    
    trackVisit('unlock');
    unlockApp();
  };

  const handleSuccessComplete = () => {
    setShowSuccessModal(false);
    onUnlock();
  };

  const handleMemeShown = () => {
    setDenyAttempts(prev => prev + 1);
  };

  const getDenyMessage = () => {
    const messages = [
      '...',
    ];
    return messages[denyAttempts % messages.length];
  };

  // Аналитика для Telegram
  const handleTelegramAnalytics = () => {
    console.log('Telegram link clicked');
    // @ts-ignore
    if (typeof ym !== 'undefined') {
      // @ts-ignore
      ym(XXXXXX, 'reachGoal', 'telegram_click');
    }
  };

  return (
    <>
      <div className={styles.duneContainer} ref={containerRef}>
        {/* Параллакс слои */}
        <div className={styles.parallaxScene}>
          <ParallaxLayer 
            imageUrl="/image/fons/duna/duna.png"
            speed={0.1}
            className={styles.layerBase}
          />
          
          {/* Частицы специи */}
          <div className={styles.spiceParticles}>
            {spiceParticles.map(particle => (
              <div
                key={particle.id}
                className={styles.spiceParticle}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  transform: `scale(${particle.scale})`,
                  animationDelay: `${particle.delay}s`
                }}
              />
            ))}
          </div>
        </div> 

        {/* Контент */}
        <div className={`${styles.content} ${isLoaded ? styles.loaded : ''}`}>
          <div className={styles.terminal}>
            {/* Декоративная рамка */}
            <div className={styles.fremenBorder}>
              <div className={styles.cornerTopLeft} />
              <div className={styles.cornerTopRight} />
              <div className={styles.cornerBottomLeft} />
              <div className={styles.cornerBottomRight} />
            </div>

            <div className={styles.messageBox}>
              <div className={styles.line}>
                <span className={styles.prompt}>&gt;</span> 
                <span className={styles.fremen}>Для:</span> {PRODUCER_NAME}
              </div>
              
              <div className={styles.line}>
                <span className={styles.prompt}>&gt;</span> 
                <span className={styles.fremen}>От:</span> {DIRECTOR_NAME}
              </div>
              
              <div className={styles.line}>
                <span className={styles.prompt}>&gt;</span> 
                <span className={styles.spiceText}>В процессе разработки...</span>
              </div>

              <div className={styles.divider}>
                <span className={styles.spice}></span>
              </div>

              <div className={styles.proposal}>
                <div className={styles.proposalHeader}>
                  <span className={styles.spice}>✦</span> PROJECT: CINEMA_v2
                  <span className={styles.spice}>✦</span>
                </div>
                
                <div className={styles.proposalItem}>
                  <span className={styles.tag}>SCENE:</span> 
                  <span className={styles.value}>Дюна: третья</span>
                </div>
                
                <div className={styles.proposalItem}>
                  <span className={styles.tag}>LOCATION:</span> 
                  <span className={styles.value}>Престижный люкс - IMAX</span>
                </div>
                
                <div className={styles.proposalItem}>
                  <span className={styles.tag}>TIME:</span> 
                  <span className={styles.value}>18 декабря 2026</span>
                </div>
                
                <div className={styles.statusLine}>
                  <span className={styles.tag}>Статус:</span> 
                  <span className={styles.pending}>
                    В ПРИОРИТЕТЕ
                    <span className={styles.cursor}>_</span>
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.confirmButton}
                onClick={handleConfirm}
                disabled={isUnlocking}
              >
                Ёёёёёёу (ДА!)
              </button>
              
              <div className={styles.denyWrapper}>
                <NoButton onShowMeme={handleMemeShown} />
                {denyAttempts > 0 && (
                  <div className={styles.denyMessage}>
                    {getDenyMessage()}
                  </div>
                )}
              </div>
            </div>

            {/* ФУТЕР С TELEGRAM */}
            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                <span className={styles.footerText}>Вопросы:</span>
                <TelegramLink 
                  username="niiiiiiiiiiiiiiiii_iiiiiiik"
                  onAnalytics={handleTelegramAnalytics}
                />
              </div>
              <div className={styles.footerDivider}>
              </div>
              <div className={styles.footerRight}>
                <span className={styles.footerIcon}>⌬</span>
                <span className={styles.footerText}>БЕЗ ПРАВ И ОГРАНИЧЕНИЙ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Визуальные эффекты */}
        <div className={styles.heatHaze} />
      </div>
      
      {showSuccessModal && (
        <SuccessModal onComplete={handleSuccessComplete} />
      )}
      
      {showEasterEgg && easterEgg && (
        <EasterEggModal egg={easterEgg} onClose={() => setShowEasterEgg(false)} />
      )}
    </>
  );
};