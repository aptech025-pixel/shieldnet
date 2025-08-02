
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Menu, Wand2, Loader2 } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { generateItReportAction } from '@/app/actions';

const reportFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
});

export default function ReportPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toggleSidebar } = useSidebar();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof reportFormSchema>) => {
    setIsGenerating(true);
    toast({
      title: 'Generating Report with AI',
      description: (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Please wait while we draft your report...</span>
        </div>
      ),
    });

    try {
      const result = await generateItReportAction(values);
      
      const mailtoLink = `mailto:ap.tech.025@gmail.com?subject=${encodeURIComponent(
        result.generatedSubject
      )}&body=${encodeURIComponent(
        result.generatedBody
      )}`;
      
      window.location.href = mailtoLink;

      toast({
        title: "Redirecting to Email Client",
        description: "Please complete sending the AI-generated report from your email application.",
      });

    } catch (error) {
       toast({
        variant: "destructive",
        title: "Report Generation Failed",
        description: "An error occurred while generating the report. Please try again.",
      });
    } finally {
        setIsGenerating(false);
    }
  };

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
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Submit an IT Report</CardTitle>
          <CardDescription>
            Experiencing an issue? Fill out the form below. Our AI will help structure your report to notify our IT department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={isGenerating} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} disabled={isGenerating} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Unable to access analytics dashboard" {...field} disabled={isGenerating} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please describe the issue in detail</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the steps you took, what you expected to happen, and what actually happened. Include any error messages."
                        className="min-h-[150px]"
                        {...field}
                        disabled={isGenerating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isGenerating}>
                 {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isGenerating ? 'Generating Report...' : 'Generate & Send Report'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
