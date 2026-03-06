import React, { useState } from 'react';
import { Mail, Lock, X, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { GlowingEffect } from '../ui/glowing-effect';
import Tilt3DCard from '../ui/Tilt3DCard'; // Added Tilt3DCard for the 3D effect requested

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
            <div className="relative w-full max-w-md animate-slideUp">
                <Tilt3DCard tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                    <div className="group/glow relative w-full rounded-[1.5rem] border-[0.75px] border-[#1f1f23] p-[2px] shadow-[0_0_100px_rgba(123,97,255,0.15)]">
                        {/* Glowing effect component interacting with the mouse hover */}
                        <GlowingEffect
                            spread={60}
                            glow={true}
                            disabled={false}
                            proximity={80}
                            inactiveZone={0.01}
                            borderWidth={2}
                        />

                        {/* Card inner content */}
                        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.4rem] bg-[#0c0c0e] p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white tracking-tight">
                                    {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-white transition-colors bg-[#1a1a1c] p-2 rounded-full hover:bg-[#222]"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <p className="text-xs text-red-400">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-400 ml-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-[#15152a]/40 border border-[#222] focus:border-[#7B61FF]/60 outline-none rounded-xl text-sm text-white transition-all placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(123,97,255,0.15)] focus:bg-[#1a1a32]/60"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-400 ml-1">Senha</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-[#15152a]/40 border border-[#222] focus:border-[#7B61FF]/60 outline-none rounded-xl text-sm text-white transition-all placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(123,97,255,0.15)] focus:bg-[#1a1a32]/60"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all mt-4 shadow-[0_0_15px_rgba(123,97,255,0.2)]
                                        ${loading
                                            ? 'bg-[#7B61FF]/50 cursor-not-allowed'
                                            : 'bg-[#7B61FF] hover:bg-[#6851FF] hover:shadow-[0_0_25px_rgba(123,97,255,0.4)]'}`}
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            {isLogin ? 'Acessar Plataforma' : 'Criar Conta Agora'}
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center relative z-10">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-[#7B61FF]"
                                >
                                    {isLogin
                                        ? 'Não tem uma conta? Cadastre-se'
                                        : 'Já possui conta? Faça login seguro'}
                                </button>
                            </div>
                        </div>
                    </div>
                </Tilt3DCard>
            </div>
        </div>
    );
};

export default AuthModal;
