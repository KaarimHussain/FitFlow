import { useEffect, useState, useCallback } from 'react'
import { adminService } from '@/services/adminService'
// import { type NutritionEntry } from '@/services/nutritionService'
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
import { Eye, Utensils, Flame, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminNutrition() {
  const [nutritionEntries, setNutritionEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [, setSelectedEntry] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { showNotification } = useNotification()

  const fetchNutritionEntries = useCallback(async () => {
    try {
      const data = await adminService.getAllNutritionEntries()
      setNutritionEntries(data)
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load nutrition entries',
      })
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    fetchNutritionEntries()
  }, [fetchNutritionEntries])

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'lunch':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'dinner':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'snack':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const filteredEntries = nutritionEntries.filter(entry =>
    entry.mealType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.foodItems?.some((food: any) =>
      food.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Nutrition Management</h1>
          <p className="text-muted-foreground">
            View all user nutrition entries
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
        <h1 className="text-3xl font-bold">Nutrition Management</h1>
        <p className="text-muted-foreground">
          View all user nutrition entries ({nutritionEntries.length} total)
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by meal type, user, or food..."
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
              <TableHead>Meal Type</TableHead>
              <TableHead>Food Items</TableHead>
              <TableHead>Total Calories</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  {searchTerm ? 'No nutrition entries found matching your search.' : 'No nutrition entries found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell className="font-medium">
                    {entry.user?.username || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getMealTypeColor(entry.mealType)}>
                      {entry.mealType || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {entry.foodItems?.length || 0} items
                  </TableCell>
                  <TableCell>
                    {entry.totalCalories ? `${entry.totalCalories} kcal` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {entry.date ? format(new Date(entry.date), 'MMM dd, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Utensils className="h-5 w-5" />
                            {entry.mealType} Entry - {entry.user?.username}
                          </DialogTitle>
                          <DialogDescription>
                            Nutrition entry details and food items
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">User:</span>
                                <span>{entry.user?.username || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Email:</span>
                                <span className="text-sm text-muted-foreground">
                                  {entry.user?.email || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Meal Type:</span>
                                <Badge className={getMealTypeColor(entry.mealType)}>
                                  {entry.mealType}
                                </Badge>
                              </div>
                              {entry.totalCalories && (
                                <div className="flex items-center gap-2">
                                  <Flame className="h-4 w-4" />
                                  <span className="font-medium">Total Calories:</span>
                                  <span>{entry.totalCalories} kcal</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              {entry.date && (
                                <div>
                                  <span className="font-medium">Date:</span>
                                  <span className="ml-2">{format(new Date(entry.date), 'PPP')}</span>
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Created:</span>
                                <span className="ml-2">{format(new Date(entry.createdAt), 'PPP')}</span>
                              </div>
                            </div>
                          </div>

                          {entry.foodItems && entry.foodItems.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Food Items ({entry.foodItems.length})</h4>
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {entry.foodItems.map((food: any, index: number) => (
                                  <div key={index} className="p-3 border rounded-lg">
                                    <div className="font-medium">{food.name}</div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-2">
                                      <div>
                                        {food.quantity && food.unit && (
                                          <div>Quantity: {food.quantity} {food.unit}</div>
                                        )}
                                        {food.calories && (
                                          <div>Calories: {food.calories} kcal</div>
                                        )}
                                      </div>
                                      <div>
                                        {food.protein && (
                                          <div>Protein: {food.protein}g</div>
                                        )}
                                        {food.carbs && (
                                          <div>Carbs: {food.carbs}g</div>
                                        )}
                                        {food.fat && (
                                          <div>Fat: {food.fat}g</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {entry.notes && (
                            <div>
                              <h4 className="font-medium mb-2">Notes</h4>
                              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                {entry.notes}
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

      {filteredEntries.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredEntries.length} of {nutritionEntries.length} entries
        </div>
      )}
    </div>
  )
}