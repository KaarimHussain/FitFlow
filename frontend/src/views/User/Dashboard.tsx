import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
    Dumbbell, Apple, TrendingUp, Plus
} from "lucide-react"

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background py-25 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">Fitness Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Track your fitness journey and achieve your goals</p>
                </div>

                {/* Feature Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow ">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <Dumbbell className="h-6 w-6" />
                                Workout Tracker
                            </CardTitle>
                            <CardDescription>Create, edit, and track your workout routines with detailed exercise logging</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/workouts">
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Track Workouts
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Apple className="h-6 w-6" />
                                Nutrition Tracker
                            </CardTitle>
                            <CardDescription>Log meals, track macros, and monitor your daily nutritional intake</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/nutrition">
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Track Nutrition
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-6 w-6" />
                                Progress Tracker
                            </CardTitle>
                            <CardDescription>Visualize your fitness journey with detailed progress charts and metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/progress">
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Track Progress
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Information Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to Your Fitness Dashboard</CardTitle>
                            <CardDescription>Your journey to better health starts here</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                This dashboard provides you with all the tools you need to track your fitness journey.
                                Use the cards above to navigate to the different tracking sections.
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <Dumbbell className="h-4 w-4 mt-0.5 text-primary" />
                                    <span>Track your workouts and exercises with detailed logging</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Apple className="h-4 w-4 mt-0.5 text-secondary" />
                                    <span>Monitor your nutrition and macronutrient intake</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TrendingUp className="h-4 w-4 mt-0.5 text-accent" />
                                    <span>Visualize your progress with detailed charts and metrics</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Getting Started</CardTitle>
                            <CardDescription>Quick tips to begin your journey</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Dumbbell className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Log Your First Workout</h4>
                                        <p className="text-sm text-muted-foreground">Start by recording your workout routine with exercises, sets, and reps.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-secondary/10 p-2 rounded-full">
                                        <Apple className="h-4 w-4 text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Track Your Nutrition</h4>
                                        <p className="text-sm text-muted-foreground">Log your meals and monitor your daily calorie and macronutrient intake.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-accent/10 p-2 rounded-full">
                                        <TrendingUp className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Record Your Progress</h4>
                                        <p className="text-sm text-muted-foreground">Track your weight, measurements, and performance metrics over time.</p>
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