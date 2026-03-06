import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Calendar, Search, Package, Info, Plus } from 'lucide-react';
import { TOKENS_PER_CONVERSATION } from '../../data/models';
import { formatCurrency } from '../../utils/formatters';
import { calculateCost } from '../../utils/calculations';

const TOKENS_PER_EXECUTION = 4200;
const TOKENS_PER_TOOL = 8000;
const MARGIN = 0.08;
const BASE_TOOLS = 2; // Every agent has at least 2 base tools (hidden from UI)

const TOOL_OPTIONS_OLD = [];

// Reference: 6 questions + 5 tools = (6×4200) + (5×8000) = 65200 × 1.08 ≈ 70k ✓

const AttendanceSimulator = ({ currency, exchangeRate, models, onOpenCatalog }) => {
    const { t } = useTranslation();
    const [questions, setQuestions] = useState(6);
    const [activeTools, setActiveTools] = useState([]);

    const TOOL_OPTIONS = [
        {
            id: 'scheduling',
            label: t('attendanceSimulator.scheduling'),
            description: t('attendanceSimulator.schedulingDesc'),
            icon: Calendar,
            toolCount: 2,
            toolNames: ['Verificar agendamento', 'Agendar'],
        },
        {
            id: 'spreadsheet',
            label: t('attendanceSimulator.spreadsheet'),
            description: t('attendanceSimulator.spreadsheetDesc'),
            icon: Search,
            toolCount: 1,
            toolNames: ['Buscar dados'],
        },
        {
            id: 'inventory',
            label: t('attendanceSimulator.inventory'),
            description: t('attendanceSimulator.inventoryDesc'),
            icon: Package,
            toolCount: 1,
            toolNames: ['Verificar estoque'],
        },
    ];

    // Removido getSortedModels() estático - usando models passado via props

    const toggleTool = (toolId) => {
        setActiveTools((prev) =>
            prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
        );
    };

    // Token calculation: 4200/execution + 8000/tool + 8% margin
    const tokenBreakdown = useMemo(() => {
        const executionTokens = questions * TOKENS_PER_EXECUTION;

        const toolsDetail = TOOL_OPTIONS.filter((t) => activeTools.includes(t.id));
        const userToolTokens = toolsDetail.reduce((sum, t) => sum + t.toolCount * TOKENS_PER_TOOL, 0);
        const baseToolTokens = BASE_TOOLS * TOKENS_PER_TOOL;
        const totalToolTokens = userToolTokens + baseToolTokens;

        const subtotal = executionTokens + totalToolTokens;
        const marginTokens = Math.ceil(subtotal * MARGIN);
        const total = subtotal + marginTokens;

        return {
            executionTokens,
            toolsDetail,
            totalToolTokens,
            marginTokens,
            total,
        };
    }, [questions, activeTools]);

    const calculateModelCost = (model) => {
        // Usa a nova lógica rateada em 80/20 do calculateCost com o total de tokens do breakDown
        return calculateCost(model, tokenBreakdown.total, currency, exchangeRate);
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {t('attendanceSimulator.title')}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {t('attendanceSimulator.subtitle')}
                    </p>
                </div>
                <button
                    onClick={onOpenCatalog}
                    className="bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/30 hover:bg-[#7B61FF] hover:text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(123,97,255,0.1)] hover:shadow-[0_0_20px_rgba(123,97,255,0.3)] self-start sm:self-auto"
                >
                    <Plus size={16} />
                    {t('attendanceSimulator.addModels')}
                </button>
            </div>

            {/* Config Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Inputs */}
                <div className="space-y-5 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                    {/* Questions Slider */}
                    <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-5 gh-card-hover gh-border-glow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={18} className="text-[#7B61FF]" />
                                <span className="text-sm font-bold text-white">{t('attendanceSimulator.agentQuestions')}</span>
                            </div>
                            <span className="text-2xl font-bold text-[#7B61FF] font-mono">{questions}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={questions}
                            onChange={(e) => setQuestions(Number(e.target.value))}
                            className="w-full accent-[#7B61FF] h-2 bg-[#1a1a1c] rounded-full cursor-pointer"
                        />
                        <div className="relative h-4 mt-1">
                            {[1, 5, 10, 15, 20].map((val) => (
                                <span
                                    key={val}
                                    className="absolute text-[10px] text-gray-600 -translate-x-1/2"
                                    style={{ left: `${((val - 1) / 19) * 100}%` }}
                                >
                                    {val}
                                </span>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-3">
                            {t('attendanceSimulator.consumePrompts')}
                        </p>
                    </div>

                    {/* Tools */}
                    <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-5 gh-card-hover gh-border-glow">
                        <div className="flex items-center gap-2 mb-4">
                            <Search size={18} className="text-[#7B61FF]" />
                            <span className="text-sm font-bold text-white">{t('attendanceSimulator.tools')}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-4">
                            {t('attendanceSimulator.consumeTools')}
                        </p>
                        <div className="space-y-2">
                            {TOOL_OPTIONS.map((tool) => {
                                const Icon = tool.icon;
                                const isActive = activeTools.includes(tool.id);
                                return (
                                    <button
                                        key={tool.id}
                                        onClick={() => toggleTool(tool.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${isActive
                                            ? 'bg-[#7B61FF]/10 border border-[#7B61FF]/40 text-white'
                                            : 'bg-[#0d0d0f] border border-[#1a1a1c] text-gray-400 hover:border-[#333]'
                                            }`}
                                    >
                                        <Icon size={16} className={isActive ? 'text-[#7B61FF]' : 'text-gray-500'} />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold">{tool.label}</p>
                                            <p className="text-[9px] opacity-60">{tool.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[9px] font-mono ${isActive ? 'text-[#7B61FF]' : 'text-gray-600'}`}>
                                                {tool.toolCount} {tool.toolCount > 1 ? t('attendanceSimulator.toolsPlural') : t('attendanceSimulator.tool')} · {(tool.toolCount * TOKENS_PER_TOOL / 1000).toFixed(0)}k
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="space-y-5 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                    {/* Token Summary */}
                    <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-5 gh-card-hover gh-border-glow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-white">{t('attendanceSimulator.tokensPerConv')}</span>
                            <span className="text-2xl font-bold text-[#7B61FF] font-mono">
                                {(tokenBreakdown.total / 1000).toFixed(1)}k
                            </span>
                        </div>

                        {/* Token bar visualization */}
                        <div className="h-3 rounded-full bg-[#0d0d0f] overflow-hidden flex mb-4">
                            <div
                                className="h-full bg-[#7B61FF] transition-all duration-500"
                                style={{ width: `${(tokenBreakdown.executionTokens / tokenBreakdown.total) * 100}%` }}
                                title={t('attendanceSimulator.executions')}
                            />
                            {tokenBreakdown.totalToolTokens > 0 && (
                                <div
                                    className="h-full bg-amber-500 transition-all duration-500"
                                    style={{ width: `${(tokenBreakdown.totalToolTokens / tokenBreakdown.total) * 100}%` }}
                                    title={t('attendanceSimulator.toolsLegend')}
                                />
                            )}
                            <div
                                className="h-full bg-red-400/60 transition-all duration-500"
                                style={{ width: `${(tokenBreakdown.marginTokens / tokenBreakdown.total) * 100}%` }}
                                title={t('attendanceSimulator.marginLegend')}
                            />
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#7B61FF]" />
                                <span className="text-gray-400">{t('attendanceSimulator.executions')}: {(tokenBreakdown.executionTokens / 1000).toFixed(1)}k</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-gray-400">{t('attendanceSimulator.toolsLegend')}: {(tokenBreakdown.totalToolTokens / 1000).toFixed(1)}k</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-400/60" />
                                <span className="text-gray-400">{t('attendanceSimulator.marginLegend')}: +{(tokenBreakdown.marginTokens / 1000).toFixed(1)}k</span>
                            </div>
                        </div>

                    </div>

                    {/* Cost per Model */}
                    <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-5 gh-card-hover gh-border-glow">
                        <div className="flex items-center gap-2 mb-4">
                            <Info size={16} className="text-[#7B61FF]" />
                            <span className="text-sm font-bold text-white">{t('attendanceSimulator.costPerConv')}</span>
                        </div>
                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            {models.map((model) => {
                                const cost = calculateModelCost(model);
                                const maxCostModel = models[models.length - 1]; // assumindo os ordenados
                                const maxCost = maxCostModel ? calculateModelCost(maxCostModel) : 1;
                                const barWidth = maxCost > 0 ? (cost / maxCost) * 100 : 0;

                                return (
                                    <div key={model.id} className="group">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-medium ${model.badge === 'recommended' ? 'text-emerald-400' : 'text-gray-300'}`}>
                                                {model.name}
                                                {model.badge === 'recommended' && (
                                                    <span className="ml-1 text-[8px] text-emerald-500">★</span>
                                                )}
                                            </span>
                                            <span className="text-xs font-bold font-mono text-white">
                                                {formatCurrency(cost, currency)}
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-[#0d0d0f] overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${model.badge === 'recommended'
                                                    ? 'bg-gradient-to-r from-emerald-500 to-[#7B61FF]'
                                                    : cost / maxCost < 0.3
                                                        ? 'bg-emerald-500'
                                                        : cost / maxCost < 0.6
                                                            ? 'bg-amber-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${Math.max(barWidth, 2)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Monthly projection */}
                    <div className="bg-[#111113] border border-[#1f1f23] p-5 sm:p-6 rounded-2xl gh-card-hover gh-card-shine animate-fadeIn">
                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">{t('attendanceSimulator.monthlyProjection')}</p>
                        <div className="grid grid-cols-2 gap-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                            {models.map((model) => {
                                const costPerConv = calculateModelCost(model);
                                const monthly = costPerConv * 100 * 30;
                                return (
                                    <div key={model.id} className="text-center">
                                        <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{model.name}</p>
                                        <p className="text-[16px] sm:text-lg font-bold font-mono text-white">
                                            {formatCurrency(monthly, currency, true)}
                                        </p>
                                        <p className="text-[9px] text-gray-600">{t('attendanceSimulator.perMonth')}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceSimulator;
