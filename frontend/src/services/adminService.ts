// src/services/adminService.ts
import api from './api';
import { type UserProfile } from './profileService';
import { type Workout } from './workoutService';
import { type NutritionEntry } from './nutritionService';
import { type ProgressEntry } from './progressService';

export interface AdminStats {
  totalUsers: number;
  totalWorkouts: number;
  totalNutritionEntries: number;
  totalProgressEntries: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface AdminUser extends UserProfile {
  lastLogin?: string;
  workoutCount?: number;
  nutritionCount?: number;
  progressCount?: number;
}

export const adminService = {
  // Get admin dashboard stats
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<AdminUser[]> => {
    const response = await api.get('/admin/users');
    return response.data.data;
  },

  // Get all workouts across all users
  getAllWorkouts: async (): Promise<Workout[]> => {
    const response = await api.get('/admin/workouts');
    return response.data.data;
  },

  // Get all nutrition entries across all users
  getAllNutritionEntries: async (): Promise<NutritionEntry[]> => {
    const response = await api.get('/admin/nutrition');
    return response.data.data;
  },

  // Get all progress entries across all users
  getAllProgressEntries: async (): Promise<ProgressEntry[]> => {
    const response = await api.get('/admin/progress');
    return response.data.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  // Update user role (admin only)
  updateUserRole: async (userId: string, role: string): Promise<AdminUser> => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data.data;
  },

  // Get user details with all associated data
  getUserDetails: async (userId: string): Promise<{
    user: AdminUser;
    workouts: Workout[];
    nutrition: NutritionEntry[];
    progress: ProgressEntry[];
  }> => {
    const response = await api.get(`/admin/users/${userId}/details`);
    return response.data.data;
  },
};