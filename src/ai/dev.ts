import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-network-logs.ts';
import '@/ai/flows/explain-threat.ts';
import '@/ai/flows/generate-it-report.ts';
import '@/ai/flows/generate-firewall-rules.ts';
import '@/ai/flows/analyze-website.ts';
import '@/ai/flows/generate-password.ts';
import '@/ai/flows/get-top-attack-origins.ts';
import '@/ai/flows/analyze-email.ts';
import '@/ai/flows/dark-web-scanner.ts';
