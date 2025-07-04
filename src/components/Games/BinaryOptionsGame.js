// src/components/Games/BinaryOptionsHack.js
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


// --- Styled Components (Updated & New) ---

const GameCard = styled.div`
    padding: 25px;
    text-align: center;
    background-color: #3C3000; /* Dark yellow/gold background */
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #FFD700; /* Gold/Yellow border */
    color: white;
    position: relative;
    overflow: hidden;

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
`;

const ProgressContainer = styled.div`
    margin-bottom: 25px;
`;

const ProgressLabel = styled.p`
    font-size: 0.9rem;
    color: white;
    margin-bottom: 10px;
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
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
`;

const Input = styled.input`
    flex: 1;
    min-width: 120px;
    padding: 12px;
    font-size: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
        outline: none;
        border-color: #FFD700; /* Gold focus */
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
    }
`;

const Select = styled.select`
    padding: 12px;
    font-size: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    cursor: pointer;
    min-width: 100px;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
        outline: none;
        border-color: #FFD700; /* Gold focus */
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
    }
`;

const FormLabel = styled.label`
    font-size: 0.9rem;
    color: white;
    margin-right: 5px;
    white-space: nowrap; /* Prevent line breaks for labels */
`;

const FormRow = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
`;

const Button = styled(motion.button)`
    padding: 12px 25px;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    background-color: #FFD700; /* Gold */
    color: #3C3000; /* Dark yellow/gold text */
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 150px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

    &:hover {
        background-color: #E6B800; /* Darker gold on hover */
    }

    &:disabled {
        background-color: #6c757d;
        color: #e9ecef;
        cursor: not-allowed;
    }
`;

const PredictionDisplay = styled.h4`
    font-size: 2.5rem;
    color: white;
    margin-bottom: 20px;
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
    height: 80px; /* Fixed height to prevent layout shift */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px; /* Increased space between icon and text */
`;

const PredictionIconWrapper = styled(motion.div)`
    font-size: 3rem; /* Larger icon */
    color: ${props => props.$isUp ? '#32CD32' : '#FF4500'}; /* LimeGreen for UP, OrangeRed for DOWN */
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PredictionText = styled(motion.span)`
    font-weight: bold;
    font-size: 2.2rem; /* Make the text slightly smaller than icon but still prominent */
    color: ${props => props.$isUp ? '#32CD32' : '#FF4500'}; /* Match icon color */
`;

const AssetConfirmationDisplay = styled(motion.div)`
    font-size: 1.5rem;
    font-weight: bold;
    color: #FFD700; /* Gold color for emphasis */
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
    min-height: 30px; /* Ensure it occupies space even when showing a temporary message */
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
    margin-top: 10px;
    margin-bottom: 30px;
    text-align: center;
`;

const FeedbackText = styled.p`
    font-size: 0.9rem;
    color: white;
    margin-bottom: 15px;
    max-width: 300px;
    text-shadow: 0 0 3px rgba(0,0,0,0.5);
`;

const FeedbackButtons = styled.div`
    display: flex;
    gap: 30px;
`;

const FeedbackButton = styled(motion.button)`
    background: none;
    border: none;
    font-size: 2.5rem;
    cursor: pointer;
    color: white;
    transition: transform 0.2s;
`;

const ViewStatsButton = styled(motion.button)`
    margin-top: 10px;
    background-color: transparent;
    color: white;
    border: 2px solid white;
    padding: 8px 15px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    &:hover {
        background-color: white;
        color: #3C3000;
    }
`;

const SwitcherGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 20px;
`;

const NotificationMessage = styled(motion.p)`
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    margin-bottom: 20px;
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
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
    padding: 15px;
    margin-top: 25px;
    margin-bottom: 25px;
    font-family: 'Share Tech Mono', monospace; /* Hacking font */
    color: #FFD700; /* Gold text */
    font-size: 0.9rem;
    height: 150px; /* Fixed height for the console */
    overflow-y: auto; /* Allow scrolling */
    text-align: left;
    white-space: pre-wrap; /* Preserve whitespace and break lines */
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); /* Gold glow */
    position: relative;
    line-height: 1.4;

    &::after {
        content: '_'; /* Blinking cursor */
        animation: ${blink} 1s infinite;
        font-weight: bold;
        position: absolute;
        bottom: 10px;
        right: 15px;
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

// List of assets (currency pairs, indices, stocks, commodities)
const ASSETS = [
    'ADA/USD', 'Crypto IDX', 'CHF/JPY', 'USD/CAD (OTC)', 'GBP/CHF (OTC)',
    'EUR/JPY', 'AUD/NZD', 'EUR/USD', 'GBP/JPY (OTC)', 'EUR/GBP (OTC)',
    'AUD/JPY', 'AUD/CAD', 'USD/CHF', 'GBP/NZD (OTC)', 'NZD/JPY',
    'EUR IDX', 'EUR/MXN', 'Apple', 'Nvidia', 'Dow Jones IA',
    'Google', 'Gold', 'Altcoin IDX', 'Bitcoin/USD', 'Ethereum/USD'
];

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
    // Використовуємо calibrationClicks з AppContext для збереження стану
    const { language, calibrationClicks, setCalibrationClicks } = useAppContext(); 
    const [isSignalLoading, setIsSignalLoading] = useState(false);
    const [isSignalReady, setIsSignalReady] = useState(false);
    const [feedbackClicks, setFeedbackClicks] = useState({ up: 0, down: 0 });
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState([]);

    const consoleRef = useRef(null);

    const t = translations[language];

    // Використовуємо hook useProgress з оновленим calibrationClicks
    const { progress, isCalibrated } = useProgress(calibrationClicks, MAX_CALIBRATION_CLICKS);

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
                    if (message.includes('ERROR')) type = 'error';
                    if (message.includes('SUCCESS') || message.includes('READY')) type = 'success';

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
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight; // Змінено console.current на consoleRef.current
        }
    }, [consoleOutput]);


    const handlePlaceBet = () => {
        console.log("User clicked: Make Trade Now button");
        if (isCalibrated && isSignalReady) {
            alert(`${t.bet_placed_alert_binary} ${betAmount || '...'} ${currency} ${t.on_asset} ${selectedAsset} ${t.for_direction} ${direction} ${t.for_time} ${betTime}`);
            setIsSignalReady(false);
            setDirection('...');
            setSelectedAsset(null); // Reset selected asset after placing bet
            setConsoleOutput(prev => [...prev, { text: `TRADE: Executing ${direction} trade on ${selectedAsset}...`, type: "info" }]);
        }
    };

    const handleGetSignal = () => {
        console.log("User clicked: Get Signal button");
        if (!isCalibrated) {
            setCalibrationClicks(prev => prev + 1); // Оновлюємо calibrationClicks через AppContext
            console.log(`Calibration click: ${calibrationClicks + 1}/${MAX_CALIBRATION_CLICKS}`);
        }
        
        setIsSignalLoading(true);
        setIsSignalReady(false);
        setDirection('...'); // Reset direction while loading
        setSelectedAsset(null); // Set to null to trigger "Calculating new signal..."
        
        // Automatically generate a random asset
        const randomAsset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
        console.log("Randomly selected asset:", randomAsset);

        // Simulate asset selection and confirmation
        setTimeout(() => {
            setSelectedAsset(randomAsset); // Set the automatically generated asset
            setConsoleOutput(prev => [...prev, { text: `ASSET SELECTION: ${randomAsset} confirmed.`, type: "success" }]);
            
            // Then simulate signal generation after another delay
            setTimeout(() => {
                const newDirection = Math.random() > 0.5 ? 'UP' : 'DOWN';
                setDirection(newDirection);
                setIsSignalLoading(false);
                setIsSignalReady(true);
                console.log(`Signal generated: ${newDirection} for asset: ${randomAsset}`);
            }, 1000); // Shorter delay before signal appears
        }, 1500); // Simulate network request delay for asset selection
    };

    const handleFeedbackClick = (type) => {
        console.log(`User clicked feedback: ${type}`);
        setFeedbackClicks(prev => ({
            ...prev,
            [type]: prev[type] + 1
        }));
        setConsoleOutput(prev => [...prev, { text: `FEEDBACK: User reported signal as ${type === 'up' ? 'accurate' : 'inaccurate'}.`, type: type === 'up' ? "success" : "error" }]);
    };

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
        <GameCard $backgroundImage={backgroundImage}>
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
                            style={{ color: 'white', fontWeight: 'bold' }}
                        >
                            {t.loading_prediction}
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
                    disabled={isSignalLoading}
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
                    {feedbackClicks.up + feedbackClicks.down > 0 && (
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
                {showStatsModal && (
                    <SignalStatsModal
                        feedbackClicks={feedbackClicks}
                        onClose={handleCloseStats}
                        key="stats-modal"
                    />
                )}
            </AnimatePresence>
        </GameCard>
    );
};

export default BinaryOptionsHack