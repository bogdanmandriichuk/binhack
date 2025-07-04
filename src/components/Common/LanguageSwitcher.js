// src/components/Common/LanguageSwitcher.js
import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import translations from '../../translations';

const StyledSelect = styled.select`
  padding: 10px 35px 10px 15px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #5A4A00;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cpath%20fill%3D%22%23FFD700%22%20d%3D%22M208.5%2080.5l-80%2080-80-80H208.5z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 1em;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
  }

  option {
      background-color: #2a2a2a;
      color: white;
      &:checked {
          background-color: #5A4A00;
          color: #FFD700;
      }
  }
`;

const LanguageSwitcher = () => {
  const { language, setLanguage } = useAppContext();
  const t = translations[language];

  return (
    <StyledSelect value={language} onChange={(e) => {
      console.log('Selected language from dropdown:', e.target.value); // Додано лог
      setLanguage(e.target.value);
    }}>
      <option value="en">{t.select_language} (English)</option>
      <option value="hi">{t.select_language} (हिन्दी)</option>
    </StyledSelect>
  );
};

export default LanguageSwitcher;
