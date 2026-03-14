import React from 'react';
import { ArrowRight, BarChart3, FlaskConical, Calculator, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Tilt3DCard from '../ui/Tilt3DCard';

const LandingPage = ({ onEnterApp }) => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-[#7B61FF]" />,
      title: "Precisão Financeira",
      desc: "Compare custos de Input e Output com dados reais de provedores globais.",
      delay: "100ms"
    },
    {
      icon: <Calculator className="w-6 h-6 text-[#7B61FF]" />,
      title: "Simulador Inteligente",
      desc: "Calcule o custo total de operação baseado no seu volume de requisições.",
      delay: "200ms"
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-[#7B61FF]" />,
      title: "AI Lab Experimental",
      desc: "Teste múltiplos modelos simultaneamente e veja a performance em tempo real.",
      delay: "300ms"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center pt-20 pb-20 px-4 overflow-hidden">
      
      {/* Hero Section */}
      <div className="max-w-4xl text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7B61FF]/10 border border-[#7B61FF]/20 mb-8 animate-fadeIn">
          <Zap className="w-4 h-4 text-[#7B61FF]" />
          <span className="text-sm font-medium text-[#9B8AFF]">Growth Hub Analytics v1.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] animate-slideUp">
          Decifre o Custo da <br />
          <span className="bg-gradient-to-r from-[#7B61FF] via-[#9B8AFF] to-[#7B61FF] bg-clip-text text-transparent">Inteligência Artificial</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '100ms' }}>
          Compare os modelos mais avançados do mundo (GPT-4, Claude, Gemini, Llama) e escolha a melhor estratégia para o seu negócio com dados precisos.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp" style={{ animationDelay: '200ms' }}>
          <button 
            onClick={onEnterApp}
            className="gh-btn-primary px-8 py-4 rounded-2xl text-white font-bold text-lg flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"
          >
            Acessar Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
          

        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mt-24 z-10 px-4">
        {features.map((feature, idx) => (
          <Tilt3DCard key={idx}>
            <div 
              className="gh-card-hover gh-border-glow p-8 rounded-3xl h-full flex flex-col animate-slideUp"
              style={{ animationDelay: feature.delay }}
            >
              <div className="p-3 rounded-2xl bg-[#7B61FF]/10 border border-[#7B61FF]/20 w-fit mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </Tilt3DCard>
        ))}
      </div>

      {/* Social Proof / Stats Area */}
      <div className="mt-32 w-full max-w-5xl px-4 z-10">
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 backdrop-blur-xl relative overflow-hidden group">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">20+</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">Modelos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">0ms</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">Latência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">Transparente</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">BRL/USD</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">Conversão</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default LandingPage;
