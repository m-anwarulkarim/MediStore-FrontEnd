import { ThemeProvider } from "@/components/provider/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      {" "}
      <main className="min-h-screen">{children}</main>
    </ThemeProvider>
  );
}
