import React from 'react';

export const XSocialIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.5 19.5l-1.5-2.125-7.75-10.875h2.25l6.25 8.75 1.5 2.125h-2z" />
    </svg>
);