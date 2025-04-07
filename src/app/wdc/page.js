"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { GraduationCap, User, Linkedin, ExternalLink, Github } from 'lucide-react'

export default function WDCPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Web Development Cell</h1>
          <p className="text-sm md:text-lg text-muted-foreground">
            Think coding is challenging? Try mastering web design! This sentiment truly captures the spirit of the Web Development Cell at NIT Patna. 🌐
          </p>
          <p className="text-sm md:text-lg text-muted-foreground">
          Our mission is to ensure that the Institute's website reaches every corner of India, fostering a platform for learning and critical thinking. Through our efforts, we aim to contribute to a brighter and more informed future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-700 dark:from-red-950 dark:via-red-900 dark:to-red-800 rounded-xl border border-red-700/50 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-6 text-white bg-white/10 px-4 py-2 rounded-full">
               <GraduationCap size={20} />
               <h3 className="text-lg font-semibold">Professor In Charge</h3>
            </div>
            <Image
              src="https://drive.google.com/uc?export=view&id=1Abn5VMv4oWnpUYyNtO_j-mrh5YBNzD-C"
              alt="Dr. B Balaji Naik"
              width={160}
              height={160}
              className="rounded-full mb-6 border-4 border-white shadow-lg"
              priority
            />
            <h3 className="text-2xl font-bold text-center mb-2 text-white">Dr. B Balaji Naik</h3>
            <p className="text-center text-sm text-red-100/90 mb-6">
              Cloud Computing, Nature Inspired Algorithms, Edge Computing, Workflow Scheduling Algorithm, Optimization, Quantum Computing
            </p>
            <Button
               variant="secondary"
               className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
               asChild
             >
               <Link href="https://www.nitp.ac.in/Department/CSE/faculty/balaji.cs@nitp.ac.in" target="_blank" rel="noopener noreferrer">
                 <ExternalLink size={18} className="mr-2" /> View Faculty Profile
               </Link>
             </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center">
             <div className="flex items-center justify-center gap-3 mb-6 text-red-900 dark:text-red-500 bg-red-900/10 px-4 py-2 rounded-full">
               <User size={20} />
               <h3 className="text-lg font-semibold">Student Developer</h3>
            </div>
            <Image
              src="https://avatars.githubusercontent.com/u/114145991?v=4"
              alt="Ashish Kumar"
              width={160}
              height={160}
              className="rounded-full mb-6 border-2 border-border shadow-md"
            />
            <h3 className="text-2xl font-bold text-center mb-2">Ashish Kumar</h3>
            <p className="text-center text-muted-foreground mb-2">Lead Web Developer</p>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Database Management, Full Stack Developer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Button
                 variant="outline"
                 className="border-red-900/20 hover:bg-red-900/10 dark:border-red-700/20 dark:hover:bg-red-700/10 text-red-900 dark:text-red-500"
                 asChild
               >
                 <Link href="https://www.linkedin.com/in/ashish-kumar-nitp/" target="_blank" rel="noopener noreferrer">
                   <Linkedin size={18} className="mr-2" /> View LinkedIn
                 </Link>
               </Button>
               <Button
                 variant="outline"
                 className="border-gray-500/30 hover:bg-gray-500/10 dark:border-gray-600/30 dark:hover:bg-gray-600/10 text-gray-700 dark:text-gray-300"
                 asChild
               >
                 <Link href="https://github.com/ashishkr375" target="_blank" rel="noopener noreferrer">
                   <Github size={18} className="mr-2" /> View GitHub
                 </Link>
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 