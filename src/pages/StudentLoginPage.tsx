import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.png";
import { Loader2 } from "lucide-react";

const StudentLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isStudent, login } = useAuth();
  const navigate = useNavigate();

  // redirect if already logged in
  useEffect(() => {
    if (isStudent) {
      navigate("/student-dashboard");
    }
  }, [isStudent, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      console.log("Attempting student login with:", { email, password });
      const success = await login(email, password, "student");
      
      if (success) {
        console.log("Student login successful, navigating to dashboard");
        navigate("/student-dashboard");
      }
    } catch (err: any) {
      console.error("Student login error:", err);
      console.log("Error message:", err?.message);
      console.log("Full error object:", err);
      
      // Display specific error message
      const errorMessage = err?.message || "An error occurred during login";
      setError(errorMessage);
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
                <h1 className="text-3xl md:text-4xl font-bold">
                  Student Login
                </h1>
                <p className="text-muted-foreground text-sm">
                  Access your enrolled courses, test series and profile.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="student@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="student-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="student-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••"
                      className="pr-10"
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
                  <p className="text-sm text-destructive" aria-live="polite">
                    {error}
                  </p>
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

export default StudentLoginPage;