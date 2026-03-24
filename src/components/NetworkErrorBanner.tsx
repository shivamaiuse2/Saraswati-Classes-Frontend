import { WifiOff, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

const NetworkErrorBanner = () => {
  const { networkError, clearNetworkError, loadCourses, loadTestSeries } = useApp();

  if (!networkError) return null;

  const handleRetry = async () => {
    clearNetworkError();
    await Promise.all([loadCourses(), loadTestSeries()]);
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">{networkError}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
          <button
            onClick={clearNetworkError}
            className="text-yellow-600 hover:text-yellow-800 p-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkErrorBanner;
