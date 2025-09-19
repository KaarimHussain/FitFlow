import { useEffect, useState, useCallback } from 'react'
import { adminService } from '@/services/adminService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useNotification } from '@/context/notification-context'
import { Eye, Target, Dumbbell, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminWorkouts() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [, setSelectedWorkout] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { showNotification } = useNotification()

  const fetchWorkouts = useCallback(async () => {
    try {
      const data = await adminService.getAllWorkouts()
      setWorkouts(data)
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load workouts',
      })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchWorkouts()
  }, [fetchWorkouts])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'cardio':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'flexibility':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const filteredWorkouts = workouts.filter(workout =>
    workout.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.exercises?.some((exercise: any) =>
      exercise.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    workout.tags?.some((tag: string) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workouts Management</h1>
          <p className="text-muted-foreground">
            View all user workouts
          </p>
        </div>
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workouts Management</h1>
        <p className="text-muted-foreground">
          View all user workouts ({workouts.length} total)
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, user, category, or exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Workout Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Exercises</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  {searchTerm ? 'No workouts found matching your search.' : 'No workouts found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredWorkouts.map((workout) => (
                <TableRow key={workout._id}>
                  <TableCell className="font-medium">
                    {workout.user?.username || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {workout.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(workout.category)}>
                      {workout.category || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {workout.exercises?.length || 0} exercises
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {workout.tags?.slice(0, 2).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {workout.tags?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{workout.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {workout.date ? format(new Date(workout.date), 'MMM dd, yyyy') : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedWorkout(workout)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Dumbbell className="h-5 w-5" />
                            {workout.name} - {workout.user?.username}
                          </DialogTitle>
                          <DialogDescription>
                            Workout details and exercises
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">User:</span>
                                <span>{workout.user?.username || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Email:</span>
                                <span className="text-sm text-muted-foreground">
                                  {workout.user?.email || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                <span className="font-medium">Category:</span>
                                <Badge className={getCategoryColor(workout.category)}>
                                  {workout.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {workout.date && (
                                <div>
                                  <span className="font-medium">Date:</span>
                                  <span className="ml-2">{workout.date ? format(new Date(workout.date), 'MMM dd, yyyy') : "N/A"}</span>
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Created:</span>
                                <span className="ml-2">{workout.date ? format(new Date(workout.date), 'MMM dd, yyyy') : "N/A"}</span>
                              </div>
                              {workout.tags && workout.tags.length > 0 && (
                                <div>
                                  <span className="font-medium">Tags:</span>
                                  <div className="flex gap-1 flex-wrap mt-1">
                                    {workout.tags.map((tag: string, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {workout.exercises && workout.exercises.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Exercises ({workout.exercises.length})</h4>
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {workout.exercises.map((exercise: any, index: number) => (
                                  <div key={index} className="p-3 border rounded-lg">
                                    <div className="font-medium">{exercise.name}</div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-2">
                                      <div>
                                        {exercise.sets && (
                                          <div>Sets: {exercise.sets}</div>
                                        )}
                                        {exercise.reps && (
                                          <div>Reps: {exercise.reps}</div>
                                        )}
                                      </div>
                                      <div>
                                        {exercise.weight && (
                                          <div>Weight: {exercise.weight}kg</div>
                                        )}
                                        {exercise.duration && (
                                          <div>Duration: {exercise.duration} min</div>
                                        )}
                                      </div>
                                    </div>
                                    {exercise.notes && (
                                      <div className="text-sm text-muted-foreground mt-2">
                                        <span className="font-medium">Notes:</span> {exercise.notes}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {workout.notes && (
                            <div>
                              <h4 className="font-medium mb-2">Workout Notes</h4>
                              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                {workout.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredWorkouts.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredWorkouts.length} of {workouts.length} workouts
        </div>
      )}
    </div>
  )
}