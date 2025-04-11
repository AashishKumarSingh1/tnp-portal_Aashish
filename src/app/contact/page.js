'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { toast } from 'sonner'



export default function ContactPage() {
 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      toast.success('Message sent successfully! We will get back to you soon.')
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Contact Us</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Get in touch with the Training & Placement Cell at NIT Patna
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Cards */}
              <Card className="p-6 hover-card">
                <Mail className="w-8 h-8 text-red-900 dark:text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <a href="mailto:placement@nitp.ac.in" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                placement@nitp.ac.in
                </a>
                <a href="mailto:tnplacement@nitp.ac.in" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                tnp@nitp.ac.in
                </a>
              </Card>
              
              <Card className="p-6 hover-card">
                <Phone className="w-8 h-8 text-red-900 dark:text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <a href="tel:+916122371715" className="text-muted-foreground hover:text-red-900 dark:hover:text-red-500">
                  +91-612-2371715
                </a>
                <p className="text-muted-foreground">
                ext. no. 191
                </p>
              </Card>
              
              <Card className="p-6 hover-card">
                <MapPin className="w-8 h-8 text-red-900 dark:text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-muted-foreground">
                  NIT Patna, Ashok Rajpath,<br />
                  Patna, Bihar - 800005
                </p>
              </Card>
              
              <Card className="p-6 hover-card">
                <Clock className="w-8 h-8 text-red-900 dark:text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Office Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Friday<br />
                  8:30 AM - 5:30 PM
                </p>
              </Card>
            </div>

            {/* Updated Contact Form */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">
                      Name*
                    </label>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name" 
                      className="border-red-900/20 focus:border-red-900/40"
                      required 
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">
                      Email*
                    </label>
                    <Input 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email" 
                      className="border-red-900/20 focus:border-red-900/40"
                      required 
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">
                    Subject*
                  </label>
                  <Input 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Message subject" 
                    className="border-red-900/20 focus:border-red-900/40"
                    required 
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">
                    Message*
                  </label>
                  <Textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message" 
                    className="min-h-[150px] border-red-900/20 focus:border-red-900/40"
                    required 
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-red-900 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.565983221875!2d85.16716188022367!3d25.619334556328614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58dcce432585%3A0xcd5720acbdc65a5f!2sTraining%20and%20Placement%20Cell%2C%20NIT%20Patna!5e0!3m2!1sen!2sin!4v1741682111175!5m2!1sen!2sin" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">How to Reach</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 2 km from Patna Junction Railway Station</li>
                  <li>• 5 km from Patna Airport</li>
                  <li>• Well connected by city bus services</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 