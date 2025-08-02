'use server';

/**
 * @fileOverview AI-powered network log analysis flow for anomaly detection.
 *
 * - analyzeNetworkLogs - Analyzes network logs to identify unusual patterns.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeNetworkLogsInput, AnalyzeNetworkLogsInputSchema, AnalyzeNetworkLogsOutput, AnalyzeNetworkLogsOutputSchema } from '@/ai/schemas';

export async function analyzeNetworkLogs(
  input: AnalyzeNetworkLogsInput
): Promise<AnalyzeNetworkLogsOutput> {
  const analyzeNetworkLogsFlow = ai.defineFlow(
    {
      name: 'analyzeNetworkLogsFlow',
      inputSchema: AnalyzeNetworkLogsInputSchema,
      outputSchema: AnalyzeNetworkLogsOutputSchema,
    },
    async input => {
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

      const {output} = await prompt(input);
      return output!;
    }
  );
  return analyzeNetworkLogsFlow(input);
}
