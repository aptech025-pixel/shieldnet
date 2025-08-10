
"use client";

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { GraduationCap, Menu } from 'lucide-react';
import { PhishingSimulator } from '@/components/phishing-simulator';

export default function TrainingPage() {
  const { toggleSidebar } = useSidebar();

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                <Menu />
                <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                <GraduationCap /> Security Training
            </h2>
            </div>
        </div>
        <p className="text-muted-foreground">
            Strengthen your human firewall with simulated phishing campaigns and AI-driven training.
        </p>
        <div className="grid gap-6 lg:grid-cols-1">
            <PhishingSimulator />
        </div>
    </main>
  );
}
