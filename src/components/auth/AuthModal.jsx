import React, { useState } from 'react';
import { Mail, Lock, X, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AuthModal = ({ isOpen, onClose }) => {
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password);
                // Switch to login or show success message depending on email verification settings
                alert('Conta criada com sucesso! Faça login.');
                setIsLogin(true);
            }
            if (isLogin) onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-[#111113] border border-[#1f1f23] rounded-2xl shadow-[0_0_100px_rgba(123,97,255,0.15)] overflow-hidden animate-slideUp">

                {/* Purple gradient top bar */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#7B61FF] to-transparent opacity-50" />

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-xs text-red-400">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400 ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#15152a]/40 border border-[#1a1a1c] focus:border-[#7B61FF]/50 outline-none rounded-xl text-sm text-white transition-all placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(123,97,255,0.1)]"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400 ml-1">Senha</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#15152a]/40 border border-[#1a1a1c] focus:border-[#7B61FF]/50 outline-none rounded-xl text-sm text-white transition-all placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(123,97,255,0.1)]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all mt-2
                                ${loading
                                    ? 'bg-[#7B61FF]/50 cursor-not-allowed'
                                    : 'bg-[#7B61FF] hover:bg-[#6851FF] hover:shadow-[0_0_20px_rgba(123,97,255,0.3)]'}`}
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Entrar' : 'Cadastrar'}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            {isLogin
                                ? 'Não tem uma conta? Crie agora'
                                : 'Já possui conta? Faça login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
