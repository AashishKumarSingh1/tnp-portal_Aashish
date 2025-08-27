'use client'

import { useState, useEffect } from "react"
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, RefreshCw, Eye, CheckCircle, X, Check, AlertCircle } from "lucide-react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { format } from 'date-fns'
import { branches } from '@/lib/data'
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function VerificationsPage() {
  const [activeTab, setActiveTab] = useState("students")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [pendingStudents, setPendingStudents] = useState([])
  const [pendingCompanies, setPendingCompanies] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmMode, setConfirmMode] = useState('single') // 'single' | 'bulk'
  const [confirmIds, setConfirmIds] = useState([])
  const [departmentFilter, setDepartmentFilter] = useState('')

  const fetchPendingVerifications = async () => {
    setLoading(true)
    try {
      if (activeTab === 'students') {
        const res = await fetch('/api/admin/verify-student')
        if (!res.ok) throw new Error('Failed to fetch pending students')
        const data = await res.json()
        setPendingStudents(data || [])
      } else {
        const res = await fetch('/api/admin/verify-company')
        if (!res.ok) throw new Error('Failed to fetch pending companies')
        const data = await res.json()
        setPendingCompanies(data.companies || [])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(`Failed to fetch pending ${activeTab}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingVerifications()
  }, [activeTab])

  const handleVerify = async (id, type, action) => {
    setVerifying(true)
    try {
      const endpoint = type === 'student' 
        ? `/api/admin/verify-student`
        : `/api/admin/verify-company`

      const body = type === 'student' 
        ? { studentId: id, action }
        : { companyId: id, action }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || `Failed to ${action} ${type}`)
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${action}ed successfully`)
      // Remove the item from local state so the row disappears instantly
      if (type === 'student') {
        setPendingStudents(prev => prev.filter(item => item.id !== id))
      } else {
        setPendingCompanies(prev => prev.filter(item => item.id !== id))
      }
      // Clear selection and close details modal if open
      setShowDetails(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message)
    } finally {
      setVerifying(false)
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    setSelectedItems(selectAll ? [] : filteredData.map(item => item.id))
  }

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
    setSelectAll(false)
  }

  const handleBulkVerify = async (action) => {
    if (!selectedItems.length) {
      toast.error('Please select items to verify')
      return
    }

    setVerifying(true)
    try {
      for (const id of selectedItems) {
        await handleVerify(id, activeTab === 'students' ? 'student' : 'company', action)
      }
      setSelectedItems([])
      setSelectAll(false)
      toast.success(`Successfully ${action}ed ${selectedItems.length} ${activeTab}`)
    } finally {
      setVerifying(false)
    }
  }

  const openRejectConfirmation = (ids, mode = 'single') => {
    setConfirmIds(Array.isArray(ids) ? ids : [ids])
    setConfirmMode(mode)
    setConfirmOpen(true)
  }

  const confirmReject = async () => {
    setConfirmOpen(false)
    if (!confirmIds.length) return
    if (confirmMode === 'bulk') {
      // Use existing bulk handler to ensure consistent behavior
      const previousSelected = [...selectedItems]
      setSelectedItems(confirmIds)
      await handleBulkVerify('reject')
      setSelectedItems(previousSelected.filter(() => false))
    } else {
      const id = confirmIds[0]
      await handleVerify(id, activeTab === 'students' ? 'student' : 'company', 'reject')
      setSelectedItems(prev => prev.filter(itemId => itemId !== id))
    }
  }

  const handleViewDetails = (item) => {
    setSelectedItem(item)
    setShowDetails(true)
  }

  const filteredData = activeTab === 'students' 
    ? (pendingStudents || [])
        .filter(student =>
          student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.branch?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(student => departmentFilter ? (student.branch || '').toLowerCase() === departmentFilter.toLowerCase() : true)
    : (pendingCompanies || []).filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy')
    } catch (error) {
      return 'Invalid date'
    }
  }

  const renderActionButtons = (item) => (
    <div className="space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewDetails(item)}
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
      <Button
        variant="success"
        size="sm"
        onClick={() => handleVerify(item.id, activeTab === 'students' ? 'student' : 'company', 'verify')}
        disabled={verifying}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        {verifying ? 'Processing...' : 'Verify'}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => openRejectConfirmation(item.id, 'single')}
        disabled={verifying}
      >
        <X className="h-4 w-4 mr-1" />
        {verifying ? 'Processing...' : 'Reject'}
      </Button>
    </div>
  )

  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <div className="p-6">
        <Breadcrumb
          items={[
            { label: 'Super Admin', href: '/super-admin/dashboard' },
            { label: 'Verifications', href: '/super-admin/verifications' },
          ]}
        />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Verifications</h1>
          <Button
            variant="outline"
            onClick={fetchPendingVerifications}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          <Tabs defaultValue="students" className="w-full" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
            </TabsList>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Input
                placeholder={`Search ${activeTab}...`}
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {activeTab === 'students' && (
                <div className="w-full md:w-64">
                  <Select
                    value={departmentFilter || undefined}
                    onValueChange={(value) => setDepartmentFilter(value === 'ALL' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Departments</SelectItem>
                      {branches.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <TabsContent value="students">
              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {selectedItems.length > 0 && (
                        <div className="p-4 border-b flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {selectedItems.length} selected
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleBulkVerify('verify')}
                              disabled={verifying}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {verifying ? 'Processing...' : 'Verify Selected'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openRejectConfirmation(selectedItems, 'bulk')}
                              disabled={verifying}
                            >
                              <X className="h-4 w-4 mr-1" />
                              {verifying ? 'Processing...' : 'Reject Selected'}
                            </Button>
                          </div>
                        </div>
                      )}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Roll Number</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(student.id)}
                                  onChange={() => handleSelectItem(student.id)}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </TableCell>
                              <TableCell className="font-medium">{student.full_name}</TableCell>
                              <TableCell>{student.roll_number}</TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.branch}</TableCell>
                              <TableCell>{formatDate(student.registration_date)}</TableCell>
                              <TableCell className="text-right">
                                {renderActionButtons(student)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="companies">
              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {selectedItems.length > 0 && (
                        <div className="p-4 border-b flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {selectedItems.length} selected
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleBulkVerify('verify')}
                              disabled={verifying}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {verifying ? 'Processing...' : 'Verify Selected'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openRejectConfirmation(selectedItems, 'bulk')}
                              disabled={verifying}
                            >
                              <X className="h-4 w-4 mr-1" />
                              {verifying ? 'Processing...' : 'Reject Selected'}
                            </Button>
                          </div>
                        </div>
                      )}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </TableHead>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Contact Person</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.map((company) => (
                            <TableRow key={company.id}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(company.id)}
                                  onChange={() => handleSelectItem(company.id)}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </TableCell>
                              <TableCell className="font-medium">{company.company_name}</TableCell>
                              <TableCell>
                                {company.contact_person_name}
                                <br />
                                <span className="text-sm text-muted-foreground">
                                  {company.contact_person_designation}
                                </span>
                              </TableCell>
                              <TableCell>{company.email}</TableCell>
                              <TableCell>{formatDate(company.created_at)}</TableCell>
                              <TableCell className="text-right">
                                {renderActionButtons(company)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {activeTab === 'students' ? 'Student' : 'Company'} Details
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-4 py-4">
                {activeTab === 'students' ? (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-medium">Name:</span>
                      <span className="col-span-3">{selectedItem.full_name}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-medium">Roll Number:</span>
                      <span className="col-span-3">{selectedItem.roll_number}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-medium">Email:</span>
                      <span className="col-span-3">{selectedItem.email}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-medium">Branch:</span>
                      <span className="col-span-3">{selectedItem.branch}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-medium">Current Year:</span>
                      <span className="col-span-3">{selectedItem.current_year}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-medium">CGPA:</span>
                      <span className="col-span-3">{selectedItem.cgpa}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-medium">Phone:</span>
                      <span className="col-span-3">{selectedItem.phone}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="font-medium">Registration Date:</span>
                      <span className="col-span-3">{formatDate(selectedItem.registration_date)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Company Name:</span>
                        <div className="text-muted-foreground break-words">{selectedItem.company_name}</div>
                      </div>
                      <div>
                        <span className="font-medium">Website:</span>
                        <div className="text-muted-foreground break-words">{selectedItem.website || '-'}</div>
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>
                        <div className="text-muted-foreground break-words">{selectedItem.phone || '-'}</div>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>
                        <div className="text-muted-foreground break-words">{selectedItem.email}</div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Contact Person:</span>
                        <div className="text-muted-foreground break-words">
                          {selectedItem.contact_person_name || '-'}
                          {selectedItem.contact_person_designation && (
                            <span className="block text-sm">{selectedItem.contact_person_designation}</span>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Description:</span>
                        <div className="text-muted-foreground whitespace-pre-wrap break-words max-h-60 overflow-y-auto pr-2">
                          {selectedItem.description || '-'}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Registration Date:</span>
                        <div className="text-muted-foreground">{formatDate(selectedItem.created_at)}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
                disabled={verifying}
              >
                Close
              </Button>
              <Button
                variant="success"
                onClick={() => handleVerify(selectedItem.id, 'student', 'verify')}
                disabled={verifying}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {verifying ? 'Processing...' : 'Verify'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => openRejectConfirmation(selectedItem.id, 'single')}
                disabled={verifying}
              >
                {verifying ? 'Processing...' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Confirmation dialog for reject actions */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm rejection</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmMode === 'bulk'
                  ? `Are you sure you want to reject ${confirmIds.length} selected ${activeTab}? This action cannot be undone.`
                  : `Are you sure you want to reject this ${activeTab === 'students' ? 'student' : 'company'}? This action cannot be undone.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={verifying}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmReject} disabled={verifying} className="bg-red-600 hover:bg-red-700 text-white">
                {verifying ? 'Processing...' : 'Reject'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
} 