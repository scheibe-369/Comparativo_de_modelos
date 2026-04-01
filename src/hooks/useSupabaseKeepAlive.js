import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook para manter o Supabase ativo (Keep Alive).
 * Ele lê o valor de 'atualiza' na tabela 'ativacao_supabase' e o inverte.
 * Isso gera uma atividade no banco toda vez que o app é aberto por alguém.
 */
export function useSupabaseKeepAlive() {
    useEffect(() => {
        const pingSupabase = async () => {
            try {
                // 1. Pega o estado atual
                const { data, error } = await supabase
                    .from('ativacao_supabase')
                    .select('atualiza')
                    .eq('id', 1)
                    .single();

                if (error) {
                    console.warn('[Supabase Keep-Alive] Erro ao ler tabela de ativação:', error.message);
                    return;
                }

                // 2. Inverte o valor (atividade no banco)
                const newValue = !data.atualiza;

                // 3. Grava de volta
                await supabase
                    .from('ativacao_supabase')
                    .update({ 
                        atualiza: newValue,
                        last_ping: new Date().toISOString() 
                    })
                    .eq('id', 1);

                console.log(`[Supabase Keep-Alive] Projeto ativo. Ping realizado (${newValue})`);
            } catch (err) {
                console.error('[Supabase Keep-Alive] Falha crítica:', err);
            }
        };

        // Executa ao carregar
        pingSupabase();

        // Executa a cada 5 minutos enquanto o app estiver aberto
        const interval = setInterval(pingSupabase, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);
}
