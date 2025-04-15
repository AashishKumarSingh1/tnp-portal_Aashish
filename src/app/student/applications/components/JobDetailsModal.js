'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Building2, MapPin, Briefcase, Calendar, Cpu } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

export function JobDetailsModal({ open, onClose, jobDetails }) {
  if (!jobDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{jobDetails.job_profile}</DialogTitle>
          <DialogDescription className="text-base font-medium">{jobDetails.company_name}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Key Details Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Offer Type</p>
                <p className="font-medium">{jobDetails.offer_type}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{jobDetails.place_of_posting}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Mode of Hiring</p>
                <p className="font-medium">{jobDetails.mode_of_hiring}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Application Deadline</p>
                <p className="font-medium">{jobDetails.last_date_to_apply ? new Date(jobDetails.last_date_to_apply).toLocaleDateString() : 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* CTC Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">CTC Breakdown</h3>
            <div className="bg-muted p-3 rounded-md whitespace-pre-line">
              {jobDetails.ctc_breakdown}
            </div>
          </div>
          
          {/* Selection Process */}
          {jobDetails.selection_process && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Selection Process</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(jobDetails.selection_process).map(([key, value]) => 
                    value && (
                      <Badge key={key} variant="outline" className="py-1">
                        <Cpu className="h-3 w-3 mr-1" />
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </>
          )}
          
          {/* Eligibility */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Eligibility Criteria</h3>
            
            {jobDetails.eligible_batches && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Eligible Batches</p>
                <div className="flex flex-wrap gap-2">
                  {jobDetails.eligible_batches.map((batch, index) => (
                    <Badge key={index} variant="outline">{batch}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {jobDetails.eligible_branches && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Eligible Branches</p>
                <div className="flex flex-wrap gap-2">
                  {jobDetails.eligible_branches.map((branch, index) => (
                    <Badge key={index} variant="outline">{branch}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {jobDetails.eligible_degrees && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Eligible Degrees</p>
                <div className="flex flex-wrap gap-2">
                  {jobDetails.eligible_degrees.map((degree, index) => (
                    <Badge key={index} variant="outline">{degree}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {jobDetails.job_description_file && (
            <Button asChild>
              <a href={jobDetails.job_description_file} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download JD
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 