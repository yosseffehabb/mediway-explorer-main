import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  Map,
  Calendar,
  BarChart,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const Appointment = () => {
  const navigate = useNavigate();

  const widgets = [
    {
      title: "Submit",
      icon: <Calendar size={28} className="text-primary" />,
      path: "/appointment/submit",
    },
    {
      title: "Calendar",
      icon: <Calendar size={28} className="text-emerald-500" />,
      path: "/calendar",
    },
    {
      title: "Profile",
      icon: <UserCircle size={28} className="text-blue-500" />,
      path: "/profile",
    },
    {
      title: "Find Doctors",
      icon: <Map size={28} className="text-amber-500" />,
      path: "/map",
    },
    {
      title: "Health Stats",
      icon: <BarChart size={28} className="text-violet-500" />,
      path: "/statistics",
    },
    {
      title: "Chatbot",
      icon: <MessageSquare size={28} className="text-cyan-500" />,
      path: "/chatbot",
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-6xl mx-auto px-4 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 h-full border border-gray-100"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome to Withyou
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Your personal health companion
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
            {/* First Row */}
            {widgets.slice(0, 3).map((widget, index) => (
              <motion.div
                key={widget.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="h-40 w-full flex flex-col items-center justify-center gap-3 
                           bg-white border-gray-200 hover:bg-primary/5 hover:border-primary 
                           transition-all duration-300 text-gray-700 hover:text-primary shadow-sm rounded-xl
                           hover:shadow-md hover:-translate-y-1"
                  onClick={() => navigate(widget.path)}
                >
                  <div className="rounded-full bg-gray-50 p-3 mb-1">
                    {widget.icon}
                  </div>
                  <span className="text-lg font-medium">{widget.title}</span>
                </Button>
              </motion.div>
            ))}

            {/* Second Row */}
            <motion.div
              className="col-span-1 md:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Button
                variant="outline"
                className="h-40 w-full flex flex-col items-center justify-center gap-3 
                         bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:bg-primary/15 
                         hover:border-primary transition-all duration-300 text-gray-700 hover:text-primary 
                         shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1"
                onClick={() => navigate(widgets[3].path)}
              >
                <div className="rounded-full bg-white p-3 mb-1">
                  {widgets[3].icon}
                </div>
                <span className="text-lg font-medium">{widgets[3].title}</span>
              </Button>
            </motion.div>

            {/* Third Row - Two Equal Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 col-span-1 md:col-span-3">
              {widgets.slice(4).map((widget, index) => (
                <motion.div
                  key={widget.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="h-40 w-full flex flex-col items-center justify-center gap-3 
                             bg-white border-gray-200 hover:bg-primary/5 hover:border-primary 
                             transition-all duration-300 text-gray-700 hover:text-primary shadow-sm rounded-xl
                             hover:shadow-md hover:-translate-y-1"
                    onClick={() => navigate(widget.path)}
                  >
                    <div className="rounded-full bg-gray-50 p-3 mb-1">
                      {widget.icon}
                    </div>
                    <span className="text-lg font-medium">{widget.title}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Appointment;
