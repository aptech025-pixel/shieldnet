'use server';

/**
 * @fileOverview A conversational AI assistant for the ShieldNet application.
 *
 * - chatAssistant - A function that handles the conversational chat logic.
 */

import {ai} from '@/ai/genkit';
import { ChatAssistantInput, ChatAssistantInputSchema, ChatAssistantOutput, ChatAssistantOutputSchema } from '@/ai/schemas';

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

export async function chatAssistant(
  input: ChatAssistantInput
): Promise<ChatAssistantOutput> {
    const chatAssistantFlow = ai.defineFlow(
      {
        name: 'chatAssistantFlow',
        inputSchema: ChatAssistantInputSchema,
        outputSchema: ChatAssistantOutputSchema,
      },
      async (input) => {
        const prompt = ai.definePrompt({
          name: 'chatAssistantPrompt',
          input: { schema: ChatAssistantInputSchema },
          output: { schema: ChatAssistantOutputSchema },
          system: `You are ShieldNet's friendly and helpful AI Assistant. Your goal is to assist users with questions about the ShieldNet application.
          
You are an expert on all of ShieldNet's features. Here is a detailed description of the application:
"""
${appDescription}
"""

When responding to users:
- Be concise, friendly, and professional.
- Use the provided context to answer questions accurately.
- If a user asks what you can do, give them a brief summary of the app's key features.
- If a user's query is unrelated to ShieldNet or cybersecurity, politely decline to answer and steer the conversation back to the application's functionality. For example: "I am ShieldNet's AI assistant and can only help with questions about this application. How can I help you with your network security today?"
`,
          prompt: `The user's latest request is:
{{{userRequest}}}
`,
        });

        // The current implementation is not using history, but it is available in the input.
        // For a more advanced chatbot, you would pass the history to the model.
        const {output} = await prompt(input);
        return output!;
      }
    );

    return chatAssistantFlow(input);
}
