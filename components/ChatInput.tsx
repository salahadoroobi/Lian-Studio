import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import type { TFunction, Language } from '../hooks/useLocalization';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SendIcon } from './icons/SendIcon';
import { XIcon } from './icons/XIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';
import { useDropzone } from 'react-dropzone';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface ChatInputProps {
    onSend: (message: { text: string, files?: File[] }) => void;
    isLoading: boolean;
    t: TFunction;
    language: Language;
}

// Check for SpeechRecognition API
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, t, language }) => {
    const [text, setText] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<{name: string, type: 'image' | 'other', url: string}[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
    const [userHasInteracted, setUserHasInteracted] = useState(false);

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
    
    useEffect(() => {
        const placeholderTexts = [
            t('chat_placeholder_1'),
            t('chat_placeholder_2'),
            t('chat_placeholder_3'),
            t('chat_placeholder_4'),
        ];
        const TYPING_SPEED = 100;
        const DELETING_SPEED = 50;
        const DELAY_BETWEEN_TEXTS = 2000;

        if (userHasInteracted || isRecording) {
            setAnimatedPlaceholder(''); // Clear animated placeholder on interaction
            return;
        }

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeoutId: number;

        const type = () => {
            const currentText = placeholderTexts[textIndex];
            if (isDeleting) {
                setAnimatedPlaceholder(currentText.substring(0, charIndex - 1));
                charIndex--;
            } else {
                setAnimatedPlaceholder(currentText.substring(0, charIndex + 1));
                charIndex++;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                timeoutId = window.setTimeout(type, DELAY_BETWEEN_TEXTS);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % placeholderTexts.length;
                timeoutId = window.setTimeout(type, TYPING_SPEED);
            } else {
                timeoutId = window.setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
            }
        };

        const startTimeout = window.setTimeout(type, 500);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(startTimeout);
        };
    }, [userHasInteracted, isRecording, t]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFiles(prev => [...prev, ...acceptedFiles]);
            const newPreviews = acceptedFiles.map(file => ({
                name: file.name,
                // Fix: Cast the result of the ternary operator to the correct literal type to prevent type widening to 'string'.
                type: (file.type.startsWith('image/') ? 'image' : 'other') as 'image' | 'other',
                url: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
            }));
            setFilePreviews(prev => [...prev, ...newPreviews]);
            if (!userHasInteracted) {
                setUserHasInteracted(true);
            }
        }
    }, [userHasInteracted]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
          'image/*': [],
          'video/*': [],
          'audio/*': [],
          'application/pdf': [],
          'application/msword': [],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
          'text/*': ['.txt', '.md', '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.java', '.c', '.cpp', '.h', '.cs', '.sql', '.sh', '.json', '.xml'],
          'application/zip': [],
          'application/vnd.ms-excel': [],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
          'application/vnd.ms-powerpoint': [],
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
        },
        noClick: true,
        noKeyboard: true,
    });


    const handleSend = () => {
        if (isLoading || (!text.trim() && files.length === 0)) return;
        onSend({ text: text.trim(), files });
        setText('');
        setFiles([]);
        setFilePreviews([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(file => ({
                name: file.name,
                // Fix: Cast the result of the ternary operator to the correct literal type to prevent type widening to 'string'.
                type: (file.type.startsWith('image/') ? 'image' : 'other') as 'image' | 'other',
                url: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
            }));
            setFilePreviews(prev => [...prev, ...newPreviews]);
             if (!userHasInteracted) {
                setUserHasInteracted(true);
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFilePreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            const previewToRemove = prev[index];
            if (previewToRemove.type === 'image' && previewToRemove.url) {
                URL.revokeObjectURL(previewToRemove.url);
            }
            return newPreviews;
        });
    };

    const handleMicClick = useCallback(() => {
        if (!userHasInteracted) {
            setUserHasInteracted(true);
        }

        if (!SpeechRecognition) {
            setError(t('chat_error_unsupported'));
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
            return; // onend will handle the state changes
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';

        const textBeforeRecording = textareaRef.current?.value || '';

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            // Rebuild the full transcript from the beginning of the results list
            for (let i = 0; i < event.results.length; ++i) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPart;
                } else {
                    interimTranscript += transcriptPart;
                }
            }
            // A space is added only if there was text before.
            const prefix = textBeforeRecording ? textBeforeRecording.trim() + ' ' : '';
            setText(prefix + finalTranscript + interimTranscript);
        };

        recognition.onerror = (event: any) => {
            // "aborted" can happen if the user stops the recording.
            // "no-speech" can happen if the user is silent.
            // Both are not really errors we need to show the user.
            if (event.error !== 'aborted' && event.error !== 'no-speech') {
                console.error("Speech recognition error:", event.error);
                setError(t('chat_error_unsupported')); // Show a generic error
                setTimeout(() => setError(null), 3000);
            }
        };

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onend = () => {
            setIsRecording(false);
            recognitionRef.current = null;
        };

        recognition.start();

    }, [language, t, userHasInteracted]);

    const canSend = !isLoading && (text.trim().length > 0 || files.length > 0);

    const placeholderText = isRecording 
        ? t('chat_listening') 
        : (userHasInteracted || text) 
            ? t('chat_placeholder') 
            : animatedPlaceholder;

    return (
        <div className="flex flex-col gap-2">
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {filePreviews.length > 0 && (
                <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg overflow-x-auto shadow-md">
                    {filePreviews.map((preview, index) => (
                        <div key={index} className="relative flex-shrink-0 w-16 h-16 group">
                             {preview.type === 'image' ? (
                                <img src={preview.url} alt={preview.name} title={preview.name} className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-md flex flex-col items-center justify-center p-1 text-center" title={preview.name}>
                                    <DocumentTextIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                    <span className="text-xs text-gray-600 dark:text-gray-300 truncate w-full mt-1">{preview.name}</span>
                                </div>
                            )}
                            <button onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <XIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div {...getRootProps()} className={`relative p-2 rounded-xl shadow-lg transition-colors duration-200 ${isDragActive ? 'ring-2 ring-dashed ring-brand-accent bg-brand-accent/10 dark:bg-brand-accent/20' : 'bg-gray-100 dark:bg-gray-700/50'}`}>
                <input {...getInputProps()} />
                
                {isDragActive && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-xl z-10 pointer-events-none">
                        <p className="text-lg font-bold text-brand-accent animate-pulse">{t('uploader_cta_title')}</p>
                    </div>
                )}
                
                <div className="flex items-center gap-2">
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
                        accept="image/*,video/*,audio/*,text/*,.md,.py,.js,.jsx,.ts,.tsx,.html,.css,.java,.c,.cpp,.h,.cs,.sql,.sh,.json,.xml,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip"
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
                        onChange={(e) => {
                            setText(e.target.value);
                            if (!userHasInteracted) {
                                setUserHasInteracted(true);
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholderText}
                        rows={1}
                        dir="auto"
                        className="flex-grow bg-transparent focus:outline-none resize-none max-h-[200px] text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-start"
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
        </div>
    );
};