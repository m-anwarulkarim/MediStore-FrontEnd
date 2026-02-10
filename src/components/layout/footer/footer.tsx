import {
  GithubIcon,
  Mail,
  MapPin,
  Phone,
  FacebookIcon,
  LinkedinIcon,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { MedistorLogo } from "../../../../public/MedistorLogo";

const footerCols = [
  {
    title: "Company",
    links: [
      { title: "About Us", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Privacy Policy", href: "#" },
      { title: "Terms & Conditions", href: "#" },
    ],
  },
  {
    title: "Shop",
    links: [
      { title: "Products", href: "/products" },
      { title: "Categories", href: "/category" },
      { title: "Flash Sale", href: "/products?tag=flash" },
      { title: "My Orders", href: "/orders" },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "FAQ", href: "#" },
      { title: "Contact", href: "#" },
      { title: "Delivery Info", href: "#" },
      { title: "Return Policy", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <MedistorLogo className="h-12 w-auto" />
              </div>

              <p className="mt-4 max-w-[52ch] text-sm text-muted-foreground">
                Your trusted online medicine store. Browse genuine medicines and
                wellness products with fast delivery and a smooth shopping
                experience.
              </p>

              {/* Contact quick info */}
              <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Bangladesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+880 1602867954</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>anwarulkarim13@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Columns */}
            {footerCols.map((col) => (
              <div key={col.title}>
                <div className="text-sm font-semibold">{col.title}</div>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.title}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                      >
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social */}
            <div>
              <div className="text-sm font-semibold">Follow</div>
              <div className="mt-4 flex items-center gap-3 text-muted-foreground">
                <Link
                  href="https://www.facebook.com/profile.php?id=100090871429446"
                  aria-label="Twitter"
                  className="rounded-full p-2 hover:bg-accent hover:text-foreground transition"
                >
                  <FacebookIcon className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  aria-label="Dribbble"
                  className="rounded-full p-2 hover:bg-accent hover:text-foreground transition"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </Link>

                <Link
                  href="https://github.com/m-anwarulkarim"
                  aria-label="GitHub"
                  className="rounded-full p-2 hover:bg-accent hover:text-foreground transition"
                >
                  <GithubIcon className="h-5 w-5" />
                </Link>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Get updates on offers & new products.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 py-6 sm:flex-row">
          <span className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Medistor. All rights reserved.
          </span>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
