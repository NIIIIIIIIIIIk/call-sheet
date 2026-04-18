import React, { useState, useEffect } from 'react';
import { DuneLanding } from './components/DuneLanding/DuneLanding';
import { MainApp } from './components/MainApp/MainApp';
import { loadState } from './utils/storage';
import { trackVisit } from './utils/analytics';
import './styles/globals.css';

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const state = loadState();
    setIsUnlocked(state.isUnlocked);
    trackVisit('visit');
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  if (!isUnlocked) {
    return <DuneLanding onUnlock={handleUnlock} />;
  }

  return <MainApp />;
};

export default App;