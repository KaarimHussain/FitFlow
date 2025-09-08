// types/api.ts
export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    weight: number;
    rest: number;
    notes: string;
}

export interface Workout {
    _id?: string;
    name: string;
    category: string;
    description?: string;
    tags: string[];
    exercises: Exercise[];
    duration?: number;
    caloriesBurned?: number;
    date: Date;
    userId?: string;
}

export interface FoodItem {
    food: string;
    calories: number;
}

export interface Meals {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    snacks: FoodItem[];
    dinner: FoodItem[];
}

export interface Nutrition {
    _id?: string;
    date: Date;
    meals: Meals;
    totalCalories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    userId?: string;
}

export interface Measurements {
    weight?: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    arms?: number;
    thighs?: number;
}

export interface Performance {
    exercise: string;
    weight: number;
    reps: number;
    sets: number;
}

export interface Progress {
    _id?: string;
    date: Date;
    measurements?: Measurements;
    performance?: Performance[];
    userId?: string;
}

export interface DashboardStats {
    todayWorkouts: number;
    caloriesConsumed: number;
    weeklyWorkouts: number;
}

// services/api.ts
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Workout endpoints
    async getWorkouts(): Promise<Workout[]> {
        return this.request<Workout[]>('/workouts');
    }

    async getWorkout(id: string): Promise<Workout> {
        return this.request<Workout>(`/workouts/${id}`);
    }

    async createWorkout(workout: Omit<Workout, '_id' | 'date'>): Promise<{ message: string; workout: Workout }> {
        return this.request('/workouts', {
            method: 'POST',
            body: JSON.stringify(workout),
        });
    }

    // Nutrition endpoints
    async getNutrition(date?: string): Promise<Nutrition[]> {
        const query = date ? `?date=${date}` : '';
        return this.request<Nutrition[]>(`/nutrition${query}`);
    }

    async createNutrition(nutrition: Omit<Nutrition, '_id'>): Promise<{ message: string; nutrition: Nutrition }> {
        return this.request('/nutrition', {
            method: 'POST',
            body: JSON.stringify(nutrition),
        });
    }

    async addFood(data: {
        meal: keyof Meals;
        food: string;
        calories: number;
        date?: string
    }): Promise<{ message: string; nutritionEntry: Nutrition }> {
        return this.request('/nutrition/food', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Progress endpoints
    async getProgress(): Promise<Progress[]> {
        return this.request<Progress[]>('/progress');
    }

    async createProgress(progress: Omit<Progress, '_id' | 'date'>): Promise<{ message: string; progress: Progress }> {
        return this.request('/progress', {
            method: 'POST',
            body: JSON.stringify(progress),
        });
    }

    async logMeasurements(measurements: Measurements): Promise<{ message: string; progress: Progress }> {
        return this.request('/progress/measurements', {
            method: 'POST',
            body: JSON.stringify(measurements),
        });
    }

    async logPerformance(performance: Performance): Promise<{ message: string; progress: Progress }> {
        return this.request('/progress/performance', {
            method: 'POST',
            body: JSON.stringify(performance),
        });
    }

    // Dashboard endpoints
    async getDashboardStats(): Promise<DashboardStats> {
        return this.request<DashboardStats>('/dashboard/stats');
    }
}

export const apiService = new ApiService();