import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import contactService from "@/services/contactService";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const formData = {
        name,
        email,
        phone,
        message,
      };

      // Use the public inquiry endpoint instead of contact form
      const response = await contactService.submitPublicInquiry(formData);

      if (response.success) {
        toast({
          title: "Inquiry Submitted!",
          description: "We've received your inquiry and will contact you soon.",
        });

        // Reset form
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(response.message || "Failed to submit inquiry");
      }
    } catch (error: any) {
      console.error("Error submitting inquiry form:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Using default contact information for now, as there's no dedicated endpoint for site settings
  const contactDetails = [
    {
      icon: Phone,
      label: "Phone",
      value: "9421018326, 9420464332",
    },
    {
      icon: Mail,
      label: "Email",
      value: "Saraswaticlasses2002@gmail.com",
    },
    {
      icon: MapPin,
      label: "Address",
      value:
        "Saraswati Classes, 201, Chamanlal Complex, Above Bank of Maharashtra, Anand Nagar, Sinhgad Road, Pune",
    },
    {
      icon: Clock,
      label: "Working Hours",
      value:
        "Mon–Sat: 9:00 AM – 1:30 PM, 4:00 PM – 8:30 PM | Sunday: 8:00 AM – 12:00 PM",
    },
  ];

  return (
    <Layout>
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-14">

          {/* Heading */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#0F172A]">
              Contact Saraswati Classes
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              For admissions, counselling or course inquiries, feel free to
              contact us or submit the inquiry form below.
            </p>
          </div>

          {/* Contact + Form */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Contact Info */}
            <div className="space-y-4">

              {contactDetails.map((item) => {
                const Icon = item.icon;
                return (
                  // <Card key={item.label} className="rounded-xl shadow-sm">
                  //   <CardContent className="p-5 flex items-center gap-4">

                  //     <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  //       <Icon className="h-5 w-5 text-primary" />
                  //     </div>

                  //     <div>
                  //       <p className="font-medium text-sm">{item.label}</p>
                  //       <p className="text-muted-foreground">{item.value}</p>
                  //     </div>

                  //   </CardContent>
                  // </Card>
                  <Card
                    key={item.label}
                    className="rounded-xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="h-11 w-11 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium text-sm text-[#0F172A]">
                          {item.label}
                        </p>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

            </div>

            {/* Contact Form */}
            <Card className="rounded-xl border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-5">

                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Inquiry / Appointment Form
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
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
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your inquiry"
                      required
                      disabled={isLoading}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Sending...
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

          </div>

          {/* Google Map */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-[#0F172A]">
              Visit Our Coaching Centre
            </h2>

            <div className="rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition">
              <iframe
                title="Saraswati Classes Location"
                src="https://www.google.com/maps?q=Saraswati+Classes+Sinhgad+Road+Pune&output=embed"
                className="w-full h-[350px] border-0"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;