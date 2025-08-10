'use server';
/**
 * @fileOverview A tool to get geolocation information for an IP address.
 *
 * - getIpInfo - A Genkit tool that calls the ipinfo.io API.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GetIpInfoInputSchema = z.object({
  ip: z.string().describe('The IP address to geolocate.'),
});

const GetIpInfoOutputSchema = z.object({
  country: z.string().describe('The country associated with the IP address.'),
});

export const getIpInfo = ai.defineTool(
  {
    name: 'getIpInfo',
    description: 'Returns the country of origin for a given IP address.',
    inputSchema: GetIpInfoInputSchema,
    outputSchema: GetIpInfoOutputSchema,
  },
  async input => {
    const ipInfoUrl = `https://ipinfo.io/${input.ip}?token=${process.env.IPINFO_TOKEN}`;
    try {
      const response = await fetch(ipInfoUrl);
      if (!response.ok) {
        // Return a generic country if the lookup fails to avoid breaking the flow
        return { country: 'Unknown' };
      }
      const data = await response.json();
      // ipinfo.io returns the country as a two-letter code (e.g., 'US')
      return { country: data.country || 'Unknown' };
    } catch (error) {
      console.error(`Failed to fetch IP info for ${input.ip}:`, error);
      return { country: 'Unknown' };
    }
  }
);
