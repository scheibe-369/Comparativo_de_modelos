import React, { useState } from 'react';
import { Sliders } from 'lucide-react';
import { TOKENS_PER_CONVERSATION } from '../../data/models';
import { calculateMonthlyCost } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const CostCalculator = ({ currency, exchangeRate, models }) => {
    const [convsPerDay, setConvsPerDay] = useState(50);

    return (
        <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl sm:rounded-3xl p-5 sm:p-8 mt-6 sm:mt-8 animate-fadeIn" style={{ animationDelay: '600ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 tracking-tight flex items-center gap-2">
                        <Sliders size={20} className="text-[#7B61FF]" />
                        Simulador de Custo Mensal
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm italic">
                        Arraste o slider para projetar o custo mensal baseado no volume de conversas
                    </p>
                </div>
                <div className="bg-[#070708] px-4 py-3 rounded-xl border border-[#7B61FF]/30 text-center min-w-[120px]">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Conversas/dia</p>
                    <p className="text-2xl font-bold text-[#7B61FF] font-mono">{convsPerDay}</p>
                </div>
            </div>

            {/* Slider */}
            <div className="mb-8">
                <input
                    type="range"
                    min="1"
                    max="500"
                    value={convsPerDay}
                    onChange={(e) => setConvsPerDay(Number(e.target.value))}
                    className="w-full accent-[#7B61FF] h-2 bg-[#1a1a1c] rounded-full cursor-pointer"
                />
                <div className="relative h-4 mt-1">
                    {[1, 100, 250, 500].map((val) => (
                        <span
                            key={val}
                            className="absolute text-[10px] text-gray-600 -translate-x-1/2"
                            style={{ left: `${((val - 1) / 499) * 100}%` }}
                        >
                            {val}/dia
                        </span>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {models.map((model, i) => {
                    const monthlyCost = calculateMonthlyCost(
                        model,
                        TOKENS_PER_CONVERSATION,
                        convsPerDay,
                        currency,
                        exchangeRate
                    );

                    return (
                        <div
                            key={model.id}
                            className={`p-4 rounded-xl border transition-all gh-card-hover gh-card-shine ${model.isBaseline
                                ? 'bg-[#15152a]/40 border-[#7B61FF]/30'
                                : 'bg-[#0d0d0f] border-[#1a1a1c]'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-gray-300">{model.name}</span>
                                <span className="text-[9px] text-gray-500 font-medium px-2 py-0.5 bg-[#1a1a1c] rounded">
                                    {model.provider}
                                </span>
                            </div>
                            <p className="text-lg font-bold font-mono text-white">
                                {formatCurrency(monthlyCost, currency, true)}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1">/mês ({convsPerDay * 30} conversas)</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CostCalculator;
