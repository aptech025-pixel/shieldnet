'use server';

import { analyzeNetworkLogs, type AnalyzeNetworkLogsInput } from '@/ai/flows/analyze-network-logs';
import { explainThreat, type ExplainThreatInput, type ExplainThreatOutput } from '@/ai/flows/explain-threat';
import { generateItReport, type GenerateItReportInput } from '@/ai/flows/generate-it-report';
import { generateFirewallRules, type GenerateFirewallRulesInput, type GenerateFirewallRulesOutput } from '@/ai/flows/generate-firewall-rules';
import { analyzeWebsite, type AnalyzeWebsiteInput, type AnalyzeWebsiteOutput, AnalyzeWebsiteInputSchema } from '@/ai/flows/analyze-website';
import { z } from 'zod';

const AnalyzeNetworkLogsInputSchema = z.object({
  networkLogs: z.string(),
});

export async function analyzeNetworkLogsAction(input: AnalyzeNetworkLogsInput) {
  const parsedInput = AnalyzeNetworkLogsInputSchema.parse(input);
  const result = await analyzeNetworkLogs(parsedInput);
  return result;
}

export async function explainThreatAction(input: ExplainThreatInput): Promise<ExplainThreatOutput> {
    const ExplainThreatInputSchema = z.object({
    threat: z.string().describe('The name of the threat, e.g., "SQL Injection Attempt".'),
    severity: z.string().describe('The severity of the threat (High, Medium, or Low).'),
    sourceIp: z.string().describe('The source IP address of the threat.'),
    status: z.string().describe('The current status of the threat (e.g., Blocked, Mitigated).'),
    date: z.string().describe('The date and time the threat was detected.'),
    });

  const parsedInput = ExplainThreatInputSchema.parse(input);
  const result = await explainThreat(parsedInput);
  return result;
}


const GenerateItReportInputSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
    description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
});

export async function generateItReportAction(input: GenerateItReportInput) {
  const parsedInput = GenerateItReportInputSchema.parse(input);
  const result = await generateItReport(parsedInput);
  return result;
}

const GenerateFirewallRulesInputSchema = z.object({
  objective: z.string().min(10, { message: 'Please describe your objective in at least 10 characters.' }),
});

export async function generateFirewallRulesAction(input: GenerateFirewallRulesInput): Promise<GenerateFirewallRulesOutput> {
  const parsedInput = GenerateFirewallRulesInputSchema.parse(input);
  const result = await generateFirewallRules(parsedInput);
  return result;
}

export async function analyzeWebsiteAction(input: AnalyzeWebsiteInput): Promise<AnalyzeWebsiteOutput> {
  const parsedInput = AnalyzeWebsiteInputSchema.parse(input);
  const result = await analyzeWebsite(parsedInput);
  return result;
}
