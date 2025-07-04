// src/api/api.js
const API_BASE_URL = 'http://192.168.0.245:5000/api'; // Переконайтеся, що це відповідає вашому бекенду

export const verifyAccessKey = async (accessKey) => {
    try {
        const response = await fetch(`${API_BASE_URL}/verify-access-key`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessKey }),
        });

        const data = await response.json();
        console.log('API: verifyAccessKey - Raw data from backend:', JSON.stringify(data)); // Додано лог з JSON.stringify

        if (!response.ok) {
            console.error('API Error:', data.message);
            return null;
        }
        
        // Перетворюємо depositInfo з бекенду на очікуваний формат
        const transformedData = {
            deposit_amount: data.depositInfo.amount,
            deposit_currency: data.depositInfo.currency,
            isUnlocked: data.isUnlocked
        };
        console.log('API: verifyAccessKey - Transformed data to return:', JSON.stringify(transformedData)); // Додано лог з JSON.stringify
        return transformedData;
    } catch (error) {
        console.error('API: Error verifying access key:', error);
        return null;
    }
};

export const verifyUnlockKey = async (accessKey, unlockKey) => {
    try {
        const response = await fetch(`${API_BASE_URL}/verify-unlock-key`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessKey, unlockKey }),
        });

        const data = await response.json();
        console.log('API: verifyUnlockKey - Raw data from backend:', JSON.stringify(data)); // Додано лог з JSON.stringify

        if (!response.ok) {
            console.error('API Error:', data.message);
            throw new Error(data.message || 'Failed to unlock access.');
        }
        console.log('API: verifyUnlockKey - Success message:', data.message);
        return data;
    } catch (error) {
        console.error('API: Error unlocking access:', error);
        throw error;
    }
};
