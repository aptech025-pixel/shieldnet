'use server';

import { analyzeNetworkLogs, type AnalyzeNetworkLogsInput } from '@/ai/flows/analyze-network-logs';
import { z } from 'zod';

const AnalyzeNetworkLogsInputSchema = z.object({
  networkLogs: z.string(),
});

export async function analyzeNetworkLogsAction(input: AnalyzeNetworkLogsInput) {
  const parsedInput = AnalyzeNetworkLogsInputSchema.parse(input);
  const result = await analyzeNetworkLogs(parsedInput);
  return result;
}
