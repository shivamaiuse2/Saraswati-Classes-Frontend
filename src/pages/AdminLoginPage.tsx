import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Loader2, WifiOff, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();

  // redirect if already authenticated
  useEffect(() => {
    if (isAdmin) {
      navigate("/admin-dashboard");
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsNetworkError(false);
    setIsLoading(true);

    try {
      const result = await login(email, password, "admin");

      if (result) {
        navigate("/admin-dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Check if it's a network error
      if (err?.isNetworkError) {
        setIsNetworkError(true);
        setError("Unable to connect to the server. Please check your internet connection.");
      } else if (err?.isTimeout) {
        setError("Request timed out. Please try again.");
      } else {
        // Display the error message from backend or a default message
        const errorMessage = err?.message || "Invalid credentials. Please try again.";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="py-12 md:py-16 min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="text-center mb-6 space-y-2">
                <div className="flex justify-center">
                  <img
                    src={logo}
                    alt="Saraswati Classes Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">Admin Login</h1>
                <p className="text-muted-foreground text-sm">
                  Manage courses, test series, students and inquiries.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter admin email"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••"
                      className="pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className={`flex items-center gap-2 p-3 rounded-md ${isNetworkError ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {isNetworkError ? (
                      <WifiOff className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    )}
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLoginPage;