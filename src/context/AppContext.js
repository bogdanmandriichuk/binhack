// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Створюємо контекст
const AppContext = createContext();

// Компонент-провайдер для контексту
export const AppProvider = ({ children }) => {
  // Ініціалізуємо стани, намагаючись завантажити їх з localStorage
  const [language, setLanguage] = useState(() => {
    const storedLang = localStorage.getItem('appLanguage') || 'en';
    console.log('AppContext: Initial language from localStorage:', storedLang);
    return storedLang;
  });
  const [accessKey, setAccessKey] = useState(() => {
    const storedAccessKey = localStorage.getItem('appAccessKey') || null;
    console.log('AppContext: Initial accessKey from localStorage:', storedAccessKey);
    return storedAccessKey;
  });
  const [depositInfo, setDepositInfo] = useState(() => {
    const storedDepositInfo = localStorage.getItem('appDepositInfo');
    let parsedDepositInfo = null;
    try {
      if (storedDepositInfo) {
        const tempInfo = JSON.parse(storedDepositInfo);
        // Перевіряємо, чи містить об'єкт amount та currency, і чи вони не є undefined/null
        if (tempInfo && typeof tempInfo === 'object' && 
            tempInfo.amount !== undefined && tempInfo.amount !== null &&
            tempInfo.currency !== undefined && tempInfo.currency !== null) {
          parsedDepositInfo = tempInfo;
        } else {
          console.warn('AppContext: Stored depositInfo in localStorage is invalid or incomplete, ignoring and removing.');
          localStorage.removeItem('appDepositInfo'); // Видаляємо недійсні дані
        }
      }
    } catch (e) {
      console.error('AppContext: Error parsing depositInfo from localStorage:', e);
      localStorage.removeItem('appDepositInfo'); // Видаляємо пошкоджені дані
    }
    console.log('AppContext: Initial parsed depositInfo from localStorage:', parsedDepositInfo);
    return parsedDepositInfo;
  });
  
  // isUnlocked тепер також завантажується з localStorage
  const [isUnlocked, setIsUnlocked] = useState(() => {
    const storedIsUnlocked = localStorage.getItem('appIsUnlocked');
    const parsedIsUnlocked = storedIsUnlocked === 'true'; // Зберігаємо як рядок, перетворюємо назад на булеве
    console.log('AppContext: Initial isUnlocked from localStorage:', parsedIsUnlocked);
    return parsedIsUnlocked;
  });

  // Стан для керування відображенням модального вікна підтвердження розблокування
  // Цей стан НЕ зберігається в localStorage, щоб модальне вікно не з'являлося при перезавантаженні
  const [showUnlockConfirmationModal, setShowUnlockConfirmationModal] = useState(false);
  console.log('AppContext: Initial showUnlockConfirmationModal:', showUnlockConfirmationModal);


  // Стан для calibrationClicks, також завантажується з localStorage
  const [calibrationClicks, setCalibrationClicks] = useState(() => {
    const storedCalibrationClicks = localStorage.getItem('appCalibrationClicks');
    const parsedCalibrationClicks = storedCalibrationClicks ? parseInt(storedCalibrationClicks, 10) : 0;
    console.log('AppContext: Initial calibrationClicks from localStorage:', parsedCalibrationClicks);
    return parsedCalibrationClicks;
  });


  // Ефект для збереження мови в localStorage при її зміні
  useEffect(() => {
    console.log('AppContext: Saving language to localStorage:', language);
    localStorage.setItem('appLanguage', language);
  }, [language]);

  // Ефект для збереження accessKey в localStorage при його зміні
  useEffect(() => {
    if (accessKey) {
      console.log('AppContext: Saving accessKey to localStorage:', accessKey);
      localStorage.setItem('appAccessKey', accessKey);
    } else {
      console.log('AppContext: Removing accessKey from localStorage.');
      localStorage.removeItem('appAccessKey');
    }
  }, [accessKey]);

  // Ефект для збереження depositInfo в localStorage при його зміні
  useEffect(() => {
    // Зберігаємо лише якщо depositInfo є об'єктом і має властивості 'amount' та 'currency'
    if (depositInfo && typeof depositInfo === 'object' && 
        depositInfo.amount !== undefined && depositInfo.amount !== null &&
        depositInfo.currency !== undefined && depositInfo.currency !== null) {
      console.log('AppContext: Saving depositInfo to localStorage (object):', depositInfo);
      localStorage.setItem('appDepositInfo', JSON.stringify(depositInfo));
      console.log('AppContext: Saving depositInfo to localStorage (string):', JSON.stringify(depositInfo));
    } else {
      // Якщо depositInfo є null, undefined, або порожнім об'єктом без очікуваних властивостей, видаляємо його
      console.log('AppContext: Removing depositInfo from localStorage or it is invalid.');
      localStorage.removeItem('appDepositInfo');
    }
  }, [depositInfo]);

  // Ефект для збереження isUnlocked в localStorage при його зміні
  useEffect(() => {
    console.log('AppContext: Saving isUnlocked to localStorage:', isUnlocked);
    localStorage.setItem('appIsUnlocked', isUnlocked.toString()); // Перетворюємо булеве на рядок
  }, [isUnlocked]);

  // Ефект для збереження calibrationClicks в localStorage при його зміні
  useEffect(() => {
    console.log('AppContext: Saving calibrationClicks to localStorage:', calibrationClicks);
    localStorage.setItem('appCalibrationClicks', calibrationClicks.toString());
  }, [calibrationClicks]);


  // Значення, які будуть доступні через контекст
  const contextValue = {
    language,
    setLanguage,
    accessKey,
    setAccessKey,
    depositInfo,
    setDepositInfo,
    isUnlocked,
    setIsUnlocked,
    showUnlockConfirmationModal,
    setShowUnlockConfirmationModal,
    calibrationClicks,
    setCalibrationClicks,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Хук для зручного використання контексту
export const useAppContext = () => {
  return useContext(AppContext);
};
