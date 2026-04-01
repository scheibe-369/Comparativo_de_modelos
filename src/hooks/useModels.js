import { useState, useEffect } from 'react';
import { getSortedModels as getBaseModels, catalogModelsData } from '../data/models';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export function useModels() {
    const { user } = useAuth();
    const [userSelectedModelIds, setUserSelectedModelIds] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserModels = async () => {
            if (!user) {
                setUserSelectedModelIds([]);
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('user_models')
                    .select('model_id')
                    .eq('user_id', user.id);

                if (error) throw error;

                if (data) {
                    setUserSelectedModelIds(data.map(m => m.model_id));
                }
            } catch (err) {
                console.error('Error fetching user models:', err.message);
                // Fallback to localStorage for smooth transition
                const saved = localStorage.getItem(`user_models_${user.id}`);
                if (saved) setUserSelectedModelIds(JSON.parse(saved));
            } finally {
                setLoading(false);
            }
        };

        fetchUserModels();
    }, [user]);

    const addModelToUser = async (modelId) => {
        if (!user) return;
        
        try {
            const { error } = await supabase
                .from('user_models')
                .insert([{ user_id: user.id, model_id: modelId }]);

            if (error) throw error;

            setUserSelectedModelIds(prev => [...prev, modelId]);
        } catch (err) {
            console.error('Error adding model:', err.message);
            // Local update as backup
            const nextIds = [...userSelectedModelIds, modelId];
            setUserSelectedModelIds(nextIds);
            localStorage.setItem(`user_models_${user.id}`, JSON.stringify(nextIds));
        }
    };

    const removeModelFromUser = async (modelId) => {
        if (!user) return;
        
        try {
            const { error } = await supabase
                .from('user_models')
                .delete()
                .eq('user_id', user.id)
                .eq('model_id', modelId);

            if (error) throw error;

            setUserSelectedModelIds(prev => prev.filter(id => id !== modelId));
        } catch (err) {
            console.error('Error removing model:', err.message);
            // Local update as backup
            const nextIds = userSelectedModelIds.filter(id => id !== modelId);
            setUserSelectedModelIds(nextIds);
            localStorage.setItem(`user_models_${user.id}`, JSON.stringify(nextIds));
        }
    };

    // A mágica acontece aqui: Retornamos os modelos fixos locais + os que o usuário puxou do catálogo
    const baseModels = getBaseModels().map(m => ({ ...m, isBase: true }));

    // Obter os objetos completos a partir dos IDs salvos
    const userModelsObjects = catalogModelsData
        .filter(m => userSelectedModelIds.includes(m.id))
        .map(item => ({
            ...item,
            isBase: false // Flag para identificar que é "adicional"
        }));

    // Filtramos para ter certeza que não há IDs duplicados
    const uniqueUserModels = userModelsObjects.filter(m => !baseModels.find(b => b.name === m.name));

    // Combine e sort pelo costInput por padrão. getWeightedCostPer1M ficaria caro pra importar aqui se nao for necessario
    const combinedModels = [...baseModels, ...uniqueUserModels].sort((a, b) => a.costInput - b.costInput);

    return {
        models: combinedModels, // A lista final que o App usa
        catalogModels: catalogModelsData, // Catálogo total para a UI da "Loja"
        userSelectedModelIds, // Pra saber na UI quais ele já tem
        loading,
        addModelToUser,
        removeModelFromUser
    };
}
