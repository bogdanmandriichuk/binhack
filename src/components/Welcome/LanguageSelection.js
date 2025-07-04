// src/components/Common/LanguageSelection.js
import React, { useEffect } from 'react'; // Додано useEffect
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Імпортуємо useNavigate
import { useAppContext } from '../../context/AppContext';
import translations from '../../translations';

const LanguageSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #1a1a1a;
  color: #e0e0e0;
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #FFD700;
  margin-bottom: 30px;
  font-size: 2.5rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const LanguageButton = styled.button`
  background-color: ${props => props.$active ? '#5A4A00' : '#3a3a3a'};
  color: white;
  border: 2px solid ${props => props.$active ? '#FFD700' : '#5A4A00'};
  border-radius: 10px;
  padding: 15px 30px;
  margin: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: ${props => props.$active ? '#3C3000' : '#4a4a4a'};
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  }
`;

const LanguageSelection = () => {
  const { language, setLanguage, accessKey, isUnlocked } = useAppContext(); // Отримуємо accessKey та isUnlocked
  const t = translations[language];
  const navigate = useNavigate(); // Ініціалізуємо useNavigate

  // Ефект для перенаправлення після вибору мови, якщо користувач ще не авторизований
  useEffect(() => {
    // Якщо accessKey вже встановлений або хак розблоковано, перенаправляємо на дашборд
    if (accessKey && isUnlocked) {
      navigate('/dashboard');
    } 
    // Якщо мова вже вибрана (і accessKey ще не встановлений), перенаправляємо на сторінку авторизації
    // Це спрацює після того, як користувач вибере мову на стартовій сторінці
    else if (language && !accessKey) {
        console.log('Language selected, navigating to /auth');
        navigate('/auth');
    }
  }, [language, accessKey, isUnlocked, navigate]); // Залежності ефекту

  return (
    <LanguageSelectContainer>
      <Title>{t.choose_language}</Title>
      <LanguageButton
        $active={language === 'en'}
        onClick={() => {
          console.log('Setting language to English');
          setLanguage('en');
        }}
      >
        English
      </LanguageButton>
      <LanguageButton
        $active={language === 'hi'}
        onClick={() => {
          console.log('Setting language to Hindi');
          setLanguage('hi');
        }}
      >
        हिन्दी
      </LanguageButton>
    </LanguageSelectContainer>
  );
};

export default LanguageSelection;