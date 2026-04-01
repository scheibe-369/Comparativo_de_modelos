import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

    useEffect(() => {
        // Obter a sessão atual ao carregar
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Escutar ativamente por mudanças (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (_event === 'PASSWORD_RECOVERY') {
                setIsRecoveringPassword(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signUp = async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: metadata
            }
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
        return data;
    };

    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (error) throw error;
    };

    const updatePassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setIsRecoveringPassword(false);
    };

    return {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        resetPassword,
        updatePassword,
        isRecoveringPassword,
        setIsRecoveringPassword
    };
}
