import React from 'react';
import { Calculator, TrendingDown, Cpu, ShieldCheck } from 'lucide-react';
import { getSortedModels } from '../../data/models';

const StatsCards = () => {
    const cheapest = getSortedModels()[0];

    const cards = [
        {
            icon: Calculator,
            iconColor: 'text-[#7B61FF]',
            label: 'Contexto Médio',
            value: '70k',
            sub: 'tokens',
            extra: (
                <div className="mt-4 h-1 w-full bg-[#1a1a1c] rounded-full overflow-hidden">
                    <div className="bg-[#7B61FF] h-full w-[70%] rounded-full" />
                </div>
            ),
        },
        {
            icon: TrendingDown,
            iconColor: 'text-emerald-500',
            label: 'Mais Eficiente',
            value: cheapest.name,
            detail: 'Custo Mínimo Viável',
            detailColor: 'text-emerald-500',
        },
        {
            icon: Cpu,
            iconColor: 'text-amber-500',
            label: 'Open-Source',
            value: 'Llama 3.3 70B',
            detail: 'High Quality · Free Tier',
            detailColor: 'text-amber-500',
        },
        {
            icon: ShieldCheck,
            iconColor: 'text-[#7B61FF]',
            label: 'Status Agente',
            value: 'Otimizado',
            valueColor: 'text-emerald-400',
            detail: 'Growth Hub V2.0.0',
            detailColor: 'text-gray-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className="bg-[#111113] border border-[#1f1f23] p-5 sm:p-6 rounded-2xl gh-card-hover gh-card-shine animate-fadeIn"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <p className="text-gray-500 text-xs font-bold uppercase mb-3 sm:mb-4 flex items-center gap-2">
                        <card.icon size={14} className={card.iconColor} />
                        {card.label}
                    </p>
                    <h3 className={`text-lg sm:text-xl font-bold ${card.valueColor || 'text-white'}`}>
                        {card.value}
                        {card.sub && <span className="text-sm font-normal text-gray-500 ml-1">{card.sub}</span>}
                    </h3>
                    {card.detail && (
                        <p className={`text-[10px] ${card.detailColor} font-bold mt-2`}>{card.detail}</p>
                    )}
                    {card.extra}
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
