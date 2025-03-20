'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, X, Loader2 } from 'lucide-react'

export function AddAttachments({ onAttachmentsChange, isUploading, maxSize = 5 * 1024 * 1024, accept = '.pdf' }) {
  const [attachments, setAttachments] = useState([])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    
    // Validate file size
    const oversizedFiles = files.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      toast.error(`File size exceeds the limit of ${maxSize / (1024 * 1024)}MB`)
      return
    }

    // Validate file type
    const invalidFiles = files.filter(file => !file.type.includes('pdf'))
    if (invalidFiles.length > 0) {
      toast.error('Only PDF files are allowed')
      return
    }

    setAttachments(prev => [...prev, ...files])
    if (onAttachmentsChange) {
      onAttachmentsChange([...attachments, ...files])
    }
  }

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index)
    setAttachments(newAttachments)
    if (onAttachmentsChange) {
      onAttachmentsChange(newAttachments)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="attachments">Upload Documents</Label>
        <Input
          id="attachments"
          type="file"
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="cursor-pointer"
          disabled={isUploading}
        />
        <p className="text-sm text-muted-foreground">
          Accepted formats: PDF (Max {maxSize / (1024 * 1024)}MB)
        </p>
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files:</Label>
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <span className="text-sm truncate max-w-[200px]">
                  {file.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export async function handleNewAttachments(files, userId, documentType) {
  try {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('userId', userId)
    formData.append('documentType', documentType)

    const response = await fetch('/api/student/documents/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to upload documents')
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(error.message || 'Failed to upload documents')
  }
} 