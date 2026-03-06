import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Check, Loader2, Sparkles } from 'lucide-react';
import { GlowingEffect } from '../ui/glowing-effect';

const ModelCatalogModal = ({
    isOpen,
    onClose,
    catalogModels,
    userSelectedModelIds,
    onAddModel,
    onRemoveModel,
    loading
}) => {
    const { t } = useTranslation();
    const [processingId, setProcessingId] = useState(null);

    if (!isOpen) return null;

    const handleToggle = async (model) => {
        const isSelected = userSelectedModelIds.includes(model.id);
        setProcessingId(model.id);
        try {
            if (isSelected) {
                await onRemoveModel(model.id);
            } else {
                await onAddModel(model.id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
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
            <div className="relative w-full max-w-2xl animate-slideUp">
                <div className="group/glow relative w-full rounded-[1.5rem] border-[0.75px] border-[#1f1f23] p-[2px] shadow-[0_0_100px_rgba(123,97,255,0.15)]">
                    <GlowingEffect
                        spread={60}
                        glow={true}
                        disabled={false}
                        proximity={80}
                        inactiveZone={0.01}
                        borderWidth={2}
                    />

                    <div className="relative bg-[#111113] rounded-[1.4rem] overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                        <Sparkles className="text-[#7B61FF]" size={24} />
                                        {t('modelCatalog.title')}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {t('modelCatalog.subtitle')}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-white transition-colors bg-[#1a1a1c] p-2 rounded-full hover:bg-[#222]"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {loading && catalogModels.length === 0 ? (
                                    <div className="py-12 flex justify-center items-center">
                                        <Loader2 className="animate-spin text-[#7B61FF]" size={32} />
                                    </div>
                                ) : catalogModels.length === 0 ? (
                                    <div className="py-8 text-center text-gray-500 text-sm">
                                        {t('modelCatalog.emptyState')}
                                    </div>
                                ) : (
                                    catalogModels.map((model) => {
                                        const isSelected = userSelectedModelIds.includes(model.id);
                                        const isProcessing = processingId === model.id;

                                        return (
                                            <div
                                                key={model.id}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isSelected
                                                    ? 'bg-[#7B61FF]/5 border-[#7B61FF]/30'
                                                    : 'bg-[#15152a]/40 border-[#1a1a1c] hover:border-[#1f1f23]'
                                                    }`}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-sm sm:text-base font-bold text-white">{model.name}</h4>
                                                        {model.badge && (
                                                            <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-[#7B61FF] bg-[#7B61FF]/10 rounded-full border border-[#7B61FF]/20">
                                                                {model.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-gray-400">
                                                        <span>{model.provider}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                        <div className="flex flex-col">
                                                            <span>In: ${model.costInput?.toFixed(2)} - Out: ${model.costOutput?.toFixed(2)}</span>
                                                            {(model.costCachedInput || model.cacheHit || model.tiers || model.costAudioInput) && (
                                                                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 mt-0.5">
                                                                    {model.costCachedInput && <span>Cache In: ${model.costCachedInput.toFixed(3)}</span>}
                                                                    {model.costAudioInput && <span>Audio In: ${model.costAudioInput.toFixed(2)}</span>}
                                                                    {model.cacheWrite5m && <span>Cache Write: ${model.cacheWrite5m.toFixed(2)} | Cache Hit: ${model.cacheHit?.toFixed(2)}</span>}
                                                                    {model.tiers?.over_200k && <span>{'>'}200k In: ${model.tiers.over_200k.input.toFixed(2)} - Out: ${model.tiers.over_200k.output.toFixed(2)}</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {model.context_window && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                                <span>{model.context_window} via</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {model.description && (
                                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                                            {model.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="ml-4 pl-4 border-l border-[#222]">
                                                    <button
                                                        onClick={() => handleToggle(model)}
                                                        disabled={isProcessing}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed ${isProcessing
                                                            ? 'bg-[#222] text-gray-500'
                                                            : isSelected
                                                                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-red-500/10 hover:text-red-500' // Hover para remover
                                                                : 'bg-[#7B61FF]/10 text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white shadow-[0_0_15px_rgba(123,97,255,0.1)] hover:shadow-[0_0_20px_rgba(123,97,255,0.4)]'
                                                            }`}
                                                        title={isSelected ? t('modelCatalog.removeFromDashboard') : t('modelCatalog.addToDashboard')}
                                                    >
                                                        {isProcessing ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : isSelected ? (
                                                            <span className="group-hover:hidden"><Check size={20} /></span>
                                                        ) : (
                                                            <Plus size={20} />
                                                        )}
                                                        {/* Tooltip trick via group hover */}
                                                        {isSelected && !isProcessing && (
                                                            <span className="hidden group-hover:block"><X size={20} /></span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelCatalogModal;
