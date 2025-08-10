import { z } from 'zod';

// schemas for analyze-network-logs.ts
export const AnalyzeNetworkLogsInputSchema = z.object({
  networkLogs: z
    .string()
    .describe('Network logs in text format. Include timestamps and source/destination IPs.'),
});
export type AnalyzeNetworkLogsInput = z.infer<typeof AnalyzeNetworkLogsInputSchema>;

export const AnalyzeNetworkLogsOutputSchema = z.object({
  anomalies: z
    .array(z.string())
    .describe('A list of detected anomalies in the network logs.'),
  severity: z
    .string()
    .describe(
      'The overall severity of the detected anomalies (e.g., low, medium, high).' + 
      'Return one of these values: LOW, MEDIUM, HIGH'
    ),
  suggestedActions: z
    .string()
    .describe('Suggested actions to mitigate the detected anomalies.'),
});
export type AnalyzeNetworkLogsOutput = z.infer<typeof AnalyzeNetworkLogsOutputSchema>;

// schemas for analyze-website.ts
export const AnalyzeWebsiteInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze.'),
});
export type AnalyzeWebsiteInput = z.infer<typeof AnalyzeWebsiteInputSchema>;

export const AnalyzeWebsiteOutputSchema = z.object({
  securityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('An overall security score for the website, from 0 to 100.'),
  vulnerabilitySummary: z
    .string()
    .describe('A brief summary of potential vulnerabilities found.'),
  performanceGrade: z
    .enum(['A', 'B', 'C', 'D', 'F'])
    .describe('A performance grade (A-F) based on simulated speed and optimization checks.'),
  recommendations: z
    .array(z.string())
    .describe('A list of actionable recommendations to improve security and performance.'),
});
export type AnalyzeWebsiteOutput = z.infer<typeof AnalyzeWebsiteOutputSchema>;

// schemas for explain-threat.ts
export const ExplainThreatInputSchema = z.object({
  threat: z.string().describe('The name of the threat, e.g., "SQL Injection Attempt".'),
  severity: z.string().describe('The severity of the threat (High, Medium, or Low).'),
  sourceIp: z.string().describe('The source IP address of the threat.'),
  status: z.string().describe('The current status of the threat (e.g., Blocked, Mitigated).'),
  date: z.string().describe('The date and time the threat was detected.'),
});
export type ExplainThreatInput = z.infer<typeof ExplainThreatInputSchema>;

export const ExplainThreatOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A clear, human-readable explanation of what the threat is and its potential impact.'),
  potentialImpact: z
    .string()
    .describe('A summary of the potential business or security impact if the threat is not handled.'),
  recommendations: z
    .array(z.string())
    .describe('A list of specific, actionable steps the user should take to mitigate the threat and improve security.'),
});
export type ExplainThreatOutput = z.infer<typeof ExplainThreatOutputSchema>;


// schemas for generate-firewall-rules.ts
export const GenerateFirewallRulesInputSchema = z.object({
  objective: z.string().describe("The user's high-level security objective (e.g., 'Block all traffic from North Korea')."),
});
export type GenerateFirewallRulesInput = z.infer<typeof GenerateFirewallRulesInputSchema>;

const FirewallRuleSchema = z.object({
    action: z.string().describe("The action to take (e.g., 'DENY', 'ALLOW')."),
    protocol: z.string().describe("The protocol (e.g., 'TCP', 'UDP', 'ICMP', 'ANY')."),
    source: z.string().describe("The source IP address or range (e.g., '192.168.1.0/24', 'ANY')."),
    destination: z.string().describe("The destination IP address or range."),
    port: z.string().describe("The port number or range (e.g., '443', '1024-65535')."),
    description: z.string().describe("A human-readable description of what the rule does."),
});

export const GenerateFirewallRulesOutputSchema = z.object({
    rules: z.array(FirewallRuleSchema).describe("A list of generated firewall rules."),
});
export type GenerateFirewallRulesOutput = z.infer<typeof GenerateFirewallRulesOutputSchema>;


// schemas for generate-it-report.ts
export const GenerateItReportInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the report.'),
  email: z.string().email().describe('The email address of the person submitting the report.'),
  subject: z.string().describe('The user-provided subject line for the issue.'),
  description: z.string().describe('The user-provided description of the issue.'),
});
export type GenerateItReportInput = z.infer<typeof GenerateItReportInputSchema>;

export const GenerateItReportOutputSchema = z.object({
  generatedSubject: z.string().describe('A concise, AI-generated subject line for the IT report.'),
  category: z.enum(['Hardware', 'Software', 'Network', 'Account', 'Other']).describe('The primary category of the IT issue.'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The assessed priority level of the ticket.'),
  troubleshootingSteps: z.array(z.string()).describe('A list of suggested initial troubleshooting steps for the user.'),
  generatedBody: z.string().describe('A detailed, well-structured report body generated by the AI, suitable for a ticketing system.'),
});
export type GenerateItReportOutput = z.infer<typeof GenerateItReportOutputSchema>;

// schemas for generate-password.ts
export const GeneratePasswordInputSchema = z.object({
  length: z.number().min(8).max(128).describe('The desired length of the password.'),
  useUppercase: z.boolean().describe('Whether to include uppercase letters.'),
  useLowercase: z.boolean().describe('Whether to include lowercase letters.'),
  useNumbers: z.boolean().describe('Whether to include numbers.'),
  useSymbols: z.boolean().describe('Whether to include symbols.'),
});
export type GeneratePasswordInput = z.infer<typeof GeneratePasswordInputSchema>;

export const GeneratePasswordOutputSchema = z.object({
  password: z.string().describe('The generated secure password.'),
  strengthAnalysis: z.string().describe('A brief analysis of the password\'s strength.'),
});
export type GeneratePasswordOutput = z.infer<typeof GeneratePasswordOutputSchema>;

// schemas for get-top-attack-origins.ts
const AttackOriginSchema = z.object({
  country: z.string().describe('The country code of the attack origin (e.g., "US", "RU").'),
  attacks: z.number().describe('The number of attacks from this country.'),
});

export const GetTopAttackOriginsOutputSchema = z.object({
  attacks: z.array(AttackOriginSchema).describe('A list of the top 10 attack origin countries.'),
});
export type GetTopAttackOriginsOutput = z.infer<typeof GetTopAttackOriginsOutputSchema>;

// schemas for analyze-email.ts
export const AnalyzeEmailInputSchema = z.object({
  emailContent: z.string().min(50).describe('The full content of the email to be analyzed.'),
});
export type AnalyzeEmailInput = z.infer<typeof AnalyzeEmailInputSchema>;

export const AnalyzeEmailOutputSchema = z.object({
    riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The assessed risk level of the email.'),
    summary: z.string().describe('A concise summary of the analysis findings.'),
    redFlags: z.array(z.string()).describe('A list of specific red flags identified in the email.'),
    recommendation: z.string().describe('An actionable recommendation for the user.'),
});
export type AnalyzeEmailOutput = z.infer<typeof AnalyzeEmailOutputSchema>;

// schemas for dark-web-scanner.ts
export const DarkWebScanInputSchema = z.object({
  email: z.string().email().describe('The email address to scan for in data breaches.'),
});
export type DarkWebScanInput = z.infer<typeof DarkWebScanInputSchema>;

const BreachInfoSchema = z.object({
  source: z.string().describe('The name of the company or service that was breached.'),
  date: z.string().describe('The approximate date of the breach (e.g., "July 2021").'),
  compromisedData: z.array(z.string()).describe('A list of the types of data that were compromised in the breach.'),
});

export const DarkWebScanOutputSchema = z.object({
    breaches: z.array(BreachInfoSchema).describe('A list of simulated data breaches where the email was found.'),
    summary: z.string().describe('A concise summary of the scan findings.'),
    recommendations: z.array(z.string()).describe('A list of actionable steps for the user to take.'),
});
export type DarkWebScanOutput = z.infer<typeof DarkWebScanOutputSchema>;

// schemas for chat-assistant.ts
const ToolRequestSchema = z.object({
  name: z.string(),
  input: z.any(),
});

const ToolResponseSchema = z.object({
  name: z.string(),
  output: z.any(),
});


export const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model', 'tool']),
    content: z.array(z.object({
      text: z.string().optional(),
      toolRequest: ToolRequestSchema.optional(),
      toolResponse: ToolResponseSchema.optional(),
    })),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatAssistantInputSchema = z.object({
  messages: z.array(ChatMessageSchema).describe("The history of the conversation."),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

export const ChatAssistantOutputSchema = z.object({
    message: ChatMessageSchema,
});
export type ChatAssistantOutput = z.infer<typeof ChatAssistantOutputSchema>;

// schemas for summarize-security-article.ts
export const SummarizeSecurityArticleInputSchema = z.object({
  articleContent: z.string().min(100).describe('The full text content of the cybersecurity news article.'),
  articleUrl: z.string().url().describe('The original URL of the article for reference.')
});
export type SummarizeSecurityArticleInput = z.infer<typeof SummarizeSecurityArticleInputSchema>;

export const SummarizeSecurityArticleOutputSchema = z.object({
  title: z.string().describe('A concise, compelling title for the article summary.'),
  summary: z.string().describe('A brief, easy-to-understand summary of the article, focusing on the key threat.'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The assessed severity of the threat discussed in the article.'),
  category: z.enum(['Vulnerability', 'Data Breach', 'Phishing', 'Malware', 'Ransomware', 'Cyberattack', 'Policy', 'Other']).describe('The primary category of the security threat.'),
  recommendations: z.array(z.string()).describe('A list of specific, actionable steps a user or small business can take to mitigate this threat.')
});
export type SummarizeSecurityArticleOutput = z.infer<typeof SummarizeSecurityArticleOutputSchema>;

// schemas for generate-phishing-campaign.ts
export const GeneratePhishingCampaignInputSchema = z.object({
  templateType: z.enum(['password-reset', 'document-shared', 'invoice-payment', 'hr-policy-update', 'new-device-login']).describe('The type of phishing template to use.'),
  targetCount: z.number().int().min(1).describe('The total number of employees targeted in the simulation.'),
  clickedCount: z.number().int().min(0).describe('The number of employees who clicked the simulated phishing link.'),
});
export type GeneratePhishingCampaignInput = z.infer<typeof GeneratePhishingCampaignInputSchema>;

export const GeneratePhishingCampaignOutputSchema = z.object({
  subject: z.string().describe('The AI-generated subject line for the phishing email.'),
  body: z.string().describe('The AI-generated HTML body of the phishing email.'),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The assessed risk level based on the click-through rate.'),
  keyTakeaways: z.string().describe('A summary of the campaign results and findings.'),
  recommendations: z.array(z.string()).describe('A list of actionable recommendations for follow-up training.'),
});
export type GeneratePhishingCampaignOutput = z.infer<typeof GeneratePhishingCampaignOutputSchema>;
