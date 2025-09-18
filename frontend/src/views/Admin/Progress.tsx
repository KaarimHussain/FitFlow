import { useEffect, useState } from 'react'
import { adminService } from '@/services/adminService'
import type { ProgressEntry } from '@/services/progressService'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useNotification } from '@/context/notification-context'
import { Eye, Weight, Ruler, Trophy } from 'lucide-react'

export default function AdminProgress() {
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<ProgressEntry | null>(null)
  const { showNotification } = useNotification()

  useEffect(() => {
    const fetchProgressEntries = async () => {
      try {
        const data = await adminService.getAllProgressEntries()
        setProgressEntries(data)
      } catch (error) {
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load progress entries',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProgressEntries()
  }, [showNotification])

  // Helper function to format dates without external dependency
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateLong = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const columns = [
    {
      key: 'weight',
      header: 'Weight',
      sortable: true,
      render: (entry: ProgressEntry) => {
        return entry.weight ? `${entry.weight} kg` : 'N/A'
      },
    },
    {
      key: 'measurements',
      header: 'Measurements',
      render: (entry: ProgressEntry) => {
        if (!entry.measurements) return 'N/A'

        const count = Object.keys(entry.measurements).filter(key =>
          entry.measurements![key as keyof typeof entry.measurements]
        ).length
        return count > 0 ? `${count} recorded` : 'N/A'
      },
    },
    {
      key: 'performance',
      header: 'Performance',
      render: (entry: ProgressEntry) => {
        if (!entry.performance) return 'N/A'

        const count = Object.keys(entry.performance).filter(key =>
          entry.performance![key as keyof typeof entry.performance]
        ).length
        return count > 0 ? `${count} recorded` : 'N/A'
      },
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (entry: ProgressEntry) => {
        return entry.date ? formatDate(entry.date) : 'N/A'
      },
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (entry: ProgressEntry) => {
        return entry.createdAt ? formatDate(entry.createdAt) : 'N/A'
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (entry: ProgressEntry) => (
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
                <Trophy className="h-5 w-5" />
                Progress Entry
              </DialogTitle>
              <DialogDescription>
                Detailed progress measurements and performance data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {entry.date && (
                  <div>
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{formatDateLong(entry.date)}</span>
                  </div>
                )}

                {entry.weight && (
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    <span className="font-medium">Weight:</span>
                    <span>{entry.weight} kg</span>
                  </div>
                )}
              </div>

              {entry.measurements && Object.keys(entry.measurements).some(key => entry.measurements![key as keyof typeof entry.measurements]) && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Body Measurements
                  </h4>
                  <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg">
                    {entry.measurements.chest && (
                      <div>
                        <span className="text-sm font-medium">Chest:</span>
                        <span className="ml-2">{entry.measurements.chest} cm</span>
                      </div>
                    )}
                    {entry.measurements.waist && (
                      <div>
                        <span className="text-sm font-medium">Waist:</span>
                        <span className="ml-2">{entry.measurements.waist} cm</span>
                      </div>
                    )}
                    {entry.measurements.hips && (
                      <div>
                        <span className="text-sm font-medium">Hips:</span>
                        <span className="ml-2">{entry.measurements.hips} cm</span>
                      </div>
                    )}
                    {entry.measurements.arms && (
                      <div>
                        <span className="text-sm font-medium">Arms:</span>
                        <span className="ml-2">{entry.measurements.arms} cm</span>
                      </div>
                    )}
                    {entry.measurements.thighs && (
                      <div>
                        <span className="text-sm font-medium">Thighs:</span>
                        <span className="ml-2">{entry.measurements.thighs} cm</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {entry.performance && Object.keys(entry.performance).some(key => entry.performance![key as keyof typeof entry.performance]) && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg">
                    {entry.performance.benchPress && (
                      <div>
                        <span className="text-sm font-medium">Bench Press:</span>
                        <span className="ml-2">{entry.performance.benchPress} kg</span>
                      </div>
                    )}
                    {entry.performance.squat && (
                      <div>
                        <span className="text-sm font-medium">Squat:</span>
                        <span className="ml-2">{entry.performance.squat} kg</span>
                      </div>
                    )}
                    {entry.performance.deadlift && (
                      <div>
                        <span className="text-sm font-medium">Deadlift:</span>
                        <span className="ml-2">{entry.performance.deadlift} kg</span>
                      </div>
                    )}
                    {entry.performance.run5k && (
                      <div>
                        <span className="text-sm font-medium">5K Run:</span>
                        <span className="ml-2">{entry.performance.run5k} min</span>
                      </div>
                    )}
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
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Progress Management</h1>
          <p className="text-muted-foreground">
            View all user progress entries
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
        <h1 className="text-3xl font-bold">Progress Management</h1>
        <p className="text-muted-foreground">
          View all user progress entries ({progressEntries.length} total)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={progressEntries}
        searchKey="date"
        searchPlaceholder="Search by date..."
      />
    </div>
  )
}