import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link (nếu bạn muốn dùng trang riêng)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ParkingMeter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/auth/login`
          : "http://localhost:5001/api/auth/login",
        { email, password }
      );
      const token = response.data.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      if (onLogin) {
        onLogin(email, password);
      }

      toast({
        title: "Success",
        description: "Login successful!",
      });
      // Optionally redirect or update app state here
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/users`
          : "http://localhost:5001/api/users",
        { email, password }
      );

      toast({
        title: "Success",
        description: "Registration successful! Please log in.",
      });

      setIsRegistering(false); // Go back to login after successful registration
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ParkingMeter className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">ParkManager</span>
          </div>
          <CardTitle>{isRegistering ? "Sign Up" : "Sign In"}</CardTitle>
          <CardDescription>
            {isRegistering
              ? "Create an account to use the system"
              : "Enter your credentials to access the parking management system"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={isRegistering ? handleRegister : handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? isRegistering
                  ? "Signing up..."
                  : "Signing in..."
                : isRegistering
                  ? "Sign Up"
                  : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-gray-600"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;