// src/views/User/Progress/ProgressTracker.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressService, type ProgressEntry, type Measurements, type Performance } from '@/services/progressService';
import { useNotificationService } from '@/context/notification-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Save, ArrowLeft, TrendingUp, Ruler, Dumbbell, Scale, Trash2 } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"

// Enhanced Chart configurations with better color schemes
const weightChartConfig = {
  weight: {
    label: "Weight",
    color: "hsl(var(--chart-1))",
  },
  trend: {
    label: "Trend",
    color: "hsl(var(--chart-1))",
  },
}

const measurementsChartConfig = {
  chest: {
    label: "Chest",
    color: "#e63946", // Red
  },
  waist: {
    label: "Waist",
    color: "#457b9d", // Blue
  },
  hips: {
    label: "Hips",
    color: "#2a9d8f", // Teal
  },
  arms: {
    label: "Arms",
    color: "#f4a261", // Orange
  },
  thighs: {
    label: "Thighs",
    color: "#a8dadc", // Light Blue
  },
}

const performanceChartConfig = {
  benchPress: {
    label: "Bench Press",
    color: "#0074D9", // Vivid blue
  },
  squat: {
    label: "Squat",
    color: "#2ECC40", // Bright green
  },
  deadlift: {
    label: "Deadlift",
    color: "#FF4136", // Vivid red
  },
  run5k: {
    label: "5K Time",
    color: "#FFDC00", // Bright yellow
  },
}

const ProgressTracker: React.FC = () => {
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useNotificationService();
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for creating/editing progress entries
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [measurements, setMeasurements] = useState<Measurements>({});
  const [performance, setPerformance] = useState<Performance>({});
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load progress entries on component mount
  useEffect(() => {
    fetchProgressEntries();
  }, []);

  const fetchProgressEntries = async () => {
    try {
      setLoading(true);
      const data = await progressService.getAllProgressEntries();
      setProgressEntries(data);
    } catch (err) {
      showError('Failed to fetch progress entries. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // At least one field must be filled
    if (
      !weight &&
      !measurements.chest &&
      !measurements.waist &&
      !measurements.hips &&
      !measurements.arms &&
      !measurements.thighs &&
      !performance.benchPress &&
      !performance.squat &&
      !performance.deadlift &&
      !performance.run5k
    ) {
      newErrors.general = 'Please enter at least one measurement or performance metric.';
    }

    // Validate weight if provided
    if (weight !== undefined && weight <= 0) {
      newErrors.weight = 'Weight must be greater than zero.';
    }

    // Validate measurements if provided
    if (measurements.chest !== undefined && measurements.chest < 0) {
      newErrors.chest = 'Chest measurement must be zero or a positive number.';
    }
    if (measurements.waist !== undefined && measurements.waist < 0) {
      newErrors.waist = 'Waist measurement must be zero or a positive number.';
    }
    if (measurements.hips !== undefined && measurements.hips < 0) {
      newErrors.hips = 'Hips measurement must be zero or a positive number.';
    }
    if (measurements.arms !== undefined && measurements.arms < 0) {
      newErrors.arms = 'Arms measurement must be zero or a positive number.';
    }
    if (measurements.thighs !== undefined && measurements.thighs < 0) {
      newErrors.thighs = 'Thighs measurement must be zero or a positive number.';
    }

    // Validate performance metrics if provided
    if (performance.benchPress !== undefined && performance.benchPress < 0) {
      newErrors.benchPress = 'Bench press must be zero or a positive number.';
    }
    if (performance.squat !== undefined && performance.squat < 0) {
      newErrors.squat = 'Squat must be zero or a positive number.';
    }
    if (performance.deadlift !== undefined && performance.deadlift < 0) {
      newErrors.deadlift = 'Deadlift must be zero or a positive number.';
    }
    if (performance.run5k !== undefined && performance.run5k < 0) {
      newErrors.run5k = '5K time must be zero or a positive number.';
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
      const progressData = {
        weight,
        measurements,
        performance,
        notes
      };

      await progressService.createProgressEntry(progressData);

      // Reset form
      setWeight(undefined);
      setMeasurements({});
      setPerformance({});
      setNotes('');
      setErrors({});

      // Refresh progress entries list
      fetchProgressEntries();
      showSuccess('Progress entry saved successfully! Great work tracking your journey.');
    } catch (err) {
      showError('Oops! Failed to save your progress entry. Please check your connection and try again.');
      console.error(err);
    }
  };

  const handleDeleteProgressEntry = async (id: string) => {
    try {
      await progressService.deleteProgressEntry(id);
      fetchProgressEntries();
      showSuccess('Progress entry removed successfully.');
    } catch (err) {
      showError('Failed to delete progress entry. Please try again.');
      console.error(err);
    }
  };

  // Enhanced data preparation for charts with better sorting and formatting
  const weightData = progressEntries
    .filter(entry => entry.weight)
    .map(entry => ({
      date: new Date(entry.date || entry.createdAt || '').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      fullDate: new Date(entry.date || entry.createdAt || ''),
      weight: entry.weight
    }))
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())
    .map(({ fullDate, ...rest }) => rest);

  const performanceData = progressEntries
    .filter(entry => entry.performance && (
      entry.performance.benchPress ||
      entry.performance.squat ||
      entry.performance.deadlift ||
      entry.performance.run5k
    ))
    .map(entry => ({
      date: new Date(entry.date || entry.createdAt || '').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      fullDate: new Date(entry.date || entry.createdAt || ''),
      benchPress: entry.performance?.benchPress,
      squat: entry.performance?.squat,
      deadlift: entry.performance?.deadlift,
      run5k: entry.performance?.run5k
    }))
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())
    .map(({ fullDate, ...rest }) => rest);

  const measurementsData = progressEntries
    .filter(entry => entry.measurements && (
      entry.measurements.chest ||
      entry.measurements.waist ||
      entry.measurements.hips ||
      entry.measurements.arms ||
      entry.measurements.thighs
    ))
    .map(entry => ({
      date: new Date(entry.date || entry.createdAt || '').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      fullDate: new Date(entry.date || entry.createdAt || ''),
      chest: entry.measurements?.chest,
      waist: entry.measurements?.waist,
      hips: entry.measurements?.hips,
      arms: entry.measurements?.arms,
      thighs: entry.measurements?.thighs
    }))
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())
    .map(({ fullDate, ...rest }) => rest);

  if (loading) {
    return (
      <div className="container mx-auto py-25">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading your progress entries...</span>
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
            <h1 className="text-2xl font-bold">Progress Tracker</h1>
            <p className="text-sm text-muted-foreground">Track your fitness journey and achievements</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="record" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-10">
          <TabsTrigger value="record" className="flex items-center gap-2 text-sm">
            <Save className="h-4 w-4" />
            Record
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="h-5 w-5" />
                  New Entry
                </CardTitle>
                <CardDescription>Record your latest progress metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.general && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.general}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-1.5">
                      <Scale className="h-4 w-4" />
                      Weight (kg/lbs)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={weight || ''}
                      onChange={(e) => {
                        setWeight(parseFloat(e.target.value) || undefined);
                        if (errors.weight) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.weight;
                            return newErrors;
                          });
                        }
                      }}
                      placeholder="Current weight"
                      className={`h-9 ${errors.weight ? 'border-red-500' : ''}`}
                    />
                    {errors.weight && (
                      <Alert variant="destructive" className="py-1 px-2">
                        <AlertDescription className="text-xs">{errors.weight}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      <h3 className="font-medium text-sm">Body Measurements</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="chest" className="text-xs">Chest</Label>
                        <Input
                          id="chest"
                          type="number"
                          min="0"
                          step="0.1"
                          value={measurements.chest || ''}
                          onChange={(e) => {
                            setMeasurements({ ...measurements, chest: parseFloat(e.target.value) || undefined });
                            if (errors.chest) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.chest;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="cm/in"
                          className={`h-8 text-sm ${errors.chest ? 'border-red-500' : ''}`}
                        />
                        {errors.chest && (
                          <Alert variant="destructive" className="py-1 px-2 mt-1">
                            <AlertDescription className="text-xs">{errors.chest}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="waist" className="text-xs">Waist</Label>
                        <Input
                          id="waist"
                          type="number"
                          min="0"
                          step="0.1"
                          value={measurements.waist || ''}
                          onChange={(e) => {
                            setMeasurements({ ...measurements, waist: parseFloat(e.target.value) || undefined });
                            if (errors.waist) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.waist;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="cm/in"
                          className={`h-8 text-sm ${errors.waist ? 'border-red-500' : ''}`}
                        />
                        {errors.waist && (
                          <Alert variant="destructive" className="py-1 px-2 mt-1">
                            <AlertDescription className="text-xs">{errors.waist}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="hips" className="text-xs">Hips</Label>
                        <Input
                          id="hips"
                          type="number"
                          min="0"
                          step="0.1"
                          value={measurements.hips || ''}
                          onChange={(e) => {
                            setMeasurements({ ...measurements, hips: parseFloat(e.target.value) || undefined });
                            if (errors.hips) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.hips;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="cm/in"
                          className={`h-8 text-sm ${errors.hips ? 'border-red-500' : ''}`}
                        />
                        {errors.hips && (
                          <Alert variant="destructive" className="py-1 px-2 mt-1">
                            <AlertDescription className="text-xs">{errors.hips}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="arms" className="text-xs">Arms</Label>
                        <Input
                          id="arms"
                          type="number"
                          min="0"
                          step="0.1"
                          value={measurements.arms || ''}
                          onChange={(e) => {
                            setMeasurements({ ...measurements, arms: parseFloat(e.target.value) || undefined });
                            if (errors.arms) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.arms;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="cm/in"
                          className={`h-8 text-sm ${errors.arms ? 'border-red-500' : ''}`}
                        />
                        {errors.arms && (
                          <Alert variant="destructive" className="py-1 px-2 mt-1">
                            <AlertDescription className="text-xs">{errors.arms}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="thighs" className="text-xs">Thighs</Label>
                        <Input
                          id="thighs"
                          type="number"
                          min="0"
                          step="0.1"
                          value={measurements.thighs || ''}
                          onChange={(e) => {
                            setMeasurements({ ...measurements, thighs: parseFloat(e.target.value) || undefined });
                            if (errors.thighs) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.thighs;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="cm/in"
                          className={`h-8 text-sm ${errors.thighs ? 'border-red-500' : ''}`}
                        />
                        {errors.thighs && (
                          <Alert variant="destructive" className="py-1 px-2 mt-1">
                            <AlertDescription className="text-xs">{errors.thighs}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-4 w-4" />
                      <h3 className="font-medium text-sm">Performance</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="benchPress" className="text-xs">Bench Press</Label>
                        <Input
                          id="benchPress"
                          type="number"
                          min="0"
                          step="0.5"
                          value={performance.benchPress || ''}
                          onChange={(e) => {
                            setPerformance({ ...performance, benchPress: parseFloat(e.target.value) || undefined });
                            if (errors.benchPress) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.benchPress;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="kg/lbs"
                          className={`h-8 text-sm ${errors.benchPress ? 'border-red-500' : ''}`}
                        />
                        {errors.benchPress && (
                          <Alert variant="destructive" className="py-1 px-2 mt-1">
                            <AlertDescription className="text-xs">{errors.benchPress}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="squat" className="text-xs">Squat</Label>
                        <Input
                          id="squat"
                          type="number"
                          min="0"
                          step="0.5"
                          value={performance.squat || ''}
                          onChange={(e) => {
                            setPerformance({ ...performance, squat: parseFloat(e.target.value) || undefined });
                            if (errors.squat) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.squat;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="kg/lbs"
                          className={`h-8 text-sm ${errors.squat ? 'border-red-500' : ''}`}
                        />
                        {errors.squat && (
                          <Alert variant="destructive" className="py-1 px-2 mt-1">
                            <AlertDescription className="text-xs">{errors.squat}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="deadlift" className="text-xs">Deadlift</Label>
                        <Input
                          id="deadlift"
                          type="number"
                          min="0"
                          step="0.5"
                          value={performance.deadlift || ''}
                          onChange={(e) => {
                            setPerformance({ ...performance, deadlift: parseFloat(e.target.value) || undefined });
                            if (errors.deadlift) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.deadlift;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="kg/lbs"
                          className={`h-8 text-sm ${errors.deadlift ? 'border-red-500' : ''}`}
                        />
                        {errors.deadlift && (
                          <Alert variant="destructive" className="py-1 px-2 mt-1">
                            <AlertDescription className="text-xs">{errors.deadlift}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="run5k" className="text-xs">5K Time</Label>
                        <Input
                          id="run5k"
                          type="number"
                          min="0"
                          step="0.1"
                          value={performance.run5k || ''}
                          onChange={(e) => {
                            setPerformance({ ...performance, run5k: parseFloat(e.target.value) || undefined });
                            if (errors.run5k) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.run5k;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="minutes"
                          className={`h-8 text-sm ${errors.run5k ? 'border-red-500' : ''}`}
                        />
                        {errors.run5k && (
                          <Alert variant="destructive" className="py-1 px-2 mt-1">
                            <AlertDescription className="text-xs">{errors.run5k}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Progress notes..."
                      className="h-20 resize-none text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full h-9">
                    <Save className="h-4 w-4 mr-2" /> Save Entry
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>Your progress history</CardDescription>
              </CardHeader>
              <CardContent>
                {progressEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-1">No entries yet</h3>
                    <p className="text-muted-foreground text-sm">Start by recording your first progress entry</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {progressEntries.map((entry) => (
                      <div key={entry._id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base">
                              {new Date(entry.date || entry.createdAt || '').toLocaleDateString()}
                            </h3>
                            <Badge variant="secondary" className="text-xs py-0.5 px-1.5">
                              {Object.keys(entry).filter(key =>
                                entry[key as keyof ProgressEntry] !== undefined &&
                                entry[key as keyof ProgressEntry] !== null &&
                                key !== '_id' &&
                                key !== 'date' &&
                                key !== 'createdAt' &&
                                key !== 'updatedAt' &&
                                key !== 'notes'
                              ).length} metrics
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => entry._id && handleDeleteProgressEntry(entry._id)}
                            className="h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                          {entry.weight && (
                            <div className="bg-muted/50 rounded p-2 text-center">
                              <p className="text-xs text-muted-foreground">Weight</p>
                              <p className="font-bold text-sm">{entry.weight}</p>
                            </div>
                          )}
                          {entry.measurements?.chest && (
                            <div className="bg-muted/50 rounded p-2 text-center">
                              <p className="text-xs text-muted-foreground">Chest</p>
                              <p className="font-bold text-sm">{entry.measurements.chest}</p>
                            </div>
                          )}
                          {entry.measurements?.waist && (
                            <div className="bg-muted/50 rounded p-2 text-center">
                              <p className="text-xs text-muted-foreground">Waist</p>
                              <p className="font-bold text-sm">{entry.measurements.waist}</p>
                            </div>
                          )}
                          {entry.performance?.benchPress && (
                            <div className="bg-muted/50 rounded p-2 text-center">
                              <p className="text-xs text-muted-foreground">Bench</p>
                              <p className="font-bold text-sm">{entry.performance.benchPress}</p>
                            </div>
                          )}
                          {entry.performance?.squat && (
                            <div className="bg-muted/50 rounded p-2 text-center">
                              <p className="text-xs text-muted-foreground">Squat</p>
                              <p className="font-bold text-sm">{entry.performance.squat}</p>
                            </div>
                          )}
                        </div>

                        {entry.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{entry.notes}</p>
                        )}

                        <div className="mt-3 text-xs text-muted-foreground">
                          {new Date(entry.createdAt || '').toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="view" className="space-y-6">
          {/* Enhanced responsive chart grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Weight Progress - Using Area Chart */}
            <Card className="xl:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="h-5 w-5" />
                  Weight Progress
                </CardTitle>
                <CardDescription>Track your weight changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                {weightData.length > 0 ? (
                  <ChartContainer config={weightChartConfig} className="h-[300px] w-full">
                    <AreaChart
                      data={weightData}
                      margin={{
                        top: 10,
                        left: 12,
                        right: 12,
                        bottom: 10,
                      }}
                    >
                      <defs>
                        <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-primary)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-primary)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={12}
                      />
                      <YAxis
                        domain={['dataMin - 2', 'dataMax + 2']}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={12}
                      />
                      <ChartTooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Area
                        dataKey="weight"
                        type="monotone"
                        fill="url(#fillWeight)"
                        fillOpacity={0.4}
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                    No weight data recorded yet.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Body Measurements - Using Multi-line Chart */}
            <Card className="xl:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Ruler className="h-5 w-5" />
                  Body Measurements
                </CardTitle>
                <CardDescription>Track your body measurements over time</CardDescription>
              </CardHeader>
              <CardContent>
                {measurementsData.length > 0 ? (
                  <ChartContainer config={measurementsChartConfig} className="h-[300px] w-full">
                    <LineChart
                      data={measurementsData}
                      margin={{
                        top: 10,
                        left: 12,
                        right: 12,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={12}
                      />
                      <YAxis
                        domain={['dataMin - 2', 'dataMax + 2']}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={12}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      {Object.entries(measurementsChartConfig).map(([key, config]) => (
                        <Line
                          key={key}
                          dataKey={key}
                          type="monotone"
                          stroke={config.color}
                          strokeWidth={2}
                          dot={{
                            fill: config.color,
                            strokeWidth: 2,
                            r: 3,
                          }}
                          activeDot={{
                            r: 5,
                            stroke: config.color,
                            strokeWidth: 2,
                          }}
                        />
                      ))}
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                    No measurements data recorded yet.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Metrics - Using Bar Chart */}
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Dumbbell className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Track your strength and cardio performance</CardDescription>
              </CardHeader>
              <CardContent>
                {performanceData.length > 0 ? (
                  <ChartContainer config={performanceChartConfig} className="h-[350px] w-full">
                    <BarChart
                      data={performanceData}
                      margin={{
                        top: 10,
                        left: 12,
                        right: 12,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={12}
                      />
                      <YAxis
                        domain={['dataMin - 10', 'dataMax + 10']}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={12}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      {Object.entries(performanceChartConfig).map(([key, config]) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={config.color}
                          radius={[2, 2, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
                    No performance data recorded yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Entries */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                    <p className="text-2xl font-bold">{progressEntries.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Latest Weight */}
            {weightData.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Latest Weight</p>
                      <p className="text-2xl font-bold">{weightData[weightData.length - 1]?.weight}</p>
                    </div>
                    <Scale className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weight Change */}
            {weightData.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Weight Change</p>
                      <p className="text-2xl font-bold">
                        {((weightData[weightData.length - 1]?.weight || 0) - (weightData[0]?.weight || 0)).toFixed(1)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Days Tracked */}
            {progressEntries.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Days Tracked</p>
                      <p className="text-2xl font-bold">
                        {Math.ceil(
                          (new Date(progressEntries[0]?.createdAt || '').getTime() -
                            new Date(progressEntries[progressEntries.length - 1]?.createdAt || '').getTime())
                          / (1000 * 60 * 60 * 24)
                        )}
                      </p>
                    </div>
                    <Save className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTracker;