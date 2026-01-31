import Footer from "@/components/layout/footer/footer";
import Navbar from "@/components/layout/navber/navbar";
import { ThemeProvider } from "@/components/provider/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      {" "}
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
