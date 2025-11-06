import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import type { TFunction, Language } from '../hooks/useLocalization';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SendIcon } from './icons/SendIcon';
import { XIcon } from './icons/XIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';

interface ChatInputProps {
    onSend: (message: { text: string, images?: File[] }) => void;
    isLoading: boolean;
    t: TFunction;
    language: Language;
}

// Check for SpeechRecognition API
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, t, language }) => {
    const [text, setText] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any | null>(null);

    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [text]);

    const handleSend = () => {
        if (isLoading || (!text.trim() && images.length === 0)) return;
        onSend({ text: text.trim(), images });
        setText('');
        setImages([]);
        setImagePreviews([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]);
            return newPreviews;
        });
    };

    const handleMicClick = useCallback(() => {
        if (!SpeechRecognition) {
            setError(t('chat_error_unsupported'));
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';

        let finalTranscript = '';
        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setText(text + finalTranscript + interimTranscript);
        };
        
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
        setIsRecording(true);

    }, [isRecording, language, t, text]);

    const canSend = !isLoading && (text.trim().length > 0 || images.length > 0);

    return (
        <div className="flex flex-col gap-2">
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {imagePreviews.length > 0 && (
                <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg overflow-x-auto">
                    {imagePreviews.map((src, index) => (
                        <div key={index} className="relative flex-shrink-0 w-16 h-16">
                            <img src={src} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md" />
                            <button onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                                <XIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-gray-700/50">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    title={t('chat_attach_file')}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <PaperclipIcon />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                />
                 <button
                    onClick={handleMicClick}
                    title={isRecording ? t('chat_stop_recording') : t('chat_record_audio')}
                    className={`p-2 rounded-full transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                    {isRecording ? <StopCircleIcon/> : <MicrophoneIcon />}
                </button>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isRecording ? t('chat_listening') : t('chat_placeholder')}
                    rows={1}
                    className="flex-grow bg-transparent focus:outline-none resize-none max-h-[200px] text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    dir="auto"
                />
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className="p-2 rounded-full bg-brand-accent text-white transition-colors disabled:bg-brand-accent/50 disabled:cursor-not-allowed"
                >
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};