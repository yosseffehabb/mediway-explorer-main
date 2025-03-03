import React, { useState, MouseEvent } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  UserCircle,
  Map,
  Calendar,
  BarChart,
  Home,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/FackAuthContext";

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const NavMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { logout } = useAuth();

  const navItems: NavItem[] = [
    { title: "Profile", icon: <UserCircle size={20} />, path: "/profile" },
    { title: "Find Doctors", icon: <Map size={20} />, path: "/map" },
    { title: "Calendar", icon: <Calendar size={20} />, path: "/calendar" },
    {
      title: "Health Stats",
      icon: <BarChart size={20} />,
      path: "/statistics",
    },
    { title: "Dashboard", icon: <Home size={20} />, path: "/appointment" },
    {
      title: "Submit Appointment",
      icon: <Calendar size={20} />,
      path: "/appointment/submit",
    },
  ];

  // Actual logout handler
  const handleLogout = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    logout(); // call your actual logout logic from context
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <nav className="border-b bg-white shadow-sm relative z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side: Logo & Desktop Navigation */}
            <div className="flex items-center space-x-4">
              <button
                className="text-primary font-bold text-xl sm:text-2xl"
                onClick={() => navigate("/")}
              >
                WithYou
              </button>
              {/* Desktop Nav */}
              <div className="hidden lg:flex space-x-4">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "h-16 px-4 rounded-none transition-colors duration-300 gap-2",
                      location.pathname.startsWith(item.path) &&
                        "bg-primary/10 text-primary font-semibold"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon} {item.title}
                  </Button>
                ))}
              </div>
            </div>

            {/* Right Side: Logout Button & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              {/* Desktop Logout Button */}
              <div className="hidden md:flex">
                <Button
                  variant="default"
                  size="default"
                  onClick={handleLogout}
                  className="whitespace-nowrap"
                >
                  <LogOut size={20} className="mr-1" /> Logout
                </Button>
              </div>
              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-expanded={isOpen}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            </div>
          </div>
          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-2 bg-white shadow-lg border rounded-lg md:hidden"
            >
              <div className="flex flex-col divide-y divide-gray-200">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full text-left px-4 py-3 transition-colors duration-300",
                      location.pathname.startsWith(item.path) &&
                        "bg-primary/10 text-primary font-semibold"
                    )}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                  >
                    {item.icon} {item.title}
                  </Button>
                ))}
                {/* Mobile Logout Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full text-left px-4 py-3 flex items-center text-primary"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={20} className="mr-2" /> Logout
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default NavMenu;
