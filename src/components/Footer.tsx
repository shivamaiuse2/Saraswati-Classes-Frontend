import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Youtube, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-14">

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logo}
              alt="Saraswati Classes Logo"
              className="h-12 w-auto object-contain"
            />
            <span className="text-lg font-semibold">
              Saraswati Classes
            </span>
          </div>

          <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-[260px]">
            Empowering students to achieve academic excellence through
            quality education and personalized guidance.
          </p>

          <div className="flex gap-4 mt-4">
            <a
              href="https://wa.me/919421018326"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-green-500 text-white hover:scale-110 transition"
            >
              <MessageCircle size={18} />
            </a>

            <a
              href="https://www.facebook.com/saraswaticlasses2002"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-blue-600 text-white hover:scale-110 transition"
            >
              <Facebook size={18} />
            </a>

            <a
              href="https://www.youtube.com/@SaraswatiClasses-cc2es"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-red-600 text-white hover:scale-110 transition"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-sm font-semibold mb-4">
            Quick Links
          </h4>

          <div className="flex flex-col gap-3 text-sm text-primary-foreground/80">
            <Link to="/courses" className="hover:text-white transition">
              Courses
            </Link>

            <Link to="/test-series" className="hover:text-white transition">
              Test Series
            </Link>

            <Link to="/about" className="hover:text-white transition">
              About Us
            </Link>

            <Link to="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>

{/* PROGRAMS */}
<div>
  <h4 className="text-sm font-semibold mb-4">
    Programs
  </h4>

  <div className="flex flex-col gap-3 text-sm text-primary-foreground/80">

    <span className="cursor-pointer hover:text-white hover:translate-x-1 transition-all duration-200">
      CBSE Board
    </span>

    <span className="cursor-pointer hover:text-white hover:translate-x-1 transition-all duration-200">
      SSC Board
    </span>

    <span className="cursor-pointer hover:text-white hover:translate-x-1 transition-all duration-200">
      JEE / CET / NEET
    </span>

    <span className="cursor-pointer hover:text-white hover:translate-x-1 transition-all duration-200">
      Test Series
    </span>

  </div>
</div>

        {/* CONTACT */}
<div>
  <h4 className="text-sm font-semibold mb-4">
    Contact
  </h4>

  <div className="flex flex-col gap-4 text-sm text-primary-foreground/80">

    {/* PHONE */}
    <a
      href="tel:9421018326"
      className="flex items-center gap-3 hover:text-white transition"
    >
      <Phone className="h-4 w-4 shrink-0" />
      <span>+91 9421018326 / 9420464332</span>
    </a>

    {/* EMAIL (FIXED ICON + LINK) */}
    <a
  href="mailto:saraswaticlasses2002@gmail.com"
  className="flex items-center gap-3 hover:text-white transition whitespace-nowrap"
>
  <Mail className="h-4 w-4 shrink-0" />
  <span className="text-sm">
    saraswaticlasses2002@gmail.com
  </span>
</a>

    {/* ADDRESS */}
    <div className="flex items-start gap-3 leading-relaxed">
      <MapPin className="h-4 w-4 mt-1 shrink-0" />
      <span>
        Saraswati Classes,<br />
        201, Chamanlal Complex,<br />
        Above Bank of Maharashtra,<br />
        Anand Nagar, Sinhgad Road,<br />
        Pune, Maharashtra 411051
      </span>
    </div>

  </div>
</div>

      </div>


      {/* DIVIDER */}
      <div className="border-t border-primary-foreground/20 mt-12 pt-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/70">

          {/* LEFT */}
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} Saraswati Classes. All rights reserved.
          </div>


          {/* CENTER */}
          <div className="text-center leading-relaxed">

            <div>
              Designed & Developed by SynergexAi
            </div>

            <a
              href="mailto:contact@synergexai.com"
              className="block hover:text-white transition"
            >
              contact@synergexai.com
            </a>

            <a
              href="tel:7385249974"
              className="block hover:text-white transition"
            >
              7385249974
            </a>

          </div>


          {/* RIGHT */}
          <div className="flex gap-6 text-center md:text-right">
            <Link to="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>

            <Link to="/terms" className="hover:text-white transition">
              Terms of Use
            </Link>
          </div>

        </div>

      </div>

    </div>
  </footer>
);

export default Footer;