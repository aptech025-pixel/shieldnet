
'use server';

/**
 * @fileOverview A conversational AI assistant for the ShieldNet application.
 *
 * - chatAssistant - A function that handles the conversational chat logic.
 */

import {ai} from '@/ai/genkit';
import {
  ChatAssistantInput,
  ChatAssistantInputSchema,
  ChatAssistantOutput,
  ChatAssistantOutputSchema,
  AnalyzeWebsiteInputSchema,
  AnalyzeWebsiteOutputSchema,
  AnalyzeEmailInputSchema,
  AnalyzeEmailOutputSchema,
  DarkWebScanInputSchema,
  DarkWebScanOutputSchema,
  GeneratePasswordInputSchema,
  GeneratePasswordOutputSchema,
  GenerateFirewallRulesInputSchema,
  GenerateFirewallRulesOutputSchema,
  ChatMessage,
} from '@/ai/schemas';
import {analyzeWebsite} from './analyze-website';
import {analyzeEmail} from './analyze-email';
import {darkWebScan} from './dark-web-scanner';
import {generatePassword} from './generate-password';
import {generateFirewallRules} from './generate-firewall-rules';

const appDescription = `
ShieldNet is an AI-powered cybersecurity suite for proactive network defense and IT management.

Key Features:
- Unified Dashboard: Real-time overview of system security, active threats, network traffic, and monitored external websites.
- AI Anomaly Detection: Users paste network logs, and the AI analyzes them to detect suspicious patterns and suggest mitigation actions.
- Interactive Threats Feed: Displays a live list of detected threats. Clicking a threat triggers an AI to provide a clear explanation and recommendations.
- Visual Analytics: Interactive charts for visualizing threat trends, network traffic by protocol, and geographic attack origins.
- AI Security Toolkit:
  - Secure Password Generator: Creates strong, random passwords with an AI strength analysis.
  - Phishing Email Analyzer: Scans email content for red flags.
  - Dark Web Exposure Scanner: Checks if an email has appeared in known data breaches.
- Intelligent IT Support Ticketing: Transforms user problem descriptions into structured support tickets with AI-assigned priority and troubleshooting steps.
- Natural Language Firewall Configuration: Translates plain English security goals into formal firewall rules.
- Persistent Website Monitoring: Tracks the status of user-added websites and runs on-demand AI security and performance analyses.
`;

// Tool definitions
const websiteAnalyzerTool = ai.defineTool(
  {
    name: 'analyzeWebsite',
    description: 'Analyzes a given website URL for security and performance issues. Returns a detailed report.',
    inputSchema: AnalyzeWebsiteInputSchema,
    outputSchema: AnalyzeWebsiteOutputSchema,
  },
  async (input) => await analyzeWebsite(input)
);

const emailAnalyzerTool = ai.defineTool(
    {
        name: 'analyzeEmail',
        description: 'Analyzes the content of an email for phishing indicators and other security threats.',
        inputSchema: AnalyzeEmailInputSchema,
        outputSchema: AnalyzeEmailOutputSchema,
    },
    async (input) => await analyzeEmail(input)
);

const darkWebScannerTool = ai.defineTool(
    {
        name: 'darkWebScan',
        description: 'Scans for a given email address in simulated data breaches to see if it has been compromised.',
        inputSchema: DarkWebScanInputSchema,
        outputSchema: DarkWebScanOutputSchema,
    },
    async (input) => await darkWebScan(input)
);

const passwordGeneratorTool = ai.defineTool(
    {
        name: 'generatePassword',
        description: 'Generates a strong, secure password based on specified criteria and analyzes its strength.',
        inputSchema: GeneratePasswordInputSchema,
        outputSchema: GeneratePasswordOutputSchema,
    },
    async (input) => await generatePassword(input)
);

const firewallRulesGeneratorTool = ai.defineTool(
    {
        name: 'generateFirewallRules',
        description: 'Generates a set of firewall rules based on a user\'s plain English security objective.',
        inputSchema: GenerateFirewallRulesInputSchema,
        outputSchema: GenerateFirewallRulesOutputSchema,
    },
    async (input) => await generateFirewallRules(input)
);


export async function chatAssistant(
  input: ChatAssistantInput
): Promise<ChatAssistantOutput> {
  const chatAssistantFlow = ai.defineFlow(
    {
      name: 'chatAssistantFlow',
      inputSchema: ChatAssistantInputSchema,
      outputSchema: ChatAssistantOutputSchema,
    },
    async ({messages}) => {
      const prompt = ai.definePrompt({
        name: 'chatAssistantPrompt',
        tools: [
            websiteAnalyzerTool,
            emailAnalyzerTool,
            darkWebScannerTool,
            passwordGeneratorTool,
            firewallRulesGeneratorTool
        ],
        system: `You are ShieldNet's friendly and helpful AI Assistant. Your goal is to assist users with questions about the ShieldNet application and general cybersecurity topics.
          
You are an expert on all of ShieldNet's features and have up-to-date knowledge of global cybersecurity news and trends. Here is a detailed description of the application you support:
"""
${appDescription}
"""

When responding to users:
- Be concise, friendly, and professional.
- Use the provided context and your general knowledge to answer questions accurately.
- If a user asks what you can do, give them a brief summary of your capabilities, highlighting the tools you can use.
- **You have a powerful set of tools at your disposal. Be proactive in using them.**
- If a user provides a website URL or asks you to check a site, you **MUST** use the 'analyzeWebsite' tool.
- If a user pastes email content or asks you to check a suspicious email, you **MUST** use the 'analyzeEmail' tool.
- If a user asks you to check if their email has been in a data breach, you **MUST** use the 'darkWebScan' tool.
- If a user asks you to generate a password, you **MUST** use the 'generatePassword' tool.
- If a user describes a security policy or asks for help with firewall configuration (e.g., "block all traffic from..."), you **MUST** use the 'generateFirewallRules' tool.
- **Do not ask for permission to use a tool; if the user's intent matches a tool, use it directly and present the results.**
- If a user's query is unrelated to ShieldNet or cybersecurity, politely decline to answer and steer the conversation back to the application's functionality. For example: "I am ShieldNet's AI assistant and can only help with questions about this application and cybersecurity. How can I help you with your network security today?"
`,
      });

      let currentMessages = [...messages];
      while (true) {
        const llmResponse = await prompt({history: currentMessages});

        if (llmResponse.toolRequest) {
            const toolRequest = llmResponse.toolRequest;
            const toolResponse = await ai.runTool(toolRequest);
            
            // Add the model's tool request and the tool's response to the history
            currentMessages = [
                ...currentMessages,
                { role: 'model', content: llmResponse.content },
                { role: 'tool', content: [{ toolResponse: { name: toolRequest.name, output: toolResponse.output } }] },
            ];
            // Continue the loop to get the next model response
            continue;
        }
        
        // If there's no tool request, it's the final answer.
        return { message: llmResponse.context };
      }
    }
  );

  return chatAssistantFlow(input);
}
