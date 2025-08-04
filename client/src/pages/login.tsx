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
  const [oauthError, setOauthError] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  // Check for OAuth errors in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const urlOauthError = urlParams.get('error');
  const stravaError = urlParams.get('strava');

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
              {/* Recommended Sign-in */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 text-sm">
                <div className="font-semibold text-orange-800 mb-2">🚴‍♂️ Recommended for Cyclists</div>
                <div className="text-orange-700 mb-2">
                  Sign in with <strong>Strava</strong> to automatically import your cycling activities, connect with the community, and get personalized insights.
                </div>
                <div className="text-orange-600 text-xs">
                  Instantly access your ride data and join cycling groups in your area.
                </div>
              </div>

              {/* Google OAuth Troubleshooting */}
              {(oauthError === 'google' || urlOauthError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
                  <div className="font-semibold text-red-800 mb-2">Google OAuth Setup Required</div>
                  <div className="text-red-700 mb-3">
                    Add these URIs to your Google Cloud Console OAuth 2.0 Client:
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-red-600 text-xs font-medium mb-1">Authorized JavaScript origins:</div>
                    <div className="bg-white border rounded p-2 font-mono text-xs break-all">
                      https://51a6c92c-2283-41c5-9feb-d00d86fe7cc9-00-2gp7z56qmxm51.worf.replit.dev
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-red-600 text-xs font-medium mb-1">Authorized redirect URIs:</div>
                    <div className="bg-white border rounded p-2 font-mono text-xs break-all">
                      https://51a6c92c-2283-41c5-9feb-d00d86fe7cc9-00-2gp7z56qmxm51.worf.replit.dev/api/auth/google/callback
                    </div>
                  </div>
                  
                  <div className="text-red-600 text-xs">
                    Click SAVE in Google Cloud Console. Changes take 5-10 minutes to take effect.
                  </div>
                </div>
              )}
              {stravaError === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  <strong>Strava OAuth Error:</strong> There was an issue connecting to Strava. Please try again.
                </div>
              )}
              {stravaError === 'connected' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  <strong>Success!</strong> Your Strava account has been connected successfully.
                </div>
              )}
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
              
              {/* OAuth buttons */}
              <div className="space-y-3">
                {/* Highlight Strava as the working option */}
                <Button 
                  type="button" 
                  className="w-full bg-strava-orange hover:bg-strava-orange/90 text-white relative"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/strava/auth');
                      const data = await response.json();
                      if (data.authUrl) {
                        window.location.href = data.authUrl;
                      }
                    } catch (error) {
                      console.error('Strava auth error:', error);
                    }
                  }}
                  data-testid="button-strava"
                >
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    Ready
                  </span>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.916"/>
                  </svg>
                  Continue with Strava
                </Button>

                {/* Google OAuth - Now Ready to Test */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full relative"
                  onClick={() => window.location.href = '/api/auth/google'}
                  data-testid="button-google"
                >
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    Ready
                  </span>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Choose Google Account
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => demoLoginMutation.mutate()}
                  disabled={demoLoginMutation.isPending}
                  data-testid="button-demo"
                >
                  {demoLoginMutation.isPending ? "Creating demo..." : "Try Demo Account"}
                </Button>
              </div>
              
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