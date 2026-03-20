import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.png";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, isStudent, login } = useAuth();
  const navigate = useNavigate();

  if (isAdmin) { navigate("/admin"); return null; }
  if (isStudent) { navigate("/dashboard"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", { email, password });
      
      // Determine which login to try based on email
      const isAdminEmail = email.includes('admin') || email === 'admin@saraswaticlasses.com';
      const userType = isAdminEmail ? "admin" : "student";
      
      const success = await login(email, password, userType);
      
      if (success) {
        // Navigate based on user type
        if (userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Display the error message from the API or a fallback
      const errorMessage = err?.message || "An error occurred during login";
      
      // Provide more specific guidance based on error type
      if (errorMessage.includes('blocked')) {
        setError(errorMessage);
      } else if (errorMessage.includes('credentials')) {
        setError(errorMessage);
      } else {
        // Generic error
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
                  <img src={logo} alt="Saraswati Classes Logo" className="h-12 w-auto object-contain" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">Login</h1>
                <p className="text-muted-foreground">Sign in as Admin or Student</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
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
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
              <div className="text-xs text-muted-foreground text-center mt-4 space-y-1">
                <p>Admin: admin@saraswaticlasses.com / admin@123</p>
                <p>Student: Use your registered email and password</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;