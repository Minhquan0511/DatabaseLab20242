import { useState } from "react";
import axios from "axios"; // Add this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingMeter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom"; // Import Link

interface LoginProps {
  onLogin?: (email: string, password: string) => void; // Make optional for fallback
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      // Call backend login API
      const response = await axios.post(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/auth/login`
          : "http://localhost:5001/api/auth/login",
        { email, password }
      );
      const token = response.data.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token); // Save token to localStorage
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
          error?.response?.data?.message ||
          "Login failed. Please try again.",
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
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the parking management system
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-gray-500">
        Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:underline">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
