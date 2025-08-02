
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, AlertTriangle, XCircle, Globe, Settings, ExternalLink, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/button';
import { useServices } from '@/hooks/use-services';

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "Operational":
      return (
        <Badge className="border-transparent bg-green-500 text-primary-foreground hover:bg-green-500/80">
          <CheckCircle className="mr-1 h-3 w-3" />
          {status}
        </Badge>
      );
    case "Degraded Performance":
      return (
        <Badge variant="destructive" className="border-transparent bg-yellow-500 text-primary-foreground hover:bg-yellow-500/80">
          <AlertTriangle className="mr-1 h-3 w-3" />
          {status}
        </Badge>
      );
    case "Offline":
       return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          {status}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function ServiceStatus() {
  const { services, loading } = useServices();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="font-headline flex items-center gap-2">
                <Globe /> External Service Status
            </CardTitle>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                            <Link href="/settings">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Manage Monitored Websites</span>
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Manage Monitored Websites</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <CardDescription>
          Real-time status of your critical external websites.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        <TooltipProvider>
            <AnimatePresence>
            {!loading && services.length > 0 ? services.map((service) => (
            <motion.div 
                key={service.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="flex items-center justify-between rounded-lg border p-3"
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Link href={service.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline flex items-center gap-2 truncate pr-4">
                            <span className="truncate">{service.url.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{service.description || `Visit ${service.url}`}</p>
                    </TooltipContent>
                </Tooltip>
                <StatusBadge status={service.status} />
            </motion.div>
            )) : null}
            </AnimatePresence>
        </TooltipProvider>
        {!loading && services.length === 0 && (
          <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">No websites are being monitored.</p>
              <Button asChild variant="outline" size="sm">
                  <Link href="/settings">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Websites
                  </Link>
              </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
