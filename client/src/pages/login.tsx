import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { Bike, Users, Activity, MapPin } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      name: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Welcome back!", description: "Successfully logged in." });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({ 
        title: "Login failed", 
        description: error.message || "Invalid credentials", 
        variant: "destructive" 
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await apiRequest("POST", "/api/auth/signup", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Welcome!", description: "Account created successfully." });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({ 
        title: "Signup failed", 
        description: error.message || "Failed to create account", 
        variant: "destructive" 
      });
    },
  });

  const demoLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/demo");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Welcome!", description: "Logged in with demo account." });
      setLocation("/dashboard");
    },
    onError: () => {
      toast({ 
        title: "Demo login failed", 
        description: "Failed to create demo account", 
        variant: "destructive" 
      });
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onSignupSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-strava-orange/10 via-strava-light to-strava-orange/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            <div className="p-3 bg-strava-orange rounded-full">
              <Bike className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-strava-dark">CycleConnect</h1>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-strava-dark leading-tight">
            Connect with fellow cyclists and track your journey
          </h2>
          
          <p className="text-lg text-strava-gray max-w-md mx-auto lg:mx-0">
            Join cycling groups, sync your Strava activities, and share your passion for cycling with a community that gets it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg">
              <Users className="h-6 w-6 text-strava-orange" />
              <div>
                <h3 className="font-semibold text-strava-dark">Join Groups</h3>
                <p className="text-sm text-strava-gray">Find your cycling tribe</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg">
              <Activity className="h-6 w-6 text-strava-orange" />
              <div>
                <h3 className="font-semibold text-strava-dark">Track Progress</h3>
                <p className="text-sm text-strava-gray">Sync with Strava</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg">
              <MapPin className="h-6 w-6 text-strava-orange" />
              <div>
                <h3 className="font-semibold text-strava-dark">Discover Routes</h3>
                <p className="text-sm text-strava-gray">Explore together</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login/Signup Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-strava-dark">
                {isSignup ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription>
                {isSignup 
                  ? "Join the cycling community today" 
                  : "Sign in to your CycleConnect account"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {!isSignup ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="your@email.com"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              placeholder="••••••••"
                              data-testid="input-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-strava-orange hover:bg-strava-orange/90"
                      disabled={loginMutation.isPending}
                      data-testid="button-login"
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Your full name"
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="username"
                              data-testid="input-username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="your@email.com"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              placeholder="••••••••"
                              data-testid="input-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-strava-orange hover:bg-strava-orange/90"
                      disabled={signupMutation.isPending}
                      data-testid="button-signup"
                    >
                      {signupMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              )}
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => demoLoginMutation.mutate()}
                disabled={demoLoginMutation.isPending}
                data-testid="button-demo"
              >
                {demoLoginMutation.isPending ? "Creating demo..." : "Try Demo Account"}
              </Button>
              
              <div className="text-center text-sm">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-strava-orange hover:underline font-medium"
                      onClick={() => setIsSignup(false)}
                      data-testid="link-login"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-strava-orange hover:underline font-medium"
                      onClick={() => setIsSignup(true)}
                      data-testid="link-signup"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}