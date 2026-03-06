import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, KeyRound, LogIn, User, Lock, Globe } from 'lucide-react';
import GrowthHubLogo from '../ui/Logo';

const Header = ({ activeTab, setActiveTab, currency, setCurrency, onOpenApiKey, hasApiKey, user, onOpenAuth, onSignOut }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const tabs = [
        { id: 'table', label: t('header.costs'), requiresAuth: false },
        { id: 'lab', label: 'AI Lab', requiresAuth: true },
        { id: 'simulator', label: t('header.simulator'), requiresAuth: true },
    ];

    const handleTabClick = (tabId, requiresAuth) => {
        if (requiresAuth && !user) {
            onOpenAuth();
            setMobileMenuOpen(false);
            return;
        }
        setActiveTab(tabId);
        setMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-4 sm:top-6 z-50 w-full px-4 flex justify-center">
            <div className="max-w-7xl w-full h-16 sm:h-20 gh-card-hover rounded-full flex items-center justify-between px-6 sm:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] !transform-none">

                {/* Logo and Branding - Left */}
                <div className="flex items-center gap-3 group cursor-pointer shrink-0" onClick={() => setActiveTab('table')}>
                    <GrowthHubLogo className="w-8 h-8 sm:w-10 sm:h-10" />
                    <div className="hidden lg:flex flex-col">
                        <h1 className="text-sm font-bold text-white tracking-widest uppercase group-hover:text-[#7B61FF] transition-colors duration-300">
                            Growth Hub
                        </h1>
                        <p className="text-[7px] text-[#7B61FF] font-black tracking-[0.4em] uppercase opacity-70">
                            Analytics
                        </p>
                    </div>
                </div>

                {/* Desktop Tabs - Centered */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8 mx-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id, tab.requiresAuth)}
                            className={`relative py-2 text-[11px] font-black tracking-widest uppercase cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === tab.id
                                ? 'text-white'
                                : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            {tab.requiresAuth && !user && <Lock size={10} className="mb-0.5 opacity-60" />}
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#7B61FF] rounded-full animate-fadeIn" />
                            )}
                            {tab.id === 'lab' && (
                                <span className={`absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Desktop Right Actions - Right */}
                <div className="hidden md:flex items-center gap-4 shrink-0">
                    {/* Currency Toggle as a tiny pill */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
                        <button
                            onClick={() => setCurrency('USD')}
                            className={`px-3 py-1 text-[9px] font-black rounded-full cursor-pointer transition-all ${currency === 'USD' ? 'bg-[#7B61FF] text-white' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            USD
                        </button>
                        <button
                            onClick={() => setCurrency('BRL')}
                            className={`px-3 py-1 text-[9px] font-black rounded-full cursor-pointer transition-all ${currency === 'BRL' ? 'bg-[#7B61FF] text-white' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            BRL
                        </button>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-0.5 ml-2">
                        <Globe size={11} className="text-gray-500 ml-1.5" />
                        <button
                            onClick={() => changeLanguage('pt')}
                            className={`px-2.5 py-1 text-[9px] font-black rounded-full cursor-pointer transition-all ${i18n.language === 'pt' ? 'bg-[#7B61FF] text-white' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            PT
                        </button>
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`px-2.5 py-1 text-[9px] font-black rounded-full cursor-pointer transition-all ${i18n.language === 'en' ? 'bg-[#7B61FF] text-white' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            EN
                        </button>
                    </div>

                    <div className="h-6 w-px bg-white/5 mx-1"></div>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#7B61FF] to-[#9B8AFF] flex items-center justify-center text-[9px] font-black text-white">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[10px] font-bold text-gray-300 max-w-[80px] truncate">{user.email}</span>
                            </div>
                            <button
                                onClick={onSignOut}
                                className="text-[10px] text-gray-500 hover:text-white font-black tracking-widest cursor-pointer transition-colors uppercase"
                            >
                                {t('header.logout')}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="bg-[#7B61FF] hover:bg-[#6248E0] text-white px-6 py-2 rounded-full text-[11px] font-black tracking-widest uppercase cursor-pointer transition-all shadow-[0_10px_20px_rgba(123,97,255,0.3)] hover:shadow-[0_15px_30px_rgba(123,97,255,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {t('header.login')}
                        </button>
                    )}

                    <button
                        onClick={onOpenApiKey}
                        className={`p-2 rounded-full border cursor-pointer transition-all ${hasApiKey
                            ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10'
                            : 'border-white/10 text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <KeyRound size={16} />
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden text-gray-400 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0b] animate-slideDown">
                    <div className="p-4 space-y-3">
                        {user ? (
                            <div className="flex items-center justify-between p-3 mb-2 bg-[#111] rounded-xl border border-[#222]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7B61FF] to-[#00E5FF] flex items-center justify-center text-xs font-bold text-white">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-300 truncate">{user.email}</span>
                                </div>
                                <button
                                    onClick={() => { onSignOut(); setMobileMenuOpen(false); }}
                                    className="text-xs text-gray-500 hover:text-white font-bold px-3 py-1.5 rounded-lg border border-[#222]"
                                >
                                    SAIR
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                                className="w-full mb-2 bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/30 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <LogIn size={16} />
                                Login
                            </button>
                        )}

                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id, tab.requiresAuth)}
                                className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all flex items-center justify-between ${activeTab === tab.id
                                    ? 'gh-btn-primary text-white'
                                    : 'text-gray-400 hover:bg-[#111] hover:text-white'
                                    }`}
                            >
                                <span>{tab.label}</span>
                                {tab.requiresAuth && !user && <Lock size={14} className="opacity-60" />}
                            </button>
                        ))}

                        <div className="flex items-center gap-3 pt-2 border-t border-[#1a1a1a]">
                            <button
                                onClick={() => { onOpenApiKey(); setMobileMenuOpen(false); }}
                                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-[#111] hover:text-white transition-all text-left flex items-center gap-2"
                            >
                                <KeyRound size={14} />
                                API Key
                                <span className={`ml-auto w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <div className="flex flex-row gap-2">
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`flex-1 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${currency === 'USD' ? 'bg-white text-black' : 'text-gray-500 border border-[#222]'}`}
                                >
                                    USD
                                </button>
                                <button
                                    onClick={() => setCurrency('BRL')}
                                    className={`flex-1 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${currency === 'BRL' ? 'bg-white text-black' : 'text-gray-500 border border-[#222]'}`}
                                >
                                    BRL
                                </button>
                            </div>
                            <div className="flex flex-row gap-2">
                                <button
                                    onClick={() => changeLanguage('pt')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${i18n.language === 'pt' ? 'bg-[#7B61FF]/20 text-[#7B61FF] border border-[#7B61FF]/30' : 'text-gray-500 border border-[#222]'}`}
                                >
                                    <Globe size={14} /> PT
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${i18n.language === 'en' ? 'bg-[#7B61FF]/20 text-[#7B61FF] border border-[#7B61FF]/30' : 'text-gray-500 border border-[#222]'}`}
                                >
                                    <Globe size={14} /> EN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
