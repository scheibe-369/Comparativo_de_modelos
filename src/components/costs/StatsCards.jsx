import React from 'react';
import { Calculator, Zap, Cpu, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSortedModels } from '../../data/models';

const StatsCards = () => {
    const { t } = useTranslation();
    const allModels = getSortedModels();
    const recommended = allModels.find(m => m.badge === 'recommended') || allModels[0];
    const openSource = allModels.find(m => m.provider === 'Meta' || m.id.includes('llama')) || allModels[1];
    const beginnerModel = allModels.find(m => m.name.includes('Mini')) || allModels[0];

    const cards = [
        {
            icon: Calculator,
            iconColor: 'text-[#7B61FF]',
            label: t('statsCards.avgContext'),
            value: '70k',
            sub: t('statsCards.tokens'),
            detail: t('statsCards.avgContextDesc'),
            detailColor: 'text-gray-600/80 italic font-normal',
            extra: (
                <div className="mt-4 h-1 w-full bg-[#1a1a1c] rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#7B61FF] to-[#9B8AFF] h-full w-[70%] rounded-full shadow-[0_0_10px_rgba(123,97,255,0.5)]" />
                </div>
            ),
        },
        {
            icon: ShieldCheck,
            iconColor: 'text-blue-400',
            label: t('statsCards.mostRecommended'),
            value: 'Gemini 3 Flash',
            sub: (
                <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 ml-1">
                    {t('statsCards.preview')}
                </span>
            ),
            detail: t('statsCards.mostRecommendedDesc'),
            detailColor: 'text-gray-500/80 italic font-normal',
        },
        {
            icon: Cpu,
            iconColor: 'text-amber-500',
            label: t('statsCards.openSource'),
            value: openSource.name,
            detail: t('statsCards.openSourceDesc'),
            detailColor: 'text-amber-500/90 font-medium',
        },
        {
            icon: Zap,
            iconColor: 'text-pink-400',
            label: t('statsCards.beginnerModel'),
            value: beginnerModel.name,
            valueColor: 'text-white',
            detail: t('statsCards.beginnerModelDesc'),
            detailColor: 'text-pink-400 font-medium',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className="group bg-[#111113] border border-[#1f1f23] p-5 sm:p-6 rounded-2xl gh-card-hover gh-card-shine animate-fadeIn"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <p className="text-gray-500 text-xs font-bold uppercase mb-3 sm:mb-4 flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                        <card.icon size={14} className={`${card.iconColor} group-hover:scale-110 transition-transform`} />
                        {card.label}
                    </p>
                    <h3 className={`text-lg sm:text-xl font-bold ${card.valueColor || 'text-white'}`}>
                        {card.value}
                        {card.sub && <span className="text-sm font-normal text-gray-500 ml-1">{card.sub}</span>}
                    </h3>
                    {card.detail && (
                        <p className={`text-xs ${card.detailColor} mt-2`}>{card.detail}</p>
                    )}
                    {card.extra}
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
