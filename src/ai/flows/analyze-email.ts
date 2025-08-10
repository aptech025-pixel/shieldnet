'use server';

/**
 * @fileOverview AI-powered phishing email analysis flow.
 *
 * - analyzeEmail - Analyzes email content for phishing indicators.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeEmailInput, AnalyzeEmailInputSchema, AnalyzeEmailOutput, AnalyzeEmailOutputSchema } from '@/ai/schemas';

export async function analyzeEmail(
  input: AnalyzeEmailInput
): Promise<AnalyzeEmailOutput> {
  const analyzeEmailFlow = ai.defineFlow(
    {
      name: 'analyzeEmailFlow',
      inputSchema: AnalyzeEmailInputSchema,
      outputSchema: AnalyzeEmailOutputSchema,
    },
    async input => {
        const prompt = ai.definePrompt({
            name: 'analyzeEmailPrompt',
            input: {schema: AnalyzeEmailInputSchema},
            output: {schema: AnalyzeEmailOutputSchema},
            prompt: `You are an expert cybersecurity analyst specializing in detecting phishing attempts. Your task is to analyze the following email content and determine if it is a phishing attempt.

Email Content:
"""
{{{emailContent}}}
"""

Analyze the email for the following red flags:
- Mismatched sender information (e.g., 'From' name doesn't match email address).
- Generic greetings (e.g., "Dear Customer").
- Urgent or threatening language creating a false sense of urgency.
- Requests for sensitive information (passwords, credit card numbers, etc.).
- Suspicious links or attachments (check the apparent URL vs. the actual link if provided).
- Poor grammar and spelling mistakes.
- Unsolicited attachments.
- Offers that seem too good to be true.

Based on your analysis, provide the following in a JSON object:
1.  **riskLevel**: Assess the overall risk. Choose one: 'Low', 'Medium', 'High', 'Critical'. 'Low' means it is very likely safe. 'Critical' means it is almost certainly a malicious phishing attempt.
2.  **summary**: Provide a concise, one-sentence summary of your findings.
3.  **redFlags**: A list of specific red flags you identified in the email. If no red flags are found, return an empty array.
4.  **recommendation**: Based on the risk level, provide a clear, actionable recommendation. For 'Low', suggest it's likely safe. For 'Medium', advise caution. For 'High' or 'Critical', strongly recommend deleting the email and not clicking any links.
`,
        });

      const {output} = await prompt(input);
      return output!;
    }
  );
  return analyzeEmailFlow(input);
}
