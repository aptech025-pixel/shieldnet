import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-network-logs.ts';
import '@/ai/flows/explain-threat.ts';
import '@/ai/flows/generate-it-report.ts';
