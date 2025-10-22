import React, { useState, useEffect } from 'react';

const shimmerAnimations = [
  'animate-shimmer-lr',
  'animate-shimmer-rl',
  'animate-shimmer-tb',
  'animate-shimmer-bt',
];

interface ShimmerWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ShimmerWrapper: React.FC<ShimmerWrapperProps> = ({ children, className }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Select a random animation class when the component mounts
    const randomIndex = Math.floor(Math.random() * shimmerAnimations.length);
    setAnimationClass(shimmerAnimations[randomIndex]);
  }, []);

  const gradientStyle = animationClass.includes('tb') || animationClass.includes('bt')
    ? 'linear-gradient(to bottom, transparent 20%, rgba(255, 255, 255, 0.6) 50%, transparent 80%)'
    : 'linear-gradient(to right, transparent 20%, rgba(255, 255, 255, 0.6) 50%, transparent 80%)';

  return (
    <div className={`relative overflow-hidden inline-block align-middle ${className}`}>
      {children}
      <div
        className={`absolute inset-0 pointer-events-none ${animationClass}`}
        style={{ backgroundImage: gradientStyle }}
      ></div>
    </div>
  );
};
