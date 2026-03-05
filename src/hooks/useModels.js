import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getSortedModels as getBaseModels } from '../data/models';
import { useAuth } from './useAuth';

export function useModels() {
    const { user } = useAuth();
    const [catalogModels, setCatalogModels] = useState([]);
    const [userModels, setUserModels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCatalog();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserSelectedModels();
        } else {
            setUserModels([]); // Limpa se deslogar
        }
    }, [user]);

    // Busca o catálogo inteiro disponível
    const fetchCatalog = async () => {
        try {
            const { data, error } = await supabase
                .from('available_models')
                .select('*');

            if (error) throw error;
            setCatalogModels(data || []);
        } catch (error) {
            console.error('Erro ao buscar catálogo de modelos:', error);
        }
    };

    // Busca APENAS os modelos que o usuário logado ativou
    const fetchUserSelectedModels = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('user_selected_models')
                .select(`
                    id,
                    available_models (*)
                `)
                .eq('user_id', user.id);

            if (error) throw error;

            console.log("Modelos do user", data);

            // Formata os dados vindos do join para o mesmo shape local
            const formattedCustomModels = data.map(item => ({
                id: item.available_models.id, // Usa o UUID real para não chocar com strings locais
                name: item.available_models.name,
                provider: item.available_models.provider,
                costPer1M: item.available_models.cost_per_1m,
                badge: item.available_models.badge,
                description: item.available_models.description,
                contextWindow: item.available_models.context_window,
                isBase: false // Flag para identificar que é do BD
            }));

            setUserModels(formattedCustomModels);
        } catch (error) {
            console.error('Erro ao buscar modelos do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    const addModelToUser = async (modelId) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('user_selected_models')
                .insert([{ user_id: user.id, model_id: modelId }]);

            if (error) throw error;
            await fetchUserSelectedModels(); // Recarrega lista
        } catch (error) {
            console.error('Erro ao adicionar modelo:', error);
            throw error;
        }
    };

    const removeModelFromUser = async (modelId) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('user_selected_models')
                .delete()
                .eq('user_id', user.id)
                .eq('model_id', modelId);

            if (error) throw error;
            await fetchUserSelectedModels(); // Recarrega lista
        } catch (error) {
            console.error('Erro ao remover modelo:', error);
            throw error;
        }
    };

    // A mágica acontece aqui: Retornamos os modelos fixos locais + os que o usuário puxou do DB
    const baseModels = getBaseModels().map(m => ({ ...m, isBase: true }));

    // Filtramos para ter certeza que não há IDs duplicados (caso as chaves primárias coincidam num universo espelhado)
    const uniqueUserModels = userModels.filter(m => !baseModels.find(b => b.name === m.name));

    const combinedModels = [...baseModels, ...uniqueUserModels].sort((a, b) => a.costPer1M - b.costPer1M);

    return {
        models: combinedModels, // A lista final que o App usa
        catalogModels, // Catálogo total para a UI da "Loja"
        userSelectedModelIds: userModels.map(m => m.id), // Pra saber na UI quais ele já tem
        loading,
        addModelToUser,
        removeModelFromUser
    };
}
