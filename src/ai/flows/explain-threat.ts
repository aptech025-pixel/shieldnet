'use server';

/**
 * @fileOverview AI-powered threat explanation flow.
 *
 * - explainThreat - Analyzes a threat to provide an explanation and recommendations.
 * - ExplainThreatInput - The input type for the explainThreat function.
 * - ExplainThreatOutput - The return type for the explainThreat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainThreatInputSchema = z.object({
  threat: z.string().describe('The name of the threat, e.g., "SQL Injection Attempt".'),
  severity: z.string().describe('The severity of the threat (High, Medium, or Low).'),
  sourceIp: z.string().describe('The source IP address of the threat.'),
  status: z.string().describe('The current status of the threat (e.g., Blocked, Mitigated).'),
  date: z.string().describe('The date and time the threat was detected.'),
});
export type ExplainThreatInput = z.infer<typeof ExplainThreatInputSchema>;

const ExplainThreatOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A clear, human-readable explanation of what the threat is and its potential impact.'),
  recommendations: z
    .array(z.string())
    .describe('A list of specific, actionable steps the user should take to mitigate the threat and improve security.'),
});
export type ExplainThreatOutput = z.infer<typeof ExplainThreatOutputSchema>;


export async function explainThreat(
  input: ExplainThreatInput
): Promise<ExplainThreatOutput> {
  return explainThreatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainThreatPrompt',
  input: {schema: ExplainThreatInputSchema},
  output: {schema: ExplainThreatOutputSchema},
  prompt: `You are a senior cybersecurity analyst. A security threat has been detected and you need to explain it to a non-technical user and provide clear, actionable recommendations.

  Threat Details:
  - Threat: {{{threat}}}
  - Severity: {{{severity}}}
  - Status: {{{status}}}
  - Source IP: {{{sourceIp}}}
  - Date: {{{date}}}

  Based on these details, provide the following in a JSON object:
  1.  **explanation**: A clear, concise explanation of what this threat is. Avoid overly technical jargon. Explain the potential risk if it were not handled.
  2.  **recommendations**: A list of 3-5 specific, actionable steps the user should take. These should be practical for a small business owner. For example, instead of "reconfigure firewall," suggest "Block the source IP address ({{{sourceIp}}}) in your firewall settings."

  Example Output Format:
  {
    "explanation": "A SQL Injection is an attempt by an attacker to manipulate your database...",
    "recommendations": [
      "Immediately block the source IP address ({{{sourceIp}}}) in your firewall.",
      "Review the application code to ensure all database queries are parameterized.",
      "Check database logs for any signs of unauthorized access or data exfiltration around the time of the event."
    ]
  }
  `,
});

const explainThreatFlow = ai.defineFlow(
  {
    name: 'explainThreatFlow',
    inputSchema: ExplainThreatInputSchema,
    outputSchema: ExplainThreatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
