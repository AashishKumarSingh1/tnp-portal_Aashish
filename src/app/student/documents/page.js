// This is the documents page of the student

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AddAttachments } from '@/components/AddAttachments'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Upload, Eye, Trash2, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

const DOCUMENT_TYPES = {
  PROFILE_PHOTO: 'profile_photo',
  RESUME: 'resume',
  TENTH_MARKSHEET: 'tenth_marksheet',
  TWELFTH_MARKSHEET: 'twelfth_marksheet',
  BTECH_MARKSHEET: 'btech_marksheet',
  MTECH_MARKSHEET: 'mtech_marksheet',
  PHD_MARKSHEET: 'phd_marksheet',
  AADHAR_CARD: 'aadhar_card',
  PAN_CARD: 'pan_card',
  CATEGORY_CERTIFICATE: 'category_certificate',
  PH_CERTIFICATE: 'ph_certificate'
}

const DOCUMENT_CONFIG = {
  [DOCUMENT_TYPES.PROFILE_PHOTO]: {
    title: 'Profile Photo',
    required: true,
    maxSize: 5,
  },
  [DOCUMENT_TYPES.RESUME]: {
    title: 'Resume',
    required: true,
    maxSize: 5, // in MB
  },
  [DOCUMENT_TYPES.TENTH_MARKSHEET]: {
    title: '10th Marksheet',
    required: true,
    maxSize: 5,
  },
  [DOCUMENT_TYPES.TWELFTH_MARKSHEET]: {
    title: '12th Marksheet',
    required: true,
    maxSize: 5,
  },
  [DOCUMENT_TYPES.BTECH_MARKSHEET]: {
    title: 'B.Tech All Sem Marksheet',
    required: true,
    maxSize: 5,
  },
  [DOCUMENT_TYPES.MTECH_MARKSHEET]: {
    title: 'M.Tech All Sem Marksheet',
    required: false,
    maxSize: 5,
    showFor: ['PG', 'PhD']
  },
  [DOCUMENT_TYPES.PHD_MARKSHEET]: {
    title: 'Ph.D Marksheet',
    required: false,
    maxSize: 5,
    showFor: ['PhD']
  },
  [DOCUMENT_TYPES.AADHAR_CARD]: {
    title: 'Aadhar Card (Front and Back)',
    required: true,
    maxSize: 5,
  },
  [DOCUMENT_TYPES.PAN_CARD]: {
    title: 'PAN Card',
    required: true,
    maxSize: 10,
  },
  [DOCUMENT_TYPES.CATEGORY_CERTIFICATE]: {
    title: 'Category Certificate',
    required: false,
    maxSize: 5,
    note: 'Required for OBC-NCL & EWS (Current Financial year)'
  },
  [DOCUMENT_TYPES.PH_CERTIFICATE]: {
    title: 'PH Certificate',
    required: false,
    maxSize: 5,
  }
}

export default function StudentDocuments() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState({})
  const [loading, setLoading] = useState(true)
  const [uploadType, setUploadType] = useState(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [userDegree, setUserDegree] = useState(null)

  useEffect(() => {
    fetchUserDegree()
    fetchDocuments()
  }, [])

  const fetchUserDegree = async () => {
    try {
      const res = await fetch('/api/student/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setUserDegree(data.degree_type)
    } catch (error) {
      toast.error('Failed to load profile')
    }
  }

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/student/documents')
      if (!res.ok) throw new Error('Failed to fetch documents')
      const data = await res.json()
      setDocuments(data)
    } catch (error) {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    try {
      if (!selectedFiles.length) {
        toast.error('Please select a file to upload')
        return
      }

      const file = selectedFiles[0]
      const maxSize = DOCUMENT_CONFIG[uploadType].maxSize

      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size should not exceed ${maxSize}MB`)
        return
      }

      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const loadingToast = toast.loading(`Uploading ${file.name}...`)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadRes.ok) throw new Error('Failed to upload file')
      const { url, id } = await uploadRes.json()

      const saveRes = await fetch('/api/student/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: uploadType,
          file_url: url,
          file_name: file.name
        })
      })

      if (!saveRes.ok) throw new Error('Failed to save document reference')

      toast.dismiss(loadingToast)
      toast.success('Document uploaded successfully')
      
      setUploadDialogOpen(false)
      setSelectedFiles([])
      fetchDocuments()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const res = await fetch(`/api/student/documents/${documentId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete document')

      toast.success('Document deleted successfully')
      fetchDocuments()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const DocumentCard = ({ type }) => {
    const config = DOCUMENT_CONFIG[type]
    const document = documents[type]

    // Don't show if document is degree-specific and not applicable
    if (config.showFor && !config.showFor.includes(userDegree)) {
      return null
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {config.title}
            {config.required && <span className="text-red-500">*</span>}
          </CardTitle>
          {config.note && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{config.note}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          {!document ? (
            <Button
              onClick={() => {
                setUploadType(type)
                setUploadDialogOpen(true)
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload {config.title}
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm truncate max-w-[200px]">
                {document.file_name}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadType(type)
                    setUploadDialogOpen(true)
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(document.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Documents</h1>
        
        <div className="grid gap-6">
          {Object.values(DOCUMENT_TYPES).map((type) => (
            <DocumentCard key={type} type={type} />
          ))}
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload {DOCUMENT_CONFIG[uploadType]?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Maximum file size: {DOCUMENT_CONFIG[uploadType]?.maxSize}MB. 
                  Supported format: PDF
                </AlertDescription>
              </Alert>
              <AddAttachments 
                onAttachmentsChange={setSelectedFiles} 
                isUploading={isUploading}
                maxSize={DOCUMENT_CONFIG[uploadType]?.maxSize * 1024 * 1024}
                accept=".pdf"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setUploadDialogOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
