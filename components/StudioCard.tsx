import React, { useState, useEffect } from 'react';
import type { Language, TFunction } from '../hooks/useLocalization';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ActionButton } from './ActionButton';
import { ShimmerWrapper } from './ShimmerWrapper';

interface StudioCardProps {
    imageUrl: string;
    prompt: string;
    t: TFunction;
    language: Language;
    onGenerate: (prompt: string) => void;
    index: number;
    isVisible: boolean;
}

export const StudioCard: React.FC<StudioCardProps> = ({ imageUrl, prompt, t, language, onGenerate, index, isVisible }) => {
    const [copied, setCopied] = useState(false);
    const [isMounted, setIsMounted] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(isVisible);

    // Animation parameters
    const transitionDurationMs = 300;
    const baseDelay = 60;
    const itemsPerSet = 15;
    const indexInSet = (index - 1) % itemsPerSet;

    // Calculate delays in milliseconds
    const entranceDelayMs = indexInSet * baseDelay;
    const exitDelayMs = (itemsPerSet - 1 - indexInSet) * baseDelay;

    // This effect runs when the card should either enter or exit
    useEffect(() => {
        if (isVisible) {
            // Case 1: A hidden card should become visible. Mount it first.
            setIsMounted(true);
        } else {
            // Case 2: A visible card should be hidden. Start exit animation.
            setIsAnimating(false);
            
            // Calculate total time until the card's exit animation is complete
            const unmountDelay = transitionDurationMs + exitDelayMs;
            
            const timer = setTimeout(() => {
                // After animation (including delay), unmount it.
                setIsMounted(false);
            }, unmountDelay);
            
            return () => clearTimeout(timer);
        }
    }, [isVisible, exitDelayMs]); // Rerun if visibility or its calculated delay changes

    // This effect runs after the card has been mounted to start the enter animation
    useEffect(() => {
        if (isMounted && isVisible) {
            // Use a small delay to ensure the DOM has updated before applying animation class.
            const timer = setTimeout(() => {
                setIsAnimating(true);
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [isMounted, isVisible]);


    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenerate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onGenerate(prompt);
    };
    
    // Use the appropriate delay for CSS transition
    const animationDelay = isAnimating ? `${entranceDelayMs}ms` : `${exitDelayMs}ms`;
    
    if (!isMounted) {
        return null;
    }

    return (
        <div 
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group aspect-square" 
            style={{
                transitionProperty: 'opacity, transform',
                transitionDuration: `${transitionDurationMs}ms`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: animationDelay,
                opacity: isAnimating ? 1 : 0,
                transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
            }}
        >
            <img src={imageUrl} alt={t('generated_image_alt')} className="w-full h-full object-cover" />
            
            <div className="absolute top-3 right-3 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
                <ShimmerWrapper className="rounded-full">
                    <div className="bg-brand-accent/80 backdrop-blur-sm text-white font-bold text-lg rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                        {index}
                    </div>
                </ShimmerWrapper>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                
                <p 
                    className="text-white text-sm line-clamp-2"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                    {prompt}
                </p>

                <div className="flex items-center justify-between mt-3">
                    <ActionButton
                        onClick={handleCopy}
                        title={copied ? t('copy_success') : t('copy_button')}
                        className="bg-black/40 text-white backdrop-blur-sm p-2.5 rounded-lg hover:bg-black/60 transition-colors"
                    >
                        {copied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                    </ActionButton>

                    <ActionButton
                        onClick={handleGenerate}
                        title={t('start_generating')}
                        className="bg-brand-accent text-white p-2.5 rounded-lg hover:bg-brand-accent-dark transition-colors transform hover:-translate-y-0.5"
                    >
                        <SparklesIcon className="w-5 h-5" />
                    </ActionButton>
                </div>
            </div>
        </div>
    );
};