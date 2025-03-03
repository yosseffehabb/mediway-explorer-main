import { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router navigation
import { useAuth } from "../context/FackAuthContext"; // Import Auth context
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Import modal

const SignUp = () => {
  const { signup } = useAuth(); // Get signup function from AuthContext
  const navigate = useNavigate(); // React Router navigation
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    acceptTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false); // Controls popup visibility
  const [loading, setLoading] = useState(false); // Prevents multiple form submissions

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Gender Selection
  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  // Handle Checkbox for Terms & Conditions
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setShowPopup(false); // Reset popup state
    setLoading(true); // Disable form during submission

    // Client-side validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      console.log("📢 Attempting Signup...");
      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.dateOfBirth,
        formData.gender
      );

      console.log("✅ Signup Successful! User created in Firebase.");
      setSuccessMessage("Signup successful! Redirecting...");
      setShowPopup(true);

      // Redirect after success
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("❌ Signup Error:", err);

      // Handle Firebase Errors
      const error = err as Error;
      if (error.message.includes("email-already-in-use")) {
        setError("The email address is already in use.");
      } else if (error.message.includes("weak-password")) {
        setError("The password is too weak.");
      } else {
        setError("An error occurred during signup.");
      }

      setShowPopup(true);
    } finally {
      setLoading(false); // Re-enable form after submission
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/30 p-4 sm:px-6 lg:px-8 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={handleGenderChange}
                  value={formData.gender}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={handleCheckboxChange}
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I accept the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  terms and conditions
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!formData.acceptTerms || loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
