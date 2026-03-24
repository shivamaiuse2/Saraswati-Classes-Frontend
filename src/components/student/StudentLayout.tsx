import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import StudentSidebar from "./StudentSidebar";
import { useAuth } from "@/context/AuthContext";
import NetworkErrorBanner from "@/components/NetworkErrorBanner";

type TabKey = "overview" | "courses" | "tests" | "results" | "profile";

interface StudentLayoutProps {
  children: ReactNode;
  active: TabKey;
  onChangeTab: (key: TabKey) => void;
}

const StudentLayout = ({ children, active, onChangeTab }: StudentLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentStudent } = useAuth();

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
              Student Dashboard
            </p>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            Welcome, {currentStudent?.name || "Student"}
          </p>
        </div>
      </header>
      
      <NetworkErrorBanner />

      <div className="flex flex-1">
        <StudentSidebar active={active} onChange={(k) => onChangeTab(k as TabKey)} />

        {/* Mobile sidebar */}
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
                className="fixed inset-y-0 left-0 z-40 w-60 md:hidden shadow-xl bg-background"
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
                <StudentSidebar
                  active={active}
                  onChange={(k) => {
                    onChangeTab(k as TabKey);
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

export type { TabKey };
export default StudentLayout;

