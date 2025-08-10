
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { analyzeEmailAction } from '@/app/actions';
import type { AnalyzeEmailOutput } from '@/ai/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MailWarning, ShieldQuestion, AlertTriangle, Shield, CheckCircle, ShieldCheck, Siren } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
  emailContent: z.string().min(50, {
    message: "Please paste at least 50 characters of email content for an effective analysis.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const RiskBadge = ({ risk }: { risk: string }) => {
    switch (risk) {
        case 'Critical':
            return <Badge variant="destructive" className="capitalize"><Siren className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        case 'High':
            return <Badge className="bg-orange-500 text-white hover:bg-orange-500/80 capitalize"><AlertTriangle className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        case 'Medium':
            return <Badge className="bg-yellow-500 text-black hover:bg-yellow-500/80 capitalize"><Shield className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        case 'Low':
            return <Badge variant="secondary" className="capitalize"><ShieldCheck className="inline-block mr-1 h-3 w-3" /> {risk}</Badge>;
        default:
            return <Badge variant="outline" className="capitalize">{risk}</Badge>;
    }
};

export function EmailAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeEmailOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailContent: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeEmailAction(data);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Email analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing the email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <MailWarning /> AI Phishing Email Analyzer
        </CardTitle>
        <CardDescription>
          Received a suspicious email? Paste its content below to check for common phishing red flags.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="emailContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the full email content here, including headers if possible."
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
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Email...
                </>
              ) : (
                <>
                    <ShieldQuestion className="mr-2 h-4 w-4" />
                    Analyze for Phishing
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      <AnimatePresence>
        {analysisResult && (
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
            >
                <CardContent className="pt-6 space-y-4 border-t">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <h3 className="text-lg font-semibold font-headline">Analysis Result</h3>
                        <RiskBadge risk={analysisResult.riskLevel} />
                    </div>
                    
                    <div className="p-3 bg-muted rounded-md space-y-1">
                         <p className="text-sm font-semibold">{analysisResult.summary}</p>
                         <p className="text-sm text-muted-foreground">{analysisResult.recommendation}</p>
                    </div>


                    {analysisResult.redFlags.length > 0 && (
                        <div className="space-y-2">
                        <h4 className="font-semibold">Detected Red Flags:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {analysisResult.redFlags.map((flag, index) => (
                            <li key={index}>{flag}</li>
                            ))}
                        </ul>
                        </div>
                    )}
                </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
