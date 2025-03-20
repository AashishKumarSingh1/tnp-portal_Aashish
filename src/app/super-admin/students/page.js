'use client'

import { useState, useEffect } from "react"
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, RefreshCw, Pencil, Trash2, AlertCircle, Download } from "lucide-react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { branches, Year, PassingYear, DegreeTypes } from '@/lib/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchInput } from "@/components/ui/search-input"
import Link from 'next/link'
import { Checkbox } from "@/components/ui/checkbox"
import * as XLSX from 'xlsx'
import { ExportFieldsDialog } from '@/components/ExportFieldsDialog'

const studentSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  roll_number: z.string().min(2, "Roll number must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  branch: z.string().min(2, "Branch must be at least 2 characters"),
  current_year: z.coerce.number()
    .min(1, "Current year must be at least 1")
    .max(5, "Current year cannot exceed 5"),
  cgpa: z.coerce.number()
    .min(0, "CGPA must be at least 0")
    .max(10, "CGPA cannot exceed 10"),
  passing_year: z.coerce.number()
    .min(2020, "Invalid passing year")
    .max(2030, "Invalid passing year")
})

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [filters, setFilters] = useState({
    branch: 'all',
    year: 'all',
    passingYear: 'all',
    degreeType: 'all'
  })
  const [selectedFields, setSelectedFields] = useState([])
  const [showExportDialog, setShowExportDialog] = useState(false)

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      full_name: "",
      roll_number: "",
      email: "",
      phone: "",
      branch: "",
      current_year: "",
      cgpa: "",
      passing_year: "",
    },
  })

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/verified-students')
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      const data = await response.json()
      setStudents(data.students)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleEdit = (student) => {
    setSelectedStudent(student)
    form.reset({
      ...student,
      current_year: student.current_year?.toString(),
      cgpa: student.cgpa?.toString(),
      passing_year: student.passing_year?.toString()
    })
    setShowEditDialog(true)
  }

  const handleDelete = (student) => {
    setSelectedStudent(student)
    setShowDeleteDialog(true)
  }

  const onSubmit = async (data) => {
    try {
      setProcessing(true)
      const response = await fetch(`/api/admin/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          current_year: Number(data.current_year),
          cgpa: Number(data.cgpa),
          passing_year: Number(data.passing_year)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update student')
      }

      toast.success('Student updated successfully')
      setShowEditDialog(false)
      fetchStudents()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update student')
    } finally {
      setProcessing(false)
    }
  }

  const confirmDelete = async () => {
    try {
      setProcessing(true)
      const response = await fetch(`/api/admin/students/${selectedStudent.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete student')
      }

      toast.success('Student deleted successfully')
      setShowDeleteDialog(false)
      setStudents(students.filter(s => s.id !== selectedStudent.id))
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to delete student')
    } finally {
      setProcessing(false)
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.branch?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch = filters.branch === 'all' || student.branch === filters.branch
    const matchesYear = filters.year === 'all' || student.current_year === Year.indexOf(filters.year) + 1
    const matchesPassingYear = filters.passingYear === 'all' || student.passing_year.toString() === filters.passingYear
    const matchesDegreeType = filters.degreeType === 'all' || student.degree_type === filters.degreeType

    return matchesSearch && matchesBranch && matchesYear && matchesPassingYear && matchesDegreeType
  })

  const handleFilterChange = (value, filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      branch: 'all',
      year: 'all',
      passingYear: 'all',
      degreeType: 'all'
    })
  }

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    setSelectedStudents(checked ? filteredStudents.map(s => s.id) : [])
  }

  const handleSelectStudent = (checked, studentId) => {
    setSelectedStudents(prev => 
      checked 
        ? [...prev, studentId]
        : prev.filter(id => id !== studentId)
    )
  }

  const handleExportToExcel = async (selectedFields) => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student to export')
      return
    }

    try {
      // Show initial loading toast
      const loadingToast = toast.loading('Preparing data for export...')
      setProcessing(true)
      
      // Fetch complete details for each selected student
      const studentDetails = []
      for (const studentId of selectedStudents) {
        toast.loading(`Fetching details for student ${studentId}...`, {
          id: loadingToast
        })
        
        const response = await fetch(`/api/admin/studentdetail/${studentId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch details for student ${studentId}`)
        }
        const data = await response.json()
        studentDetails.push(data)
      }

      toast.loading('Processing data for export...', {
        id: loadingToast
      })

      // Format data based on selected fields
      const formattedData = studentDetails.map(student => 
        formatStudentForExcel(student, selectedFields)
      )

      // Create and download Excel file
      const ws = XLSX.utils.json_to_sheet(formattedData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Students')
      
      // Auto-size columns
      const maxWidth = 50
      const colWidths = Object.keys(formattedData[0] || {}).reduce((acc, key) => {
        const width = Math.min(
          Math.max(key.length, ...formattedData.map(row => 
            String(row[key] || '').length
          )),
          maxWidth
        )
        acc[key] = width
        return acc
      }, {})
      
      ws['!cols'] = Object.values(colWidths).map(width => ({width}))

      toast.loading('Downloading file...', {
        id: loadingToast
      })

      XLSX.writeFile(wb, 'students_detailed_data.xlsx')
      toast.success('Export completed successfully', {
        id: loadingToast
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error(`Export failed: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const handleExportClick = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student to export')
      return
    }
    setShowExportDialog(true)
  }

  const formatStudentForExcel = (student, selectedFields) => {
    const formattedData = {}

    selectedFields.forEach(field => {
      const [category, fieldName] = field.split('.')
      if (student[category]?.[fieldName] !== undefined) {
        // Format special fields
        if (fieldName === 'date_of_birth') {
          formattedData[field] = new Date(student[category][fieldName])
            .toLocaleDateString()
        } else if (typeof student[category][fieldName] === 'boolean') {
          formattedData[field] = student[category][fieldName] ? 'Yes' : 'No'
        } else {
          formattedData[field] = student[category][fieldName]
        }
      } else {
        formattedData[field] = 'Not provided'
      }
    })

    return formattedData
  }

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="p-6">
        <Breadcrumb
          items={[
            { label: 'Super Admin', href: '/super-admin/dashboard' },
            { label: 'Students', href: '/super-admin/students' },
          ]}
        />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Verified Students</h1>
          <Button
            variant="outline"
            onClick={fetchStudents}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <SearchInput
                placeholder="Search students..."
                className="max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {/* Filters */}
              <div className="flex gap-2 flex-1">
                <Select
                  value={filters.branch}
                  onValueChange={(value) => handleFilterChange(value, 'branch')}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.year}
                  onValueChange={(value) => handleFilterChange(value, 'year')}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {Year.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.passingYear}
                  onValueChange={(value) => handleFilterChange(value, 'passingYear')}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Passing Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Passing Years</SelectItem>
                    {PassingYear.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.degreeType}
                  onValueChange={(value) => handleFilterChange(value, 'degreeType')}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Degree Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Degrees</SelectItem>
                    {DegreeTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(filters.branch || filters.year || filters.passingYear) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={fetchStudents}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Add filter summary */}
          {(filters.branch !== 'all' || filters.year !== 'all' || 
            filters.passingYear !== 'all' || filters.degreeType !== 'all') && (
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span>Filtered by:</span>
              {filters.branch !== 'all' && (
                <span className="bg-secondary px-2 py-1 rounded-md">
                  Branch: {filters.branch}
                </span>
              )}
              {filters.year !== 'all' && (
                <span className="bg-secondary px-2 py-1 rounded-md">
                  Year: {filters.year}
                </span>
              )}
              {filters.passingYear !== 'all' && (
                <span className="bg-secondary px-2 py-1 rounded-md">
                  Passing Year: {filters.passingYear}
                </span>
              )}
              {filters.degreeType !== 'all' && (
                <span className="bg-secondary px-2 py-1 rounded-md">
                  Degree: {filters.degreeType}
                </span>
              )}
            </div>
          )}

          {/* Add results count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {students.length} students
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selectAll} 
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedStudents.length} selected
              </span>
            </div>
            {selectedStudents.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportClick}
                disabled={processing}
              >
                <Download className="h-4 w-4 mr-2" />
                {processing ? 'Exporting...' : 'Export Selected'}
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center p-8 text-red-500">
                  {error}
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <AlertCircle className="h-12 w-12 opacity-50 mb-2" />
                  <p>No students found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={(checked) => handleSelectStudent(checked, student.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link 
                            href={`/super-admin/students/${student.id}`}
                            className="hover:underline text-primary"
                          >
                            {student.full_name}
                          </Link>
                        </TableCell>
                        <TableCell>{student.roll_number}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.branch}</TableCell>
                        <TableCell>{student.cgpa}</TableCell>
                        <TableCell>
                          {new Date(student.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleEdit(student)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(student)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roll_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Year</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cgpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGPA</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passing_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passing Year</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Student</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedStudent?.full_name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={processing}
              >
                {processing ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ExportFieldsDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          onConfirm={(selectedFields) => {
            setShowExportDialog(false)
            handleExportToExcel(selectedFields)
          }}
        />
      </div>
    </ProtectedRoute>
  )
} 