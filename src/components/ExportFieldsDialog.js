import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const AVAILABLE_FIELDS = {
  profile: {
    label: 'Basic Profile',
    fields: {
      full_name: 'Full Name',
      roll_number: 'Roll Number',
      email: 'Email',
      secondary_email: 'Secondary Email',
      phone: 'Phone',
      secondary_phone: 'Secondary Phone',
      branch: 'Branch',
      current_year: 'Current Year',
      cgpa: 'CGPA',
      passing_year: 'Passing Year',
      degree_type: 'Degree Type',
      specialization: 'Specialization'
    }
  },
  academics: {
    label: 'Academic Details',
    fields: {
      tenth_school: '10th School',
      tenth_board: '10th Board',
      tenth_percentage: '10th Percentage',
      tenth_year: '10th Year',
      twelfth_school: '12th School',
      twelfth_board: '12th Board',
      twelfth_percentage: '12th Percentage',
      twelfth_year: '12th Year',
      ug_college: 'UG College',
      ug_university: 'UG University',
      overall_cgpa: 'Overall CGPA',
      backlogs: 'Backlogs',
      current_backlogs: 'Current Backlogs',
      gap_years: 'Gap Years'
    }
  },
  personal: {
    label: 'Personal Details',
    fields: {
      fathers_name: "Father's Name",
      fathers_occupation: "Father's Occupation",
      mothers_name: "Mother's Name",
      mothers_occupation: "Mother's Occupation",
      date_of_birth: 'Date of Birth',
      gender: 'Gender',
      category: 'Category',
      blood_group: 'Blood Group',
      permanent_address: 'Permanent Address',
      permanent_city: 'Permanent City',
      permanent_state: 'Permanent State',
      permanent_pincode: 'Permanent Pincode'
    }
  }
}

export function ExportFieldsDialog({ open, onOpenChange, onConfirm }) {
  const [selectedFields, setSelectedFields] = useState({})

  const handleSelectCategory = (category, checked) => {
    const categoryFields = AVAILABLE_FIELDS[category].fields
    const updatedFields = { ...selectedFields }
    
    Object.keys(categoryFields).forEach(field => {
      const fullField = `${category}.${field}`
      if (checked) {
        updatedFields[fullField] = true
      } else {
        delete updatedFields[fullField]
      }
    })
    
    setSelectedFields(updatedFields)
  }

  const handleSelectField = (category, field, checked) => {
    const fullField = `${category}.${field}`
    setSelectedFields(prev => ({
      ...prev,
      [fullField]: checked
    }))
  }

  const isCategorySelected = (category) => {
    const categoryFields = AVAILABLE_FIELDS[category].fields
    return Object.keys(categoryFields).every(field => 
      selectedFields[`${category}.${field}`]
    )
  }

  const handleConfirm = () => {
    const fields = Object.keys(selectedFields).filter(key => selectedFields[key])
    onConfirm(fields)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Fields to Export</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          <Accordion type="multiple" className="w-full">
            {Object.entries(AVAILABLE_FIELDS).map(([category, { label, fields }]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={isCategorySelected(category)}
                      onCheckedChange={(checked) => handleSelectCategory(category, checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {Object.entries(fields).map(([field, label]) => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedFields[`${category}.${field}`] || false}
                          onCheckedChange={(checked) => 
                            handleSelectField(category, field, checked)
                          }
                        />
                        <label className="text-sm">{label}</label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={Object.keys(selectedFields).length === 0}
          >
            Export Selected Fields
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 