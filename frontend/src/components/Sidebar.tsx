
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Phone, 
  BookOpen, 
  CreditCard, 
  Tag, 
  Menu, 
  X ,
  Bell,
  Sprout
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Call Requests', href: '/calls', icon: Phone },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Payment Requests', href: '/payments', icon: CreditCard },
    { name: 'Coupons', href: '/coupons', icon: Tag },
    { name: 'Notifications', href: '/notification', icon: Bell },
    { name: 'Joining Requests', href: '/joining', icon: Sprout },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-white border-r shadow-sm flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-center h-16 border-b px-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 text-gray-700 rounded-md transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              )}
            >
              <item.icon size={18} className="mr-3" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
