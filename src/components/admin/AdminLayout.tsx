import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import AdminSidebar, { type AdminTab } from "./AdminSidebar";
import NetworkErrorBanner from "@/components/NetworkErrorBanner";

interface AdminLayoutProps {
  active: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  children: ReactNode;
}

const AdminLayout = ({ active, onChangeTab, children }: AdminLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <p className="font-semibold text-sm md:text-base">
              Admin Dashboard
            </p>
          </div>
        </div>
      </header>
      
      <NetworkErrorBanner />

      <div className="flex flex-1">
        <AdminSidebar active={active} setActive={onChangeTab} />

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop/Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() => setMobileOpen(false)}
              />
              {/* Sidebar Panel */}
              <motion.div
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-40 w-64 md:hidden shadow-xl bg-background"
              >
                {/* Mobile close button */}
                <div className="absolute top-3 right-3 z-50">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <AdminSidebar
                  active={active}
                  setActive={(tab) => {
                    onChangeTab(tab as AdminTab);
                    setMobileOpen(false);
                  }}
                  isMobile={true} // Pass mobile flag
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

