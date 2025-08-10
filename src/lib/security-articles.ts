export type SecurityArticle = {
    url: string;
    source: string;
    content: string;
};

// A curated list of real-world security articles for the AI to analyze.
// In a real application, this would come from a live news API.
export const securityArticles: SecurityArticle[] = [
    {
        url: "https://www.bleepingcomputer.com/news/security/cisa-warns-of-actively-exploited-microsoft-sharepoint-rce-flaw/",
        source: "BleepingComputer",
        content: `CISA has added a Microsoft SharePoint remote code execution (RCE) vulnerability to its list of known exploited vulnerabilities, requiring federal agencies to patch it by August 21, 2024. The vulnerability, tracked as CVE-2023-29357, allows attackers to gain admin privileges on unpatched servers by spoofing JWT authentication tokens. Microsoft patched this flaw during the June 2023 Patch Tuesday. It can be chained with another code injection vulnerability (CVE-2023-24955) to achieve remote code execution. Security researchers demonstrated this exploit chain at the Pwn2Own Vancouver 2023 hacking contest. Despite patches being available, many organizations remain vulnerable due to slow patch adoption. Both CISA and the NSA have urged organizations to apply the security updates immediately to fend off potential attacks.`
    },
    {
        url: "https://thehackernews.com/2024/07/new-critical-rce-flaw-in-grafana-could.html",
        source: "The Hacker News",
        content: `A critical remote code execution (RCE) vulnerability, identified as CVE-2024-5473, has been discovered in Grafana, a popular open-source platform for monitoring and observability. The flaw could allow an unauthenticated attacker to execute arbitrary code on the host system. The vulnerability exists in a specific data source plugin and affects multiple versions of Grafana. Users are strongly advised to update to the latest patched versions immediately. The issue stems from improper input validation, which can be exploited to achieve full server takeover. Grafana has released security patches and recommends all users to review their instances and apply the necessary updates to mitigate the risk.`
    },
    {
        url: "https://www.securityweek.com/data-of-22-million-scraped-from-australian-ticketing-giant-teg/",
        source: "SecurityWeek",
        content: `Australian ticketing giant TEG has disclosed a data breach affecting 22 million user accounts after the data was found being sold on the dark web. The compromised data was scraped from a publicly accessible API and includes customer names, email addresses, phone numbers, and dates of birth. While no passwords or financial information were exposed, the personal data can be used for phishing attacks and identity theft. The company has since secured the API and is notifying affected customers. This incident highlights the security risks associated with misconfigured APIs and the importance of implementing rate limiting and access controls to prevent large-scale data scraping.`
    },
    {
        url: "https://www.wired.com/story/social-engineering-scams-cybersecurity/",
        source: "WIRED",
        content: `A new wave of sophisticated social engineering scams is targeting corporate employees through voice phishing (vishing) and multi-factor authentication (MFA) fatigue attacks. Attackers impersonate IT support staff, tricking employees into revealing their credentials or approving MFA push notifications. These attacks bypass traditional security measures by exploiting human psychology. Security experts recommend organizations conduct regular employee training to recognize these tactics, implement number-matching MFA, and establish clear out-of-band verification procedures for any sensitive requests from IT personnel. Vigilance and a healthy dose of skepticism are key defenses against these evolving human-centric attacks.`
    }
];
