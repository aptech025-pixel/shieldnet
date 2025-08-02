
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Globe, PlusCircle, Trash2, Link as LinkIcon, Search, Loader2, BarChart, Shield, ListChecks } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { analyzeWebsiteAction } from '@/app/actions';
import type { AnalyzeWebsiteOutput } from '@/ai/schemas';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';


const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type FormValues = z.infer<typeof formSchema>;

type MonitoredService = {
  id: string;
  url: string;
};

const initialServices: MonitoredService[] = [
    { id: '1', url: 'https://mrfarm.free.nf' },
    { id: '2', url: 'https://www.9jadevs.free.nf' },
    { id: '3', url: 'https://apojtech.free.nf' },
];

const AnalysisSkeleton = () => (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row justify-around text-center gap-4">
        <div className="space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-8 w-16 mx-auto" />
        </div>
         <div className="space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-8 w-16 mx-auto" />
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );


export function MonitoredServicesManager() {
  const [services, setServices] = useState<MonitoredService[]>(initialServices);
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<MonitoredService | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeWebsiteOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (services.some(service => service.url === data.url)) {
        toast({
            variant: "destructive",
            title: "Duplicate URL",
            description: "This website is already in your monitoring list.",
        });
        return;
    }

    const newService: MonitoredService = {
      id: new Date().toISOString(),
      url: data.url,
    };
    setServices(prev => [...prev, newService]);
    form.reset();
    toast({
        title: "Website Added",
        description: `${data.url} is now being monitored.`,
    })
  };

  const removeService = (id: string) => {
    const serviceToRemove = services.find(s => s.id === id);
    setServices(prev => prev.filter(service => service.id !== id));
     toast({
        title: "Website Removed",
        description: `${serviceToRemove?.url} is no longer being monitored.`,
    })
  };
  
  const handleAnalyzeClick = async (service: MonitoredService) => {
    setSelectedService(service);
    setIsLoadingAnalysis(true);
    setAnalysis(null);
    try {
      const result = await analyzeWebsiteAction({ url: service.url });
      setAnalysis(result);
    } catch (error) {
      console.error("Failed to get website analysis:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not retrieve analysis for this website.",
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Globe /> Monitored Websites
        </CardTitle>
        <CardDescription>
          Add websites to track on your dashboard and run on-demand security analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://example.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="pt-2" />
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 space-y-3">
             <h4 className="text-sm font-medium text-muted-foreground">Currently Monitoring</h4>
             <AnimatePresence>
                {services.length > 0 ? services.map((service) => (
                    <motion.div
                        key={service.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        className="flex items-center justify-between rounded-lg border p-3 pl-4"
                    >
                        <Link href={service.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline truncate pr-4">
                            {service.url.replace(/^https?:\/\//, '')}
                        </Link>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleAnalyzeClick(service)}>
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Analyze {service.url}</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeService(service.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Remove {service.url}</span>
                            </Button>
                        </div>
                    </motion.div>
                )) : (
                    <p className="text-sm text-muted-foreground text-center py-4">You are not monitoring any websites yet.</p>
                )}
             </AnimatePresence>
        </div>
      </CardContent>
    </Card>

    <Dialog open={!!selectedService} onOpenChange={(isOpen) => !isOpen && setSelectedService(null)}>
        <DialogContent className="sm:max-w-2xl grid-rows-[auto,minmax(0,1fr),auto] max-h-[90svh]">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline flex items-center gap-2">
                  AI Security Analysis
                </DialogTitle>
                <DialogDescription>
                  Results for <span className="font-semibold text-primary">{selectedService.url}</span>
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="pr-6 -mr-6">
                <div className="py-4">
                    {isLoadingAnalysis && <AnalysisSkeleton />}
                    
                    {analysis && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-around text-center gap-4 p-4 bg-muted rounded-lg">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Security Score</h4>
                                    <p className="text-3xl font-bold text-primary">{analysis.securityScore}/100</p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <h4 className="text-sm font-medium text-muted-foreground">Performance Grade</h4>
                                    <p className="text-3xl font-bold text-primary">{analysis.performanceGrade}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2"><Shield /> Vulnerability Summary</h4>
                            <p className="text-sm text-muted-foreground">{analysis.vulnerabilitySummary}</p>
                            </div>
                            <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><ListChecks /> AI Recommendations</h4>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                {analysis.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                            </ul>
                            </div>
                        </div>
                    )}
                </div>
              </ScrollArea>
              
              <DialogFooter>
                <Button onClick={() => setSelectedService(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
