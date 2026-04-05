import React, { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Calendar, Search, Package, Info, Plus, Upload, FileText, X, Maximize2, TrendingUp, TrendingDown, Minus, Check, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateCost } from '../../utils/calculations';
import * as mammoth from 'mammoth';

const TOKENS_PER_EXECUTION = 4200;
const TOKENS_PER_TOOL = 8000;
const MARGIN = 0.08;
const BASE_TOOLS = 2; // Every agent has at least 2 base tools (hidden from UI)

const AttendanceSimulator = ({ currency, exchangeRate, models, onOpenCatalog }) => {
    const { t } = useTranslation();
    
    // Configurações Teóricas
    const [questions, setQuestions] = useState(6);
    const [activeTools, setActiveTools] = useState([]);
    
    // Modo de Simulação ("theoretical" | "real")
    const [mode, setMode] = useState('theoretical');

    // Configurações Reais (Upload)
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileTextTokens, setFileTextTokens] = useState(0);
    const [agentResponses, setAgentResponses] = useState(1);
    const [detectedResponses, setDetectedResponses] = useState(null); // null = não detectado ainda
    const [realToolCount, setRealToolCount] = useState(0);
    const fileInputRef = useRef(null);
    const [isProjectionModalOpen, setIsProjectionModalOpen] = useState(false);
    const [selectedCompareIds, setSelectedCompareIds] = useState(new Set());

    const toggleCompareModel = (modelId) => {
        setSelectedCompareIds(prev => {
            const next = new Set(prev);
            if (next.has(modelId)) {
                next.delete(modelId);
            } else {
                next.add(modelId);
            }
            return next;
        });
    };

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

    const toggleTool = (toolId) => {
        setActiveTools((prev) =>
            prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
        );
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setFileName(file.name);
        
        try {
            let text = "";
            if (file.name.endsWith('.docx')) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                text = result.value;
            } else {
                text = await file.text();
            }

            // Estimativa simples: 1 token a cada 4 caracteres
            const calculatedTokens = Math.max(Math.ceil(text.length / 4), 1);
            setFileTextTokens(calculatedTokens);

            // Detectar blocos separados por linha em branco (\n\n ou \r\n\r\n)
            // Cada bloco = 1 input/prompt enviado ao agente
            const blocks = text
                .split(/\n\s*\n/)  // divide por uma ou mais linhas em branco
                .map(b => b.trim())
                .filter(b => b.length > 0); // remove blocos vazios

            const count = Math.max(blocks.length, 1);
            setDetectedResponses(count);
            setAgentResponses(count);
        } catch (error) {
            console.error("Erro ao ler arquivo:", error);
            alert(t('attendanceSimulator.uploadError'));
        }
    };

    const onFileDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    };

    const onFileSelect = (e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    };

    const clearFile = () => {
        setFileName('');
        setFileTextTokens(0);
        setDetectedResponses(null);
        setAgentResponses(1);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Cálculos unificados baseados no Modo
    const tokenBreakdown = useMemo(() => {
        if (mode === 'theoretical') {
            const executionTokens = questions * TOKENS_PER_EXECUTION;
            const toolsDetail = TOOL_OPTIONS.filter((t) => activeTools.includes(t.id));
            const userToolTokens = toolsDetail.reduce((sum, t) => sum + t.toolCount * TOKENS_PER_TOOL, 0);
            const baseToolTokens = BASE_TOOLS * TOKENS_PER_TOOL;
            const totalToolTokens = userToolTokens + baseToolTokens;

            const subtotal = executionTokens + totalToolTokens;
            const marginTokens = Math.ceil(subtotal * MARGIN);
            const total = subtotal + marginTokens;

            return {
                exactMode: false,
                executionTokens,
                totalToolTokens,
                marginTokens,
                total,
            };
        } else {
            // Modo Real:
            // Input Tokens (Prompt Processing): Arquivo + Contexto por resposta (5000) + Tools
            const exactInput = fileTextTokens + (realToolCount * TOKENS_PER_TOOL) + (agentResponses * 5000);
            
            // Output Tokens (Geração): Valor realista médio por resposta do Agente (500 tokens gerados)
            const exactOutput = agentResponses * 500;
            
            const marginInput = Math.ceil(exactInput * MARGIN);
            const marginOutput = Math.ceil(exactOutput * MARGIN);

            return {
                exactMode: true,
                exactInput: exactInput + marginInput,
                exactOutput: exactOutput + marginOutput,
                totalToolTokens: realToolCount * TOKENS_PER_TOOL,
                executionTokens: exactInput + exactOutput,
                marginTokens: marginInput + marginOutput,
                total: exactInput + exactOutput + marginInput + marginOutput
            };
        }
    }, [mode, questions, activeTools, fileTextTokens, agentResponses, realToolCount]);

    const calculateModelCost = (model) => {
        const costOptions = { clientMarkup: true };
        
        if (mode === 'theoretical') {
            return calculateCost(model, tokenBreakdown.total, currency, exchangeRate, costOptions);
        } else {
            return calculateCost(model, 0, currency, exchangeRate, {
                ...costOptions,
                exactInput: tokenBreakdown.exactInput,
                exactOutput: tokenBreakdown.exactOutput
            });
        }
    };

    const sortedModels = useMemo(() => {
        return [...models]
            .map(m => ({ model: m, monthly: calculateModelCost(m) * 100 * 30 }))
            .sort((a, b) => a.monthly - b.monthly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [models, tokenBreakdown, currency, exchangeRate]);

    const maxMonthly = sortedModels[sortedModels.length - 1]?.monthly || 1;

    // Comparison derived from user selection
    const comparisonData = useMemo(() => {
        if (selectedCompareIds.size < 2) return null;
        const selected = sortedModels.filter(s => selectedCompareIds.has(s.model.id));
        if (selected.length < 2) return null;
        const cheapest = selected[0];
        const expensive = selected[selected.length - 1];
        return { cheapest, expensive, diff: expensive.monthly - cheapest.monthly };
    }, [selectedCompareIds, sortedModels]);

    return (
        <>
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

            {/* Mode Toggle */}
            <div className="flex p-1 bg-[#111113] border border-[#1f1f23] rounded-xl w-fit">
                <button 
                    onClick={() => setMode('theoretical')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'theoretical' ? 'bg-[#7B61FF] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {t('attendanceSimulator.theoreticalSimulation')}
                </button>
                <button 
                    onClick={() => setMode('real')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'real' ? 'bg-[#7B61FF] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {t('attendanceSimulator.realSimulation')}
                </button>
            </div>

            {/* Config Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Inputs */}
                <div className="space-y-5 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                    
                    {mode === 'theoretical' ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            {/* Real File Upload Section */}
                            <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-5 gh-card-hover gh-border-glow flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <Upload size={18} className="text-[#7B61FF]" />
                                    <span className="text-sm font-bold text-white">{t('attendanceSimulator.uploadConversation')}</span>
                                </div>
                                
                                {!fileName ? (
                                    <div 
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${isDragging ? 'border-[#7B61FF] bg-[#7B61FF]/10' : 'border-[#2a2a30] bg-[#0d0d0f] hover:border-gray-500'}`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={onFileDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FileText size={24} className="text-gray-500" />
                                        <p className="text-xs text-gray-400">{t('attendanceSimulator.dragAndDrop')}</p>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept=".txt,.md,.docx" 
                                            onChange={onFileSelect} 
                                        />
                                    </div>
                                ) : (
                                    <div className="border border-[#7B61FF]/30 bg-[#7B61FF]/10 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText size={20} className="text-[#7B61FF]" />
                                            <div>
                                                <p className="text-sm font-bold text-white max-w-[200px] truncate">{fileName}</p>
                                                <p className="text-[10px] text-[#7B61FF]/80 font-mono">{(fileTextTokens/1000).toFixed(1)}k Tokens Extraídos</p>
                                            </div>
                                        </div>
                                        <button onClick={clearFile} className="p-2 hover:bg-black/20 rounded-lg text-gray-400 hover:text-white transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Additional Configs for Real Mode */}
                            <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-5 gh-card-hover gh-border-glow space-y-5">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex flex-col gap-0.5">
                                            <label className="text-xs font-bold text-gray-300">{t('attendanceSimulator.agentResponses')}</label>
                                            {detectedResponses !== null && (
                                                <span className="text-[9px] text-[#7B61FF]/80 font-mono">
                                                    ✦ {detectedResponses} inputs detectados no arquivo
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-lg font-mono text-[#7B61FF]">{agentResponses}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={agentResponses}
                                        onChange={(e) => setAgentResponses(Number(e.target.value))}
                                        className="w-full accent-[#7B61FF] h-2 bg-[#1a1a1c] rounded-full cursor-pointer"
                                    />
                                    {detectedResponses !== null && agentResponses !== detectedResponses && (
                                        <button
                                            onClick={() => setAgentResponses(detectedResponses)}
                                            className="mt-2 text-[9px] text-[#7B61FF] hover:text-[#a48fff] transition-colors underline cursor-pointer"
                                        >
                                            Restaurar para {detectedResponses} detectados
                                        </button>
                                    )}
                                </div>
                                <div className="h-[1px] bg-[#1f1f23] w-full" />
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-bold text-gray-300">{t('attendanceSimulator.toolsUsed')}</label>
                                        <span className="text-lg font-mono text-[#7B61FF]">{realToolCount}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        value={realToolCount}
                                        onChange={(e) => setRealToolCount(Number(e.target.value))}
                                        className="w-full accent-[#7B61FF] h-2 bg-[#1a1a1c] rounded-full cursor-pointer"
                                    />
                                </div>
                            </div>
                        </>
                    )}
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
                            {tokenBreakdown.totalToolTokens > 0 && mode === 'theoretical' && (
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
                            {mode === 'theoretical' && (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="text-gray-400">{t('attendanceSimulator.toolsLegend')}: {(tokenBreakdown.totalToolTokens / 1000).toFixed(1)}k</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-400/60" />
                                <span className="text-gray-400">{t('attendanceSimulator.marginLegend')}: +{(tokenBreakdown.marginTokens / 1000).toFixed(1)}k</span>
                            </div>
                        </div>

                    </div>

                    {/* Cost per Model */}
                    <div className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-5 gh-card-hover gh-border-glow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Info size={16} className="text-[#7B61FF]" />
                                <span className="text-sm font-bold text-white">{t('attendanceSimulator.costPerConv')}</span>
                            </div>
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
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t('attendanceSimulator.monthlyProjection')}</p>
                            <button
                                onClick={() => setIsProjectionModalOpen(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#7B61FF]/10 border border-[#7B61FF]/20 text-[#7B61FF] hover:bg-[#7B61FF]/20 transition-all cursor-pointer group"
                                title="Expandir todos os modelos"
                            >
                                <Maximize2 size={12} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-bold">EXPANDIR</span>
                            </button>
                        </div>
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

        {/* Monthly Projection Full Modal */}
        {isProjectionModalOpen && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 overflow-y-auto custom-scrollbar pt-28 sm:pt-36" role="dialog" aria-modal="true">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    onClick={() => setIsProjectionModalOpen(false)}
                />

                {/* Modal Panel */}
                <div className="relative w-full max-w-2xl flex flex-col animate-slideUp">
                    {/* Glass card */}
                    <div className="relative rounded-[1.75rem] border border-[#2a2a35] bg-[#0c0c0f] shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col">

                        {/* Ambient glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#7B61FF] to-transparent opacity-60 rounded-full" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#1f1f23]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-[#7B61FF]/10 border border-[#7B61FF]/20">
                                    <TrendingUp size={18} className="text-[#7B61FF]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-base tracking-tight">Projeção Mensal</h3>
                                    <p className="text-gray-500 text-xs">100 conv/dia · {models.length} modelos · {selectedCompareIds.size > 0 ? `${selectedCompareIds.size} selecionados` : 'selecione para comparar'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsProjectionModalOpen(false)}
                                className="p-2 rounded-full bg-[#1a1a1c] border border-[#2a2a2e] text-gray-500 hover:text-white hover:bg-[#252527] transition-all cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Comparison panel — user-driven */}
                        {comparisonData ? (
                            <div className="flex flex-wrap gap-3 px-7 py-4 border-b border-[#1a1a1c] animate-fadeIn">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <TrendingDown size={13} className="text-emerald-400" />
                                    <div>
                                        <p className="text-[9px] text-emerald-400/70 font-bold uppercase tracking-widest">Mais barato</p>
                                        <p className="text-xs font-bold text-emerald-400 truncate max-w-[120px]">{comparisonData.cheapest.model.name}</p>
                                        <p className="text-[10px] font-mono text-emerald-400/80">{formatCurrency(comparisonData.cheapest.monthly, currency, true)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center self-center">
                                    <ArrowRight size={14} className="text-gray-600" />
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <TrendingUp size={13} className="text-red-400" />
                                    <div>
                                        <p className="text-[9px] text-red-400/70 font-bold uppercase tracking-widest">Mais caro</p>
                                        <p className="text-xs font-bold text-red-400 truncate max-w-[120px]">{comparisonData.expensive.model.name}</p>
                                        <p className="text-[10px] font-mono text-red-400/80">{formatCurrency(comparisonData.expensive.monthly, currency, true)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#7B61FF]/10 border border-[#7B61FF]/20 ml-auto">
                                    <Minus size={13} className="text-[#9B8AFF]" />
                                    <div>
                                        <p className="text-[9px] text-[#9B8AFF]/70 font-bold uppercase tracking-widest">Diferença</p>
                                        <p className="text-xs font-bold text-[#9B8AFF]">{formatCurrency(comparisonData.diff, currency, true)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCompareIds(new Set())}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer self-center ml-1"
                                >
                                    <X size={10} /> Limpar
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-7 py-3 border-b border-[#1a1a1c]">
                                <div className="w-4 h-4 rounded border border-dashed border-[#7B61FF]/40 flex items-center justify-center">
                                    <Check size={8} className="text-[#7B61FF]/40" />
                                </div>
                                <p className="text-[10px] text-gray-500">
                                    {selectedCompareIds.size === 0
                                        ? 'Selecione 2 ou mais modelos para comparar os custos'
                                        : 'Selecione mais 1 modelo para ver a comparação'}
                                </p>
                            </div>
                        )}

                        {/* Models list */}
                        <div className="overflow-y-auto flex-1 px-7 py-5 space-y-3 custom-scrollbar" style={{ maxHeight: '55vh' }}>
                            {sortedModels.map(({ model, monthly }, idx) => {
                                const barWidth = maxMonthly > 0 ? (monthly / maxMonthly) * 100 : 0;
                                const isSelected = selectedCompareIds.has(model.id);
                                const isCompCheapest = comparisonData && comparisonData.cheapest.model.id === model.id;
                                const isCompExpensive = comparisonData && comparisonData.expensive.model.id === model.id;
                                const barColor = isCompCheapest
                                    ? 'from-emerald-500 to-[#7B61FF]'
                                    : isCompExpensive
                                    ? 'from-red-500 to-red-400'
                                    : barWidth < 40
                                    ? 'from-emerald-500 to-amber-400'
                                    : 'from-amber-400 to-red-400';
                                const rankLabel = isCompCheapest ? '🏆 Melhor custo' : isCompExpensive ? '⚠️ Mais caro' : null;

                                return (
                                    <div
                                        key={model.id}
                                        onClick={() => toggleCompareModel(model.id)}
                                        className={`group p-4 rounded-2xl border transition-all cursor-pointer ${
                                            isSelected
                                                ? isCompCheapest
                                                    ? 'bg-emerald-500/5 border-emerald-500/30 ring-1 ring-emerald-500/20'
                                                    : isCompExpensive
                                                    ? 'bg-red-500/5 border-red-500/30 ring-1 ring-red-500/20'
                                                    : 'bg-[#7B61FF]/5 border-[#7B61FF]/30 ring-1 ring-[#7B61FF]/20'
                                                : 'bg-[#111113] border-[#1f1f23] hover:border-[#2a2a35]'
                                        }`}
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2.5">
                                                {/* Checkbox */}
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                                                    isSelected
                                                        ? 'bg-[#7B61FF] border-[#7B61FF]'
                                                        : 'border-[#333] group-hover:border-[#555]'
                                                }`}>
                                                    {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                                                </div>
                                                <span className="text-[10px] font-black text-gray-600 w-5 text-right">{idx + 1}.</span>
                                                <div>
                                                    <p className={`text-sm font-bold ${
                                                        isCompCheapest ? 'text-emerald-400' 
                                                        : isCompExpensive ? 'text-red-400'
                                                        : isSelected ? 'text-[#9B8AFF]' 
                                                        : 'text-white'
                                                    }`}>
                                                        {model.name}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] text-gray-600 font-medium">{model.provider}</span>
                                                        {rankLabel && (
                                                            <span className={`text-[9px] font-bold ${
                                                                isCompCheapest ? 'text-emerald-500' : 'text-red-400'
                                                            }`}>{rankLabel}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-lg font-bold font-mono ${
                                                    isCompCheapest ? 'text-emerald-400'
                                                    : isCompExpensive ? 'text-red-400'
                                                    : 'text-white'
                                                }`}>
                                                    {formatCurrency(monthly, currency, true)}
                                                </p>
                                                <p className="text-[9px] text-gray-600">/mês</p>
                                            </div>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-[#0d0d0f] overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                                                style={{ width: `${Math.max(barWidth, 2)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="px-7 py-4 border-t border-[#1a1a1c] flex items-center justify-between">
                            <p className="text-[10px] text-gray-600">Baseado em 100 conv/dia × 30 dias</p>
                            <button
                                onClick={() => setIsProjectionModalOpen(false)}
                                className="px-5 py-2 rounded-xl bg-[#7B61FF] hover:bg-[#6851FF] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(123,97,255,0.3)] hover:shadow-[0_0_25px_rgba(123,97,255,0.5)]"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        , document.body)}
        </>
    );
};

export default AttendanceSimulator;
