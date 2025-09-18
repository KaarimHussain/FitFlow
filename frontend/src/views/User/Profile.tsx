"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { useNotificationService } from "@/context/notification-context"
import { useAuth } from "@/context/AuthContext"
import { User, Lock, Trash2, Save, Eye, EyeOff } from "lucide-react"
import profileService, { type UserProfile, type ProfileUpdateData } from "@/services/profileService"

export default function Profile() {
    const notifications = useNotificationService()
    const { refreshUser } = useAuth()

    const [userData, setUserData] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
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
    })

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const user = await profileService.getProfile()
            setUserData(user)
            setFormData({
                username: user.username || "",
            })
        } catch (error) {
            console.error("Error fetching user data:", error)
            notifications.error("Failed to load profile data")
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        try {
            setLoading(true)
            const updatedUser = await profileService.updateProfile(formData as ProfileUpdateData)
            setUserData(updatedUser)
            setEditing(false)

            notifications.success("Profile updated successfully")
        } catch (error: any) {
            console.error("Error updating profile:", error)
            notifications.error(error.message || "Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            notifications.error("New passwords don't match")
            return
        }

        if (passwordData.newPassword.length < 6) {
            notifications.error("Password must be at least 6 characters long")
            return
        }

        try {
            await profileService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })

            notifications.success("Password changed successfully")
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error: any) {
            console.error("Error changing password:", error)
            notifications.error(error.response.data.message || "Failed to change password")
        }
    }

    const handleMakeAdmin = async () => {
        try {
            setLoading(true)
            const response = await fetch('http://localhost:5000/api/auth/make-admin', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()

            if (data.success) {
                // Update local user data to reflect new role
                setUserData(prev => prev ? { ...prev, role: 'admin' } : null)
                
                // Refresh the user data in AuthContext to update global state
                await refreshUser()
                
                notifications.success("You are now an admin! You can access the admin dashboard at /admin")
            } else {
                notifications.error(data.message || "Failed to upgrade to admin")
            }
        } catch (error: any) {
            console.error("Error making admin:", error)
            notifications.error("Failed to upgrade to admin")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await profileService.deleteAccount()

            notifications.success("Your account has been permanently deleted", {
                title: "Account Deleted",
                duration: 3000,
            })

            // Clear local storage and redirect
            localStorage.removeItem("token")
            setTimeout(() => {
                window.location.href = "/login"
            }, 3000)
        } catch (error: any) {
            console.error("Error deleting account:", error)
            notifications.error(error.message || "Failed to delete account")
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
            <div className="container mx-auto px-4 py-25 max-w-4xl">
                {/* Header Section */}
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="relative">
                                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                                        {userData?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                    <h1 className="text-3xl font-bold text-foreground">{userData?.username}</h1>
                                    <div className="flex gap-2">
                                        <Badge variant={userData?.isVerified ? "default" : "secondary"}>
                                            {userData?.isVerified ? "Verified" : "Unverified"}
                                        </Badge>
                                        <Badge variant="outline" className="capitalize">
                                            {userData?.role}
                                        </Badge>
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
                            <CardDescription>Manage your account details</CardDescription>
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
                                    minLength={3}
                                    maxLength={30}
                                />
                                {editing && <p className="text-xs text-muted-foreground">Username must be 3-30 characters</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={userData?.email || ""}
                                    disabled={true}
                                    className="bg-muted text-muted-foreground cursor-not-allowed"
                                    readOnly
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    value={userData?.role || ""}
                                    disabled={true}
                                    className="bg-muted text-muted-foreground cursor-not-allowed capitalize"
                                    readOnly
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="verification">Account Status</Label>
                                <div className="flex items-center gap-2">
                                    <Badge variant={userData?.isVerified ? "default" : "secondary"}>
                                        {userData?.isVerified ? "Verified Account" : "Unverified Account"}
                                    </Badge>
                                </div>
                            </div>

                            {editing && (
                                <Button
                                    onClick={handleSaveProfile}
                                    className="w-full"
                                    disabled={loading || formData.username.length < 3 || formData.username.length > 30}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Column */}
                    <div className="space-y-8">
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
                                            minLength={6}
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
                                    <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
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

                        {/* Admin Access Section */}
                        {userData?.role !== 'admin' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Admin Access
                                    </CardTitle>
                                    <CardDescription>Upgrade your account to admin (development only)</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Click the button below to upgrade your account to admin role. This will give you access to the admin dashboard.
                                    </p>
                                    <Button
                                        onClick={handleMakeAdmin}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        disabled={loading}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Make Me Admin
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Account Management - Danger Zone Only */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trash2 className="h-5 w-5" />
                                    Account Management
                                </CardTitle>
                                <CardDescription>Manage your account settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
