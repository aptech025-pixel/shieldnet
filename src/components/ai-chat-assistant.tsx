
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
import { MessageCircle, Send, Loader2, Sparkles, User, Shield, ListChecks, MailWarning, ShieldAlert, KeyRound, Copy, ClipboardCheck } from "lucide-react";
import type { ChatMessage, AnalyzeWebsiteOutput, AnalyzeEmailOutput, DarkWebScanOutput, GeneratePasswordOutput, GenerateFirewallRulesOutput } from '@/ai/schemas';
import { chatAssistantAction } from '@/app/actions';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';


const RiskBadge = ({ risk }: { risk: string }) => {
    switch (risk) {
        case 'Critical':
            return <Badge variant="destructive" className="capitalize"><MailWarning className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        case 'High':
            return <Badge className="bg-orange-500 text-white hover:bg-orange-500/80 capitalize"><ShieldAlert className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        case 'Medium':
            return <Badge className="bg-yellow-500 text-black hover:bg-yellow-500/80 capitalize"><Shield className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        case 'Low':
            return <Badge variant="secondary" className="capitalize"><ListChecks className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        default:
            return <Badge>{risk}</Badge>;
    }
}

const WebsiteAnalysisResult = ({ result }: { result: AnalyzeWebsiteOutput }) => (
    <div className="p-3 rounded-lg bg-muted/50 border space-y-3 text-sm my-2">
         <div className="flex flex-col sm:flex-row justify-around text-center gap-2 p-2 bg-muted rounded-lg">
            <div>
                <h4 className="text-xs font-medium text-muted-foreground">Security Score</h4>
                <p className="text-2xl font-bold text-primary">{result.securityScore}/100</p>
            </div>
             <div className="mt-2 sm:mt-0">
                <h4 className="text-xs font-medium text-muted-foreground">Performance Grade</h4>
                <p className="text-2xl font-bold text-primary">{result.performanceGrade}</p>
            </div>
        </div>
        <Separator />
        <div>
            <p className="font-semibold text-xs mb-1 flex items-center gap-1"><Shield className="w-3 h-3" /> Vulnerability Summary</p>
            <p className="text-muted-foreground">{result.vulnerabilitySummary}</p>
        </div>
        <div>
            <p className="font-semibold text-xs mb-1 flex items-center gap-1"><ListChecks className="w-3 h-3" /> Recommendations</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
            </ul>
        </div>
    </div>
);

const EmailAnalysisResult = ({ result }: { result: AnalyzeEmailOutput }) => (
    <div className="p-3 rounded-lg bg-muted/50 border space-y-3 text-sm my-2">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold flex items-center gap-2"><MailWarning className="text-primary"/> Email Analysis</h4>
            <RiskBadge risk={result.riskLevel} />
        </div>
        <p className="text-muted-foreground italic">"{result.summary}"</p>
        {result.redFlags.length > 0 && (
             <div>
                <p className="font-semibold text-xs mb-1">Detected Red Flags</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {result.redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                </ul>
            </div>
        )}
        <div>
            <p className="font-semibold text-xs mb-1">Recommendation</p>
            <p className="text-muted-foreground">{result.recommendation}</p>
        </div>
    </div>
);

const DarkWebScanResult = ({ result }: { result: DarkWebScanOutput }) => (
    <div className="p-3 rounded-lg bg-muted/50 border space-y-3 text-sm my-2">
         <h4 className="font-semibold flex items-center gap-2"><ShieldAlert className="text-primary"/> Dark Web Scan Results</h4>
         <p className="text-muted-foreground italic">{result.summary}</p>
         {result.breaches.length > 0 ? (
            <div>
                 <p className="font-semibold text-xs mb-1">Found in {result.breaches.length} breach(es):</p>
                 <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {result.breaches.map((breach, i) => <li key={i}>{breach.source} ({breach.date})</li>)}
                </ul>
            </div>
         ) : (
             <p className="text-muted-foreground font-medium text-green-600">No breaches found for this email.</p>
         )}
          <div>
            <p className="font-semibold text-xs mb-1">Recommendations</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
            </ul>
        </div>
    </div>
);

const PasswordGeneratorResult = ({ result }: { result: GeneratePasswordOutput }) => {
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(result.password);
        setIsCopied(true);
        toast({ title: "Password Copied!" });
        setTimeout(() => setIsCopied(false), 2000);
    }
    return (
        <div className="p-3 rounded-lg bg-muted/50 border space-y-3 text-sm my-2">
            <h4 className="font-semibold flex items-center gap-2"><KeyRound className="text-primary"/> Secure Password Generated</h4>
            <div className="flex items-center gap-2">
                <Input readOnly value={result.password} className="font-mono text-xs bg-background"/>
                 <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    {isCopied ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
             <div>
                <p className="font-semibold text-xs mb-1">Strength Analysis</p>
                <p className="text-muted-foreground">{result.strengthAnalysis}</p>
            </div>
        </div>
    );
}

const FirewallRulesResult = ({ result }: { result: GenerateFirewallRulesOutput }) => (
    <div className="p-3 rounded-lg bg-muted/50 border space-y-3 text-sm my-2">
        <h4 className="font-semibold flex items-center gap-2"><Shield className="text-primary"/> Firewall Rules Generated</h4>
         <p className="text-xs text-muted-foreground">Here are the firewall rules generated based on your request.</p>
         <ScrollArea className="max-h-60 w-full">
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-xs">Action</TableHead>
                    <TableHead className="text-xs">Proto.</TableHead>
                    <TableHead className="text-xs">Source</TableHead>
                    <TableHead className="text-xs">Dest.</TableHead>
                    <TableHead className="text-xs">Port</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {result.rules.map((rule, i) => (
                    <TableRow key={i}>
                        <TableCell><Badge variant={rule.action === 'DENY' ? 'destructive' : 'default'}>{rule.action}</Badge></TableCell>
                        <TableCell>{rule.protocol}</TableCell>
                        <TableCell className="truncate max-w-20">{rule.source}</TableCell>
                        <TableCell className="truncate max-w-20">{rule.destination}</TableCell>
                        <TableCell>{rule.port}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </ScrollArea>
    </div>
)


export function AiChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Pre-load audio
        audioRef.current = new Audio('/sounds/chat-pop.mp3');
    }, []);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(error => console.error("Error playing sound:", error));
        }
    };


    useEffect(() => {
        if(isOpen && messages.length === 0) {
            // Add initial welcome message
            setMessages([
                { role: 'model', content: [{ text: 'Hello! I am the ShieldNet AI Assistant. I can help you analyze websites, check emails for phishing, generate secure passwords, create firewall rules, and more. How can I help you today?' }] }
            ]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        if (messages.length > 0) {
            // Don't play sound for initial message
            if (messages.length > 1) {
                playSound();
            }
        }

        // Scroll to the bottom when new messages are added
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: [{ text: input }] };
        const newMessages: ChatMessage[] = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatAssistantAction({
                messages: newMessages
            });
            setMessages(prev => [...prev, result.message]);
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
                                        "rounded-lg max-w-[90%]",
                                        message.role === 'user' 
                                            ? "bg-primary text-primary-foreground p-3" 
                                            : "bg-muted p-3"
                                    )}>
                                        {message.content.map((part, partIndex) => {
                                            if (part.text) {
                                                return <div key={partIndex} className="whitespace-pre-wrap">{part.text}</div>;
                                            }
                                            if (part.toolResponse) {
                                                switch(part.toolResponse.name) {
                                                    case 'analyzeWebsite':
                                                        return <WebsiteAnalysisResult key={partIndex} result={part.toolResponse.output as AnalyzeWebsiteOutput} />;
                                                    case 'analyzeEmail':
                                                        return <EmailAnalysisResult key={partIndex} result={part.toolResponse.output as AnalyzeEmailOutput} />;
                                                     case 'darkWebScan':
                                                        return <DarkWebScanResult key={partIndex} result={part.toolResponse.output as DarkWebScanOutput} />;
                                                    case 'generatePassword':
                                                        return <PasswordGeneratorResult key={partIndex} result={part.toolResponse.output as GeneratePasswordOutput} />;
                                                    case 'generateFirewallRules':
                                                        return <FirewallRulesResult key={partIndex} result={part.toolResponse.output as GenerateFirewallRulesOutput} />;
                                                    default:
                                                        return <p key={partIndex}>Tool response received.</p>;
                                                }
                                            }
                                            return null;
                                        })}
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
                                placeholder="Ask me to generate a password, analyze a URL..."
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
