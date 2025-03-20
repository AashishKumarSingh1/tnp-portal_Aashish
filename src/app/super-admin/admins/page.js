'use client'

import { useState, useEffect } from "react"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, Search, RefreshCw, Mail, Phone, Calendar, Building2, IdCard, Pencil, Trash2 } from "lucide-react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import CreateAdminDialog from "../components/CreateAdminDialog"
import EditAdminDialog from "../components/EditAdminDialog"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminManagement() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [selectedAdmins, setSelectedAdmins] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState(null)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/super-admin/admins')
      if (res.ok) {
        const data = await res.json()
        setAdmins(data)
      } else {
        throw new Error('Failed to fetch admins')
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error)
      toast.error('Failed to fetch admins')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAdmin = async (adminId) => {
    try {
      const res = await fetch(`/api/super-admin/admins?id=${adminId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete admin')
      }

      toast.success('Admin deleted successfully')
      fetchAdmins()
      setAdminToDelete(null)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedAdmins.map(adminId =>
          fetch(`/api/super-admin/admins?id=${adminId}`, {
            method: 'DELETE'
          })
        )
      )
      
      toast.success('Selected admins deleted successfully')
      setSelectedAdmins([])
      fetchAdmins()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error('Failed to delete some admins')
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAdmins(filteredAdmins.map(admin => admin.id))
    } else {
      setSelectedAdmins([])
    }
  }

  const handleSelectAdmin = (adminId, checked) => {
    if (checked) {
      setSelectedAdmins(prev => [...prev, adminId])
    } else {
      setSelectedAdmins(prev => prev.filter(id => id !== adminId))
    }
  }

  const filteredAdmins = admins.filter(admin => {
    // Only show admins with academic information (department or registration_number)
    const hasAcademicInfo = admin.department || admin.registration_number || admin.batch_year
    if (!hasAcademicInfo) return false

    // Then apply search filter
    const searchLower = searchTerm.toLowerCase()
    return (
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.name?.toLowerCase().includes(searchLower) ||
      admin.department?.toLowerCase().includes(searchLower) ||
      admin.registration_number?.toLowerCase().includes(searchLower) ||
      admin.batch_year?.toString().includes(searchLower)
    )
  })

  const getRoleName = (roleId) => {
    switch(parseInt(roleId)) {
      case 1: return 'Super Admin'
      case 2: return 'Admin'
      default: return 'Unknown'
    }
  }

  const breadcrumbItems = [
    { label: "Super Admin", href: "/super-admin/dashboard" },
    { label: "Admin Management", href: "/super-admin/admins" }
  ]

  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Admin Management</span>
          </h1>
          <div className="flex items-center gap-4">
            {selectedAdmins.length > 0 && (
              <Button 
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedAdmins.length})
              </Button>
            )}
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Admin
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border bg-card">
          <div className="p-6 border-b">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search admins by email, name, department, or registration number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={fetchAdmins}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedAdmins.length === filteredAdmins.length && filteredAdmins.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Basic Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No admins found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedAdmins.includes(admin.id)}
                          onCheckedChange={(checked) => handleSelectAdmin(admin.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={admin.profile_image} alt={admin.name} />
                          <AvatarFallback className="bg-gradient-to-br from-red-600 to-amber-600 text-white">
                            {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{admin.name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-4 h-4 mr-2 opacity-70" />
                            {admin.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center text-muted-foreground">
                            <Phone className="w-4 h-4 mr-2 opacity-70" />
                            {admin.phone || 'N/A'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center text-muted-foreground">
                            <Building2 className="w-4 h-4 mr-2 opacity-70" />
                            {admin.department ? (
                              <span className="text-foreground font-medium">{admin.department}</span>
                            ) : (
                              <span className="italic">No department</span>
                            )}
                          </p>
                          <p className="text-sm flex items-center text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2 opacity-70" />
                            Batch: {admin.batch_year ? (
                              <span className="text-foreground font-medium ml-1">{admin.batch_year}</span>
                            ) : (
                              <span className="italic">No batch year</span>
                            )}
                          </p>
                          <p className="text-sm flex items-center text-muted-foreground">
                            <IdCard className="w-4 h-4 mr-2 opacity-70" />
                            {admin.registration_number ? (
                              <span className="text-foreground font-medium">{admin.registration_number}</span>
                            ) : (
                              <span className="italic">No registration number</span>
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          admin.is_active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          parseInt(admin.role_id) === 1
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {getRoleName(admin.role_id)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAdmin(admin)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setAdminToDelete(admin)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <CreateAdminDialog 
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={fetchAdmins}
        />

        <EditAdminDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedAdmin(null)
          }}
          onSuccess={fetchAdmins}
          admin={selectedAdmin}
        />

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedAdmins.length > 0 
                  ? `This will permanently delete ${selectedAdmins.length} selected admin(s).`
                  : `This will permanently delete ${adminToDelete?.name}'s account.`
                }
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setIsDeleteDialogOpen(false)
                setAdminToDelete(null)
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  if (selectedAdmins.length > 0) {
                    handleBulkDelete()
                  } else if (adminToDelete) {
                    handleDeleteAdmin(adminToDelete.id)
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
} 