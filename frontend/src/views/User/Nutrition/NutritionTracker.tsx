import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nutritionService, type NutritionEntry, type FoodItem } from '@/services/nutritionService';
import { useNotificationService } from '@/context/notification-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Save, ArrowLeft, Apple, Utensils } from 'lucide-react';
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

const NutritionTracker: React.FC = () => {
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useNotificationService();
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for creating/editing nutrition entries
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other'>('breakfast');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([{ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: 'serving' }]);
  const [notes, setNotes] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load nutrition entries on component mount
  useEffect(() => {
    fetchNutritionEntries();
  }, []);
  
  const fetchNutritionEntries = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getAllNutritionEntries();
      setNutritionEntries(data);
    } catch (err) {
      showError('Failed to fetch nutrition entries. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: 'serving' }]);
    // Clear food items errors when adding a new item
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.foodItems;
      return newErrors;
    });
  };
  
  const handleRemoveFoodItem = (index: number) => {
    if (foodItems.length <= 1) {
      setErrors(prev => ({ ...prev, foodItems: 'At least one food item is required' }));
      return;
    }
    const newFoodItems = [...foodItems];
    newFoodItems.splice(index, 1);
    setFoodItems(newFoodItems);
    // Clear food items errors when removing an item
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.foodItems;
      return newErrors;
    });
  };
  
  const handleFoodItemChange = (index: number, field: keyof FoodItem, value: string | number) => {
    const newFoodItems = [...foodItems];
    newFoodItems[index] = { ...newFoodItems[index], [field]: value };
    setFoodItems(newFoodItems);
    // Clear food items errors when changing an item
    if (errors.foodItems) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.foodItems;
        return newErrors;
      });
    }
  };
  
  const calculateTotalCalories = () => {
    return foodItems.reduce((total, item) => total + (item.calories || 0), 0);
  };
  
  const calculateTotalProtein = () => {
    return foodItems.reduce((total, item) => total + (item.protein || 0), 0);
  };
  
  const calculateTotalCarbs = () => {
    return foodItems.reduce((total, item) => total + (item.carbs || 0), 0);
  };
  
  const calculateTotalFat = () => {
    return foodItems.reduce((total, item) => total + (item.fat || 0), 0);
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (foodItems.some(item => !item.name.trim())) {
      newErrors.foodItems = 'Please enter a name for each food item.';
    }
    
    if (foodItems.some(item => item.calories !== undefined && item.calories < 0)) {
      newErrors.foodItems = 'Calories must be zero or a positive number.';
    }
    
    if (foodItems.some(item => item.protein !== undefined && item.protein < 0)) {
      newErrors.foodItems = 'Protein must be zero or a positive number.';
    }
    
    if (foodItems.some(item => item.carbs !== undefined && item.carbs < 0)) {
      newErrors.foodItems = 'Carbs must be zero or a positive number.';
    }
    
    if (foodItems.some(item => item.fat !== undefined && item.fat < 0)) {
      newErrors.foodItems = 'Fat must be zero or a positive number.';
    }
    
    if (foodItems.some(item => item.quantity !== undefined && item.quantity <= 0)) {
      newErrors.foodItems = 'Quantity must be greater than zero.';
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
      const nutritionData = {
        mealType,
        foodItems,
        totalCalories: calculateTotalCalories(),
        notes
      };
      
      await nutritionService.createNutritionEntry(nutritionData);
      
      // Reset form
      setMealType('breakfast');
      setFoodItems([{ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: 'serving' }]);
      setNotes('');
      setErrors({});
      
      // Refresh nutrition entries list
      fetchNutritionEntries();
      showSuccess('Meal logged successfully! Keep up the good work.');
    } catch (err) {
      showError('Oops! Failed to log your meal. Please check your connection and try again.');
      console.error(err);
    }
  };
  
  const handleDeleteNutritionEntry = async (id: string) => {
    try {
      await nutritionService.deleteNutritionEntry(id);
      fetchNutritionEntries();
      showSuccess('Meal entry removed successfully.');
    } catch (err) {
      showError('Failed to delete meal entry. Please try again.');
      console.error(err);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading your nutrition entries...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Nutrition Tracker</h1>
            <p className="text-sm text-muted-foreground">Log and monitor your daily food intake</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nutrition Form */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Log Meal
            </CardTitle>
            <CardDescription>Record your food intake and nutritional data</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mealType">Meal Type</Label>
                <Select 
                  value={mealType} 
                  onValueChange={(value: any) => {
                    setMealType(value);
                  }}
                >
                  <SelectTrigger className="h-9">
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
                <Label>Food Items *</Label>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-8 px-2 text-xs">Food</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-16">Cal</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-14">Pro</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-14">Carb</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-12">Fat</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-16">Qty</TableHead>
                        <TableHead className="h-8 px-2 text-xs w-8"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {foodItems.map((foodItem, index) => (
                        <TableRow key={index} className="h-10">
                          <TableCell className="p-2">
                            <Input
                              placeholder="Food"
                              value={foodItem.name}
                              onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.calories || ''}
                              onChange={(e) => handleFoodItemChange(index, 'calories', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.protein || ''}
                              onChange={(e) => handleFoodItemChange(index, 'protein', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.carbs || ''}
                              onChange={(e) => handleFoodItemChange(index, 'carbs', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="0"
                              min="0"
                              value={foodItem.fat || ''}
                              onChange={(e) => handleFoodItemChange(index, 'fat', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              placeholder="1"
                              min="0.1"
                              step="0.1"
                              value={foodItem.quantity || ''}
                              onChange={(e) => handleFoodItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveFoodItem(index)}
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
                <Button type="button" variant="outline" onClick={handleAddFoodItem} className="h-8 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add Food
                </Button>
                {errors.foodItems && (
                  <Alert variant="destructive" className="py-1 px-2">
                    <AlertDescription className="text-xs">{errors.foodItems}</AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-3 bg-secondary/50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="font-bold text-base">{calculateTotalCalories()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="font-bold text-base">{calculateTotalProtein()}g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="font-bold text-base">{calculateTotalCarbs()}g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="font-bold text-base">{calculateTotalFat()}g</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Meal notes..."
                  className="h-20 resize-none text-sm"
                />
              </div>
              
              <Button type="submit" className="w-full h-9">
                <Save className="h-4 w-4 mr-2" /> Log Meal
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Nutrition Entries List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Recent Meals</CardTitle>
            <CardDescription>Your nutrition history</CardDescription>
          </CardHeader>
          <CardContent>
            {nutritionEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Apple className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No meals logged yet</h3>
                <p className="text-muted-foreground text-sm">Start by recording your first meal</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nutritionEntries.map((entry) => (
                  <div key={entry._id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base capitalize">{entry.mealType}</h3>
                        <Badge 
                          variant={entry.mealType === 'breakfast' ? 'default' : 
                                 entry.mealType === 'lunch' ? 'secondary' : 
                                 entry.mealType === 'dinner' ? 'outline' : 
                                 entry.mealType === 'snack' ? 'destructive' : 'default'} 
                          className="text-xs py-0.5 px-1.5"
                        >
                          {entry.foodItems.length} item{entry.foodItems.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => entry._id && handleDeleteNutritionEntry(entry._id)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="bg-muted/50 rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">Calories</p>
                        <p className="font-bold text-sm">{entry.totalCalories || 0}</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">Protein</p>
                        <p className="font-bold text-sm">
                          {entry.foodItems.reduce((sum, item) => sum + (item.protein || 0), 0)}g
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">Carbs</p>
                        <p className="font-bold text-sm">
                          {entry.foodItems.reduce((sum, item) => sum + (item.carbs || 0), 0)}g
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">Fat</p>
                        <p className="font-bold text-sm">
                          {entry.foodItems.reduce((sum, item) => sum + (item.fat || 0), 0)}g
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="space-y-2">
                      {entry.foodItems.slice(0, 3).map((food, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="font-medium truncate max-w-[120px]">{food.name}</span>
                          <span className="text-muted-foreground">{food.calories || 0} cal</span>
                        </div>
                      ))}
                      {entry.foodItems.length > 3 && (
                        <div className="text-center text-xs text-muted-foreground">
                          +{entry.foodItems.length - 3} more items
                        </div>
                      )}
                    </div>
                    
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{entry.notes}</p>
                    )}
                    
                    <div className="mt-3 text-xs text-muted-foreground flex justify-between items-center">
                      <span>{new Date(entry.createdAt || '').toLocaleDateString()}</span>
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

export default NutritionTracker;