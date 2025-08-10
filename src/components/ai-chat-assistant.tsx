
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Loader2, Sparkles, User, Shield } from "lucide-react";
import type { ChatMessage } from '@/ai/schemas';
import { chatAssistantAction } from '@/app/actions';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';


export function AiChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if(isOpen && messages.length === 0) {
            // Add initial welcome message
            setMessages([
                { role: 'model', content: 'Hello! I am the ShieldNet AI Assistant. How can I help you today? You can ask me about the app\'s features or general cybersecurity topics.' }
            ]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        // Scroll to the bottom when new messages are added
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatAssistantAction({
                messages: [...messages, userMessage],
                userRequest: input,
            });
            const modelMessage: ChatMessage = { role: 'model', content: result.response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'The AI assistant is currently unavailable. Please try again later.'
            });
            // remove the user message if the API fails
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <motion.div
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Button size="icon" className="rounded-full h-14 w-14 shadow-lg" onClick={() => setIsOpen(true)}>
                    <Sparkles className="h-6 w-6" />
                    <span className="sr-only">Open AI Chat Assistant</span>
                </Button>
            </motion.div>
        
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-lg grid-rows-[auto,1fr,auto] p-0 max-h-[90dvh]">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle className="font-headline flex items-center gap-2">
                           <Sparkles className="text-primary" /> ShieldNet AI Assistant
                        </DialogTitle>
                        <DialogDescription>
                            Your guide to network security and this app.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <ScrollArea className="h-[50vh]" ref={scrollAreaRef}>
                        <div className="p-4 space-y-4">
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={cn(
                                        "flex items-start gap-3 text-sm",
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {message.role === 'model' && (
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-primary" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "p-3 rounded-lg max-w-[80%]",
                                        message.role === 'user' 
                                            ? "bg-primary text-primary-foreground" 
                                            : "bg-muted"
                                    )}>
                                        {message.content}
                                    </div>
                                     {message.role === 'user' && (
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3 text-sm justify-start"
                                >
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted flex items-center">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        </div>
                    </ScrollArea>
                    
                    <DialogFooter className="p-4 border-t">
                        <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
                            <Input 
                                placeholder="Ask about a feature..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                <span className="sr-only">Send message</span>
                            </Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
