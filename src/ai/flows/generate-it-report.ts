'use server';

/**
 * @fileOverview AI-powered IT report generation flow.
 *
 * - generateItReport - Analyzes a user's problem description to generate a structured IT support ticket.
 */

import {ai} from '@/ai/genkit';
import { GenerateItReportInput, GenerateItReportInputSchema, GenerateItReportOutput, GenerateItReportOutputSchema } from '@/ai/schemas';

export async function generateItReport(
  input: GenerateItReportInput
): Promise<GenerateItReportOutput> {
  return generateItReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItReportPrompt',
  input: {schema: GenerateItReportInputSchema},
  output: {schema: GenerateItReportOutputSchema},
  prompt: `You are an expert IT support assistant. Your task is to take a user-submitted IT issue and transform it into a well-structured and detailed support ticket.

The user, {{{name}}} ({{{email}}}), has submitted the following report:
Subject: {{{subject}}}
Description: {{{description}}}

Based on this, please generate the following:
1.  **generatedSubject**: A clear and concise subject line. Start it with "IT Support Ticket:".
2.  **generatedBody**: A comprehensive report body. Structure it professionally. Include the user's original description and then add sections for "Potential Impact," "Affected System/Area," and "Initial Troubleshooting Steps Suggested" (if applicable). The body should be pre-formatted for an email. Include the user's name and email at the top of the body.

Example Output Format:
{
  "generatedSubject": "IT Support Ticket: Unable to Access Analytics Dashboard",
  "generatedBody": "User: John Doe\\nEmail: john.doe@example.com\\n\\nIssue Summary:\\nUser is unable to access the analytics dashboard and receives a 'permission denied' error.\\n\\nPotential Impact:\\nThis prevents the user from monitoring network traffic and threat analytics, potentially delaying response to security incidents.\\n\\nAffected System/Area:\\nAnalytics Dashboard (/analytics)\\n\\nDetails:\\n- User tried clearing their browser cache.\\n- The issue persists across different browsers (Chrome, Firefox)."
}
  `,
});

const generateItReportFlow = ai.defineFlow(
  {
    name: 'generateItReportFlow',
    inputSchema: GenerateItReportInputSchema,
    outputSchema: GenerateItReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
