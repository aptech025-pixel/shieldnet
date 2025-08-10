
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generatePhishingCampaignAction } from '@/app/actions';
import type { GeneratePhishingCampaignOutput } from '@/ai/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Lightbulb, BarChart2, Repeat, Siren, AlertTriangle, ShieldCheck, ListChecks, Mail, FileText, Wand2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

const formSchema = z.object({
  templateType: z.enum(['password-reset', 'document-shared', 'invoice-payment', 'hr-policy-update', 'new-device-login'], {
    required_error: "You need to select an email template.",
  }),
  targets: z.string().min(1, 'Please enter at least one email address.')
    .refine(value => {
        const emails = value.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean);
        return emails.every(email => z.string().email().safeParse(email).success);
    }, 'Please ensure all entries are valid email addresses.'),
});

type FormValues = z.infer<typeof formSchema>;
type CampaignStage = 'setup' | 'running' | 'results';

const templates = [
    { value: 'password-reset', label: 'Password Reset Alert', icon: <Siren className="w-4 h-4 text-destructive" /> },
    { value: 'document-shared', label: 'Document Shared Notification', icon: <FileText className="w-4 h-4 text-blue-500" /> },
    { value: 'invoice-payment', label: 'Urgent Invoice Payment', icon: <Siren className="w-4 h-4 text-orange-500" /> },
    { value: 'hr-policy-update', label: 'HR Policy Update', icon: <FileText className="w-4 h-4 text-gray-500" /> },
    { value: 'new-device-login', label: 'New Device Login Alert', icon: <Siren className="w-4 h-4 text-yellow-500" /> },
];

const RiskBadge = ({ risk }: { risk: string }) => {
    switch (risk) {
        case 'Critical':
            return <Badge variant="destructive" className="capitalize"><Siren className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        case 'High':
            return <Badge className="bg-orange-500 text-white hover:bg-orange-500/80 capitalize"><AlertTriangle className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        case 'Medium':
            return <Badge className="bg-yellow-500 text-black hover:bg-yellow-500/80 capitalize"><ShieldCheck className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        case 'Low':
            return <Badge variant="secondary" className="capitalize"><ShieldCheck className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        default:
            return <Badge variant="outline" className="capitalize">{risk}</Badge>;
    }
};

export function PhishingSimulator() {
  const [stage, setStage] = useState<CampaignStage>('setup');
  const [campaignData, setCampaignData] = useState<GeneratePhishingCampaignOutput | null>(null);
  const [simulation, setSimulation] = useState({ targets: 0, clicked: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setStage('running');

    const targetEmails = data.targets.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean);
    const targetCount = targetEmails.length;
    
    // Simulate some users clicking the link (30% to 70% chance per user)
    const clickedCount = targetEmails.filter(() => Math.random() > (Math.random() * 0.4 + 0.3)).length;

    setSimulation({ targets: targetCount, clicked: clickedCount });
    
    try {
      const result = await generatePhishingCampaignAction({
          templateType: data.templateType,
          targetCount: targetCount,
          clickedCount: clickedCount
      });
      setCampaignData(result);
      
      // Simulate campaign running time
      setTimeout(() => {
          setStage('results');
          setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error("Phishing campaign generation failed:", error);
      toast({
        variant: "destructive",
        title: "Campaign Failed",
        description: "Could not generate the campaign content. Please try again.",
      });
      setIsLoading(false);
      setStage('setup');
    }
  };

  const startNewCampaign = () => {
      setStage('setup');
      setCampaignData(null);
      form.reset();
  }

  const clickThroughRate = useMemo(() => {
      if (simulation.targets === 0) return 0;
      return (simulation.clicked / simulation.targets) * 100;
  }, [simulation]);

  if (stage === 'running') {
      return (
          <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <CardTitle className="font-headline">Launching Campaign...</CardTitle>
              <CardDescription>
                  The simulated phishing emails are being sent.
                  <br />
                  Please wait while we collect the results.
              </CardDescription>
          </Card>
      )
  }

  if (stage === 'results' && campaignData) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2"><BarChart2 /> Campaign Results</CardTitle>
                  <CardDescription>Review the simulation results and the AI-generated debrief below.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Results */}
                    <div className="space-y-4 p-4 border rounded-lg">
                         <h3 className="font-semibold">Simulation Stats</h3>
                         <div className="space-y-3 text-sm">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span>Emails Sent</span>
                                    <span>{simulation.targets}</span>
                                </div>
                                <Progress value={100} />
                            </div>
                             <div>
                                <div className="flex justify-between mb-1">
                                    <span>Links Clicked</span>
                                    <span>{simulation.clicked}</span>
                                </div>
                                <Progress value={clickThroughRate} className="[&>div]:bg-destructive" />
                            </div>
                         </div>
                         <Separator />
                         <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold">Click-Through Rate:</span>
                            <span className="font-bold text-lg text-destructive">{clickThroughRate.toFixed(1)}%</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold">Team Risk Level:</span>
                            <RiskBadge risk={campaignData.riskLevel} />
                         </div>
                    </div>
                    {/* Debrief */}
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-primary"/> AI-Powered Debrief</h3>
                        <div>
                            <p className="text-sm font-semibold mb-1">Key Takeaways</p>
                            <p className="text-sm text-muted-foreground">{campaignData.keyTakeaways}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2"><ListChecks /> Training Recommendations</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {campaignData.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                <Separator />
                
                <div>
                     <h3 className="font-semibold mb-2 flex items-center gap-2"><Mail /> Email Template Used</h3>
                     <div className="border rounded-lg p-4 bg-muted/20 space-y-2">
                        <p className="text-sm"><strong>Subject:</strong> {campaignData.subject}</p>
                        <Separator />
                        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: campaignData.body }} />
                     </div>
                </div>

              </CardContent>
              <CardFooter>
                 <Button onClick={startNewCampaign}>
                    <Repeat className="mr-2 h-4 w-4" />
                    Start New Campaign
                 </Button>
              </CardFooter>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wand2 /> New Phishing Simulation
        </CardTitle>
        <CardDescription>
          Select a template and define your targets to launch a simulated phishing campaign.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="templateType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1. Select Email Template</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a realistic phishing scenario..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates.map(template => (
                            <SelectItem key={template.value} value={template.value}>
                              <div className="flex items-center gap-2">
                                {template.icon}
                                <span>{template.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2. Enter Target Email Addresses</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter emails separated by commas, semicolons, or new lines. e.g., employee1@company.com, employee2@company.com"
                      className="min-h-[150px] font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Generating...' : 'Launch Simulated Campaign'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
