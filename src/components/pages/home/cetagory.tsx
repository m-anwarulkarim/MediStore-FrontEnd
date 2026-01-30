import {
  Blocks,
  Bot,
  ChartPie,
  Film,
  MessageCircle,
  Settings2,
} from "lucide-react";

const cetagory = [
  {
    icon: Settings2,
    title: "Customizable Orders",
    description:
      "Easily manage your medicine orders with flexible options and personalized preferences.",
  },
  {
    icon: Blocks,
    title: "Wide Product Range",
    description:
      "Browse medicines, wellness products, and healthcare essentials all in one place.",
  },
  {
    icon: Bot,
    title: "Smart Refill Reminders",
    description:
      "Get automated reminders to refill prescriptions on time and stay healthy.",
  },
  {
    icon: Film,
    title: "Health Tips & Videos",
    description:
      "Watch educational content and tips from professionals to maintain your well-being.",
  },
  {
    icon: ChartPie,
    title: "Order Analytics",
    description:
      "Track your purchases, medicine usage, and trends with intuitive charts.",
  },
  {
    icon: MessageCircle,
    title: "Customer Support",
    description:
      "Chat with our healthcare experts anytime for guidance or assistance.",
  },
];

const CetagoryPage = () => {
  return (
    <div className="flex min-h-sm items-center justify-center py-12">
      <div>
        <h2 className="text-center font-semibold text-4xl tracking-tight sm:text-5xl">
          Explore Medistor cetagory
        </h2>
        <div className="mx-auto mt-10 grid max-w-(--breakpoint-lg) gap-6 px-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {cetagory.map((feature) => (
            <div
              className="flex flex-col rounded-xl border px-5 py-6"
              key={feature.title}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <feature.icon className="size-5" />
              </div>
              <span className="font-semibold text-lg">{feature.title}</span>
              <p className="mt-1 text-[15px] text-foreground/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CetagoryPage;
