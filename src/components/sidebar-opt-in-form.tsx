import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export function SidebarOptInForm() {
  return (
    <Card className="gap-2 py-4 shadow-none">
      <CardHeader className="px-4">
        <Button
          asChild
          className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
          size="sm"
        >
          <Link href={"/admin/profile"}>PR</Link>
        </Button>
      </CardHeader>
    </Card>
  );
}
