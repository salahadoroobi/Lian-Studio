import React from 'react';

export const StealthIcon: React.FC = () => (
    <svg className="w-12 h-12 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* File outline with fold */}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        
        {/* Magnifying glass */}
        <circle cx="11" cy="15" r="3"></circle>
        <line x1="13" y1="17" x2="16" y2="20"></line>
    </svg>
);
