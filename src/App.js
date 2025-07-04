import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Видалено BrowserRouter as Router
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from './styles/GlobalStyles';
import { AppProvider, useAppContext } from './context/AppContext';
import LanguageSelection from './components/Welcome/LanguageSelection';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Layout/Dashboard';
import UnlockConfirmationModal from './components/Common/UnlockConfirmationModal';

// Компонент, який керує відображенням модального вікна підтвердження розблокування
const DashboardWithModal = () => {
  const { isUnlocked, setShowUnlockConfirmationModal } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Якщо isUnlocked стає true, показуємо модальне вікно
    if (isUnlocked) {
      setShowModal(true);
      // Приховуємо модальне вікно через 4 секунди
      const timer = setTimeout(() => {
        setShowModal(false);
        setShowUnlockConfirmationModal(false); // Скидаємо стан в контексті також
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked, setShowUnlockConfirmationModal]);

  return (
    <>
      <Dashboard />
      <AnimatePresence>
        {showModal && <UnlockConfirmationModal key="unlock-modal" />}
      </AnimatePresence>
    </>
  );
};

// Головний компонент App з маршрутизацією
const App = () => {
  const { accessKey, isUnlocked, depositInfo } = useAppContext();

  return (
    <> {/* Видалено Router, тепер він знаходиться лише в index.js */}
      <GlobalStyles />
      <Routes>
        {/* Початковий маршрут: якщо accessKey відсутній, показуємо LanguageSelection */}
        <Route path="/" element={!accessKey ? <LanguageSelection /> : <Navigate to="/dashboard" />} />
        
        {/* Маршрут для сторінки авторизації */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Маршрут для дашборду */}
        {/* Якщо accessKey існує, показуємо DashboardWithModal (який відобразить DepositInfo або гру) */}
        {/* Інакше перенаправляємо на сторінку авторизації */}
        <Route 
          path="/dashboard" 
          element={accessKey ? <DashboardWithModal /> : <Navigate to="/auth" />} 
        />
        
        {/* Перенаправлення на головну сторінку для будь-яких невідомих маршрутів */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// Обгортаємо App провайдером
const AppWrapper = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default AppWrapper;
