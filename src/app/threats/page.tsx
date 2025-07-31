
"use client";
import React, { useState, useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, CheckCircle, Search, ListFilter, Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

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
  

  return (
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
      <div className="bg-card p-4 rounded-lg shadow-sm">
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
                <TableRow key={threat.id}>
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
      </div>
    </main>
  );
}
