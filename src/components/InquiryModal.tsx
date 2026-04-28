import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import contactService from "@/services/contactService";

interface InquiryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseOrSeries?: string;
}

const InquiryModal = ({ open, onOpenChange, courseOrSeries }: InquiryModalProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (open && courseOrSeries) {
            setMessage(`I am interested in ${courseOrSeries}. Please provide more details.`);
        } else if (open) {
            setMessage("");
        }
    }, [open, courseOrSeries]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = { name, email, phone, message };
            const response = await contactService.submitPublicInquiry(formData);

            if (response.success) {
                toast({
                    title: "Inquiry Submitted!",
                    description: "We've received your inquiry and will contact you soon.",
                });
                setName("");
                setPhone("");
                setEmail("");
                setMessage("");
                onOpenChange(false);
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
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-[#0F172A]">Inquiry / Appointment Form</DialogTitle>
                    <DialogDescription>
                        Please fill out the form below to get more details or schedule an appointment.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="modal-name">Full Name</Label>
                        <Input
                            id="modal-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="modal-phone">Mobile No.</Label>
                            <Input
                                id="modal-phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter phone number"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="modal-email">Email</Label>
                            <Input
                                id="modal-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="modal-message">Message</Label>
                        <Textarea
                            id="modal-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your inquiry"
                            required
                            disabled={isSubmitting}
                            rows={4}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Send className="mr-2 h-4 w-4 animate-pulse" />
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
            </DialogContent>
        </Dialog>
    );
};

export default InquiryModal;
