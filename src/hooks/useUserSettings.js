import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useUserSettings() {
    const { user } = useAuth();
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);

    // Carregar do Supabase ao iniciar (se logado) ou localStorage (se deslogado)
    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) {
                const localKey = localStorage.getItem('gh_api_key') || '';
                setApiKey(localKey);
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('user_settings')
                    .select('openrouter_api_key')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data?.openrouter_api_key) {
                    setApiKey(data.openrouter_api_key);
                } else {
                    // Fallback to local if no db entry yet
                    const localKey = localStorage.getItem('gh_api_key') || '';
                    setApiKey(localKey);
                }
            } catch (err) {
                console.error('Error fetching settings:', err.message);
                const localKey = localStorage.getItem('gh_api_key') || '';
                setApiKey(localKey);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [user]);

    const saveApiKey = async (newKey) => {
        setApiKey(newKey);
        localStorage.setItem('gh_api_key', newKey);

        if (user) {
            try {
                const { error } = await supabase
                    .from('user_settings')
                    .upsert({ 
                        user_id: user.id, 
                        openrouter_api_key: newKey,
                        updated_at: new Date().toISOString()
                    });

                if (error) throw error;
            } catch (err) {
                console.error('Error saving settings to Supabase:', err.message);
            }
        }
    };

    return {
        apiKey,
        setApiKey: saveApiKey,
        loading
    };
}
