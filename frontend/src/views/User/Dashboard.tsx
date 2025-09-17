"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Dumbbell, Apple, TrendingUp, Plus, Target, Activity, Zap } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    Line,
    LineChart,
    Area,
    AreaChart,
    Bar,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"
import { progressService, type ProgressEntry } from "@/services/progressService"
import { workoutService, type Workout } from "@/services/workoutService"
import { nutritionService, type NutritionEntry } from "@/services/nutritionService"

const chartConfig = {
    weight: {
        label: "Weight",
        color: "#3b82f6", // Blue
    },
    workouts: {
        label: "Workouts",
        color: "#10b981", // Green
    },
    calories: {
        label: "Calories",
        color: "#f59e0b", // Amber
    },
    progress: {
        label: "Progress",
        color: "#8b5cf6", // Purple
    },
}

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        progressEntries: [] as ProgressEntry[],
        workouts: [] as Workout[],
        nutritionEntries: [] as NutritionEntry[],
        loading: true,
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [progress, workouts, nutrition] = await Promise.all([
                    progressService.getAllProgressEntries().catch(() => []),
                    workoutService.getAllWorkouts().catch(() => []),
                    nutritionService.getAllNutritionEntries().catch(() => []),
                ])

                setDashboardData({
                    progressEntries: progress,
                    workouts,
                    nutritionEntries: nutrition,
                    loading: false,
                })
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
                setDashboardData((prev) => ({ ...prev, loading: false }))
            }
        }

        fetchDashboardData()
    }, [])

    const weightData = dashboardData.progressEntries
        .filter((entry) => entry.weight)
        .slice(-7) // Last 7 entries
        .map((entry) => ({
            date: new Date(entry.date || entry.createdAt || "").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            weight: entry.weight,
        }))

    const workoutData = dashboardData.workouts
        .slice(-7) // Last 7 workouts
        .map((workout) => ({
            date: new Date(workout.date || workout.createdAt || "").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            exercises: workout.exercises.length,
            duration: workout.duration || 0,
        }))

    const nutritionData = dashboardData.nutritionEntries
        .slice(-7) // Last 7 entries
        .map((entry) => ({
            date: new Date(entry.date || entry.createdAt || "").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            calories: entry.totalCalories || 0,
        }))

    const stats = {
        totalWorkouts: dashboardData.workouts.length,
        totalMeals: dashboardData.nutritionEntries.length,
        totalProgress: dashboardData.progressEntries.length,
        avgCalories:
            dashboardData.nutritionEntries.length > 0
                ? Math.round(
                    dashboardData.nutritionEntries.reduce((sum, entry) => sum + (entry.totalCalories || 0), 0) /
                    dashboardData.nutritionEntries.length,
                )
                : 0,
        latestWeight: dashboardData.progressEntries.find((entry) => entry.weight)?.weight || 0,
        thisWeekWorkouts: dashboardData.workouts.filter((workout) => {
            const workoutDate = new Date(workout.date || workout.createdAt || "")
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return workoutDate >= weekAgo
        }).length,
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-25 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col space-y-3">
                    <h1 className="text-5xl font-light text-balance">
                        Fitness Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Track your fitness journey and achieve your goals with comprehensive insights
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Workouts</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalWorkouts}</p>
                                </div>
                                <Dumbbell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Meals Logged</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalMeals}</p>
                                </div>
                                <Apple className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Progress Entries</p>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalProgress}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 border-amber-200 dark:border-amber-800">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">This Week</p>
                                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.thisWeekWorkouts}</p>
                                </div>
                                <Activity className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Weight Progress Chart */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                Weight Progress
                            </CardTitle>
                            <CardDescription>Your weight tracking over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {weightData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={weightData}>
                                            <defs>
                                                <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" fontSize={12} />
                                            <YAxis fontSize={12} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Area dataKey="weight" type="monotone" fill="url(#fillWeight)" stroke="#3b82f6" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                                    No weight data available
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Workout Activity Chart */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Dumbbell className="h-5 w-5 text-green-600" />
                                Workout Activity
                            </CardTitle>
                            <CardDescription>Recent workout sessions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {workoutData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={workoutData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" fontSize={12} />
                                            <YAxis fontSize={12} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="exercises" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                                    No workout data available
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Nutrition Tracking Chart */}
                    <Card className="lg:col-span-2 xl:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Apple className="h-5 w-5 text-amber-600" />
                                Nutrition Tracking
                            </CardTitle>
                            <CardDescription>Daily calorie intake</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {nutritionData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={nutritionData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" fontSize={12} />
                                            <YAxis fontSize={12} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Line
                                                dataKey="calories"
                                                type="monotone"
                                                stroke="#f59e0b"
                                                strokeWidth={3}
                                                dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                                    No nutrition data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardHeader>
                            <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                <Dumbbell className="h-6 w-6" />
                                Workout Tracker
                            </CardTitle>
                            <CardDescription className="text-blue-600 dark:text-blue-400">
                                Create, edit, and track your workout routines with detailed exercise logging
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/workouts">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Track Workouts
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardHeader>
                            <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                                <Apple className="h-6 w-6" />
                                Nutrition Tracker
                            </CardTitle>
                            <CardDescription className="text-green-600 dark:text-green-400">
                                Log meals, track macros, and monitor your daily nutritional intake
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/nutrition">
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white border-0">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Track Nutrition
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <CardHeader>
                            <CardTitle className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                <TrendingUp className="h-6 w-6" />
                                Progress Tracker
                            </CardTitle>
                            <CardDescription className="text-purple-600 dark:text-purple-400">
                                Visualize your fitness journey with detailed progress charts and metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/progress">
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Track Progress
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-2 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                Welcome to Your Fitness Dashboard
                            </CardTitle>
                            <CardDescription>Your journey to better health starts here</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                This dashboard provides you with all the tools you need to track your fitness journey. Use the cards
                                above to navigate to the different tracking sections and monitor your progress with real-time charts.
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                                        <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span>Track your workouts and exercises with detailed logging and performance metrics</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                                        <Apple className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>Monitor your nutrition and macronutrient intake with comprehensive meal tracking</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                                        <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span>Visualize your progress with detailed charts, trends, and achievement metrics</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-secondary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-secondary" />
                                Getting Started
                            </CardTitle>
                            <CardDescription>Quick tips to begin your fitness journey</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="bg-blue-600 p-2 rounded-full">
                                        <Dumbbell className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Log Your First Workout</h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Start by recording your workout routine with exercises, sets, and reps.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="bg-green-600 p-2 rounded-full">
                                        <Apple className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-green-900 dark:text-green-100">Track Your Nutrition</h4>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Log your meals and monitor your daily calorie and macronutrient intake.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <div className="bg-purple-600 p-2 rounded-full">
                                        <TrendingUp className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-purple-900 dark:text-purple-100">Record Your Progress</h4>
                                        <p className="text-sm text-purple-700 dark:text-purple-300">
                                            Track your weight, measurements, and performance metrics over time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
