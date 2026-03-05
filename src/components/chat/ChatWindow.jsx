import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, RefreshCcw, Download, KeyRound } from 'lucide-react';
import { getSortedModels, getModelById } from '../../data/models';
import { formatCurrency } from '../../utils/formatters';
import { calculateCost } from '../../utils/calculations';
import { callOpenRouter } from '../../utils/api';
import GrowthHubLogo from '../ui/Logo';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ apiKey, onOpenApiKey, currency, exchangeRate }) => {
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
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);
    const sortedModels = getSortedModels();

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
            setError('Configure sua API Key primeiro clicando no ícone 🔑');
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
            setError(err.message || 'Erro ao processar. Tente novamente.');
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
        const header = `Growth Hub AI Lab — Conversa exportada\nModelo: ${model?.name}\nData: ${new Date().toLocaleString('pt-BR')}\n${'='.repeat(50)}\n\n`;
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
        currentModel?.costPer1M || 0,
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
                    <h2 className="font-bold text-white tracking-tight flex items-center gap-2 text-sm sm:text-base truncate">
                        <span className="hidden sm:inline">Growth Lab:</span>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-[#161619] border border-[#222] text-[#7B61FF] text-xs sm:text-sm rounded-lg px-2 py-1 focus:outline-none focus:border-[#7B61FF] max-w-[180px]"
                        >
                            {sortedModels.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </h2>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    {!apiKey && (
                        <button
                            onClick={onOpenApiKey}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-bold hover:bg-red-500/20 transition-colors"
                        >
                            <KeyRound size={12} />
                            <span className="hidden sm:inline">Configurar Key</span>
                        </button>
                    )}
                    <button
                        onClick={handleExport}
                        disabled={messages.length === 0}
                        className="text-gray-500 hover:text-white transition-colors disabled:opacity-30 p-1.5"
                        title="Exportar conversa"
                    >
                        <Download size={16} />
                    </button>
                    <button
                        onClick={handleClear}
                        className="text-gray-500 hover:text-white transition-colors p-1.5"
                        title="Limpar chat"
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
                        <p className="text-sm font-medium leading-relaxed">
                            Inicie uma conversa para testar o modelo selecionado via OpenRouter.
                            <br />
                            As respostas usam <strong>Markdown</strong> para melhor formatação.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
                )}

                {isLoading && (
                    <div className="flex justify-start animate-slideUp">
                        <div className="bg-[#1a1a1c] p-4 rounded-2xl flex items-center gap-3">
                            <Loader2 className="w-4 h-4 animate-spin text-[#7B61FF]" />
                            <span className="text-xs font-bold text-gray-500 animate-pulse">
                                GROWTH HUB ESTÁ PENSANDO...
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
                        placeholder={apiKey ? 'Envie uma mensagem para o agente...' : 'Configure sua API Key para começar...'}
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
                    Custo estimado desta sessão:{' '}
                    <span className="text-white">{formatCurrency(sessionCost, currency)}</span>
                </p>
            </form>
        </div>
    );
};

export default ChatWindow;
