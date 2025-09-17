import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert } from "../../components/ui/alert";
import { Loader2, KeyRound } from "lucide-react";
import axios from "axios";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export default function ForgetPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // API base URL (adjust if needed)
    const API = `${import.meta.env.VITE_API_URL}/api/auth`

    // Step 1: Send OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);
        try {
            await axios.post(`${API}/forgot-password`, { email });
            setSuccess("OTP sent to your email.");
            setStep(2);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);
        try {
            await axios.post(`${API}/verify-otp`, { email, otp });
            setSuccess("OTP verified. Set your new password.");
            setStep(3);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);
        try {
            await axios.post(`${API}/reset-password`, { email, otp, newPassword });
            setSuccess("Password reset successful! You can now log in.");
            setStep(4);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-accent/10 py-16">
            <div className="container mx-auto px-4 flex flex-col items-center">
                <Card className="w-full max-w-md p-8 shadow-xl bg-background/90">
                    <div className="text-center mb-8">
                        <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium rounded-full">
                            <KeyRound className="w-4 h-4 mr-2" />
                            Forgot Password
                        </Badge>
                        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                            Reset Your Password
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Enter your email to receive a one-time password (OTP).
                        </p>
                    </div>

                    {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
                    {success && <Alert variant="default" className="mb-4">{success}</Alert>}

                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                // icon={<Mail className="w-4 h-4 text-primary" />}
                                />
                            </div>
                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                                Send OTP
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Enter OTP</label>
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={setOtp}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                                Verify OTP
                            </Button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                // icon={<Lock className="w-4 h-4 text-primary" />}
                                />
                            </div>
                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                                Reset Password
                            </Button>
                        </form>
                    )}

                    {step === 4 && (
                        <div className="text-center space-y-4">
                            <Alert variant="default">Your password has been reset successfully!</Alert>
                            <a href="/auth/sign-in">
                                <Button size="lg" className="w-full mt-2">Back to Login</Button>
                            </a>
                        </div>
                    )}
                </Card>
            </div>
        </main>
    );
}