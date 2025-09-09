// src/services/nutritionService.ts
import api from './api';

export interface FoodItem {
  name: string;
  calories?: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fat?: number; // in grams
  quantity?: number;
  unit?: string;
}

export interface NutritionEntry {
  _id?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  foodItems: FoodItem[];
  totalCalories?: number;
  date?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const nutritionService = {
  // Get all nutrition entries for the user
  getAllNutritionEntries: async (): Promise<NutritionEntry[]> => {
    const response = await api.get('/nutrition');
    return response.data.data;
  },

  // Get a specific nutrition entry by ID
  getNutritionEntryById: async (id: string): Promise<NutritionEntry> => {
    const response = await api.get(`/nutrition/${id}`);
    return response.data.data;
  },

  // Create a new nutrition entry
  createNutritionEntry: async (nutritionData: Omit<NutritionEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<NutritionEntry> => {
    const response = await api.post('/nutrition', nutritionData);
    return response.data.data;
  },

  // Update an existing nutrition entry
  updateNutritionEntry: async (id: string, nutritionData: Partial<NutritionEntry>): Promise<NutritionEntry> => {
    const response = await api.put(`/nutrition/${id}`, nutritionData);
    return response.data.data;
  },

  // Delete a nutrition entry
  deleteNutritionEntry: async (id: string): Promise<void> => {
    await api.delete(`/nutrition/${id}`);
  },
};