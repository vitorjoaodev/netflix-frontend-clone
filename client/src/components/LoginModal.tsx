import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginModal = ({ isOpen, onOpenChange, onSuccess }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (isLogin) {
        await login(data.email, data.password);
      } else {
        await signup(data.email, data.password);
      }
      
      toast({
        title: isLogin ? "Login successful" : "Account created",
        description: isLogin ? "Welcome back to Netflix" : "Your account has been created successfully",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Authentication error",
        description: (error as Error).message || "An error occurred during authentication",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border border-gray-700 rounded-md w-full max-w-md p-8 text-white">
        <h2 className="text-3xl font-bold mb-6">{isLogin ? "Sign In" : "Sign Up"}</h2>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email or phone number"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white text-base focus:outline-none focus:border-gray-400"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-netflix-red text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <Input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white text-base focus:outline-none focus:border-gray-400"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-netflix-red text-sm mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-netflix-red text-white py-3 font-bold rounded hover:bg-[#f40612] transition"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Checkbox
                id="remember-me"
                className="mr-2 data-[state=checked]:bg-netflix-red border-gray-500"
                {...form.register("rememberMe")}
              />
              <label htmlFor="remember-me" className="text-gray-400 text-sm">Remember me</label>
            </div>
            <a href="#" className="text-gray-400 text-sm hover:underline">Need help?</a>
          </div>
          
          <div className="mt-12">
            <p className="text-gray-400">
              {isLogin ? "New to Netflix? " : "Already have an account? "}
              <button
                type="button"
                className="text-white hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up now" : "Sign in"}
              </button>
            </p>
            <p className="text-gray-500 text-xs mt-4">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
