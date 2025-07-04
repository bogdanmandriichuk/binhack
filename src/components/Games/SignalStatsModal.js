import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import translations from '../../translations';

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
`;

const ModalContent = styled(motion.div)`
  background-color: var(--card-background);
  padding: 30px;
  border-radius: 15px;
  box-shadow: var(--shadow);
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 25px;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  height: 200px;
  padding: 10px;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 20px;
`;

const ChartColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 120px;
`;

const ChartBar = styled(motion.div)`
  width: 100%;
  background-color: ${props => props.color || 'var(--primary-color)'};
  border-radius: 5px 5px 0 0;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
`;

const BarLabel = styled.span`
  margin-top: 10px;
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-color);
`;

const StatsGrid = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const StatsItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const StatValue = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.color || 'var(--primary-color)'};
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: #888;
`;

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, type: 'spring', damping: 15, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const SignalStatsModal = ({ feedbackClicks, onClose }) => {
  const { language } = useAppContext();
  const t = translations[language];

  const { up, down } = feedbackClicks;
  const total = up + down;
  const upPercentage = total > 0 ? (up / total) * 100 : 0;
  const downPercentage = total > 0 ? (down / total) * 100 : 0;
  const accuracyPercentage = upPercentage;

  return (
    <ModalOverlay>
      <ModalContent
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ChartTitle>{t.signal_accuracy}</ChartTitle>

        <ChartContainer>
          <ChartColumn>
            <ChartBar
              color="#28a745"
              initial={{ height: '0%' }}
              animate={{ height: `${upPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
            <BarLabel>{t.profitable_signals}</BarLabel>
          </ChartColumn>
          <ChartColumn>
            <ChartBar
              color="#dc3545"
              initial={{ height: '0%' }}
              animate={{ height: `${downPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
            <BarLabel>{t.unprofitable_signals}</BarLabel>
          </ChartColumn>
        </ChartContainer>

        <StatsGrid>
          <StatsItem>
            <StatValue color="var(--primary-color)">{accuracyPercentage.toFixed(1)}%</StatValue>
            <StatLabel>{t.accuracy}</StatLabel>
          </StatsItem>
          <StatsItem>
            <StatValue color="#28a745">{up}</StatValue>
            <StatLabel>{t.profitable_count}</StatLabel>
          </StatsItem>
          <StatsItem>
            <StatValue color="#dc3545">{down}</StatValue>
            <StatLabel>{t.unprofitable_count}</StatLabel>
          </StatsItem>
        </StatsGrid>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SignalStatsModal;