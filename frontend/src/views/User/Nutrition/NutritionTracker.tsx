"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { nutritionService, type NutritionEntry, type FoodItem } from "@/services/nutritionService"
import { useNotificationService } from "@/context/notification-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, Save, ArrowLeft, Apple } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

const NutritionTracker: React.FC = () => {
  const navigate = useNavigate()
  const { error: showError, success: showSuccess } = useNotificationService()
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Form state for creating/editing nutrition entries
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack" | "other">("breakfast")
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    { name: "", calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: "serving" },
  ])
  const [notes, setNotes] = useState("")

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load nutrition entries on component mount
  useEffect(() => {
    fetchNutritionEntries()
  }, [])

  const fetchNutritionEntries = async () => {
    try {
      setLoading(true)
      const data = await nutritionService.getAllNutritionEntries()
      setNutritionEntries(data)
    } catch (err) {
      showError("Failed to fetch nutrition entries. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, { name: "", calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: "serving" }])
    // Clear food items errors when adding a new item
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.foodItems
      return newErrors
    })
  }

  const handleRemoveFoodItem = (index: number) => {
    if (foodItems.length <= 1) {
      setErrors((prev) => ({ ...prev, foodItems: "At least one food item is required" }))
      return
    }
    const newFoodItems = [...foodItems]
    newFoodItems.splice(index, 1)
    setFoodItems(newFoodItems)
    // Clear food items errors when removing an item
    if (errors.foodItems) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.foodItems
        return newErrors
      })
    }
  }

  const handleFoodItemChange = (index: number, field: keyof FoodItem, value: string | number) => {
    const newFoodItems = [...foodItems]
    newFoodItems[index] = { ...newFoodItems[index], [field]: value }
    setFoodItems(newFoodItems)
    // Clear food items errors when changing an item
    if (errors.foodItems) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.foodItems
        return newErrors
      })
    }
  }

  const calculateTotalCalories = () => {
    return foodItems.reduce((total, item) => total + (item.calories || 0), 0)
  }

  const calculateTotalProtein = () => {
    return foodItems.reduce((total, item) => total + (item.protein || 0), 0)
  }

  const calculateTotalCarbs = () => {
    return foodItems.reduce((total, item) => total + (item.carbs || 0), 0)
  }

  const calculateTotalFat = () => {
    return foodItems.reduce((total, item) => total + (item.fat || 0), 0)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (foodItems.some((item) => !item.name.trim())) {
      newErrors.foodItems = "Please enter a name for each food item."
    }

    if (foodItems.some((item) => item.calories !== undefined && item.calories < 0)) {
      newErrors.foodItems = "Calories must be zero or a positive number."
    }

    if (foodItems.some((item) => item.protein !== undefined && item.protein < 0)) {
      newErrors.foodItems = "Protein must be zero or a positive number."
    }

    if (foodItems.some((item) => item.carbs !== undefined && item.carbs < 0)) {
      newErrors.foodItems = "Carbs must be zero or a positive number."
    }

    if (foodItems.some((item) => item.fat !== undefined && item.fat < 0)) {
      newErrors.foodItems = "Fat must be zero or a positive number."
    }

    if (foodItems.some((item) => item.quantity !== undefined && item.quantity <= 0)) {
      newErrors.foodItems = "Quantity must be greater than zero."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showError("Please check the form for errors and try again.")
      return
    }

    try {
      const nutritionData = {
        mealType,
        foodItems,
        totalCalories: calculateTotalCalories(),
        notes,
      }

      await nutritionService.createNutritionEntry(nutritionData)

      // Reset form
      setMealType("breakfast")
      setFoodItems([{ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: "serving" }])
      setNotes("")
      setErrors({})

      // Refresh nutrition entries list
      fetchNutritionEntries()
      showSuccess("Meal logged successfully! Keep up the good work.")
    } catch (err) {
      showError("Oops! Failed to log your meal. Please check your connection and try again.")
      console.error(err)
    }
  }

  const handleDeleteNutritionEntry = async (id: string) => {
    try {
      await nutritionService.deleteNutritionEntry(id)
      fetchNutritionEntries()
      showSuccess("Meal entry removed successfully.")
    } catch (err) {
      showError("Failed to delete meal entry. Please try again.")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm md:text-base">Loading your nutrition entries...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-9 w-9 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">Nutrition Tracker</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Log and monitor your daily food intake</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <Card className="xl:col-span-1 order-2 xl:order-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Apple className="h-5 w-5 text-primary" />
              Log Meal
            </CardTitle>
            <CardDescription className="text-sm">Record your food intake and nutritional data</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mealType" className="text-sm font-medium">
                  Meal Type
                </Label>
                <Select
                  value={mealType}
                  onValueChange={(value: any) => {
                    setMealType(value)
                  }}
                >
                  <SelectTrigger className="h-10 text-base">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Food Items *</Label>

                {/* Mobile Layout - Cards with single-line inputs */}
                <div className="space-y-3 ">
                  {foodItems.map((foodItem, index) => (
                    <Card key={index} className="p-3 bg-muted/30">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Food Item {index + 1}</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFoodItem(index)}
                            className="h-8 w-8 p-0 flex-shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Food name - full width */}
                        <Input
                          placeholder="Food name"
                          value={foodItem.name}
                          onChange={(e) => handleFoodItemChange(index, "name", e.target.value)}
                          className="h-10 text-base w-full"
                        />

                        {/* Calories and Quantity in a flex row */}
                        <div className="flex gap-2">
                          <div className="flex-1 min-w-0">
                            <Label className="text-xs text-muted-foreground block mb-1">Calories</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.calories || ""}
                              onChange={(e) =>
                                handleFoodItemChange(index, "calories", Number.parseInt(e.target.value) || 0)
                              }
                              className="h-9 text-sm w-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Label className="text-xs text-muted-foreground block mb-1">Quantity</Label>
                            <Input
                              type="number"
                              placeholder="1"
                              min="0.1"
                              step="0.1"
                              value={foodItem.quantity || ""}
                              onChange={(e) =>
                                handleFoodItemChange(index, "quantity", Number.parseFloat(e.target.value) || 0)
                              }
                              className="h-9 text-sm w-full"
                            />
                          </div>
                        </div>

                        {/* Protein, Carbs, Fat in a flex row to ensure single line */}
                        <div className="flex gap-2">
                          <div className="flex-1 min-w-0">
                            <Label className="text-xs text-muted-foreground block mb-1">Protein (g)</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.protein || ""}
                              onChange={(e) =>
                                handleFoodItemChange(index, "protein", Number.parseInt(e.target.value) || 0)
                              }
                              className="h-9 text-sm w-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Label className="text-xs text-muted-foreground block mb-1">Carbs (g)</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.carbs || ""}
                              onChange={(e) =>
                                handleFoodItemChange(index, "carbs", Number.parseInt(e.target.value) || 0)
                              }
                              className="h-9 text-sm w-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Label className="text-xs text-muted-foreground block mb-1">Fat (g)</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.fat || ""}
                              onChange={(e) => handleFoodItemChange(index, "fat", Number.parseInt(e.target.value) || 0)}
                              className="h-9 text-sm w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop Layout - Table */}
                {/* <div className="hidden sm:block border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent bg-muted/50">
                        <TableHead className="h-10 px-3 text-xs font-medium">Food</TableHead>
                        <TableHead className="h-10 px-3 text-xs font-medium w-20">Cal</TableHead>
                        <TableHead className="h-10 px-3 text-xs font-medium w-16">Pro</TableHead>
                        <TableHead className="h-10 px-3 text-xs font-medium w-16">Carb</TableHead>
                        <TableHead className="h-10 px-3 text-xs font-medium w-16">Fat</TableHead>
                        <TableHead className="h-10 px-3 text-xs font-medium w-20">Qty</TableHead>
                        <TableHead className="h-10 px-3 text-xs font-medium w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {foodItems.map((foodItem, index) => (
                        <TableRow key={index} className="h-12">
                          <TableCell className="p-2">
                            <Input
                              placeholder="Food name"
                              value={foodItem.name}
                              onChange={(e) => handleFoodItemChange(index, "name", e.target.value)}
                              className="h-9 text-sm border-0 bg-transparent focus:bg-background focus:border-input w-full"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.calories || ""}
                              onChange={(e) =>
                                handleFoodItemChange(index, "calories", Number.parseInt(e.target.value) || 0)
                              }
                              className="h-9 text-sm border-0 bg-transparent focus:bg-background focus:border-input w-full"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.protein || ""}
                              onChange={(e) =>
                                handleFoodItemChange(index, "protein", Number.parseInt(e.target.value) || 0)
                              }
                              className="h-9 text-sm border-0 bg-transparent focus:bg-background focus:border-input w-full"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.carbs || ""}
                              onChange={(e) =>
                                handleFoodItemChange(index, "carbs", Number.parseInt(e.target.value) || 0)
                              }
                              className="h-9 text-sm border-0 bg-transparent focus:bg-background focus:border-input w-full"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.fat || ""}
                              onChange={(e) => handleFoodItemChange(index, "fat", Number.parseInt(e.target.value) || 0)}
                              className="h-9 text-sm border-0 bg-transparent focus:bg-background focus:border-input w-full"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="1"
                              min="0.1"
                              step="0.1"
                              value={foodItem.quantity || ""}
                              onChange={(e) =>
                                handleFoodItemChange(index, "quantity", Number.parseFloat(e.target.value) || 0)
                              }
                              className="h-9 text-sm border-0 bg-transparent focus:bg-background focus:border-input w-full"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveFoodItem(index)}
                              className="h-8 w-8 flex-shrink-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div> */}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFoodItem}
                  className="w-full h-10 text-sm font-medium bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Food Item
                </Button>

                {errors.foodItems && (
                  <Alert variant="destructive" className="py-2 px-3">
                    <AlertDescription className="text-sm">{errors.foodItems}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium">Calories</p>
                      <p className="text-lg font-bold text-green-900 dark:text-green-100">{calculateTotalCalories()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium">Protein</p>
                      <p className="text-lg font-bold text-green-900 dark:text-green-100">{calculateTotalProtein()}g</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium">Carbs</p>
                      <p className="text-lg font-bold text-green-900 dark:text-green-100">{calculateTotalCarbs()}g</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium">Fat</p>
                      <p className="text-lg font-bold text-green-900 dark:text-green-100">{calculateTotalFat()}g</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Meal notes..."
                  className="h-24 resize-none text-base"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-base font-medium">
                <Save className="h-4 w-4 mr-2" /> Log Meal
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 order-1 xl:order-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Recent Meals</CardTitle>
            <CardDescription className="text-sm">Your nutrition history</CardDescription>
          </CardHeader>
          <CardContent>
            {nutritionEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Apple className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No meals logged yet</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Start by recording your first meal using the form
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {nutritionEntries.map((entry) => (
                  <Card
                    key={entry._id}
                    className="p-4 hover:bg-muted/30 transition-colors border-l-4 border-l-green-500/20"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-base capitalize">{entry.mealType}</h3>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  entry.mealType === "breakfast"
                                    ? "default"
                                    : entry.mealType === "lunch"
                                      ? "secondary"
                                      : entry.mealType === "dinner"
                                        ? "outline"
                                        : entry.mealType === "snack"
                                          ? "destructive"
                                          : "default"
                                }
                                className="text-xs py-1 px-2"
                              >
                                {entry.foodItems.length} item{entry.foodItems.length !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.createdAt || "").toLocaleDateString()}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => entry._id && handleDeleteNutritionEntry(entry._id)}
                          className="h-8 w-8 p-0 shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground font-medium">Calories</p>
                          <p className="text-sm font-bold">{entry.totalCalories || 0}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground font-medium">Protein</p>
                          <p className="text-sm font-bold">
                            {entry.foodItems.reduce((sum, item) => sum + (item.protein || 0), 0)}g
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground font-medium">Carbs</p>
                          <p className="text-sm font-bold">
                            {entry.foodItems.reduce((sum, item) => sum + (item.carbs || 0), 0)}g
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground font-medium">Fat</p>
                          <p className="text-sm font-bold">
                            {entry.foodItems.reduce((sum, item) => sum + (item.fat || 0), 0)}g
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Food Items</h4>
                        <div className="space-y-2">
                          {entry.foodItems.slice(0, 4).map((food, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded"
                            >
                              <span className="font-medium truncate flex-1 mr-2">{food.name}</span>
                              <span className="text-muted-foreground text-xs shrink-0">{food.calories || 0} cal</span>
                            </div>
                          ))}
                          {entry.foodItems.length > 4 && (
                            <div className="text-center text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                              +{entry.foodItems.length - 4} more items
                            </div>
                          )}
                        </div>
                      </div>

                      {entry.notes && (
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm text-muted-foreground">{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NutritionTracker
