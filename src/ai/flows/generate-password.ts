'use server';
/**
 * @fileOverview AI-powered secure password generation and analysis flow.
 *
 * - generatePassword - Generates a secure password and provides a strength analysis.
 */

import {ai} from '@/ai/genkit';
import { GeneratePasswordInput, GeneratePasswordInputSchema, GeneratePasswordOutput, GeneratePasswordOutputSchema } from '@/ai/schemas';

export async function generatePassword(
  input: GeneratePasswordInput
): Promise<GeneratePasswordOutput> {
  const generatePasswordFlow = ai.defineFlow(
    {
      name: 'generatePasswordFlow',
      inputSchema: GeneratePasswordInputSchema,
      outputSchema: GeneratePasswordOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
          name: 'generatePasswordPrompt',
          input: {schema: GeneratePasswordInputSchema},
          output: {schema: GeneratePasswordOutputSchema},
          prompt: `You are a cybersecurity expert specializing in password security. Your task is to generate a strong, random password based on the user's criteria and then provide a brief analysis of its strength.

User Criteria:
- Length: {{{length}}}
- Include Uppercase: {{{useUppercase}}}
- Include Lowercase: {{{useLowercase}}}
- Include Numbers: {{{useNumbers}}}
- Include Symbols: {{{useSymbols}}}

Instructions:
1.  **Generate Password**: Create a random password that adheres strictly to the user's specified length and character set requirements.
2.  **Strength Analysis**: Provide a concise, one or two-sentence analysis of the generated password's strength. Explain *why* it is strong (e.g., "This password has excellent strength due to its length and the mix of uppercase letters, numbers, and symbols, making it highly resistant to brute-force attacks.").

Do not include the password itself in the analysis text.
`,
        });
      const {output} = await prompt(input);
      return output!;
    }
  );
  return generatePasswordFlow(input);
}
