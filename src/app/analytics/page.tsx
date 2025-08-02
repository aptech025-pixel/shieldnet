
"use client";
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart as RechartsBarChart,
  Pie,
  PieChart,
  Cell
} from 'recharts';
import { Calendar as CalendarIcon, Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

const threatTrendsData = [
  { date: '2023-10-01', High: 4, Medium: 10, Low: 22 },
  { date: '2023-10-02', High: 3, Medium: 12, Low: 25 },
  { date: '2023-10-03', High: 5, Medium: 8, Low: 18 },
  { date: '2023-10-04', High: 2, Medium: 15, Low: 30 },
  { date: '2023-10-05', High: 6, Medium: 11, Low: 24 },
  { date: '2023-10-06', High: 8, Medium: 14, Low: 28 },
  { date: '2023-10-07', High: 5, Medium: 10, Low: 20 },
];

const trafficProtocolData = [
  { name: 'HTTP/S', value: 4500, fill: 'hsl(var(--chart-1))' },
  { name: 'FTP', value: 1200, fill: 'hsl(var(--chart-2))' },
  { name: 'SSH', value: 800, fill: 'hsl(var(--chart-3))' },
  { name: 'SMTP', value: 1500, fill: 'hsl(var(--chart-4))' },
  { name: 'DNS', value: 2000, fill: 'hsl(var(--chart-5))' },
];

const attackOriginData = [
    { country: 'Russia', attacks: 125, fill: 'hsl(var(--chart-1))' },
    { country: 'China', attacks: 98, fill: 'hsl(var(--chart-2))' },
    { country: 'USA', attacks: 72, fill: 'hsl(var(--chart-3))' },
    { country: 'Brazil', attacks: 45, fill: 'hsl(var(--chart-4))' },
    { country: 'Nigeria', attacks: 31, fill: 'hsl(var(--chart-5))' },
    { country: 'Germany', attacks: 25, fill: 'hsl(var(--chart-1))' },
    { country: 'India', attacks: 19, fill: 'hsl(var(--chart-2))' },
    { country: 'Iran', attacks: 15, fill: 'hsl(var(--chart-3))' },
    { country: 'UK', attacks: 12, fill: 'hsl(var(--chart-4))' },
    { country: 'Vietnam', attacks: 9, fill: 'hsl(var(--chart-5))' },
];


const areaChartConfig = {
  High: { label: 'High', color: 'hsl(var(--destructive))' },
  Medium: { label: 'Medium', color: 'hsl(var(--primary))' },
  Low: { label: 'Low', color: 'hsl(var(--secondary))' },
};

export default function AnalyticsPage() {
  const { toggleSidebar } = useSidebar();
  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between space-y-2 flex-wrap">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
             <Menu />
             <span className="sr-only">Toggle sidebar</span>
           </Button>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Analytics</h2>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Last 30 days
            </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Threat Trends Over Time</CardTitle>
                <CardDescription>Daily threat counts by severity.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={areaChartConfig} className="h-[300px] w-full">
                <AreaChart data={threatTrendsData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Area dataKey="Low" type="natural" fill="var(--color-Low)" fillOpacity={0.4} stroke="var(--color-Low)" stackId="a" />
                    <Area dataKey="Medium" type="natural" fill="var(--color-Medium)" fillOpacity={0.4} stroke="var(--color-Medium)" stackId="a" />
                    <Area dataKey="High" type="natural" fill="var(--color-High)" fillOpacity={0.4} stroke="var(--color-High)" stackId="a" />
                </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Traffic by Protocol</CardTitle>
                <CardDescription>Distribution of network traffic.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="h-[300px] w-full">
                    <PieChart>
                         <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={trafficProtocolData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5} >
                             {trafficProtocolData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
       <Card>
           <CardHeader>
             <CardTitle className="font-headline">Top Attack Origins</CardTitle>
             <CardDescription>Top 10 countries by number of attacks this month.</CardDescription>
           </CardHeader>
           <CardContent className="pl-2">
             <ChartContainer config={{}} className="h-[400px] w-full">
               <RechartsBarChart
                 data={attackOriginData}
                 layout="vertical"
                 margin={{ left: 10, right: 30 }}
               >
                 <CartesianGrid horizontal={false} />
                 <YAxis dataKey="country" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
                 <XAxis type="number" hide />
                 <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                 <Bar dataKey="attacks" radius={5} barSize={20}>
                    {attackOriginData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                 </Bar>
               </RechartsBarChart>
             </ChartContainer>
           </CardContent>
         </Card>
    </main>
  );
}
