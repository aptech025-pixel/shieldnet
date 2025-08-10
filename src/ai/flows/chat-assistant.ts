
'use server';

/**
 * @fileOverview A conversational AI assistant for the ShieldNet application.
 *
 * - chatAssistant - A function that handles the conversational chat logic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  ChatAssistantInput,
  ChatAssistantInputSchema,
  ChatAssistantOutput,
  ChatAssistantOutputSchema,
  AnalyzeWebsiteOutputSchema,
  ChatMessageSchema,
} from '@/ai/schemas';
import {analyzeWebsite} from './analyze-website';

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

const websiteAnalyzerTool = ai.defineTool(
  {
    name: 'analyzeWebsite',
    description:
      'Analyzes a given website URL for security and performance issues. Returns a detailed report.',
    inputSchema: z.object({url: z.string().url()}),
    outputSchema: AnalyzeWebsiteOutputSchema,
  },
  async input => {
    return await analyzeWebsite(input);
  }
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
        tools: [websiteAnalyzerTool],
        system: `You are ShieldNet's friendly and helpful AI Assistant. Your goal is to assist users with questions about the ShieldNet application and general cybersecurity topics.
          
You are an expert on all of ShieldNet's features and have up-to-date knowledge of global cybersecurity news and trends. Here is a detailed description of the application:
"""
${appDescription}
"""

When responding to users:
- Be concise, friendly, and professional.
- Use the provided context and your general knowledge to answer questions accurately.
- If a user asks what you can do, give them a brief summary of the app's key features and mention you can also answer general cybersecurity questions.
- **If a user provides a website URL or asks you to check a site, you MUST use the 'analyzeWebsite' tool to run a security and performance scan.** Do not ask for permission; just run the scan and present the results in a clear, summarized, and conversational way.
- If a user's query is unrelated to ShieldNet or cybersecurity, politely decline to answer and steer the conversation back to the application's functionality. For example: "I am ShieldNet's AI assistant and can only help with questions about this application and cybersecurity. How can I help you with your network security today?"
`,
      });

      const llmResponse = await prompt.run({input: messages});
      
      const hasToolRequest = llmResponse.toolRequests.length > 0;

      if (!hasToolRequest) {
        return { message: llmResponse.context };
      }
      
      const toolResponse = await ai.runTools({
          requests: llmResponse.toolRequests,
      });

      const finalLlmResponse = await prompt.run({
          input: [
            ...messages,
            llmResponse.context,
            ...toolResponse.map(r => r.context)
          ],
      });
      
      return { message: finalLlmResponse.context };

    }
  );

  return chatAssistantFlow(input);
}
