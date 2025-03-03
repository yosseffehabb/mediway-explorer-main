import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import IllnessForm from "@/components/IllnessForm";
import DoctorsList from "@/components/DoctorsList";
import { useToast } from "@/hooks/use-toast";

const AppointmentSubmit = () => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleIllnessSubmit = (data: any) => {
    toast({
      title: "Details submitted successfully",
      description: "Finding doctors in your area...",
    });
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-sage-50/30 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 md:p-8"
        >
          {step === 1 ? (
            <IllnessForm onSubmit={handleIllnessSubmit} />
          ) : (
            <DoctorsList />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentSubmit;
