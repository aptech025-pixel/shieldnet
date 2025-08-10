
"use client";
import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, CheckCircle, Search, ListFilter, Menu, Loader2, Info, ListChecks, Globe } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { explainThreatAction } from '@/app/actions';
import type { ExplainThreatOutput } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { getIpInfo } from '@/ai/tools/get-ip-info';

const threatsData = [
  { id: 1, threat: 'SQL Injection Attempt', severity: 'High', status: 'Blocked', date: '2023-11-01 14:30', sourceIp: '198.51.100.2' },
  { id: 2, threat: 'Cross-Site Scripting (XSS)', severity: 'Medium', status: 'Mitigated', date: '2023-11-01 10:15', sourceIp: '203.0.113.55' },
  { id: 3, threat: 'Unusual Login Pattern', severity: 'Low', status: 'Investigating', date: '2023-10-31 23:00', sourceIp: '192.0.2.120' },
  { id: 4, threat: 'DDoS Volumetric Attack', severity: 'High', status: 'Blocked', date: '2023-10-31 18:45', sourceIp: '198.18.0.1' },
  { id: 5, threat: 'Malware Signature Detected', severity: 'High', status: 'Quarantined', date: '2023-10-30 09:20', sourceIp: '192.168.1.105' },
  { id: 6, threat: 'Phishing Link Detected', severity: 'Medium', status: 'Blocked', date: '2023-10-30 08:05', sourceIp: '203.0.113.89' },
  { id: 7, threat: 'Port Scan from External IP', severity: 'Low', status: 'Monitored', date: '2023-10-29 15:10', sourceIp: '198.51.100.14' },
  { id: 8, threat: 'Brute Force Attempt on SSH', severity: 'Medium', status: 'Blocked', date: '2023-10-29 02:55', sourceIp: '192.0.2.201' },
];

type Threat = typeof threatsData[0];

const countryCodeToName: Record<string, string> = {
    US: "United States",
    RU: "Russia",
    CN: "China",
    BR: "Brazil",
    NG: "Nigeria",
    DE: "Germany",
    IN: "India",
    IR: "Iran",
    GB: "United Kingdom",
    VN: "Vietnam",
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const s = severity.toUpperCase();
  if (s === 'HIGH') {
    return <Badge variant="destructive" className="capitalize"><AlertTriangle className="inline-block mr-1 h-3 w-3" /> {severity.toLowerCase()}</Badge>;
  }
  if (s === 'MEDIUM') {
    return <Badge><Shield className="inline-block mr-1 h-3 w-3" /> {severity.toLowerCase()}</Badge>;
  }
  if (s === 'LOW') {
    return <Badge variant="secondary"><CheckCircle className="inline-block mr-1 h-3 w-3" /> {severity.toLowerCase()}</Badge>;
  }
  return <Badge variant="outline" className="capitalize">{severity.toLowerCase()}</Badge>;
};

export default function ThreatsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string[]>(['High', 'Medium', 'Low']);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [analysis, setAnalysis] = useState<ExplainThreatOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [ipCountry, setIpCountry] = useState<string | null>(null);
  const { toggleSidebar } = useSidebar();

  const filteredThreats = useMemo(() => {
    return threatsData.filter(threat => {
      const searchMatch = threat.threat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          threat.sourceIp.toLowerCase().includes(searchTerm.toLowerCase());
      const severityMatch = severityFilter.includes(threat.severity);
      return searchMatch && severityMatch;
    });
  }, [searchTerm, severityFilter]);

  const handleSeverityChange = (severity: string) => {
    setSeverityFilter(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity) 
        : [...prev, severity]
    );
  };
  
  const handleThreatSelect = async (threat: Threat) => {
    setSelectedThreat(threat);
    setIsLoadingAnalysis(true);
    setAnalysis(null);
    setIpCountry(null);
    try {
      const [analysisResult, ipInfoResult] = await Promise.all([
        explainThreatAction({
            threat: threat.threat,
            severity: threat.severity,
            sourceIp: threat.sourceIp,
            status: threat.status,
            date: threat.date,
        }),
        getIpInfo({ ip: threat.sourceIp })
      ]);
      setAnalysis(analysisResult);
      if (ipInfoResult.country && ipInfoResult.country !== 'Unknown') {
        setIpCountry(countryCodeToName[ipInfoResult.country] || ipInfoResult.country);
      }
    } catch (error) {
      console.error("Failed to get threat analysis:", error);
      // Optionally set an error state to show in the dialog
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const AnalysisSkeleton = () => (
    <div className="space-y-4 pt-4">
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );

  return (
    <>
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
        <div className="flex items-center justify-between space-y-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
              <Menu />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Threats</h2>
          </div>
        </div>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by threat or IP..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter by Severity
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={severityFilter.includes('High')}
                    onCheckedChange={() => handleSeverityChange('High')}
                  >
                    High
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={severityFilter.includes('Medium')}
                    onCheckedChange={() => handleSeverityChange('Medium')}
                  >
                    Medium
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={severityFilter.includes('Low')}
                    onCheckedChange={() => handleSeverityChange('Low')}
                  >
                    Low
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Threat</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredThreats.map(threat => (
                    <TableRow key={threat.id} onClick={() => handleThreatSelect(threat)} className="cursor-pointer">
                      <TableCell className="font-medium">{threat.threat}</TableCell>
                      <TableCell><SeverityBadge severity={threat.severity} /></TableCell>
                      <TableCell>{threat.status}</TableCell>
                      <TableCell>{threat.date}</TableCell>
                      <TableCell>{threat.sourceIp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!selectedThreat} onOpenChange={(isOpen) => !isOpen && setSelectedThreat(null)}>
        <DialogContent className="sm:max-w-lg grid-rows-[auto,minmax(0,1fr),auto] max-h-[90svh]">
          {selectedThreat && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline flex items-center gap-2">
                  Threat Details
                  <SeverityBadge severity={selectedThreat.severity} />
                </DialogTitle>
                <DialogDescription>
                  AI-powered analysis and recommendations for: {selectedThreat.threat}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="pr-6 -mr-6">
                <div className="py-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2"><strong>Source IP:</strong> <Badge variant="outline">{selectedThreat.sourceIp}</Badge></div>
                    {isLoadingAnalysis && !ipCountry && <Skeleton className="h-4 w-28 mt-1" />}
                    {ipCountry && <div className="flex items-center gap-2"><strong>Origin:</strong> <Badge variant="secondary" className="gap-1"><Globe className="h-3 w-3" />{ipCountry}</Badge></div>}
                    <div><strong>Status:</strong> {selectedThreat.status}</div>
                    <div><strong>Detected on:</strong> {selectedThreat.date}</div>
                </div>

                {isLoadingAnalysis && <AnalysisSkeleton />}
                
                {analysis && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-2"><Info /> AI Explanation</h4>
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{analysis.explanation}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-2"><ListChecks /> AI Recommendations</h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {analysis.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </ScrollArea>
              
              <DialogFooter>
                <Button onClick={() => setSelectedThreat(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
