import { Card } from '@/components/ui/card'
import { Users, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react'

export const metadata = {
  title: 'Our Team - Training & Placement Cell NIT Patna',
  description: 'Meet the dedicated team behind the Training & Placement Cell at NIT Patna',
}

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Meet Our Team</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals working tirelessly to bridge the gap between academia and industry.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Prof. P. K. Jain",
                role: "Director, NIT Patna",
                image: "/placeholder.jpg",
                description: "Leading NIT Patna's vision for excellence in technical education and industry collaboration."
              },
              {
                name: "Dr. Samrat Mukherjee",
                role: "Training & Placement Officer",
                image: "/placeholder.jpg",
                description: "Spearheading placement activities and industry relations with over 15 years of experience."
              },
              {
                name: "Prof. Rakesh Kumar",
                role: "Faculty Coordinator",
                image: "/placeholder.jpg",
                description: "Coordinating academic-industry partnerships and student development programs."
              }
            ].map((member, index) => (
              <Card key={index} className="p-6 hover-card bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20">
                <div className="w-24 h-24 rounded-full bg-red-900/10 mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-12 h-12 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
                <p className="text-red-900 dark:text-red-500 text-center text-sm mb-4">{member.role}</p>
                <p className="text-muted-foreground text-center text-sm">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Coordinators */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Faculty Coordinators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6 hover-card">
                <div className="w-16 h-16 rounded-full bg-red-900/10 mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Dr. Faculty Name</h3>
                <p className="text-red-900 dark:text-red-500 text-center text-sm mb-2">Department Name</p>
                <p className="text-muted-foreground text-center text-sm">Branch Coordinator</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Student Coordinators */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Student Coordinators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-6 hover-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-red-900 dark:text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Student Name</h3>
                    <p className="text-red-900 dark:text-red-500 text-sm">Branch Name</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Staff */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Support Staff</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6 hover-card">
                <div className="w-16 h-16 rounded-full bg-red-900/10 mx-auto mb-4 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Staff Name</h3>
                <p className="text-red-900 dark:text-red-500 text-center text-sm">Position</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 