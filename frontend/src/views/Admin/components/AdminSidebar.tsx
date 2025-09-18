import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Apple,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Workouts',
    href: '/admin/workouts',
    icon: Dumbbell,
  },
  {
    title: 'Nutrition',
    href: '/admin/nutrition',
    icon: Apple,
  },
  {
    title: 'Progress',
    href: '/admin/progress',
    icon: TrendingUp,
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div
      className={cn(
        'relative flex flex-col h-full bg-card border-r transition-all duration-300 py-25',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="text-3xl font-light flex items-center"><Logo /> ADMIN</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
                collapsed && 'justify-center'
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}