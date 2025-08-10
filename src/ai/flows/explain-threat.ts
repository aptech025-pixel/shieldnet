'use server';

/**
 * @fileOverview AI-powered threat explanation flow.
 *
 * - explainThreat - Analyzes a threat to provide an explanation and recommendations.
 */

import {ai} from '@/ai/genkit';
import { ExplainThreatInput, ExplainThreatInputSchema, ExplainThreatOutput, ExplainThreatOutputSchema } from '@/ai/schemas';


export async function explainThreat(
  input: ExplainThreatInput
): Promise<ExplainThreatOutput> {
  const explainThreatFlow = ai.defineFlow(
    {
      name: 'explainThreatFlow',
      inputSchema: ExplainThreatInputSchema,
      outputSchema: ExplainThreatOutputSchema,
    },
    async input => {
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
  1.  **explanation**: A clear, concise explanation of what this threat is. Avoid overly technical jargon.
  2.  **potentialImpact**: Describe the potential business or security impact if this threat were not handled successfully. For example, "This could lead to unauthorized access to customer data" or "An attacker could take your website offline."
  3.  **recommendations**: A list of 3-5 specific, actionable steps the user should take. These should be practical for a small business owner. For example, instead of "reconfigure firewall," suggest "Block the source IP address ({{{sourceIp}}}) in your firewall settings."

  Example Output Format:
  {
    "explanation": "A SQL Injection is an attempt by an attacker to manipulate your database...",
    "potentialImpact": "If successful, an attacker could steal, modify, or delete sensitive customer information from your database.",
    "recommendations": [
      "Immediately block the source IP address ({{{sourceIp}}}) in your firewall.",
      "Review the application code to ensure all database queries are parameterized.",
      "Check database logs for any signs of unauthorized access or data exfiltration around the time of the event."
    ]
  }
  `,
        });
      const {output} = await prompt(input);
      return output!;
    }
  );
  return explainThreatFlow(input);
}
