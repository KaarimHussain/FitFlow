import { useEffect, useState, useCallback } from 'react'
import { adminService, type AdminUser } from '@/services/adminService'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useNotification } from '@/context/notification-context'
import { MoreHorizontal, Eye, Trash2, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { showNotification } = useNotification()
  const { user: currentUser } = useAuth()

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminService.getAllUsers()
      // Filter out the current admin user
      const filteredUsers = data.filter(user => user.role !== 'admin')
      setUsers(filteredUsers)
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load users',
      })
    } finally {
      setLoading(false)
    }
  }, [showNotification, currentUser?.id])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDeleteUser = async (user: AdminUser) => {
    try {
      await adminService.deleteUser(user.id)
      setUsers(users.filter(u => u.id !== user.id))
      showNotification({
        type: 'success',
        title: 'Success',
        message: `User ${user.username} has been deleted`,
      })
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete user',
      })
    }
    setDeleteUser(null)
  }

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">
            Manage all registered users
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
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">
          Manage all registered users ({users.length} total)
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by username, email, or role..."
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
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Workouts</TableHead>
              <TableHead>Nutrition</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.username}
                  </TableCell>
                  <TableCell>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isVerified ? 'default' : 'destructive'}>
                      {user.isVerified ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.workoutCount || 0}
                  </TableCell>
                  <TableCell>
                    {user.nutritionCount || 0}
                  </TableCell>
                  <TableCell>
                    {user.progressCount || 0}
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteUser(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}

      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              "{deleteUser?.username}" and all their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser && handleDeleteUser(deleteUser)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}