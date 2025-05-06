import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profiles");
    }
  }, [isAuthenticated, navigate]);
  
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
      
      navigate("/profiles");
    } catch (error) {
      console.error("Authentication error:", error);
      form.setError("root", {
        message: (error as Error).message,
      });
    }
  };
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center py-10 px-4"
      style={{
        backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.8) 100%), url("https://assets.nflxext.com/ffe/siteui/vlv3/563f5a28-7abb-4364-a498-e0a7870cd3bc/2b2a1f06-db13-436b-93a2-88636a9ae54f/US-en-20231218-popsignuptwoweeks-perspective_alpha_website_large.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-4 py-6">
        <a href="/">
          <svg viewBox="0 0 111 30" className="h-6 sm:h-7 md:h-8" fill="#E50914">
            <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"></path>
          </svg>
        </a>
      </div>
      
      <div className="bg-black bg-opacity-75 p-8 rounded-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-white">{isLogin ? "Sign In" : "Sign Up"}</h2>
        
        {form.formState.errors.root && (
          <div className="p-3 mb-4 bg-netflix-red bg-opacity-20 text-netflix-red rounded">
            {form.formState.errors.root.message}
          </div>
        )}
        
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
            className="w-full bg-netflix-red text-white py-6 font-bold rounded hover:bg-[#f40612] transition"
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
      </div>
    </div>
  );
};

export default Login;
