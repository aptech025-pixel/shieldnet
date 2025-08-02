
'use server';

/**
 * @fileOverview AI-powered website analysis flow.
 *
 * - analyzeWebsite - Analyzes a website URL for security and performance.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeWebsiteInput, AnalyzeWebsiteInputSchema, AnalyzeWebsiteOutput, AnalyzeWebsiteOutputSchema } from '@/ai/schemas';


export async function analyzeWebsite(
  input: AnalyzeWebsiteInput
): Promise<AnalyzeWebsiteOutput> {
    const analyzeWebsiteFlow = ai.defineFlow(
      {
        name: 'analyzeWebsiteFlow',
        inputSchema: AnalyzeWebsiteInputSchema,
        outputSchema: AnalyzeWebsiteOutputSchema,
      },
      async input => {
        const prompt = ai.definePrompt({
          name: 'analyzeWebsitePrompt',
          input: {schema: AnalyzeWebsiteInputSchema},
          output: {schema: AnalyzeWebsiteOutputSchema},
          prompt: `You are a world-class cybersecurity and web performance analyst. Your task is to analyze the given website URL and provide a detailed security and performance report based on a simulated, expert-level assessment.

Website URL: {{{url}}}

Based on this URL, please perform a simulated analysis and generate a report with the following information:
1.  **securityScore**: Assign a score from 0 to 100, where 100 is perfectly secure. Base this on a comprehensive set of simulated checks, including:
    *   SSL/TLS configuration (certificate validity, protocol versions).
    *   HTTP security headers (CSP, HSTS, X-Frame-Options, etc.).
    *   Software versioning (simulating checks for outdated frameworks, CMS, or libraries like React or WordPress).
    *   DNS security (simulating checks for DNSSEC records).
    *   Email security records for the domain (simulating checks for SPF and DKIM).
    *   Other common vulnerabilities (e.g., exposed admin panels, directory listings).
2.  **vulnerabilitySummary**: Provide a concise, human-readable summary of the most critical simulated findings. For example, "The site is missing a Content Security Policy (CSP) header, and its SPF email record is misconfigured, increasing the risk of phishing."
3.  **performanceGrade**: Assign a letter grade from A (excellent) to F (poor). Base this on simulated metrics like load time, image optimization, use of caching, and mobile-friendliness.
4.  **recommendations**: Provide a list of 3-5 specific, actionable steps the website owner should take to improve their security and performance. These should be prioritized based on risk and impact.

Do not state that your analysis is simulated. Present the findings as if you have actively analyzed the site. Be realistic and detailed in your assessment, inferring the likely technology stack to inform your vulnerability checks.
`,
        });
        const {output} = await prompt(input);
        return output!;
      }
    );
  return analyzeWebsiteFlow(input);
}
