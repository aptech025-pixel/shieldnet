"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menu, Rss, AlertTriangle, Shield, CheckCircle, ListChecks, ExternalLink, Siren } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { summarizeSecurityArticleAction } from '@/app/actions';
import type { SummarizeSecurityArticleOutput } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { securityArticles, type SecurityArticle } from '@/lib/security-articles';
import Link from 'next/link';

type AnalyzedArticle = SummarizeSecurityArticleOutput & {
    url: string;
    source: string;
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  switch (severity) {
    case 'Critical':
        return <Badge variant="destructive" className="capitalize gap-1"><Siren className="h-3 w-3" /> {severity}</Badge>;
    case 'High':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-500/80 capitalize gap-1"><AlertTriangle className="h-3 w-3" /> {severity}</Badge>;
    case 'Medium':
        return <Badge className="bg-yellow-500 text-black hover:bg-yellow-500/80 capitalize gap-1"><Shield className="h-3 w-3" /> {severity}</Badge>;
    case 'Low':
        return <Badge variant="secondary" className="capitalize gap-1"><CheckCircle className="h-3 w-3" /> {severity}</Badge>;
    default:
        return <Badge variant="outline" className="capitalize">{severity}</Badge>;
  }
};


export default function IntelPage() {
  const { toggleSidebar } = useSidebar();
  const [analyzedArticles, setAnalyzedArticles] = useState<AnalyzedArticle[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const processArticle = useCallback(async (article: SecurityArticle) => {
    setLoadingStates(prev => ({ ...prev, [article.url]: true }));
    try {
      const result = await summarizeSecurityArticleAction({
        articleContent: article.content,
        articleUrl: article.url,
      });
      setAnalyzedArticles(prev => [...prev, { ...result, url: article.url, source: article.source }]);
    } catch (error) {
      console.error(`Failed to analyze article ${article.url}:`, error);
      // Optionally add an error state to the UI
    } finally {
       setLoadingStates(prev => ({ ...prev, [article.url]: false }));
    }
  }, []);

  useEffect(() => {
    // Process articles one by one to avoid overwhelming the API
    const processAll = async () => {
      for (const article of securityArticles) {
        // Avoid re-processing
        if (!analyzedArticles.some(a => a.url === article.url) && !loadingStates[article.url]) {
          await processArticle(article);
        }
      }
    };
    processAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const ArticleSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
        <div>
            <Skeleton className="h-5 w-1/3 mb-2" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
      </CardContent>
       <CardFooter>
            <Skeleton className="h-8 w-36" />
      </CardFooter>
    </Card>
  );

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background">
      <div className="flex items-center justify-between space-y-2 flex-wrap">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
             <Menu />
             <span className="sr-only">Toggle sidebar</span>
           </Button>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-headline flex items-center gap-2"><Rss /> Threat Intel Feed</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        An AI-curated feed of the latest global cybersecurity threats, vulnerabilities, and news.
      </p>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {analyzedArticles.map((article, index) => (
             <Card key={index} className="flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">{article.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
                        <SeverityBadge severity={article.severity} />
                        <Badge variant="outline">{article.category}</Badge>
                        <span>Source: {article.source}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                    <p className="text-sm text-muted-foreground">{article.summary}</p>
                    <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2 mb-2"><ListChecks /> Recommendations</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            {article.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline" size="sm">
                        <Link href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Read Full Article
                        </Link>
                    </Button>
                </CardFooter>
             </Card>
        ))}
         {Object.keys(loadingStates).filter(url => loadingStates[url]).map(url => <ArticleSkeleton key={url} />)}
      </div>

    </main>
  );
}
