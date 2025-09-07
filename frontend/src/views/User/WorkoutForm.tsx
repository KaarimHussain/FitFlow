import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Clock, Target } from "lucide-react"

export default function WorkoutForm() {
    return (
        <div className="max-w-4xl mx-auto py-25 px-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Create Workout</h1>
                    <p className="text-muted-foreground">Design your perfect workout routine</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Target className="w-4 h-4 mr-2" />
                    Save Workout
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Workout Details */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Workout Details
                        </CardTitle>
                        <CardDescription>Set up your workout information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="workout-name">Workout Name</Label>
                                <Input id="workout-name" placeholder="e.g., Upper Body Strength" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="strength">Strength Training</SelectItem>
                                        <SelectItem value="cardio">Cardio</SelectItem>
                                        <SelectItem value="flexibility">Flexibility</SelectItem>
                                        <SelectItem value="sports">Sports</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Describe your workout goals and focus areas..." />
                        </div>

                        <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Upper Body</Badge>
                                <Badge variant="secondary">Strength</Badge>
                                <Badge variant="secondary">Beginner</Badge>
                                <Button variant="outline" size="sm">
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add Tag
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Workout Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Workout Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-primary">0</div>
                            <div className="text-sm text-muted-foreground">Exercises Added</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-secondary">~0</div>
                            <div className="text-sm text-muted-foreground">Estimated Duration (min)</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-accent">0</div>
                            <div className="text-sm text-muted-foreground">Total Sets</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Exercise List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Exercises
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Exercise
                        </Button>
                    </CardTitle>
                    <CardDescription>Add exercises to your workout routine</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Sample Exercise Entry */}
                        <div className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Bench Press</h4>
                                        <p className="text-sm text-muted-foreground">Chest, Triceps, Shoulders</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Sets</Label>
                                    <Input placeholder="3" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reps</Label>
                                    <Input placeholder="8-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Weight (lbs)</Label>
                                    <Input placeholder="135" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Rest (sec)</Label>
                                    <Input placeholder="90" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea placeholder="Form cues, modifications, or observations..." className="h-20" />
                            </div>
                        </div>

                        {/* Add Exercise Placeholder */}
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                            <div className="text-muted-foreground">
                                <Plus className="w-8 h-8 mx-auto mb-2" />
                                <p>Click "Add Exercise" to start building your workout</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
