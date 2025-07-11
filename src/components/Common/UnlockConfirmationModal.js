// src/components/Common/UnlockConfirmationModal.js
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5'; // Іконка галочки
import { useAppContext } from '../../context/AppContext'; // Імпортуємо контекст
import translations from '../../translations'; // Імпортуємо переклади

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background-color: #2a2a2a; /* Темний фон для модального вікна */
  padding: 50px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  color: #e0e0e0; /* Світлий текст */
  border: 1px solid #3C3000; /* Золота рамка */
`;

const IconWrapper = styled(motion.div)`
  font-size: 80px;
  color: #32CD32; /* Зелений колір для іконки успіху */
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #FFD700; /* Золотий колір для заголовка */
  margin-bottom: 15px;
  font-size: 2rem;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #b0b0b0;
  line-height: 1.5;
  margin-bottom: 30px;
`;

const CloseButton = styled(motion.button)`
  background-color: #5A4A00; /* Темно-золотий */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);

  &:hover {
    background-color: #3C3000;
    box-shadow: 0 6px 15px rgba(255, 215, 0, 0.4);
  }
`;

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, type: 'spring', damping: 15, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const UnlockConfirmationModal = () => {
  // Додано isUnlocked до useAppContext, щоб компонент міг реагувати на його зміну
  const { setShowUnlockConfirmationModal, language, isUnlocked } = useAppContext(); 
  const t = translations[language];

  // Додаткова перевірка при монтуванні, щоб уникнути повторного відображення
  useEffect(() => {
    if (isUnlocked) {
      console.log('UnlockConfirmationModal: isUnlocked is true on mount, hiding modal.');
      setShowUnlockConfirmationModal(false);
      return; // Не запускаємо таймер, якщо вже розблоковано
    }

    const timer = setTimeout(() => {
      console.log('UnlockConfirmationModal: Timer finished, hiding modal.');
      setShowUnlockConfirmationModal(false);
    }, 3000); // Закрити через 3 секунди
    return () => clearTimeout(timer); // Очистити таймер при розмонтуванні
  }, [setShowUnlockConfirmationModal, isUnlocked]); // Залежності

  const handleClose = () => {
    console.log('UnlockConfirmationModal: Close button clicked, hiding modal.');
    setShowUnlockConfirmationModal(false);
  };

  // Не рендеримо модальне вікно, якщо isUnlocked вже true
  if (isUnlocked) {
    console.log('UnlockConfirmationModal: isUnlocked is true, returning null (not rendering).');
    return null;
  }

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ModalContent
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <IconWrapper
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <IoCheckmarkCircle />
          </IconWrapper>
          <Title>{t.access_granted}</Title>
          <Message>{t.calibration_message}</Message>
          <CloseButton
            onClick={handleClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.ok_button || 'OK'}
          </CloseButton>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default UnlockConfirmationModal;
