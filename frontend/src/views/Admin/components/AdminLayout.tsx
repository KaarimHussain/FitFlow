import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto  py-25">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}