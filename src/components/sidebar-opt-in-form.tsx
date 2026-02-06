import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function SidebarOptInForm() {
  return (
    <Card className="gap-2 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">Subscribe to our newsletter</CardTitle>
        <Button
          className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
          size="sm"
        >
          Subscribe
        </Button>
      </CardHeader>
    </Card>
  );
}
