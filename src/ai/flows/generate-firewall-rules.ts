'use server';
/**
 * @fileOverview AI-powered firewall rule generation flow.
 *
 * - generateFirewallRules - Analyzes a user's security objective to generate firewall rules.
 * - GenerateFirewallRulesInput - The input type for the generateFirewallRules function.
 * - GenerateFirewallRulesOutput - The return type for the generateFirewallRules function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFirewallRulesInputSchema = z.object({
  objective: z.string().describe("The user's high-level security objective (e.g., 'Block all traffic from North Korea')."),
});
export type GenerateFirewallRulesInput = z.infer<typeof GenerateFirewallRulesInputSchema>;

const FirewallRuleSchema = z.object({
    action: z.string().describe("The action to take (e.g., 'DENY', 'ALLOW')."),
    protocol: z.string().describe("The protocol (e.g., 'TCP', 'UDP', 'ANY')."),
    source: z.string().describe("The source IP address or range (e.g., '192.168.1.0/24', 'ANY')."),
    destination: z.string().describe("The destination IP address or range."),
    port: z.string().describe("The port number or range (e.g., '443', '1024-65535')."),
    description: z.string().describe("A human-readable description of what the rule does."),
});

const GenerateFirewallRulesOutputSchema = z.object({
    rules: z.array(FirewallRuleSchema).describe("A list of generated firewall rules."),
});
export type GenerateFirewallRulesOutput = z.infer<typeof GenerateFirewallRulesOutputSchema>;


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
