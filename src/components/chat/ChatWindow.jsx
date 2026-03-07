import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, RefreshCcw, Download, KeyRound, ChevronDown, Plus } from 'lucide-react';
import { getSortedModels, getModelById } from '../../data/models';
import { formatCurrency } from '../../utils/formatters';
import { calculateCost } from '../../utils/calculations';
import { callOpenRouter } from '../../utils/api';
import GrowthHubLogo from '../ui/Logo';
import { useTranslation } from 'react-i18next';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ apiKey, onOpenApiKey, currency, exchangeRate, models, onOpenCatalog }) => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('gh_chat_history') || '[]');
        } catch {
            return [];
        }
    });
    const [selectedModel, setSelectedModel] = useState('google/gemini-2.5-flash');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);
    const sortedModels = models || getSortedModels();

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Persist chat history 
    useEffect(() => {
        try {
            localStorage.setItem('gh_chat_history', JSON.stringify(messages));
        } catch { /* full storage */ }
    }, [messages]);

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        if (!apiKey) {
            setError(t('chatWindow.configureApiKey'));
            return;
        }

        const userMsg = { role: 'user', content: prompt, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setPrompt('');
        setIsLoading(true);
        setError(null);

        try {
            const text = await callOpenRouter(prompt, messages, apiKey, selectedModel);
            setMessages(prev => [...prev, { role: 'assistant', content: text, timestamp: Date.now() }]);
        } catch (err) {
            setError(err.message || t('chatWindow.errorProcessing'));
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleClear = () => {
        setMessages([]);
        setError(null);
    };

    const handleExport = () => {
        if (messages.length === 0) return;
        const model = getModelById(selectedModel);
        const text = messages
            .map(m => `[${m.role === 'user' ? 'Você' : model?.name || 'AI'}]\n${m.content}`)
            .join('\n\n---\n\n');
        const header = `${t('chatWindow.exportHeader')}\n${t('chatWindow.model')}: ${model?.name}\n${t('chatWindow.date')}: ${new Date().toLocaleString('pt-BR')}\n${'='.repeat(50)}\n\n`;
        const blob = new Blob([header + text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `growth-hub-chat-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const currentModel = getModelById(selectedModel);
    const sessionCost = calculateCost(
        currentModel,
        messages.length * 500,
        currency,
        exchangeRate
    );

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[65vh] sm:h-[70vh] bg-[#111113] border border-[#1f1f23] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl animate-fadeIn">
            {/* Chat Header */}
            <div className="p-4 sm:p-6 border-b border-[#1f1f23] flex items-center justify-between bg-[#0d0d0f]">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${apiKey ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <h2 className="font-bold text-white tracking-tight flex items-center gap-3 text-sm sm:text-base">
                        <span className="hidden sm:inline opacity-60 uppercase text-[10px] tracking-widest">{t('chatWindow.growthLab')}</span>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-[#161619]/80 border border-[#222] hover:border-[#7B61FF]/50 text-[#7B61FF] text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-full px-4 py-2 transition-all outline-none shadow-inner cursor-pointer"
                            >
                                <span className="truncate max-w-[120px] sm:max-w-[180px]">
                                    {currentModel?.name}
                                </span>
                                <ChevronDown size={12} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-3 w-56 sm:w-64 bg-[#0d0d0f]/95 backdrop-blur-xl border border-[#1f1f23] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 overflow-hidden animate-slideUp py-2">
                                    <div className="max-h-[300px] overflow-y-auto gh-scrollbar">
                                        {sortedModels.map(m => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedModel(m.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 transition-all hover:bg-[#7B61FF]/10 flex items-center justify-between group cursor-pointer ${selectedModel === m.id ? 'bg-[#7B61FF]/5 text-white' : 'text-gray-400'}`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`text-[11px] sm:text-xs font-bold ${selectedModel === m.id ? 'text-[#7B61FF]' : 'group-hover:text-[#9B8AFF]'}`}>{m.name}</span>
                                                    <span className="text-[9px] opacity-40 uppercase tracking-tighter">{m.provider}</span>
                                                </div>
                                                {selectedModel === m.id && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7B61FF] shadow-[0_0_10px_rgba(123,97,255,0.8)] animate-pulse" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </h2>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <button
                        onClick={onOpenCatalog}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7B61FF]/10 border border-[#7B61FF]/30 text-[#7B61FF] text-[10px] sm:text-xs font-bold hover:bg-[#7B61FF]/20 transition-all mr-1 group/btn cursor-pointer"
                    >
                        <Plus size={12} className="group-hover/btn:rotate-90 transition-transform" />
                        <span>{t('chatWindow.addModels')}</span>
                    </button>
                    {!apiKey && (
                        <button
                            onClick={onOpenApiKey}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
                        >
                            <KeyRound size={12} />
                            <span className="hidden sm:inline">{t('chatWindow.configKey')}</span>
                        </button>
                    )}
                    <button
                        onClick={handleExport}
                        disabled={messages.length === 0}
                        className="text-gray-500 hover:text-white transition-colors disabled:opacity-30 p-1.5 cursor-pointer disabled:cursor-not-allowed"
                        title={t('chatWindow.exportChat')}
                    >
                        <Download size={16} />
                    </button>
                    <button
                        onClick={handleClear}
                        className="text-gray-500 hover:text-white transition-colors p-1.5 cursor-pointer"
                        title={t('chatWindow.clearChat')}
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 gh-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-4">
                        <GrowthHubLogo className="w-12 h-12 text-[#7B61FF] mb-4" />
                        <p className="text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: t('chatWindow.startConv') }} />
                    </div>
                ) : (
                    messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
                )}

                {isLoading && (
                    <div className="flex justify-start animate-slideUp">
                        <div className="bg-[#1a1a1c] p-4 rounded-2xl flex items-center gap-3">
                            <Loader2 className="w-4 h-4 animate-spin text-[#7B61FF]" />
                            <span className="text-xs font-bold text-gray-500 animate-pulse">
                                {t('chatWindow.thinking')}
                            </span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs text-center animate-fadeIn">
                        {error}
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-4 sm:p-6 bg-[#0d0d0f] border-t border-[#1f1f23]">
                <div className="relative group">
                    <input
                        ref={inputRef}
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={apiKey ? t('chatWindow.sendMsgPls') : t('chatWindow.cfgKeyStart')}
                        disabled={!apiKey}
                        className="w-full bg-[#161619] border border-[#222] rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-4 sm:pl-6 pr-14 text-sm text-white focus:outline-none focus:border-[#7B61FF] transition-all group-hover:border-[#333] disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim() || !apiKey}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 gh-btn-primary text-white rounded-lg sm:rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <p className="mt-3 text-[9px] sm:text-[10px] text-center text-gray-600 font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    {t('chatWindow.estCost')}{' '}
                    <span className="text-white">{formatCurrency(sessionCost, currency)}</span>
                </p>
            </form>
        </div>
    );
};

export default ChatWindow;
