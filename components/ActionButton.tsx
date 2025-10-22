import React, { useState } from 'react';

const hoverAnimations = [
  'animate-shimmer-lr-hover',
  'animate-shimmer-rl-hover',
  'animate-shimmer-tb-hover',
  'animate-shimmer-bt-hover',
];

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, className, ...props }) => {
    const [shimmerClass, setShimmerClass] = useState('');
    const [shimmerKey, setShimmerKey] = useState(0);

    const triggerShimmer = () => {
        if (props.disabled) return;
        const randomIndex = Math.floor(Math.random() * hoverAnimations.length);
        setShimmerClass(hoverAnimations[randomIndex]);
        setShimmerKey(prev => prev + 1);
    };

    const gradientStyle = shimmerClass.includes('tb') || shimmerClass.includes('bt')
    ? 'linear-gradient(to bottom, transparent 20%, rgba(255, 255, 255, 0.25) 50%, transparent 80%)'
    : 'linear-gradient(to right, transparent 20%, rgba(255, 255, 255, 0.25) 50%, transparent 80%)';

    return (
        <button
            onMouseEnter={triggerShimmer}
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            <div
                key={shimmerKey}
                onAnimationEnd={() => setShimmerClass('')}
                className={`absolute inset-0 pointer-events-none ${shimmerClass}`}
                style={shimmerClass ? { backgroundImage: gradientStyle } : {}}
            ></div>
        </button>
    );
};