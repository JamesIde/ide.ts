import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/router";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  const isActive = (href: string) => router.pathname == href;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationMap = new Map<string, string>([
    ["Multiday Trips", "records"],
    ["Photo Collections", "collections"],
    ["About", "about"],
    ["Gear", "gear"],
  ]);

  // TODO combine into one
  const navStylesDesktop = "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";
  const navStylesDesktopActivated =
    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-orange-500";

  const navStylesMobile = "block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";
  const navStylesMobileActivated =
    "block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16 sm:h-20 ">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            James Ide
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {Array.from(navigationMap).map(([label, path]) => (
              <Link
                key={path}
                href={`/${path}`}
                className={isActive(`/${path}`) ? navStylesDesktopActivated : navStylesDesktop}
              >
                {label}
              </Link>
            ))}
            <div className="bg-black rounded-lg text-white py-1 px-2 text-sm hover:cursor-pointer">
              <a href="mailto:james.ide775@gmail.com" target="_blank">
                Contact
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className=" bg-background/95 backdrop-blur-md border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {Array.from(navigationMap).map(([label, path]) => (
              <Link
                key={path}
                href={`/${path}`}
                className={isActive(`/${path}`) ? navStylesMobileActivated : navStylesMobile}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {/* TODO */}
            <div className={navStylesMobile}>
              <a href="mailto:james.ide775@gmail.com" target="_blank">
                Contact
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
