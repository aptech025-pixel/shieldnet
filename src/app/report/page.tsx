
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

const reportFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
});

export default function ReportPage() {
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

  const onSubmit = (values: z.infer<typeof reportFormSchema>) => {
    const mailtoLink = `mailto:ap.tech.025@gmail.com?subject=${encodeURIComponent(
      `IT Report: ${values.subject}`
    )}&body=${encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\n\nIssue Description:\n${values.description}`
    )}`;
    
    window.location.href = mailtoLink;

    toast({
      title: "Redirecting to Email Client",
      description: "Please complete sending the report from your email application.",
    });
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
          <CardDescription>Experiencing an issue? Fill out the form below to notify our IT department.</CardDescription>
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
                        <Input placeholder="John Doe" {...field} />
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
                        <Input placeholder="john.doe@example.com" {...field} />
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
                      <Input placeholder="e.g., Unable to access analytics dashboard" {...field} />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit Report</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
