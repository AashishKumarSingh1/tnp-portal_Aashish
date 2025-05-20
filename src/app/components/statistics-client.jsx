"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState, useRef } from 'react'
import CompanyCarousel from '@/components/ui/CompanyCarousel'
import {
  Building2, Users, Trophy, TrendingUp, Atom, DraftingCompass,
  FlaskConical, Construction, Laptop, Zap, Radio, UsersRound,
  Calculator,
  Cog, Bot
} from 'lucide-react'


const placementData = [
  {
    session: '2024-25',
    ug: { offers: 505, max: 41.37, min: 5, avg: 9.9 },
    pg: { offers: 19, max: 12.5, min: 5, avg: 7.8 },
  },
  {
    session: '2023-24',
    ug: { offers: 591, max: 44.92, min: 3.0, avg: 9.4 },
    pg: { offers: 24, max: 17, min: 4, avg: 8 },
  },
  {
    session: '2022-23',
    ug: { offers: 601, max: 52, min: 3.5, avg: 12.66 },
    pg: { offers: 99, max: 30.03, min: 3.50, avg: null },
  },
]

// --- Department Data ---
const departments = [
  { name: "Applied Physics and Materials Engineering", Icon: Atom ,link: "https://www.nitp.ac.in/Department/Phy" },
  { name: "Architecture & Planning", Icon: DraftingCompass ,link: "https://www.nitp.ac.in/Department/Archi" },
  { name: "Chemical Science and Technology", Icon: FlaskConical ,link: "https://www.nitp.ac.in/Department/Chem" },
  { name: "Civil Engineering", Icon: Construction ,link: "https://www.nitp.ac.in/Department/CE" },
  { name: "Computer Science and Engineering", Icon: Laptop ,link: "https://www.nitp.ac.in/Department/CSE" },
  { name: "Electrical Engineering", Icon: Zap ,link: "https://www.nitp.ac.in/Department/EE" },
  { name: "Electronics and Communication Engineering", Icon: Radio ,link: "https://www.nitp.ac.in/Department/ECE" },
  { name: "Humanities & Social Sciences", Icon: UsersRound ,link: "https://www.nitp.ac.in/Department/Humanities" },
  { name: "Mathematics and Computing Technology", Icon: Calculator ,link: "https://www.nitp.ac.in/Department/Math" },
  { name: "Mechanical Engineering", Icon: Cog ,link: "https://www.nitp.ac.in/Department/ME" },
  { name: "Mechatronics and Automation Engineering", Icon: Bot ,link: "https://www.nitp.ac.in/Department/Mechatronics" },
]

const latestSessionData = placementData[0]; 


export default function StatisticsClient() {

  const totalLatestOffers = latestSessionData.ug.offers + latestSessionData.pg.offers;
  
  const companiesVisitedLatest = "100+";

  return (
    <>
     
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Latest Session Highlights ({latestSessionData.session})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            
            <Card className="p-4 md:p-6 hover-card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-red-900" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Companies Visited</p>
                  <h3 className="text-xl md:text-2xl font-bold">{companiesVisitedLatest}</h3> {/* Placeholder */}
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-6 hover-card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-red-900" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Job Offers</p>
                  <h3 className="text-xl md:text-2xl font-bold">{totalLatestOffers}</h3>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-6 hover-card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-red-900" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Highest Package (UG)</p>
                  <h3 className="text-xl md:text-2xl font-bold">{latestSessionData.ug.max} LPA</h3>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-6 hover-card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-red-900" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Package (UG)</p>
                  <h3 className="text-xl md:text-2xl font-bold">{latestSessionData.ug.avg} LPA</h3>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>


      <section className="py-8 md:py-12 bg-red-950/5 dark:bg-zinc-900/30"> {/* Adjusted background */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center gradient-text">
            Placement Overview by Session
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {placementData.map((data) => (
              <Card key={data.session} className="hover-card overflow-hidden">
                <CardHeader className="bg-red-900/10 dark:bg-red-950/20">
                  <CardTitle className="text-center text-xl md:text-2xl text-red-900 dark:text-red-400">
                    Session {data.session}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Metric</TableHead>
                        <TableHead className="text-center font-semibold">UG</TableHead>
                        <TableHead className="text-center font-semibold">PG</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Offers</TableCell>
                        <TableCell className="text-center">{data.ug.offers}</TableCell>
                        <TableCell className="text-center">{data.pg.offers}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Max CTC</TableCell>
                        <TableCell className="text-center">{data.ug.max} LPA</TableCell>
                        <TableCell className="text-center">{data.pg.max} LPA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Min CTC</TableCell>
                        <TableCell className="text-center">{data.ug.min} LPA</TableCell>
                        <TableCell className="text-center">{data.pg.min} LPA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Avg. CTC</TableCell>
                        <TableCell className="text-center">{data.ug.avg} LPA</TableCell>
                        <TableCell className="text-center">
                          {data.pg.avg !== null ? `${data.pg.avg} LPA` : '-'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

  

    
      <section className="py-12 md:py-16 bg-red-950/5 dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Our Esteemed Recruiters
          </h2>
          <CompanyCarousel />
        </div>
      </section>

      {/* --- NEW Departments Section --- */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Academic Departments
          </h2>
           <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
             Explore the diverse range of engineering, science, and humanities programs offered at NIT Patna.
          </p>
          <div className="max-w-3xl mx-auto"> {/* Center the card */}
            <Card className="border-red-900/30 dark:border-red-700/30 rounded-lg shadow-md"> {/* Added themed border */}
              <CardContent className="p-6 md:p-8">
                <ul className="space-y-4"> {/* Use ul for semantic list */}
                  {departments.map(({ name, Icon, link }) => (
                    <li key={name} className="flex items-center gap-4 text-base md:text-lg">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-red-900 dark:text-red-500 flex-shrink-0" />
                      <a href={link} className="text-red-900 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400">
                        <span>{name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
} 