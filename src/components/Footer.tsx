import { Mail, MapPin, Phone, X, PlaySquare, Globe, Link } from "lucide-react";

const quickLinks = ["Home", "Upcoming Events", "About", "Contact"];
const socialLinks = [
  { name: "X", Icon: X, href: "https://x.com/socialserve" },
  { name: "YouTube", Icon: PlaySquare, href: "https://youtube.com/socialserve" },
  { name: "Web", Icon: Globe, href: "https://socialserve.org" },
  { name: "Profile", Icon: Link, href: "https://linkedin.com/company/socialserve" },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                <span className="text-violet-600 font-bold">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                SocialServe
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Together for a better society.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label={link.name}
                >
                  <link.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>Dhaka, Bangladesh</p>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <p>support@socialserve.org</p>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <p>+880 1234 567890</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 SocialServe. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with <span className="text-red-500">❤️</span> for a better community
          </p>
        </div>
      </div>
    </footer>
  );
}
