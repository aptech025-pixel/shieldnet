'use server';

import { analyzeNetworkLogs, type AnalyzeNetworkLogsInput } from '@/ai/flows/analyze-network-logs';
import { explainThreat, type ExplainThreatInput, type ExplainThreatOutput } from '@/ai/flows/explain-threat';
import { z } from 'zod';

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
