
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { darkWebScanAction } from '@/app/actions';
import type { DarkWebScanOutput } from '@/ai/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert, BadgeInfo, ShieldCheck, ListChecks, ServerCrash, Database, User, KeyRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const dataIcons: Record<string, React.ReactNode> = {
    "Email": <Database className="h-3 w-3" />,
    "Password": <KeyRound className="h-3 w-3" />,
    "Username": <User className="h-3 w-3" />,
    "Phone Number": <User className="h-3 w-3" />,
}

export function DarkWebScanner() {
  const [scanResult, setScanResult] = useState<DarkWebScanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setScanResult(null);
    try {
      const result = await darkWebScanAction(data);
      setScanResult(result);
    } catch (error) {
      console.error("Dark web scan failed:", error);
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "An error occurred while performing the scan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ShieldAlert /> Dark Web Exposure Scanner
        </CardTitle>
        <CardDescription>
          Check if your email address has been compromised in known data breaches.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email to scan..."
                      {...field}
                      disabled={isLoading}
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
                  Scanning for Breaches...
                </>
              ) : (
                <>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Scan Now
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      <AnimatePresence>
        {scanResult && (
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
            >
                <CardContent className="pt-6 space-y-4 border-t">
                    <h3 className="text-lg font-semibold font-headline">Scan Results</h3>
                    
                    <div className="p-3 bg-muted rounded-md space-y-1">
                         <p className="text-sm font-semibold">{scanResult.summary}</p>
                    </div>

                    {scanResult.breaches.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {scanResult.breaches.map((breach, index) => (
                                <Card key={index} className="bg-background/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <ServerCrash className="text-destructive" />
                                            {breach.source}
                                        </CardTitle>
                                        <CardDescription>{breach.date}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs font-semibold mb-2 text-muted-foreground">Compromised Data:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {breach.compromisedData.map((item, i) => (
                                                <Badge key={i} variant="secondary" className="gap-1">
                                                    {dataIcons[item] || <Database className="h-3 w-3" />}
                                                    {item}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6 bg-muted rounded-lg">
                            <ShieldCheck className="w-12 h-12 text-green-500 mb-2" />
                            <p className="font-semibold">No Breaches Found</p>
                            <p className="text-sm text-muted-foreground">Your email did not appear in any known data breaches in our database.</p>
                        </div>
                    )}
                    
                    <Separator />

                    <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2"><ListChecks /> Recommendations</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {scanResult.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                        </ul>
                    </div>

                </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
