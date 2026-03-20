import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.png";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    
    try {
      console.log("Attempting login with:", { email, password, userType: "admin" });
      const result = await login(email, password, "admin");
      console.log("Login result:", result);
      
      if (result) {
        console.log("Login successful, navigating to dashboard");
        navigate("/admin-dashboard");
      } else {
        console.log("Login failed - credentials incorrect");
        setError(`Invalid admin credentials.... Use admin@saraswaticlasses.com / admin@123, ${result}` as unknown as string);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
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
                    placeholder="admin@saraswaticlasses.com"
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
                <Button type="submit" className="w-full">
                  Login
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