// src/components/Games/BinaryOptionsGame.js
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useProgress } from '../../hooks/useProgress';
import { motion, AnimatePresence } from 'framer-motion';
import Switcher from '../../styles/Switcher';
import translations from '../../translations';
import { useAppContext } from '../../context/AppContext';
import SignalStatsModal from './SignalStatsModal';

// Import Font Awesome components and icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faArrowUp, faArrowDown, faCheckCircle, faCog } from '@fortawesome/free-solid-svg-icons';

// Import the background image
import backgroundImage from '../../assets/chicken-road-bg.jpg';

// Import API functions for sending feedback and signal clicks
import { sendFeedback, sendSignalClick } from '../../api/api';


// --- Styled Components (Updated for Responsiveness) ---

const GameContainer = styled.div`
    padding: 2.5rem; /* Use rem for responsive padding */
    text-align: center;
    background-color: #3C3000; /* Dark yellow/gold background */
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #FFD700; /* Gold/Yellow border */
    color: white;
    position: relative;
    overflow: hidden;
    max-width: 700px; /* Max width for larger screens */
    width: 95%; /* Responsive width */
    margin: 2rem auto; /* Center the card and add vertical margin */

    background-image: url(${props => props.$backgroundImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5); /* Darker overlay for readability */
        border-radius: 15px;
        z-index: 1;
    }

    > * {
        position: relative;
        z-index: 2;
    }

    @media (max-width: 768px) {
        padding: 1.5rem; /* Smaller padding on tablets */
        margin: 1rem auto;
    }

    @media (max-width: 480px) {
        padding: 1rem; /* Even smaller padding on mobile */
        margin: 0.5rem auto;
        width: 98%; /* Almost full width on very small screens */
    }
`;

const ProgressContainer = styled.div`
    margin-bottom: 1.5rem; /* Use rem */
`;

const ProgressLabel = styled.p`
    font-size: 0.9rem; /* Base font size */
    color: white;
    margin-bottom: 0.5rem; /* Use rem */

    @media (max-width: 480px) {
        font-size: 0.8rem; /* Smaller on mobile */
    }
`;

const ProgressBar = styled.div`
    background-color: rgba(255, 255, 255, 0.3);
    height: 15px;
    border-radius: 8px;
    overflow: hidden;
`;

const ProgressBarFill = styled(motion.div)`
    height: 100%;
    background-color: #FFD700; /* Gold for binary options theme */
    border-radius: 8px;
`;

const Form = styled.div`
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap to next line */
    gap: 1rem; /* Use rem for consistent spacing */
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem; /* Use rem */
`;

const Input = styled.input`
    flex: 1; /* Allow input to grow and shrink */
    min-width: 100px; /* Adjusted min-width for smaller screens */
    max-width: 180px; /* Max width to prevent overly wide inputs */
    padding: 0.75rem; /* Use rem for padding */
    font-size: 1rem; /* Base font size */
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
        outline: none;
        border-color: #FFD700;
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
    }

    @media (max-width: 480px) {
        min-width: 100%; /* Full width on mobile */
        max-width: 100%;
        font-size: 0.9rem;
        padding: 0.6rem;
    }
`;

const Select = styled.select`
    padding: 0.75rem; /* Use rem for padding */
    font-size: 1rem; /* Base font size */
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    cursor: pointer;
    min-width: 90px; /* Adjusted min-width */
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
        outline: none;
        border-color: #FFD700;
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
    }

    @media (max-width: 480px) {
        min-width: 100%; /* Full width on mobile */
        font-size: 0.9rem;
        padding: 0.6rem;
    }
`;

const FormLabel = styled.label`
    font-size: 0.9rem;
    color: white;
    margin-right: 0.3rem; /* Use rem */
    white-space: nowrap;
`;

const FormRow = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem; /* Use rem */
    flex-wrap: wrap;
    justify-content: center;
    width: 100%; /* Ensure rows take full width */

    @media (max-width: 480px) {
        flex-direction: column; /* Stack items vertically on mobile */
        gap: 0.5rem; /* Smaller gap */
        align-items: flex-start; /* Align labels to start */
    }
`;

const Button = styled(motion.button)`
    padding: 0.85rem 1.8rem; /* Збільшений padding для більших кнопок */
    font-size: 1.1rem; /* Збільшений шрифт для кнопок */
    font-weight: bold;
    border: none;
    border-radius: 8px;
    background-color: #FFD700;
    color: #3C3000;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 140px; /* Ensure sufficient touch target */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

    &:hover {
        background-color: #E6B800;
    }

    &:disabled {
        background-color: #6c757d;
        color: #e9ecef;
        cursor: not-allowed;
    }

    @media (max-width: 480px) {
        width: 100%; /* Full width on mobile */
        font-size: 1rem; /* Трохи менший шрифт на мобільних */
        padding: 0.75rem 1.2rem; /* Трохи менший padding на мобільних */
    }
`;

const PredictionDisplay = styled.h4`
    font-size: 2.5rem; /* Base font size */
    color: white;
    margin-bottom: 1.5rem; /* Use rem */
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem; /* Use rem */

    @media (max-width: 480px) {
        font-size: 1.5rem; /* Зменшено для мобільних */
        height: 60px;
    }
`;

const PredictionIconWrapper = styled(motion.div)`
    font-size: 3rem; /* Base icon size */
    color: ${props => props.$isUp ? '#32CD32' : '#FF4500'};
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 480px) {
        font-size: 2.5rem; /* Smaller on mobile */
    }
`;

const PredictionText = styled(motion.span)`
    font-weight: bold;
    font-size: 2.2rem; /* Base text size */
    color: ${props => props.$isUp ? '#32CD32' : '#FF4500'};

    @media (max-width: 480px) {
        font-size: 1.2rem; /* Зменшено для мобільних */
    }
`;

const AssetConfirmationDisplay = styled(motion.div)`
    font-size: 1.5rem; /* Base font size */
    font-weight: bold;
    color: #FFD700;
    margin-bottom: 1rem; /* Use rem */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem; /* Use rem */
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
    min-height: 30px;

    @media (max-width: 480px) {
        font-size: 1.2rem; /* Smaller on mobile */
    }
`;

const spinning = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const SpinnerIcon = styled(FontAwesomeIcon)`
    animation: ${spinning} 1.5s linear infinite;
`;


const FeedbackContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem; /* Use rem */
    margin-bottom: 2rem; /* Use rem */
    text-align: center;
`;

const FeedbackText = styled.p`
    font-size: 0.9rem;
    color: white;
    margin-bottom: 1rem; /* Use rem */
    max-width: 300px;
    text-shadow: 0 0 3px rgba(0,0,0,0.5);

    @media (max-width: 480px) {
        font-size: 0.8rem;
        max-width: 90%;
    }
`;

const FeedbackButtons = styled.div`
    display: flex;
    gap: 2rem; /* Use rem */

    @media (max-width: 480px) {
        gap: 1.5rem;
    }
`;

const FeedbackButton = styled(motion.button)`
    background: none;
    border: none;
    font-size: 2.5rem; /* Base icon size */
    cursor: pointer;
    color: white;
    transition: transform 0.2s;
    /* Ensure sufficient touch target area */
    padding: 0.5rem; 
    min-width: 48px; /* Minimum touch target size */
    min-height: 48px;

    @media (max-width: 480px) {
        font-size: 2rem; /* Smaller on mobile */
    }
`;

const ViewStatsButton = styled(motion.button)`
    margin-top: 1rem; /* Use rem */
    background-color: transparent;
    color: white;
    border: 2px solid white;
    padding: 0.6rem 1rem; /* Responsive padding */
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    min-width: 120px; /* Sufficient touch target */

    &:hover {
        background-color: white;
        color: #3C3000;
    }

    @media (max-width: 480px) {
        font-size: 0.9rem;
        padding: 0.5rem 0.8rem;
    }
`;

const SwitcherGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem; /* Use rem */
    margin-top: 1.5rem; /* Use rem */
    flex-wrap: wrap; /* Allow switchers to wrap */

    @media (max-width: 480px) {
        flex-direction: column; /* Stack vertically on mobile */
        gap: 1rem;
        align-items: center;
    }
`;

const NotificationMessage = styled(motion.p)`
    font-size: 1.2rem; /* Base font size */
    font-weight: bold;
    color: white;
    margin-bottom: 1.5rem; /* Use rem */
    text-shadow: 0 0 5px rgba(0,0,0,0.5);

    @media (max-width: 480px) {
        font-size: 1rem;
    }
`;

// --- Hacker Console Styles ---
const blink = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
`;

const ConsoleContainer = styled(motion.div)`
    background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid #FFD700; /* Gold border */
    border-radius: 8px;
    padding: 1rem; /* Use rem */
    margin-top: 1.5rem; /* Use rem */
    margin-bottom: 1.5rem; /* Use rem */
    font-family: 'Share Tech Mono', monospace; /* Hacking font */
    color: #FFD700; /* Gold text */
    font-size: 0.9rem; /* Base font size */
    height: 150px; /* Fixed height for the console */
    overflow-y: auto; /* Allow scrolling */
    text-align: left;
    white-space: pre-wrap;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
    position: relative;
    line-height: 1.4;

    &::after {
        content: '_'; /* Blinking cursor */
        animation: ${blink} 1s infinite;
        font-weight: bold;
        position: absolute;
        bottom: 0.5rem; /* Responsive position */
        right: 0.75rem; /* Responsive position */
    }

    @media (max-width: 480px) {
        font-size: 0.8rem; /* Smaller on mobile */
        padding: 0.75rem;
        height: 120px; /* Slightly smaller height */
    }
`;

const ConsoleLine = styled.span`
    display: block;
    &.error { color: #ff0000; } /* Red for errors */
    &.success { color: #32CD32; } /* LimeGreen for success */
    &.info { color: #00ffff; } /* Cyan for info */
`;

// Constants for calibration
const MAX_CALIBRATION_CLICKS = 20;

// Розклад активів, отриманий зі скріншотів (час у UTC)
// Дні тижня: 0 = Неділя, 1 = Понеділок, ..., 6 = Субота
const ASSET_SCHEDULE = {
    // FOREX (image_46c91d.png) - Перевірено та оновлено згідно наданих списків
    'AUD/CAD': {
        Mon: { start: 7, start_min: 0, end: 21, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 21, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 20, end_min: 55 }, Sat: 'N/A', Sun: 'N/A'
    },
    'AUD/JPY': {
        Mon: { start: 7, start_min: 0, end: 21, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 21, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 20, end_min: 55 }, Sat: 'N/A', Sun: 'N/A'
    },
    'AUD/USD': {
        Mon: { start: 7, start_min: 0, end: 18, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 18, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 18, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 18, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 18, end_min: 0 }, Sat: 'N/A', Sun: 'N/A'
    },
    'AUD/NZD': {
        Mon: { start: 7, start_min: 0, end: 21, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 21, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 20, end_min: 55 }, Sat: 'N/A', Sun: 'N/A'
    },
    'CHF/JPY': {
        Mon: { start: 7, start_min: 0, end: 20, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 20, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 20, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 20, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 20, end_min: 0 }, Sat: 'N/A', Sun: 'N/A'
    },
    'EUR/JPY': {
        Mon: { start: 10, start_min: 0, end: 21, end_min: 0 }, Tue: { start: 10, start_min: 0, end: 21, end_min: 0 },
        Wed: { start: 10, start_min: 0, end: 21, end_min: 0 }, Thu: { start: 10, start_min: 0, end: 21, end_min: 0 },
        Fri: { start: 10, start_min: 0, end: 20, end_min: 55 }, Sat: 'N/A', Sun: 'N/A'
    },
    'EUR/MXN': {
        Mon: { start: 7, start_min: 0, end: 21, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 21, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 20, end_min: 55 }, Sat: 'N/A', Sun: 'N/A'
    },
    'EUR/NZD': {
        Mon: { start: 7, start_min: 0, end: 18, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 18, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 18, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 18, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 18, end_min: 0 }, Sat: 'N/A', Sun: 'N/A'
    },
    'EUR/USD': { // Special case: 24:00-24:00 means full day, Fri 24:00-00:55 means Sat 00:00-00:55
        Mon: { start: 0, start_min: 0, end: 24, end_min: 0 }, Tue: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Wed: { start: 0, start_min: 0, end: 24, end_min: 0 }, Thu: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Fri: { start: 0, start_min: 0, end: 24, end_min: 0 }, // Open all day Friday
        Sat: { start: 0, start_min: 0, end: 0, end_min: 55 }, // Open for 55 mins on Saturday
        Sun: 'N/A'
    },
    'GBP/NZD': {
        Mon: { start: 7, start_min: 0, end: 15, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 15, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 15, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 15, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 15, end_min: 0 }, Sat: 'N/A', Sun: 'N/A'
    },
    'NZD/JPY': {
        Mon: { start: 7, start_min: 0, end: 21, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 21, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 21, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 20, end_min: 55 }, Sat: 'N/A', Sun: 'N/A'
    },
    'NZD/USD': {
        Mon: { start: 9, start_min: 0, end: 18, end_min: 0 }, Tue: { start: 9, start_min: 0, end: 18, end_min: 0 },
        Wed: { start: 9, start_min: 0, end: 18, end_min: 0 }, Thu: { start: 9, start_min: 0, end: 18, end_min: 0 },
        Fri: { start: 9, start_min: 0, end: 17, end_min: 55 }, Sat: 'N/A', Sun: 'N/A'
    },
    'USD/CAD': {
        Mon: { start: 8, start_min: 0, end: 17, end_min: 0 }, Tue: { start: 8, start_min: 0, end: 17, end_min: 0 },
        Wed: { start: 8, start_min: 0, end: 17, end_min: 0 }, Thu: { start: 8, start_min: 0, end: 17, end_min: 0 },
        Fri: { start: 8, start_min: 0, end: 16, end_min: 55 }, Sat: 'N/A', Sun: 'N/A'
    },
    'USD/CHF': {
        Mon: { start: 7, start_min: 0, end: 19, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 19, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 19, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 19, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 19, end_min: 0 }, Sat: 'N/A', Sun: 'N/A'
    },

    // CRYPTO (image_46c8e3.png) - All 24/7
    'ADA/USD': {
        Mon: { start: 0, start_min: 0, end: 24, end_min: 0 }, Tue: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Wed: { start: 0, start_min: 0, end: 24, end_min: 0 }, Thu: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Fri: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sat: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'Altcoin IDX': {
        Mon: { start: 0, start_min: 0, end: 24, end_min: 0 }, Tue: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Wed: { start: 0, start_min: 0, end: 24, end_min: 0 }, Thu: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Fri: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sat: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'Crypto IDX': {
        Mon: { start: 0, start_min: 0, end: 24, end_min: 0 }, Tue: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Wed: { start: 0, start_min: 0, end: 24, end_min: 0 }, Thu: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Fri: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sat: { start: 0, start_min: 0, end: 24, end_min: 0 },
        Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },

    // EQUITIES (image_46c8e3.png)
    'Apple': {
        Mon: { start: 14, start_min: 32, end: 20, end_min: 32 }, Tue: { start: 14, start_min: 32, end: 20, end_min: 32 },
        Wed: { start: 14, start_min: 32, end: 20, end_min: 32 }, Thu: { start: 14, start_min: 32, end: 20, end_min: 32 },
        Fri: { start: 14, start_min: 32, end: 20, end_min: 32 }, Sat: 'N/A', Sun: 'N/A'
    },
    'Google': {
        Mon: { start: 14, start_min: 32, end: 20, end_min: 32 }, Tue: { start: 14, start_min: 32, end: 20, end_min: 32 },
        Wed: { start: 14, start_min: 32, end: 20, end_min: 32 }, Thu: { start: 14, start_min: 32, end: 20, end_min: 32 },
        Fri: { start: 14, start_min: 32, end: 20, end_min: 32 }, Sat: 'N/A', Sun: 'N/A'
    },
    'Nvidia': {
        Mon: { start: 14, start_min: 32, end: 20, end_min: 32 }, Tue: { start: 14, start_min: 32, end: 20, end_min: 32 },
        Wed: { start: 14, start_min: 32, end: 20, end_min: 32 }, Thu: { start: 14, start_min: 32, end: 20, end_min: 32 },
        Fri: { start: 14, start_min: 32, end: 20, end_min: 32 }, Sat: 'N/A', Sun: 'N/A'
    },

    // COMMODITIES (image_46c8a2.png)
    'Gold': {
        Mon: { start: 4, start_min: 0, end: 19, end_min: 0 }, Tue: { start: 4, start_min: 0, end: 19, end_min: 0 },
        Wed: { start: 4, start_min: 0, end: 19, end_min: 0 }, Thu: { start: 4, start_min: 0, end: 19, end_min: 0 },
        Fri: { start: 4, start_min: 0, end: 19, end_min: 0 }, Sat: 'N/A', Sun: 'N/A'
    },

    // INDICIES (image_46c8a2.png)
    'Dow Jones IA': {
        Mon: { start: 14, start_min: 32, end: 20, end_min: 40 }, Tue: { start: 14, start_min: 32, end: 20, end_min: 40 },
        Wed: { start: 14, start_min: 32, end: 20, end_min: 40 }, Thu: { start: 14, start_min: 32, end: 20, end_min: 40 },
        Fri: { start: 14, start_min: 32, end: 20, end_min: 40 }, Sat: 'N/A', Sun: 'N/A'
    },
    'EUR IDX': {
        Mon: { start: 7, start_min: 0, end: 19, end_min: 0 }, Tue: { start: 7, start_min: 0, end: 19, end_min: 0 },
        Wed: { start: 7, start_min: 0, end: 19, end_min: 0 }, Thu: { start: 7, start_min: 0, end: 19, end_min: 0 },
        Fri: { start: 7, start_min: 0, end: 18, end_min: 55 }, Sat: 'N/A', Sun: 'N/A'
    },

    // INDICIES OTC (image_46c8a2.png)
    'DJI/USD (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'NDX/USD (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'DAX/EUR (OTC)': {
        Mon: [{ start: 9, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Tue: [{ start: 9, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Wed: [{ start: 9, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Thu: [{ start: 9, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Fri: [{ start: 9, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'SPX/USD (OTC)': {
        Mon: [{ start: 5, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Tue: [{ start: 5, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Wed: [{ start: 5, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Thu: [{ start: 5, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Fri: [{ start: 5, start_min: 0, end: 13, end_min: 30 }, { start: 20, start_min: 45, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },

    // OTC (image_46c87e.png) - Multiple intervals on weekdays, 24/7 on weekends
    'EUR/CAD (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'USD/JPY (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'GBP/USD (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'EUR/USD (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'AUD/CAD (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 0, end: 24, end_min: 0 }], // Note: 21:00, not 21:05
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 0, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 0, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 0, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 21, start_min: 0, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'GBP/JPY (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'CHF/JPY (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 20, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 20, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 20, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 20, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 20, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'AUD/USD (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 18, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 18, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 18, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 18, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 18, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'EUR/GBP (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'GBP/CHF (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
    'GBP/NZD (OTC)': {
        Mon: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Tue: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Wed: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Thu: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Fri: [{ start: 0, start_min: 0, end: 6, end_min: 55 }, { start: 15, start_min: 5, end: 24, end_min: 0 }],
        Sat: { start: 0, start_min: 0, end: 24, end_min: 0 }, Sun: { start: 0, start_min: 0, end: 24, end_min: 0 }
    },
};


const CONSOLE_MESSAGES = [
    "INIT: Establishing secure connection to broker API...",
    "STATUS: Analyzing market data streams...",
    "SCAN: Detecting optimal entry points for selected asset...",
    "ALGO: Running predictive analytics (AI/ML V3.1)...",
    "DECRYPT: Bypassing anti-detection protocols...",
    "SYNC: Calibrating global time differences (UTC-GMT sync)...",
    "FETCH: Retrieving real-time price feeds...",
    "VALIDATE: Cross-referencing historical patterns...",
    "COMPUTE: Calculating potential profit probabilities...",
    "DEBUG: No critical errors detected. System online.",
    "READY: Signal generation sequence initiated...",
    "ACCESS GRANTED: Privileged market data link established.",
    "WARNING: High volatility detected - proceed with caution.",
    "COMPLETED: Data integrity check passed.",
    "EXECUTING: Trade initiation sequence...",
    "OPTIMIZING: Minimizing latency for rapid execution...",
    "PROCESSING: Financial transaction routing...",
    "SUCCESS: Operation completed."
];

// Функція для перевірки, чи актив доступний за розкладом
const isAssetAvailable = (assetName) => {
    const schedule = ASSET_SCHEDULE[assetName];
    if (!schedule) {
        return false; 
    }

    const now = new Date();
    const utcDay = now.getUTCDay(); // День тижня (0-6, 0=Неділя)
    const utcHour = now.getUTCHours(); // Година у UTC (0-23)
    const utcMinute = now.getUTCMinutes(); // Хвилина у UTC (0-59)

    const dayMap = {
        0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
    };
    const currentDayKey = dayMap[utcDay];
    const daySchedule = schedule[currentDayKey];

    if (!daySchedule || daySchedule === 'N/A') {
        return false;
    }

    const currentTimeInMinutes = utcHour * 60 + utcMinute;

    const checkInterval = (interval) => {
        const startHour = interval.start;
        const startMinute = interval.start_min || 0;
        let endHour = interval.end;
        let endMinute = interval.end_min || 0;

        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;

        if (startTimeInMinutes >= endTimeInMinutes) {
            // Handles cases where end time is on the next day (e.g., 23:00 - 01:00)
            // For simplicity, assuming intervals are within a single UTC day
            return false; 
        }

        return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
    };

    // Handle multiple intervals for a single day (e.g., OTC assets)
    if (Array.isArray(daySchedule)) {
        for (const interval of daySchedule) {
            if (checkInterval(interval)) {
                return true;
            }
        }
        return false;
    } else { // Handle single interval for a day
        return checkInterval(daySchedule);
    }
};


const BinaryOptionsHack = () => {
    const allowedCurrencies = ['USD', 'INR'];

    const [betAmount, setBetAmount] = useState('');
    const [currency, setCurrency] = useState(allowedCurrencies[0]);
    const [betTime, setBetTime] = useState('1m');
    const [timeZone, setTimeZone] = useState('GMT+0');
    const [timeframe, setTimeframe] = useState('1m');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [direction, setDirection] = useState('...');
    const [isAntiDetectOn, setIsAntiDetectOn] = useState(false);
    const [isLegitModeOn, setIsLegitModeOn] = useState(false);
    // Використовуємо calibrationClicks та accessKey з AppContext
    const { language, calibrationClicks, setCalibrationClicks, accessKey } = useAppContext(); 
    const [isSignalLoading, setIsSignalLoading] = useState(false);
    const [isSignalReady, setIsSignalReady] = useState(false);
    // feedbackClicks більше не потрібен тут, SignalStatsModal буде отримувати його з бекенду
    // const [feedbackClicks, setFeedbackClicks] = useState({ up: 0, down: 0 }); 
    const [showStatsModal, setShowStatsModal] = useState(false); // Повертаємо стан для модального вікна
    const [consoleOutput, setConsoleOutput] = useState([]);
    const [availableAssets, setAvailableAssets] = useState([]); // Новий стан для доступних активів
    const [message, setMessage] = useState(''); // Стан для повідомлень користувачу, якщо немає доступних активів

    const consoleRef = useRef(null);

    const t = translations[language];

    // Обчислення прогресу калібрування на основі calibrationClicks
    const progress = (calibrationClicks / MAX_CALIBRATION_CLICKS) * 100;
    const isCalibrated = calibrationClicks >= MAX_CALIBRATION_CLICKS;

    // Оновлення доступних активів на основі розкладу
    useEffect(() => {
        const updateAvailableAssets = () => {
            const allAssets = Object.keys(ASSET_SCHEDULE);
            const currentAvailable = allAssets.filter(isAssetAvailable);
            setAvailableAssets(currentAvailable);
            console.log("Available assets updated:", currentAvailable);
            if (currentAvailable.length === 0) {
                setMessage(t.no_assets_available); // Встановлюємо повідомлення, якщо немає активів
            } else {
                setMessage(''); // Очищаємо повідомлення, якщо активи є
            }
        };

        // Оновлюємо список доступних активів кожну хвилину
        const intervalId = setInterval(updateAvailableAssets, 60 * 1000); // Оновлювати кожну хвилину
        updateAvailableAssets(); // Викликати одразу при завантаженні

        return () => clearInterval(intervalId); // Очистити інтервал при розмонтуванні компонента
    }, [t.no_assets_available]); // Додано t.no_assets_available в залежності, щоб оновлювалося при зміні мови


    // Effect for Console output simulation
    useEffect(() => {
        let interval;
        if (isSignalLoading) {
            setConsoleOutput([]); // Clear console on new signal request
            let messageIndex = 0;
            interval = setInterval(() => {
                if (messageIndex < CONSOLE_MESSAGES.length) {
                    const message = CONSOLE_MESSAGES[messageIndex];
                    let type = 'info';
                    if (message.includes('ERROR') || message.includes('WARNING')) type = 'error';
                    if (message.includes('SUCCESS') || message.includes('READY') || message.includes('GRANTED') || message.includes('COMPLETED')) type = 'success';
                    
                    setConsoleOutput(prev => [...prev, { text: message, type }]);
                    messageIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 300); // Adjust speed of messages
        } else {
            clearInterval(interval);
            // Add a final "ready" message or clear if not loading
            if (isCalibrated && isSignalReady) {
                   setConsoleOutput(prev => {
                       if (!prev.some(line => line.text.includes("SIGNAL READY"))) {
                           return [...prev, { text: "SIGNAL READY: Prediction acquired.", type: "success" }];
                       }
                       return prev;
                   });
            } else if (isCalibrated) {
                // Initial message when calibrated but not yet getting signal
                   setConsoleOutput(prev => {
                       if (prev.length === 0 || !prev.some(line => line.text.includes("SYSTEM ONLINE"))) {
                           return [{ text: "SYSTEM ONLINE: Awaiting signal request...", type: "info" }];
                       }
                       return prev;
                   });
            }
        }
        return () => clearInterval(interval);
    }, [isSignalLoading, isCalibrated, isSignalReady]);

    // Effect to scroll console to bottom on new messages
    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [consoleOutput]);


    const handlePlaceBet = () => {
        console.log("User clicked: Make Trade Now button");
        if (isCalibrated && isSignalReady) {
            alert(`${t.bet_placed_alert} ${betAmount || '...'} ${currency} ${t.on_asset} ${selectedAsset} ${t.for_direction} ${direction} ${t.for_time} ${betTime}`);
            setIsSignalReady(false);
            setDirection('...');
            setConsoleOutput(prev => [...prev, { text: `TRADE: Executing ${direction} trade on ${selectedAsset}...`, type: "info" }]);
            setSelectedAsset(null); // Reset selected asset after placing bet
        }
    };

    const handleGetSignal = async () => { // Зроблено асинхронною
        console.log("User clicked: Get Signal button");
        if (!isCalibrated) {
            setCalibrationClicks(prev => prev + 1);
            console.log(`Calibration click: ${calibrationClicks + 1}/${MAX_CALIBRATION_CLICKS}`);
        }
        
        setIsSignalLoading(true);
        setIsSignalReady(false);
        setDirection('...');
        setSelectedAsset(null);
        
        // Відправка кліку на кнопку "Отримати сигнал" на бекенд
        if (accessKey) {
            try {
                await sendSignalClick(accessKey); // Розкоментовано
                console.log('Signal click sent to backend successfully.');
            } catch (error) {
                console.error('Failed to send signal click to backend:', error);
            }
        } else {
            console.warn('Access key not available, cannot send signal click to backend.');
        }

        if (availableAssets.length > 0) {
            const randomAsset = availableAssets[Math.floor(Math.random() * availableAssets.length)];
            console.log("Randomly selected available asset:", randomAsset);

            setTimeout(() => {
                setSelectedAsset(randomAsset);
                setConsoleOutput(prev => [...prev, { text: `ASSET SELECTION: ${randomAsset} confirmed.`, type: "success" }]);
                
                setTimeout(() => {
                    const newDirection = Math.random() > 0.5 ? 'UP' : 'DOWN';
                    setDirection(newDirection);
                    setIsSignalLoading(false);
                    setIsSignalReady(true);
                    console.log(`Signal generated: ${newDirection} for asset: ${randomAsset}`);
                }, 1000);
            }, 1500);
        } else {
            console.warn("No assets currently available according to the schedule.");
            setConsoleOutput(prev => [...prev, { text: "ERROR: No assets currently available. Please check schedule.", type: "error" }]);
            setIsSignalLoading(false);
            setIsSignalReady(false);
            setMessage(t.no_assets_available);
        }
    };

    const handleFeedbackClick = async (type) => { // Зроблено асинхронною
        console.log(`User clicked feedback: ${type}`);
        // Відправка зворотного зв'язку на бекенд
        if (accessKey) {
            try {
                await sendFeedback(accessKey, type); // Розкоментовано
                console.log(`Feedback '${type}' sent to backend successfully.`);
            } catch (error) {
                console.error(`Failed to send feedback '${type}' to backend:`, error);
            }
        } else {
            console.warn('Access key not available, cannot send feedback to backend.');
        }
        setConsoleOutput(prev => [...prev, { text: `FEEDBACK: User reported signal as ${type === 'up' ? 'accurate' : 'inaccurate'}.`, type: type === 'up' ? "success" : "error" }]);
    };

    // Повертаємо handleViewStats та handleCloseStats
    const handleViewStats = () => {
        console.log("User clicked: View Signal Statistics button");
        setShowStatsModal(true);
    };

    const handleCloseStats = () => {
        console.log("User clicked: Close Signal Statistics modal");
        setShowStatsModal(false);
    };

    const handleBetAmountChange = (e) => {
        console.log(`User entered bet amount: ${e.target.value}`);
        setBetAmount(e.target.value);
    };

    const handleCurrencyChange = (e) => {
        console.log(`User selected currency: ${e.target.value}`);
        setCurrency(e.target.value);
    };

    const handleBetTimeChange = (e) => {
        console.log(`User selected bet time: ${e.target.value}`);
        setBetTime(e.target.value);
    };

    const handleTimeframeChange = (e) => {
        console.log(`User selected timeframe: ${e.target.value}`);
        setTimeframe(e.target.value);
    };

    const handleTimeZoneChange = (e) => {
        console.log(`User selected timezone: ${e.target.value}`);
        setTimeZone(e.target.value);
    };

    const handleAntiDetectToggle = () => {
        console.log(`User toggled Anti-Detect: ${!isAntiDetectOn ? 'ON' : 'OFF'}`);
        setIsAntiDetectOn(!isAntiDetectOn);
    };

    const handleLegitModeToggle = () => {
        console.log(`User toggled Legit Mode: ${!isLegitModeOn ? 'ON' : 'OFF'}`);
        setIsLegitModeOn(!isLegitModeOn);
    };


    return (
        <GameContainer $backgroundImage={backgroundImage}>
            <h3>{t.binary_options_hack}</h3>
            <AnimatePresence mode="wait">
                {!isCalibrated ? (
                    <motion.div
                        key="calibration"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ProgressContainer>
                            <ProgressLabel>
                                {t.binary_calibration_sync.replace('{progress}', progress.toFixed(0))}
                            </ProgressLabel>
                            <ProgressBar>
                                <ProgressBarFill
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                            </ProgressBar>
                        </ProgressContainer>
                    </motion.div>
                ) : (
                    <motion.div
                        key="calibrated"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <NotificationMessage>
                            {t.hack_connected}
                        </NotificationMessage>
                    </motion.div>
                )}
            </AnimatePresence>

            <PredictionDisplay>
                {t.prediction}:{" "}
                <AnimatePresence mode="wait">
                    {direction !== '...' ? (
                        <>
                            <PredictionIconWrapper
                                key={direction + "-icon"}
                                $isUp={direction === 'UP'}
                                initial={{ opacity: 0, y: -50, scale: 0.5 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 50, scale: 0.5 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <FontAwesomeIcon icon={direction === 'UP' ? faArrowUp : faArrowDown} />
                            </PredictionIconWrapper>
                            <PredictionText
                                key={direction + "-text"}
                                $isUp={direction === 'UP'}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {direction}
                            </PredictionText>
                        </>
                    ) : (
                        <motion.span
                            key="loading-prediction-text"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}
                        >
                            {t.awaiting_command}
                        </motion.span>
                    )}
                </AnimatePresence>
            </PredictionDisplay>

            <AssetConfirmationDisplay
                key="asset-status"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                {isSignalLoading ? (
                    <>
                        <SpinnerIcon icon={faCog} spin />
                        {t.getting_signal}
                    </>
                ) : selectedAsset ? (
                    <>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {t.signal_ready}: {selectedAsset}
                    </>
                ) : (
                    <span>&nbsp;</span>
                )}
            </AssetConfirmationDisplay>

            <Form>
                <FormRow>
                    <Input
                        type="number"
                        placeholder={t.bet_amount_placeholder}
                        value={betAmount}
                        onChange={handleBetAmountChange}
                    />
                    <Select
                        value={currency}
                        onChange={handleCurrencyChange}
                    >
                        {allowedCurrencies.map(curr => (
                            <option key={curr} value={curr}>{curr}</option>
                        ))}
                    </Select>
                </FormRow>

                <FormRow>
                    <FormLabel>{t.bet_time_label}:</FormLabel>
                    <Select
                        value={betTime}
                        onChange={handleBetTimeChange}
                    >
                        <option value="1m">1 min</option>
                        <option value="5m">5 min</option>
                        <option value="15m">15 min</option>
                        <option value="30m">30 min</option>
                        <option value="1h">1 hour</option>
                    </Select>
                </FormRow>

                <Button
                    onClick={handleGetSignal}
                    disabled={isSignalLoading || availableAssets.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isSignalLoading ? t.getting_signal : t.get_signal}
                </Button>

                {isCalibrated && isSignalReady && (
                    <Button
                        onClick={handlePlaceBet}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ backgroundColor: '#006400' }}
                    >
                        {t.make_trade_now}
                    </Button>
                )}
            </Form>

            <Form style={{ marginBottom: '25px', marginTop: '15px' }}>
                <FormRow>
                    <FormLabel>{t.timeframe_label}:</FormLabel>
                    <Select
                        value={timeframe}
                        onChange={handleTimeframeChange}
                    >
                        <option value="1s">1 sec</option>
                        <option value="5s">5 sec</option>
                        <option value="1m">1 min</option>
                        <option value="5m">5 min</option>
                        <option value="15m">15 min</option>
                        <option value="30m">30 min</option>
                        <option value="1h">1 hour</option>
                    </Select>
                </FormRow>
                <FormRow>
                    <FormLabel>{t.timezone_label}:</FormLabel>
                    <Select
                        value={timeZone}
                        onChange={handleTimeZoneChange}
                    >
                        <option value="GMT+0">GMT+0</option>
                        <option value="GMT+1">GMT+1 (CET)</option>
                        <option value="GMT+2">GMT+2 (EET)</option>
                        <option value="GMT-4">GMT-4 (EDT)</option>
                    </Select>
                </FormRow>
            </Form>

            <AnimatePresence>
                {(isSignalLoading || consoleOutput.length > 0) && (
                    <ConsoleContainer
                        ref={consoleRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '150px' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        {consoleOutput.map((line, index) => (
                            <ConsoleLine key={index} className={line.type}>
                                {line.text}
                            </ConsoleLine>
                        ))}
                    </ConsoleContainer>
                )}
            </AnimatePresence>

            {message && (
                <NotificationMessage style={{ color: '#ff0000', marginTop: '1rem' }}>
                    {message}
                </NotificationMessage>
            )}

            <FeedbackContainer>
                <FeedbackText>{t.feedback_instruction}</FeedbackText>
                <FeedbackButtons>
                    <FeedbackButton type="up" onClick={() => handleFeedbackClick('up')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </FeedbackButton>
                    <FeedbackButton type="down" onClick={() => handleFeedbackClick('down')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </FeedbackButton>
                </FeedbackButtons>
                <AnimatePresence>
                    {accessKey && ( 
                        <ViewStatsButton
                            onClick={handleViewStats}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t.view_signal_stats}
                        </ViewStatsButton>
                    )}
                </AnimatePresence>
            </FeedbackContainer>

            <SwitcherGroup>
                <Switcher
                    label={t.anti_detect}
                    isOn={isAntiDetectOn}
                    onToggle={handleAntiDetectToggle}
                    disabled={!isCalibrated || isSignalLoading}
                />
                <Switcher
                    label={t.legit_mode}
                    isOn={isLegitModeOn}
                    onToggle={handleLegitModeToggle}
                    disabled={!isCalibrated || isSignalLoading}
                />
            </SwitcherGroup>

            <AnimatePresence>
                {showStatsModal && accessKey && (
                    <SignalStatsModal
                        onClose={handleCloseStats}
                        accessKey={accessKey}
                        key="stats-modal"
                    />
                )}
            </AnimatePresence>
        </GameContainer>
    );
};

export default BinaryOptionsHack;
