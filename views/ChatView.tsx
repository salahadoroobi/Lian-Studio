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
    id: string;
    role: 'user' | 'model';
    text: string;
    files?: {name: string, type: 'image' | 'other', url: string}[];
    isLoading?: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({ initialMessage, t, language, setView }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    
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

            const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', text: firstMessage.text, files: [] };
            if (firstMessage.files) {
                userMessage.files = firstMessage.files.map(file => ({
                    name: file.name,
                    type: file.type.startsWith('image/') ? 'image' : 'other',
                    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
                }));
            }
            setMessages([userMessage]);

            let fullPromptText = firstMessage.text;
            const mediaParts = [];

            if (firstMessage.files) {
                for (const file of firstMessage.files) {
                    const isTextBased = file.type.startsWith('text/') || 
                                      file.type.includes('json') || 
                                      file.type.includes('javascript') ||
                                      // This regex covers all the text types from ChatInput
                                      /\.(txt|md|py|js|jsx|ts|tsx|html|css|java|c|cpp|h|cs|sql|sh|json|xml)$/i.test(file.name);

                    if (isTextBased) {
                        const fileContent = await file.text();
                        fullPromptText += `\n\n--- Attached File: ${file.name} ---\n${fileContent}\n--- End of File ---`;
                    } else {
                        // For non-text files, use fileToGenerativePart
                        mediaParts.push(await fileToGenerativePart(file));
                    }
                }
            }
            
            const parts = [{ text: fullPromptText }, ...mediaParts];
            
            const result = await chatRef.current.sendMessage({ message: parts });
            
            const modelMessage: Message = { id: `model-${Date.now()}`, role: 'model', text: result.text };
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


    const handleSend = async (message: { text: string, files?: File[] }) => {
        if (!chatRef.current) {
            setError("Chat is not initialized.");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', text: message.text, files: [] };
        if (message.files) {
            userMessage.files = message.files.map(file => ({
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'other',
                url: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
            }));
        }
        
        setMessages(prev => [...prev, userMessage]);

        try {
            let fullPromptText = message.text;
            const mediaParts = [];

            if (message.files) {
                for (const file of message.files) {
                     const isTextBased = file.type.startsWith('text/') || 
                                      file.type.includes('json') || 
                                      file.type.includes('javascript') ||
                                      /\.(txt|md|py|js|jsx|ts|tsx|html|css|java|c|cpp|h|cs|sql|sh|json|xml)$/i.test(file.name);

                    if (isTextBased) {
                        const fileContent = await file.text();
                        fullPromptText += `\n\n--- Attached File: ${file.name} ---\n${fileContent}\n--- End of File ---`;
                    } else {
                        mediaParts.push(await fileToGenerativePart(file));
                    }
                }
            }

            const parts = [{ text: fullPromptText }, ...mediaParts];

            const result = await chatRef.current.sendMessage({ message: parts });
            const modelMessage: Message = { id: `model-${Date.now()}`, role: 'model', text: result.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateMessage = async (messageId: string, newText: string) => {
        const originalMessages = messages; // Keep a reference to revert on error
        const messageIndex = originalMessages.findIndex(m => m.id === messageId);
        if (messageIndex === -1 || originalMessages[messageIndex].role !== 'user') {
            return;
        }
    
        const modelResponseIndex = messageIndex + 1;
    
        // Scenario 1: Editing the last message, or a message not followed by a model response.
        // In this case, we truncate the history and resend.
        if (modelResponseIndex >= originalMessages.length || originalMessages[modelResponseIndex].role !== 'model') {
            setIsLoading(true);
            setError(null);
            setEditingMessageId(null);
            
            const historySlice = originalMessages.slice(0, messageIndex);
            setMessages(historySlice); // Visually remove the message to be edited and anything after.
    
            try {
                const ai = getAi();
                const historyForApi = historySlice.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
                chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash', history: historyForApi });
                // handleSend will add the new user message and get the new model response.
                await handleSend({ text: newText }); 
            } catch (e: any) {
                setError(e.message || 'An unexpected error occurred.');
                setMessages(originalMessages); // Revert on error
                setIsLoading(false);
            }
            return;
        }
    
        // Scenario 2: Editing a message in the middle of the conversation.
        // We will replace the message and its direct response, leaving subsequent messages.
        setEditingMessageId(null);
    
        // Immediately update UI to show the edited text and a loading state for the response
        setMessages(currentMessages =>
            currentMessages.map((msg, index) => {
                if (index === messageIndex) {
                    return { ...msg, text: newText };
                }
                if (index === modelResponseIndex) {
                    return { ...msg, text: '', isLoading: true };
                }
                return msg;
            })
        );
    
        try {
            const ai = getAi();
            // Create history from messages *before* the one being edited
            const historyForApi = originalMessages.slice(0, messageIndex).map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));
    
            const tempChat = ai.chats.create({ model: 'gemini-2.5-flash', history: historyForApi });
            const result = await tempChat.sendMessage({ message: [{ text: newText }] });
    
            // Update the model response with the new text and remove the loading state
            setMessages(currentMessages =>
                currentMessages.map((msg, index) => {
                    if (index === modelResponseIndex) {
                        return { ...msg, text: result.text, isLoading: false };
                    }
                    return msg;
                })
            );
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
            // On error, revert the changes back to the original state before the edit attempt
            setMessages(originalMessages);
        }
    };

    return (
        <div className="flex flex-col flex-grow w-full max-w-4xl mx-auto p-4">
            <div className="flex-grow overflow-y-auto pr-4">
                <div className="flex flex-col justify-end min-h-full space-y-6">
                    {messages.map((msg) => {
                        return (
                            <ChatBubble
                                key={msg.id}
                                id={msg.id}
                                role={msg.role}
                                text={msg.text}
                                files={msg.files}
                                language={language}
                                t={t}
                                isLoading={msg.isLoading}
                                isEditing={editingMessageId === msg.id}
                                onSetEditing={setEditingMessageId}
                                onUpdateMessage={handleUpdateMessage}
                            />
                        );
                    })}
                     {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                        <ChatBubble id="loading-bubble" role="model" text="" isLoading={true} language={language} t={t} />
                     )}
                     {error && (
                        <div className="text-center text-red-500 p-4 bg-red-500/10 rounded-lg">
                            <p className="font-bold">{t('error_title')}</p>
                            <p className="text-sm">{error}</p>
                        </div>
                     )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="mt-4">
                <ChatInput onSend={handleSend} isLoading={isLoading} t={t} language={language} />
            </div>
        </div>
    );
};
