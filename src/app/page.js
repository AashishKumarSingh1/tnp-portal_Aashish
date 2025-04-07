"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, BookOpen, Building2, GraduationCap, Users, Trophy, Briefcase, ChartBar } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import CompanyCarousel from '@/components/ui/CompanyCarousel'


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Welcome to
              <span className="gradient-text block mt-2">Training & Placement Cell</span>
              <span className="text-red-900 dark:text-red-500">NIT Patna</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Bridging the gap between academia and industry, we facilitate successful careers and foster industry partnerships.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto bg-red-900 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700" asChild>
                <Link href="/login">Login Portal</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-red-900/20 hover:bg-red-900/10 dark:border-red-700/20 dark:hover:bg-red-700/10" asChild>
                <Link href="/contact">Contact Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="p-6 rounded-lg bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20 text-center hover:shadow-lg transition-all hover:shadow-red-900/10">
              <div className="text-3xl md:text-4xl font-bold text-red-900 dark:text-red-500">500+</div>
              <div className="mt-2 text-sm text-muted-foreground">Students Placed</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20 text-center hover:shadow-lg transition-all hover:shadow-red-900/10">
              <div className="text-3xl md:text-4xl font-bold text-red-900 dark:text-red-500">80+</div>
              <div className="mt-2 text-sm text-muted-foreground">Companies Visited</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20 text-center hover:shadow-lg transition-all hover:shadow-red-900/10">
              <div className="text-3xl md:text-4xl font-bold text-red-900 dark:text-red-500">41.37 LPA</div>
              <div className="mt-2 text-sm text-muted-foreground">Highest Package</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20 text-center hover:shadow-lg transition-all hover:shadow-red-900/10">
              <div className="text-3xl md:text-4xl font-bold text-red-900 dark:text-red-500">9.9 LPA</div>
              <div className="mt-2 text-sm text-muted-foreground">Average Package</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">Why Choose NIT Patna?</h2>
            <p className="text-muted-foreground">
              We offer a comprehensive platform for both students and recruiters to connect and grow together.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-all hover:border-red-900/20 hover:shadow-red-900/10">
              <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-red-900 dark:text-red-500 mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Academic Excellence</h3>
              <p className="text-muted-foreground">
                Top-ranked engineering institution with exceptional academic standards.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-all hover:border-red-900/20 hover:shadow-red-900/10">
              <Users className="h-10 w-10 md:h-12 md:w-12 text-red-900 dark:text-red-500 mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Diverse Talent Pool</h3>
              <p className="text-muted-foreground">
                Students from various engineering disciplines with diverse skill sets.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-all hover:border-red-900/20 hover:shadow-red-900/10">
              <Building2 className="h-10 w-10 md:h-12 md:w-12 text-red-900 dark:text-red-500 mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Industry Connect</h3>
              <p className="text-muted-foreground">
                Strong relationships with leading companies across sectors.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-all hover:border-red-900/20 hover:shadow-red-900/10">
              <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-red-900 dark:text-red-500 mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Research Focus</h3>
              <p className="text-muted-foreground">
                Emphasis on innovation and research in emerging technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Placements Section */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Recent Placements</h2>
            <p className="text-muted-foreground">
              Our students have been placed in some of the most prestigious companies across the globe.
            </p>
          </div>
          <CompanyCarousel />
        </div>
      </section>

      {/* News & Announcements Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Latest Updates</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Stay updated with the latest placement drives and important announcements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-all">
              <div className="text-sm text-primary mb-2">Posted on 15 March 2025</div>
              <h3 className="text-xl font-semibold mb-2">Upcoming Placement Drive</h3>
              <p className="text-muted-foreground mb-4">Major tech companies visiting campus for recruitment in April 2025.</p>
              <Button variant="link" className="p-0" asChild>
                <Link href="/news/placement-drive">Read More →</Link>
              </Button>
            </div>
            <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-all">
              <div className="text-sm text-primary mb-2">Posted on 10 March 2025</div>
              <h3 className="text-xl font-semibold mb-2">Pre-Placement Talk</h3>
              <p className="text-muted-foreground mb-4">Join us for an interactive session with industry leaders.</p>
              <Button variant="link" className="p-0" asChild>
                <Link href="/news/pre-placement">Read More →</Link>
              </Button>
            </div>
            <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-all">
              <div className="text-sm text-primary mb-2">Posted on 5 March 2025</div>
              <h3 className="text-xl font-semibold mb-2">Training Workshop</h3>
              <p className="text-muted-foreground mb-4">Technical and soft skills workshop scheduled for final year students.</p>
              <Button variant="link" className="p-0" asChild>
                <Link href="/news/workshop">Read More →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-background to-red-900/5 dark:from-background dark:to-red-950/10">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 gradient-text">What They Say</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Hear from our alumni and recruiters about their experience with NIT Patna.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Shanvi Singh</div>
                  <div className="text-sm text-muted-foreground">Software Engineer, Google</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The training and placement cell at NIT Patna provided excellent support throughout my placement journey."
              </p>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Prashant Kumar</div>
                  <div className="text-sm text-muted-foreground">HR Manager, Microsoft</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "We've been consistently impressed with the quality of students from NIT Patna. They bring strong technical skills and professional attitude."
              </p>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Rajesh Kumar</div>
                  <div className="text-sm text-muted-foreground">Alumni, Batch of 2023</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The placement preparation and guidance helped me secure my dream job. Forever grateful to the T&P cell."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-red-900 to-red-950 dark:from-red-800 dark:to-red-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Recruit from NIT Patna?</h2>
            <p className="text-white/90 mb-8 text-sm md:text-base">
              Join the league of top companies recruiting from NIT Patna. Register now to access our talent pool.
            </p>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-red-900 hover:bg-red-50" asChild>
              <Link href="/register">Register as Recruiter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
