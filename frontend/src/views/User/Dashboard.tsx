import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Link } from "react-router-dom"
import {
    Activity,
    Apple,
    TrendingUp,
    Dumbbell,
    Target,
    Calendar,
    Clock,
    Flame,
    Trophy,
    Plus,
    BarChart3,
    PieChart,
    LineChart,
} from "lucide-react"

// Mock data for demonstration
const mockData = {
    todayStats: {
        workoutsCompleted: 1,
        caloriesBurned: 450,
        caloriesConsumed: 1850,
        waterIntake: 6,
        activeMinutes: 75,
    },
    weeklyGoals: {
        workouts: { current: 4, target: 5 },
        calories: { current: 2100, target: 2200 },
        water: { current: 7, target: 8 },
    },
    recentWorkouts: [
        { name: "Upper Body Strength", duration: "45 min", calories: 320, date: "Today" },
        { name: "Cardio HIIT", duration: "30 min", calories: 280, date: "Yesterday" },
        { name: "Leg Day", duration: "60 min", calories: 420, date: "2 days ago" },
    ],
    nutritionSummary: {
        calories: 1850,
        protein: 120,
        carbs: 180,
        fat: 65,
        targetCalories: 2200,
    },
}

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background py-25 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">Fitness Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Track your fitness journey and achieve your goals</p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-card-foreground">Today's Workouts</CardTitle>
                            <Dumbbell className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-card-foreground">{mockData.todayStats.workoutsCompleted}</div>
                            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-card-foreground">Calories Burned</CardTitle>
                            <Flame className="h-4 w-4 text-chart-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-card-foreground">{mockData.todayStats.caloriesBurned}</div>
                            <p className="text-xs text-muted-foreground">Target: 500 kcal</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-card-foreground">Calories Consumed</CardTitle>
                            <Apple className="h-4 w-4 text-chart-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-card-foreground">{mockData.todayStats.caloriesConsumed}</div>
                            <p className="text-xs text-muted-foreground">Target: {mockData.nutritionSummary.targetCalories} kcal</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-card-foreground">Active Minutes</CardTitle>
                            <Activity className="h-4 w-4 text-chart-1" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-card-foreground">{mockData.todayStats.activeMinutes}</div>
                            <p className="text-xs text-muted-foreground">Goal: 60 min</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Workout Tracking Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-card-foreground flex items-center gap-2">
                                    <Dumbbell className="h-5 w-5 text-primary" />
                                    Workout Tracking
                                </CardTitle>
                                <CardDescription>Log and monitor your workouts</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Link to="/workouts/new">
                                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-20 flex flex-col items-center justify-center gap-2 w-full">
                                            <Plus className="h-5 w-5" />
                                            <span>New Workout</span>
                                        </Button>
                                    </Link>
                                    <Link to="/workouts/new">
                                        <Button
                                            variant="outline"
                                            className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent w-full"
                                        >
                                            <Target className="h-5 w-5" />
                                            <span>Quick Log</span>
                                        </Button>
                                    </Link>
                                    <Link to="/workouts/history">
                                        <Button
                                            variant="outline"
                                            className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent w-full"
                                        >
                                            <Calendar className="h-5 w-5" />
                                            <span>Schedule</span>
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Workouts */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-card-foreground">Recent Workouts</CardTitle>
                                <CardDescription>Your latest training sessions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockData.recentWorkouts.map((workout, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-full">
                                                    <Dumbbell className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-card-foreground">{workout.name}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {workout.duration}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Flame className="h-3 w-3" />
                                                            {workout.calories} kcal
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">{workout.date}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Nutrition & Progress Sidebar */}
                    <div className="space-y-6">
                        {/* Nutrition Summary */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-card-foreground flex items-center gap-2">
                                    <Apple className="h-5 w-5 text-chart-2" />
                                    Nutrition Today
                                </CardTitle>
                                <CardDescription>Daily intake summary</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Calories</span>
                                        <span className="font-medium text-card-foreground">
                                            {mockData.nutritionSummary.calories}/{mockData.nutritionSummary.targetCalories}
                                        </span>
                                    </div>
                                    <Progress
                                        value={(mockData.nutritionSummary.calories / mockData.nutritionSummary.targetCalories) * 100}
                                        className="h-2"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 bg-muted rounded">
                                        <div className="text-sm font-medium text-card-foreground">{mockData.nutritionSummary.protein}g</div>
                                        <div className="text-xs text-muted-foreground">Protein</div>
                                    </div>
                                    <div className="p-2 bg-muted rounded">
                                        <div className="text-sm font-medium text-card-foreground">{mockData.nutritionSummary.carbs}g</div>
                                        <div className="text-xs text-muted-foreground">Carbs</div>
                                    </div>
                                    <div className="p-2 bg-muted rounded">
                                        <div className="text-sm font-medium text-card-foreground">{mockData.nutritionSummary.fat}g</div>
                                        <div className="text-xs text-muted-foreground">Fat</div>
                                    </div>
                                </div>

                                <Link to="/nutrition">
                                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Log Meal
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Weekly Goals */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-card-foreground flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-chart-1" />
                                    Weekly Goals
                                </CardTitle>
                                <CardDescription>Track your progress</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Workouts</span>
                                        <span className="font-medium text-card-foreground">
                                            {mockData.weeklyGoals.workouts.current}/{mockData.weeklyGoals.workouts.target}
                                        </span>
                                    </div>
                                    <Progress
                                        value={(mockData.weeklyGoals.workouts.current / mockData.weeklyGoals.workouts.target) * 100}
                                        className="h-2"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Avg Calories</span>
                                        <span className="font-medium text-card-foreground">
                                            {mockData.weeklyGoals.calories.current}/{mockData.weeklyGoals.calories.target}
                                        </span>
                                    </div>
                                    <Progress
                                        value={(mockData.weeklyGoals.calories.current / mockData.weeklyGoals.calories.target) * 100}
                                        className="h-2"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Water (glasses)</span>
                                        <span className="font-medium text-card-foreground">
                                            {mockData.weeklyGoals.water.current}/{mockData.weeklyGoals.water.target}
                                        </span>
                                    </div>
                                    <Progress
                                        value={(mockData.weeklyGoals.water.current / mockData.weeklyGoals.water.target) * 100}
                                        className="h-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress Tracking */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-card-foreground flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-chart-3" />
                                    Progress Tracking
                                </CardTitle>
                                <CardDescription>Monitor your improvements</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-16 bg-transparent">
                                        <BarChart3 className="h-4 w-4" />
                                        <span className="text-xs">Weight</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-16 bg-transparent">
                                        <PieChart className="h-4 w-4" />
                                        <span className="text-xs">Body Fat</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-16 bg-transparent">
                                        <LineChart className="h-4 w-4" />
                                        <span className="text-xs">Strength</span>
                                    </Button>
                                </div>

                                <Link to="/progress">
                                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Record Progress
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Feature Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <Dumbbell className="h-6 w-6" />
                                Workout Management
                            </CardTitle>
                            <CardDescription>
                                Create, edit, and track your workout routines with detailed exercise logging
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/workouts/history">
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                    Manage Workouts
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-secondary flex items-center gap-2">
                                <Apple className="h-6 w-6" />
                                Nutrition Tracking
                            </CardTitle>
                            <CardDescription>Log meals, track macros, and monitor your daily nutritional intake</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/nutrition">
                                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                    Track Nutrition
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-accent flex items-center gap-2">
                                <TrendingUp className="h-6 w-6" />
                                Progress Analytics
                            </CardTitle>
                            <CardDescription>
                                Visualize your fitness journey with detailed progress charts and metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/progress">
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">View Progress</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
