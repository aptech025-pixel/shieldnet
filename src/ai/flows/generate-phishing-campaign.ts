'use server';
/**
 * @fileOverview AI flow to generate content for a simulated phishing campaign.
 *
 * - generatePhishingCampaign - Creates email content and a post-campaign debrief.
 */

import {ai} from '@/ai/genkit';
import {
  GeneratePhishingCampaignInput,
  GeneratePhishingCampaignInputSchema,
  GeneratePhishingCampaignOutput,
  GeneratePhishingCampaignOutputSchema,
} from '@/ai/schemas';

const TEMPLATE_DETAILS: Record<string, string> = {
    'password-reset': "A fake alert that the user's password has expired and needs to be reset immediately, creating a sense of urgency.",
    'document-shared': "A notification that a colleague has shared an important document, prompting the user to click a link to view it.",
    'invoice-payment': "An urgent request to review and pay an outstanding invoice, often with a link to a fake payment portal.",
    'hr-policy-update': "An announcement about a mandatory new HR policy that requires employees to log in and acknowledge the changes.",
    'new-device-login': "A security alert claiming a new device has logged into the user's account, urging them to click a link to secure their account."
};


export async function generatePhishingCampaign(
  input: GeneratePhishingCampaignInput
): Promise<GeneratePhishingCampaignOutput> {
  const generatePhishingCampaignFlow = ai.defineFlow(
    {
      name: 'generatePhishingCampaignFlow',
      inputSchema: GeneratePhishingCampaignInputSchema,
      outputSchema: GeneratePhishingCampaignOutputSchema,
    },
    async (input) => {
      const prompt = ai.definePrompt({
        name: 'generatePhishingCampaignPrompt',
        input: {schema: GeneratePhishingCampaignInputSchema},
        output: {schema: GeneratePhishingCampaignOutputSchema},
        prompt: `You are a cybersecurity training expert creating a simulated phishing campaign. Your task is to generate realistic email content and a helpful post-campaign debrief.

Campaign Details:
- Template Type: {{{templateType}}}
- Template Description: ${TEMPLATE_DETAILS[input.templateType]}
- Target Count: {{{targetCount}}}
- Clicked Count: {{{clickedCount}}}

Instructions:

1.  **Generate Email Content**:
    *   **subject**: Create a believable, urgent, and clickable subject line for the chosen template.
    *   **body**: Write the HTML body of the phishing email. It should look professional but contain subtle red flags (e.g., generic greeting, slight sense of urgency, a link to a suspicious-looking but fake URL like "http://shieldnet-secure-login.com/reset"). Make the link the most prominent call-to-action.

2.  **Generate Post-Campaign Debrief**:
    *   **riskLevel**: Based on the click-through rate (clickedCount / targetCount), assess the team's risk level. Use 'Low' (<10%), 'Medium' (10-30%), 'High' (30-60%), or 'Critical' (>60%).
    *   **keyTakeaways**: Provide a concise summary of the campaign's results and what it reveals about the team's security posture.
    *   **recommendations**: Generate a list of 3-4 specific, actionable recommendations for a follow-up training session. These should be constructive and educational, not punitive. For example, "Show the team how to hover over links to inspect the actual URL" or "Discuss the psychological tactics used, such as creating a false sense of urgency."

Your response must be a single JSON object containing all the requested fields.
`,
      });
      const {output} = await prompt(input);
      return output!;
    }
  );
  return generatePhishingCampaignFlow(input);
}
