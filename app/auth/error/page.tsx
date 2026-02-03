import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="border-border/50 shadow-lg text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-base">
              Something went wrong
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We encountered an error during authentication. This could be due
              to an expired link, invalid credentials, or a temporary issue.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Button asChild>
                <Link href="/auth/login">Try Again</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
