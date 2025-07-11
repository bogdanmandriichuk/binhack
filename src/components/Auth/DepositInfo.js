// src/components/Auth/DepositInfo.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { verifyUnlockKey } from '../../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import translations from '../../translations';

const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  pointer-events: auto; 
  background-color: rgba(0, 0, 0, 0.7);
`;

const ContentOverlay = styled(motion.div)`
  position: relative;
  z-index: 1010;
  background-color: #2a2a2a;
  border-radius: 15px;
  padding: 40px 30px;
  text-align: center;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  color: #e0e0e0;
  border: 1px solid #3C3000;

  h2, h3 {
    color: #FFD700;
    margin-bottom: 15px;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
  }

  p {
    color: #b0b0b0;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  strong {
    color: #FFD700;
    font-weight: 700;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 1.1rem;
  border: 2px solid #5A4A00;
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #3a3a3a;
  color: #f0f0f0;

  &::placeholder {
    color: #999999;
  }
  
  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  background-color: #5A4A00;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);

  &:hover {
    background-color: #3C3000;
    box-shadow: 0 6px 15px rgba(255, 215, 0, 0.4);
  }

  &:disabled {
    background-color: #555555;
    color: #bbbbbb;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Message = styled.p`
  color: #e74c3c;
  margin-top: 15px;
  font-weight: 500;
`;

// Новий стилізований компонент для кнопки Telegram
const TelegramButton = styled(motion.a)`
  width: 100%;
  background-color: #0088cc; /* Колір Telegram */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(0, 136, 204, 0.3); /* Тінь Telegram */
  text-decoration: none; /* Прибираємо підкреслення для посилання */
  display: inline-block; /* Щоб padding та width працювали як на кнопці */
  margin-top: 20px; /* Відступ від кнопки авторизації */

  &:hover {
    background-color: #007bb5;
    box-shadow: 0 6px 15px rgba(0, 136, 204, 0.4);
  }
`;

const DepositInfo = () => {
  const [unlockKey, setUnlockKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { language, depositInfo, setIsUnlocked, accessKey, setShowUnlockConfirmationModal, isUnlocked } = useAppContext();
  const t = translations[language];

  // Додано лог для перевірки depositInfo при рендері
  console.log('DepositInfo component rendered. Current depositInfo:', depositInfo);
  // Додано логи для перевірки конкретних властивостей
  if (depositInfo) {
    console.log('DepositInfo amount (on render):', depositInfo.amount);
    console.log('DepositInfo currency (on render):', depositInfo.currency);
  }


  useEffect(() => {
    // Додано лог для відстеження змін accessKey
    console.log('DepositInfo useEffect: accessKey changed to:', accessKey);
    if (!accessKey) {
        // Логіка перенаправлення на AuthPage, якщо accessKey відсутній
        // (зазвичай це робиться в App.js або Dashboard.js, якщо DepositInfo є його частиною)
        console.log('DepositInfo: accessKey is null, component might not be needed here.');
    }
  }, [accessKey]);

  const handleUnlock = async () => {
    console.log('DepositInfo handleUnlock: Attempting to unlock access.');
    if (!unlockKey) {
      setMessage('Please enter the unlock key.');
      console.warn('DepositInfo handleUnlock: Unlock key input is empty.');
      return;
    }
    setLoading(true);
    setMessage('');
    console.log(`DepositInfo handleUnlock: Verifying unlock key for accessKey: ${accessKey}, unlockKey: ${unlockKey}`);
    try {
      await verifyUnlockKey(accessKey, unlockKey); 
      setIsUnlocked(true);
      setShowUnlockConfirmationModal(true);
      console.log('DepositInfo handleUnlock: Unlock successful. isUnlocked set to true, showing confirmation modal.');
    } catch (error) {
      console.error('DepositInfo handleUnlock: Error during unlock:', error);
      setMessage(t.invalid_unlock_key);
    } finally {
      setLoading(false);
      console.log('DepositInfo handleUnlock: Unlock attempt finished, setting loading to false.');
    }
  };

  // Компонент відображається лише тоді, коли є depositInfo І хак НЕ розблоковано
  if (!depositInfo || isUnlocked) {
    console.log('DepositInfo: Not displaying because depositInfo is null/undefined or already unlocked.');
    return null;
  }
  
  return (
    <AnimatePresence>
        <OverlayContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ContentOverlay
            key="unlock-form"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <h2>{t.deposit_info_title}</h2>
            <p>
              {t.deposit_message}
              <br />
              <strong>
                {/* Перевіряємо, чи існують amount та currency перед відображенням */}
                {depositInfo.amount !== undefined && depositInfo.amount !== null ? depositInfo.amount : 'N/A'}{' '}
                {depositInfo.currency !== undefined && depositInfo.currency !== null ? depositInfo.currency : 'N/A'}
              </strong>
            </p>
 
            <h3>{t.enter_unlock_key_title}</h3>
            <Input
              type="text"
              placeholder={t.enter_key_placeholder}
              value={unlockKey}
              onChange={(e) => setUnlockKey(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={handleUnlock}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? t.unlocking : t.unlock_access}
            </Button>
            {message && <Message>{message}</Message>}
          </ContentOverlay>
        </OverlayContainer>
    </AnimatePresence>
  );
};

export default DepositInfo;
