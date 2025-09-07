import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Apple, Coffee, Utensils, Moon } from "lucide-react"

export default function NutritionLogger() {
    return (
        <div className="max-w-6xl mx-auto py-25 px-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Nutrition Tracker</h1>
                    <p className="text-muted-foreground">Log your daily food intake and track macros</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-muted-foreground">Today</div>
                    <div className="text-2xl font-bold text-primary">1,847 / 2,200 cal</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Overview */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Daily Overview</CardTitle>
                        <CardDescription>Track your calorie and macro intake</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Calorie Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Calories</Label>
                                <span className="text-sm font-medium">1,847 / 2,200</span>
                            </div>
                            <Progress value={84} className="h-3" />
                            <div className="text-xs text-muted-foreground">353 calories remaining</div>
                        </div>

                        {/* Macro Breakdown */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm">Protein</Label>
                                    <span className="text-sm font-medium">89g / 110g</span>
                                </div>
                                <Progress value={81} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm">Carbs</Label>
                                    <span className="text-sm font-medium">201g / 275g</span>
                                </div>
                                <Progress value={73} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm">Fat</Label>
                                    <span className="text-sm font-medium">67g / 73g</span>
                                </div>
                                <Progress value={92} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Add */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Add</CardTitle>
                        <CardDescription>Search and log food items</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search foods..." className="pl-10" />
                        </div>
                        <Button className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Food
                        </Button>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Recent Foods</Label>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer">
                                    <span className="text-sm">Chicken Breast</span>
                                    <Badge variant="outline" className="text-xs">
                                        165 cal
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer">
                                    <span className="text-sm">Brown Rice</span>
                                    <Badge variant="outline" className="text-xs">
                                        216 cal
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer">
                                    <span className="text-sm">Greek Yogurt</span>
                                    <Badge variant="outline" className="text-xs">
                                        100 cal
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Meal Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Breakfast */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Coffee className="w-5 h-5 text-primary" />
                            Breakfast
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">487 calories</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Oatmeal with berries</span>
                                <span className="text-xs text-muted-foreground">320 cal</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Greek yogurt</span>
                                <span className="text-xs text-muted-foreground">100 cal</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Banana</span>
                                <span className="text-xs text-muted-foreground">67 cal</span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Food
                        </Button>
                    </CardContent>
                </Card>

                {/* Lunch */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Utensils className="w-5 h-5 text-primary" />
                            Lunch
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">623 calories</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Grilled chicken salad</span>
                                <span className="text-xs text-muted-foreground">425 cal</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Olive oil dressing</span>
                                <span className="text-xs text-muted-foreground">120 cal</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Whole grain roll</span>
                                <span className="text-xs text-muted-foreground">78 cal</span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Food
                        </Button>
                    </CardContent>
                </Card>

                {/* Snacks */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Apple className="w-5 h-5 text-primary" />
                            Snacks
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">234 calories</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Mixed nuts</span>
                                <span className="text-xs text-muted-foreground">167 cal</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Apple</span>
                                <span className="text-xs text-muted-foreground">67 cal</span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Food
                        </Button>
                    </CardContent>
                </Card>

                {/* Dinner */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Moon className="w-5 h-5 text-primary" />
                            Dinner
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">503 calories</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Salmon fillet</span>
                                <span className="text-xs text-muted-foreground">287 cal</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Brown rice</span>
                                <span className="text-xs text-muted-foreground">216 cal</span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Food
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
