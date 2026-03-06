import React, { useState } from 'react';
import { Mail, Lock, X, Loader2, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import logoOficial from '../../assets/logo-oficial.png';
import { useAuth } from '../../hooks/useAuth';
import { GlowingEffect } from '../ui/glowing-effect';
import Tilt3DCard from '../ui/Tilt3DCard';

const AuthModal = ({ isOpen, onClose }) => {
    const { signIn, signUp, resetPassword, isRecoveringPassword, setIsRecoveringPassword, updatePassword } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            if (isRecoveringPassword) {
                await updatePassword(password);
                setSuccessMessage("Senha atualizada com sucesso!");
                setTimeout(() => {
                    setIsRecoveringPassword(false);
                    setIsLogin(true);
                    onClose();
                }, 2000);
            } else if (isForgotPassword) {
                await resetPassword(email);
                setSuccessMessage("Link de recuperação enviado com sucesso!");
            } else if (isLogin) {
                await signIn(email, password);
                onClose();
            } else {
                await signUp(email, password);
                setSuccessMessage('Conta criada com sucesso! Faça login.');
                setIsLogin(true);
            }
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
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 z-20 text-gray-500 hover:text-white transition-colors bg-[#1a1a1c]/80 p-2 rounded-full hover:bg-[#222] backdrop-blur-sm border border-[#222] cursor-pointer"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex flex-col items-center mb-8 text-center relative z-10">
                                <div className="mb-0 relative py-4">
                                    <img
                                        src={logoOficial}
                                        alt="Logo Growth Hub"
                                        className="h-20 w-auto object-contain brightness-110 drop-shadow-[0_0_15px_rgba(123,97,255,0.3)] transition-all duration-500 cursor-pointer hover:scale-110 hover:brightness-125 hover:drop-shadow-[0_0_30px_rgba(123,97,255,0.6)]"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
                                    {isRecoveringPassword ? 'Criar Nova Senha' : isForgotPassword ? 'Recuperar Senha' : isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium">
                                    {isRecoveringPassword ? 'Digite sua nova senha abaixo' : isForgotPassword ? 'Enviaremos um link para seu email' : isLogin ? 'Faça login para continuar' : 'Cadastre-se para começar'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <p className="text-xs text-red-400 text-center">{error}</p>
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <p className="text-xs text-emerald-400 text-center">{successMessage}</p>
                                    </div>
                                )}

                                {!isRecoveringPassword && (
                                    <div className="space-y-1.5 text-left">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-[#7B61FF] transition-colors">
                                                <Mail className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3.5 bg-[#15152a]/40 border border-[#222] focus:border-[#7B61FF]/60 outline-none rounded-xl text-sm text-white transition-all placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(123,97,255,0.15)] focus:bg-[#1a1a32]/60"
                                                placeholder="gabrielporceli.goat@gmail.com"
                                            />
                                        </div>
                                    </div>
                                )}

                                {(!isForgotPassword || isRecoveringPassword) && (
                                    <>
                                        <div className="space-y-1.5 text-left">
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-[#7B61FF] transition-colors">
                                                    <Lock className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-10 pr-12 py-3.5 bg-[#15152a]/40 border border-[#222] focus:border-[#7B61FF]/60 outline-none rounded-xl text-sm text-white transition-all placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(123,97,255,0.15)] focus:bg-[#1a1a32]/60"
                                                    placeholder={isRecoveringPassword ? "Nova senha" : "••••••••••••"}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {!isRecoveringPassword && (
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center gap-2 cursor-pointer group/check">
                                                    <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center
                                                        ${rememberMe ? 'bg-[#7B61FF] border-[#7B61FF]' : 'bg-[#15152a]/40 border-[#222] group-hover/check:border-[#7B61FF]/40'}`}>
                                                        {rememberMe && <Check size={14} className="text-white" />}
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={rememberMe}
                                                            onChange={() => setRememberMe(!rememberMe)}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-400 group-hover/check:text-gray-300 transition-colors">Lembrar de mim</span>
                                                </label>

                                                {isLogin && (
                                                    <button type="button" onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMessage(null); }} className="text-xs font-semibold text-[#7B61FF] hover:text-[#9B8AFF] transition-colors cursor-pointer">
                                                        Esqueci a senha
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all mt-4 shadow-[0_0_15px_rgba(123,97,255,0.2)]
                                        ${loading
                                            ? 'bg-[#7B61FF]/50 cursor-not-allowed'
                                            : 'bg-[#7B61FF] hover:bg-[#6851FF] hover:shadow-[0_0_25px_rgba(123,97,255,0.4)] cursor-pointer'}`}
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            {isRecoveringPassword ? 'Redefinir Senha' : isForgotPassword ? 'Enviar Link' : isLogin ? 'Entrar' : 'Criar Conta Agora'}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center relative z-10">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isRecoveringPassword) {
                                            setIsRecoveringPassword(false);
                                            setIsLogin(true);
                                        } else if (isForgotPassword) {
                                            setIsForgotPassword(false);
                                        } else {
                                            setIsLogin(!isLogin);
                                        }
                                        setError(null);
                                        setSuccessMessage(null);
                                    }}
                                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-[#7B61FF] cursor-pointer"
                                >
                                    {isRecoveringPassword || isForgotPassword
                                        ? 'Voltar para o login'
                                        : isLogin
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
