import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-red-950/10 dark:from-background dark:to-red-950/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/procedure" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                  Procedure
                </Link>
              </li>
              <li>
                <Link href="/statistics" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                  Statistics
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                  Achievements
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-500">For Companies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/why-recruit" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500 transition-colors">
                  Why Recruit?
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-500">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-900 dark:text-red-500 mt-1" />
                <span className="text-muted-foreground">
                  Training & Placement Cell<br />
                  NIT Patna, Ashok Rajpath<br />
                  Patna, Bihar - 800005
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-900 dark:text-red-500" />
                <a href="tel:+916123456789" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                  +91-612-345-6789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-900 dark:text-red-500" />
                <a href="mailto:tnp@nitp.ac.in" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                  tnp@nitp.ac.in
                </a>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-500">Location</h3>
            <div className="rounded-lg overflow-hidden h-[200px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.565983221875!2d85.16716188022367!3d25.619334556328614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58dcce432585%3A0xcd5720acbdc65a5f!2sTraining%20and%20Placement%20Cell%2C%20NIT%20Patna!5e0!3m2!1sen!2sin!4v1741682111175!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-red-900/10 dark:border-red-900/20 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Training & Placement Cell, NIT Patna. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 