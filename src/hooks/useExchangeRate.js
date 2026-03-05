import { useState, useEffect } from 'react';

const FALLBACK_RATE = 5.45;
const CACHE_KEY = 'gh_exchange_rate';
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

/**
 * Hook para buscar cotação USD/BRL em tempo real com cache
 */
export const useExchangeRate = () => {
    const [rate, setRate] = useState(FALLBACK_RATE);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        const fetchRate = async () => {
            // Check cache
            try {
                const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
                if (cached.rate && cached.timestamp && Date.now() - cached.timestamp < CACHE_TTL) {
                    setRate(cached.rate);
                    setIsLive(true);
                    return;
                }
            } catch { /* ignore */ }

            // Fetch live rate
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/USD');
                const data = await res.json();
                if (data.rates?.BRL) {
                    const liveRate = data.rates.BRL;
                    setRate(liveRate);
                    setIsLive(true);
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: liveRate, timestamp: Date.now() }));
                }
            } catch {
                setIsLive(false);
            }
        };

        fetchRate();
    }, []);

    return { rate, isLive, fallbackRate: FALLBACK_RATE };
};
