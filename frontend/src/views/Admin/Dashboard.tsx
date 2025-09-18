import { useEffect, useState } from 'react'
import { adminService, type AdminStats } from '@/services/adminService'
import { StatsCard } from '@/components/ui/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotificationService } from '@/context/notification-context'
import {
  Users,
  Dumbbell,
  Apple,
  TrendingUp,
  UserCheck,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { error: showError } = useNotificationService()

  const fetchStats = async () => {
    try {
      console.log("Attempting to fetch admin stats...")
      const data = await adminService.getAdminStats()
      console.log("Admin stats received:", data)
      setStats(data)
    } catch (error) {
      console.error("Error fetching admin stats:", error)
      showError('Failed to load admin statistics')
      // Set some default stats so the page still renders
      setStats({
        totalUsers: 0,
        totalWorkouts: 0,
        totalNutritionEntries: 0,
        totalProgressEntries: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 py-25">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your fitness application
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your fitness application
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          description="Registered users"
          icon={Users}
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          description="Users active this month"
          icon={UserCheck}
        />
        <StatsCard
          title="New Users"
          value={stats.newUsersThisMonth}
          description="New registrations this month"
          icon={UserPlus}
        />
        <StatsCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          description="Workouts logged"
          icon={Dumbbell}
        />
        <StatsCard
          title="Nutrition Entries"
          value={stats.totalNutritionEntries}
          description="Meals tracked"
          icon={Apple}
        />
        <StatsCard
          title="Progress Entries"
          value={stats.totalProgressEntries}
          description="Progress records"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <Link to={"users"}>
                <Button variant={"secondary"}>
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </Button>
              </Link>
              <Link to={"workouts"}>
                <Button>
                  <Dumbbell className="h-4 w-4" />
                  <span>View All Workouts</span>
                </Button>
              </Link>
              <Link to={"nutrition"}>
                <Button>
                  <Apple className="h-4 w-4" />
                  <span>Nutrition Overview</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Application status and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Status</span>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm text-green-600 font-medium">Fast</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Usage</span>
                <span className="text-sm text-yellow-600 font-medium">Moderate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}