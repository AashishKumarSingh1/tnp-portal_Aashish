import nodemailer from 'nodemailer'
import { db } from '@/lib/db'
import { executeQuery } from '@/lib/db'

// Function to get SMTP settings from database
async function getSmtpSettings() {
  try {
    const settings = await executeQuery({
      query: 'SELECT * FROM system_settings ORDER BY id DESC LIMIT 1'
    })
    
    if (!settings || !settings[0]) {
      throw new Error('SMTP settings not found')
    }

    // Get the first row since executeQuery returns an array
    const smtpConfig = settings[0]
    
    return {
      host: smtpConfig.smtp_host,
      port: parseInt(smtpConfig.smtp_port), // Ensure port is a number
      secure: Boolean(smtpConfig.smtp_secure), // Convert to boolean
      auth: {
        user: smtpConfig.smtp_user,
        pass: smtpConfig.smtp_pass
      },
      from: smtpConfig.smtp_from
    }
  } catch (error) {
    console.error('Error fetching SMTP settings:', error)
    throw error
  }
}

// Create transporter with settings from database
async function createTransporter() {
  const settings = await getSmtpSettings()
  
  // Log settings for debugging (remove in production)
  console.log('SMTP Settings:', {
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: { user: settings.auth.user }
  })

  const transporter = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: settings.auth,
    // Add these options for better error handling
    tls: {
      rejectUnauthorized: false // Don't fail on invalid certs
    },
    debug: true // Enable debug logs
  })

  // Verify connection configuration
  try {
    await transporter.verify()
    console.log('SMTP connection verified successfully')
  } catch (error) {
    console.error('SMTP connection verification failed:', error)
    throw error
  }

  return transporter
}

export async function sendOTP(email, otp, type = 'registration') {
  const subject = type === 'registration' 
    ? 'Verify your email - TNP Cell NIT Patna'
    : 'Password Reset OTP - TNP Cell NIT Patna'

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">TNP Cell - NIT Patna</h2>
      <p>Hello,</p>
      <p>Your ${type === 'registration' ? 'verification' : 'password reset'} OTP is:</p>
      <h1 style="color: #be123c; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
      <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #666; font-size: 12px;">
        This is an automated email from Training & Placement Cell, NIT Patna.
        Please do not reply to this email.
      </p>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: email,
      subject,
      html
    })
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function sendWelcomeEmail(email, name, role) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Welcome to TNP Cell - NIT Patna</h2>
      <p>Hello ${name},</p>
      <p>Your account has been successfully created as a ${role}.</p>
      <p>You can now login to access your dashboard and features.</p>
      <p style="margin-top: 20px;">Best regards,<br />Training & Placement Cell<br />NIT Patna</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #666; font-size: 12px;">
        This is an automated email from Training & Placement Cell, NIT Patna.
        Please do not reply to this email.
      </p>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: email,
      subject: 'Welcome to TNP Cell - NIT Patna',
      html
    })
    return true
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return false
  }
}

export async function sendVerificationConfirmationEmail(email, name) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">TNP Cell - NIT Patna</h2>
      <p>Hello ${name},</p>
      <p>Congratulations! Your account has been successfully verified by the admin.</p>
      <p>You can now access all features of the TNP portal including:</p>
      <ul style="color: #444; margin: 20px 0; padding-left: 20px;">
        <li>View and apply for job opportunities</li>
        <li>Access placement resources</li>
        <li>Update your profile</li>
        <li>Track your applications</li>
      </ul>
      <p>Login to your account to get started!</p>
      <p style="margin-top: 20px;">Best regards,<br />Training & Placement Cell<br />NIT Patna</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #666; font-size: 12px;">
        This is an automated email from Training & Placement Cell, NIT Patna.
        Please do not reply to this email.
      </p>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: email,
      subject: 'Account Verified - TNP Cell NIT Patna',
      html
    })
    return true
  } catch (error) {
    console.error('Error sending verification confirmation email:', error)
    return false
  }
}

export async function sendCompanyVerificationEmail(email, companyName) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">TNP Cell - NIT Patna</h2>
      <p>Dear ${companyName},</p>
      <p>Congratulations! Your company account has been successfully verified by our admin team.</p>
      <p>You can now access all features of the TNP portal including:</p>
      <ul style="color: #444; margin: 20px 0; padding-left: 20px;">
        <li>Post job opportunities</li>
        <li>View student profiles</li>
        <li>Manage applications</li>
        <li>Schedule campus drives</li>
      </ul>
      <p>Login to your account to get started!</p>
      <p style="margin-top: 20px;">Best regards,<br />Training & Placement Cell<br />NIT Patna</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #666; font-size: 12px;">
        This is an automated email from Training & Placement Cell, NIT Patna.
        Please do not reply to this email.
      </p>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: email,
      subject: 'Company Account Verified - TNP Cell NIT Patna',
      html
    })
    return true
  } catch (error) {
    console.error('Error sending company verification email:', error)
    return false
  }
}

export async function sendCompanyRejectionEmail(email, companyName) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">TNP Cell - NIT Patna</h2>
      <p>Dear ${companyName},</p>
      <p>We regret to inform you that your company account verification request has been rejected.</p>
      <p>If you believe this is an error or would like to provide additional information, please:</p>
      <ol style="color: #444; margin: 20px 0; padding-left: 20px;">
        <li>Contact us at tnp@nitp.ac.in</li>
        <li>Include your company details and registration information</li>
        <li>Provide any supporting documentation</li>
      </ol>
      <p>Our team will review your case and get back to you as soon as possible.</p>
      <p style="margin-top: 20px;">Best regards,<br />Training & Placement Cell<br />NIT Patna</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #666; font-size: 12px;">
        This is an automated email from Training & Placement Cell, NIT Patna.
        For immediate assistance, please email tnp@nitp.ac.in
      </p>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: email,
      subject: 'Company Account Verification Update - TNP Cell NIT Patna',
      html
    })
    return true
  } catch (error) {
    console.error('Error sending company rejection email:', error)
    return false
  }
}

export async function sendTestMail(email) {
  const html = `
    <h1>Test Email from TNP Cell</h1>
    <p>This is a test email from TNP Cell. If you received this email, your SMTP settings are working correctly.</p>
    <p>Sent at: ${new Date().toLocaleString()}</p>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: email,
      subject: 'Test Email - TNP Cell NIT Patna',
      html
    })
    return true
  } catch (error) {
    console.error('Error sending test email:', error)
    throw error
  }
}

export async function sendContactFormEmail(name, email, subject, message) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">New Contact Form Submission</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #666; font-size: 12px;">
        This message was sent from the TNP Cell contact form.
      </p>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: 'kumarashish98526@gmail.com', // Admin email address
      subject: `Contact Form: ${subject}`,
      html
    })
    return true
  } catch (error) {
    console.error('Error sending contact form email:', error)
    throw error
  }
}

export async function sendContactConfirmationEmail(email, name) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Thank You for Contacting Us</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>This is an automated response confirming the receipt of your message.</p>
      <p style="margin-top: 20px;">Best regards,<br />Training & Placement Cell<br />NIT Patna</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #666; font-size: 12px;">
        This is an automated email from Training & Placement Cell, NIT Patna.
        Please do not reply to this email.
      </p>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: email,
      subject: 'Thank You for Contacting TNP Cell - NIT Patna',
      html
    })
    return true
  } catch (error) {
    console.error('Error sending contact confirmation email:', error)
    throw error
  }
} 