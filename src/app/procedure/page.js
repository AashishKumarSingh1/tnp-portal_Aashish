import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ClipboardList, Calendar, Users, FileCheck, Building2, CheckCircle2, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Recruitment Procedure - Training & Placement Cell NIT Patna',
  description: 'Learn about the recruitment process at NIT Patna',
}

export default function ProcedurePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Recruitment Procedure</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              A step-by-step guide to recruiting from NIT Patna. Simple, streamlined, and efficient.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {[
              {
                icon: Building2,
                title: "Step 1: Company Registration",
                description: "Register your company through our portal. Provide company details and recruitment requirements.",
                details: [
                  "Fill the registration form",
                  "Submit company profile",
                  "Specify job roles and requirements",
                  "Wait for verification and approval"
                ]
              },
              {
                icon: ClipboardList,
                title: "Step 2: JNF/INF Submission",
                description: "Submit Job Notification Form (JNF) or Internship Notification Form (INF).",
                details: [
                  "Download the form template",
                  "Fill complete job/internship details",
                  "Specify eligibility criteria",
                  "Submit for review"
                ]
              },
              {
                icon: Calendar,
                title: "Step 3: Schedule Allocation",
                description: "Choose your preferred dates for campus recruitment process.",
                details: [
                  "View available slots",
                  "Select convenient dates",
                  "Confirm schedule",
                  "Receive confirmation from T&P cell"
                ]
              },
              
              {
                icon: Users,
                title: "Step 4: Student Applications",
                description: "Review applications from eligible students.",
                details: [
                  "Access student profiles",
                  "Review applications",
                  "Shortlist candidates",
                  "Schedule interviews"
                ]
              },
              {
                icon: Users,
                title : "Group Discussion Round ( optional )",
                description: "Conduct a group discussion with the students.",
                details: [
                  "Prepare a topic",
                  "Discuss with students",
                  "Evaluate candidates"
                ]
              },
              {
                icon: FileCheck,
                title: "Step 5: Selection Process",
                description: "Conduct your recruitment process as per your company's policy.",
                details: [
                  "Online/offline test",
                  "Technical interviews",
                  "HR interviews",
                  "Final selection"
                ]
              },
              {
                icon: CheckCircle2,
                title: "Step 6: Offer Roll-out",
                description: "Complete the recruitment process by rolling out offers.",
                details: [
                  "Generate offer letters",
                  "Share with T&P cell",
                  "Coordinate joining dates",
                  "Complete documentation"
                ]
              },
              {
                icon: MessageCircle,
                title : "Step 7: Company Feedback",
                description: "Provide feedback on the recruitment process.",
                details: [
                  "Provide feedback",
                  "Share your experience",
                  "Help us improve"
                ]
              }
            ].map((step, index) => (
              <Card key={index} className="p-6 md:p-8 hover-card">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-8 h-8 text-red-900 dark:text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-red-900 dark:text-red-500">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-900 dark:bg-red-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Guidelines */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Important Guidelines</h2>
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 md:p-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-900 dark:bg-red-500 mt-2" />
                  <p className="text-muted-foreground">Companies are requested to confirm their participation at least 2 weeks before the planned recruitment date.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-900 dark:bg-red-500 mt-2" />
                  <p className="text-muted-foreground">All communication should be routed through the Training & Placement Cell only.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-900 dark:bg-red-500 mt-2" />
                  <p className="text-muted-foreground">The placement process follows a one student, one job policy until all eligible students are placed.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-900 dark:bg-red-500 mt-2" />
                  <p className="text-muted-foreground">Infrastructure for conducting online/offline tests and interviews will be provided by the institute.</p>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">Ready to Start?</h2>
            <p className="text-muted-foreground mb-8">
              Begin your recruitment journey with NIT Patna. Register now to access our talent pool.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-red-900 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700" asChild>
                <Link href="/register">Register as Recruiter</Link>
              </Button>
              <Button variant="outline" className="border-red-900/20 hover:bg-red-900/10 dark:border-red-700/20 dark:hover:bg-red-700/10" asChild>
                <Link href="/contact">Contact T&P Cell</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 