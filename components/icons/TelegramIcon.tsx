import React from 'react';

export const TelegramIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.08l16.16-5.8c.7-.25 1.28.22 1.06.91l-2.22 10.45c-.22.84-.79 1.04-1.5.63l-4.12-3.05-1.97 1.9c-.24.24-.45.46-.8.46l.02.01z" />
    </svg>
);