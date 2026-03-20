import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Youtube, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  // Using default contact information for now, as there's no dedicated endpoint for site settings
  const contactInfo = {
    phones: ["+91 9421018326", "+91 9420464332"],
    email: "Saraswaticlasses2002@gmail.com",
    address: "Sinhgad Road, Pune, Maharashtra",
    whatsapp: "https://wa.me/919421018326",
    facebook: "https://www.facebook.com/saraswaticlasses2002",
    youtube: "https://www.youtube.com/@SaraswatiClasses-cc2es"
  };

  return (
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
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-500 text-white hover:scale-110 transition"
              >
                <MessageCircle size={18} />
              </a>

              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-600 text-white hover:scale-110 transition"
              >
                <Facebook size={18} />
              </a>

              <a
                href={contactInfo.youtube}
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
              <span>CBSE Foundation</span>
              <span>SSC Board</span>
              <span>JEE / CET / NEET</span>
              <span>Test Series</span>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-sm font-semibold mb-4">
              Contact
            </h4>

            <div className="flex flex-col gap-3 text-sm text-primary-foreground/80">

              {contactInfo.phones.map((phone, index) => (
                <span key={index} className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {phone}
                </span>
              ))}

              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {contactInfo.email}
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {contactInfo.address}
              </span>

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
};

export default Footer;