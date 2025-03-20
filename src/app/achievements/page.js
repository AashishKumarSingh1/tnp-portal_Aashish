import { Card } from '@/components/ui/card'
import { Trophy, TrendingUp, Building2, Users, Star, Award } from 'lucide-react'

export const metadata = {
  title: 'Achievements - Training & Placement Cell NIT Patna',
  description: 'Discover the placement achievements and success stories of NIT Patna',
}

export default function AchievementsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Our Achievements</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Celebrating excellence in placements and industry collaborations at NIT Patna.
            </p>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Trophy,
                stat: "95%+",
                label: "Placement Rate",
                description: "Consistent placement success across branches"
              },
              {
                icon: Building2,
                stat: "200+",
                label: "Companies Visited",
                description: "Leading organizations recruit from NIT Patna"
              },
              {
                icon: TrendingUp,
                stat: "50 LPA",
                label: "Highest Package",
                description: "Outstanding compensation packages"
              },
              {
                icon: Users,
                stat: "1000+",
                label: "Students Placed",
                description: "Successful placements in last 2 years"
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 hover-card bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20">
                <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{item.stat}</h3>
                <p className="text-red-900 dark:text-red-500 font-semibold mb-2">{item.label}</p>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Notable Achievements */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Notable Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                year: "2023",
                achievements: [
                  "Highest package of 50 LPA achieved",
                  "Over 200 companies participated in placements",
                  "100% placement in Computer Science department",
                  "Significant increase in average package"
                ]
              },
              {
                year: "2022",
                achievements: [
                  "Record number of PPOs received",
                  "New companies from diverse sectors added",
                  "Successful virtual placement drive",
                  "Enhanced industry collaborations"
                ]
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 hover-card">
                <h3 className="text-xl font-semibold mb-4 text-red-900 dark:text-red-500">{item.year}</h3>
                <ul className="space-y-3">
                  {item.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-red-900 dark:text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-6 hover-card">
                <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Student Name</h3>
                <p className="text-red-900 dark:text-red-500 text-sm mb-3">Batch of 2023 - Computer Science</p>
                <p className="text-muted-foreground text-sm">
                  "The training and placement cell provided excellent support throughout my placement journey. Secured position at leading tech company."
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Year-wise Comparison */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Placement Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['2023', '2022', '2021'].map((year) => (
              <Card key={year} className="p-6 hover-card">
                <h3 className="text-lg font-semibold mb-4">{year}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Placement Rate</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="w-full bg-red-950/10 rounded-full h-2">
                      <div className="bg-red-900 rounded-full h-2 transition-all duration-500" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Average Package</p>
                      <p className="font-medium">12 LPA</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Highest Package</p>
                      <p className="font-medium">45 LPA</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 