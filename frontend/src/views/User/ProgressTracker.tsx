import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Target, Calendar, Award, Scale, Ruler, Dumbbell } from "lucide-react"
import { apiService } from "@/services/api.service"

export default function ProgressTracker() {
    /* ---------- dummy goals ---------- */
    const weightGoal = { current: 172, target: 165 }
    const strengthGoal = { current: 185, target: 225 } /* bench */
    const weeklyGoal = { current: 4, target: 5 }

    /* ---------- handlers ---------- */
    const logMeasurements = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        await apiService.logMeasurements({
            weight: Number(fd.get("weight")),
            bodyFat: Number(fd.get("bodyFat")),
            chest: Number(fd.get("chest")),
            waist: Number(fd.get("waist")),
            arms: Number(fd.get("arms")),
            thighs: Number(fd.get("thighs")),
        })
        alert("Measurements saved")
    }

    const logPerformance = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        await apiService.logPerformance({
            exercise: String(fd.get("exercise")),
            weight: Number(fd.get("weight")),
            reps: Number(fd.get("reps")),
            sets: Number(fd.get("sets")),
        })
        alert("Performance saved")
    }

    return (
        <div className="max-w-6xl mx-auto py-25 px-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Progress Tracker</h1>
                    <p className="text-muted-foreground">Monitor your fitness journey and achievements</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Target className="w-4 h-4 mr-2" />
                    Set New Goal
                </Button>
            </div>

            {/* Current Goals Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Scale className="w-5 h-5 text-primary" />
                            Weight Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Current</span>
                                <span className="font-semibold">{weightGoal.current} lbs</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Target</span>
                                <span className="font-semibold">{weightGoal.target} lbs</span>
                            </div>
                            <Progress value={((weightGoal.target - weightGoal.current) / (weightGoal.target - 180)) * 100} className="h-2" />
                            <div className="text-xs text-muted-foreground">{weightGoal.current - weightGoal.target} lbs to go</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Dumbbell className="w-5 h-5 text-primary" />
                            Strength Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Bench Press</span>
                                <span className="font-semibold">{strengthGoal.current} lbs</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Target</span>
                                <span className="font-semibold">{strengthGoal.target} lbs</span>
                            </div>
                            <Progress value={(strengthGoal.current / strengthGoal.target) * 100} className="h-2" />
                            <div className="text-xs text-muted-foreground">{strengthGoal.target - strengthGoal.current} lbs to go</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Award className="w-5 h-5 text-primary" />
                            Weekly Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Workouts</span>
                                <span className="font-semibold">{weeklyGoal.current} / {weeklyGoal.target}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">This Week</span>
                                <Badge variant="secondary">On Track</Badge>
                            </div>
                            <Progress value={(weeklyGoal.current / weeklyGoal.target) * 100} className="h-2" />
                            <div className="text-xs text-muted-foreground">{weeklyGoal.target - weeklyGoal.current} workout remaining</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="measurements" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="measurements">Measurements</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="measurements" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Log New Measurement */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Ruler className="w-5 h-5 text-primary" />
                                    Log Measurement
                                </CardTitle>
                                <CardDescription>Record your body measurements and weight</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4" onSubmit={logMeasurements}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="weight">Weight (lbs)</Label>
                                            <Input name="weight" placeholder="172" type="number" step="0.1" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bodyFat">Body Fat (%)</Label>
                                            <Input name="bodyFat" placeholder="15.2" type="number" step="0.1" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="chest">Chest (in)</Label>
                                            <Input name="chest" placeholder="42" type="number" step="0.1" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="waist">Waist (in)</Label>
                                            <Input name="waist" placeholder="32" type="number" step="0.1" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="arms">Arms (in)</Label>
                                            <Input name="arms" placeholder="15.5" type="number" step="0.1" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="thighs">Thighs (in)</Label>
                                            <Input name="thighs" placeholder="24" type="number" step="0.1" />
                                        </div>
                                    </div>

                                    <Button className="w-full">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Log Today's Measurements
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Recent Measurements */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Recent Progress
                                </CardTitle>
                                <CardDescription>Your measurement history</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>History will appear here once you log more data.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Log Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Dumbbell className="w-5 h-5 text-primary" />
                                    Log Performance
                                </CardTitle>
                                <CardDescription>Record your strength and endurance progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4" onSubmit={logPerformance}>
                                    <div className="space-y-2">
                                        <Label htmlFor="exercise">Exercise</Label>
                                        <Input name="exercise" placeholder="Bench Press" required />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="weight">Weight (lbs)</Label>
                                            <Input name="weight" placeholder="185" type="number" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reps">Reps</Label>
                                            <Input name="reps" placeholder="8" type="number" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sets">Sets</Label>
                                            <Input name="sets" placeholder="3" type="number" required />
                                        </div>
                                    </div>

                                    <Button className="w-full">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Log Performance
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Performance History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Records</CardTitle>
                                <CardDescription>Your personal bests and recent lifts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>History will appear here once you log more data.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="goals" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                Goal Management
                            </CardTitle>
                            <CardDescription>Set and track your fitness objectives</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Goal setting interface coming soon...</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Progress Analytics
                            </CardTitle>
                            <CardDescription>Detailed charts and insights</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Analytics dashboard coming soon...</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}