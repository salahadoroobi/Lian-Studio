import React, { useState, useEffect, useRef } from 'react';
import type { TFunction, Language } from '../hooks/useLocalization';
import type { InitialChatMessage, View } from '../App';
import { getAi, fileToGenerativePart } from '../services/geminiService';
import { ChatInput } from '../components/ChatInput';
import { ChatBubble } from '../components/ChatBubble';
import { Chat } from '@google/genai';

interface ChatViewProps {
  initialMessage: InitialChatMessage | null;
  t: TFunction;
  language: Language;
  setView: (view: View) => void;
}

interface Message {
    role: 'user' | 'model';
    text: string;
    images?: string[]; // data URLs
}

export const ChatView: React.FC<ChatViewProps> = ({ initialMessage, t, language, setView }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const initializeChat = async (firstMessage: InitialChatMessage) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const ai = getAi();
            // Using a model that supports multi-turn chat and images
            chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash' });

            const userMessage: Message = { role: 'user', text: firstMessage.text, images: [] };
            if (firstMessage.images) {
                userMessage.images = firstMessage.images.map(file => URL.createObjectURL(file));
            }
            setMessages([userMessage]);

            // Fix: Explicitly type `parts` as `any[]` to allow both text and image parts, fixing the type error on `parts.push`.
            const parts: any[] = [{ text: firstMessage.text }];
            if (firstMessage.images) {
                for (const image of firstMessage.images) {
                    parts.push(await fileToGenerativePart(image));
                }
            }
            
            // Fix: Call `sendMessage` with a `{ message: parts }` object, as it expects a `message` property, not `parts`.
            const result = await chatRef.current.sendMessage({ message: parts });
            
            const modelMessage: Message = { role: 'model', text: result.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialMessage) {
            initializeChat(initialMessage);
        } else {
            // If there's no initial message, maybe go back to landing?
            setView('landing');
        }
    }, [initialMessage]);


    const handleSend = async (message: { text: string, images?: File[] }) => {
        if (!chatRef.current) {
            setError("Chat is not initialized.");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        const userMessage: Message = { role: 'user', text: message.text, images: [] };
        if (message.images) {
            userMessage.images = message.images.map(file => URL.createObjectURL(file));
        }
        
        setMessages(prev => [...prev, userMessage]);

        try {
            // Fix: Explicitly type `parts` as `any[]` to allow both text and image parts, fixing the type error on `parts.push`.
            const parts: any[] = [{ text: message.text }];
            if (message.images) {
                for (const image of message.images) {
                    parts.push(await fileToGenerativePart(image));
                }
            }

            // Fix: Call `sendMessage` with a `{ message: parts }` object, as it expects a `message` property, not `parts`.
            const result = await chatRef.current.sendMessage({ message: parts });
            const modelMessage: Message = { role: 'model', text: result.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-140px)] w-full max-w-4xl mx-auto p-4">
            <div className="flex-grow overflow-y-auto pr-4 space-y-6">
                {messages.map((msg, index) => (
                    <ChatBubble key={index} role={msg.role} text={msg.text} images={msg.images} language={language} />
                ))}
                 {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                    <ChatBubble role="model" text="" isLoading={true} language={language} />
                 )}
                 {error && (
                    <div className="text-center text-red-500 p-4 bg-red-500/10 rounded-lg">
                        <p className="font-bold">{t('error_title')}</p>
                        <p className="text-sm">{error}</p>
                    </div>
                 )}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-4">
                <ChatInput onSend={handleSend} isLoading={isLoading} t={t} language={language} />
            </div>
        </div>
    );
};
