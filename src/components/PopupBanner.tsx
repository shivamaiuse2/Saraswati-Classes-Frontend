import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

const PopupBanner = () => {
  const { popup } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (!popup.enabled || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Megaphone className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-sm">{popup.title}</span>
              <span className="text-sm opacity-90 ml-2 hidden sm:inline">{popup.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to={popup.ctaLink}>
              <Button size="sm" variant="secondary" className="text-xs">
                {popup.ctaText}
              </Button>
            </Link>
            <button onClick={() => setDismissed(true)} aria-label="Dismiss banner" className="opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PopupBanner;
