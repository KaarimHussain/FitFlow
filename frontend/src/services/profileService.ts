import api from "./api"

export interface UserProfile {
    id: string
    username: string
    email: string
    role: string
    isVerified: boolean
    createdAt: string
}

export interface ProfileUpdateData {
    username: string
}

export interface PasswordChangeData {
    currentPassword: string
    newPassword: string
}

class ProfileService {
    // Get current user profile
    async getProfile(): Promise<UserProfile> {
        const response = await api.get("/auth/me")
        if (response.data.success) {
            return response.data.user
        }
        throw new Error(response.data.message || "Failed to fetch profile")
    }

    // Update user profile
    async updateProfile(profileData: ProfileUpdateData): Promise<UserProfile> {
        const response = await api.put("/auth/profile", profileData)
        if (response.data.success) {
            return response.data.user
        }
        throw new Error(response.data.message || "Failed to update profile")
    }

    // Change password
    async changePassword(passwordData: PasswordChangeData): Promise<void> {
        const response = await api.put("/auth/change-password", passwordData)
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to change password")
        }
    }

    // Delete account
    async deleteAccount(): Promise<void> {
        const response = await api.delete("/auth/account")
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to delete account")
        }
    }
}

export default new ProfileService()
