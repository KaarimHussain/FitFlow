import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Target, Calendar, Award, Scale, Ruler, Dumbbell } from "lucide-react"

export default function ProgressTracker() {
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
                                <span className="font-semibold">172 lbs</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Target</span>
                                <span className="font-semibold">165 lbs</span>
                            </div>
                            <Progress value={71} className="h-2" />
                            <div className="text-xs text-muted-foreground">7 lbs to go</div>
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
                                <span className="font-semibold">185 lbs</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Target</span>
                                <span className="font-semibold">225 lbs</span>
                            </div>
                            <Progress value={82} className="h-2" />
                            <div className="text-xs text-muted-foreground">40 lbs to go</div>
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
                                <span className="font-semibold">4 / 5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">This Week</span>
                                <Badge variant="secondary">On Track</Badge>
                            </div>
                            <Progress value={80} className="h-2" />
                            <div className="text-xs text-muted-foreground">1 workout remaining</div>
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
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (lbs)</Label>
                                        <Input id="weight" placeholder="172" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="body-fat">Body Fat (%)</Label>
                                        <Input id="body-fat" placeholder="15.2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="chest">Chest (in)</Label>
                                        <Input id="chest" placeholder="42" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="waist">Waist (in)</Label>
                                        <Input id="waist" placeholder="32" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="arms">Arms (in)</Label>
                                        <Input id="arms" placeholder="15.5" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="thighs">Thighs (in)</Label>
                                        <Input id="thighs" placeholder="24" />
                                    </div>
                                </div>

                                <Button className="w-full">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Log Today's Measurements
                                </Button>
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
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div>
                                            <div className="font-semibold">Today</div>
                                            <div className="text-sm text-muted-foreground">Dec 15, 2024</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">172 lbs</div>
                                            <div className="text-sm text-green-600">-0.5 lbs</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div>
                                            <div className="font-semibold">Last Week</div>
                                            <div className="text-sm text-muted-foreground">Dec 8, 2024</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">172.5 lbs</div>
                                            <div className="text-sm text-green-600">-1.2 lbs</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div>
                                            <div className="font-semibold">2 Weeks Ago</div>
                                            <div className="text-sm text-muted-foreground">Dec 1, 2024</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">173.7 lbs</div>
                                            <div className="text-sm text-green-600">-0.8 lbs</div>
                                        </div>
                                    </div>
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
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="exercise">Exercise</Label>
                                    <Input id="exercise" placeholder="Bench Press" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="weight-lifted">Weight (lbs)</Label>
                                        <Input id="weight-lifted" placeholder="185" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reps">Reps</Label>
                                        <Input id="reps" placeholder="8" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sets">Sets</Label>
                                        <Input id="sets" placeholder="3" />
                                    </div>
                                </div>

                                <Button className="w-full">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Log Performance
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Performance History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Records</CardTitle>
                                <CardDescription>Your personal bests and recent lifts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div>
                                            <div className="font-semibold">Bench Press</div>
                                            <div className="text-sm text-muted-foreground">Personal Best</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">185 lbs</div>
                                            <div className="text-sm text-green-600">+5 lbs</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div>
                                            <div className="font-semibold">Squat</div>
                                            <div className="text-sm text-muted-foreground">Personal Best</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">225 lbs</div>
                                            <div className="text-sm text-green-600">+10 lbs</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div>
                                            <div className="font-semibold">Deadlift</div>
                                            <div className="text-sm text-muted-foreground">Personal Best</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">275 lbs</div>
                                            <div className="text-sm text-green-600">+15 lbs</div>
                                        </div>
                                    </div>
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
