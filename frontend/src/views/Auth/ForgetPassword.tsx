"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, KeyRound, Mail, Lock, CheckCircle, ArrowLeft } from "lucide-react"
import axios from "axios"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

export default function ForgetPassword() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // API base URL (adjust if needed)
    const API = `${import.meta.env.VITE_SERVER_URL}/api/auth`

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePassword = (password: string) => {
        return password.length >= 6
    }

    // Step 1: Send OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.")
            return
        }

        setLoading(true)
        try {
            await axios.post(`${API}/forgot-password`, { email })
            setSuccess("OTP sent to your email successfully!")
            setStep(2)
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (otp.length !== 6) {
            setError("Please enter the complete 6-digit OTP.")
            return
        }

        setLoading(true)
        try {
            await axios.post(`${API}/verify-otp`, { email, otp })
            setSuccess("OTP verified successfully! Now set your new password.")
            setStep(3)
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid OTP. Please check and try again.")
        } finally {
            setLoading(false)
        }
    }

    // Step 3: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!validatePassword(newPassword)) {
            setError("Password must be at least 6 characters long.")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match. Please try again.")
            return
        }

        setLoading(true)
        try {
            await axios.post(`${API}/reset-password`, { email, otp, newPassword })
            setSuccess("Password reset successful! You can now log in with your new password.")
            setStep(4)
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to reset password. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const StepIndicator = ({ currentStep }: { currentStep: number }) => (
        <div className="flex items-center justify-center space-x-2 mb-6">
            {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                    <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                        ${stepNum <= currentStep
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }
                    `}
                    >
                        {stepNum < currentStep ? <CheckCircle className="w-4 h-4" /> : stepNum}
                    </div>
                    {stepNum < 4 && (
                        <div
                            className={`
                            w-8 h-0.5 mx-1 transition-all duration-200
                            ${stepNum < currentStep ? "bg-primary" : "bg-muted"}
                        `}
                        />
                    )}
                </div>
            ))}
        </div>
    )

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/10 py-8 px-4">
            <div className="container mx-auto flex flex-col items-center max-w-md">
                <Card className="w-full shadow-2xl bg-background/95 backdrop-blur-sm border-2">
                    <CardHeader className="text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <KeyRound className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-balance">Reset Your Password</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                            {step === 1 && "Enter your email to receive a verification code"}
                            {step === 2 && "Enter the 6-digit code sent to your email"}
                            {step === 3 && "Create a new secure password"}
                            {step === 4 && "Password reset completed successfully"}
                        </CardDescription>

                        <StepIndicator currentStep={step} />
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/50">
                                <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-sm font-medium text-green-800 dark:text-green-200">
                                    {success}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11 text-base"
                                        disabled={loading}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-11 text-base font-medium"
                                    disabled={loading || !email.trim()}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Send Verification Code
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-center block">Enter Verification Code</Label>
                                    <div className="flex justify-center">
                                        <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={loading}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                                                <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                                                <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                                                <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                                                <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">Code sent to {email}</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-11 text-base font-medium"
                                        disabled={loading || otp.length !== 6}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Verify Code
                                            </>
                                        )}
                                    </Button>

                                    <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)} className="text-sm">
                                        <ArrowLeft className="w-4 h-4 mr-1" />
                                        Back to email
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-sm font-medium flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-primary" />
                                        New Password
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="h-11 text-base"
                                        disabled={loading}
                                    />
                                    <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-primary" />
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="h-11 text-base"
                                        disabled={loading}
                                    />
                                </div>

                                <Separator />

                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-11 text-base font-medium"
                                        disabled={loading || !newPassword || !confirmPassword}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                                Resetting Password...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4 mr-2" />
                                                Reset Password
                                            </>
                                        )}
                                    </Button>

                                    <Button type="button" variant="ghost" size="sm" onClick={() => setStep(2)} className="text-sm">
                                        <ArrowLeft className="w-4 h-4 mr-1" />
                                        Back to verification
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <div className="text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Password Reset Complete!</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your password has been successfully updated. You can now log in with your new password.
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <a href="/login" className="block">
                                        <Button size="lg" className="w-full h-11 text-base font-medium">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back to Login
                                        </Button>
                                    </a>

                                    <p className="text-xs text-muted-foreground">Remember to keep your new password secure</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">Need help? Contact our support team</p>
                </div>
            </div>
        </main>
    )
}
