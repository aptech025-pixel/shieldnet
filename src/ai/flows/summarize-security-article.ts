'use server';
/**
 * @fileOverview AI flow to summarize a cybersecurity news article.
 *
 * - summarizeSecurityArticle - Analyzes article content to create a summary, assess severity, and provide recommendations.
 */

import {ai} from '@/ai/genkit';
import {
  SummarizeSecurityArticleInput,
  SummarizeSecurityArticleInputSchema,
  SummarizeSecurityArticleOutput,
  SummarizeSecurityArticleOutputSchema,
} from '@/ai/schemas';

export async function summarizeSecurityArticle(
  input: SummarizeSecurityArticleInput
): Promise<SummarizeSecurityArticleOutput> {
  const summarizeSecurityArticleFlow = ai.defineFlow(
    {
      name: 'summarizeSecurityArticleFlow',
      inputSchema: SummarizeSecurityArticleInputSchema,
      outputSchema: SummarizeSecurityArticleOutputSchema,
    },
    async (input) => {
      const prompt = ai.definePrompt({
        name: 'summarizeSecurityArticlePrompt',
        input: {schema: SummarizeSecurityArticleInputSchema},
        output: {schema: SummarizeSecurityArticleOutputSchema},
        prompt: `You are an expert cybersecurity analyst tasked with briefing a non-technical audience on a recent threat. Analyze the provided article content and generate a structured report.

Article URL (for context): {{{articleUrl}}}
Article Content:
"""
{{{articleContent}}}
"""

Your task is to produce a JSON object with the following fields:
1.  **title**: Create a clear and compelling title for the summary. For example, "Critical Flaw in Popular 'WidgetPro' Library Exposes User Data."
2.  **summary**: Write a concise, one-paragraph summary (3-4 sentences) explaining the core issue in simple terms. Focus on what the threat is and who it impacts.
3.  **severity**: Assess the overall risk and assign a severity level. Choose one: 'Low', 'Medium', 'High', 'Critical'.
4.  **category**: Classify the threat into one of these categories: 'Vulnerability', 'Data Breach', 'Phishing', 'Malware', 'Ransomware', 'Cyberattack', 'Policy', 'Other'.
5.  **recommendations**: Provide a list of 3-4 specific, actionable steps a small business or individual user should take to protect themselves from this threat. For example, "Update your 'WidgetPro' library to version 2.5.1 immediately" or "Enable multi-factor authentication on all financial accounts."
`,
      });
      const {output} = await prompt(input);
      return output!;
    }
  );
  return summarizeSecurityArticleFlow(input);
}
