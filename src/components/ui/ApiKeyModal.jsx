import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, X, ExternalLink, Check } from 'lucide-react';

const ApiKeyModal = ({ isOpen, onClose, apiKey, onSave }) => {
    const [inputKey, setInputKey] = useState(apiKey || '');
    const [showKey, setShowKey] = useState(false);
    const [saved, setSaved] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(inputKey.trim());
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            onClose();
        }, 1000);
    };

    const handleClear = () => {
        setInputKey('');
        onSave('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-[#111113] border border-[#1f1f23] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#1f1f23]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#7B61FF]/20 flex items-center justify-center">
                            <KeyRound size={20} className="text-[#7B61FF]" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">API Key</h3>
                            <p className="text-xs text-gray-500">OpenRouter</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Insira sua chave da API do OpenRouter para usar o AI Lab.
                        A chave fica salva apenas no seu navegador.
                    </p>

                    <div className="relative">
                        <input
                            type={showKey ? 'text' : 'password'}
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="sk-or-v1-..."
                            className="w-full bg-[#070708] border border-[#222] rounded-xl py-3 pl-4 pr-12 text-sm text-white font-mono focus:outline-none focus:border-[#7B61FF] transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-[#7B61FF] hover:text-[#a292ff] transition-colors"
                    >
                        <ExternalLink size={12} />
                        Criar chave no OpenRouter
                    </a>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#1f1f23] flex gap-3">
                    {apiKey && (
                        <button
                            onClick={handleClear}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                        >
                            Remover
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!inputKey.trim()}
                        className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#7B61FF] text-white hover:bg-[#5841e6] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {saved ? <><Check size={14} /> Salvo!</> : 'Salvar Chave'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
