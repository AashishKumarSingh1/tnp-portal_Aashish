import nodemailer from 'nodemailer'
import { db } from '@/lib/db'
import { executeQuery } from '@/lib/db'


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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">TNP Cell - NIT Patna</h2>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Hello,</p>
      
      <p style="color: #333; line-height: 1.6;">Your ${type === 'registration' ? 'verification' : 'password reset'} OTP is:</p>
      
      <div style="background-color: #f0e6e6; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; border-left: 4px solid #8B3A3A;">
        <h1 style="color: #8B3A3A; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      
      <p style="color: #333; line-height: 1.6;">This OTP will expire in 10 minutes.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          Please do not reply to this email. If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Welcome to TNP Cell - NIT Patna</h2>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Hello ${name},</p>
      
      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          Your account has been successfully created as a <strong>${role}</strong>.
        </p>
      </div>
      
      <p style="color: #333; line-height: 1.6;">You can now login to access your dashboard and features.</p>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          Please do not reply to this email. If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Account Verified - TNP Cell NIT Patna</h2>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Hello ${name},</p>
      
      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          Congratulations! Your account has been successfully verified by the admin.
        </p>
      </div>
      
      <p style="color: #333; line-height: 1.6;">You can now access all features of the TNP portal including:</p>
      
      <ul style="color: #444; margin: 20px 0; padding-left: 20px; line-height: 1.6;">
        <li>View and apply for job opportunities</li>
        <li>Access placement resources</li>
        <li>Update your profile</li>
        <li>Track your applications</li>
      </ul>
      
      <p style="color: #333; line-height: 1.6;">Login to your account to get started!</p>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          Please do not reply to this email. If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
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

export async function sendVerificationRejectionEmail(email, name, roll_number) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">  
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Account Verification Rejected - TNP Cell NIT Patna</h2>
      </div>

      <p style="color: #333; line-height: 1.6;">Dear ${name},</p>

      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          We regret to inform you that your account verification request has been rejected.
        </p>
      </div>

      <p style="color: #333; line-height: 1.6;">Your roll number is ${roll_number}.</p>

      <p style="color: #333; line-height: 1.6;">If you have any questions or need further assistance, please contact us at tnp@nitp.ac.in.</p>

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;"> 
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          Please do not reply to this email. If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
    </div>
  `
  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: email,
      subject: 'Account Verification Rejected - TNP Cell NIT Patna',
      html
    })
    return true
  } catch (error) {
    console.error('Error sending verification rejection email:', error)
    return false
  }
}

export async function sendCompanyVerificationEmail(email, companyName) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Company Account Verified - TNP Cell NIT Patna</h2>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Dear ${companyName},</p>
      
      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          Congratulations! Your company account has been successfully verified by our admin team.
        </p>
      </div>
      
      <p style="color: #333; line-height: 1.6;">You can now access all features of the TNP portal including:</p>
      
      <ul style="color: #444; margin: 20px 0; padding-left: 20px; line-height: 1.6;">
        <li>Post job opportunities</li>
        <li>View student profiles</li>
        <li>Manage applications</li>
        <li>Schedule campus drives</li>
      </ul>
      
      <p style="color: #333; line-height: 1.6;">Login to your account to get started!</p>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          Please do not reply to this email. If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Company Verification Update - TNP Cell NIT Patna</h2>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Dear ${companyName},</p>
      
      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          We regret to inform you that your company account verification request has been rejected.
        </p>
      </div>
      
      <p style="color: #333; line-height: 1.6;">If you believe this is an error or would like to provide additional information, please:</p>
      
      <ol style="color: #444; margin: 20px 0; padding-left: 20px; line-height: 1.6;">
        <li>Contact us at tpc.tnp@nitp.ac.in</li>
        <li>Include your company details and registration information</li>
        <li>Provide any supporting documentation</li>
      </ol>
      
      <p style="color: #333; line-height: 1.6;">Our team will review your case and get back to you as soon as possible.</p>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          For immediate assistance, please email tpc.tnp@nitp.ac.in<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Test Email from TNP Cell</h2>
      </div>
      
      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          This is a test email from TNP Cell. If you received this email, your SMTP settings are working correctly.
        </p>
      </div>
      
      <p style="color: #333; line-height: 1.6;">🕒 Sent on ${new Date().toLocaleString()}</p>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
    </div>
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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">New Contact Form Submission</h2>
      </div>
      
      <div style="background-color: #f0e6e6; padding: 20px; border-radius: 5px; border-left: 4px solid #8B3A3A; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <tr>
                <td style="padding: 5px 0; width: 80px; color: #5a3e36; font-weight: 600;">From:</td>
                <td style="padding: 5px 0; color: #333;">${name}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0; color: #5a3e36; font-weight: 600;">Email:</td>
                <td style="padding: 5px 0; color: #333;">${email}</td>
            </tr>
            <tr>
                <td style="padding: 5px 0; color: #5a3e36; font-weight: 600;">Subject:</td>
                <td style="padding: 5px 0; color: #333;">${subject}</td>
            </tr>
        </table>
        
        <h3 style="color: #8B3A3A; margin: 15px 0 10px 0; font-size: 16px;">Message:</h3>
        <div style="background-color: #fff; padding: 12px; border-radius: 4px; border: 1px solid #e0d6cc;">
            <p style="margin: 0; color: #333; line-height: 1.5; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This message was sent from the TNP Cell contact form at NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: `${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Thank You for Contacting Us</h2>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Dear ${name},</p>
      
      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          We have received your message and will get back to you as soon as possible.
        </p>
      </div>
      
      <p style="color: #555; line-height: 1.6; font-size: 14px;">
        This is an automated response confirming the receipt of your message.
      </p>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          Please do not reply to this email. If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
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

export async function sendJAFNotificationEmail(companyName) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">New JAF Submission - TNP Cell NIT Patna</h2>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Dear Admin,</p>
      
      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          A new Job Announcement Form has been submitted by <strong>${companyName}</strong>.
        </p>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Please review the submission in the admin dashboard at your earliest convenience.</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="${process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL}" style="background-color: #8B3A3A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block;">
          Go to Admin Dashboard
        </a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated notification from Training & Placement Cell, NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      subject: `New JAF Submission - ${companyName}`,
      html
    })
    return true
  } catch (error) {
    console.error('Error sending JAF notification email:', error)
    return false
  }
}
export async function sendJAFStatusUpdateEmail(companyName, status, companyEmail) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">JAF Status Update - TNP Cell NIT Patna</h2>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Dear ${companyName},</p>
      
      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          We are pleased to inform you that your Job Announcement Form has been ${status.toLowerCase()}.
        </p>
      </div>
      
      <p style="color: #333; line-height: 1.6;">Please review the status in the admin dashboard at your earliest convenience.</p> 
      
      <div style="text-align: center; margin: 25px 0;">
        <a  style="background-color: #8B3A3A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block;">
          Go to Admin Dashboard
        </a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: `${companyEmail}`,
      subject: `JAF Status Update - ${companyName}`,
      html
    })
    
    return true
  } catch (error) {
    console.error('Error sending JAF status update email:', error)
    return false
  }
}


export async function sendStudentWelcomeEmail(email, name, email_to) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Welcome to TNP Cell NIT Patna</h2>
      </div>

      <p style="color: #333; line-height: 1.6;">Dear ${name},</p>

      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          Welcome to the TNP Cell at NIT Patna! We're excited to have you on board. 
          We have received your registration request and are currently reviewing it.
          Once your account is verified, you will receive another confirmation email.
        </p>
      </div>

      <p style="color: #333; line-height: 1.6;">
        Please use the following credentials to log in to your account: 
        Email: ${email_to}
        Password: your password
      </p>

      <p style="color: #333; line-height: 1.6;">
        Please use the following link to log in to your account:  
        ${process.env.NEXT_PUBLIC_APP_URL}
      </p>

      <p style="color: #333; line-height: 1.6;">
        Thank you for joining the TNP Cell at NIT Patna! We look forward to helping you find the perfect opportunities.
      </p>  

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>  

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP". 
        </p>
      </div>
    </div>
  `

  try { 
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: email_to,
      subject: 'Welcome to TNP Cell NIT Patna',
      html
    })
    
    return true
  } catch (error) {
    console.error('Error sending student welcome email:', error)
    return false
  }
}

export async function sendCompanyWelcomeEmail(email, name, email_to) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Welcome to TNP Cell NIT Patna</h2>
      </div>

      <p style="color: #333; line-height: 1.6;">Dear ${name},</p>

      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;"> 
          Welcome to the TNP Cell at NIT Patna! We're excited to have you on board.
          We have received your registration request and are currently reviewing it.
          Once your account is verified, you will receive another confirmation email.
        </p>
      </div>

      <p style="color: #333; line-height: 1.6;">
        Please use the following credentials to log in to your account: 
        Email: ${email_to}
        Password: your password
      </p>

      <p style="color: #333; line-height: 1.6;">  
        Please use the following link to log in to your account:  
        ${process.env.NEXT_PUBLIC_APP_URL}
      </p>

      <p style="color: #333; line-height: 1.6;">
        Thank you for joining the TNP Cell at NIT Patna! We look forward to helping you find the perfect opportunities.
      </p>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,  
      to: email_to,
      subject: 'Welcome to TNP Cell NIT Patna',
      html
    })
    
    return true
  } catch (error) {
    console.error('Error sending company welcome email:', error)
    return false
  }
}

export async function sendAccountStatusEmail(user, isActive, reason = '') {
  const subject = isActive 
    ? 'Your TNP Portal Account Has Been Reactivated'
    : 'Your TNP Portal Account Has Been Deactivated'

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">
          ${isActive ? 'Account Reactivated' : 'Account Deactivated'}
        </h2>
      </div>
      
      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          Dear ${user.name},
          ${isActive 
            ? `Your TNP Portal account has been reactivated. You can now log in and access all portal features.` 
            : `Your TNP Portal account has been deactivated for the following reason:`
          }
        </p>
        ${!isActive ? `
          <div style="margin-top: 15px; padding: 10px; background: #fff; border-left: 4px solid #f44336;">
            <strong>${reason}</strong>
          </div>
          <p style="color: #333; margin-top: 15px; line-height: 1.6;">
            To reactivate your account, please contact us at office.tnp@nitp.ac.in with your details.
          </p>
        ` : ''}
      </div>

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated message from Training & Placement Cell, NIT Patna.<br>
          Please do not reply to this email. If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()
    
    await transporter.sendMail({
      from: settings.from,
      to: user.email,
      subject,
      html
    })
    return true
  } catch (error) {
    console.error('Failed to send account status email:', error)
    return false
  }
}

export async function sendApplicationSubmittedEmail(studentData, jobData) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Application Submitted</h2>
      </div>

      <p style="color: #333; line-height: 1.6;">Dear ${studentData.name},</p>

      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          Your application for the position of ${jobData.job_profile} at ${jobData.company_name} has been submitted successfully.
        </p>
      </div>  

      <p style="color: #333; line-height: 1.6;">
        We will notify you of any updates regarding your application status.
      </p>

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>  
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()

    await transporter.sendMail({
      from: settings.from,
      to: studentData.email,
      subject: 'Application Submitted',
      html
    })
    
    return true
  } catch (error) {
    console.error('Error sending application submitted email:', error)
    return false
  }
}

export async function sendApplicationStatusUpdateEmail(studentData, jobData, status) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Application Status Update</h2>
      </div>

      <p style="color: #333; line-height: 1.6;">Dear ${studentData.name},</p>

      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          Your application for the position of ${jobData.job_profile} at ${jobData.company_name} has been updated to ${status}.
        </p>
      </div>  

      <p style="color: #333; line-height: 1.6;">
        We will notify you of any updates regarding your application status.
      </p>
      
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()   

    await transporter.sendMail({
      from: settings.from,
      to: studentData.email,
      subject: 'Application Status Update',
      html
    })

    return true
  } catch (error) {
    console.error('Error sending application status update email:', error)
    return false
  }
} 

export async function sendApplicationRejectedEmail(studentData, jobData) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Application Rejected</h2>
      </div>

      <p style="color: #333; line-height: 1.6;">Dear ${studentData.name},</p>

      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          Your application for the position of ${jobData.job_profile} at ${jobData.company_name} has been rejected.
        </p>
      </div>  

      <p style="color: #333; line-height: 1.6;">
        We will notify you of any updates regarding your application status.
      </p>

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br>
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>  
    </div>
  `

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter() 

    await transporter.sendMail({
      from: settings.from,
      to: studentData.email,
      subject: 'Application Rejected',
      html
    })  

    return true
  } catch (error) {
    console.error('Error sending application rejected email:', error)
    return false
  }
}

export async function sendApplicationShortlistedEmail(studentData, jobData) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f5f0; padding: 25px; border-radius: 8px; border: 1px solid #e0d6cc;">
      <div style="border-bottom: 2px solid #8B3A3A; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #8B3A3A; margin: 0; font-weight: 600;">Application Shortlisted</h2>
      </div>

      <p style="color: #333; line-height: 1.6;">Dear ${studentData.name},</p>

      <div style="background-color: #f0e6e6; padding: 15px; border-left: 4px solid #8B3A3A; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <p style="color: #333; margin: 0; line-height: 1.6;">
          Your application for the position of ${jobData.job_profile} at ${jobData.company_name} has been shortlisted.
        </p>
      </div>  

      <p style="color: #333; line-height: 1.6;">
        We will notify you of any updates regarding your application status.
      </p>

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #8B3A3A; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #333; margin: 0; font-weight: 500;">Training & Placement Cell</p>  
        <p style="color: #8B3A3A; margin: 0; font-weight: 500;">NIT Patna</p>
      </div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0d6cc;">
        <p style="color: #777; font-size: 11px; line-height: 1.4; font-style: italic;">
          🕒 Sent on ${new Date().toLocaleString()}<br> 
          This is an automated email from Training & Placement Cell, NIT Patna.<br>
          If you think this email isn't intended for you, please reply with "STOP".
        </p>
      </div>
    </div>
  `   

  try {
    const settings = await getSmtpSettings()
    const transporter = await createTransporter()

    await transporter.sendMail({
      from: settings.from,
      to: studentData.email,
      subject: 'Application Shortlisted',
      html
    })

    return true
  } catch (error) {
    console.error('Error sending application shortlisted email:', error)
    return false
  }
}
