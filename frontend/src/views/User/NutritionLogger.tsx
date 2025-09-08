import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Apple, Coffee, Utensils, Moon } from "lucide-react"
import { apiService } from "@/services/api.service"
import type { Nutrition } from "@/services/api.service"

export default function NutritionLogger() {
    /* ---------- state ---------- */
    const [nutrition, setNutrition] = useState<Nutrition | null>(null)
    const [search, setSearch] = useState("")
    const [recent, setRecent] = useState<{ food: string; calories: number }[]>([])

    /* ---------- helpers ---------- */
    const target = { cals: 2200, p: 110, c: 275, f: 73 }

    const todayStr = new Date().toISOString().slice(0, 10)

    /* ---------- load today ---------- */
    useEffect(() => {
        apiService.getNutrition(todayStr).then(n => setNutrition(n[0] ?? null))
    }, [])

    /* ---------- add food ---------- */
    const addFood = (meal: keyof Nutrition["meals"], food: string, calories: number) => {
        apiService.addFood({ meal, food, calories, date: todayStr }).then(res => {
            setNutrition(res.nutritionEntry)
        })
    }

    /* ---------- mock search ---------- */
    useEffect(() => {
        if (!search) return
        const t = setTimeout(() => {
            // fake search results
            setRecent([
                { food: "Chicken Breast", calories: 165 },
                { food: "Brown Rice", calories: 216 },
                { food: "Greek Yogurt", calories: 100 },
            ])
        }, 300)
        return () => clearTimeout(t)
    }, [search])

    const cals = nutrition?.totalCalories ?? 0
    const remaining = target.cals - cals

    return (
        <div className="max-w-6xl mx-auto py-25 px-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Nutrition Tracker</h1>
                    <p className="text-muted-foreground">Log your daily food intake and track macros</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-muted-foreground">Today</div>
                    <div className="text-2xl font-bold text-primary">{cals} / {target.cals} cal</div>
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
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Calories</Label>
                                <span className="text-sm font-medium">{cals} / {target.cals}</span>
                            </div>
                            <Progress value={(cals / target.cals) * 100} className="h-3" />
                            <div className="text-xs text-muted-foreground">{remaining} calories remaining</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Macro label="Protein" current={nutrition?.macros.protein ?? 0} target={target.p} />
                            <Macro label="Carbs" current={nutrition?.macros.carbs ?? 0} target={target.c} />
                            <Macro label="Fat" current={nutrition?.macros.fat ?? 0} target={target.f} />
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
                            <Input
                                placeholder="Search foods..."
                                className="pl-10"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Recent Foods</Label>
                            <div className="space-y-1">
                                {recent.map((r, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                                        onClick={() => addFood("snacks", r.food, r.calories)}
                                    >
                                        <span className="text-sm">{r.food}</span>
                                        <Badge variant="outline" className="text-xs">{r.calories} cal</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Meal Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MealCard title="Breakfast" icon={<Coffee />} foods={nutrition?.meals.breakfast ?? []} onAdd={addFood} />
                <MealCard title="Lunch" icon={<Utensils />} foods={nutrition?.meals.lunch ?? []} onAdd={addFood} />
                <MealCard title="Snacks" icon={<Apple />} foods={nutrition?.meals.snacks ?? []} onAdd={addFood} />
                <MealCard title="Dinner" icon={<Moon />} foods={nutrition?.meals.dinner ?? []} onAdd={addFood} />
            </div>
        </div>
    )
}

/* ---------- mini components ---------- */
function Macro({ label, current, target }: { label: string; current: number; target: number }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label className="text-sm">{label}</Label>
                <span className="text-sm font-medium">{current}g / {target}g</span>
            </div>
            <Progress value={(current / target) * 100} className="h-2" />
        </div>
    )
}

function MealCard({ title, icon, foods, onAdd }: {
    title: string
    icon: React.ReactNode
    foods: { food: string; calories: number }[]
    onAdd: (m: any, f: string, c: number) => void
}) {
    const total = foods.reduce((s, x) => s + x.calories, 0)
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {icon}
                    {title}
                </CardTitle>
                <div className="text-sm text-muted-foreground">{total} calories</div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2">
                    {foods.map((f, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <span className="text-sm">{f.food}</span>
                            <span className="text-xs text-muted-foreground">{f.calories} cal</span>
                        </div>
                    ))}
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => onAdd(title.toLowerCase() as any, "New item", 100)}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Food
                </Button>
            </CardContent>
        </Card>
    )
}