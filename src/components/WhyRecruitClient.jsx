"use client"

import CompanyCarousel from '@/components/ui/CompanyCarousel' // Import the reusable carousel
import { Card } from '@/components/ui/card' // Import Card if needed for other parts
import { Briefcase } from 'lucide-react'; // Example icon

// You can pass data as props from the server component if needed,
// or define static client-side content here.
export default function WhyRecruitClient({ /* potential props */ }) {
  return (
    <>
      {/* Keep other sections that are static or don't need client hooks here */}
      {/* Example: Maybe a section before the carousel */}
      {/* <section>...</section> */}

      {/* Top Recruiters Section using the Carousel */}
      <section className="py-12 md:py-16 bg-red-950/5 dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Companies Who Trust Our Talent
          </h2>
          <CompanyCarousel />
        </div>
      </section>

      {/* Keep other sections that are static or don't need client hooks here */}
      {/* Example: Maybe a section after the carousel */}
      {/* <section>...</section> */}
    </>
  )
} 