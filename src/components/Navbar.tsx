import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Test Series", to: "/test-series" },
  { label: "About", to: "/about" },
  { label: "Resources", to: "/resources" },
  { label: "Results", to: "/results" },
  { label: "Blog", to: "/blog" },
  { label: "Contact / Enroll", to: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const goToLogin = (role: "student" | "admin") => {
    if (role === "student") {
      navigate("/student-login");
    } else {
      navigate("/admin-login");
    }
  };

  const isActive = (path: string) => {
    const { pathname } = location;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 shadow-md"
          : "bg-background/80 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 w-full flex items-center justify-between h-16">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logo}
            alt="Saraswati Classes Logo"
            className="h-9 md:h-10 w-auto object-contain"
          />
          <span className="text-xl font-bold text-foreground">
            Saraswati Classes
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-x-6">
          <nav className="flex items-center gap-x-6">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                  isActive(l.to) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Login Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => goToLogin("student")}>
                Student Login
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => goToLogin("admin")}>
                Admin Login
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 border-t backdrop-blur-lg">
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium py-2 ${
                  isActive(l.to) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Login
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => goToLogin("student")}
                >
                  Student Login
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => goToLogin("admin")}
                >
                  Admin Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;