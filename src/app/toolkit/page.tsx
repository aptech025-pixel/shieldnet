
"use client";

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';
import { PasswordGenerator } from '@/components/password-generator';
import { EmailAnalyzer } from '@/components/email-analyzer';
import { DarkWebScanner } from '@/components/dark-web-scanner';

export default function ToolkitPage() {
  const { toggleSidebar } = useSidebar();

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                <Menu />
                <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Security Toolkit</h2>
            </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-1">
            <PasswordGenerator />
            <EmailAnalyzer />
            <DarkWebScanner />
        </div>
    </main>
  );
}
