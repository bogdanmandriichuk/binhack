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
