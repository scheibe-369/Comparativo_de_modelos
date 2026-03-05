import React, { useState } from 'react';
import { Menu, X, KeyRound, LogIn, User } from 'lucide-react';
import GrowthHubLogo from '../ui/Logo';

const Header = ({ activeTab, setActiveTab, currency, setCurrency, onOpenApiKey, hasApiKey, user, onOpenAuth, onSignOut }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const tabs = [
        { id: 'table', label: 'Custos' },
        { id: 'lab', label: 'AI Lab' },
        { id: 'simulator', label: 'Simulador' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#070708]/80 backdrop-blur-md border-b border-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="bg-[#7B61FF] p-1.5 sm:p-2 rounded-lg shadow-[0_0_15px_rgba(104,81,255,0.4)]">
                        <GrowthHubLogo className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-base sm:text-xl font-bold text-white tracking-tight uppercase">Growth Hub</h1>
                        <p className="text-[8px] sm:text-[10px] text-[#7B61FF] font-bold tracking-[0.2em] uppercase">Intelligence Suite</p>
                    </div>
                </div>

                {/* Desktop Tabs */}
                <div className="hidden md:flex items-center gap-1 bg-[#111] p-1 rounded-full border border-[#222]">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab.id
                                ? 'gh-btn-primary gh-tab-active text-white'
                                : 'text-gray-500 hover:text-white hover:bg-[#1a1a1c]'
                                }`}
                        >
                            {tab.label}
                            {tab.id === 'lab' && (
                                <span className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Desktop Right Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={onOpenApiKey}
                        className={`p-2 rounded-lg border transition-all gh-btn-icon ${hasApiKey
                            ? 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                            : 'border-[#222] text-gray-500 hover:text-white hover:border-[#333]'
                            }`}
                        title="Configurar API Key"
                    >
                        <KeyRound size={16} />
                    </button>

                    <div className="h-6 w-px bg-[#222] mx-1"></div>

                    {user ? (
                        <div className="flex items-center gap-3 bg-[#111113] border border-[#1f1f23] rounded-full pl-2 pr-4 py-1.5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#7B61FF] to-[#00E5FF] flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(123,97,255,0.3)]">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-gray-300 max-w-[100px] truncate">{user.email}</span>
                            <button
                                onClick={onSignOut}
                                className="text-[10px] text-gray-500 hover:text-white tracking-wider font-bold ml-2 transition-colors"
                            >
                                SAIR
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/30 hover:bg-[#7B61FF]/20 px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(123,97,255,0.2)]"
                        >
                            <LogIn size={14} />
                            Entrar
                        </button>
                    )}

                    <div className="h-6 w-px bg-[#222] mx-1"></div>

                    <div className="flex items-center gap-1 border border-[#222] rounded-lg p-1">
                        <button
                            onClick={() => setCurrency('USD')}
                            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${currency === 'USD' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            USD
                        </button>
                        <button
                            onClick={() => setCurrency('BRL')}
                            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${currency === 'BRL' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            BRL
                        </button>
                    </div>
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
                                Fazer Login
                            </button>
                        )}

                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                                className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${activeTab === tab.id
                                    ? 'gh-btn-primary text-white'
                                    : 'text-gray-400 hover:bg-[#111] hover:text-white'
                                    }`}
                            >
                                {tab.label}
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

                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={() => setCurrency('USD')}
                                className={`flex-1 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${currency === 'USD' ? 'bg-white text-black' : 'text-gray-500 border border-[#222]'
                                    }`}
                            >
                                USD
                            </button>
                            <button
                                onClick={() => setCurrency('BRL')}
                                className={`flex-1 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${currency === 'BRL' ? 'bg-white text-black' : 'text-gray-500 border border-[#222]'
                                    }`}
                            >
                                BRL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
