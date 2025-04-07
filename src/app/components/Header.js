'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ThemeSwitcher } from './theme-switcher'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Menu, LayoutDashboard, Users, Activity, ClipboardCheck, LogOut, Settings, User, FileText, ScrollText, Award, Building, Building2, Briefcase, CheckCircle, GraduationCap , BookOpen} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState, useEffect } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function Header() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    if (session?.user) {
      fetchUserDetails()
    }
  }, [session])

  const fetchUserDetails = async () => {
    try {
      let endpoint = ''
      
      switch (session.user.role?.toUpperCase()) {
        case 'SUPER_ADMIN':
        case 'ADMIN':
          endpoint = '/api/user/profile'
          break
        case 'STUDENT':
          endpoint = '/api/student/profile'
          break
        case 'COMPANY':
          endpoint = '/api/company/profile'
          break
        default:
          return
      }

      const res = await fetch(endpoint)
      if (!res.ok) throw new Error('Failed to fetch user details')
      
      const data = await res.json()
      
      let name = ''
      let email = ''
      
      switch (session.user.role?.toUpperCase()) {
        case 'SUPER_ADMIN':
        case 'ADMIN':
          name = data.name
          email = data.email
          userDetails.name = name
          break
        case 'STUDENT':
          name = `${data.full_name} (${data.roll_number})`
          email = data.primary_email
          userDetails.name = name
          break
        case 'COMPANY':
          name = data.company_name
          email = data.email
          userDetails.name = name
          break
      }


      setUserDetails({ name, email })
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  const superAdminMenuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      href: '/super-admin/dashboard'
    },
    {
      label: 'Manage Admins',
      icon: <Users className="h-4 w-4 mr-2" />,
      href: '/super-admin/admins'
    },
    {
      label: 'Verifications',
      icon: <ClipboardCheck className="h-4 w-4 mr-2" />,
      href: '/super-admin/verifications'
    },
    {
      label: 'Activity Logs',
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: '/super-admin/activity-logs'
    },
    {
      label: 'Settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: '/super-admin/settings'
    }

  ]

  const adminMenuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      href: '/admin/dashboard'
    },
    {
      label: 'Students',
      icon: <GraduationCap className="h-4 w-4 mr-2" />,
      href: '/admin/students'
    },
    {
      label: 'Companies',
      icon: <Building2 className="h-4 w-4 mr-2" />,
      href: '/admin/companies'
    },
    {
      label: 'Verifications',
      icon: <ClipboardCheck className="h-4 w-4 mr-2" />,
      href: '/admin/verifications'
    },
    {
      label: 'Activity Logs',
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: '/admin/activity-logs'
    }
  ]

  const studentMenuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      href: '/student/dashboard'
    },
    {
      label: 'Profile',
      icon: <User className="h-4 w-4 mr-2" />,
      href: '/student/profile'
    },
    {
      label: 'Personal Details',
      icon: <User className="h-4 w-4 mr-2" />,
      href: '/student/personal'
    },
    {
      label: 'Academic Details',
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      href: '/student/academic'
    },
    {
      label: 'Documents',
      icon: <FileText className="h-4 w-4 mr-2" />,
      href: '/student/documents'
    },
    {
      label: 'Experience',
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      href: '/student/experience'
    },
    {
      label: 'Applications',
      icon: <ScrollText className="h-4 w-4 mr-2" />,
      href: '/student/applications'
    },
    {
      label: 'Offers',
      icon: <Award className="h-4 w-4 mr-2" />,
      href: '/student/offers'
    }
  ]

  const companyMenuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      href: '/company/dashboard'
    },
    {
      label: 'Profile',
      icon: <Building className="h-4 w-4 mr-2" />,
      href: '/company/profile'
    },
    {
      label: 'Job Posts',
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      href: '/company/jobs'
    },
    {
      label: 'Applications',
      icon: <ScrollText className="h-4 w-4 mr-2" />,
      href: '/company/applications'
    },
    {
      label: 'Selected Students',
      icon: <CheckCircle className="h-4 w-4 mr-2" />,
      href: '/company/selected'
    }
  ]

  const getMenuItems = (role) => {
    switch (role?.toUpperCase()) {
      case 'SUPER_ADMIN':
        return superAdminMenuItems
      case 'ADMIN':
        return adminMenuItems
      case 'STUDENT':
        return studentMenuItems
      case 'COMPANY':
        return companyMenuItems
      default:
        return []
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <img src="https://www.nitp.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.00e5159e.png&w=256&q=75" alt="NITP Logo" className="h-8 w-8" />
              <span className="hidden font-bold lg:inline-block">Training & Placement Cell</span>
              <span className="font-bold lg:hidden">T&P Cell</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>About</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <ListItem href="/about" title="About Us">
                          Learn about the Training & Placement Cell
                        </ListItem>
                        <ListItem href="/team" title="Our Team">
                          Meet our dedicated team
                        </ListItem>
                        <ListItem href="/facilities" title="Facilities">
                          Infrastructure and facilities
                        </ListItem>
                        <ListItem href="/achievements" title="Achievements">
                          Our placement records
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>For Companies</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <ListItem href="/why-recruit" title="Why Recruit?">
                          Benefits of recruiting from NIT Patna
                        </ListItem>
                        <ListItem href="/procedure" title="Procedure">
                          Complete recruitment process
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/statistics" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Statistics
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/contact" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Contact
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image} alt={session.user.name} />
                      <AvatarFallback className="bg-red-600 text-white">
                        {userDetails.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userDetails.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userDetails.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {getMenuItems(session.user.role).map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-red-900 dark:text-red-500">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[70%] bg-gradient-to-b from-background via-red-900/50 to-red-950/50 dark:from-background dark:via-red-900/50 dark:to-red-950/50 border-l border-red-900/20">
                  <div className="flex flex-col h-full p-4">
                    {/* Header Logo Section */}
                    <div className="flex items-center gap-2 py-4 mb-6 border-b border-red-900/20">
                      <img 
                        src="https://www.nitp.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.00e5159e.png&w=256&q=75" 
                        alt="NITP Logo" 
                        className="h-8 w-8"
                      />
                      <span className="font-bold text-red-900 dark:text-red-500">T&P Cell</span>
                    </div>

                    {/* Navigation Menu */}
                    <div className="flex-1 overflow-y-auto">
                      <Accordion 
                        type="single" 
                        collapsible 
                        className="space-y-2"
                      >
                        <AccordionItem value="about" className="border-red-900/20">
                          <AccordionTrigger className="text-red-900 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 py-3">
                            About
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col space-y-1 pl-4">
                              {[
                                { href: '/about', label: 'About Us' },
                                { href: '/team', label: 'Our Team' },
                                { href: '/facilities', label: 'Facilities' },
                                { href: '/achievements', label: 'Achievements' }
                              ].map((item) => (
                                <Link 
                                  key={item.href}
                                  href={item.href} 
                                  className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500 py-3 px-4 rounded-md hover:bg-red-900/10 transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="companies" className="border-red-900/20">
                          <AccordionTrigger className="text-red-900 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 py-3">
                            For Companies
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col space-y-1 pl-4">
                              {[
                                { href: '/why-recruit', label: 'Why Recruit?' },
                                { href: '/procedure', label: 'Procedure' }
                              ].map((item) => (
                                <Link 
                                  key={item.href}
                                  href={item.href} 
                                  className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500 py-3 px-4 rounded-md hover:bg-red-900/10 transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <nav className="mt-4 space-y-1">
                        {[
                          { href: '/statistics', label: 'Statistics' },
                          { href: '/contact', label: 'Contact' }
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center text-red-900 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 py-3 px-4 rounded-md hover:bg-red-900/10 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </nav>
                    </div>

                    {/* Login Button for non-authenticated users */}
                    {!session && (
                      <div className="mt-auto pt-4 border-t border-red-900/20">
                        <Button 
                          className="w-full bg-red-900 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700"
                          asChild
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

const ListItem = ({ className, title, children, ...props }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
} 
export default Header;