"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeNetworkLogsAction } from '@/app/actions';
import type { AnalyzeNetworkLogsOutput } from '@/ai/flows/analyze-network-logs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Shield, CheckCircle, List, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  networkLogs: z.string().min(50, {
    message: "Please enter at least 50 characters of network logs for an effective analysis.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const SeverityBadge = ({ severity }: { severity: string }) => {
  const s = severity.toUpperCase();
  if (s === 'HIGH') {
      return <Badge variant="destructive" className="capitalize"><AlertTriangle className="inline-block mr-1 h-3 w-3" /> {severity.toLowerCase()}</Badge>;
  }
  if (s === 'MEDIUM') {
      return <Badge><Shield className="inline-block mr-1 h-3 w-3" /> {severity.toLowerCase()}</Badge>;
  }
  if (s === 'LOW') {
      return <Badge variant="secondary"><CheckCircle className="inline-block mr-1 h-3 w-3" /> {severity.toLowerCase()}</Badge>;
  }
  return <Badge variant="outline" className="capitalize">{severity.toLowerCase()}</Badge>;
};


export function AnomalyDetector() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeNetworkLogsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      networkLogs: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setAnalysisResult(null);
    const { dismiss, update } = toast({
      title: "Analyzing Logs",
      description: (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Please wait while we scan your network logs...</span>
        </div>
      ),
    });

    try {
      const result = await analyzeNetworkLogsAction(data);
      setAnalysisResult(result);
      update({
        id: "toast",
        title: "Analysis Complete!",
        description: `Found ${result.anomalies.length} anomalies. Severity: ${result.severity}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      update({
        id: "toast",
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing the network logs. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => dismiss(), 5000);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Activity /> AI Anomaly Detection
        </CardTitle>
        <CardDescription>
          Paste your network logs below. Our AI will scan for suspicious patterns and potential threats.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow">
          <CardContent className="flex-grow flex flex-col gap-4">
            <FormField
              control={form.control}
              name="networkLogs"
              render={({ field }) => (
                <FormItem className="flex-grow flex flex-col">
                  <FormControl>
                    <Textarea
                      placeholder="e.g., [2023-10-27 10:00:00] SRC:192.168.1.10 DST:8.8.8.8 ..."
                      className="flex-grow resize-none min-h-[150px]"
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
                  Analyzing...
                </>
              ) : "Scan Logs"}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {analysisResult && (
        <>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold font-headline">Analysis Complete</h3>
              {analysisResult.severity &&
                <SeverityBadge severity={analysisResult.severity} />
              }
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><List /> Anomalies Detected:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {analysisResult.anomalies.map((anomaly, index) => (
                  <li key={index}>{anomaly}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><Shield /> Suggested Actions:</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {analysisResult.suggestedActions}
              </p>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
