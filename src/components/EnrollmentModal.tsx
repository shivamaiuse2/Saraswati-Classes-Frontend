import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  courseOrSeries: string;
}

const EnrollmentModal = ({ open, onClose, courseOrSeries }: EnrollmentModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl w-full max-w-3xl p-4 sm:p-6 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Enrollment form"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold">
                  Enroll for{" "}
                  <span className="text-primary">
                    {courseOrSeries || "Saraswati Classes Program"}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Please fill the Google Form below. Our team will contact you
                  with the next steps.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="ml-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mt-3 sm:mt-4 flex-1">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500/10 via-primary/5 to-purple-500/10 pointer-events-none" />
              <div className="relative rounded-xl overflow-hidden border bg-background/80 h-full">
                <iframe
                  title="Saraswati Classes Enrollment Form"
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfgXqkrEzNzkcp430MlmaxguwsntiPlgWicTxlM0g7Q1nT5Sg/viewform?embedded=true"
                  className="w-full h-[60vh] sm:h-[70vh]"
                >
                  Loading…
                </iframe>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnrollmentModal;
