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
  const generateItReportFlow = ai.defineFlow(
    {
      name: 'generateItReportFlow',
      inputSchema: GenerateItReportInputSchema,
      outputSchema: GenerateItReportOutputSchema,
    },
    async input => {
        const prompt = ai.definePrompt({
          name: 'generateItReportPrompt',
          input: {schema: GenerateItReportInputSchema},
          output: {schema: GenerateItReportOutputSchema},
          prompt: `You are an expert IT support triage assistant. Your task is to take a user-submitted IT issue and transform it into a well-structured, actionable support ticket.

The user, {{{name}}} ({{{email}}}), has submitted the following report:
Subject: {{{subject}}}
Description: {{{description}}}

Based on this information, please generate the following:
1.  **generatedSubject**: A clear and concise subject line. Start it with "IT Support Ticket:".
2.  **category**: Classify the issue into one of the following categories: 'Hardware', 'Software', 'Network', 'Account', 'Other'.
3.  **priority**: Assess the severity and potential business impact to assign a priority level: 'Low', 'Medium', 'High', or 'Critical'. A user being unable to work is 'High' or 'Critical'. A minor inconvenience is 'Low'.
4.  **troubleshootingSteps**: Provide a list of 2-3 simple, actionable troubleshooting steps a non-technical user could attempt before an IT technician intervenes. These should be relevant to the described problem.
5.  **generatedBody**: A comprehensive report body pre-formatted for an email or ticketing system. Include the user's name and email at the top, their original description, and the potential impact of the issue.
`,
        });
      const {output} = await prompt(input);
      return output!;
    }
  );
  return generateItReportFlow(input);
}
