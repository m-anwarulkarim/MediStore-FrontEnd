import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-primary">404</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Page Not Found</h2>
          <p className="text-sm text-muted-foreground">
            Sorry, the page you are looking for does not exist or has been
            moved.
          </p>

          <Button asChild className="w-full">
            <Link href="/">← Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
