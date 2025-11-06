import React from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ChatBubbleProps {
    role: 'user' | 'model';
    text: string;
    images?: string[];
    isLoading?: boolean;
    language: 'en' | 'ar';
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, text, images, isLoading, language }) => {
    const isUser = role === 'user';

    const bubbleClasses = isUser
        ? 'bg-brand-primary text-white'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    
    const containerClasses = isUser ? 'justify-end' : 'justify-start';
    const textAlignment = language === 'ar' ? 'text-right' : 'text-left';

    const Icon = isUser ? UserCircleIcon : SparklesIcon;
    const iconColor = isUser ? 'text-brand-primary dark:text-brand-bg' : 'text-brand-accent';

    return (
        <div className={`flex items-start gap-3 w-full ${containerClasses}`}>
            {!isUser && (
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            )}
            <div className="flex flex-col gap-2 max-w-xl">
                <div className={`p-4 rounded-2xl ${bubbleClasses}`}>
                    {images && images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {images.map((src, index) => (
                                <img key={index} src={src} className="w-24 h-24 object-cover rounded-md" alt="uploaded content" />
                            ))}
                        </div>
                    )}
                    {isLoading ? (
                        <SpinnerIcon className="animate-spin h-5 w-5" />
                    ) : (
                        <p className={`whitespace-pre-wrap ${textAlignment}`} dir="auto">{text}</p>
                    )}
                </div>
            </div>
            {isUser && (
                 <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            )}
        </div>
    );
};
