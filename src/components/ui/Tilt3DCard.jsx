import React, { useRef, useState } from 'react';

const Tilt3DCard = ({ children, className = '', style: externalStyle = {}, intensity = 3 }) => {
    const cardRef = useRef(null);
    const [tiltStyle, setTiltStyle] = useState({});

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -intensity;
        const rotateY = ((x - centerX) / centerX) * intensity;

        setTiltStyle({
            transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.005)`,
            transition: 'transform 0.15s ease-out',
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
            transition: 'transform 0.5s ease-out',
        });
    };

    return (
        <div
            ref={cardRef}
            className={`gh-border-glow rounded-2xl sm:rounded-3xl ${className}`}
            style={{
                ...externalStyle,
                ...tiltStyle,
                willChange: 'transform',
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};

export default Tilt3DCard;
