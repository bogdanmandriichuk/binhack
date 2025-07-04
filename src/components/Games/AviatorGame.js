import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useProgress } from '../../hooks/useProgress';
import { motion, AnimatePresence } from 'framer-motion';
import Switcher from '../../styles/Switcher';
import translations from '../../translations';
import { useAppContext } from '../../context/AppContext';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import SignalStatsModal from './SignalStatsModal'; // Import the new modal component
import AviatorBg from '../../assets/aviator-bg.jpg'; // Import your background image here

const GameCard = styled.div`
  padding: 25px;
  text-align: center;
  background-image: url(${AviatorBg}); /* Set the background image */
  background-size: cover; /* Cover the entire area */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-color: #343A40; /* Fallback background color if image fails to load */
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white; /* Ensure text is readable on the background image */
  position: relative; /* Needed for overlay */

  /* Optional: Add an overlay for better text readability on busy backgrounds */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3); /* Dark semi-transparent overlay */
    border-radius: 15px;
    z-index: 1;
  }

  > * {
    position: relative; /* Ensure content is above the overlay */
    z-index: 2;
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: 25px;
`;

const ProgressLabel = styled.p`
  font-size: 0.9rem;
  color: white; /* Adjusted for better contrast on dark background */
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  background-color: rgba(255, 255, 255, 0.3); /* Lighter for contrast */
  height: 15px;
  border-radius: 8px;
  overflow: hidden;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background-color: #DC143C; /* Crimson */
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
  border: 1px solid rgba(255, 255, 255, 0.4); /* Lighter border for dark background */
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent dark background */
  color: white;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #DC143C;
    box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.3);
  }
`;

const Select = styled.select`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.4); /* Lighter border for dark background */
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent dark background */
  color: white;
  cursor: pointer;
  min-width: 100px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #DC143C;
    box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.3);
  }
`;

const Button = styled(motion.button)`
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background-color: #DC143C; /* Crimson */
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 150px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #A52A2A; /* Darker red on hover */
  }

  &:disabled {
    background-color: #6c757d;
    color: #e9ecef;
    cursor: not-allowed;
  }
`;

const Coefficient = styled.h4`
  font-size: 2.5rem;
  color: white; /* Adjusted for better contrast on dark background */
  margin-bottom: 20px;
  text-shadow: 0 0 5px rgba(0,0,0,0.5);
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
  color: white; /* Adjusted for better contrast on dark background */
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
  color: white; /* Changed to white for dark background */
  transition: transform 0.2s;
`;

const ViewStatsButton = styled(motion.button)`
  margin-top: 10px;
  background-color: transparent;
  color: white; /* Changed to white for dark background */
  border: 2px solid white; /* White border for dark background */
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  &:hover {
    background-color: white; /* Dark background on hover */
    color: #343A40; /* Dark text on hover */
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
  color: white; /* Adjusted for better contrast on dark background */
  margin-bottom: 20px;
  text-shadow: 0 0 5px rgba(0,0,0,0.5);
`;

// Constants for calibration
const MAX_CALIBRATION_CLICKS = 20;

// Helper to generate a random winning coefficient
const generateWinningCoefficient = () => {
  const coefficients = ['x1.5', 'x2.1', 'x3.5', 'x4.2', 'x5.8', 'x7.9', 'x10.0', 'x15.0', 'x20.0'];
  return coefficients[Math.floor(Math.random() * coefficients.length)];
};

const AviatorGame = () => {
  const [betAmount, setBetAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [coefficient, setCoefficient] = useState('x1.00');
  const [isAntiDetectOn, setIsAntiDetectOn] = useState(false);
  const [isLegitModeOn, setIsLegitModeOn] = useState(false);
  const [calibrationClicks, setCalibrationClicks] = useState(0);
  const [isSignalLoading, setIsSignalLoading] = useState(false);
  const [isSignalReady, setIsSignalReady] = useState(false);
  const [feedbackClicks, setFeedbackClicks] = useState({ up: 0, down: 0 });
  const [showStatsModal, setShowStatsModal] = useState(false);

  const { language } = useAppContext();
  const t = translations[language];

  // Use the hook to calculate progress
  const { progress, isCalibrated } = useProgress(calibrationClicks, MAX_CALIBRATION_CLICKS);

  const handlePlaceBet = () => {
    if (isCalibrated && isSignalReady) {
      alert(`${t.bet_placed_alert} ${betAmount || '...'} ${currency} ${t.at_coefficient} ${coefficient}`);
      setIsSignalReady(false);
      setCoefficient('x1.00');
    }
  };

  const handleGetSignal = () => {
    if (!isCalibrated) {
      setCalibrationClicks(prev => prev + 1);
    }
    console.log(`Calibration step: ${calibrationClicks + 1}/${MAX_CALIBRATION_CLICKS}`);
    
    setIsSignalLoading(true);
    setIsSignalReady(false);
    setCoefficient('...x');
    
    setTimeout(() => {
      const newCoeff = generateWinningCoefficient();
      setCoefficient(newCoeff);
      setIsSignalLoading(false);
      setIsSignalReady(true);
    }, 2000);
  };

  const handleFeedbackClick = (type) => {
    setFeedbackClicks(prev => ({
        ...prev,
        [type]: prev[type] + 1
    }));
    console.log(`Feedback received: ${type} signal. Total feedback:`, { up: feedbackClicks.up + (type === 'up' ? 1 : 0), down: feedbackClicks.down + (type === 'down' ? 1 : 0) });
  };

  // Handler to open the stats modal
  const handleViewStats = () => {
    setShowStatsModal(true);
  };

  // Handler to close the stats modal
  const handleCloseStats = () => {
    setShowStatsModal(false);
  };

  return (
    <GameCard>
      <h3>AVIATOR</h3>
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
                {t.aviator_calibration_sync.replace('{progress}', progress.toFixed(0))}
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

      <Coefficient>{t.coefficient} {coefficient}</Coefficient>

      <Form>
        <Input
          type="number"
          placeholder={t.bet_amount_placeholder}
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        <Select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="UAH">UAH</option>
        </Select>
        
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
                style={{ backgroundColor: '#8B0000' }} /* Dark Red */
            >
                {t.place_bet_now}
            </Button>
        )}
      </Form>

      <FeedbackContainer>
        <FeedbackText>{t.feedback_instruction}</FeedbackText>
        <FeedbackButtons>
          <FeedbackButton type="up" onClick={() => handleFeedbackClick('up')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FaThumbsUp />
          </FeedbackButton>
          <FeedbackButton type="down" onClick={() => handleFeedbackClick('down')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FaThumbsDown />
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
        <Switcher label={t.anti_detect} isOn={isAntiDetectOn} onToggle={() => setIsAntiDetectOn(!isAntiDetectOn)} disabled={!isCalibrated} />
        <Switcher label={t.legit_mode} isOn={isLegitModeOn} onToggle={() => setIsLegitModeOn(!isLegitModeOn)} disabled={!isCalibrated} />
      </SwitcherGroup>

      {/* --- NEW MODAL FOR STATISTICS --- */}
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

export default AviatorGame;