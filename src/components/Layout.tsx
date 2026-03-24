import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import PopupBanner from "@/components/PopupBanner";
import NetworkErrorBanner from "@/components/NetworkErrorBanner";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <NetworkErrorBanner />
    <PopupBanner />
    <main className="flex-1 pt-16 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </main>
    <Footer />
    <FloatingWhatsapp />
  </div>
);

export default Layout;