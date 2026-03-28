"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, signInSocial } from "@/lib/actions/auth-actions";
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
import { Loader2 } from "lucide-react";

export default function AuthClientPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleAuth = async () => {
    if (socialLoading || isLoading) return;
    setSocialLoading(true);
    setError("");

    try {
      const result = await signInSocial("google");
      if (result?.url) {
        // Navigate to the OAuth URL on the client side
        window.location.href = result.url;
      } else {
        setError("Could not initiate Google sign-in. Please try again.");
        setSocialLoading(false);
      }
    } catch (err) {
      setError(
        `Error authenticating with Google: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setSocialLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || socialLoading) return;
    setIsLoading(true);
    setError("");

    // Client-side validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }
    if (!isSignIn && !name.trim()) {
      setError("Please enter your full name.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignIn) {
        const result = await signIn(email, password);
        if (result.success && result.user) {
          router.push("/");
          router.refresh();
        } else {
          setError(result.error || "Invalid email or password.");
        }
      } else {
        const result = await signUp(email, password, name);
        if (result.success && result.user) {
          router.push("/");
          router.refresh();
        } else {
          setError(result.error || "Failed to create account.");
        }
      }
    } catch (err) {
      setError(
        `Something went wrong. Please try again.`
      );
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || socialLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isSignIn ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isSignIn
              ? "Enter your credentials to sign in to your account"
              : "Enter your information to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Auth Button */}
          <Button
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={isDisabled}
            className="w-full"
          >
            {socialLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Error Display */}
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isSignIn}
                  disabled={isDisabled}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isDisabled}
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
                disabled={isDisabled}
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isDisabled}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignIn ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setIsSignIn(!isSignIn);
              setError("");
              setName("");
            }}
            disabled={isDisabled}
            className="text-muted-foreground"
          >
            {isSignIn
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
