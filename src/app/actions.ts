'use server';

import { analyzeNetworkLogs } from '@/ai/flows/analyze-network-logs';
import { explainThreat } from '@/ai/flows/explain-threat';
import { generateItReport } from '@/ai/flows/generate-it-report';
import { generateFirewallRules } from '@/ai/flows/generate-firewall-rules';
import { analyzeWebsite } from '@/ai/flows/analyze-website';
import { generatePassword } from '@/ai/flows/generate-password';
import { z } from 'zod';
import type { AnalyzeNetworkLogsInput, ExplainThreatInput, ExplainThreatOutput, GenerateItReportInput, GenerateFirewallRulesInput, GenerateFirewallRulesOutput, AnalyzeWebsiteInput, AnalyzeWebsiteOutput, GeneratePasswordInput, GeneratePasswordOutput } from '@/ai/schemas';

const AnalyzeNetworkLogsInputSchema = z.object({
  networkLogs: z.string(),
});

export async function analyzeNetworkLogsAction(input: AnalyzeNetworkLogsInput) {
  const parsedInput = AnalyzeNetworkLogsInputSchema.parse(input);
  const result = await analyzeNetworkLogs(parsedInput);
  return result;
}

const ExplainThreatInputSchema = z.object({
    threat: z.string().describe('The name of the threat, e.g., "SQL Injection Attempt".'),
    severity: z.string().describe('The severity of the threat (High, Medium, or Low).'),
    sourceIp: z.string().describe('The source IP address of the threat.'),
    status: z.string().describe('The current status of the threat (e.g., Blocked, Mitigated).'),
    date: z.string().describe('The date and time the threat was detected.'),
});

export async function explainThreatAction(input: ExplainThreatInput): Promise<ExplainThreatOutput> {
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

const AnalyzeWebsiteInputSchema = z.object({
  url: z.string().url(),
});

export async function analyzeWebsiteAction(input: AnalyzeWebsiteInput): Promise<AnalyzeWebsiteOutput> {
  const parsedInput = AnalyzeWebsiteInputSchema.parse(input);
  const result = await analyzeWebsite(parsedInput);
  return result;
}

const GeneratePasswordInputSchema = z.object({
  length: z.number().min(8).max(128),
  useUppercase: z.boolean(),
  useLowercase: z.boolean(),
  useNumbers: z.boolean(),
  useSymbols: z.boolean(),
}).refine(data => data.useUppercase || data.useLowercase || data.useNumbers || data.useSymbols, {
  message: "At least one character type must be selected.",
  path: ["useUppercase"], 
});

export async function generatePasswordAction(input: GeneratePasswordInput): Promise<GeneratePasswordOutput> {
    const parsedInput = GeneratePasswordInputSchema.parse(input);
    const result = await generatePassword(parsedInput);
    return result;
}
