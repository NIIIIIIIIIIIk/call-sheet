import React from 'react';
import styles from './TelegramLink.module.css';

interface TelegramLinkProps {
  username: string;
  className?: string;
  onAnalytics?: () => void;
}

export const TelegramLink: React.FC<TelegramLinkProps> = ({ 
  username, 
  className = '',
  onAnalytics 
}) => {
  
  const getTelegramUrl = (): string => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|windows phone|blackberry|mobile/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);
    const isWindowsPhone = /windows phone/i.test(ua);
    const isDesktop = !isMobile;
    
    // Все мобильные устройства используют tg://
    if (isMobile) {
      return `tg://resolve?domain=${username}`;
    }
    
    // Десктоп тоже может использовать tg:// если установлен Telegram Desktop
    if (isDesktop) {
      return `tg://resolve?domain=${username}`;
    }
    
    // Fallback
    return `tg://resolve?domain=${username}`;
  };

  const getWebUrl = (): string => {
    return `https://t.me/${username}`;
  };

  const detectTelegramApp = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `tg://resolve?domain=${username}`;
      
      const timer = setTimeout(() => {
        document.body.removeChild(iframe);
        resolve(false);
      }, 500);
      
      iframe.onload = () => {
        clearTimeout(timer);
        document.body.removeChild(iframe);
        resolve(true);
      };
      
      document.body.appendChild(iframe);
    });
  };

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Отправляем аналитику если нужно
    if (onAnalytics) {
      onAnalytics();
    }
    
    const tgUrl = getTelegramUrl();
    const webUrl = getWebUrl();
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|windows phone/i.test(ua);
    
    // Сохраняем время начала
    const startTime = Date.now();
    
    // Для мобильных устройств используем location.href
    if (isMobile) {
      window.location.href = tgUrl;
      
      // Fallback для мобильных если приложение не установлено
      setTimeout(() => {
        // Если мы все еще на странице через 2.5 секунды
        if (Date.now() - startTime < 3000) {
          window.open(webUrl, '_blank');
        }
      }, 2500);
      
      return;
    }
    
    // Для десктопа пробуем открыть приложение
    const appOpened = window.open(tgUrl, '_self');
    
    // Если не удалось открыть приложение
    setTimeout(() => {
      if (appOpened) {
        // Проверяем, ушел ли фокус со страницы
        if (document.hasFocus()) {
          window.open(webUrl, '_blank');
        }
      } else {
        window.open(webUrl, '_blank');
      }
    }, 1000);
  };

  // Обработчик для контекстного меню (правая кнопка мыши)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const webUrl = getWebUrl();
    window.open(webUrl, '_blank');
  };

  return (
    <a 
      href={getWebUrl()}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`${styles.telegramLink} ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      data-username={username}
      title={`Открыть @${username} в Telegram`}
    >
      <span className={styles.spiceChar}>◈</span>
      <span className={styles.linkText}>@{username}</span>
      <span className={styles.linkHint}>⌘</span>
    </a>
  );
};