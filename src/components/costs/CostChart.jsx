import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TOKENS_PER_CONVERSATION } from '../../data/models';
import { calculateCost } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const COLORS = [
    '#10b981', '#10b981', '#10b981', // Ultra-Fast (green)
    '#f59e0b',                       // Efficient (amber)
    '#7B61FF',                       // Open-Source (purple)
    '#ef4444', '#ef4444', '#ef4444', '#ef4444', // High-Reasoning (red)
];

const CostChart = ({ currency, exchangeRate, models }) => {
    const data = models.map((m, i) => ({
        name: m.name,
        cost: calculateCost(m.costInput, m.costOutput, TOKENS_PER_CONVERSATION, currency, exchangeRate),
        color: COLORS[i] || '#7B61FF',
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1a1c] border border-[#2a2a2e] rounded-xl px-4 py-3 shadow-xl">
                    <p className="text-white text-sm font-bold">{payload[0].payload.name}</p>
                    <p className="text-[#7B61FF] text-xs font-mono mt-1">
                        {formatCurrency(payload[0].value, currency)}
                        <span className="text-gray-500 ml-1">/ conversa</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl sm:rounded-3xl p-5 sm:p-8 mt-6 sm:mt-8 animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 tracking-tight">
                Custo por Conversa — Visual
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm italic mb-6">
                Comparação direta do custo por conversa de 70k tokens ({currency})
            </p>

            <div className="h-[280px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                        <XAxis
                            type="number"
                            tick={{ fill: '#555', fontSize: 10 }}
                            axisLine={{ stroke: '#222' }}
                            tickLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#999', fontSize: 11, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            width={120}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(104,81,255,0.05)' }} />
                        <Bar dataKey="cost" radius={[0, 6, 6, 0]} barSize={20}>
                            {data.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} fillOpacity={0.85} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CostChart;
