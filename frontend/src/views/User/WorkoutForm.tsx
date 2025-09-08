import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Clock, Target } from "lucide-react"
import { apiService } from "@/services/api.service"
import type { Exercise } from "@/services/api.service"
import { useNavigate } from "react-router-dom"

export default function WorkoutForm() {
    const nav = useNavigate()

    /* ---------- form state ---------- */
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [exercises, setExercises] = useState<Exercise[]>([])

    /* ---------- handlers ---------- */
    const addExercise = () =>
        setExercises([
            ...exercises,
            { name: "", sets: 3, reps: "8-12", weight: 0, rest: 90, notes: "" },
        ])

    const updateEx = (i: number, field: keyof Exercise, val: any) => {
        const copy = [...exercises]
        copy[i] = { ...copy[i], [field]: val }
        setExercises(copy)
    }

    const removeEx = (i: number) => setExercises(exercises.filter((_, idx) => idx !== i))

    const handleSave = async () => {
        await apiService.createWorkout({
            name,
            category,
            description,
            tags,
            exercises,
            duration: exercises.length * 10, // rough
            caloriesBurned: exercises.length * 40,
        })
        nav("/workouts/history")
    }

    const totalSets = exercises.reduce((s, e) => s + e.sets, 0)
    const estDuration = exercises.length * 10

    return (
        <div className="max-w-4xl mx-auto py-25 px-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Create Workout</h1>
                    <p className="text-muted-foreground">Design your perfect workout routine</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
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
                                <Input id="workout-name" placeholder="e.g., Upper Body Strength" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
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
                            <Textarea id="description" placeholder="Describe your workout goals and focus areas..." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(t => (
                                    <Badge key={t} variant="secondary">
                                        {t}
                                    </Badge>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const t = prompt("Tag name?")
                                        if (t) setTags([...tags, t])
                                    }}
                                >
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
                            <div className="text-2xl font-bold text-primary">{exercises.length}</div>
                            <div className="text-sm text-muted-foreground">Exercises Added</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-secondary">~{estDuration}</div>
                            <div className="text-sm text-muted-foreground">Estimated Duration (min)</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-accent">{totalSets}</div>
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
                        <Button onClick={addExercise}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Exercise
                        </Button>
                    </CardTitle>
                    <CardDescription>Add exercises to your workout routine</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {exercises.map((ex, i) => (
                            <div key={i} className="border rounded-lg p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">{i + 1}</div>
                                        <Input
                                            placeholder="Exercise name"
                                            value={ex.name}
                                            onChange={e => updateEx(i, "name", e.target.value)}
                                            className="max-w-xs"
                                        />
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => removeEx(i)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label>Sets</Label>
                                        <Input
                                            type="number"
                                            placeholder="3"
                                            value={ex.sets}
                                            onChange={e => updateEx(i, "sets", +e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reps</Label>
                                        <Input
                                            placeholder="8-12"
                                            value={ex.reps}
                                            onChange={e => updateEx(i, "reps", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Weight (lbs)</Label>
                                        <Input
                                            type="number"
                                            placeholder="135"
                                            value={ex.weight}
                                            onChange={e => updateEx(i, "weight", +e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Rest (sec)</Label>
                                        <Input
                                            type="number"
                                            placeholder="90"
                                            value={ex.rest}
                                            onChange={e => updateEx(i, "rest", +e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea
                                        placeholder="Form cues, modifications, or observations..."
                                        className="h-20"
                                        value={ex.notes}
                                        onChange={e => updateEx(i, "notes", e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}

                        {exercises.length === 0 && (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                <div className="text-muted-foreground">
                                    <Plus className="w-8 h-8 mx-auto mb-2" />
                                    <p>Click "Add Exercise" to start building your workout</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}