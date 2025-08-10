'use server';

/**
 * @fileOverview AI-powered dark web exposure scanner flow.
 *
 * - darkWebScan - Simulates a scan to see if an email has been in a data breach.
 */

import {ai} from '@/ai/genkit';
import { DarkWebScanInput, DarkWebScanInputSchema, DarkWebScanOutput, DarkWebScanOutputSchema } from '@/ai/schemas';

export async function darkWebScan(
  input: DarkWebScanInput
): Promise<DarkWebScanOutput> {
  const darkWebScanFlow = ai.defineFlow(
    {
      name: 'darkWebScanFlow',
      inputSchema: DarkWebScanInputSchema,
      outputSchema: DarkWebScanOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'darkWebScanPrompt',
            input: {schema: DarkWebScanInputSchema},
            output: {schema: DarkWebScanOutputSchema},
            prompt: `You are a cybersecurity analyst with access to a database of known data breaches. Your task is to check if the provided email address has appeared in any of these breaches.

Email address to scan: {{{email}}}

Instructions:
1.  **Simulate a Scan**: Do not use any real-world tools or databases. Instead, simulate a scan against a fictional database of breaches. To make the simulation realistic, invent 2 to 4 fictional data breach events for the given email address. For each breach, invent a company name, a date, and a list of compromised data types (e.g., "Email", "Password", "Username", "Phone Number").
2.  **Generate a Summary**: Provide a brief, one-sentence summary of the findings. If breaches are found, state how many were detected.
3.  **Provide Recommendations**: Give a list of clear, actionable steps the user should take to mitigate the risk, such as changing passwords for affected accounts, enabling two-factor authentication, and being vigilant for phishing attempts.
4.  **Format the Output**: Return a JSON object containing the list of breaches, the summary, and the recommendations. If you invent no breaches, return an empty array for the 'breaches' field.`,
        });
      const {output} = await prompt(input);
      return output!;
    }
  );
  return darkWebScanFlow(input);
}
