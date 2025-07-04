import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useProgress } from '../../hooks/useProgress';
import { motion, AnimatePresence } from 'framer-motion';
import translations from '../../translations';
import { useAppContext } from '../../context/AppContext';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import SignalStatsModal from './SignalStatsModal';
import Switcher from '../../styles/Switcher'; // Import the Switcher component
import ChickenRoadBg from '../../assets/chicken-road-bg.jpg'; // Import your background image here

// --- STYLED COMPONENTS ---
const GameCard = styled.div`
  padding: 25px;
  text-align: center;
  background-image: url(${ChickenRoadBg}); /* Set the background image */
  background-size: cover; /* Cover the entire area */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-color: #333333; /* Fallback background color if image fails to load */
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4), 0 5px 10px rgba(0, 0, 0, 0.2); /* Enhanced shadow */
  border: 1px solid rgba(255, 255, 255, 0.2); /* Subtle light border */
  color: white; /* Ensure text is readable on the background image */
  position: relative; /* Needed for overlay */
  overflow: hidden; /* Ensure content and overlay stay within bounds */

  /* Optional: Add an overlay for better text readability on busy backgrounds */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4); /* Dark semi-transparent overlay */
    border-radius: 15px;
    z-index: 1;
  }

  > * {
    position: relative; /* Ensure content is above the overlay */
    z-index: 2;
  }

  h3 {
    color: #FFC107; /* Orange/yellow for game title */
    text-shadow: 0 0 10px rgba(255, 193, 7, 0.7);
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: 25px;
`;

const ProgressLabel = styled.p`
  font-size: 0.9rem;
  color: #e0e0e0; /* Light gray for progress label */
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  background-color: rgba(255, 255, 255, 0.3); /* Light semi-transparent for empty progress */
  height: 15px;
  border-radius: 8px;
  overflow: hidden;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background-color: #FFC107; /* Orange/yellow for progress fill */
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.7); /* Glow effect */
`;

const NotificationMessage = styled(motion.p)`
  font-size: 1.2rem;
  font-weight: bold;
  color: #28a745; /* Green for hack connected message */
  margin-bottom: 20px;
  text-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
`;

const LevelSelector = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  span {
    color: #e0e0e0; /* Light gray for label */
  }
`;

const Select = styled.select`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.4); /* Light border */
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent dark background */
  color: white;
  cursor: pointer;
  min-width: 150px;
  transition: border-color 0.3s, box-shadow 0.3s;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M208.5%2080.5l-80%2080-80-80H208.5z%22%2F%3E%3C%2Fsvg%3E'); /* White arrow for dark background */
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: #FFC107; /* Orange/yellow on focus */
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.3);
  }
`;

const StepsIndicator = styled.h4`
  font-size: 2.5rem;
  color: #FFC107; /* Orange/yellow for steps indicator */
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 193, 7, 0.7);
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
  border: 1px solid rgba(255, 255, 255, 0.4); /* Light border */
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent dark background */
  color: white;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #FFC107; /* Orange/yellow on focus */
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.3);
  }
`;

const Button = styled(motion.button)`
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background-color: #555555; /* Dark gray button */
  color: #FFC107; /* Orange/yellow text */
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
  min-width: 150px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #666666; /* Lighter gray on hover */
    box-shadow: 0 0 10px rgba(255, 193, 7, 0.4); /* Orange/yellow glow on hover */
  }

  &:disabled {
    background-color: #3a3a3a;
    color: #888888;
    cursor: not-allowed;
    box-shadow: none;
  }
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
  color: #e0e0e0; /* Light gray for feedback text */
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
  color: ${props => props.type === 'up' ? '#28a745' : '#dc3545'}; /* Green/red */
  transition: transform 0.2s;
`;

const ViewStatsButton = styled(motion.button)`
  margin-top: 10px;
  background-color: transparent;
  color: #FFC107; /* Orange/yellow for stats button */
  border: 2px solid #FFC107; /* Orange/yellow border */
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
  &:hover {
    background-color: #FFC107; /* Orange/yellow fill on hover */
    color: #1a1a1a; /* Dark text on hover */
    box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
  }
`;

const FeedbackInstruction = styled.p`
  font-size: 0.9rem;
  color: #e0e0e0; /* Light gray for instruction text */
  margin-bottom: 15px;
  max-width: 400px;
  line-height: 1.5;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
`;

const SwitcherGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

// Constants for calibration
const MAX_CALIBRATION_CLICKS = 10;
const CALIBRATION_INTERVAL_MS = 3000; // 3 seconds delay for calibration clicks

const ChickenRoadGame = () => {
  const [betAmount, setBetAmount] = useState('');
  const [currency, setCurrency] = useState('UAH'); // NEW: State for currency
  const [level, setLevel] = useState('easy');
  const [calibrationClicks, setCalibrationClicks] = useState(0);
  const [signalSteps, setSignalSteps] = useState(null);
  const [isSignalLoading, setIsSignalLoading] = useState(false);
  const [isSignalReady, setIsSignalReady] = useState(false);
  const [feedbackClicks, setFeedbackClicks] = useState({ up: 0, down: 0 });
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [isCalibratingCooldown, setIsCalibratingCooldown] = useState(false); // New state for calibration cooldown

  // States for Anti-detect and Legit Mode
  const [isAntiDetectOn, setIsAntiDetectOn] = useState(false);
  const [isLegitModeOn, setIsLegitModeOn] = useState(false);
  
  const { language } = useAppContext();
  const t = translations[language];

  // useProgress hook to track calibration progress
  const { progress, isCalibrated } = useProgress(calibrationClicks, MAX_CALIBRATION_CLICKS);

  // Effect to manage calibration button cooldown
  useEffect(() => {
    if (isCalibratingCooldown) {
      const timer = setTimeout(() => {
        setIsCalibratingCooldown(false);
      }, CALIBRATION_INTERVAL_MS);
      return () => clearTimeout(timer);
    }
  }, [isCalibratingCooldown]);


  // Manual calibration click handler
  const handleCalibrate = () => {
    if (calibrationClicks < MAX_CALIBRATION_CLICKS && !isCalibratingCooldown) {
      setCalibrationClicks(prev => prev + 1);
      setIsCalibratingCooldown(true); // Start cooldown
    }
  };

  const handleGetSignal = () => {
    if (isSignalLoading) return;

    setIsSignalLoading(true);
    setIsSignalReady(false);
    setSignalSteps(null);

    const getStepsByLevel = (selectedLevel) => {
      switch (selectedLevel) {
        case 'easy':
          return Math.floor(Math.random() * (20 - 10 + 1)) + 10; // 10-20 steps
        case 'medium':
          return Math.floor(Math.random() * (10 - 5 + 1)) + 5; // 5-10 steps
        case 'hard':
          return Math.floor(Math.random() * (5 - 2 + 1)) + 2; // 2-5 steps
        case 'extra-hard':
          return Math.floor(Math.random() * (2 - 1 + 1)) + 1; // 1-2 steps
        default:
          return 1;
      }
    };

    // Simulate signal loading time (3-second delay)
    setTimeout(() => {
      const steps = getStepsByLevel(level);
      setSignalSteps(steps);
      setIsSignalLoading(false);
      setIsSignalReady(true);
    }, 3000); // 3-second delay
  };
  
  const handlePlaceBet = () => {
    if (isCalibrated && isSignalReady) {
      alert(`${t.bet_placed_alert} ${betAmount || '...'} ${currency} ${t.and_steps} ${signalSteps}`); // UPDATED: Added currency
      // Reset signal state after placing bet
      setIsSignalReady(false);
      setSignalSteps(null);
    }
  };

  const handleFeedbackClick = (type) => {
    setFeedbackClicks(prev => ({
        ...prev,
        [type]: prev[type] + 1
    }));
    console.log(`Feedback received: ${type} signal. Total feedback:`, { up: feedbackClicks.up + (type === 'up' ? 1 : 0), down: feedbackClicks.down + (type === 'down' ? 1 : 0) });
  };

  const handleViewStats = () => {
    setShowStatsModal(true);
  };

  const handleCloseStats = () => {
    setShowStatsModal(false);
  };

  return (
    <GameCard>
      <h3>CHICKEN ROAD</h3>
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
                {t.chicken_road_calibration_sync.replace('{progress}', Math.round(progress))}
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
            <NotificationMessage>{t.hack_connected}</NotificationMessage>
          </motion.div>
        )}
      </AnimatePresence>

      <LevelSelector>
        <span>{t.level}</span>
        <Select value={level} onChange={(e) => setLevel(e.target.value)} disabled={isSignalLoading}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="extra-hard">Extra Hard</option>
        </Select>
      </LevelSelector>

      {/* Show recommended steps only after a signal is ready */}
      {isSignalReady && (
        <AnimatePresence>
            <motion.div key="steps-indicator" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                <StepsIndicator>{t.chicken_steps} {signalSteps}</StepsIndicator>
            </motion.div>
        </AnimatePresence>
      )}

      <Form>
        <Input
          type="number"
          placeholder={t.bet_amount_placeholder}
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        {/* NEW: Currency Selector */}
        <Select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="UAH">UAH</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </Select>
        
        {/* Conditional buttons based on calibration and signal status */}
        {!isCalibrated ? (
            <Button onClick={handleCalibrate} disabled={isCalibratingCooldown} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {t.start_calibration}
            </Button>
        ) : (
            <>
                <Button 
                    onClick={handleGetSignal} 
                    disabled={isSignalLoading}
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                >
                    {isSignalLoading ? t.getting_signal : t.get_signal}
                </Button>
                {isSignalReady && (
                    <Button 
                        onClick={handlePlaceBet} 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        style={{ backgroundColor: '#FF8C00' }} /* Darker orange for 'Place Bet Now' */
                    >
                        {t.place_bet_now}
                    </Button>
                )}
            </>
        )}
      </Form>
      
      {/* Feedback buttons and stats button */}
      <FeedbackContainer>
        <FeedbackInstruction>{t.feedback_instruction}</FeedbackInstruction>
        <FeedbackButtons>
            <FeedbackButton type="up" onClick={() => handleFeedbackClick('up')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FaThumbsUp />
            </FeedbackButton>
            <FeedbackButton type="down" onClick={() => handleFeedbackClick('down')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FaThumbsDown />
            </FeedbackButton>
        </FeedbackButtons>
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
      </FeedbackContainer>

      {/* Anti-detect and Legit Mode switchers (MOVED HERE) */}
      <SwitcherGroup>
        <Switcher label={t.anti_detect} isOn={isAntiDetectOn} onToggle={() => setIsAntiDetectOn(!isAntiDetectOn)} disabled={!isCalibrated} />
        <Switcher label={t.legit_mode} isOn={isLegitModeOn} onToggle={() => setIsLegitModeOn(!isLegitModeOn)} disabled={!isCalibrated} />
      </SwitcherGroup>

      {/* --- MODAL FOR STATISTICS --- */}
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

export default ChickenRoadGame;