import { useState, useEffect } from 'react';
import { getSortedModels as getBaseModels, catalogModelsData } from '../data/models';
import { useAuth } from './useAuth';

export function useModels() {
    const { user } = useAuth();
    const [catalogModels, setCatalogModels] = useState([]);
    const [userSelectedModelIds, setUserSelectedModelIds] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Agora usamos os dados locais diretamente
        setCatalogModels(catalogModelsData);
    }, []);

    useEffect(() => {
        // Simulando banco com localStorage se usuário logado, vazio caso não logado
        if (user) {
            const saved = localStorage.getItem(`user_models_${user.id}`);
            if (saved) {
                setUserSelectedModelIds(JSON.parse(saved));
            } else {
                setUserSelectedModelIds([]);
            }
        } else {
            setUserSelectedModelIds([]);
        }
    }, [user]);

    const addModelToUser = async (modelId) => {
        if (!user) return;
        const nextIds = [...userSelectedModelIds, modelId];
        setUserSelectedModelIds(nextIds);
        localStorage.setItem(`user_models_${user.id}`, JSON.stringify(nextIds));
    };

    const removeModelFromUser = async (modelId) => {
        if (!user) return;
        const nextIds = userSelectedModelIds.filter(id => id !== modelId);
        setUserSelectedModelIds(nextIds);
        localStorage.setItem(`user_models_${user.id}`, JSON.stringify(nextIds));
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
        catalogModels, // Catálogo total para a UI da "Loja"
        userSelectedModelIds, // Pra saber na UI quais ele já tem
        loading,
        addModelToUser,
        removeModelFromUser
    };
}
