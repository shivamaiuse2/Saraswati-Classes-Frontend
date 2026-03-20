import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart2,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "courses", label: "My Courses", icon: BookOpen },
  { key: "tests", label: "My Test Series", icon: ClipboardList },
  { key: "results", label: "Results", icon: BarChart2 },
  { key: "profile", label: "Profile", icon: User },
] as const;

interface StudentSidebarProps {
  active: string;
  onChange: (key: string) => void;
  isMobile?: boolean; // Add mobile prop
}

const StudentSidebar = ({ active, onChange, isMobile = false }: StudentSidebarProps) => {
  const { currentStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={`${isMobile ? 'flex flex-col w-full h-full' : 'hidden md:flex md:flex-col w-60 flex-shrink-0'} border-r bg-background/80 backdrop-blur-xl`}>
      <div className="px-4 py-4 border-b">
        <p className="text-sm font-semibold">Student Dashboard</p>
        <p className="text-xs text-muted-foreground truncate">
          {currentStudent?.name || "Student"}
        </p>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
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
        <p className="mt-2 text-[11px] text-muted-foreground text-center">
          Logged in as {currentStudent?.email || "student"}
        </p>
      </div>
    </aside>
  );
};

export default StudentSidebar;

