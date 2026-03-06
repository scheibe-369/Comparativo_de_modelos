import React from 'react';
import logoOficial from '../../assets/logo-oficial.png';

const GrowthHubLogo = ({ className = 'w-8 h-8' }) => (
    <div className={`${className} relative group flex items-center justify-center`}>
        {/* Glow suave no fundo customizado para a nova logo */}
        <div className="absolute inset-0 bg-[#7B61FF]/10 blur-xl rounded-full group-hover:bg-[#7B61FF]/25 transition-all duration-700 opacity-40"></div>

        <img
            src={logoOficial}
            alt="Growth Hub Logo"
            className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 contrast-[1.1]"
        />
    </div>
);

export default GrowthHubLogo;
