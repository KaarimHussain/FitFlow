import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PasswordStrength } from "@/components/ui/password-strength"
import { User, Mail, Lock, ArrowRight, UserCheck } from "lucide-react"
import { useAuth } from "@/context/AuthContext";
import { useNotificationService } from "@/context/notification-context"

export default function SignUp() {
    const navigate = useNavigate()
    const notify = useNotificationService()
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = { ...errors }

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = "Username is required"
            isValid = false
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters"
            isValid = false
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
            isValid = false
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
            isValid = false
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const { signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            setIsSubmitting(true)

            try {
                await signup(formData.username, formData.email, formData.password);
                notify.success("Account created successfully!");
                navigate("/dashboard");
            } catch (error) {
                notify.error("Failed to create account. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted to-accent/10 pb-12 pt-25">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/10),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme(colors.accent/8),transparent_50%)] pointer-events-none" />

            <div className="container max-w-md px-4 relative z-10">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-background via-background to-background/95">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Enter your details to create your fitness account
                        </CardDescription>
                        <Badge variant="secondary" className="mx-auto mt-2 px-4 py-1">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Join Our Fitness Community
                        </Badge>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="username">Username</Label>
                                    {errors.username && (
                                        <span className="text-xs text-destructive font-medium">{errors.username}</span>
                                    )}
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="Enter your username"
                                        className={`pl-10 ${errors.username ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="email">Email</Label>
                                    {errors.email && (
                                        <span className="text-xs text-destructive font-medium">{errors.email}</span>
                                    )}
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className={`pl-10 ${errors.email ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {errors.password && (
                                        <span className="text-xs text-destructive font-medium">{errors.password}</span>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password"
                                        className={`pl-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Password Strength Indicator */}
                                <PasswordStrength password={formData.password} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-6 text-lg font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Create Account
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 text-center">
                        <div className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>

                        <div className="text-xs text-muted-foreground">
                            By creating an account, you agree to our{" "}
                            <a href="#" className="text-primary hover:underline">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </main>
    )
}