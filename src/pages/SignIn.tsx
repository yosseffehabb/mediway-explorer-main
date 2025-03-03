import { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/FackAuthContext"; // ✅ Fixed import
import ErrorPopUp from "../components/ui/ErrorPopUp"; // ✅ Ensure this file exists

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false); // ✅ Prevents multiple logins
  const navigate = useNavigate();
  const { login, isAuth, error, resetError } = useAuth();

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError(); // ✅ Reset previous errors
    setLoading(true); // ✅ Show loading state

    try {
      await login(email, password);
      console.log("✅ Login successful!");
    } catch (err) {
      console.error("❌ Login Error:", err);
    } finally {
      setLoading(false); // ✅ Stop loading after login attempt
    }
  };

  // ✅ Auto Redirect after Successful Login
  useEffect(() => {
    if (isAuth) {
      navigate("/appointment", { replace: true }); // ✅ Redirect after login
    }
  }, [isAuth, navigate]);

  // ✅ Handle Closing Popup
  function onClosePopUp() {
    resetError();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50/30 p-4 sm:px-6 lg:px-8">
      {/* ✅ Display Error Popup */}
      {error && (
        <ErrorPopUp
          title="Something Went Wrong!"
          message={error} // ✅ Display actual error message
          onClose={onClosePopUp}
        />
      )}

      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Sign in to WithYou
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your email below to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-xs sm:text-sm">
            <Link to="/sign-up" className="text-primary hover:underline">
              Don't have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
