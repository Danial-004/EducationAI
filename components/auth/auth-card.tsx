'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { registerUser } from "@/app/actions/register";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc"; // Colored Google icon
import { FaGithub } from "react-icons/fa"; // GitHub icon

export function AuthCard() {
    const [activeTab, setActiveTab] = useState("login");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    // Login State
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onRegister = async () => {
        setError(null);
        setSuccess(null);
        setIsPending(true);

        try {
            const data = await registerUser({ email, password, name });

            if (data.error) {
                setError(data.error); // Shows specific Zod error (e.g., "Minimum 6 characters")
                return; // Early return to prevent success handling
            }

            if (data.success) {
                setSuccess(data.success);
                // Switch to login tab automatically after 2s
                setTimeout(() => setActiveTab("login"), 2000);
            }
        } catch (err) {
            setError("Something went wrong with registration.");
        } finally {
            setIsPending(false);
        }
    };

    const onCredentialsLogin = async () => {
        setError(null);
        setSuccess(null);
        setIsPending(true);

        try {
            const result = await signIn("credentials", {
                email: loginEmail,
                password: loginPassword,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password!");
            } else {
                // Redirect to dashboard on success
                window.location.href = "/dashboard";
            }
        } catch (err) {
            setError("Something went wrong!");
        } finally {
            setIsPending(false);
        }
    };

    const onOAuthLogin = (provider: "github" | "google") => {
        signIn(provider, { callbackUrl: "/dashboard" });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 p-4">
            <Card className="w-full max-w-md shadow-2xl border-white/10 backdrop-blur-md bg-card/80">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                        SmartTutor AI
                    </CardTitle>
                    <CardDescription>
                        Your personal AI learning companion
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    disabled={isPending}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>

                            {error && <div className="p-3 bg-red-500/15 text-red-500 text-sm rounded-md">{error}</div>}

                            <Button
                                onClick={onCredentialsLogin}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={isPending}
                            >
                                {isPending ? "Signing in..." : "Sign In"}
                            </Button>
                        </TabsContent>

                        <TabsContent value="register" className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isPending}
                                />
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isPending}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>

                            {error && <div className="p-3 bg-red-500/15 text-red-500 text-sm rounded-md">{error}</div>}
                            {success && <div className="p-3 bg-green-500/15 text-green-500 text-sm rounded-md">{success}</div>}

                            <Button onClick={onRegister} className="w-full bg-violet-600 hover:bg-violet-700" disabled={isPending}>
                                Create Account
                            </Button>
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => onOAuthLogin("github")} disabled={isPending}>
                            <FaGithub className="w-5 h-5 mr-2" /> GitHub
                        </Button>
                        <Button variant="outline" onClick={() => onOAuthLogin("google")} disabled={isPending}>
                            <FcGoogle className="w-5 h-5 mr-2" /> Google
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
