'use server';
/**
 * @fileOverview AI flow to determine the top attack origins from a list of IPs.
 *
 * - getTopAttackOrigins - A function that processes IPs to find top attack countries.
 * - GetTopAttackOriginsOutput - The return type for the function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {getIpInfo} from '@/ai/tools/get-ip-info';
import { GetTopAttackOriginsOutput, GetTopAttackOriginsOutputSchema } from '@/ai/schemas';


// This is a simulated list of recent threat IPs. In a real application,
// this data would come from a database or a live security feed.
const RECENT_THREAT_IPS = [
    '185.172.110.12', // Russia
    '202.8.9.1',       // China
    '202.8.9.2',       // China
    '45.146.164.110',  // Russia
    '1.1.1.1',         // USA (Cloudflare)
    '8.8.8.8',         // USA (Google)
    '195.12.12.12',    // Brazil
    '102.67.1.1',      // Nigeria
    '185.172.110.13', // Russia
    '45.146.164.111',  // Russia
    '202.8.9.3',       // China
    '188.114.97.7',    // USA (Vercel)
    '5.255.255.5',     // Germany
    '94.140.14.14',    // UK (AdGuard)
    '210.245.100.1',   // Vietnam
];


export async function getTopAttackOrigins(): Promise<GetTopAttackOriginsOutput> {
    return getTopAttackOriginsFlow({});
}

const getTopAttackOriginsFlow = ai.defineFlow(
  {
    name: 'getTopAttackOriginsFlow',
    inputSchema: z.object({}), // No input needed for this version
    outputSchema: GetTopAttackOriginsOutputSchema,
    tools: [getIpInfo],
  },
  async () => {
    // In a real-world scenario, you might have a more complex prompt.
    // For this use case, we are directly processing a list of IPs.
    const prompt = ai.definePrompt({
      name: 'ipGeolocatorPrompt',
      tools: [getIpInfo],
      prompt: `For each of the following IP addresses, use the getIpInfo tool to determine its country of origin.
      
      IPs:
      {{#each ips}}
      - {{{this}}}
      {{/each}}
      `,
    });

    const {toolRequests} = await prompt({ips: RECENT_THREAT_IPS});
    const countryCounts: Record<string, number> = {};

    for (const req of toolRequests) {
        const { country } = await ai.runTool(req);
        if (country && country !== 'Unknown') {
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        }
    }
    
    const sortedCountries = Object.entries(countryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);
        
    const attacks = sortedCountries.map(([countryCode, count]) => ({
        country: countryCode, // Returning the code, will map to name on client
        attacks: count
    }));

    return { attacks };
  }
);
