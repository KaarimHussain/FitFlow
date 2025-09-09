// src/services/workoutService.ts
import api from './api';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  notes?: string;
}

export interface Workout {
  _id?: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'other';
  exercises: Exercise[];
  tags?: string[];
  duration?: number;
  notes?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const workoutService = {
  // Get all workouts for the user
  getAllWorkouts: async (): Promise<Workout[]> => {
    const response = await api.get('/workouts');
    return response.data.data;
  },

  // Get a specific workout by ID
  getWorkoutById: async (id: string): Promise<Workout> => {
    const response = await api.get(`/workouts/${id}`);
    return response.data.data;
  },

  // Create a new workout
  createWorkout: async (workoutData: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>): Promise<Workout> => {
    const response = await api.post('/workouts', workoutData);
    return response.data.data;
  },

  // Update an existing workout
  updateWorkout: async (id: string, workoutData: Partial<Workout>): Promise<Workout> => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data.data;
  },

  // Delete a workout
  deleteWorkout: async (id: string): Promise<void> => {
    await api.delete(`/workouts/${id}`);
  },
};