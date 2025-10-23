import React from 'react';

export const EraserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58-4.87-2.12.38a2.25 2.25 0 0 0-1.732 2.122v2.755a2.25 2.25 0 0 0 1.732 2.122l2.12.38m-2.12-4.632 4.632-2.12m-4.632 2.122 4.632 2.12M19.5 9.375l-4.632-2.122m4.632 2.122-4.632 2.12M19.5 9.375V6.625c0-1.036-.84-1.875-1.875-1.875h-10.5C6.084 4.75 5.25 5.59 5.25 6.625v10.75c0 1.036.84 1.875 1.875 1.875h10.5c1.035 0 1.875-.84 1.875-1.875v-2.75" />
    </svg>
);