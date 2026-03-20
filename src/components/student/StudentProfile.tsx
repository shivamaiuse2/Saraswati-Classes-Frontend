import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const StudentProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const profile = currentUser?.studentProfile;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    guardianName: "",
    guardianPhone: "",
  });

  useEffect(() => {
    console.log('Profile data changed:', profile);
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
        guardianName: profile.guardianName || "",
        guardianPhone: profile.guardianPhone || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsLoading(true);
    const success = await updateProfile(formData);
    if (success) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      // Force a re-render by updating state
      setFormData({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
      });
    } else {
      toast.error("Failed to update profile");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">Profile</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your student profile information.
          </p>
        </div>
        <Button 
          variant={isEditing ? "outline" : "default"} 
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={isEditing ? formData.name : profile?.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                value={currentUser?.email || ""}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone Number</Label>
              <Input
                id="profile-phone"
                value={isEditing ? formData.phone : profile?.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-dob">Date of Birth</Label>
              <Input
                id="profile-dob"
                type="date"
                value={isEditing ? formData.dateOfBirth : (profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "")}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                readOnly={!isEditing}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-guardian-name">Guardian Name</Label>
              <Input
                id="profile-guardian-name"
                value={isEditing ? formData.guardianName : profile?.guardianName || ""}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-guardian-phone">Guardian Phone</Label>
              <Input
                id="profile-guardian-phone"
                value={isEditing ? formData.guardianPhone : profile?.guardianPhone || ""}
                onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                readOnly={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-address">Address</Label>
            <Input
              id="profile-address"
              value={isEditing ? formData.address : profile?.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              readOnly={!isEditing}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-standard">Standard</Label>
              <Input
                id="profile-standard"
                value={profile?.standard || ""}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-board">Board</Label>
              <Input
                id="profile-board"
                value={profile?.board || ""}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-4">
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {profile?.certificates && profile.certificates.length > 0 && (
        <Card>
          <CardContent className="p-5 space-y-4">
            <h2 className="text-lg font-semibold">My Certificates</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.certificates.map((cert: any) => (
                <div key={cert.id} className="border rounded-lg p-4 space-y-2 hover:border-primary/50 transition-colors">
                  <div className="h-40 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Certificate Preview</span>
                  </div>
                  <h3 className="font-medium text-sm">{cert.title || cert.courseName || "Course Certificate"}</h3>
                  <p className="text-[10px] text-muted-foreground">Issued on: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  <Button variant="outline" size="sm" className="w-full text-[10px] h-7">Download PDF</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentProfile;

