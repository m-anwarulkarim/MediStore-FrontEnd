import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Profile = {
  name: string;
  email: string;
  image?: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
};

type Props = {
  user: Profile;
};

export default function ProfileCard({ user }: Props) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image
          src={user.image || "/avatar.png"}
          alt={user.name}
          width={80}
          height={80}
          className="rounded-full border"
        />
        <div>
          <CardTitle className="text-xl">{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Phone" value={user.phone} />
          <InfoItem label="Role" value={user.role} />
          <InfoItem
            label="Status"
            value={
              <Badge
                variant={user.status === "Active" ? "default" : "secondary"}
              >
                {user.status}
              </Badge>
            }
          />
        </div>

        <Separator />
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
