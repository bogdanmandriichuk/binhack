// src/components/Games/SignalStatsModal.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import translations from '../../translations';
import { useAppContext } from '../../context/AppContext';
import { getUserFeedbackStats, getUserSignalClicksStats } from '../../api/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background-color: #2a2a2a;
  border-radius: 15px;
  padding: 40px 30px;
  text-align: center;
  max-width: 600px; /* Збільшено максимальну ширину для графіків */
  width: 90%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.3);
  color: #e0e0e0;
  border: 1px solid #FFD700;
  position: relative;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 15px;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #FFD700;
  }
`;

const StatItem = styled.div`
  margin-bottom: 15px;
  font-size: 1.1rem;
  strong {
    color: #FFD700;
  }
`;

const ErrorMessage = styled.p`
    color: #ff4500;
    margin-top: 15px;
    font-size: 0.9rem;
`;

const LoadingMessage = styled.p`
    color: #00ffff;
    margin-top: 15px;
    font-size: 0.9rem;
`;

const ChartContainer = styled.div`
    width: 100%;
    height: 200px; /* Фіксована висота для графіків */
    margin-top: 20px;
    margin-bottom: 20px;
`;

const COLORS = ['#32CD32', '#FF4500']; // Green for likes, Red for dislikes

const SignalStatsModal = ({ onClose, accessKey }) => {
    const { language } = useAppContext();
    const t = translations[language];

    const [userStats, setUserStats] = useState({ up: 0, down: 0, signalClicks: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!accessKey) {
                setError(t.stats_error_no_access_key || 'Access key not available. Cannot fetch stats.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const feedbackData = await getUserFeedbackStats(accessKey);
                const signalClicksData = await getUserSignalClicksStats(accessKey);
                
                setUserStats({
                    up: feedbackData.user_up || 0,
                    down: feedbackData.user_down || 0,
                    signalClicks: signalClicksData.user_clicks || 0
                });
                console.log('SignalStatsModal: Fetched user stats:', { feedbackData, signalClicksData });
            } catch (err) {
                console.error("SignalStatsModal: Failed to fetch user stats:", err);
                setError(t.stats_error_fetching || 'Failed to fetch statistics. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, [accessKey, language, t.stats_error_no_access_key, t.stats_error_fetching]);

    // Дані для кругового графіка
    // Переконайтеся, що name відповідає ключам перекладу
    const pieData = [
        { name: t.likes, value: userStats.up },
        { name: t.dislikes, value: userStats.down },
    ];

    // Дані для бар-чарту (кліки на сигнал)
    // Переконайтеся, що name відповідає ключу перекладу
    const barData = [
        { name: t.signal_button_clicks, value: userStats.signalClicks }
    ];

    return (
        <AnimatePresence>
            <ModalOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <ModalContent
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: -50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <CloseButton onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        &times;
                    </CloseButton>
                    <h2>{t.your_signal_stats}</h2>

                    {loading && <LoadingMessage>{t.loading_stats}</LoadingMessage>}
                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    {!loading && !error && (
                        <>
                            <StatItem>
                                {t.likes}: <strong>{userStats.up}</strong>
                            </StatItem>
                            <StatItem>
                                {t.dislikes}: <strong>{userStats.down}</strong>
                            </StatItem>
                            <StatItem>
                                {t.signal_button_clicks}: <strong>{userStats.signalClicks}</strong>
                            </StatItem>

                            {/* Pie Chart for Likes/Dislikes */}
                            {/* Відображаємо графік тільки якщо є дані (сума лайків і дизлайків > 0) */}
                            {(userStats.up > 0 || userStats.down > 0) && (
                                <>
                                    <h3>{t.feedback_distribution}</h3>
                                    <ChartContainer>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    dataKey="value"
                                                    labelLine={false}
                                                    // label={({ name }) => `${name}`} // ВИДАЛЕНО: Цей рядок прибирав дублювання міток на діаграмі
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                {/* Додано Tooltip та Legend для кращої інтерактивності */}
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </>
                            )}

                            {/* Bar Chart for Signal Clicks */}
                            {/* Відображаємо графік тільки якщо є дані (кліки на сигнал > 0) */}
                            {userStats.signalClicks > 0 && (
                                <>
                                    <h3>{t.signal_clicks_chart_title}</h3>
                                    <ChartContainer>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={barData}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <XAxis dataKey="name" stroke="#e0e0e0" />
                                                <YAxis stroke="#e0e0e0" />
                                                <Tooltip />
                                                {/* <Legend /> - ВИДАЛЕНО: Легенда для BarChart, щоб уникнути дублювання "value" */}
                                                <Bar dataKey="value" fill="#FFD700" /> {/* Gold color for bars */}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </>
                            )}
                        </>
                    )}
                </ModalContent>
            </ModalOverlay>
        </AnimatePresence>
    );
};

export default SignalStatsModal;
