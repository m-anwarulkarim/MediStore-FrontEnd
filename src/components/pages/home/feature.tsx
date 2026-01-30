import {
  Settings2,
  Blocks,
  Bot,
  Film,
  ChartPie,
  MessageCircle,
} from "lucide-react";

const features = [
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

const FeatureSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-(--breakpoint-xl) px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Explore Medistor Features
        </h2>
        <p className="mt-4 max-w-[60ch] mx-auto text-foreground/80 sm:text-lg">
          Medistor brings all your healthcare needs to one place. Discover
          features that make ordering, managing, and tracking your medicines
          easier than ever.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-start rounded-xl border p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-foreground/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
