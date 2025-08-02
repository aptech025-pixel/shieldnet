
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generatePasswordAction } from '@/app/actions';
import type { GeneratePasswordOutput } from '@/ai/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, KeyRound, Sparkles, Clipboard, ClipboardCheck, CheckCircle } from 'lucide-react';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Label } from './ui/label';

const formSchema = z.object({
  length: z.number().min(8).max(128),
  useUppercase: z.boolean(),
  useLowercase: z.boolean(),
  useNumbers: z.boolean(),
  useSymbols: z.boolean(),
}).refine(data => data.useUppercase || data.useLowercase || data.useNumbers || data.useSymbols, {
  message: "At least one character type must be selected.",
  path: ["useUppercase"],
});

type FormValues = z.infer<typeof formSchema>;

export function PasswordGenerator() {
  const [generationResult, setGenerationResult] = useState<GeneratePasswordOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 16,
      useUppercase: true,
      useLowercase: true,
      useNumbers: true,
      useSymbols: true,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGenerationResult(null);
    setIsCopied(false);
    
    try {
      const result = await generatePasswordAction(data);
      setGenerationResult(result);
    } catch (error) {
      console.error("Password generation failed:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate a password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generationResult?.password) return;
    navigator.clipboard.writeText(generationResult.password);
    setIsCopied(true);
    toast({
      title: "Password Copied",
      description: "The generated password has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <KeyRound /> Secure Password Generator
        </CardTitle>
        <CardDescription>
          Create strong, random passwords and get an AI-powered strength analysis.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password Length</FormLabel>
                    <span className="text-sm font-medium">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={8}
                      max={64}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                    control={form.control}
                    name="useUppercase"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                            </FormControl>
                            <FormLabel className="font-normal">Uppercase (A-Z)</FormLabel>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="useLowercase"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                            </FormControl>
                            <FormLabel className="font-normal">Lowercase (a-z)</FormLabel>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="useNumbers"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                            </FormControl>
                            <FormLabel className="font-normal">Numbers (0-9)</FormLabel>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="useSymbols"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                            </FormControl>
                            <FormLabel className="font-normal">Symbols (!@#$)</FormLabel>
                        </FormItem>
                    )}
                />
            </div>
             {form.formState.errors.useUppercase && (
                 <FormMessage>{form.formState.errors.useUppercase.message}</FormMessage>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Generating...' : 'Generate Password'}
            </Button>
          </CardFooter>
      
            {generationResult && (
                <>
                <Separator className="my-4"/>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Generated Password</Label>
                        <div className="flex items-center gap-2 mt-2">
                            <input 
                            readOnly 
                            value={generationResult.password} 
                            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-code tracking-widest"
                            />
                            <Button variant="outline" size="icon" onClick={copyToClipboard} type="button">
                            {isCopied ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                            <span className="sr-only">Copy password</span>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label className="flex items-center gap-2">
                            <CheckCircle className="text-green-500" /> AI Strength Analysis
                        </Label>
                        <p className="text-sm text-muted-foreground mt-2 bg-muted p-3 rounded-md">
                            {generationResult.strengthAnalysis}
                        </p>
                    </div>
                </CardContent>
                </>
            )}
        </form>
      </Form>
    </Card>
  );
}
