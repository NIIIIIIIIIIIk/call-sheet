import React, { useState } from 'react';
import { PRODUCER_PHRASES } from '../../types';
import styles from './LandingPage.module.css';

// Коллекция киношных мемов и гифок
const MEME_COLLECTION = [
  {
    url: '../../image/mems/hom.gif',
  },
  {
    url: '../../image/mems/hom2.gif',
  },
  {
    url: '../../image/mems/sen2.jpg',
  },
  {
    url: '../../image/mems/timoti.jpg',
  },
  {
    url: '../../image/mems/denny.jpg',
  },
 
];

interface NoButtonProps {
  onShowMeme?: () => void;
}

interface Meme {
  url: string;
  phrase: string;
  movie: string;
}

export const NoButton: React.FC<NoButtonProps> = ({ onShowMeme }) => {
  const [showMeme, setShowMeme] = useState(false);
const [currentMeme, setCurrentMeme] = useState<Meme | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  

  const handleClick = () => {
    // Выбираем случайный мем
    const randomMeme = MEME_COLLECTION[Math.floor(Math.random() * MEME_COLLECTION.length)];
    setCurrentMeme(randomMeme);
    setShowMeme(true);
    setClickCount(prev => prev + 1);
    
    // Меняем текст на кнопке
    setPhraseIndex(clickCount % PRODUCER_PHRASES.length);
    
    // Скрываем мем через 1,5 секунды
    setTimeout(() => {
      setShowMeme(false);
    }, 1500);
    
    // Опциональный колбэк для родителя
    if (onShowMeme) {
      onShowMeme();
    }
  };

  return (
    <>
      <button
        className={styles.noButton}
        onClick={handleClick}
      >
        [{PRODUCER_PHRASES[phraseIndex]}]
      </button>
      
      {showMeme && currentMeme && (
        <div className={styles.memeOverlay}>
          <div className={styles.memeContainer}>
            <img 
              src={currentMeme.url} 
              alt={currentMeme.phrase}
              className={styles.memeImage}
            />
            <div className={styles.memeCaption}>
              <div className={styles.memePhrase}>"{currentMeme.phrase}"</div>
              <div className={styles.memeMovie}>— {currentMeme.movie}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};