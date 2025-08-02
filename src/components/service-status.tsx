
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, AlertTriangle, XCircle, Globe } from "lucide-react";
import Link from "next/link";

const services = [
  { name: "mrfarm.free.nf", url: "https://mrfarm.free.nf", status: "Operational" },
  { name: "9jadevs.free.nf", url: "https://www.9jadevs.free.nf", status: "Operational" },
  { name: "apojtech.free.nf", url: "https://apojtech.free.nf", status: "Degraded Performance" },
  { name: "internal.api", url: "#", status: "Offline", description: "Internal API service is currently unreachable." },
];

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Globe /> External Service Status
        </CardTitle>
        <CardDescription>
          Monitoring the real-time status of critical external websites.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
            {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Link href={service.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline disabled:pointer-events-none">
                            {service.name}
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{service.description || `Visit ${service.url}`}</p>
                    </TooltipContent>
                </Tooltip>
                </div>
                <StatusBadge status={service.status} />
            </div>
            ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
