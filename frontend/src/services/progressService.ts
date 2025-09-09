// src/services/progressService.ts
import api from './api';

export interface Measurements {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
}

export interface Performance {
  benchPress?: number; // in kg or lbs
  squat?: number; // in kg or lbs
  deadlift?: number; // in kg or lbs
  run5k?: number; // in minutes
}

export interface ProgressEntry {
  _id?: string;
  weight?: number;
  measurements?: Measurements;
  performance?: Performance;
  date?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const progressService = {
  // Get all progress entries for the user
  getAllProgressEntries: async (): Promise<ProgressEntry[]> => {
    const response = await api.get('/progress');
    return response.data.data;
  },

  // Get a specific progress entry by ID
  getProgressEntryById: async (id: string): Promise<ProgressEntry> => {
    const response = await api.get(`/progress/${id}`);
    return response.data.data;
  },

  // Create a new progress entry
  createProgressEntry: async (progressData: Omit<ProgressEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<ProgressEntry> => {
    const response = await api.post('/progress', progressData);
    return response.data.data;
  },

  // Update an existing progress entry
  updateProgressEntry: async (id: string, progressData: Partial<ProgressEntry>): Promise<ProgressEntry> => {
    const response = await api.put(`/progress/${id}`, progressData);
    return response.data.data;
  },

  // Delete a progress entry
  deleteProgressEntry: async (id: string): Promise<void> => {
    await api.delete(`/progress/${id}`);
  },
};