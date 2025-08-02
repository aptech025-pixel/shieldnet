
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateFirewallRulesAction } from '@/app/actions';
import type { GenerateFirewallRulesOutput } from '@/ai/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Shield, Check, Copy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

const formSchema = z.object({
  objective: z.string().min(10, {
    message: "Please describe your security objective in at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function FirewallManager() {
  const [generatedRules, setGeneratedRules] = useState<GenerateFirewallRulesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objective: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedRules(null);
    const { dismiss, update } = toast({
      id: "rules-toast",
      title: "Generating Firewall Rules",
      description: (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Please wait while our AI assistant designs your rules...</span>
        </div>
      ),
    });

    try {
      const result = await generateFirewallRulesAction(data);
      setGeneratedRules(result);
      update({
        id: "rules-toast",
        title: "Rules Generated!",
        description: `Successfully generated ${result.rules.length} firewall rules.`,
      });
    } catch (error) {
      console.error("Rule generation failed:", error);
      update({
        id: "rules-toast",
        variant: "destructive",
        title: "Generation Failed",
        description: "An error occurred while generating rules. Please try again.",
      });
    } finally {
      setIsLoading(false);
       setTimeout(() => dismiss(), 5000);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to Clipboard",
        description: "The generated rules have been copied as a JSON string."
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Shield /> AI Firewall Manager
        </CardTitle>
        <CardDescription>
          Describe your security objective in plain English. Our AI will generate the optimal firewall rules for you.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security Objective</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Block all social media websites' or 'Only allow traffic from our office IP address and block everything else.'"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be as descriptive as possible for the best results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                 <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Rules
                 </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {generatedRules && generatedRules.rules.length > 0 && (
        <>
            <CardHeader className="pt-0">
                <CardTitle className="text-lg font-headline">Generated Rules</CardTitle>
                <CardDescription>
                    Review the rules below. You can copy them to your clipboard and apply them to your firewall configuration.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <ScrollArea className="h-full max-h-[400px] w-full rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Protocol</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Port</TableHead>
                            <TableHead className="min-w-[200px]">Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {generatedRules.rules.map((rule, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Badge variant={rule.action.toUpperCase() === 'DENY' ? 'destructive' : 'default'}>
                                            {rule.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{rule.protocol}</TableCell>
                                    <TableCell>{rule.source}</TableCell>
                                    <TableCell>{rule.destination}</TableCell>
                                    <TableCell>{rule.port}</TableCell>
                                    <TableCell>{rule.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(generatedRules.rules, null, 2))}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Rules (JSON)
                </Button>
            </CardFooter>
        </>
      )}
    </Card>
  );
}
