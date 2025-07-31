"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnomalyDetector } from '@/components/anomaly-detector';
import {
  FileText,
  AlertTriangle,
  Server,
  BarChart,
  ShieldCheck,
  Menu,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
} from 'recharts';
import { useSidebar } from '@/components/ui/sidebar';

const trafficData = [
  { source: 'Internal', traffic: 4000 },
  { source: 'Web', traffic: 3000 },
  { source: 'Email', traffic: 2000 },
  { source: 'FTP', traffic: 2780 },
  { source: 'VPN', traffic: 1890 },
  { source: 'Other', traffic: 2390 },
];

const threatsData = [
  { day: 'Mon', threats: 2 },
  { day: 'Tue', threats: 3 },
  { day: 'Wed', threats: 1 },
  { day: 'Thu', threats: 5 },
  { day: 'Fri', threats: 4 },
  { day: 'Sat', threats: 7 },
  { day: 'Sun', threats: 3 },
];

export function Dashboard() {
  const { toggleSidebar } = useSidebar();
  const trafficChartConfig = {
    traffic: {
      label: "Traffic",
      color: "hsl(var(--primary))",
    },
  };
  const threatsChartConfig = {
     threats: {
      label: "Threats",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between space-y-2 flex-wrap">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
             <Menu />
             <span className="sr-only">Toggle sidebar</span>
           </Button>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Secure</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">High severity alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Traffic</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 TB</div>
            <p className="text-xs text-muted-foreground">Data processed today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protected Devices</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57</div>
            <p className="text-xs text-muted-foreground">Endpoints secured</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 flex">
            <AnomalyDetector />
        </div>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Network Traffic by Source</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={trafficChartConfig} className="h-[350px] w-full">
              <RechartsBarChart data={trafficData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="source"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="traffic" fill="hsl(var(--primary))" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-1">
         <Card>
           <CardHeader>
             <CardTitle className="font-headline">Threats Detected This Week</CardTitle>
             <CardDescription>A summary of security threats detected over the last 7 days.</CardDescription>
           </CardHeader>
           <CardContent className="pl-2">
             <ChartContainer config={threatsChartConfig} className="h-[300px] w-full">
               <RechartsLineChart
                 data={threatsData}
                 margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                 accessibilityLayer
               >
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                 <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                 <ChartTooltip content={<ChartTooltipContent />} />
                 <Line type="monotone" dataKey="threats" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
               </RechartsLineChart>
             </ChartContainer>
           </CardContent>
         </Card>
       </div>
    </main>
  );
}
