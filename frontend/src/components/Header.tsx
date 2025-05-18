
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-white border-b shadow-sm h-16 flex items-center justify-between px-4 md:px-6">
      <div>
        <h2 className="text-lg font-medium">Admin Dashboard</h2>
      </div>
      <div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
