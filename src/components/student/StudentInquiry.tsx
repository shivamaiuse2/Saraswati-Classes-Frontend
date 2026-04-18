import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import contactService from "@/services/contactService";

const StudentInquiry = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Set initial values when currentUser is available
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.studentProfile?.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.studentProfile?.phone || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const inquiryData = {
        name,
        email,
        phone,
        message,
      };

      // Use the student inquiry endpoint (which handles authentication)
      const response = await contactService.submitInquiry(inquiryData);
      
      if (response.success) {
        toast({
          title: "Inquiry Submitted!",
          description: "We've received your inquiry and will contact you soon.",
        });
        
        // Reset form
        setMessage("");
      } else {
        throw new Error(response.message || "Failed to submit inquiry");
      }
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold mb-1">Submit Inquiry</h1>
        <p className="text-sm text-muted-foreground">
          Have questions or need assistance? Submit an inquiry and our team will get back to you.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inquiry-name">Full Name *</Label>
                <Input
                  id="inquiry-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inquiry-email">Email *</Label>
                <Input
                  id="inquiry-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inquiry-phone">Mobile No. *</Label>
              <Input
                id="inquiry-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inquiry-message">Message *</Label>
              <Textarea
                id="inquiry-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry or question..."
                required
                disabled={isLoading}
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Inquiry
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Phone:</span> 9421018326, 9420464332</p>
            <p><span className="font-medium">Email:</span> Saraswaticlasses2002@gmail.com</p>
            <p><span className="font-medium">Address:</span> Saraswati Classes, 201, Chamanlal Complex, Above Bank of Maharashtra, Anand Nagar, Sinhgad Road, Pune</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentInquiry;