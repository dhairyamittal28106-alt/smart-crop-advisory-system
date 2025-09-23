"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchDailyTips, Tip } from "@/lib/daily-tips";

export default function DailyTipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTips = async () => {
      try {
        const data = await fetchDailyTips();
        setTips(data);
      } catch (err) {
        console.error("Failed to load daily tips:", err);
        setError("Failed to load daily tips. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadTips();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Daily Tips</h1>
                <p className="text-xs text-muted-foreground">Seasonal farming tips and best practices</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Daily Tips!</CardTitle>
            <CardDescription>
              Here you will find seasonal advice and best practices to help you get the most out of your crops.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading tips...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8 text-red-500">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                {tips.map((tip) => (
                  <div key={tip.id} className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold text-sm">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
