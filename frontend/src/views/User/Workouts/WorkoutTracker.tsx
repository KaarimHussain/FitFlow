import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService, type Workout, type Exercise } from '@/services/workoutService';
import { useNotificationService } from '@/context/notification-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Save, ArrowLeft, Dumbbell, Clock, Tag } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WorkoutTracker: React.FC = () => {
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useNotificationService();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for creating/editing workouts
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'strength' | 'cardio' | 'flexibility' | 'other'>('other');
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: 0, reps: 0, weight: 0 }]);
  const [tags, setTags] = useState('');
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load workouts on component mount
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await workoutService.getAllWorkouts();
      setWorkouts(data);
    } catch (err) {
      showError('Failed to fetch workouts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: 0 }]);
    // Clear exercise errors when adding a new exercise
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.exercises;
      return newErrors;
    });
  };

  const handleRemoveExercise = (index: number) => {
    if (exercises.length <= 1) {
      setErrors(prev => ({ ...prev, exercises: 'At least one exercise is required' }));
      return;
    }
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
    // Clear exercise errors when removing an exercise
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.exercises;
      return newErrors;
    });
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
    // Clear exercise errors when changing an exercise
    if (errors.exercises) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.exercises;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter a name for your workout.';
    }

    if (exercises.some(ex => !ex.name.trim())) {
      newErrors.exercises = 'Please enter a name for each exercise.';
    }

    if (exercises.some(ex => ex.sets !== undefined && ex.sets < 0)) {
      newErrors.exercises = 'Sets must be zero or a positive number.';
    }

    if (exercises.some(ex => ex.reps !== undefined && ex.reps < 0)) {
      newErrors.exercises = 'Reps must be zero or a positive number.';
    }

    if (exercises.some(ex => ex.weight !== undefined && ex.weight < 0)) {
      newErrors.exercises = 'Weight must be zero or a positive number.';
    }

    if (duration !== undefined && duration < 0) {
      newErrors.duration = 'Duration must be zero or a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please check the form for errors and try again.');
      return;
    }

    try {
      const workoutData = {
        name,
        category,
        exercises,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        duration,
        notes
      };

      await workoutService.createWorkout(workoutData);

      // Reset form
      setName('');
      setCategory('other');
      setExercises([{ name: '', sets: 0, reps: 0, weight: 0 }]);
      setTags('');
      setDuration(undefined);
      setNotes('');
      setErrors({});

      // Refresh workouts list
      fetchWorkouts();
      showSuccess('Great job! Your workout has been saved successfully.');
    } catch (err) {
      showError('Oops! Failed to save your workout. Please check your connection and try again.');
      console.error(err);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await workoutService.deleteWorkout(id);
      fetchWorkouts();
      showSuccess('Workout removed successfully.');
    } catch (err) {
      showError('Failed to delete workout. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading your workouts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-25 lg:px-20 md:px-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Workout Tracker</h1>
            <p className="text-sm text-muted-foreground">Create and manage your workout routines</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Form */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              New Workout
            </CardTitle>
            <CardDescription>Log your workout details and exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workout Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.name;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="e.g., Chest Day"
                  className={`h-9 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <Alert variant="destructive" className="py-1 px-2">
                    <AlertDescription className="text-xs">{errors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value: any) => {
                    setCategory(value);
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Exercises *</Label>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-8 px-2 text-xs">Exercise</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-16">Sets</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-16">Reps</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-20">Weight</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-8"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exercises.map((exercise, index) => (
                        <TableRow key={index} className="h-10">
                          <TableCell className="p-2">
                            <Input
                              placeholder="Exercise"
                              value={exercise.name}
                              onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={exercise.sets || ''}
                              onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={exercise.reps || ''}
                              onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              step="0.5"
                              value={exercise.weight || ''}
                              onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveExercise(index)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button type="button" variant="outline" onClick={handleAddExercise} className="h-8 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add Exercise
                </Button>
                {errors.exercises && (
                  <Alert variant="destructive" className="py-1 px-2">
                    <AlertDescription className="text-xs">{errors.exercises}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., gym, weights, upper body"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Duration (min)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={duration || ''}
                  onChange={(e) => {
                    setDuration(parseInt(e.target.value) || undefined);
                    if (errors.duration) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.duration;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="e.g., 60"
                  className={`h-9 ${errors.duration ? 'border-red-500' : ''}`}
                />
                {errors.duration && (
                  <Alert variant="destructive" className="py-1 px-2">
                    <AlertDescription className="text-xs">{errors.duration}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Workout notes..."
                  className="h-20 resize-none text-sm"
                />
              </div>

              <Button type="submit" className="w-full h-9">
                <Save className="h-4 w-4 mr-2" /> Save Workout
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Workouts List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your workout history</CardDescription>
          </CardHeader>
          <CardContent>
            {workouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No workouts yet</h3>
                <p className="text-muted-foreground text-sm">Start by logging your first workout routine</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <div key={workout._id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base truncate">{workout.name}</h3>
                          <Badge
                            variant={workout.category === 'strength' ? 'default' :
                              workout.category === 'cardio' ? 'secondary' :
                                workout.category === 'flexibility' ? 'outline' : 'destructive'}
                            className="text-xs py-0.5 px-1.5"
                          >
                            {workout.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Dumbbell className="h-3 w-3" />
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                          </span>
                          {workout.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {workout.duration} min
                            </span>
                          )}
                        </div>
                        {workout.tags && workout.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {workout.tags.map((tag, index) => (
                              <span key={index} className="bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {workout.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{workout.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => workout._id && handleDeleteWorkout(workout._id)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          {new Date(workout.createdAt || '').toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {workout.exercises.slice(0, 3).map((exercise, idx) => (
                        <div key={idx} className="bg-muted/50 rounded p-2 text-xs">
                          <div className="font-medium truncate">{exercise.name}</div>
                          <div className="text-muted-foreground">
                            {exercise.sets} × {exercise.reps}
                            {exercise.weight ? ` × ${exercise.weight}` : ''}
                          </div>
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <div className="bg-muted/50 rounded p-2 text-xs flex items-center justify-center">
                          +{workout.exercises.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutTracker;