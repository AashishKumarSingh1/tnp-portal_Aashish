//facilities page

import { Card } from '@/components/ui/card'
import { 
  Building2, 
  Laptop, 
  Users, 
  BookOpen, 
  Video, 
  Wifi,
  PenTool,
  Library,
  MonitorSmartphone,
  Presentation,
  BookOpenCheck,
  GraduationCap
} from 'lucide-react'

export const metadata = {
  title: 'Facilities - Training & Placement Cell NIT Patna',
  description: 'Explore the facilities and resources provided by Training & Placement Cell at NIT Patna',
}

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Our Facilities</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              State-of-the-art infrastructure and resources to support your placement journey
            </p>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Infrastructure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Dedicated Interview Rooms",
                description: "Multiple well-furnished rooms for conducting interviews and group discussions"
              },
              {
                icon: Presentation,
                title: "Conference Halls",
                description: "Spacious halls equipped with modern presentation facilities for pre-placement talks"
              },
              {
                icon: MonitorSmartphone,
                title: "Computer Labs",
                description: "Well-equipped computer labs for online tests and assessments"
              }
            ].map((facility, index) => (
              <Card key={index} className="p-6 hover-card bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20">
                <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center mb-4">
                  <facility.icon className="w-6 h-6 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{facility.title}</h3>
                <p className="text-muted-foreground">{facility.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Resources Section */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Digital Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wifi,
                title: "High-Speed Internet",
                description: "24/7 high-speed internet connectivity"
              },
              {
                icon: Video,
                title: "Video Conferencing",
                description: "Advanced video conferencing facilities"
              },
              {
                icon: Laptop,
                title: "Online Portal",
                description: "Dedicated placement portal for students"
              },
              {
                icon: Library,
                title: "Digital Library",
                description: "Access to online learning resources"
              }
            ].map((resource, index) => (
              <Card key={index} className="p-6 hover-card">
                <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center mb-4">
                  <resource.icon className="w-6 h-6 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                <p className="text-muted-foreground text-sm">{resource.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Training Resources Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Training Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpenCheck,
                title: "Mock Interviews",
                description: "Regular mock interviews with industry experts and alumni"
              },
              {
                icon: Users,
                title: "Group Discussion Practice",
                description: "Dedicated sessions for GD practice and feedback"
              },
              {
                icon: PenTool,
                title: "Aptitude Training",
                description: "Comprehensive aptitude and technical test preparation"
              },
              {
                icon: GraduationCap,
                title: "Skill Development",
                description: "Regular workshops on technical and soft skills"
              },
              {
                icon: BookOpen,
                title: "Study Material",
                description: "Access to placement preparation resources and materials"
              },
              {
                icon: Presentation,
                title: "Industry Sessions",
                description: "Regular sessions with industry professionals"
              }
            ].map((resource, index) => (
              <Card key={index} className="p-6 hover-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                    <resource.icon className="w-6 h-6 text-red-900 dark:text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold">{resource.title}</h3>
                </div>
                <p className="text-muted-foreground">{resource.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Services Section */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Support Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-6 hover-card">
              <h3 className="text-xl font-semibold mb-4">Student Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-900" />
                  <span>24/7 technical support during online assessments</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-900" />
                  <span>Dedicated placement coordinators for each department</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-900" />
                  <span>Resume building and verification assistance</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 hover-card">
              <h3 className="text-xl font-semibold mb-4">Company Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-900" />
                  <span>Logistics support for campus drives</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-900" />
                  <span>Accommodation arrangements for company officials</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-900" />
                  <span>Documentation and coordination support</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
