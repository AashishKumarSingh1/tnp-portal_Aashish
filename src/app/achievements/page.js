
import { Card } from '@/components/ui/card'
import { Trophy, TrendingUp, Building2, Users, Star, Award, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Achievements & Statistics - Training & Placement Cell NIT Patna',
  description: 'Placement Achievements, Statistics and Records of NIT Patna',
}


const placementData = [
  {
    session: '2024-25',
    ug: { offers: 505, max: 41.37, min: 5, avg: 9.9 },
    pg: { offers: 19, max: 12.5, min: 5, avg: 7.8 },
    companies: 100, // Example: Add company count if available per session
    highlights: [ // Example qualitative highlights
      "Strong performance despite market conditions.",
      "Increased participation from core engineering companies.",
      "Successful implementation of new hybrid placement process.",
    ]
  },
  {
    session: '2023-24',
    ug: { offers: 591, max: 44.92, min: 3.0, avg: 9.4 },
    pg: { offers: 24, max: 17, min: 4, avg: 8 },
    companies: 120, // Example
    highlights: [
      "Record number of UG offers.",
      "Highest UG package crossed 44 LPA.",
      "Expansion into new recruitment sectors.",
    ]
  },
  {
    session: '2022-23',
    ug: { offers: 601, max: 52, min: 3.5, avg: 12.66 },
    pg: { offers: 99, max: 30.03, min: 3.50, avg: null },
    companies: 130, // Example
    highlights: [
      "Exceptional highest package of 52 LPA.",
      "Robust PG placements with nearly 100 offers.",
      "Highest number of participating companies.",
    ]
  },
]

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
                stat: "5000+",
                label: "Students Placed",
                description: "Successful placements in last 5 years"
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
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Notable Achievements by Session</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {placementData.slice(0, 2).map((item) => (
              <Card key={item.session} className="p-6 hover-card">
                <h3 className="text-xl font-semibold mb-4 text-red-900 dark:text-red-500">{item.session}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Highest package of <span className="font-medium">{item.ug.max} LPA (UG)</span> achieved.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Total <span className="font-medium">{item.ug.offers + item.pg.offers}</span> job offers secured (UG+PG).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Average package reached <span className="font-medium">{item.ug.avg} LPA (UG)</span>.</span>
                  </li>
                  {item.highlights && item.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-teal-500 dark:text-teal-400 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{highlight}</span>
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
                <h3 className="text-lg font-semibold mb-2">Ashish Kumar</h3>
                <p className="text-red-900 dark:text-red-500 text-sm mb-3">Batch of 2025 - Computer Science</p>
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
            {placementData.map((item) => (
              <Card key={item.session} className="p-6 hover-card">
                <h3 className="text-lg font-semibold mb-4">{item.session}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Offers (UG+PG)</p>
                      <p className="font-medium text-base">{item.ug.offers + item.pg.offers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Average Package (UG)</p>
                      <p className="font-medium text-base">{item.ug.avg} LPA</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Highest Package (UG)</p>
                      <p className="font-medium text-base">{item.ug.max} LPA</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Highest Package (PG)</p>
                      <p className="font-medium text-base">{item.pg.max} LPA</p>
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