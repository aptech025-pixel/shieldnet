
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
import { Globe, PlusCircle, Trash2, Link as LinkIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

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


export function MonitoredServicesManager() {
  const [services, setServices] = useState<MonitoredService[]>(initialServices);
  const { toast } = useToast();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Globe /> Monitored Websites
        </CardTitle>
        <CardDescription>
          Add or remove external websites you want to track on your dashboard.
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeService(service.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Remove {service.url}</span>
                        </Button>
                    </motion.div>
                )) : (
                    <p className="text-sm text-muted-foreground text-center py-4">You are not monitoring any websites yet.</p>
                )}
             </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
