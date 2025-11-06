import React, { useState, useLayoutEffect, useRef } from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import type { TFunction } from '../hooks/useLocalization';
import { PencilIcon } from './icons/PencilIcon';

interface ChatBubbleProps {
    id: string;
    role: 'user' | 'model';
    text: string;
    images?: string[];
    isLoading?: boolean;
    language: 'en' | 'ar';
    t: TFunction;
    isEditing?: boolean;
    onSetEditing?: (id: string | null) => void;
    onUpdateMessage?: (id: string, newText: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ id, role, text, images, isLoading, language, t, isEditing, onSetEditing, onUpdateMessage }) => {
    const isUser = role === 'user';
    const [copied, setCopied] = useState(false);
    const [editedText, setEditedText] = useState(text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea while editing
    useLayoutEffect(() => {
        if (isEditing && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [isEditing, editedText]);

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!text) return;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lian-studio-chat-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const handleSave = () => {
        if (onUpdateMessage && editedText.trim()) {
            onUpdateMessage(id, editedText);
        }
    };

    const handleCancel = () => {
        if (onSetEditing) {
            onSetEditing(null);
            setEditedText(text); // Reset local state
        }
    };

    const bubbleClasses = isUser
        ? 'bg-brand-primary text-white'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    
    const containerClasses = isUser ? 'justify-end' : 'justify-start';
    const textAlignment = language === 'ar' ? 'text-right' : 'text-left';

    const Icon = isUser ? UserCircleIcon : SparklesIcon;
    const iconColor = isUser ? 'text-brand-primary dark:text-brand-bg' : 'text-brand-accent';
    const actionIconColor = 'text-gray-500 dark:text-gray-400';

    if (isUser && isEditing) {
        return (
            <div className="flex items-start gap-3 w-full justify-end animate-fade-in">
                <div className="flex flex-col max-w-xl w-full">
                    <div className={`p-3 rounded-2xl ${bubbleClasses}`}>
                        <textarea
                            ref={textareaRef}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSave();
                                }
                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                    handleCancel();
                                }
                            }}
                            className="w-full bg-brand-primary-dark text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 resize-none overflow-hidden text-start"
                            rows={1}
                            autoFocus
                            dir="auto"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={handleCancel} className="px-4 py-1 rounded-lg bg-gray-500/50 text-white hover:bg-gray-500/70 transition-colors text-sm">{t('cancel_edit')}</button>
                            <button onClick={handleSave} disabled={!editedText.trim()} className="px-4 py-1 rounded-lg bg-brand-accent text-white font-semibold hover:bg-brand-accent-dark transition-colors disabled:bg-brand-accent/50 disabled:cursor-not-allowed text-sm">{t('save_edit')}</button>
                        </div>
                    </div>
                </div>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
        )
    }


    return (
        <div className={`flex items-start gap-3 w-full ${containerClasses} group`}>
            {!isUser && (
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            )}
             {isUser && (
                 <div className="flex-shrink-0 self-center flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => onSetEditing && onSetEditing(id)}
                        title={t('edit_message_tooltip')}
                        aria-label={t('edit_message_tooltip')}
                        className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${actionIconColor}`}
                    >
                       <PencilIcon className="w-5 h-5" />
                    </button>
                </div>
             )}
            <div className="flex flex-col max-w-xl">
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
            {!isUser && !isLoading && text && (
                 <div className="flex-shrink-0 self-center flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleCopy}
                        title={copied ? t('copy_success') : t('copy_button')}
                        aria-label={copied ? t('copy_success') : t('copy_button')}
                        className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${actionIconColor}`}
                    >
                        {copied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                    </button>
                    <button
                        onClick={handleDownload}
                        title={t('download_prompt_label')}
                        aria-label={t('download_prompt_label')}
                        className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${actionIconColor}`}
                    >
                        <DownloadIcon />
                    </button>
                </div>
            )}
        </div>
    );
};
