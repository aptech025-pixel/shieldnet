
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileCog, ShieldCheck, Siren } from "lucide-react";
import Link from "next/link";

const firewallData = {
  status: "Enabled",
  rules: 128,
  trafficBlocked: "1,420",
};

export function FirewallStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Shield /> Firewall Status
        </CardTitle>
        <CardDescription>
          Your network's first line of defense.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span className="font-medium">Status</span>
          </div>
          <span className="font-semibold text-green-500">{firewallData.status}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <FileCog className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Active Rules</span>
          </div>
          <span className="font-semibold">{firewallData.rules}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <Siren className="h-5 w-5 text-destructive" />
            <span className="font-medium">Threats Blocked (24h)</span>
          </div>
          <span className="font-semibold">{firewallData.trafficBlocked}</span>
        </div>
        <Button asChild className="w-full">
            <Link href="/settings">
                <FileCog className="mr-2 h-4 w-4" />
                Manage Firewall Rules
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
