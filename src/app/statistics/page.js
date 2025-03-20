import { PageHeader } from '@/app/components/page-header'
import { Card } from '@/components/ui/card'
import { Building2, Users, Trophy, TrendingUp, Briefcase } from 'lucide-react'

export const metadata = {
  title: 'Statistics - Training & Placement Cell NIT Patna',
  description: 'Placement Statistics and Records of NIT Patna',
}

export default function StatisticsPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Placement Statistics"
        description="Our placement records showcase our commitment to excellence"
      />

      {/* Overview Cards */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 hover-card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-red-900" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Companies Visited</p>
                  <h3 className="text-xl md:text-2xl font-bold">100+</h3>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-6 hover-card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-red-900" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students Placed</p>
                  <h3 className="text-xl md:text-2xl font-bold">500+</h3>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-6 hover-card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-red-900" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Highest Package</p>
                  <h3 className="text-xl md:text-2xl font-bold">50 LPA</h3>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-6 hover-card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-red-900" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Package</p>
                  <h3 className="text-xl md:text-2xl font-bold">12 LPA</h3>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Branch-wise Statistics */}
      <section className="py-8 md:py-12 bg-red-950/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Branch-wise Placement Statistics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 hover-card">
              <h3 className="text-base md:text-lg font-semibold mb-4">Computer Science & Engineering</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Placement Rate</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="w-full bg-red-950/10 rounded-full h-2">
                  <div className="bg-red-900 rounded-full h-2 transition-all duration-500" style={{ width: '95%' }}></div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between text-sm gap-2">
                  <span className="text-muted-foreground">Average Package: 15 LPA</span>
                  <span className="text-muted-foreground">Highest: 50 LPA</span>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-6 hover-card">
              <h3 className="text-base md:text-lg font-semibold mb-4">Electronics & Communication</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Placement Rate</span>
                  <span className="font-medium">90%</span>
                </div>
                <div className="w-full bg-red-950/10 rounded-full h-2">
                  <div className="bg-red-900 rounded-full h-2" style={{ width: '90%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average Package: 12 LPA</span>
                  <span className="text-muted-foreground">Highest: 45 LPA</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Recruiters */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Top Recruiters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 flex items-center justify-center hover-card aspect-square">
                <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-red-900/50" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Year-wise Comparison */}
      <section className="py-8 md:py-12 bg-red-950/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Year-wise Placement Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {['2023', '2022', '2021'].map((year) => (
              <Card key={year} className="p-4 md:p-6 hover-card">
                <h3 className="text-lg font-semibold mb-4">{year}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Placement Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="w-full bg-red-950/10 rounded-full h-2">
                    <div className="bg-red-900 rounded-full h-2 transition-all duration-500" style={{ width: '92%' }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Average Package</p>
                      <p className="font-medium">12 LPA</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Companies Visited</p>
                      <p className="font-medium">100+</p>
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