import React from 'react';

export const ImageIcon: React.FC = () => (
    <div className="mx-auto bg-gray-200/80 dark:bg-gray-700 rounded-full h-16 w-16 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 12.5 5 9l3 3 2-2 4 4"/>
        </svg>
    </div>
);