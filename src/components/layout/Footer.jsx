import React from 'react';
import GrowthHubLogo from '../ui/Logo';

const Footer = () => (
    <footer className="mt-16 sm:mt-20 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#1a1a1a] pt-8 sm:pt-10 opacity-50 animate-fadeIn">
        <div className="flex items-center gap-3">
            <GrowthHubLogo className="w-5 h-5 sm:w-6 sm:h-6 text-[#7B61FF]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-400">
                © 2025 GROWTH HUB ANALYTICS
            </span>
        </div>
        <div className="flex gap-6 sm:gap-8 text-[10px] font-bold text-gray-500">
            <a href="#" className="hover:text-white transition-colors">DOCUMENTAÇÃO</a>
            <a href="#" className="hover:text-white transition-colors">API STATUS</a>
            <a href="#" className="hover:text-white transition-colors">TERMOS</a>
        </div>
    </footer>
);

export default Footer;
