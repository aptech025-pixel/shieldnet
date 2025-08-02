
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Menu, Wand2, Loader2, Send, CheckCircle, ArrowLeft, BrainCircuit, ListChecks, Activity, Tag } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { generateItReportAction } from '@/app/actions';
import type { GenerateItReportOutput } from '@/ai/schemas';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const reportFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
});

type FormValues = z.infer<typeof reportFormSchema>;

type ReportStage = 'form' | 'review' | 'submitted';

const PriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'Critical':
      return <Badge variant="destructive">{priority}</Badge>;
    case 'High':
      return <Badge className="bg-orange-500 text-white hover:bg-orange-500/80">{priority}</Badge>;
    case 'Medium':
      return <Badge className="bg-yellow-500 text-black hover:bg-yellow-500/80">{priority}</Badge>;
    case 'Low':
      return <Badge variant="secondary">{priority}</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};


export default function ReportPage() {
  const [stage, setStage] = useState<ReportStage>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<GenerateItReportOutput | null>(null);
  const { toggleSidebar } = useSidebar();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: { name: '', email: '', subject: '', description: '' },
  });

  const onGenerate = async (values: FormValues) => {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await generateItReportAction(values);
      setReport(result);
      setStage('review');
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing your report. Please try again.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSendReport = () => {
    if (!report) return;
    
    setIsLoading(true);
    const mailtoLink = `mailto:it-support@shieldnet.io?subject=${encodeURIComponent(
      report.generatedSubject
    )}&body=${encodeURIComponent(
      report.generatedBody
    )}`;

    // Simulate sending report
    setTimeout(() => {
        setIsLoading(false);
        setStage('submitted');
        form.reset(); 
    }, 1000);
     
    // This could be used to open the user's email client
    // window.location.href = mailtoLink;
  };

  const handleBack = () => {
    setStage('form');
    setReport(null);
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between space-y-2 flex-wrap">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
             <Menu />
             <span className="sr-only">Toggle sidebar</span>
           </Button>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">IT Support</h2>
        </div>
      </div>
      
       <AnimatePresence mode="wait">
        <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {stage === 'form' && (
                <Card>
                    <CardHeader>
                    <CardTitle className="font-headline">Submit an IT Report</CardTitle>
                    <CardDescription>
                        Experiencing an issue? Fill out the form below. Our AI will analyze your report, assign priority, and suggest troubleshooting steps.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} disabled={isLoading} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl><Input placeholder="john.doe@example.com" {...field} disabled={isLoading} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl><Input placeholder="e.g., Unable to access analytics dashboard" {...field} disabled={isLoading} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Please describe the issue in detail</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Describe the steps you took, what you expected to happen, and what actually happened. Include any error messages."
                                className="min-h-[150px]"
                                {...field}
                                disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            {isLoading ? 'Analyzing...' : 'Generate & Review Report'}
                        </Button>
                        </form>
                    </Form>
                    </CardContent>
                </Card>
            )}

            {stage === 'review' && report && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Review AI-Generated Report</CardTitle>
                        <CardDescription>
                            Please review the AI's analysis and troubleshooting steps below before submitting the report to IT.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                            <h3 className="font-semibold flex items-center gap-2"><BrainCircuit className="text-primary" /> AI Triage Analysis</h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-muted-foreground" /> <strong>Category:</strong> <Badge variant="outline">{report.category}</Badge></div>
                                <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-muted-foreground" /> <strong>Priority:</strong> <PriorityBadge priority={report.priority} /></div>
                            </div>
                       </div>
                       <div className="space-y-4 p-4 border rounded-lg">
                            <h3 className="font-semibold flex items-center gap-2"><ListChecks className="text-primary" /> Suggested Troubleshooting</h3>
                            <p className="text-sm text-muted-foreground">Before submitting, you might want to try these steps:</p>
                            <ul className="list-decimal pl-5 space-y-2 text-sm">
                                {report.troubleshootingSteps.map((step, index) => <li key={index}>{step}</li>)}
                            </ul>
                        </div>
                        <Separator />
                        <h3 className="font-semibold">Final Report for Submission</h3>
                        <div className="space-y-2 p-4 border rounded-lg bg-muted/20">
                            <h4 className="font-bold text-lg">{report.generatedSubject}</h4>
                            <p className="whitespace-pre-wrap text-sm">{report.generatedBody}</p>
                        </div>
                    </CardContent>
                    <CardContent className="flex justify-between">
                         <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
                        </Button>
                        <Button onClick={handleSendReport} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Submit to IT
                        </Button>
                    </CardContent>
                </Card>
            )}

            {stage === 'submitted' && (
                 <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full h-16 w-16 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="font-headline mt-4">Report Submitted Successfully</CardTitle>
                        <CardDescription>
                            Your IT support ticket has been sent. The IT department will get back to you shortly. You can now safely leave this page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button onClick={() => setStage('form')}>
                            Create Another Report
                        </Button>
                    </CardContent>
                </Card>
            )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
