import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import BinaryOptionsHack from '../Games/BinaryOptionsGame';
import WinnersTicker from '../Common/WinnersTicker';
import DepositInfo from '../Auth/DepositInfo';
import UnlockConfirmationModal from '../Common/UnlockConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
    position: relative;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    background-color: #1a1a1a;
    color: #e0e0e0;
`;

const DashboardContentWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    transition: filter 0.3s ease-in-out, pointer-events 0.3s;

    ${props => props.$isBlurred && `
        filter: blur(5px);
        pointer-events: none;
        user-select: none;
    `}
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
`;

const MainTitle = styled.h2`
    font-size: 2.5rem;
    color: #FFD700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    margin: 0;
    flex-grow: 1;
    text-align: center;
`;

const LanguageSelector = styled.select`
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

const Dashboard = () => {
    const { language, setLanguage, depositInfo, isUnlocked, showUnlockConfirmationModal, setShowUnlockConfirmationModal } = useAppContext();

    useEffect(() => {
        // Цей useEffect спрацьовує при кожному ререндері, включаючи перше завантаження.
        // Якщо isUnlocked вже true, і модальне вікно чомусь активне, ми його вимикаємо.
        if (isUnlocked && showUnlockConfirmationModal) {
            console.log('Dashboard: Resetting showUnlockConfirmationModal because isUnlocked is true on load.');
            setShowUnlockConfirmationModal(false);
        }
    }, [isUnlocked, showUnlockConfirmationModal, setShowUnlockConfirmationModal]);

    const isDepositInfoVisible = depositInfo && !isUnlocked;
    const isBlurred = isDepositInfoVisible || showUnlockConfirmationModal;


    return (
        <Container>
            <DashboardContentWrapper $isBlurred={isBlurred}>
                <Header>
                    <MainTitle>Binary Options Hack</MainTitle>
                    <LanguageSelector value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="en">English</option>
                        <option value="hi">हिन्दी</option>
                    </LanguageSelector>
                </Header>

                <motion.div
                    key="binary-options-hack"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <BinaryOptionsHack />
                </motion.div>

                <WinnersTicker />
            </DashboardContentWrapper>

            {isDepositInfoVisible && <DepositInfo />}

            <AnimatePresence>
                {showUnlockConfirmationModal && <UnlockConfirmationModal />}
            </AnimatePresence>
        </Container>
    );
};

export default Dashboard;