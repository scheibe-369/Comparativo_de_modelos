import React from 'react';

const GrowthHubLogo = ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="70" y="30" width="12" height="40" rx="3" />
        <path d="M52 48 L42 58 A 3 3 0 0 1 38 54 L48 44 A 3 3 0 0 1 52 48 Z" />
        <path d="M60 25 L35 25 A 5 5 0 0 0 30 30 L30 35 L23 35 A 3 3 0 0 0 20 38 L20 62 A 3 3 0 0 0 23 65 L30 65 L30 70 A 5 5 0 0 0 35 75 L60 75 A 3 3 0 0 0 63 72 L63 65 A 3 3 0 0 0 60 62 L38 62 L38 38 L60 38 A 3 3 0 0 0 63 35 L63 28 A 3 3 0 0 0 60 25 Z" />
    </svg>
);

export default GrowthHubLogo;
