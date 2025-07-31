'use server';

/**
 * @fileOverview AI-powered network log analysis flow for anomaly detection.
 *
 * - analyzeNetworkLogs - Analyzes network logs to identify unusual patterns.
 * - AnalyzeNetworkLogsInput - The input type for the analyzeNetworkLogs function.
 * - AnalyzeNetworkLogsOutput - The return type for the analyzeNetworkLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNetworkLogsInputSchema = z.object({
  networkLogs: z
    .string()
    .describe('Network logs in text format. Include timestamps and source/destination IPs.'),
});
export type AnalyzeNetworkLogsInput = z.infer<typeof AnalyzeNetworkLogsInputSchema>;

const AnalyzeNetworkLogsOutputSchema = z.object({
  anomalies: z
    .array(z.string())
    .describe('A list of detected anomalies in the network logs.'),
  severity: z
    .string()
    .describe(
      'The overall severity of the detected anomalies (e.g., low, medium, high).' + 
      'Return one of these values: LOW, MEDIUM, HIGH'
    ),
  suggestedActions: z
    .string()
    .describe('Suggested actions to mitigate the detected anomalies.'),
});
export type AnalyzeNetworkLogsOutput = z.infer<typeof AnalyzeNetworkLogsOutputSchema>;

export async function analyzeNetworkLogs(
  input: AnalyzeNetworkLogsInput
): Promise<AnalyzeNetworkLogsOutput> {
  return analyzeNetworkLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNetworkLogsPrompt',
  input: {schema: AnalyzeNetworkLogsInputSchema},
  output: {schema: AnalyzeNetworkLogsOutputSchema},
  prompt: `You are a network security expert analyzing network logs for anomalies.

  Analyze the following network logs for any unusual patterns or potential security threats.
  Identify any anomalies, their severity, and suggest actions to mitigate them.

  Network Logs:
  {{networkLogs}}

  Format your output as a JSON object with the following fields:
  - anomalies: A list of detected anomalies in the network logs.
  - severity: The overall severity of the detected anomalies (LOW, MEDIUM, HIGH).
  - suggestedActions: Suggested actions to mitigate the detected anomalies.
  `,
});

const analyzeNetworkLogsFlow = ai.defineFlow(
  {
    name: 'analyzeNetworkLogsFlow',
    inputSchema: AnalyzeNetworkLogsInputSchema,
    outputSchema: AnalyzeNetworkLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
