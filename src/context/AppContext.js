// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../translations'; // Переконайтеся, що шлях правильний

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

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
        const storedDepositInfoString = localStorage.getItem('appDepositInfo'); // Отримуємо рядок
        console.log('AppContext: Raw storedDepositInfo from localStorage (string):', storedDepositInfoString);
        let parsedDepositInfo = null;
        if (storedDepositInfoString) {
            try {
                parsedDepositInfo = JSON.parse(storedDepositInfoString);
            } catch (e) {
                console.error('AppContext: Error parsing depositInfo from localStorage:', e);
                // Можливо, старі дані в localStorage були пошкоджені. Очистимо їх.
                localStorage.removeItem('appDepositInfo');
            }
        }
        console.log('AppContext: Initial parsed depositInfo from localStorage (object):', parsedDepositInfo);
        return parsedDepositInfo;
    });
    const [isUnlocked, setIsUnlocked] = useState(() => {
        const storedIsUnlocked = localStorage.getItem('appIsUnlocked');
        const parsedIsUnlocked = storedIsUnlocked === 'true'; // Зберігаємо як рядок, читаємо як булеве
        console.log('AppContext: Initial isUnlocked from localStorage:', parsedIsUnlocked);
        return parsedIsUnlocked;
    });

    const [showUnlockConfirmationModal, setShowUnlockConfirmationModal] = useState(false);
    console.log('AppContext: Initial showUnlockConfirmationModal:', showUnlockConfirmationModal);

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
        if (depositInfo) {
            const depositInfoString = JSON.stringify(depositInfo);
            console.log('AppContext: About to save depositInfo to localStorage (object):', depositInfo); // NEW LOG
            console.log('AppContext: Saving depositInfo to localStorage (string):', depositInfoString);
            localStorage.setItem('appDepositInfo', depositInfoString);
        } else {
            console.log('AppContext: Removing depositInfo from localStorage.');
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
        t: translations[language] // Додаємо об'єкт перекладів для зручності
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
