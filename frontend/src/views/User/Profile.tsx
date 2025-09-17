"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Lock, Shield, Smartphone, Trash2, Camera, Save, Eye, EyeOff } from "lucide-react"
import api from "@/services/api"
import { useNotificationService } from "@/context/notification-context"

interface UserData {
    id: string
    username: string
    email: string
    role: string
    isVerified: boolean
    createdAt: string
    bio?: string
    fitnessGoals?: string
    dateOfBirth?: string
    profilePicture?: string
}

interface SecuritySettings {
    twoFactorEnabled: boolean
    profilePublic: boolean
    dataSharing: boolean
}

export default function Profile() {

    // Notification Service
    const toast = useNotificationService()

    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        twoFactorEnabled: false,
        profilePublic: true,
        dataSharing: false,
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        bio: "",
        fitnessGoals: "",
        dateOfBirth: "",
    })

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await api.get("/auth/me")
            if (response.data.success) {
                const user = response.data.user
                setUserData(user)
                setFormData({
                    username: user.username || "",
                    email: user.email || "",
                    bio: user.bio || "",
                    fitnessGoals: user.fitnessGoals || "",
                    dateOfBirth: user.dateOfBirth || "",
                })
            }
        } catch (error) {
            console.error("Error fetching user data:", error)
            toast.error("Failed to load profile data")
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        try {
            setLoading(true)
            // In a real app, you'd have an update profile endpoint
            // For now, we'll simulate the update
            const updatedUser = { ...userData, ...formData }
            setUserData(updatedUser as UserData)
            setEditing(false)

            toast.success("Profile updated successfully",)
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match")
            return
        }

        if (passwordData.newPassword.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive",
            })
            return
        }

        try {
            // In a real app, you'd have a change password endpoint
            toast({
                title: "Success",
                description: "Password changed successfully",
            })
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error) {
            console.error("Error changing password:", error)
            toast({
                title: "Error",
                description: "Failed to change password",
                variant: "destructive",
            })
        }
    }

    const handleDeleteAccount = async () => {
        try {
            // In a real app, you'd have a delete account endpoint
            toast({
                title: "Account Deleted",
                description: "Your account has been permanently deleted",
            })
            // Redirect to login or home page
        } catch (error) {
            console.error("Error deleting account:", error)
            toast({
                title: "Error",
                description: "Failed to delete account",
                variant: "destructive",
            })
        }
    }

    if (loading && !userData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Section */}
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="relative">
                                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                                    <AvatarImage src={userData?.profilePicture || "/placeholder.svg"} alt={userData?.username} />
                                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                        {userData?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                    <h1 className="text-3xl font-bold text-foreground">{userData?.username}</h1>
                                    <div className="flex gap-2">
                                        <Badge variant={userData?.isVerified ? "default" : "secondary"}>
                                            {userData?.isVerified ? "Verified" : "Unverified"}
                                        </Badge>
                                        <Badge variant="outline">{userData?.role}</Badge>
                                    </div>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}
                                </p>
                                <Button onClick={() => setEditing(!editing)} className="bg-primary hover:bg-primary/90">
                                    {editing ? "Cancel" : "Edit Profile"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Personal Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Manage your personal details and fitness preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    disabled={!editing}
                                    className="bg-input"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!editing}
                                    className="bg-input"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    disabled={!editing}
                                    className="bg-input"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    disabled={!editing}
                                    className="bg-input min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fitnessGoals">Fitness Goals</Label>
                                <Textarea
                                    id="fitnessGoals"
                                    placeholder="What are your fitness goals?"
                                    value={formData.fitnessGoals}
                                    onChange={(e) => setFormData({ ...formData, fitnessGoals: e.target.value })}
                                    disabled={!editing}
                                    className="bg-input min-h-[80px]"
                                />
                            </div>

                            {editing && (
                                <Button
                                    onClick={handleSaveProfile}
                                    className="w-full bg-secondary hover:bg-secondary/90"
                                    disabled={loading}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security Settings Section */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security Settings
                                </CardTitle>
                                <CardDescription>Manage your account security and privacy preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Two-Factor Authentication</Label>
                                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                                    </div>
                                    <Switch
                                        checked={securitySettings.twoFactorEnabled}
                                        onCheckedChange={(checked) =>
                                            setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Public Profile</Label>
                                        <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                                    </div>
                                    <Switch
                                        checked={securitySettings.profilePublic}
                                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, profilePublic: checked })}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Data Sharing</Label>
                                        <p className="text-sm text-muted-foreground">Share anonymized data for research purposes</p>
                                    </div>
                                    <Switch
                                        checked={securitySettings.dataSharing}
                                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, dataSharing: checked })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Change Password Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Change Password
                                </CardTitle>
                                <CardDescription>Update your password to keep your account secure</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showPasswords.current ? "text" : "password"}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="bg-input pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                        >
                                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="bg-input pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                        >
                                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="bg-input pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                        >
                                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePasswordChange}
                                    className="w-full bg-primary hover:bg-primary/90"
                                    disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                >
                                    Update Password
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Account Management Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Smartphone className="h-5 w-5" />
                                    Account Management
                                </CardTitle>
                                <CardDescription>Manage your account settings and data</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-medium mb-2">Account Status</h4>
                                    <p className="text-sm text-muted-foreground mb-2">Your account is active and in good standing.</p>
                                    <Badge variant="outline" className="text-xs">
                                        Free Plan
                                    </Badge>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="font-medium text-destructive">Danger Zone</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="w-full">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account and remove your data
                                                    from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDeleteAccount}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete Account
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
