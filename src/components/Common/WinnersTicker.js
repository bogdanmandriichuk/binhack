// src/components/Common/WinnersTicker.js
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import translations from '../../translations';

// Контейнер для стрічки переможців
const TickerContainer = styled.div`
  background-color: #1c1c1c; /* Темний фон */
  border-radius: 10px;
  padding: 15px 20px;
  margin-top: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* Тінь для глибини */
  overflow: hidden; /* Обрізаємо вміст, що виходить за межі, для анімації */
  position: relative;
  border: 1px solid #3C3000; /* Золота рамка */
  color: #e0e0e0; /* Світлий колір тексту */
  height: 300px; /* Фіксована висота для прокрутки */
  display: flex;
  flex-direction: column;
`;

// Вміст стрічки, що прокручується вертикально
const TickerContent = styled.div`
  display: flex;
  flex-direction: column; /* Вертикальне розташування елементів */
  gap: 15px; /* Збільшена відстань між елементами */
  padding: 5px 0;
  flex-grow: 1; /* Дозволяє вмісту заповнювати доступний простір */
  /* Приховати скролбар для всіх браузерів */
  overflow-y: hidden; /* Приховуємо скролбар, анімація керується Framer Motion */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// Окремий елемент переможця у стрічці з покращеним оформленням
const WinnerItem = styled(motion.div)`
  background: linear-gradient(145deg, #FFD700, #E6B800); /* Золотий градієнт */
  color: #3C3000; /* Темний текст на золотому фоні */
  padding: 12px 15px;
  border-radius: 12px; /* Більш заокруглені кути */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3), 0 2px 5px rgba(0, 0, 0, 0.15); /* Покращена тінь */
  width: calc(100% - 30px); /* Враховуємо padding контейнера */
  text-align: center; /* Вирівнювання тексту по центру */
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column; /* Елементи всередині WinnerItem також вертикально */
  align-items: center;
  justify-content: center;
  border: 1px solid #FFA500; /* Помаранчева рамка для контрасту */
  transition: transform 0.2s ease-in-out; /* Плавний перехід при наведенні */

  &:hover {
    transform: translateY(-3px); /* Легкий підйом при наведенні */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 0 3px 8px rgba(0, 0, 0, 0.2);
  }

  span {
    color: #4a4a4a; /* Темніший сірий для решти тексту */
    font-weight: 500;
  }

  strong {
    color: #006400; /* Темно-зелений для виграшів на жовтому фоні */
    font-weight: 800; /* Ще жирніший */
    font-size: 1.3rem; /* Більший розмір для суми */
    margin-top: 5px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* Тінь для тексту виграшу */
  }
`;

// Розширений список імен, включаючи індійські та більш людські
const NICKNAMES = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Yadav', 'Divya Gupta', 'Sanjay Verma', 'Pooja Devi', 'Rahul Khanna', 'Neha Sharma',
    'Anil Kumar', 'Kiran Singh', 'Gaurav Gupta', 'Shweta Kumari', 'Arjun Reddy', 'Meena Devi', 'Ravi Shankar', 'Deepa Sharma', 'Vikas Kumar', 'Sapna Yadav',
    'Aisha Khan', 'Omar Hassan', 'Fatima Ali', 'Ahmed Raza', 'Zahra Begum', 'Ali Shah', 'Sara Malik', 'Mohammed Iqbal', 'Nadia Hussain', 'Khalid Ahmed',
    'John Doe', 'Jane Smith', 'Chris Green', 'Alex White', 'Sam Brown', 'Patty Black', 'Mike Blue', 'Lisa Red', 'David Grey', 'Emily Rose',
    'CryptoKing', 'ForexPro', 'MarketWhale', 'AlphaTrader', 'ProfitSeeker', 'GoldenBull', 'SilverFox', 'TradeMaster', 'QuickGain', 'SmartInvestor', 'WealthBuilder',
    'EagleEye', 'TrendSetter', 'DayTrader', 'NightOwl', 'RiskTaker', 'SteadyHand', 'FutureKing',
    'User_1234', 'Trader_7777', 'Investor_999', 'MoneyMaker_X', 'Gainiac_Pro', 'Capitalist_One', 'FinFlow_Guru',
    'EquityAce', 'BondKing', 'FundMaster', 'YieldHunter', 'ValueSeeker', 'GrowthTrader',
    'OptimistPrime', 'DreamWeaver', 'InnovatorX', 'StrategistPro', 'PioneerSpirit', 'NavigatorStar', 'CatalystFX',
    'ExplorerMind', 'VisionaryAce', 'AchieverGold', 'ConquerorMax', 'ChampionElite', 'WinnerMindset', 'SuccessPath'
];

// Список валютних пар для імітації
const ASSET_PAIRS = [
  'EUR/USD', 'GBP/JPY', 'USD/CAD', 'AUD/NZD', 'EUR/JPY', 'AUD/CAD', 'USD/CHF',
  'Bitcoin/USD', 'Ethereum/USD', 'Gold', 'Silver', 'Apple Stock', 'Google Stock',
  'Tesla Stock', 'Amazon Stock', 'Oil Futures', 'Natural Gas', 'DAX Index', 'S&P 500'
];

// Функція для генерації суми виграшу з урахуванням лімітів (тільки USD та INR)
const generateWinAmount = () => {
    const currencyOptions = ['USD', 'INR'];
    const selectedCurrency = currencyOptions[Math.floor(Math.random() * currencyOptions.length)];
    let amount;

    if (selectedCurrency === 'USD') {
        amount = (Math.random() * 450 + 50).toFixed(2); // Від $50 до $500
    } else { // INR
        amount = (Math.random() * 35000 + 5000).toFixed(0); // Від 5,000 до 40,000 INR
    }
    return `${amount} ${selectedCurrency}`;
};

// Кількість елементів, які відображаються одночасно
const VISIBLE_ITEMS_COUNT = 5;
// Інтервал оновлення (для "миттєвого" відображення нових елементів)
const UPDATE_INTERVAL = 2000; // Оновлюємо кожні 2 секунди

const WinnersTicker = () => {
  const { language } = useAppContext();
  const t = translations[language];

  const [winners, setWinners] = useState([]);
  const tickerContentRef = useRef(null); // Референс для доступу до DOM-елемента TickerContent

  useEffect(() => {
    let interval;

    const addNewWinner = () => {
      const randomName = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
      const randomPair = ASSET_PAIRS[Math.floor(Math.random() * ASSET_PAIRS.length)];
      const winAmount = generateWinAmount();

      const newWinner = {
        id: Date.now() + Math.random(), // Унікальний ID для key у React
        name: randomName,
        won: winAmount,
        pair: randomPair
      };

      setWinners(prevWinners => {
        // Додаємо нового переможця на ПОЧАТОК масиву
        const updatedWinners = [newWinner, ...prevWinners];
        // Обмежуємо кількість елементів, щоб список не ріс нескінченно
        // Залишаємо лише перші VISIBLE_ITEMS_COUNT елементів (найновіші)
        return updatedWinners.slice(0, VISIBLE_ITEMS_COUNT);
      });
    };

    // Ініціалізуємо список кількома переможцями при першому завантаженні
    // Щоб список не був порожнім на початку
    for (let i = 0; i < VISIBLE_ITEMS_COUNT; i++) {
      addNewWinner();
    }

    // Встановлюємо інтервал для регулярного додавання нових переможців
    interval = setInterval(addNewWinner, UPDATE_INTERVAL);

    // Очищаємо інтервал при розмонтуванні компонента
    return () => clearInterval(interval);
  }, []);

  // Ефект для автоматичної прокрутки до низу при додаванні нового елемента
  // Цей useEffect тепер не потрібен, оскільки анімація керується Framer Motion
  // і нові елементи з'являються зверху, а старі виходять знизу.
  // if (tickerContentRef.current) {
  //   tickerContentRef.current.scrollTop = tickerContentRef.current.scrollHeight;
  // }

  // Якщо список переможців порожній, відображаємо повідомлення
  if (winners.length === 0) {
    return <TickerContainer><p>{t.no_winners_yet}</p></TickerContainer>;
  }

  return (
    <TickerContainer>
      <h3>{t.recent_signals_winners}</h3>
      <TickerContent ref={tickerContentRef}> {/* Призначаємо референс */}
        <AnimatePresence initial={false}>
          {winners.map((winner) => (
            <WinnerItem
              key={winner.id}
              // Анімація: з'являється ЗВЕРХУ (y: -50), плавно опускається до початкової позиції (y: 0)
              // При виході: плавно зникає ВНИЗ (y: 50)
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 120, damping: 15, duration: 0.6 }} // Більш плавна spring-анімація
            >
              <span>{winner.name} {t.earned}</span>
              <strong>{winner.won}</strong>
              <span>{t.on_pair} {winner.pair}</span>
            </WinnerItem>
          ))}
        </AnimatePresence>
      </TickerContent>
    </TickerContainer>
  );
};

export default WinnersTicker;
