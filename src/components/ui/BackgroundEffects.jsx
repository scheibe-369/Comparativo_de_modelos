import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 40;

const BackgroundEffects = () => {
    // Scroll-triggered reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('gh-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const timer = setTimeout(() => {
            document.querySelectorAll('.gh-reveal').forEach((el) => observer.observe(el));
        }, 100);

        return () => { clearTimeout(timer); observer.disconnect(); };
    }, []);

    // Generate particles with random drift directions
    const particles = useRef(
        Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
            id: i,
            size: Math.random() * 3 + 1,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 60 + 40,
            delay: Math.random() * -40,
            opacity: Math.random() * 0.4 + 0.1,
            driftX: (Math.random() - 0.5) * 200,
            driftY: (Math.random() - 0.5) * 200,
        }))
    ).current;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Ambient glow orb 1 - top right (larger movement) */}
            <div className="absolute gh-orb" style={{
                top: '-10%', right: '-5%', width: '700px', height: '700px',
                background: 'radial-gradient(circle, rgba(104, 81, 255, 0.09) 0%, transparent 70%)',
                animation: 'orbFloat1 18s ease-in-out infinite',
            }} />

            {/* Ambient glow orb 2 - left middle */}
            <div className="absolute gh-orb" style={{
                top: '25%', left: '-12%', width: '600px', height: '600px',
                background: 'radial-gradient(circle, rgba(104, 81, 255, 0.07) 0%, transparent 70%)',
                animation: 'orbFloat2 22s ease-in-out infinite',
            }} />

            {/* Ambient glow orb 3 - bottom center */}
            <div className="absolute gh-orb" style={{
                bottom: '5%', left: '35%', width: '800px', height: '800px',
                background: 'radial-gradient(circle, rgba(104, 81, 255, 0.06) 0%, transparent 70%)',
                animation: 'orbFloat3 26s ease-in-out infinite',
            }} />

            {/* Emerald accent orb - right */}
            <div className="absolute gh-orb" style={{
                top: '55%', right: '-8%', width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
                animation: 'orbFloat1 20s ease-in-out infinite reverse',
            }} />

            {/* Extra dynamic orb - top left */}
            <div className="absolute gh-orb" style={{
                top: '-5%', left: '20%', width: '450px', height: '450px',
                background: 'radial-gradient(circle, rgba(139, 120, 255, 0.06) 0%, transparent 70%)',
                animation: 'orbFloat2 15s ease-in-out infinite reverse',
            }} />

            {/* Extra dynamic orb - bottom right */}
            <div className="absolute gh-orb" style={{
                bottom: '15%', right: '15%', width: '550px', height: '550px',
                background: 'radial-gradient(circle, rgba(104, 81, 255, 0.05) 0%, transparent 70%)',
                animation: 'orbFloat3 19s ease-in-out infinite reverse',
            }} />

            {/* Floating particles with slow drift */}
            <div className="absolute inset-0">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="gh-particle"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            '--drift-x': `${p.driftX}px`,
                            '--drift-y': `${p.driftY}px`,
                            '--duration': `${p.duration}s`,
                            '--delay': `${p.delay}s`,
                            '--opacity': p.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Subtle grid overlay */}
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    linear-gradient(rgba(104, 81, 255, 0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(104, 81, 255, 0.02) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
            }} />

            {/* Scan line */}
            <div className="absolute left-0 right-0" style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(104, 81, 255, 0.12), transparent)',
                animation: 'scanLine 10s linear infinite',
            }} />
        </div>
    );
};

export default BackgroundEffects;
