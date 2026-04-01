import { type Dispatch, type SetStateAction } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  Image as ImageIcon,
  Trophy,
  FileText,
  Package,
  LogOut,
  GraduationCap,
  MessageSquare,
  Play
} from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export type AdminTab = "dashboard" | "courses" | "students" | "tests" | "banners" | "results" | "blogs" | "recordings" | "resources" | "test-scores" | "inquiries";

const items: { key: AdminTab; label: string; icon: React.ComponentType<any> }[] =
  [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "students", label: "Student Management", icon: Users },
    { key: "courses", label: "Course Management", icon: BookOpen },
    { key: "tests", label: "Test Series Management", icon: ClipboardList },
    { key: "banners", label: "Banner Management", icon: ImageIcon },
    { key: "results", label: "Result Management", icon: Trophy },
    { key: "blogs", label: "Blog Management", icon: FileText },
    { key: "recordings", label: "Recordings Management", icon: Play },
    // { key: "resources", label: "Resource Management", icon: Package },
    { key: "test-scores", label: "Student Test Scores", icon: GraduationCap },
    { key: "inquiries", label: "Inquiry Management", icon: MessageSquare },
  ];

interface AdminSidebarProps {
  active: AdminTab;
  setActive: Dispatch<SetStateAction<AdminTab>>;
  isMobile?: boolean; // Add mobile prop
}

const AdminSidebar = ({ active, setActive, isMobile = false }: AdminSidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`${isMobile ? 'flex flex-col w-full h-full' : 'hidden md:flex md:flex-col w-64 flex-shrink-0'} border-r bg-background/80 backdrop-blur`}>
      <div className="px-4 py-4 border-b flex items-center gap-3">
        <img
          src={logo}
          alt="Saraswati Classes"
          className="w-10 h-10 object-contain"
        />
        <div>
          <p className="font-semibold">Admin Panel</p>
          <p className="text-xs text-muted-foreground">
            Saraswati Classes Coaching
          </p>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-3 border-t">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-1"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

