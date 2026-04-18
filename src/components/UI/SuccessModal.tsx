import React, { useEffect, useState } from 'react';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  onComplete: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Анимация появления
    setTimeout(() => setIsVisible(true), 50);

    // Автоматическое закрытие через 2.5 секунды
    const timer = setTimeout(() => {
      handleClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div 
      className={`${styles.overlay} ${isVisible ? styles.visible : ''} ${isLeaving ? styles.leaving : ''}`}
      onClick={handleClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageContainer}>
          {!imageLoaded && (
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
              <span>LOADING...</span>
            </div>
          )}
          <img 
            src="../../image/absolute.jpg" 
            alt="Success"
            className={styles.image}
            style={{ opacity: imageLoaded ? 1 : 0 }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              // Fallback на гифку если локальное изображение не найдено
              const img = document.querySelector(`.${styles.image}`) as HTMLImageElement;
              if (img) {
                img.src = 'https://media1.tenor.com/m/gqwHcHICK6MAAAAC/actor-jason-statham-dark-sunglasses.gif';
              }
            }}
          />
        </div>
        <div className={styles.message}>
        </div>
        <div className={styles.subtitle}>
          Утверждено PRODUSER
        </div>
      </div>
    </div>
  );
};