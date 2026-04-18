import React, { useState, useEffect } from 'react';
import { Event } from '../../types';
import { loadState, saveState } from '../../utils/storage';
import { checkEasterEgg } from '../../utils/easterEggs';
import { EventList } from './EventList';
import { AddEventForm } from './AddEventForm';
import { EasterEggModal } from '../UI/EasterEggModal';
import { OnboardingTooltip } from '../UI/OnboardingTooltip';
import { Toast } from '../UI/Toast';
import { AutoGenerateButton } from './AutoGenerateButton';
import { FOOTER_TEXT } from '../../utils/constants';
import { ONBOARDING_STEPS } from '../../types';
import styles from './MainApp.module.css';

export const MainApp: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [updateKey, setUpdateKey] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEgg, setEasterEgg] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    const state = loadState();
    setEvents(state.events);
    
    // Проверяем, первый ли это вход
    const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 500);
    }
    
    // Показываем приветственный тост
    setToast({
      message: `Календарь синхронизирован.`,
      type: 'success'
    });
  }, [updateKey]);

  const handleUpdate = () => {
    setUpdateKey(k => k + 1);
  };

  const handleEventAdded = () => {
    handleUpdate();
    
    // Проверяем пасхалку при первом добавленном событии
    const egg = checkEasterEgg('firstEvent');
    if (egg) {
      setEasterEgg(egg);
      setShowEasterEgg(true);
    }
    
    setToast({
      message: 'Добавлено в расписание',
      type: 'success'
    });
  };

  const handleCommentAdded = (commentCount: number) => {
    // Проверяем пасхалку при третьем комментарии
    if (commentCount === 3) {
      const egg = checkEasterEgg('thirdComment');
      if (egg) {
        setEasterEgg(egg);
        setShowEasterEgg(true);
      }
    }
  };

  const handleAllConfirmed = () => {
    const allConfirmed = events.every(e => e.status === 'УТВЕРЖДЕНО');
    if (allConfirmed && events.length > 0) {
      const egg = checkEasterEgg('allConfirmed');
      if (egg) {
        setEasterEgg(egg);
        setShowEasterEgg(true);
      }
    }
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem('has_seen_onboarding', 'true');
      setToast({
        message: 'Освоение прошло успешно!',
        type: 'info'
      });
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('has_seen_onboarding', 'true');
  };

  const handleAutoGenerate = (generatedEvent: Omit<Event, 'id' | 'comments'>) => {
    // Добавляем сгенерированное событие
    const state = loadState();
    const newEvent: Event = {
      ...generatedEvent,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      comments: []
    };
    state.events.push(newEvent);
    saveState(state);
    
    handleEventAdded();
    
    setToast({
      message: `✨ "${generatedEvent.scene}" добавлено!`,
      type: 'success'
    });
  };

  return (
    <>
      <div className={styles.app}>
        
        <header className={styles.appHeader}>
          <div className={styles.headerLeft}>
          </div>
          <div className={styles.headerRight}>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.clapboard}>🎬</span>
                Календарь событий
              </h2>
            </div>
            <EventList 
              events={events} 
              onUpdate={handleUpdate}
              onCommentAdded={handleCommentAdded}
              onAllConfirmed={handleAllConfirmed}
            />
          </div>

          <div className={styles.section}>
            <AddEventForm onAdd={handleEventAdded} />
              <div className={styles.headerActions}>
                <AutoGenerateButton onGenerate={handleAutoGenerate} />
              </div>
          </div>
        </main>

        <footer className={styles.appFooter}>
          <p>{FOOTER_TEXT}</p>
        </footer>
      </div>
      
      {showEasterEgg && easterEgg && (
        <EasterEggModal egg={easterEgg} onClose={() => setShowEasterEgg(false)} />
      )}
      
      {showOnboarding && (
        <OnboardingTooltip
          targetSelector={ONBOARDING_STEPS[onboardingStep].target}
          title={ONBOARDING_STEPS[onboardingStep].title}
          content={ONBOARDING_STEPS[onboardingStep].content}
          step={onboardingStep + 1}
          totalSteps={ONBOARDING_STEPS.length}
          onNext={handleOnboardingNext}
          onSkip={handleOnboardingSkip}
        />
      )}
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};