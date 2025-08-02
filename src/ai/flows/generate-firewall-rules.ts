'use server';
/**
 * @fileOverview AI-powered firewall rule generation flow.
 *
 * - generateFirewallRules - Analyzes a user's security objective to generate firewall rules.
 */

import {ai} from '@/ai/genkit';
import { GenerateFirewallRulesInput, GenerateFirewallRulesInputSchema, GenerateFirewallRulesOutput, GenerateFirewallRulesOutputSchema } from '@/ai/schemas';


export async function generateFirewallRules(
  input: GenerateFirewallRulesInput
): Promise<GenerateFirewallRulesOutput> {
  return generateFirewallRulesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFirewallRulesPrompt',
  input: {schema: GenerateFirewallRulesInputSchema},
  output: {schema: GenerateFirewallRulesOutputSchema},
  prompt: `You are a world-class cybersecurity expert specializing in network firewall configuration. Your task is to convert a user's high-level security objective into a set of specific, actionable firewall rules.

User's Objective:
"{{{objective}}}"

Based on this objective, generate a list of firewall rules. Each rule should be a JSON object with the following fields:
- action: 'ALLOW' or 'DENY'.
- protocol: 'TCP', 'UDP', 'ICMP', or 'ANY'.
- source: The source IP address, CIDR block, or 'ANY'.
- destination: The destination IP address, CIDR block, or 'ANY'.
- port: The port number, a range (e.g., '1024-65535'), or 'ANY'.
- description: A clear, concise explanation of the rule's purpose.

Start with a default DENY ALL rule if it makes sense for the user objective. Be specific and secure. For example, if the user wants to allow web traffic, only open ports 80 and 443, not all ports.
If a country is mentioned, find the corresponding IP address blocks for that country to create the rules.
`,
});

const generateFirewallRulesFlow = ai.defineFlow(
  {
    name: 'generateFirewallRulesFlow',
    inputSchema: GenerateFirewallRulesInputSchema,
    outputSchema: GenerateFirewallRulesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
