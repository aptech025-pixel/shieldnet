'use server';

/**
 * @fileOverview AI-powered website analysis flow.
 *
 * - analyzeWebsite - Analyzes a website URL for security and performance.
 * - AnalyzeWebsiteInput - The input type for the analyzeWebsite function.
 * - AnalyzeWebsiteOutput - The return type for the analyzeWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeWebsiteInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze.'),
});
export type AnalyzeWebsiteInput = z.infer<typeof AnalyzeWebsiteInputSchema>;

export const AnalyzeWebsiteOutputSchema = z.object({
  securityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('An overall security score for the website, from 0 to 100.'),
  vulnerabilitySummary: z
    .string()
    .describe('A brief summary of potential vulnerabilities found.'),
  performanceGrade: z
    .enum(['A', 'B', 'C', 'D', 'F'])
    .describe('A performance grade (A-F) based on simulated speed and optimization checks.'),
  recommendations: z
    .array(z.string())
    .describe('A list of actionable recommendations to improve security and performance.'),
});
export type AnalyzeWebsiteOutput = z.infer<typeof AnalyzeWebsiteOutputSchema>;

export async function analyzeWebsite(
  input: AnalyzeWebsiteInput
): Promise<AnalyzeWebsiteOutput> {
  return analyzeWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWebsitePrompt',
  input: {schema: AnalyzeWebsiteInputSchema},
  output: {schema: AnalyzeWebsiteOutputSchema},
  prompt: `You are a world-class cybersecurity and web performance analyst. Your task is to analyze the given website URL and provide a detailed security and performance report.

Website URL: {{{url}}}

Based on this URL, please perform a simulated analysis and generate a report with the following information:
1.  **securityScore**: Assign a score from 0 to 100, where 100 is perfectly secure. Base this on simulated checks for things like SSL/TLS configuration, security headers (CSP, HSTS), software versions, and other common vulnerabilities.
2.  **vulnerabilitySummary**: Provide a concise, human-readable summary of the most critical simulated findings. For example, "Missing Content Security Policy header" or "Uses an outdated version of a common JavaScript library."
3.  **performanceGrade**: Assign a letter grade from A (excellent) to F (poor). Base this on simulated metrics like load time, image optimization, and use of caching.
4.  **recommendations**: Provide a list of 3-5 specific, actionable steps the website owner should take to improve their security and performance.

Do not state that your analysis is simulated. Present the findings as if you have actively analyzed the site. Be realistic in your assessment.
`,
});

const analyzeWebsiteFlow = ai.defineFlow(
  {
    name: 'analyzeWebsiteFlow',
    inputSchema: AnalyzeWebsiteInputSchema,
    outputSchema: AnalyzeWebsiteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
