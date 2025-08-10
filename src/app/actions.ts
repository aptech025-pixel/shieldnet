'use server';

import { analyzeNetworkLogs } from '@/ai/flows/analyze-network-logs';
import { explainThreat } from '@/ai/flows/explain-threat';
import { generateItReport } from '@/ai/flows/generate-it-report';
import { generateFirewallRules } from '@/ai/flows/generate-firewall-rules';
import { analyzeWebsite } from '@/ai/flows/analyze-website';
import { generatePassword } from '@/ai/flows/generate-password';
import { getTopAttackOrigins } from '@/ai/flows/get-top-attack-origins';
import { analyzeEmail } from '@/ai/flows/analyze-email';
import { darkWebScan } from '@/ai/flows/dark-web-scanner';
import { summarizeSecurityArticle } from '@/ai/flows/summarize-security-article';
import { generatePhishingCampaign } from '@/ai/flows/generate-phishing-campaign';
import { getIpInfo as getIpInfoTool } from '@/ai/tools/get-ip-info';
import { z } from 'zod';
import type { AnalyzeNetworkLogsInput, ExplainThreatInput, ExplainThreatOutput, GenerateItReportInput, GenerateItReportOutput, GenerateFirewallRulesInput, GenerateFirewallRulesOutput, AnalyzeWebsiteInput, AnalyzeWebsiteOutput, GeneratePasswordInput, GeneratePasswordOutput, GetTopAttackOriginsOutput, AnalyzeEmailInput, AnalyzeEmailOutput, DarkWebScanInput, DarkWebScanOutput, SummarizeSecurityArticleInput, SummarizeSecurityArticleOutput, GeneratePhishingCampaignInput, GeneratePhishingCampaignOutput } from '@/ai/schemas';
import { ExplainThreatInputSchema, GeneratePhishingCampaignInputSchema, SummarizeSecurityArticleInputSchema } from '@/ai/schemas';

const AnalyzeNetworkLogsInputSchema = z.object({
  networkLogs: z.string(),
});

export async function analyzeNetworkLogsAction(input: AnalyzeNetworkLogsInput) {
  const parsedInput = AnalyzeNetworkLogsInputSchema.parse(input);
  const result = await analyzeNetworkLogs(parsedInput);
  return result;
}

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

export async function generateItReportAction(input: GenerateItReportInput): Promise<GenerateItReportOutput> {
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

export async function getTopAttackOriginsAction(): Promise<GetTopAttackOriginsOutput> {
    const result = await getTopAttackOrigins();
    return result;
}

const AnalyzeEmailInputSchema = z.object({
  emailContent: z.string().min(50, { message: 'Please enter at least 50 characters of email content.' }),
});

export async function analyzeEmailAction(input: AnalyzeEmailInput): Promise<AnalyzeEmailOutput> {
    const parsedInput = AnalyzeEmailInputSchema.parse(input);
    const result = await analyzeEmail(parsedInput);
    return result;
}

const DarkWebScanInputSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export async function darkWebScanAction(input: DarkWebScanInput): Promise<DarkWebScanOutput> {
    const parsedInput = DarkWebScanInputSchema.parse(input);
    const result = await darkWebScan(parsedInput);
    return result;
}


const GetIpInfoInputSchema = z.object({
  ip: z.string(),
});

export async function getIpInfo(input: z.infer<typeof GetIpInfoInputSchema>) {
    const parsedInput = GetIpInfoInputSchema.parse(input);
    // Directly call the tool as a server function
    const result = await getIpInfoTool.fn(parsedInput);
    return result;
}


export async function summarizeSecurityArticleAction(input: SummarizeSecurityArticleInput): Promise<SummarizeSecurityArticleOutput> {
    const parsedInput = SummarizeSecurityArticleInputSchema.parse(input);
    const result = await summarizeSecurityArticle(parsedInput);
    return result;
}


export async function generatePhishingCampaignAction(input: GeneratePhishingCampaignInput): Promise<GeneratePhishingCampaignOutput> {
    const parsedInput = GeneratePhishingCampaignInputSchema.parse(input);
    const result = await generatePhishingCampaign(parsedInput);
    return result;
}
