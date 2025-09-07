import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Filter, Search, Play, MoreHorizontal } from "lucide-react"

export default function WorkoutHistory() {
    return (
        <div className="max-w-6xl mx-auto py-25 px-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Workout History</h1>
                    <p className="text-muted-foreground">Review and manage your past workouts</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search workouts..." className="pl-10" />
                        </div>
                        <Select>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="strength">Strength Training</SelectItem>
                                <SelectItem value="cardio">Cardio</SelectItem>
                                <SelectItem value="flexibility">Flexibility</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="quarter">Last 3 Months</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Workout Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">24</div>
                            <div className="text-sm text-muted-foreground">Total Workouts</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">36h</div>
                            <div className="text-sm text-muted-foreground">Total Time</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-accent">4.2</div>
                            <div className="text-sm text-muted-foreground">Avg per Week</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">12,450</div>
                            <div className="text-sm text-muted-foreground">Calories Burned</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Workout List */}
            <div className="space-y-4">
                {/* Today's Workout */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Upper Body Strength</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Today, 2:30 PM
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            65 minutes
                                        </span>
                                        <Badge variant="secondary">Strength</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <div className="font-semibold">8 exercises</div>
                                    <div className="text-sm text-muted-foreground">425 calories</div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="outline">Bench Press</Badge>
                            <Badge variant="outline">Rows</Badge>
                            <Badge variant="outline">Shoulder Press</Badge>
                            <Badge variant="outline">Pull-ups</Badge>
                            <Badge variant="outline">+4 more</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Previous Workouts */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Lower Body Power</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Yesterday, 6:00 AM
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            52 minutes
                                        </span>
                                        <Badge variant="secondary">Strength</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <div className="font-semibold">6 exercises</div>
                                    <div className="text-sm text-muted-foreground">380 calories</div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="outline">Squats</Badge>
                            <Badge variant="outline">Deadlifts</Badge>
                            <Badge variant="outline">Lunges</Badge>
                            <Badge variant="outline">Calf Raises</Badge>
                            <Badge variant="outline">+2 more</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">HIIT Cardio</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Dec 13, 7:30 PM
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            30 minutes
                                        </span>
                                        <Badge variant="secondary">Cardio</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <div className="font-semibold">5 exercises</div>
                                    <div className="text-sm text-muted-foreground">320 calories</div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="outline">Burpees</Badge>
                            <Badge variant="outline">Mountain Climbers</Badge>
                            <Badge variant="outline">Jump Squats</Badge>
                            <Badge variant="outline">High Knees</Badge>
                            <Badge variant="outline">+1 more</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
