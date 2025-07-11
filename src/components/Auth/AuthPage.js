// src/components/Auth/AuthPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { verifyAccessKey } from '../../api/api';
import translations from '../../translations';
import LanguageSwitcher from '../Common/LanguageSwitcher'; // Переконайтеся, що шлях правильний

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  background-color: #1a1a1a; /* Дуже темний фон для всієї сторінки авторизації */
  color: #e0e0e0; /* Колір тексту за замовчуванням */
`;

const Form = styled(motion.div)`
  background-color: #2a2a2a; /* Темний сірий фон для форми */
  border-radius: 15px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2); /* Покращена тінь */
  max-width: 450px;
  width: 100%;
  border: 1px solid #3C3000; /* Темно-золота рамка */
  
  h2 {
    color: #FFD700; /* Золотий колір для заголовка */
    margin-bottom: 15px;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.4); /* Золоте світіння */
  }

  p {
    color: #b0b0b0; /* Трохи темніший світлий колір для параграфа */
    margin-bottom: 25px;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    padding: 25px 15px; /* Зменшений padding для мобільних */
  }
`;

const Title = styled.h1`
  color: #FFD700;
  margin-bottom: 25px;
  font-size: 2.5rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);

  @media (max-width: 480px) {
    font-size: 2rem; /* Зменшений шрифт для мобільних */
    margin-bottom: 20px;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #b0b0b0;
  margin-bottom: 30px;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 1rem; /* Зменшений шрифт для мобільних */
    margin-bottom: 25px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 1.1rem;
  border: 2px solid #5A4A00; /* Темно-золота рамка */
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #3a3a3a; /* Темний фон поля вводу */
  color: #f0f0f0; /* Світлий текст */

  &::placeholder {
    color: #999999; /* Колір плейсхолдера */
  }
  
  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3); /* Золоте світіння при фокусі */
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 1rem;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  background-color: #5A4A00; /* Темно-золотий колір для кнопки */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3); /* Золота тінь для кнопки */

  &:hover {
    background-color: #3C3000; /* Темніший золотий при наведенні */
    box-shadow: 0 6px 15px rgba(255, 215, 0, 0.4);
  }

  &:disabled {
    background-color: #555555;
    color: #bbbbbb;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 1rem;
  }
`;

const Message = styled.p`
  color: #e74c3c; /* Червоний колір для повідомлень про помилки (залишаємо для контрасту) */
  margin-top: 15px;
  font-weight: 500;
`;

const LanguageSwitcherContainer = styled.div`
  margin-bottom: 25px; /* Відступ між перемикачем та заголовком */
  width: 100%;
  display: flex;
  justify-content: center; /* Центруємо перемикач всередині форми */
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

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 1rem;
  }
`;

const AuthPage = () => {
  const [localAccessKey, setLocalAccessKey] = useState(''); // Використовуємо локальний стан для поля вводу
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { language, setAccessKey, setDepositInfo, setIsUnlocked, accessKey, isUnlocked } = useAppContext();
  const t = translations[language];

  // Перевіряємо, чи вже авторизовано, при завантаженні компонента
  useEffect(() => {
    console.log("AuthPage useEffect: Checking authentication status.");
    console.log(`AuthPage useEffect: Current accessKey: ${accessKey}, isUnlocked: ${isUnlocked}`);

    if (accessKey && isUnlocked) {
      console.log("AuthPage: Already unlocked, navigating to dashboard.");
      navigate('/dashboard');
    } else if (accessKey && !isUnlocked) {
        console.log("AuthPage: Access key found but not unlocked, navigating to dashboard to show DepositInfo.");
        navigate('/dashboard');
    }
  }, [accessKey, isUnlocked, navigate]);

  const handleLogin = async () => {
    console.log("AuthPage handleLogin: Login attempt initiated.");
    if (!localAccessKey) {
      setMessage(t.enter_key_placeholder);
      console.warn("AuthPage handleLogin: Access key input is empty.");
      return;
    }

    setLoading(true);
    setMessage('');
    console.log(`AuthPage handleLogin: Attempting to verify access key: ${localAccessKey}`);
    
    try {
      const data = await verifyAccessKey(localAccessKey);
      console.log('AuthPage: Raw data received from verifyAccessKey API:', JSON.stringify(data)); // Додано лог з JSON.stringify
      
      if (data) {
        console.log("AuthPage handleLogin: Access key verification successful.");
        setAccessKey(localAccessKey);
        // Переконайтеся, що data.amount та data.currency існують
        const depositData = { 
            amount: data.amount, // Виправлено на data.amount (з API)
            currency: data.currency // Виправлено на data.currency (з API)
        };
        console.log('AuthPage: Prepared depositData for context:', JSON.stringify(depositData)); // Додано лог з JSON.stringify
        setDepositInfo(depositData);
        setIsUnlocked(data.isUnlocked);
        
        // Логуємо значення контексту відразу після їх встановлення
        console.log('AuthPage: Context values after setting - accessKey:', localAccessKey, 'isUnlocked:', data.isUnlocked, 'depositInfo:', JSON.stringify(depositData));

        // Навігація буде оброблена useEffect після оновлення accessKey та isUnlocked
      } else {
        console.warn("AuthPage handleLogin: Access key verification failed, data is null.");
        setMessage(t.invalid_access_key);
      }
    } catch (error) {
      console.error('AuthPage: Error during login:', error); // Додано лог помилки
      setMessage(t.invalid_access_key);
    } finally {
      console.log("AuthPage handleLogin: Login attempt finished, setting loading to false.");
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Form
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LanguageSwitcherContainer>
          <LanguageSwitcher />
        </LanguageSwitcherContainer>
        <Title>{t.welcome_title}</Title>
        <Subtitle>{t.enter_access_key}</Subtitle>
        <Input
          type="text"
          placeholder={t.enter_key_placeholder}
          value={localAccessKey}
          onChange={(e) => setLocalAccessKey(e.target.value)}
          disabled={loading}
        />
        <Button
          onClick={handleLogin}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? t.checking : t.login_button}
        </Button>
        {message && <Message>{message}</Message>}

        {/* Нова кнопка "Написати мені" */}
        <TelegramButton
          href="https://t.me/punjab_trade"
          target="_blank" // Відкриває посилання в новій вкладці
          rel="noopener noreferrer" // Рекомендовано для безпеки при target="_blank"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t.contact_me_telegram} {/* Використовуємо ключ перекладу */}
        </TelegramButton>
      </Form>
    </AuthContainer>
  );
};

export default AuthPage;
