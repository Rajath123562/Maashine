import { createClient } from '../app/lib/supabase/server'

interface NotificationPayload {
  userId: string;
  requestId?: string;
  type: string;
  title: string;
  message: string;
  sendEmail?: boolean;
  emailAddress?: string;
  sendWhatsapp?: boolean;
  whatsappNumber?: string;
}

export async function sendNotification({
  userId,
  requestId,
  type,
  title,
  message,
  sendEmail = false,
  emailAddress,
  sendWhatsapp = false,
  whatsappNumber
}: NotificationPayload) {
  const supabase = await createClient()

  // 1. Insert In-App Notification
  const { error: dbError } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      request_id: requestId,
      type,
      title,
      message,
      channel: 'in_app'
    })

  if (dbError) {
    console.error('Failed to create in-app notification:', dbError)
  }

  // 2. Send Email if requested and API key is present
  if (sendEmail && emailAddress && process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      await resend.emails.send({
        from: 'MaaShine Services <bookings@maashineservices.com>',
        to: emailAddress,
        subject: title,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
            <div style="background-color: #0d9488; padding: 20px; border-radius: 12px 12px 0 0;">
              <h2 style="color: white; margin: 0;">MaaShine Updates</h2>
            </div>
            <div style="padding: 30px 20px; background-color: white; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
              <h3 style="color: #0f172a; margin-top: 0;">${title}</h3>
              <p style="color: #475569; line-height: 1.6;">${message}</p>
              ${requestId ? `
                <div style="margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://maashineservices.com'}/my-requests/${requestId}" 
                     style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    View Booking Details
                  </a>
                </div>
              ` : ''}
            </div>
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} MaaShine Services. All rights reserved.
            </p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
    }
  }

  // 3. WhatsApp Integration (Architecture Scaffolding)
  if (sendWhatsapp && whatsappNumber) {
    // TODO: Integrate WhatsApp Business API / Twilio
    // Example:
    // try {
    //   await twilioClient.messages.create({
    //     body: message,
    //     from: process.env.TWILIO_WHATSAPP_NUMBER,
    //     to: \`whatsapp:\${whatsappNumber}\`
    //   })
    // } catch (waError) {
    //   console.error('Failed to send WhatsApp notification:', waError)
    // }
    console.log(`[Scaffolding] Would send WhatsApp to ${whatsappNumber}: ${title}`)
  }
}
