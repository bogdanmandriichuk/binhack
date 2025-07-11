// src/api/api.js
// ВАЖЛИВО: Замініть 'ВАША_ЛОКАЛЬНА_IP' на фактичну IP-адресу вашого комп'ютера в локальній мережі.
// Наприклад: 'http://192.168.1.100:5000/api'
const BACKEND_URL = 'http://192.168.0.245:5000/api'; 

export const verifyAccessKey = async (accessKey) => {
    try {
        const response = await fetch(`${BACKEND_URL}/verify-access-key`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessKey })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API: verifyAccessKey - Backend responded with error:', errorData); // Додано лог помилки від бекенду
            throw new Error(errorData.message || 'Failed to verify access key.');
        }

        const data = await response.json(); // Це сира відповідь від бекенду
        console.log('API: verifyAccessKey - Raw data from backend:', data); // Лог сирих даних

        // Перевіряємо, чи існує data.depositInfo та його властивості
        const amount = data.depositInfo ? data.depositInfo.amount : undefined;
        const currency = data.depositInfo ? data.depositInfo.currency : undefined;
        const isUnlocked = data.isUnlocked;

        console.log('API: verifyAccessKey - Transformed data to return:', { amount, currency, isUnlocked }); // Лог трансформованих даних
        
        return {
            amount: amount,
            currency: currency,
            isUnlocked: isUnlocked
        };
    } catch (error) {
        console.error('API: verifyAccessKey - Error during fetch:', error); // Лог помилки мережі/іншої помилки
        throw error;
    }
};

export const verifyUnlockKey = async (accessKey, unlockKey) => {
    try {
        const response = await fetch(`${BACKEND_URL}/verify-unlock-key`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessKey, unlockKey })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API: verifyUnlockKey - Backend responded with error:', errorData);
            throw new Error(errorData.message || 'Failed to unlock access.');
        }

        console.log('API: verifyUnlockKey - Access unlocked successfully.');
        return true; // Успішно розблоковано
    } catch (error) {
        console.error('API: verifyUnlockKey - Error during fetch:', error);
        throw error;
    }
};

// Function to send feedback (like/dislike)
export const sendFeedback = async (accessKey, feedbackType) => {
    try {
        const response = await fetch(`${BACKEND_URL}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessKey, feedbackType }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error sending feedback:', errorData.message);
            throw new Error(errorData.message || 'Failed to send feedback.');
        }
        console.log(`API: sendFeedback - Feedback '${feedbackType}' sent successfully.`);
        return await response.json(); // Повертаємо відповідь бекенду
    } catch (error) {
        console.error('API: Error sending feedback:', error);
        throw error;
    }
};

// NEW FUNCTION: Send signal button click
export const sendSignalClick = async (accessKey) => {
    try {
        const response = await fetch(`${BACKEND_URL}/signal-click`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessKey }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error sending signal click:', errorData.message);
            throw new Error(errorData.message || 'Failed to send signal click.');
        }
        console.log('API: sendSignalClick - Signal click sent successfully.');
        return await response.json(); // Повертаємо відповідь бекенду
    } catch (error) {
        console.error('API: Error sending signal click:', error);
        throw error;
    }
};

// Functions to get statistics (for bot and user-specific display)
export const getGlobalFeedbackStats = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/stats/feedback/global`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch global feedback stats.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching global feedback stats:', error);
        throw error;
    }
};

// Function to get user-specific feedback statistics
export const getUserFeedbackStats = async (accessKey) => {
    try {
        const response = await fetch(`${BACKEND_URL}/stats/feedback/user/${accessKey}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error fetching user feedback stats:', errorData.message);
            throw new Error(errorData.message || 'Failed to fetch user feedback stats.');
        }
        const data = await response.json();
        console.log('API: getUserFeedbackStats - Received data:', data);
        return data;
    } catch (error) {
        console.error('API: Error fetching user feedback stats:', error);
        throw error;
    }
};

// Function to get global signal clicks statistics (for bot)
export const getSignalClicksStats = async (adminToken) => {
    try {
        const response = await fetch(`${BACKEND_URL}/stats/signal-clicks/global?adminToken=${adminToken}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch global signal clicks stats.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching global signal clicks stats:', error);
        throw error;
    }
};

// Function to get user-specific signal clicks statistics
export const getUserSignalClicksStats = async (accessKey) => {
    try {
        const response = await fetch(`${BACKEND_URL}/stats/signal-clicks/user/${accessKey}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error fetching user signal clicks stats:', errorData.message);
            throw new Error(errorData.message || 'Failed to fetch user signal clicks stats.');
        }
        const data = await response.json();
        console.log('API: getUserSignalClicksStats - Received data:', data);
        return data;
    } catch (error) {
        console.error('API: Error fetching user signal clicks stats:', error);
        throw error;
    }
};

// Function to get admin users (for bot)
export const getAdminUsers = async (adminToken) => {
    try {
        const response = await fetch(`${BACKEND_URL}/admin/users?adminToken=${adminToken}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch admin users.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching admin users:', error);
        throw error;
    }
};
