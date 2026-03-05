import React from 'react';
import { Info, Plus } from 'lucide-react';
import { TOKENS_PER_CONVERSATION } from '../../data/models';
import { formatCurrency, formatUSD } from '../../utils/formatters';
import { calculateCost } from '../../utils/calculations';

const CostTable = ({ currency, exchangeRate, models, onOpenCatalog }) => {
    const sortedModels = models;

    return (
        <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl animate-fadeIn" style={{ animationDelay: '200ms' }}>
            {/* Header */}
            <div className="p-5 sm:p-8 border-b border-[#1f1f23] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 tracking-tight">
                        Comparativo Estratégico de Modelos
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm italic">
                        Baseado em estimativas de mercado e blending de Input/Output.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button
                        onClick={onOpenCatalog}
                        className="bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/30 hover:bg-[#7B61FF] hover:text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(123,97,255,0.1)] hover:shadow-[0_0_20px_rgba(123,97,255,0.3)]"
                    >
                        <Plus size={16} />
                        Modelos
                    </button>
                    <div className="bg-[#070708] px-3 sm:px-4 py-2 rounded-xl border border-[#222] flex items-center gap-2">
                        <Info size={14} className="text-[#7B61FF]" />
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium whitespace-nowrap">
                            1 USD = {exchangeRate.toFixed(2)} BRL
                        </span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-[#0d0d0f] text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                            <th className="p-4 sm:p-6 font-bold">Modelo / IA</th>
                            <th className="p-4 sm:p-6 font-bold">Provedor</th>
                            <th className="p-4 sm:p-6 font-bold text-right">Preço (1M)</th>
                            <th className="p-4 sm:p-6 font-bold text-right text-[#7B61FF]">Custo/Conv (70k)</th>
                            <th className="p-4 sm:p-6 font-bold text-right">Impacto (10k Conv)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1c]">
                        {sortedModels.map((model) => (
                            <tr
                                key={model.id}
                                className={`group transition-all hover:bg-[#161619] ${model.isBaseline ? 'bg-[#15152a]/40' : ''}`}
                            >
                                <td className="p-4 sm:p-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1 h-8 rounded-full ${model.isBaseline ? 'bg-[#7B61FF]' : 'bg-[#222] group-hover:bg-[#333]'}`} />
                                        <div>
                                            <p className={`font-bold text-sm ${model.isBaseline ? 'text-[#a292ff]' : 'text-gray-100'}`}>
                                                {model.name}
                                                {model.badge === 'new' && (
                                                    <span className="ml-2 text-[8px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                        New
                                                    </span>
                                                )}
                                                {model.badge === 'recommended' && (
                                                    <span className="ml-2 text-[8px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded uppercase tracking-tighter animate-pulse">
                                                        ★ Recomendado
                                                    </span>
                                                )}
                                            </p>
                                            <span className="text-[10px] text-gray-500 font-medium">{model.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 sm:p-6 text-gray-400 text-xs sm:text-sm font-medium">{model.provider}</td>
                                <td className="p-4 sm:p-6 text-right font-mono text-xs text-gray-500">
                                    {formatUSD(model.costPer1M)}
                                </td>
                                <td className="p-4 sm:p-6 text-right font-mono text-xs sm:text-sm font-bold text-white">
                                    {formatCurrency(
                                        calculateCost(model.costPer1M, TOKENS_PER_CONVERSATION, currency, exchangeRate),
                                        currency
                                    )}
                                </td>
                                <td className="p-4 sm:p-6 text-right font-mono text-xs sm:text-sm text-gray-400">
                                    {formatCurrency(
                                        calculateCost(model.costPer1M, TOKENS_PER_CONVERSATION * 10000, currency, exchangeRate),
                                        currency,
                                        true
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CostTable;
